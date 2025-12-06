import { GoogleGenAI } from "@google/genai";
import { AnalysisResponse, InterviewMode, AnalysisLanguage } from "../types";
import { SYSTEM_INSTRUCTION, getIndustryPrompt, getLanguagePrompt } from "../constants";

// ============================================
// CONSISTENCY SYSTEM - Caching & Determinism
// ============================================

// Cache to store analysis results for consistent responses
interface CacheEntry {
  result: AnalysisResponse;
  timestamp: number;
  fileHash: string;
  mode: InterviewMode;
  language: AnalysisLanguage;
}

// In-memory cache (persists during session)
const analysisCache = new Map<string, CacheEntry>();

// Cache expiry time (24 hours in milliseconds)
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

// Generate a unique hash for the video file
const generateFileHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.substring(0, 32); // First 32 chars for efficiency
};

// Generate cache key combining file hash + mode + language
const getCacheKey = (fileHash: string, mode: InterviewMode, language: AnalysisLanguage): string => {
  return `${fileHash}_${mode}_${language}`;
};

// Check if cached result is valid
const getFromCache = (cacheKey: string): AnalysisResponse | null => {
  const entry = analysisCache.get(cacheKey);
  if (!entry) return null;
  
  // Check if cache has expired
  if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
    analysisCache.delete(cacheKey);
    return null;
  }
  
  console.log('📦 Using cached analysis result for consistency');
  return entry.result;
};

// Save result to cache
const saveToCache = (
  cacheKey: string, 
  fileHash: string, 
  result: AnalysisResponse, 
  mode: InterviewMode, 
  language: AnalysisLanguage
): void => {
  analysisCache.set(cacheKey, {
    result,
    timestamp: Date.now(),
    fileHash,
    mode,
    language
  });
  console.log('💾 Analysis result cached for future consistency');
};

// Clear cache for a specific file or all
export const clearAnalysisCache = (fileHash?: string): void => {
  if (fileHash) {
    for (const [key] of analysisCache) {
      if (key.startsWith(fileHash)) {
        analysisCache.delete(key);
      }
    }
  } else {
    analysisCache.clear();
  }
  console.log('🗑️ Analysis cache cleared');
};

const getFileBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

export interface AnalysisOptions {
  mode: InterviewMode;
  forceRefresh?: boolean; // Option to bypass cache
}

export const analyzeInterviewVideo = async (
  file: File, 
  options: AnalysisOptions = { mode: 'general', forceRefresh: false }
): Promise<AnalysisResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is missing.");
  }

  // Generate file hash for caching - now only based on file + mode (language is auto-detected)
  const fileHash = await generateFileHash(file);
  const cacheKey = `${fileHash}_${options.mode}`;
  
  // Check cache first (unless force refresh is requested)
  if (!options.forceRefresh) {
    const cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Convert file to base64
  const base64Data = await getFileBase64(file);

  // Build dynamic system instruction based on mode
  // Language detection is now automatic - AI will detect from video
  const industryPrompt = getIndustryPrompt(options.mode);
  
  // Enhanced system instruction with auto language detection
  const fullSystemInstruction = `${SYSTEM_INSTRUCTION}

${industryPrompt}

## CRITICAL: AUTOMATIC LANGUAGE DETECTION & RESPONSE

You MUST:
1. **DETECT the language(s) spoken in the video automatically** - This includes mixed languages like Hindi-English (Hinglish), Spanish-English (Spanglish), etc.
2. **Identify all languages used** and report them in the response under "detectedLanguages" field
3. **The analysis feedback should be written in the PRIMARY language detected in the video**
   - If the candidate speaks mostly Hindi with some English, write feedback in Hindi
   - If the candidate speaks mostly English with some Hindi words, write feedback in English
   - If equally mixed, prefer the language used for important content/answers

4. **Language Detection Examples:**
   - Pure English → Respond in English
   - Pure Hindi → Respond in Hindi (हिंदी में जवाब दें)
   - Hindi-English Mix (Hinglish) → Respond in the dominant language
   - Any other language → Respond in that language

5. **Add a "detectedLanguages" field in your JSON response** with format:
   "detectedLanguages": {
     "primary": "Hindi",
     "secondary": ["English"],
     "confidence": 0.85,
     "notes": "Candidate uses Hinglish - Hindi with English technical terms"
   }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          {
            text: `Analyze this interview response video. 
            
Interview Mode: ${options.mode.toUpperCase()}

IMPORTANT INSTRUCTIONS:
1. First, DETECT what language(s) the candidate is speaking (could be mixed like Hindi-English)
2. Provide your analysis feedback in the SAME language the candidate primarily uses
3. If they speak Hindi, respond in Hindi. If English, respond in English. If mixed, use the dominant one.
4. Include a "detectedLanguages" field in your JSON response

Follow the system instructions carefully and provide consistent, deterministic scoring.`
          }
        ]
      },
      config: {
        systemInstruction: fullSystemInstruction,
        responseMimeType: "application/json",
        // CRITICAL: Temperature = 0 for deterministic/consistent outputs
        temperature: 0,
        topP: 1,
        topK: 1,
      }
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini.");
    }

    const parsedResponse = JSON.parse(response.text) as AnalysisResponse;
    
    // Cache the result for consistency
    saveToCache(cacheKey, fileHash, parsedResponse, options.mode, 'auto' as AnalysisLanguage);
    
    return parsedResponse;

  } catch (error) {
    console.error("Error analyzing video:", error);
    throw error;
  }
};