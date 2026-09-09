import { Submission } from "../models/Submission.js";

export interface ISubmissionRepository {
  findById(id: string): Promise<Submission | null>;
  findByAttemptId(attemptId: string): Promise<Submission[]>;
  save(submission: Submission): Promise<void>;
}
