import { IAttemptRepository } from "../../domain/repositories/IAttemptRepository.js";
import { Attempt } from "../../domain/models/Attempt.js";

export class GetAttemptHistoryUseCase {
  constructor(private attemptRepo: IAttemptRepository) {}

  public async execute(userId: string, problemId: string): Promise<Attempt[]> {
    return this.attemptRepo.findByUserAndProblem(userId, problemId);
  }
}
