import { ResumeAnalysis, InterviewTarget, InterviewMode } from "../types";
import { getIndustryPrompt, getTargetPrompt } from "../constants";

export interface ResumeOptions {
  mode?: InterviewMode;
  target?: InterviewTarget;
  depth?: 'quick' | 'standard' | 'deep'; // Quick = fast, Standard = balanced, Deep = line-by-line
  forceRefresh?: boolean;
  company?: string;
  onProgress?: (stage: string, percent: number) => void; // Progress callback
}

const resumeCache = new Map<string, { result: ResumeAnalysis; timestamp: number }>();
const RESUME_CACHE_EXPIRY = 24 * 60 * 60 * 1000;

const generateFileHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.substring(0, 32);
};

// =====================================================
// RESUME CHECKER SERVICE - AI-Powered Resume Analysis
// =====================================================

const RESUME_ANALYSIS_PROMPT = `You are APEX-7 Resume Analyzer, an expert ATS (Applicant Tracking System) and HR specialist with 20+ years of experience reviewing resumes for Fortune 500 companies.

Analyze the provided resume and return a comprehensive JSON analysis.

## ANALYSIS CRITERIA:

### 1. ATS Compatibility (Score 0-100)
- Check for ATS-friendly formatting
- Proper section headers
- No tables, images, or complex formatting that ATS can't parse
- Standard fonts and layouts
- Proper keyword placement

### 2. Contact Information
- Is it complete? (Name, Phone, Email, LinkedIn, Location)
- Professional email address
- LinkedIn URL present and proper format

### 3. Professional Summary/Objective
- Clear value proposition
- Quantifiable achievements
- Industry-relevant keywords
- Appropriate length (2-4 sentences)

### 4. Work Experience
- Reverse chronological order
- Action verbs starting each bullet
- Quantifiable achievements (numbers, percentages, $)
- Relevant responsibilities
- Clear job titles and dates
- No gaps explained

### 5. Education
- Proper formatting
- Relevant certifications
- GPA if impressive (>3.5)

### 6. Skills Section
- Relevant technical skills
- Soft skills balance
- Industry-specific tools/technologies
- Certifications and languages

### 7. Formatting & Design
- Consistent formatting
- Appropriate length (1-2 pages)
- White space balance
- Professional appearance
- Readable fonts

### 8. Keyword Analysis
- Industry-relevant keywords present
- Missing important keywords
- Keyword density appropriate`;

// Deep analysis prompt for line-by-line feedback
const DEEP_ANALYSIS_PROMPT = `
## LINE-BY-LINE ANALYSIS MODE
For deep analysis, include "line_by_line_analysis" array in your response:

Each entry should have:
{
  "line_number": 1,
  "original_text": "The exact text from resume",
  "category": "summary|experience|education|skills|contact|other",
  "score": 8,
  "issues": ["Issue 1", "Issue 2"],
  "improved_version": "Better rewritten version",
  "explanation": "Why this change improves the resume",
  "impact": "high|medium|low"
}

Analyze EVERY bullet point, EVERY sentence, and provide:
1. What's wrong with each line
2. How to fix it with specific rewrites
3. Why the fix improves ATS score and readability
4. Impact level of the change

Also include:
- "word_choice_analysis": Weak words to replace (e.g., "helped" → "spearheaded")
- "power_verbs_missing": Strong action verbs that should be used
- "metrics_suggestions": Where to add numbers/percentages
- "industry_keywords_to_add": Specific keywords for the target role
`;

