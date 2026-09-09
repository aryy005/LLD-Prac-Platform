import { IProblemRepository } from "../../domain/repositories/IProblemRepository.js";
import { Problem } from "../../domain/models/Problem.js";

export class ListProblemsUseCase {
  constructor(private problemRepo: IProblemRepository) {}

  public async execute(): Promise<Problem[]> {
    return this.problemRepo.findAll();
  }
}
