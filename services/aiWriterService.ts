// AI Writer Service - Cover Letters, Emails, and Job Analysis
// Frontend proxy configuration and helper
const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE) || 'http://localhost:5001';

// Small helper to POST JSON with a few retries for transient backend/network issues
const postJsonWithRetries = async (path: string, body: any, maxRetries = 2) => {
  const url = `${API_BASE}${path}`;
  let attempt = 0;
  let lastErr: any = null;
  while (attempt <= maxRetries) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.status === 503 || res.status === 429) {
        lastErr = new Error(`Server returned ${res.status}`);
        const backoff = 300 * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, backoff));
        attempt += 1;
        continue;
      }
      const j = await res.json();
      return j;
    } catch (err: any) {
      lastErr = err;
      const backoff = 300 * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, backoff));
      attempt += 1;
    }
  }
  throw lastErr || new Error('Failed to POST JSON');
};

// Replace server-side getAI with a proxy call to local backend to avoid leaking API keys
const getAI = () => {
  return {
    models: {
      generateContent: async ({ model, contents, config }: any) => {
        // Forward the contents object to backend so inlineData (base64) is preserved
        const body: any = { model, config };
        if (contents) body.contents = contents;
        else body.prompt = config?.prompt || '';

        const j = await postJsonWithRetries('/api/generate', body, 2);
        return { text: j.text || '' };
      }
    }
  };
};
// AI Writer Service - Cover Letters, Emails, and Job Analysis

// =====================================================
// COVER LETTER GENERATOR
// =====================================================
export interface CoverLetterInput {
  resumeText: string;
  jobDescription: string;
  companyName: string;
  jobTitle: string;
  tone: 'professional' | 'creative' | 'casual';
  additionalNotes?: string;
}

export interface CoverLetterResult {
  coverLetter: string;
  keyHighlights: string[];
  matchedSkills: string[];
  suggestions: string[];
}

export const generateCoverLetter = async (input: CoverLetterInput): Promise<CoverLetterResult> => {
  const toneGuide = {
    professional: 'formal, corporate, and polished',
    creative: 'engaging, unique, and memorable while still professional',
    casual: 'friendly, conversational, but still respectful'
  };

  const prompt = `You are an expert career coach and professional writer. Generate a compelling cover letter.

RESUME/BACKGROUND:
${input.resumeText}

JOB DESCRIPTION:
${input.jobDescription}

COMPANY: ${input.companyName}
POSITION: ${input.jobTitle}
TONE: ${toneGuide[input.tone]}
${input.additionalNotes ? `ADDITIONAL NOTES: ${input.additionalNotes}` : ''}

Generate a cover letter and analysis. Return ONLY valid JSON:

{
  "coverLetter": "Full cover letter text with proper formatting, paragraphs separated by \\n\\n",
  "keyHighlights": ["3-4 key strengths highlighted in the letter"],
  "matchedSkills": ["Skills from resume that match job requirements"],
  "suggestions": ["2-3 suggestions to improve the application"]
}`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error('Cover letter generation error:', error);
    throw new Error('Failed to generate cover letter. Please try again.');
  }
};

// =====================================================
// JOB DESCRIPTION ANALYZER
// =====================================================
export interface JobAnalysisResult {
  jobTitle: string;
  company: string;
  location: string;
  experienceLevel: string;
  technicalSkills: string[];
  softSkills: string[];
  responsibilities: string[];
  requiredQualifications: string[];
  preferredQualifications: string[];
  redFlags: string[];
  preparationTips: string[];
  salaryInsights: string;
  keywordsToUse: string[];
}

