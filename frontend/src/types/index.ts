export interface ClassDefinition {
  name: string;
  isInterface?: boolean;
  responsibilities: string;
  fields?: string[];
  methods?: string[];
  relationships?: string[];
}

export interface PatternJustification {
  patternName: string;
  whereApplied: string;
  rationale: string;
}

export interface StarterTemplate {
  requirementsAndAssumptions: string;
  entitiesAndInterfaces: ClassDefinition[];
  patternsAndTradeoffs: PatternJustification[];
  diagramOrCode?: string;
}

export interface RubricCriterion {
  id: string;
  dimension: string;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
}

export interface Rubric {
  id: string;
  name: string;
  criteria: RubricCriterion[];
}

export interface Problem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  requirements: string[];
  constraints: string[];
  rubric: Rubric;
  starterTemplate: StarterTemplate;
  sampleSolution?: StarterTemplate;
}

export interface FeedbackItem {
  criterionId: string;
  criterionName: string;
  dimension: string;
  score: number;
  evidence: string;
  concern: string;
  suggestion: string;
  confidence: number;
}

export interface FeedbackReport {
  items: FeedbackItem[];
  overallSummary: string;
  keyStrengths: string[];
  priorityImprovements: string[];
  evaluatorName: string;
}

export interface Evaluation {
  id: string;
  submissionId: string;
  totalScore: number;
  maxScore: number;
  scorePercentage: number;
  report: FeedbackReport;
  evaluatedAt: string;
}

export interface SubmissionPayload {
  type: string;
  requirementsAndAssumptions: string;
  entitiesAndInterfaces: ClassDefinition[];
  patternsAndTradeoffs: PatternJustification[];
  diagramOrCode?: string;
}

export interface Submission {
  id: string;
  attemptId: string;
  version: number;
  idempotencyKey: string;
  payload: SubmissionPayload;
  status: "DRAFT" | "SUBMITTED" | "EVALUATING" | "COMPLETED" | "FAILED";
  submittedAt: string;
  evaluation?: Evaluation;
  failureReason?: string;
}

export interface Attempt {
  id: string;
  problemId: string;
  userId: string;
  iteration: number;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  startedAt: string;
  completedAt?: string;
  submissions: Submission[];
}
