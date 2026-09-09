import { RubricDimension } from "../enums/index.js";

export interface FeedbackItemProps {
  criterionId: string;
  criterionName: string;
  dimension: RubricDimension;
  score: number; // 1 to 5
  evidence: string; // Direct citation/reference to what candidate wrote
  concern: string; // The architectural risk or deficiency identified
  suggestion: string; // Actionable, specific design refactoring advice
  confidence: number; // 0.0 to 1.0 confidence level
}

export class FeedbackItem {
  public readonly criterionId: string;
  public readonly criterionName: string;
  public readonly dimension: RubricDimension;
  public readonly score: number;
  public readonly evidence: string;
  public readonly concern: string;
  public readonly suggestion: string;
  public readonly confidence: number;

  constructor(props: FeedbackItemProps) {
    if (!props.criterionId) throw new Error("FeedbackItem requires criterionId.");
    if (props.score < 0 || props.score > 5) throw new Error("Score must be between 0 and 5.");
    this.criterionId = props.criterionId;
    this.criterionName = props.criterionName;
    this.dimension = props.dimension;
    this.score = props.score;
    this.evidence = props.evidence;
    this.concern = props.concern;
    this.suggestion = props.suggestion;
    this.confidence = Math.min(1.0, Math.max(0.0, props.confidence));
  }
}