export const analyzeJobDescription = async (jobDescription: string): Promise<JobAnalysisResult> => {
  const prompt = `You are an expert HR analyst and career coach. Analyze this job description thoroughly.

JOB DESCRIPTION:
${jobDescription}

Analyze comprehensively and return ONLY valid JSON:

{
  "jobTitle": "Extracted job title",
  "company": "Company name if mentioned, otherwise 'Not specified'",
  "location": "Location/remote status if mentioned, otherwise 'Not specified'",
  "experienceLevel": "Entry-level/Junior/Mid-level/Senior/Lead/Principal/Executive",
  "technicalSkills": ["Technical skill 1", "Technical skill 2", "..."],
  "softSkills": ["Soft skill 1", "Soft skill 2", "..."],
  "responsibilities": ["Key responsibility 1", "Key responsibility 2", "..."],
  "requiredQualifications": ["Must-have qualification 1", "Must-have qualification 2", "..."],
  "preferredQualifications": ["Nice-to-have qualification 1", "Nice-to-have qualification 2", "..."],
  "redFlags": ["Any concerning aspects of the job posting, unrealistic expectations, vague language, etc."],
  "preparationTips": ["Specific tip 1 to prepare for this role", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
  "salaryInsights": "Estimated salary range based on role, location, and experience level. Include market context.",
  "keywordsToUse": ["Keyword 1 to include in resume/cover letter", "Keyword 2", "..."]
}`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
        topP: 0.9,
      }
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error('Job analysis error:', error);
    throw new Error('Failed to analyze job description. Please try again.');
  }
};

// =====================================================
// JOB DESCRIPTION + RESUME COMPARISON ANALYZER
// =====================================================
export interface JobResumeComparisonResult extends JobAnalysisResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  strongPoints: string[];
  improvementAreas: string[];
  actionPlan: string[];
  tailoredTips: string[];
  resumeSuggestions: string[];
  interviewQuestionsPredicted: string[];
  overallAssessment: string;
}

export const analyzeJobWithResume = async (jobDescription: string, resumeText: string): Promise<JobResumeComparisonResult> => {
  const prompt = `You are an expert HR analyst, career coach, and hiring manager with 20+ years of experience. Analyze this job description and compare it with the candidate's resume.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S RESUME:
${resumeText}

Perform a comprehensive analysis comparing the resume against the job requirements. Calculate a realistic match score and provide actionable insights.

Return ONLY valid JSON:

{
  "jobTitle": "Extracted job title",
  "company": "Company name if mentioned, otherwise 'Not specified'",
  "location": "Location/remote status if mentioned, otherwise 'Not specified'",
  "experienceLevel": "Entry-level/Junior/Mid-evel/Senior/Lead/Principal/Executive",
  "technicalSkills": ["Technical skill required 1", "Technical skill required 2", "..."],
  "softSkills": ["Soft skill required 1", "Soft skill required 2", "..."],
  "responsibilities": ["Key responsibility 1", "Key responsibility 2", "..."],
  "requiredQualifications": ["Must-have qualification 1", "Must-have qualification 2", "..."],
  "preferredQualifications": ["Nice-to-have qualification 1", "Nice-to-have qualification 2", "..."],
  "redFlags": ["Any concerning aspects of the job posting"],
  "preparationTips": ["Specific tip 1", "Tip 2", "Tip 3"],
  "salaryInsights": "Estimated salary range based on role and experience",
  "keywordsToUse": ["Keyword 1 to add to cover letter", "Keyword 2", "..."],
  
  "matchScore": 75,
  "matchedSkills": ["Skills from resume that match job requirements"],
  "missingSkills": ["Required skills the candidate lacks or should develop"],
  "strongPoints": ["Candidate's strongest qualifications for this role"],
  "improvementAreas": ["Areas where candidate needs to improve or upskill"],
  "actionPlan": ["Step 1: Specific action to take", "Step 2: Another action", "..."],
  "tailoredTips": ["Specific tips tailored to this candidate for this job"],
  "resumeSuggestions": ["Specific changes to make to resume for this application"],
  "interviewQuestionsPredicted": ["Likely interview question 1", "Question 2", "Question 3", "Question 4", "Question 5"],
  "overallAssessment": "A 2-3 sentence assessment of the candidate's fit for this role, including realistic chances and what they should focus on."
}`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
        topP: 0.9,
      }
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error('Job-Resume comparison error:', error);
    throw new Error('Failed to analyze. Please try again.');
  }
};

