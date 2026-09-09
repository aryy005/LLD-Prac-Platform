import { Attempt } from "../../domain/models/Attempt.js";
import { IAttemptRepository } from "../../domain/repositories/IAttemptRepository.js";

export class InMemoryAttemptRepository implements IAttemptRepository {
  private attempts: Map<string, Attempt> = new Map();

  public async findById(id: string): Promise<Attempt | null> {
    return this.attempts.get(id) || null;
  }

  public async findByUserAndProblem(userId: string, problemId: string): Promise<Attempt[]> {
    return Array.from(this.attempts.values())
      .filter(a => a.userId === userId && a.problemId === problemId)
      .sort((a, b) => a.iteration - b.iteration);
  }

  public async countByUserAndProblem(userId: string, problemId: string): Promise<number> {
    const list = await this.findByUserAndProblem(userId, problemId);
    return list.length;
  }

  public async save(attempt: Attempt): Promise<void> {
    this.attempts.set(attempt.id, attempt);
  }
}
