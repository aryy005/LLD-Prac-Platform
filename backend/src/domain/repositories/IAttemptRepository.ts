import { Attempt } from "../models/Attempt.js";

export interface IAttemptRepository {
  findById(id: string): Promise<Attempt | null>;
  findByUserAndProblem(userId: string, problemId: string): Promise<Attempt[]>;
  save(attempt: Attempt): Promise<void>;
  countByUserAndProblem(userId: string, problemId: string): Promise<number>;
}