// =====================================================
// AI EMAIL WRITER
// =====================================================
export type EmailType = 
  | 'follow-up'
  | 'thank-you'
  | 'negotiation'
  | 'application'
  | 'rejection-response';

export interface EmailContext {
  recipientName?: string;
  companyName?: string;
  position?: string;
  interviewDate?: string;
  specificPoints?: string;
  currentOffer?: string;
  desiredSalary?: string;
  otherBenefits?: string;
  relevantExperience?: string;
  keySkills?: string;
  rejectionReason?: string;
  continuedInterest?: string;
}

const EMAIL_PROMPTS: Record<EmailType, (ctx: EmailContext) => string> = {
  'follow-up': (ctx) => `Write a professional follow-up email to check on job application status.
Recipient: ${ctx.recipientName || 'Hiring Manager'}
Company: ${ctx.companyName}
Position: ${ctx.position}
Interview/Application Date: ${ctx.interviewDate || 'recently'}
${ctx.specificPoints ? `Key points to mention: ${ctx.specificPoints}` : ''}`,

  'thank-you': (ctx) => `Write a thank you email after a job interview.
Recipient: ${ctx.recipientName || 'Interviewer'}
Company: ${ctx.companyName}
Position: ${ctx.position}
Interview Date: ${ctx.interviewDate || 'recently'}
${ctx.specificPoints ? `Topics discussed to reference: ${ctx.specificPoints}` : ''}`,

  'negotiation': (ctx) => `Write a professional salary negotiation email.
Recipient: ${ctx.recipientName || 'Hiring Manager'}
Company: ${ctx.companyName}
Position: ${ctx.position}
Current Offer: ${ctx.currentOffer || 'Not specified'}
Desired Salary: ${ctx.desiredSalary || 'higher compensation'}
${ctx.otherBenefits ? `Other benefits to negotiate: ${ctx.otherBenefits}` : ''}`,

  'application': (ctx) => `Write a job application email to accompany a resume.
Recipient: ${ctx.recipientName || 'Hiring Manager'}
Company: ${ctx.companyName}
Position: ${ctx.position}
Relevant Experience: ${ctx.relevantExperience || 'Not specified'}
Key Skills: ${ctx.keySkills || 'Not specified'}`,

  'rejection-response': (ctx) => `Write a graceful, professional response to a job rejection that keeps doors open for future opportunities.
Recipient: ${ctx.recipientName || 'Hiring Manager'}
Company: ${ctx.companyName}
Position: ${ctx.position}
${ctx.rejectionReason ? `Rejection reason: ${ctx.rejectionReason}` : ''}
${ctx.continuedInterest ? `Why still interested: ${ctx.continuedInterest}` : ''}`
};

export const generateEmail = async (emailType: EmailType, context: EmailContext): Promise<string> => {
  const contextPrompt = EMAIL_PROMPTS[emailType](context);

  const prompt = `You are an expert business communication specialist. Write a professional email.

${contextPrompt}

IMPORTANT:
- Be professional, concise, and impactful
- Use appropriate salutation and closing
- Include a clear call-to-action where appropriate
- Make it sound natural, not robotic
- Personalize based on the provided context

Write ONLY the email text directly. Include subject line at the top like:
Subject: [Your subject line here]

[Email body starts here...]`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || 'Failed to generate email content.';
  } catch (error: any) {
    console.error('Email generation error:', error);
    throw new Error('Failed to generate email. Please try again.');
  }
};

// =====================================================
// UTILITY: Extract text from any file (PDF, Word, PPT, TXT)
// =====================================================

// Supported MIME types
const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/rtf',
  'application/rtf'
];

// Get file as base64
const getFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Get file as text
const getFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Get file as ArrayBuffer
const getFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

