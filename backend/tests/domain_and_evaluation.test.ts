import { describe, it, expect } from "vitest";
import { Attempt } from "../src/domain/models/Attempt.js";
import { Submission } from "../src/domain/models/Submission.js";
import { Evaluation } from "../src/domain/models/Evaluation.js";
import { FeedbackReport } from "../src/domain/models/FeedbackReport.js";
import { StructuredTextPayload } from "../src/domain/models/SubmissionPayload.js";
import { SubmissionStatus, AttemptStatus, RubricDimension } from "../src/domain/enums/index.js";
import { SEED_PROBLEMS } from "../src/infrastructure/seed/problems.js";
import { DeterministicRuleEvaluator } from "../src/infrastructure/evaluators/DeterministicRuleEvaluator.js";
import { SemanticRuleEvaluator } from "../src/infrastructure/evaluators/SemanticRuleEvaluator.js";
import { CompositeEvaluator } from "../src/infrastructure/evaluators/CompositeEvaluator.js";
import { InMemoryProblemRepository } from "../src/infrastructure/repositories/InMemoryProblemRepository.js";
import { InMemoryAttemptRepository } from "../src/infrastructure/repositories/InMemoryAttemptRepository.js";
import { InMemorySubmissionRepository } from "../src/infrastructure/repositories/InMemorySubmissionRepository.js";
import { StartAttemptUseCase } from "../src/application/usecases/StartAttemptUseCase.js";
import { SubmitSolutionUseCase } from "../src/application/usecases/SubmitSolutionUseCase.js";
import { GetAttemptHistoryUseCase } from "../src/application/usecases/GetAttemptHistoryUseCase.js";

describe("Domain Models & State Transitions", () => {
  it("should enforce valid submission state transitions", () => {
    const payload = new StructuredTextPayload("Assumptions", [], []);
    const submission = new Submission("sub-1", "att-1", 1, "idem-1", payload, SubmissionStatus.SUBMITTED);

    expect(submission.status).toBe(SubmissionStatus.SUBMITTED);

    submission.markEvaluating();
    expect(submission.status).toBe(SubmissionStatus.EVALUATING);

    // Should fail if trying to mark evaluating again
    expect(() => submission.markEvaluating()).toThrow(/Cannot transition to EVALUATING/);

    // Attach evaluation
    const report = new FeedbackReport({
      items: [],
      overallSummary: "Good",
      keyStrengths: [],
      priorityImprovements: [],
      evaluatorName: "test"
    });
    const evaluation = new Evaluation("eval-1", submission.id, report);
    submission.attachEvaluation(evaluation);

    expect(submission.status).toBe(SubmissionStatus.COMPLETED);
    expect(submission.evaluation).toBeDefined();

    // Should fail if attempting to attach evaluation when not in EVALUATING state
    expect(() => submission.attachEvaluation(evaluation)).toThrow(/Cannot attach evaluation when in status: COMPLETED/);
  });

  it("should enforce idempotency in Attempt.createSubmission", () => {
    const attempt = new Attempt("att-1", "parking-lot");
    const payload = new StructuredTextPayload("Test", [], []);

    const sub1 = attempt.createSubmission("sub-1", payload, "key-abc");
    const sub2 = attempt.createSubmission("sub-2", payload, "key-abc");

    expect(sub1.id).toBe(sub2.id);
    expect(attempt.submissions.length).toBe(1);
  });
});

