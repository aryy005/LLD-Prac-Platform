import { FeedbackItem } from "./FeedbackItem.js";

export interface FeedbackReportProps {
  items: FeedbackItem[];
  overallSummary: string;
  keyStrengths: string[];
  priorityImprovements: string[];
  evaluatorName: string;
}

export class FeedbackReport {
  public readonly items: FeedbackItem[];
  public readonly overallSummary: string;
  public readonly keyStrengths: string[];
  public readonly priorityImprovements: string[];
  public readonly evaluatorName: string;

  constructor(props: FeedbackReportProps) {
    this.items = props.items;
    this.overallSummary = props.overallSummary;
    this.keyStrengths = props.keyStrengths;
    this.priorityImprovements = props.priorityImprovements;
    this.evaluatorName = props.evaluatorName;
  }

  public calculateTotalScore(): number {
    return this.items.reduce((sum, item) => sum + item.score, 0);
  }

  public calculateMaxScore(): number {
    return this.items.length * 5;
  }

  public getScorePercentage(): number {
    const max = this.calculateMaxScore();
    return max > 0 ? Math.round((this.calculateTotalScore() / max) * 100) : 0;
  }
}