// Extract text from PDF/Documents using Gemini AI
const extractTextWithGemini = async (file: File): Promise<string> => {
  try {
    const ai = getAI();
    const base64Data = await getFileAsBase64(file);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      // Use an object with `parts` so the backend forwards inlineData properly
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type || 'application/pdf',
              data: base64Data
            }
          },
          {
            text: `Extract ALL text content from this document exactly as it appears.\n\nIMPORTANT RULES:\n1. Return ONLY the plain text content - no commentary, no analysis\n2. Preserve the structure (headings, paragraphs, bullet points)\n3. Include ALL text - name, contact info, skills, experience, education, everything\n4. Do not add any introductions like "Here is the text:" or conclusions\n5. Just return the raw extracted text\n\nStart extracting now:`
          }
        ]
      },
      config: {
        temperature: 0.0,
        topP: 1.0,
        maxOutputTokens: 32000
      }
    });

    const extractedText = response.text || '';
    
    if (extractedText.length < 50) {
      // Try one more time with a slightly different prompt in case of transient failure
      try {
        const retryResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: file.type || 'application/pdf',
                  data: base64Data
                }
              },
              {
                text: `Extract ALL text content from this document. Return ONLY the raw text with preserved structure. Start now:`
              }
            ]
          },
          config: {
            temperature: 0.0,
            topP: 1.0,
            maxOutputTokens: 32000
          }
        });
        const retryText = retryResponse.text || '';
        if (retryText.length >= 50) return retryText.trim();
      } catch (e) {
        // ignore and fall through to error
      }
      throw new Error('Could not extract meaningful text from document');
    }
    
    return extractedText.trim();
  } catch (error: any) {
    console.error('Gemini extraction error:', error);
    throw new Error(`Failed to extract text: ${error.message || 'Unknown error'}`);
  }
};

// Extract text from Word documents (DOCX) - basic extraction
const extractTextFromDOCX = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await getFileAsArrayBuffer(file);
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(arrayBuffer);
    
    // DOCX files are ZIP archives containing XML
    const documentXml = await zip.file('word/document.xml')?.async('string');
    
    if (!documentXml) {
      throw new Error('Invalid DOCX file structure');
    }
    
    // Parse XML and extract text content
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(documentXml, 'text/xml');
    
    // Also try to preserve some structure
    const paragraphs = xmlDoc.getElementsByTagName('w:p');
    let structuredText = '';
    
    for (let i = 0; i < paragraphs.length; i++) {
      const pTexts = paragraphs[i].getElementsByTagName('w:t');
      let paragraphText = '';
      for (let j = 0; j < pTexts.length; j++) {
        paragraphText += pTexts[j].textContent || '';
      }
      if (paragraphText.trim()) {
        structuredText += paragraphText.trim() + '\n';
      }
    }
    
    if (structuredText.trim().length > 50) {
      return structuredText.trim();
    }
    
    // Fallback to Gemini if DOCX parsing didn't work well
    return extractTextWithGemini(file);
  } catch (error) {
    console.error('DOCX extraction error:', error);
    // Fallback to Gemini
    return extractTextWithGemini(file);
  }
};

// Extract text from any document using appropriate method
export const extractTextFromDocument = async (file: File): Promise<string> => {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  
  // Plain text files - read directly
  if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    return getFileAsText(file);
  }
  
  // RTF files - read as text and clean
  if (fileType.includes('rtf') || fileName.endsWith('.rtf')) {
    const text = await getFileAsText(file);
    // Basic RTF stripping (removes RTF control words)
    return text.replace(/\\[a-z]+\d*\s?|\{|\}|\\'/g, '').trim();
  }
  
  // PDF files - use Gemini AI for extraction
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    // First try server-side extraction (more reliable with pdf-parse)
    try {
      const base64Data = await getFileAsBase64(file);
      const res = await postJsonWithRetries('/api/extract-text', { base64: base64Data, mimeType: file.type }, 2);
      if (res && res.text && res.text.trim().length > 30) {
        return res.text.trim();
      }
    } catch (e) {
      console.warn('Server-side extract-text failed:', e);
    }

    // Next try local extraction in the browser
    try {
      const localText = await extractTextFromPDFLocal(file);
      if (localText && localText.trim().length > 30) return localText.trim();
    } catch (err) {
      console.warn('Local PDF extraction threw an error:', err && err.message ? err.message : err);
    }

    // Final fallback: Gemini extraction
    return extractTextWithGemini(file);
  }
  
  // DOCX files - try JSZip first, fallback to Gemini
  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      fileName.endsWith('.docx')) {
    return extractTextFromDOCX(file);
  }
  
  // DOC files (older Word format) - use Gemini
  if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
    return extractTextWithGemini(file);
  }
  
  // PPT/PPTX files - use Gemini AI
  if (fileName.endsWith('.pptx') || fileName.endsWith('.ppt') ||
      fileType.includes('powerpoint') || fileType.includes('presentation')) {
    return extractTextWithGemini(file);
  }
  
  throw new Error(`Unsupported file format: ${file.type || fileName.split('.').pop()}`);
};

