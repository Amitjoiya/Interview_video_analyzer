import { GoogleGenAI } from "@google/genai";
import { ResumeAnalysis } from "../types";

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
- Keyword density appropriate

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

export const analyzeResume = async (file: File): Promise<ResumeAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const fileData = await getFileContent(file);

  try {
    let response;
    
    if (fileData.type === 'base64' && file.type === 'application/pdf') {
      // For PDF files
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: file.type,
                data: fileData.content
              }
            },
            {
              text: "Analyze this resume document and provide a comprehensive analysis. Follow the system instructions carefully."
            }
          ]
        },
        config: {
          systemInstruction: RESUME_ANALYSIS_PROMPT,
          responseMimeType: "application/json",
          temperature: 0,
          topP: 1,
          topK: 1,
        }
      });
    } else {
      // For text-based resumes
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            {
              text: `Here is the resume content to analyze:\n\n${fileData.content}\n\nProvide a comprehensive analysis following the system instructions.`
            }
          ]
        },
        config: {
          systemInstruction: RESUME_ANALYSIS_PROMPT,
          responseMimeType: "application/json",
          temperature: 0,
          topP: 1,
          topK: 1,
        }
      });
    }

    if (!response.text) {
      throw new Error("No response received from AI.");
    }

    const parsedResponse = JSON.parse(response.text) as ResumeAnalysis;
    return parsedResponse;

  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};