const RESPONSE_FORMAT_PROMPT = `
## RESPONSE FORMAT (JSON):
{
  "overall_score": 75,
  "ats_compatibility_score": 80,
  "sections": {
    "contact_info": {
      "name": "Contact Information",
      "score": 90,
      "feedback": "Complete contact info with professional email",
      "suggestions": ["Add LinkedIn profile URL"]
    },
    "summary": {
      "name": "Professional Summary",
      "score": 70,
      "feedback": "Good but lacks quantifiable achievements",
      "suggestions": ["Add specific metrics", "Include years of experience"]
    },
    "experience": {
      "name": "Work Experience",
      "score": 75,
      "feedback": "Strong action verbs but needs more metrics",
      "suggestions": ["Quantify achievements", "Add impact statements"]
    },
    "education": {
      "name": "Education",
      "score": 85,
      "feedback": "Well formatted",
      "suggestions": ["Add relevant coursework if entry-level"]
    },
    "skills": {
      "name": "Skills",
      "score": 80,
      "feedback": "Good technical skills listed",
      "suggestions": ["Add proficiency levels", "Include certifications"]
    },
    "formatting": {
      "name": "Formatting",
      "score": 85,
      "feedback": "Clean and professional",
      "suggestions": ["Reduce to one page if possible"]
    }
  },
  "keyword_analysis": {
    "found_keywords": ["leadership", "project management", "agile"],
    "missing_keywords": ["data-driven", "cross-functional", "ROI"],
    "keyword_density": 3.5
  },
  "strengths": [
    "Strong technical background",
    "Clear career progression"
  ],
  "weaknesses": [
    "Lacks quantifiable metrics",
    "Summary too generic"
  ],
  "critical_issues": [
    "No LinkedIn profile",
    "Some bullet points start with 'Responsible for'"
  ],
  "improvement_priority": [
    {
      "priority": "high",
      "issue": "No metrics in achievements",
      "fix": "Add numbers: 'Increased sales by 25%' instead of 'Increased sales'"
    }
  ],
  "industry_fit": {
    "best_fit_roles": ["Project Manager", "Product Manager", "Scrum Master"],
    "experience_level": "Mid-Senior (5-8 years)",
    "salary_range_estimate": "$85,000 - $120,000"
  },
  "action_items": [
    "Add 2-3 quantifiable achievements per role",
    "Include a LinkedIn URL",
    "Add a skills section with proficiency levels"
  ],
  "rewritten_summary": "Results-driven Project Manager with 6+ years of experience leading cross-functional teams to deliver $2M+ projects on time and under budget. Expertise in Agile methodologies, stakeholder management, and process optimization. Proven track record of improving team efficiency by 30% through innovative workflow solutions.",
  "detectedLanguage": "English"
}

IMPORTANT:
- Provide actionable, specific feedback
- Be encouraging but honest
- Give concrete examples for improvements
- Consider the industry context
- Detect the language of the resume and respond in the same language`;

// Read file as text (for PDF, we'll send as base64)
const getFileContent = (file: File): Promise<{ type: 'text' | 'base64', content: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    if (file.type === 'application/pdf') {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        resolve({ type: 'base64', content: base64Data });
      };
    } else {
      // For text files (txt, doc, etc.)
      reader.readAsText(file);
      reader.onload = () => {
        resolve({ type: 'text', content: reader.result as string });
      };
    }
    reader.onerror = (error) => reject(error);
  });
};

// Progress stages for resume analysis
const RESUME_ANALYSIS_STAGES = [
  { percent: 5, message: '📄 Reading resume file...' },
  { percent: 15, message: '🔍 Extracting text content...' },
  { percent: 25, message: '🤖 Initializing AI analyzer...' },
  { percent: 35, message: '📊 Checking ATS compatibility...' },
  { percent: 50, message: '💼 Analyzing work experience...' },
  { percent: 65, message: '🎯 Evaluating skills & keywords...' },
  { percent: 75, message: '✍️ Generating improvements...' },
  { percent: 85, message: '📝 Creating line-by-line feedback...' },
  { percent: 95, message: '✅ Finalizing analysis...' },
  { percent: 100, message: '🎉 Analysis complete!' }
];

// Depth-based configuration - MAXIMUM tokens to prevent truncation
const DEPTH_CONFIG = {
  quick: {
    maxTokens: 8000,
    includeLineByLine: false,
    async: false,
    description: 'Fast overview with key insights'
  },
  standard: {
    maxTokens: 16000,
    includeLineByLine: false,
    async: false,
    description: 'Detailed analysis with suggestions'
  },
  deep: {
    maxTokens: 32000,
    includeLineByLine: true,
    async: true,
    description: 'Complete line-by-line analysis with rewrites'
  }
};