// Simple text extraction (for backward compatibility)
export const extractTextFromFile = async (file: File): Promise<string> => {
  return extractTextFromDocument(file);
};

// Check if file type is supported
export const isSupportedFileType = (file: File): boolean => {
  if (SUPPORTED_MIME_TYPES.includes(file.type)) return true;
  
  const ext = file.name.toLowerCase().split('.').pop();
  const supportedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'rtf'];
  return supportedExtensions.includes(ext || '');
};

// Get accepted file types string for input element
export const getAcceptedFileTypes = (): string => {
  return '.pdf,.doc,.docx,.ppt,.pptx,.txt,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain';
};

// =====================================================
// LINKEDIN OPTIMIZER
// =====================================================
export interface LinkedInInput {
  currentProfile: string;
  targetRole?: string;
  industry?: string;
  careerGoals?: string;
}

export interface LinkedInOptimizationResult {
  headline: {
    current: string;
    optimized: string[];
    tips: string[];
  };
  about: {
    optimized: string;
    keyPoints: string[];
  };
  experience: {
    generalTips: string[];
    actionVerbs: string[];
    quantifyTips: string[];
  };
  skills: {
    recommended: string[];
    trending: string[];
    toRemove: string[];
  };
  keywords: {
    mustHave: string[];
    niceToHave: string[];
    industrySpecific: string[];
  };
  networking: {
    tips: string[];
    contentIdeas: string[];
  };
  overallScore: number;
  priorityActions: string[];
}

export const optimizeLinkedIn = async (input: LinkedInInput): Promise<LinkedInOptimizationResult> => {
  const prompt = `You are a LinkedIn optimization expert, career coach, and personal branding specialist with 15+ years of experience helping professionals land their dream jobs.

CURRENT LINKEDIN PROFILE:
${input.currentProfile}

${input.targetRole ? `TARGET ROLE: ${input.targetRole}` : ''}
${input.industry ? `INDUSTRY: ${input.industry}` : ''}
${input.careerGoals ? `CAREER GOALS: ${input.careerGoals}` : ''}

Analyze this LinkedIn profile and provide comprehensive optimization recommendations. Return ONLY valid JSON:

{
  "headline": {
    "current": "Extracted current headline or 'Not found'",
    "optimized": ["3-5 powerful headline alternatives that include keywords, value proposition, and target role"],
    "tips": ["Tips for writing compelling headlines"]
  },
  "about": {
    "optimized": "A compelling 'About' section (300-400 words) that tells their story, highlights achievements, includes keywords, and has a clear CTA",
    "keyPoints": ["Key elements included in the optimized About section"]
  },
  "experience": {
    "generalTips": ["Tips for improving experience descriptions"],
    "actionVerbs": ["Strong action verbs to use"],
    "quantifyTips": ["How to add metrics and numbers to achievements"]
  },
  "skills": {
    "recommended": ["Skills to add based on profile and target role"],
    "trending": ["Trending skills in their industry"],
    "toRemove": ["Outdated or irrelevant skills to remove"]
  },
  "keywords": {
    "mustHave": ["Essential keywords for their profile"],
    "niceToHave": ["Good-to-have keywords"],
    "industrySpecific": ["Industry-specific terms and jargon"]
  },
  "networking": {
    "tips": ["Networking strategies for LinkedIn"],
    "contentIdeas": ["Content ideas to post for visibility"]
  },
  "overallScore": 75,
  "priorityActions": ["Top 5 immediate actions ranked by impact"]
}`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error('LinkedIn optimization error:', error);
    throw new Error('Failed to optimize LinkedIn profile. Please try again.');
  }
};

