import { Submission } from "../../domain/models/Submission.js";
import { ISubmissionRepository } from "../../domain/repositories/ISubmissionRepository.js";

export class InMemorySubmissionRepository implements ISubmissionRepository {
  private submissions: Map<string, Submission> = new Map();

  public async findById(id: string): Promise<Submission | null> {
    return this.submissions.get(id) || null;
  }

  public async findByAttemptId(attemptId: string): Promise<Submission[]> {
    return Array.from(this.submissions.values())
      .filter(s => s.attemptId === attemptId)
      .sort((a, b) => a.version - b.version);
  }

  public async save(submission: Submission): Promise<void> {
    this.submissions.set(submission.id, submission);
  }
}