export const analyzeResume = async (file: File, options: ResumeOptions = { target: 'general', depth: 'deep', forceRefresh: false }): Promise<ResumeAnalysis> => {
  const depth = options.depth || 'deep';
  const depthConfig = DEPTH_CONFIG[depth];
  const onProgress = options.onProgress || (() => {});

  // Start progress
  onProgress(RESUME_ANALYSIS_STAGES[0].message, RESUME_ANALYSIS_STAGES[0].percent);

  const fileData = await getFileContent(file);
  onProgress(RESUME_ANALYSIS_STAGES[1].message, RESUME_ANALYSIS_STAGES[1].percent);

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
          const backoff = retryAfter ? Number(retryAfter) * 1000 : 300 * Math.pow(2, attempt);
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
        const backoff = 300 * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, backoff));
        attempt += 1;
      }
    }
    throw lastErr || new Error('Failed to post JSON to proxy');
  };

  // Enhanced job waiting with progress updates
  const waitForJobWithProgress = async (jobId: string) => {
    const url = `${API_BASE}/api/job/${jobId}`;
    let attempts = 0;
    const maxAttempts = 120;
    
    while (attempts < maxAttempts) {
      attempts++;
      
      // Calculate progress between stage 3 (25%) and stage 8 (85%)
      const progressRange = 60; // 85 - 25
      const progressPercent = 25 + Math.min(progressRange, (attempts / maxAttempts) * progressRange);
      
      // Update with stage messages based on progress
      if (attempts <= 10) {
        onProgress(RESUME_ANALYSIS_STAGES[3].message, Math.round(progressPercent)); // ATS check
      } else if (attempts <= 30) {
        onProgress(RESUME_ANALYSIS_STAGES[4].message, Math.round(progressPercent)); // Experience
      } else if (attempts <= 50) {
        onProgress(RESUME_ANALYSIS_STAGES[5].message, Math.round(progressPercent)); // Skills
      } else if (attempts <= 70) {
        onProgress(RESUME_ANALYSIS_STAGES[6].message, Math.round(progressPercent)); // Improvements
      } else {
        onProgress(RESUME_ANALYSIS_STAGES[7].message, Math.round(progressPercent)); // Line-by-line
      }

      const res = await fetch(url);
      if (!res.ok) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      const j = await res.json();
      if (j.state === 'completed' && j.result) {
        onProgress(RESUME_ANALYSIS_STAGES[8].message, 95);
        return j.result;
      }
      if (j.state === 'failed') throw new Error('Resume analysis job failed');
      await new Promise((r) => setTimeout(r, 2000));
    }
    throw new Error('Job timed out');
  };

  try {
      // Caching: use file hash + target + depth
      const fileHash = await generateFileHash(file);
      const cacheKey = `${fileHash}_${options.target || 'general'}_${depth}`;
      if (!options.forceRefresh && resumeCache.has(cacheKey)) {
        const entry = resumeCache.get(cacheKey)!;
        if (Date.now() - entry.timestamp < RESUME_CACHE_EXPIRY) {
          console.log('📦 Using cached resume analysis');
          onProgress(RESUME_ANALYSIS_STAGES[9].message, 100);
          return entry.result;
        }
        resumeCache.delete(cacheKey);
      }

    onProgress(RESUME_ANALYSIS_STAGES[2].message, RESUME_ANALYSIS_STAGES[2].percent);

    const targetPrompt = getTargetPrompt(options.target || 'general');
    const companyPrompt = options.company ? `Target company: ${options.company}. Tailor feedback and suggestions for this company.` : '';
    const industryPrompt = getIndustryPrompt(options.mode || 'general');
    
    // Build depth-specific prompt
    const depthPromptAddition = depthConfig.includeLineByLine ? DEEP_ANALYSIS_PROMPT : '';
    
    const rubric = `
  ## RESUME SCORING ALGORITHM
  - ATS compatibility: 30%
  - Experience & achievements: 30%
  - Impact & metrics: 20%
  - Skills & keywords: 10%
  - Formatting & professionalism: 10%
  
  Analysis Mode: ${depth.toUpperCase()} (${depthConfig.description})
  ${depth === 'deep' ? 'IMPORTANT: Include complete line_by_line_analysis array with rewrites for EVERY bullet point.' : ''}
  Adjust scoring favors for FAANG target to emphasize technical depth, scale, metrics and role fit.
  `;

    const body: any = {
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `${RESUME_ANALYSIS_PROMPT}\n\n${depthPromptAddition}\n\n${RESPONSE_FORMAT_PROMPT}\n\n${industryPrompt}\n\n${targetPrompt}\n\n${companyPrompt}\n\n${rubric}`,
        responseMimeType: 'application/json',
        temperature: 0,
        topP: 1,
        topK: 1
      }
    };

    if (fileData.type === 'base64' && file.type === 'application/pdf') {
      body.contents = { parts: [ { inlineData: { mimeType: file.type, data: fileData.content } }, { text: `Analyze this resume document and provide a comprehensive ${depth} analysis. ${companyPrompt} Follow the system instructions carefully.${depth === 'deep' ? ' Include line_by_line_analysis with improvements for every bullet point.' : ''}` } ] };
    } else {
        body.contents = { parts: [ { text: `Here is the resume content to analyze:\n\n${fileData.content}\n\n${companyPrompt}\nTarget: ${(options.target || 'general').toUpperCase()}\nDepth: ${depth.toUpperCase()}\n\nProvide a comprehensive ${depth} analysis following the system instructions.${depth === 'deep' ? ' Include line_by_line_analysis with improvements for every bullet point.' : ''}` } ] };
    }
    body.config.maxOutputTokens = depthConfig.maxTokens;

      // Client-side concurrency limit for resume analysis
      const MAX_CONCURRENT_ANALYSES = Number((import.meta as any).env?.VITE_MAX_CONCURRENT_ANALYSES) || 1;
      const ANALYSIS_QUEUE_KEY = '__globalResumeQueue';
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
        onProgress(RESUME_ANALYSIS_STAGES[3].message, RESUME_ANALYSIS_STAGES[3].percent);
        
        const sendBody = { ...body, async: depthConfig.async };
        const response = await postJson('/api/generate', sendBody);
        q.inProgress--;
        if (q.queue.length) {
          const next = q.queue.shift();
          if (next) next();
        }
        if (response && response.jobId) {
          // Use enhanced job waiting with progress updates
          const jobResult = await waitForJobWithProgress(response.jobId);
          if (!jobResult || !jobResult.text) throw new Error('No result from async job');
          const parsedResponse = JSON.parse(jobResult.text) as ResumeAnalysis;
          if (options.company) parsedResponse.analysis_target_company = options.company;
          if (options.target) parsedResponse.analysis_target = options.target;
          parsedResponse.analysis_depth = depth;
          resumeCache.set(cacheKey, { result: parsedResponse, timestamp: Date.now() });
          onProgress(RESUME_ANALYSIS_STAGES[9].message, 100);
          return parsedResponse;
        }
        if (!response || !response.text) throw new Error('No response from proxy/generator');
        onProgress(RESUME_ANALYSIS_STAGES[8].message, 95);
        const parsedResponse = JSON.parse(response.text) as ResumeAnalysis;
        if (options.company) parsedResponse.analysis_target_company = options.company;
        if (options.target) parsedResponse.analysis_target = options.target;
        parsedResponse.analysis_depth = depth;
        resumeCache.set(cacheKey, { result: parsedResponse, timestamp: Date.now() });
        onProgress(RESUME_ANALYSIS_STAGES[9].message, 100);
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
    console.error('Error analyzing resume:', error);
    // As a graceful fallback: do a lightweight, heuristic analysis of plain text resumes if possible
    try {
      if (fileData.type === 'text') {
        const text = fileData.content as string;
        const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
        const phoneMatch = text.match(/\+?\d[\d\s\-()]{7,}\d/);
        const linkedinMatch = text.match(/linkedin\.com\/[A-Za-z0-9\-_/]+/i);
        const numLines = text.split('\n').length;
        const hasExperienceSection = /work experience|experience|professional experience/i.test(text);
        const metricCount = (text.match(/\d+/g) || []).length;
        const score = Math.max(40, Math.min(95, 40 + metricCount * 5 + (hasExperienceSection ? 10 : 0) + (emailMatch ? 5 : 0) + (linkedinMatch ? 5 : 0) + Math.min(10, Math.floor(numLines / 50))));
        const parsed: ResumeAnalysis = {
          overall_score: score,
          ats_compatibility_score: emailMatch ? 85 : 60,
          sections: {
            contact_info: { name: 'Contact Information', score: emailMatch ? 90 : 50, feedback: emailMatch ? 'Contact info present' : 'Missing email', suggestions: emailMatch ? [] : ['Add a professional email'] },
            summary: { name: 'Professional Summary', score: 60, feedback: 'Short or missing summary', suggestions: ['Add a 2-4 sentence summary with metrics'] },
            experience: { name: 'Work Experience', score: hasExperienceSection ? 70 : 50, feedback: hasExperienceSection ? 'Experience section present' : 'Add a clear experience section', suggestions: [] },
            education: { name: 'Education', score: 70, feedback: 'Education info present', suggestions: [] },
            skills: { name: 'Skills', score: 60, feedback: 'Skills section may be missing or unstructured', suggestions: ['Add a skills section with keywords'] },
            formatting: { name: 'Formatting', score: 70, feedback: 'Readable formatting', suggestions: [] },
          },
          keyword_analysis: { found_keywords: [], missing_keywords: [], keyword_density: 0 },
          strengths: [],
          weaknesses: [],
          critical_issues: [],
          improvement_priority: [],
          industry_fit: { best_fit_roles: [], experience_level: 'Not specified', salary_range_estimate: 'Not available' },
          action_items: [],
          rewritten_summary: '',
          detectedLanguage: 'Unknown'
        };
        return parsed;
      }
    } catch (e) {
      // ignore fallback errors
    }
    throw error;
  }
};