// =====================================================
// INTERVIEW Q&A BANK
// =====================================================
export interface InterviewQAInput {
  jobTitle: string;
  jobDescription?: string;
  company?: string;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  interviewType: 'behavioral' | 'technical' | 'mixed' | 'case';
}

export interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sampleAnswer: string;
  tips: string[];
  followUpQuestions: string[];
}

export interface InterviewQAResult {
  questions: InterviewQuestion[];
  generalTips: string[];
  companyResearchTips: string[];
  questionsToAsk: string[];
  redFlagsToWatch: string[];
}

export const generateInterviewQuestions = async (input: InterviewQAInput): Promise<InterviewQAResult> => {
  const prompt = `You are a senior hiring manager and interview coach. Generate a comprehensive interview preparation guide.

JOB TITLE: ${input.jobTitle}
EXPERIENCE LEVEL: ${input.experienceLevel}
INTERVIEW TYPE: ${input.interviewType}
${input.jobDescription ? `JOB DESCRIPTION: ${input.jobDescription}` : ''}
${input.company ? `COMPANY: ${input.company}` : ''}

Generate 15-20 likely interview questions with sample answers. Return ONLY valid JSON:

{
  "questions": [
    {
      "question": "Interview question text",
      "category": "Behavioral/Technical/Situational/Culture Fit/Leadership",
      "difficulty": "easy/medium/hard",
      "sampleAnswer": "A strong sample answer using STAR method where applicable",
      "tips": ["Tips for answering this specific question"],
      "followUpQuestions": ["Possible follow-up questions"]
    }
  ],
  "generalTips": ["General interview tips and strategies"],
  "companyResearchTips": ["How to research and prepare for this specific type of role/company"],
  "questionsToAsk": ["Smart questions the candidate should ask the interviewer"],
  "redFlagsToWatch": ["Red flags to watch for during the interview"]
}`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error('Interview Q&A generation error:', error);
    throw new Error('Failed to generate interview questions. Please try again.');
  }
};

// =====================================================
// SALARY NEGOTIATION COACH
// =====================================================
export interface SalaryNegotiationInput {
  currentSalary?: string;
  offeredSalary: string;
  targetSalary: string;
  jobTitle: string;
  location: string;
  yearsExperience: number;
  skills: string;
  companySize?: string;
  otherOffers?: string;
  concerns?: string;
}

export interface SalaryNegotiationResult {
  marketAnalysis: {
    salaryRange: {
      low: string;
      median: string;
      high: string;
    };
    analysis: string;
    factors: string[];
  };
  negotiationStrategy: {
    approach: string;
    timing: string[];
    scripts: {
      opening: string;
      counterOffer: string;
      handling_pushback: string;
      closing: string;
    };
  };
  leveragePoints: string[];
  nonSalaryBenefits: {
    benefit: string;
    value: string;
    script: string;
  }[];
  commonMistakes: string[];
  walkAwayPoint: string;
  confidenceBooster: string;
  actionPlan: string[];
}

