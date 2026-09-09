import { v4 as uuidv4 } from "uuid";
import { IAttemptRepository } from "../../domain/repositories/IAttemptRepository.js";
import { IProblemRepository } from "../../domain/repositories/IProblemRepository.js";
import { Attempt } from "../../domain/models/Attempt.js";
import { AttemptStatus } from "../../domain/enums/index.js";

export interface StartAttemptInput {
  problemId: string;
  userId?: string;
  forceNewIteration?: boolean;
}

export class StartAttemptUseCase {
  constructor(
    private attemptRepo: IAttemptRepository,
    private problemRepo: IProblemRepository
  ) {}

  public async execute(input: StartAttemptInput): Promise<Attempt> {
    const userId = input.userId || "default-learner";
    const problem = await this.problemRepo.findById(input.problemId);
    if (!problem) {
      throw new Error(`Problem with ID '${input.problemId}' not found.`);
    }

    const previousAttempts = await this.attemptRepo.findByUserAndProblem(userId, input.problemId);

    // If user has an existing attempt that is still in progress and didn't force new iteration, return it
    if (!input.forceNewIteration && previousAttempts.length > 0) {
      const active = previousAttempts.find(a => a.status === AttemptStatus.IN_PROGRESS);
      if (active) {
        return active;
      }
    }

    const nextIteration = previousAttempts.length + 1;
    const attemptId = `att-${uuidv4()}`;

    const newAttempt = new Attempt(
      attemptId,
      input.problemId,
      userId,
      nextIteration,
      AttemptStatus.IN_PROGRESS,
      new Date(),
      []
    );

    await this.attemptRepo.save(newAttempt);
    return newAttempt;
  }
}
