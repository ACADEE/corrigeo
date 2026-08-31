export interface StudentInfo {
  first_name: string;
  last_name: string;
  class_name: string;
  date: string;
}

export interface OCRQuality {
  confidence: number;
  warnings: string[];
}

export interface GlobalAssessment {
  score: number;
  score_max: number;
  level: string;
  summary_teacher: string;
  summary_student: string;
}

export interface Criterion {
  name: string;
  score: number;
  score_max: number;
  comment: string;
}

export interface DetectedError {
  type: string;
  sentence_context?: string;
  original: string;
  suggestion: string;
  explanation: string;
}

export interface Exercise {
  priority_reference: string;
  instruction: string;
  expected_answer: string;
}

export interface ExercisesResponse {
  lesson: string;
  exercises: Exercise[];
}

export interface AnalysisResponse {
  student_detected: StudentInfo;
  ocr_quality: OCRQuality;
  global_assessment: GlobalAssessment;
  criteria: Criterion[];
  detected_errors: DetectedError[];
  strengths: string[];
  improvement_priorities: string[];
  teacher_validation_required: boolean;
  extracted_text: string;
}