export const getSalaryNegotiationAdvice = async (input: SalaryNegotiationInput): Promise<SalaryNegotiationResult> => {
  const prompt = `You are an expert salary negotiation coach and compensation consultant with deep knowledge of market rates and negotiation psychology.

JOB DETAILS:
- Title: ${input.jobTitle}
- Location: ${input.location}
- Years of Experience: ${input.yearsExperience}
- Key Skills: ${input.skills}
${input.companySize ? `- Company Size: ${input.companySize}` : ''}

SALARY DETAILS:
${input.currentSalary ? `- Current Salary: ${input.currentSalary}` : ''}
- Offered Salary: ${input.offeredSalary}
- Target Salary: ${input.targetSalary}
${input.otherOffers ? `- Other Offers: ${input.otherOffers}` : ''}
${input.concerns ? `- Concerns: ${input.concerns}` : ''}

Provide comprehensive salary negotiation advice for Indian job market. All salary figures MUST be in Indian Rupees (₹) using LPA (Lakhs Per Annum) format like "₹12 LPA" or "₹18.5 LPA". Return ONLY valid JSON:

{
  "marketAnalysis": {
    "salaryRange": {
      "low": "Market low in ₹ LPA format (e.g., ₹10 LPA)",
      "median": "Market median in ₹ LPA format (e.g., ₹15 LPA)",
      "high": "Market high in ₹ LPA format (e.g., ₹25 LPA)"
    },
    "analysis": "Detailed analysis of where the offer stands in the market",
    "factors": ["Factors affecting salary for this role"]
  },
  "negotiationStrategy": {
    "approach": "Recommended negotiation approach",
    "timing": ["Best timing strategies"],
    "scripts": {
      "opening": "Script for opening the negotiation",
      "counterOffer": "Script for presenting counter offer",
      "handling_pushback": "Script for when they push back",
      "closing": "Script for closing the negotiation"
    }
  },
  "leveragePoints": ["Points of leverage the candidate has"],
  "nonSalaryBenefits": [
    {
      "benefit": "Benefit to negotiate",
      "value": "Monetary value in ₹ (e.g., ₹50,000/month or ₹2 LPA equivalent)",
      "script": "How to ask for this benefit"
    }
  ],
  "commonMistakes": ["Mistakes to avoid during negotiation"],
  "walkAwayPoint": "When and how to walk away if needed",
  "confidenceBooster": "Motivational message about their worth",
  "actionPlan": ["Step-by-step action plan for the negotiation"]
}`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.6,
        topP: 0.9,
      }
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error('Salary negotiation advice error:', error);
    throw new Error('Failed to generate negotiation advice. Please try again.');
  }
};

// Try extracting text from PDF locally in the browser using pdfjs as a fallback/primary for PDFs
// If you see errors about missing pdfjs-dist, run: npm install pdfjs-dist
// Limit concurrent PDF extraction to avoid browser overload
let pdfExtractionInProgress = 0;
const MAX_CONCURRENT_PDF_EXTRACTIONS = 2;
const extractTextFromPDFLocal = async (file: File): Promise<string> => {
  if (pdfExtractionInProgress >= MAX_CONCURRENT_PDF_EXTRACTIONS) {
    // Too many extractions at once, wait and retry
    await new Promise((resolve) => setTimeout(resolve, 500));
    return extractTextFromPDFLocal(file);
  }
  pdfExtractionInProgress++;
  try {
    const arrayBuffer = await getFileAsArrayBuffer(file);
    // dynamic import of pdfjs
    // Try dynamic import with two possible paths (some pdfjs versions expose legacy path)
    let pdfjs: any = null;
    try {
      pdfjs = await import('pdfjs-dist/legacy/build/pdf');
    } catch (e1) {
      try {
        pdfjs = await import('pdfjs-dist/build/pdf');
      } catch (e2) {
        // If pdfjs isn't available in the client, show a user-friendly error and return empty string
        console.warn('pdfjs-dist import failed in browser:', e1?.message || e2?.message || e2);
        alert('PDF extraction requires pdfjs-dist. Please run: npm install pdfjs-dist');
        return '';
      }
    }
    // For bundlers, worker may be provided; try to set a CDN worker as a fallback
    try {
      (pdfjs as any).GlobalWorkerOptions = (pdfjs as any).GlobalWorkerOptions || {};
      (pdfjs as any).GlobalWorkerOptions.workerSrc = (pdfjs as any).GlobalWorkerOptions.workerSrc || 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js';
    } catch (e) {
      // ignore
    }

    const loadingTask = (pdfjs as any).getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((it: any) => it.str).join(' ');
      fullText += pageText + '\n\n';
    }
    if (fullText.trim().length > 30) return fullText.trim();
    throw new Error('Local PDF extraction returned insufficient text');
  } catch (err) {
    console.warn('Local PDF extraction failed:', err && err.message ? err.message : err);
    // Return empty to indicate failure so caller can fallback to Gemini or server-side extraction
    return '';
  } finally {
    pdfExtractionInProgress--;
  }
};