import { Problem } from "../../domain/models/Problem.js";
import { IProblemRepository } from "../../domain/repositories/IProblemRepository.js";
import { SEED_PROBLEMS } from "../seed/problems.js";

export class InMemoryProblemRepository implements IProblemRepository {
  private problems: Map<string, Problem> = new Map();

  constructor(initialProblems: Problem[] = SEED_PROBLEMS) {
    initialProblems.forEach(p => this.problems.set(p.id, p));
  }

  public async findAll(): Promise<Problem[]> {
    return Array.from(this.problems.values());
  }

  public async findById(id: string): Promise<Problem | null> {
    return this.problems.get(id) || null;
  }
}
