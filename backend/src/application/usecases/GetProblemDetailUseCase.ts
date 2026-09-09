import { IProblemRepository } from "../../domain/repositories/IProblemRepository.js";
import { Problem } from "../../domain/models/Problem.js";

export class GetProblemDetailUseCase {
  constructor(private problemRepo: IProblemRepository) {}

  public async execute(problemId: string): Promise<Problem | null> {
    return this.problemRepo.findById(problemId);
  }
}
