import { AnalysisResponse, InterviewMode, AnalysisLanguage, InterviewTarget } from "../types";
import { SYSTEM_INSTRUCTION, getIndustryPrompt, getLanguagePrompt, getTargetPrompt } from "../constants";

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
  target?: InterviewTarget; // Audience/role tailoring (faang, startup, manager)
  depth?: 'quick' | 'standard' | 'deep'; // Quick = fast summary, Standard = balanced, Deep = line-by-line detailed
  onProgress?: (stage: string, percent: number) => void; // Progress callback
}

// Helper function to repair truncated JSON
const repairTruncatedJSON = (text: string): string => {
  let json = text.trim();
  
  // Count open brackets
  const openBraces = (json.match(/{/g) || []).length;
  const closeBraces = (json.match(/}/g) || []).length;
  const openBrackets = (json.match(/\[/g) || []).length;
  const closeBrackets = (json.match(/]/g) || []).length;
  
  // If string is truncated mid-value, try to find last complete property
  if (openBraces > closeBraces || openBrackets > closeBrackets) {
    // Remove trailing incomplete content after last comma or colon
    json = json.replace(/,\s*"[^"]*"?\s*:?\s*[^,}\]]*$/, '');
    json = json.replace(/,\s*$/, '');
    json = json.replace(/:\s*"[^"]*$/, ': ""');
    json = json.replace(/:\s*[0-9.]*$/, ': 0');
    
    // Close all open brackets and braces
    for (let i = 0; i < openBrackets - closeBrackets; i++) {
      json += ']';
    }
    for (let i = 0; i < openBraces - closeBraces; i++) {
      json += '}';
    }
  }
  
  return json;
};

// Safe JSON parse with repair attempt
const safeJSONParse = (text: string): any => {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.warn('JSON parse failed, attempting repair...');
    try {
      const repaired = repairTruncatedJSON(text);
      return JSON.parse(repaired);
    } catch (e2) {
      console.error('JSON repair failed:', e2);
      throw new Error('Failed to parse AI response. The response was incomplete. Please try again.');
    }
  }
};

