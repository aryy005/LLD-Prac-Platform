import { v4 as uuidv4 } from "uuid";
import { IAttemptRepository } from "../../domain/repositories/IAttemptRepository.js";
import { IProblemRepository } from "../../domain/repositories/IProblemRepository.js";
import { ISubmissionRepository } from "../../domain/repositories/ISubmissionRepository.js";
import { IEvaluator } from "../../domain/services/IEvaluator.js";
import { StructuredTextPayload, ClassDefinition, PatternJustification } from "../../domain/models/SubmissionPayload.js";
import { Evaluation } from "../../domain/models/Evaluation.js";
import { Submission } from "../../domain/models/Submission.js";
import { SubmissionStatus } from "../../domain/enums/index.js";

export interface SubmitSolutionInput {
  attemptId: string;
  requirementsAndAssumptions: string;
  entitiesAndInterfaces: ClassDefinition[];
  patternsAndTradeoffs: PatternJustification[];
  diagramOrCode?: string;
  idempotencyKey?: string;
}

export class SubmitSolutionUseCase {
  constructor(
    private attemptRepo: IAttemptRepository,
    private problemRepo: IProblemRepository,
    private submissionRepo: ISubmissionRepository,
    private evaluator: IEvaluator
  ) {}

  public async execute(input: SubmitSolutionInput): Promise<Submission> {
    const attempt = await this.attemptRepo.findById(input.attemptId);
    if (!attempt) {
      throw new Error(`Attempt with ID '${input.attemptId}' not found.`);
    }

    const problem = await this.problemRepo.findById(attempt.problemId);
    if (!problem) {
      throw new Error(`Problem with ID '${attempt.problemId}' not found.`);
    }

    const idempotencyKey =
      input.idempotencyKey ||
      `idem-${attempt.id}-${attempt.submissions.length + 1}`;

    // 1. Idempotency Check: if identical submission already completed, return existing
    const existing = attempt.submissions.find(s => s.idempotencyKey === idempotencyKey);
    if (existing && existing.status === SubmissionStatus.COMPLETED) {
      return existing;
    }

    // 2. Formulate Payload
    const payload = new StructuredTextPayload(
      input.requirementsAndAssumptions,
      input.entitiesAndInterfaces,
      input.patternsAndTradeoffs,
      input.diagramOrCode
    );

    // 3. Persist Submission First (SUBMITTED state) - Zero Data Loss
    const submissionId = `sub-${uuidv4()}`;
    const submission = attempt.createSubmission(submissionId, payload, idempotencyKey);
    await this.submissionRepo.save(submission);
    await this.attemptRepo.save(attempt);

    // 4. Run Evaluation Pipeline
    try {
      submission.markEvaluating();
      await this.submissionRepo.save(submission);

      const feedbackReport = await this.evaluator.evaluate(problem, submission);

      const evaluationId = `eval-${uuidv4()}`;
      const evaluation = new Evaluation(evaluationId, submission.id, feedbackReport);

      submission.attachEvaluation(evaluation);
      attempt.complete(); // Mark attempt completed after successful evaluation

      await this.submissionRepo.save(submission);
      await this.attemptRepo.save(attempt);

      return submission;
    } catch (err: any) {
      submission.markFailed(err?.message || "Evaluation encountered an unhandled error.");
      await this.submissionRepo.save(submission);
      await this.attemptRepo.save(attempt);
      throw err;
    }
  }
}