describe("Evaluator Strategies", () => {
  const parkingProblem = SEED_PROBLEMS.find(p => p.id === "parking-lot")!;

  it("DeterministicRuleEvaluator detects God Class and missing entities", async () => {
    const evaluator = new DeterministicRuleEvaluator();

    // Submission with a god object and missing ParkingSpot/Ticket
    const payload = new StructuredTextPayload(
      "Short", // too short assumptions
      [
        {
          name: "MonolithicGodManager",
          responsibilities: "Does everything: manages spots, prints tickets, calculates billing, gates, sensors, notifications, audits, cleanups.",
          methods: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9"]
        }
      ],
      []
    );
    const submission = new Submission("sub-test", "att-test", 1, "key-1", payload);

    const checks = evaluator.evaluateRules(parkingProblem, submission);
    expect(checks.hasSufficientAssumptions).toBe(false);
    expect(checks.godClassCandidates).toContain("MonolithicGodManager");
    expect(checks.missingKeyEntities.length).toBeGreaterThan(0);

    const report = await evaluator.evaluate(parkingProblem, submission);
    const srpItem = report.items.find(i => i.criterionId === "crit-srp");
    expect(srpItem?.score).toBeLessThanOrEqual(2);
    expect(srpItem?.evidence).toContain("MonolithicGodManager");
  });

  it("CompositeEvaluator synthesizes deterministic checks with rubric feedback", async () => {
    const composite = new CompositeEvaluator();
    const sample = parkingProblem.sampleSolution!;
    const payload = new StructuredTextPayload(
      sample.requirementsAndAssumptions,
      sample.entitiesAndInterfaces,
      sample.patternsAndTradeoffs,
      sample.diagramOrCode
    );
    const submission = new Submission("sub-sample", "att-sample", 1, "key-sample", payload);

    const report = await composite.evaluate(parkingProblem, submission);

    expect(report.items.length).toBe(5);
    const totalScore = report.calculateTotalScore();
    expect(totalScore).toBeGreaterThanOrEqual(20); // High quality sample should score >= 20/25
    expect(report.keyStrengths.length).toBeGreaterThan(0);
  });
});

describe("End-to-End Learner Journey & Iteration Tracking", () => {
  it("records multiple attempts and demonstrates learning progression", async () => {
    const problemRepo = new InMemoryProblemRepository();
    const attemptRepo = new InMemoryAttemptRepository();
    const submissionRepo = new InMemorySubmissionRepository();
    const evaluator = new CompositeEvaluator();

    const startAttempt = new StartAttemptUseCase(attemptRepo, problemRepo);
    const submitSolution = new SubmitSolutionUseCase(attemptRepo, problemRepo, submissionRepo, evaluator);
    const getHistory = new GetAttemptHistoryUseCase(attemptRepo);

    // Iteration 1: Naive submission
    const attempt1 = await startAttempt.execute({
      problemId: "parking-lot",
      userId: "alice",
      forceNewIteration: true
    });
    expect(attempt1.iteration).toBe(1);

    const sub1 = await submitSolution.execute({
      attemptId: attempt1.id,
      requirementsAndAssumptions: "Simple parking lot with cars and bikes.",
      entitiesAndInterfaces: [
        {
          name: "ParkingLot",
          responsibilities: "Does everything: slots, payment, gates",
          methods: ["park()", "unpark()", "pay()"]
        }
      ],
      patternsAndTradeoffs: []
    });

    expect(sub1.status).toBe(SubmissionStatus.COMPLETED);
    const score1 = sub1.evaluation!.totalScore;

    // Iteration 2: Refactored with patterns, interface, and concurrency
    const attempt2 = await startAttempt.execute({
      problemId: "parking-lot",
      userId: "alice",
      forceNewIteration: true
    });
    expect(attempt2.iteration).toBe(2);

    const sample = SEED_PROBLEMS.find(p => p.id === "parking-lot")!.sampleSolution!;
    const sub2 = await submitSolution.execute({
      attemptId: attempt2.id,
      requirementsAndAssumptions: sample.requirementsAndAssumptions,
      entitiesAndInterfaces: sample.entitiesAndInterfaces,
      patternsAndTradeoffs: sample.patternsAndTradeoffs,
      diagramOrCode: sample.diagramOrCode
    });

    expect(sub2.status).toBe(SubmissionStatus.COMPLETED);
    const score2 = sub2.evaluation!.totalScore;

    // Learning loop validated: Attempt 2 demonstrates clear improvement
    expect(score2).toBeGreaterThan(score1);

    // Verify history retrieves both attempts in sequence
    const history = await getHistory.execute("alice", "parking-lot");
    expect(history.length).toBe(2);
    expect(history[0].iteration).toBe(1);
    expect(history[1].iteration).toBe(2);
  });
});
