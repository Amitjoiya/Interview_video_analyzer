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

export interface AnalysisResponse {
  candidate_name: string;
  assessment_id: string;
  analysis_timestamp: string;
  question_identified: string;
  question_category: string;
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

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}