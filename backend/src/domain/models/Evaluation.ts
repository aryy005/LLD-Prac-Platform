import { FeedbackReport } from "./FeedbackReport.js";

export class Evaluation {
  public readonly id: string;
  public readonly submissionId: string;
  public readonly totalScore: number;
  public readonly maxScore: number;
  public readonly scorePercentage: number;
  public readonly report: FeedbackReport;
  public readonly evaluatedAt: Date;

  constructor(
    id: string,
    submissionId: string,
    report: FeedbackReport,
    evaluatedAt: Date = new Date()
  ) {
    this.id = id;
    this.submissionId = submissionId;
    this.report = report;
    this.totalScore = report.calculateTotalScore();
    this.maxScore = report.calculateMaxScore();
    this.scorePercentage = report.getScorePercentage();
    this.evaluatedAt = evaluatedAt;
  }
}
