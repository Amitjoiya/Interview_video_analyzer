export interface MicroExpression {
  timestamp: string;
  expression: string;
  meaning: string;
  duration: string;
}

export interface ContentQuality {
  score: number;
  structure_rating: string;
  star_method_adherence: number;
  opening_impact_score: number;
  closing_strength_score: number;
  quantifiable_achievements_count: number;
  specificity_index: number;
  power_words_used: string[];
  weak_language_detected: string[];
  key_message_clarity: number;
  storytelling_quotient: number;
  strengths: string[];
  weaknesses: string[];
  red_flags: string[];
  feedback: string;
  example_improvements: string[];
  golden_quote: string;
}

export interface BodyLanguage {
  score: number;
  eye_contact: string;
  eye_contact_percentage: number;
  blink_rate_assessment: string;
  gaze_pattern: string;
  posture: string;
  posture_consistency: number;
  spine_alignment_score: number;
  facial_expressions: string;
  smile_authenticity: string;
  micro_expressions_detected: MicroExpression[];
  gesture_effectiveness: string;
  hand_visibility_score: number;
  adaptor_behaviors: string[];
  fidget_frequency: string;
  head_movements: string;
  shoulder_tension_level: string;
  lean_dynamics: string;
  specific_observations: string[];
  virtual_presence_score: number;
  frame_positioning: string;
  lighting_quality: string;
}

export interface VoiceAndTone {
  score: number;
  overall_vocal_quality: string;
  pace: string;
  words_per_minute_estimate: number;
  pace_consistency: number;
  volume_consistency: string;
  volume_level: string;
  pitch_analysis: string;
  vocal_fry_detected: boolean;
  voice_tremor_detected: boolean;
  tone_authority: number;
  tone_warmth: number;
  enthusiasm_quotient: number;
  filler_words_detected: string[];
  filler_word_count: number;
  filler_density_per_minute: number;
  verbal_hedging_instances: string[];
  strategic_pauses_used: number;
  rush_patterns_detected: string[];
  trailing_off_instances: number;
  breath_management: string;
  articulation_clarity: number;
  power_phrases_used: string[];
  sentence_strength: string;
  feedback: string;
}

export interface PersonalityIndicators {
  extraversion_signals: string;
  conscientiousness_signals: string;
  openness_signals: string;
  agreeableness_signals: string;
  emotional_stability_signals: string;
}

export interface PsychologicalInsights {
  baseline_anxiety_level: string;
  emotional_regulation_quality: string;
  thinking_style: string;
  personality_indicators: PersonalityIndicators;
  leadership_markers: string[];
  growth_mindset_indicators: string[];
  cognitive_load_observations: string;
  authenticity_assessment: string;
}

export interface ProfessionalPresence {
  score: number;
  executive_presence_level: string;
  gravitas_score: number;
  composure_rating: string;
  authenticity: string;
  conviction_level: number;
  decisiveness_score: number;
  energy_calibration: string;
  likability_assessment: string;
  rapport_building_ability: number;
  cultural_intelligence: number;
  stress_indicators: string[];
  confidence_trajectory: string;
  overall_impression: string;
  memorable_moments: string[];
  unique_differentiators: string[];
}

export interface KeyMetrics {
  clarity_index: number;
  confidence_score: number;
  engagement_level: number;
  authenticity_rating: number;
  professionalism_score: number;
  likability_factor: number;
  executive_presence: number;
  communication_effectiveness: number;
  stress_management: number;
  interview_readiness: number;
}

export interface ExecutiveSummary {
  overall_score: number;
  hire_recommendation: string;
  hire_probability_percentage: number;
  performance_tier: string;
  percentile_ranking: string;
  one_line_verdict: string;
  three_word_impression: string;
}

export interface FirstImpressionAnalysis {
  score: number;
  first_7_seconds_impact: string;
  initial_energy_level: string;
  opening_hook_effectiveness: number;
  instant_credibility_signals: string[];
  immediate_concerns: string[];
}

export interface CompetitiveAnalysis {
  percentile_ranking: string;
  comparison_to_hired_candidates: string;
  strongest_attributes: string[];
  critical_gaps: string[];
  differentiation_factor: string;
  risk_factors: string[];
}

export interface MomentHighlight {
  timestamp: string;
  type: string;
  category: string;
  observation: string;
  impact: string;
  recommendation: string;
}

export interface ImprovementStep {
  priority: number;
  area: string;
  current_state: string;
  target_state: string;
  action: string;
  practice_method: string;
  expected_impact: string;
  timeline: string;
}

export interface PracticeExercise {
  exercise_name: string;
  target_skill: string;
  instructions: string;
  duration: string;
  frequency: string;
}

export interface FinalVerdict {
  ready_for_interview: boolean;
  recommended_preparation_time: string;
  confidence_in_assessment: number;
  assessor_notes: string;
}

