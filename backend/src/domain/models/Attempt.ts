import { AttemptStatus, SubmissionStatus } from "../enums/index.js";
import { Submission } from "./Submission.js";
import { ISubmissionPayload } from "./SubmissionPayload.js";

export class Attempt {
  public readonly id: string;
  public readonly problemId: string;
  public readonly userId: string;
  public readonly iteration: number;
  public status: AttemptStatus;
  public readonly startedAt: Date;
  public completedAt?: Date;
  public submissions: Submission[];

  constructor(
    id: string,
    problemId: string,
    userId: string = "learner-default",
    iteration: number = 1,
    status: AttemptStatus = AttemptStatus.IN_PROGRESS,
    startedAt: Date = new Date(),
    submissions: Submission[] = []
  ) {
    this.id = id;
    this.problemId = problemId;
    this.userId = userId;
    this.iteration = iteration;
    this.status = status;
    this.startedAt = startedAt;
    this.submissions = submissions;
  }

  public createSubmission(
    submissionId: string,
    payload: ISubmissionPayload,
    idempotencyKey: string
  ): Submission {
    // Check if an existing submission matches this idempotency key
    const existing = this.submissions.find(s => s.idempotencyKey === idempotencyKey);
    if (existing) {
      return existing;
    }

    const version = this.submissions.length + 1;
    const submission = new Submission(
      submissionId,
      this.id,
      version,
      idempotencyKey,
      payload,
      SubmissionStatus.SUBMITTED
    );

    this.submissions.push(submission);
    return submission;
  }

  public getLatestSubmission(): Submission | undefined {
    if (this.submissions.length === 0) return undefined;
    return this.submissions[this.submissions.length - 1];
  }

  public complete(): void {
    this.status = AttemptStatus.COMPLETED;
    this.completedAt = new Date();
  }
}