export const analyzeInterviewVideo = async (
  file: File,
  options: AnalysisOptions = { mode: 'general', forceRefresh: false, target: 'general', depth: 'standard' }
): Promise<AnalysisResponse> => {
  const onProgress = options.onProgress || (() => {});
  
  onProgress('Preparing video...', 5);
  
  // Generate file hash for caching - now only based on file + mode (language is auto-detected)
  const fileHash = await generateFileHash(file);
  const cacheKey = `${fileHash}_${options.mode}_${options.target || 'general'}_${options.depth || 'standard'}`;
  
  onProgress('Checking cache...', 10);
  
  // Check cache first (unless force refresh is requested)
  if (!options.forceRefresh) {
    const cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
      onProgress('Using cached result', 100);
      return cachedResult;
    }
  }

  onProgress('Converting video...', 15);

  // Convert file to base64 with chunking for large files
  const base64Data = await getFileBase64(file);
  
  onProgress('Uploading to AI...', 25);

  // Use backend proxy instead of client-side API key
  const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE) || 'http://localhost:5001';

  const postJson = async (path: string, body: any, maxRetries = 2) => {
    let attempt = 0;
    let lastErr: any = null;
    while (attempt <= maxRetries) {
      try {
        const res = await fetch(`${API_BASE}${path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (res.status === 429 || res.status === 503) {
          const retryAfter = res.headers.get('Retry-After');
          lastErr = new Error(`Proxy returned ${res.status}`);
          const backoff = retryAfter ? Number(retryAfter) * 1000 : 1000 * Math.pow(2, attempt) + Math.floor(Math.random() * 500);
          await new Promise((r) => setTimeout(r, backoff));
          attempt += 1;
          continue;
        }
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Proxy error ${res.status}: ${txt}`);
        }
        return res.json();
      } catch (err: any) {
        lastErr = err;
        const backoff = 1000 * Math.pow(2, attempt) + Math.floor(Math.random() * 500);
        await new Promise((r) => setTimeout(r, backoff));
        attempt += 1;
      }
    }
    throw lastErr || new Error('Failed to post JSON to proxy');
  };

  // Standard job waiter
  const waitForJob = async (jobId: string) => {
    const url = `${API_BASE}/api/job/${jobId}`;
    let attempts = 0;
    while (attempts < 120) {
      attempts++;
      const res = await fetch(url);
      if (!res.ok) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      const j = await res.json();
      if (j.state === 'completed' && j.result) return j.result;
      if (j.state === 'failed') throw new Error('Analysis job failed');
      await new Promise((r) => setTimeout(r, 2000));
    }
    throw new Error('Job timed out');
  };

  // Enhanced job waiter with progress updates
  const waitForJobWithProgress = async (jobId: string, progressCb: (stage: string, percent: number) => void) => {
    const url = `${API_BASE}/api/job/${jobId}`;
    let attempts = 0;
    const maxAttempts = 180; // 6 minutes max
    
    while (attempts < maxAttempts) {
      attempts++;
      
      // Update progress based on attempts (55-90% range during waiting)
      const waitProgress = Math.min(90, 55 + Math.floor((attempts / maxAttempts) * 35));
      
      if (attempts % 5 === 0) {
        const messages = [
          'Analyzing video content...',
          'Processing facial expressions...',
          'Evaluating voice patterns...',
          'Scoring body language...',
          'Generating detailed feedback...',
          'Building transcript breakdown...',
          'Calculating scores...',
          'Finalizing analysis...'
        ];
        const msgIndex = Math.min(Math.floor(attempts / 8), messages.length - 1);
        progressCb(messages[msgIndex], waitProgress);
      }
      
      try {
        const res = await fetch(url);
        if (!res.ok) {
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }
        const j = await res.json();
        if (j.state === 'completed' && j.result) return j.result;
        if (j.state === 'failed') throw new Error('Analysis job failed');
        await new Promise((r) => setTimeout(r, 2000));
      } catch (e) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
    throw new Error('Job timed out - please try with a shorter video or Quick analysis mode');
  };

  // Build dynamic system instruction based on mode
  // Language detection is now automatic - AI will detect from video
  const industryPrompt = getIndustryPrompt(options.mode);
  
  // Enhanced system instruction with auto language detection and target-specific guidance
  const targetPrompt = getTargetPrompt(options.target || 'general');
  
  // Depth-based analysis instructions
  const depthInstructions = options.depth === 'deep' ? `
## DEEP ANALYSIS MODE - LINE BY LINE BREAKDOWN
Provide an extremely detailed analysis:
1. **Full Transcript**: Include complete "full_transcript" field with EVERYTHING spoken in the video word-for-word
2. **Transcript Breakdown**: Break down EVERY sentence spoken with timestamp and feedback in "transcript_breakdown" array
3. **Word Choice Analysis**: Analyze specific words used, suggest better alternatives
4. **Pause Analysis**: Note every significant pause and its impact
5. **Micro-Expression Timeline**: Second-by-second facial expression changes
6. **Voice Modulation Graph**: Pitch, pace, volume changes throughout
7. **Body Language Timeline**: Every gesture, posture shift with timestamp
8. **Improvement Scripts**: Provide rewritten versions of weak answers

REQUIRED FIELDS:
- "full_transcript": "Complete word-for-word transcript of everything spoken in the video"
- "transcript_breakdown": Array with objects containing:
  { timestamp: "0:00-0:15", original_text: "What they said", analysis: "Feedback on this part", improved_version: "Better way to say it", score: 8 }
` : options.depth === 'standard' ? `
## STANDARD ANALYSIS MODE
Provide balanced comprehensive analysis:
1. **Full Transcript**: Include "full_transcript" field with everything spoken in the video
2. Key moments with timestamps
3. Main strengths and weaknesses
4. Top 5 improvement areas with examples
5. Overall performance assessment

REQUIRED: Include "full_transcript" field with complete transcript of what was spoken.
` : `
## QUICK ANALYSIS MODE
Provide concise summary:
1. **Full Transcript**: Include "full_transcript" with what was spoken (summarized if long)
2. Overall score and 3 key metrics
3. Top 3 strengths
4. Top 3 areas to improve
5. One-paragraph executive summary

REQUIRED: Include "full_transcript" field.
`;

  const algorithmicRubric = `
## ANALYSIS ALGORITHM & SCORING RUBRIC
Use the following scoring algorithm to compute the overall score and category scores (0-100 for overall, 0-10 per category):

- contentQualityScore = normalize(25% weight, content metrics like STAR method adherence, specificity, metrics, and structure)
- communicationScore = normalize(20% weight, clarity, brevity, coherence)
- professionalPresenceScore = normalize(15% weight, gravitas, execution, composure)
- bodyLanguageScore = normalize(15% weight, eye contact, posture, gestures)
- emotionalIntelligenceScore = normalize(10% weight, empathy, self-awareness)
- authenticityScore = normalize(10% weight, congruence across channels)
- culturalFitScore = normalize(5% weight, role/industry specific alignment)

Combine these weights for overall_score (0-100). For FAANG target, weigh technical depth and problem solving more heavily and penalize vagueness.
`;
  const languageInstruction = `
## CRITICAL: AUTOMATIC LANGUAGE DETECTION & RESPONSE

You MUST:
1. **DETECT the language(s) spoken in the video automatically** - This includes mixed languages like Hinglish, Spanglish, etc.
2. **Identify all languages used** and report them in the response under "detectedLanguages" field
3. **Write feedback in the PRIMARY language detected in the video** as defined by percentage of words spoken in each language
`;

  const fullSystemInstruction = `${SYSTEM_INSTRUCTION}

${industryPrompt}

${depthInstructions}

${targetPrompt}

${algorithmicRubric}

${languageInstruction}`;

  try {
    onProgress('Configuring AI analysis...', 30);
    
    // Token limits based on depth - MAXIMUM to prevent truncation
    const tokenLimits = {
      quick: 8000,       // Fast but complete
      standard: 16000,   // Full analysis
      deep: 32000        // Maximum detail
    };
    
    const body = {
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: file.type, data: base64Data } },
          { text: `Analyze this interview response video.\n\nInterview Mode: ${options.mode.toUpperCase()}\nAnalysis Target: ${(options.target || 'general').toUpperCase()}\nAnalysis Depth: ${options.depth?.toUpperCase() || 'STANDARD'}\n\nFollow the system instructions and return ONLY a valid, complete JSON object with analysis including a detectedLanguages field. Provide timestamps for all key observations and calculate scores using the AI algorithm rubric.${options.depth === 'deep' ? ' Include full_transcript and transcript_breakdown array with line-by-line analysis.' : ' Include full_transcript field.'}\n\nIMPORTANT: Ensure the JSON response is complete and properly closed with all brackets.` }
        ]
      },
      config: {
        systemInstruction: fullSystemInstruction,
        responseMimeType: 'application/json',
        temperature: 0,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: tokenLimits[options.depth || 'standard']
      }
    };
    
    onProgress('Starting AI analysis...', 40);

    // Client-side concurrency control to reduce overload and quota hits
    const MAX_CONCURRENT_ANALYSES = Number((import.meta as any).env?.VITE_MAX_CONCURRENT_ANALYSES) || 1;
    const ANALYSIS_QUEUE_KEY = '__globalAnalysisQueue';
    if (!(window as any)[ANALYSIS_QUEUE_KEY]) {
      (window as any)[ANALYSIS_QUEUE_KEY] = { inProgress: 0, queue: [] as (() => void)[] };
    }
    const q = (window as any)[ANALYSIS_QUEUE_KEY];
    await new Promise((resolve) => {
      const tryRun = () => {
        if (q.inProgress < MAX_CONCURRENT_ANALYSES) {
          q.inProgress++;
          resolve(undefined);
        } else {
          q.queue.push(tryRun);
        }
      };
      tryRun();
    });
    try {
      onProgress('Queued for processing...', 45);
      
      // Use async mode for deep analysis to prevent timeout
      const useAsync = options.depth === 'deep' || file.size > 10 * 1024 * 1024; // 10MB+
      const sendBody = { ...body, async: useAsync };
      
      onProgress('Sending to AI...', 50);
      const response = await postJson('/api/generate', sendBody);
      
      q.inProgress--;
      if (q.queue.length) {
        const next = q.queue.shift();
        if (next) next();
      }
      
      // If async job was enqueued, wait for job completion with progress updates
      if (response && response.jobId) {
        onProgress('AI is analyzing (this may take 1-3 minutes)...', 55);
        
        // Enhanced job waiting with progress
        const jobResult = await waitForJobWithProgress(response.jobId, onProgress);
        if (!jobResult || !jobResult.text) throw new Error('No result from async job');
        
        onProgress('Parsing results...', 95);
        const parsedResponse = safeJSONParse(jobResult.text) as AnalysisResponse;
        saveToCache(cacheKey, fileHash, parsedResponse, options.mode, 'auto' as AnalysisLanguage);
        
        onProgress('Analysis complete!', 100);
        return parsedResponse;
      }
      
      onProgress('Processing response...', 85);
      if (!response || !response.text) throw new Error('No response from proxy/generator');
      
      onProgress('Parsing results...', 95);
      const parsedResponse = safeJSONParse(response.text) as AnalysisResponse;
      saveToCache(cacheKey, fileHash, parsedResponse, options.mode, 'auto' as AnalysisLanguage);
      
      onProgress('Analysis complete!', 100);
      return parsedResponse;
    } catch (err) {
      q.inProgress--;
      if (q.queue.length) {
        const next = q.queue.shift();
        if (next) next();
      }
      throw err;
    }

  } catch (error) {
    console.error("Error analyzing video:", error);
    throw error;
  }
};