// Detected Languages from Video Analysis
export interface DetectedLanguages {
  primary: string;
  secondary?: string[];
  confidence: number;
  notes?: string;
}

export interface AnalysisResponse {
  candidate_name: string;
  assessment_id: string;
  analysis_timestamp: string;
  question_identified: string;
  question_category: string;
  detectedLanguages?: DetectedLanguages; // Auto-detected languages from video
  // Full transcript of what was spoken in the video
  full_transcript?: string;
  // Line-by-line transcript breakdown with timestamps (deep mode)
  transcript_breakdown?: {
    timestamp: string;
    original_text: string;
    analysis: string;
    improved_version: string;
    score: number;
  }[];
  executive_summary: ExecutiveSummary;
  key_metrics_dashboard: KeyMetrics;
  first_impression_analysis: FirstImpressionAnalysis;
  analysis: {
    content_quality: ContentQuality;
    body_language: BodyLanguage;
    voice_and_tone: VoiceAndTone;
    professional_presence: ProfessionalPresence;
    psychological_insights: PsychologicalInsights;
  };
  competitive_analysis: CompetitiveAnalysis;
  moment_by_moment_highlights: MomentHighlight[];
  improvement_plan: ImprovementStep[];
  practice_exercises: PracticeExercise[];
  quick_wins: string[];
  long_term_development: string[];
  final_verdict: FinalVerdict;
}

// Interview Mode Types
export type InterviewMode = 
  | 'general'
  | 'tech'
  | 'consulting'
  | 'medical'
  | 'sales'
  | 'legal'
  | 'finance'
  | 'creative';

// Language Support
export type AnalysisLanguage = 
  | 'english'
  | 'hindi'
  | 'spanish'
  | 'french'
  | 'german'
  | 'mandarin'
  | 'japanese'
  | 'arabic'
  | 'portuguese';

export interface InterviewModeConfig {
  id: InterviewMode;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  focusAreas: string[];
}

export interface LanguageConfig {
  id: AnalysisLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

// =====================================================
// RESUME CHECKER TYPES
// =====================================================

export interface ResumeSection {
  name: string;
  score: number;
  feedback: string;
  suggestions: string[];
}

// Line-by-line analysis entry for deep resume analysis
export interface ResumeLineAnalysis {
  line_number: number;
  original_text: string;
  category: 'summary' | 'experience' | 'education' | 'skills' | 'contact' | 'other';
  score: number;
  issues: string[];
  improved_version: string;
  explanation: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ResumeAnalysis {
  overall_score: number;
  ats_compatibility_score: number;
  sections: {
    contact_info: ResumeSection;
    summary: ResumeSection;
    experience: ResumeSection;
    education: ResumeSection;
    skills: ResumeSection;
    formatting: ResumeSection;
  };
  keyword_analysis: {
    found_keywords: string[];
    missing_keywords: string[];
    keyword_density: number;
  };
  strengths: string[];
  weaknesses: string[];
  critical_issues: string[];
  improvement_priority: {
    priority: 'high' | 'medium' | 'low';
    issue: string;
    fix: string;
  }[];
  industry_fit: {
    best_fit_roles: string[];
    experience_level: string;
    salary_range_estimate: string;
  };
  action_items: string[];
  rewritten_summary?: string;
  detectedLanguage?: string;
  // Optional requested analysis target company (if user specified one during analysis)
  analysis_target_company?: string;
  // Optional requested analysis target (e.g., 'faang', 'startup')
  analysis_target?: InterviewTarget;
  // Depth of analysis performed
  analysis_depth?: 'quick' | 'standard' | 'deep';
  // Deep analysis: line-by-line breakdown (only in deep mode)
  line_by_line_analysis?: ResumeLineAnalysis[];
  // Deep analysis: word choice improvements
  word_choice_analysis?: { weak_word: string; strong_replacement: string }[];
  // Deep analysis: power verbs that should be used
  power_verbs_missing?: string[];
  // Deep analysis: where to add metrics
  metrics_suggestions?: string[];
  // Deep analysis: industry-specific keywords to add
  industry_keywords_to_add?: string[];
}

// App Mode for navigation
export type AppMode = 'video-analysis' | 'resume-checker';

// Update AppState to include new states
export enum AppState {
  IDLE = 'IDLE',
  MODE_SELECT = 'MODE_SELECT',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  // Resume Checker States
  RESUME_UPLOAD = 'RESUME_UPLOAD',
  RESUME_ANALYZING = 'RESUME_ANALYZING',
  RESUME_RESULT = 'RESUME_RESULT'
}

// Interview Target Types (audience/role expectations) e.g., FAANG, Startup, Mid-size
export type InterviewTarget = 'general' | 'faang' | 'startup' | 'mid-market' | 'manager' | 'executive';