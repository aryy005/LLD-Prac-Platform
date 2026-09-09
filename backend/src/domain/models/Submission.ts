import { SubmissionStatus } from "../enums/index.js";
import { ISubmissionPayload } from "./SubmissionPayload.js";
import { Evaluation } from "./Evaluation.js";

export class Submission {
  public readonly id: string;
  public readonly attemptId: string;
  public readonly version: number;
  public readonly idempotencyKey: string;
  public readonly payload: ISubmissionPayload;
  public status: SubmissionStatus;
  public readonly submittedAt: Date;
  public evaluation?: Evaluation;
  public failureReason?: string;

  constructor(
    id: string,
    attemptId: string,
    version: number,
    idempotencyKey: string,
    payload: ISubmissionPayload,
    status: SubmissionStatus = SubmissionStatus.SUBMITTED,
    submittedAt: Date = new Date()
  ) {
    this.id = id;
    this.attemptId = attemptId;
    this.version = version;
    this.idempotencyKey = idempotencyKey;
    this.payload = payload;
    this.status = status;
    this.submittedAt = submittedAt;
  }

  public markEvaluating(): void {
    if (this.status !== SubmissionStatus.SUBMITTED && this.status !== SubmissionStatus.FAILED) {
      throw new Error(`Cannot transition to EVALUATING from status: ${this.status}`);
    }
    this.status = SubmissionStatus.EVALUATING;
  }

  public attachEvaluation(evaluation: Evaluation): void {
    if (this.status !== SubmissionStatus.EVALUATING) {
      throw new Error(`Cannot attach evaluation when in status: ${this.status}`);
    }
    this.evaluation = evaluation;
    this.status = SubmissionStatus.COMPLETED;
  }

  public markFailed(reason: string): void {
    this.status = SubmissionStatus.FAILED;
    this.failureReason = reason;
  }
}
