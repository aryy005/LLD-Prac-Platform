import { Router } from "express";
import { InMemoryProblemRepository } from "../../infrastructure/repositories/InMemoryProblemRepository.js";
import { InMemoryAttemptRepository } from "../../infrastructure/repositories/InMemoryAttemptRepository.js";
import { InMemorySubmissionRepository } from "../../infrastructure/repositories/InMemorySubmissionRepository.js";
import { CompositeEvaluator } from "../../infrastructure/evaluators/CompositeEvaluator.js";

import { ListProblemsUseCase } from "../../application/usecases/ListProblemsUseCase.js";
import { GetProblemDetailUseCase } from "../../application/usecases/GetProblemDetailUseCase.js";
import { StartAttemptUseCase } from "../../application/usecases/StartAttemptUseCase.js";
import { SubmitSolutionUseCase } from "../../application/usecases/SubmitSolutionUseCase.js";
import { GetAttemptHistoryUseCase } from "../../application/usecases/GetAttemptHistoryUseCase.js";
import { GetSubmissionDetailUseCase } from "../../application/usecases/GetSubmissionDetailUseCase.js";

import { ProblemController } from "../controllers/ProblemController.js";
import { AttemptController } from "../controllers/AttemptController.js";
import { SubmissionController } from "../controllers/SubmissionController.js";

export function createApiRouter(): Router {
  const router = Router();

  // Repositories
  const problemRepo = new InMemoryProblemRepository();
  const attemptRepo = new InMemoryAttemptRepository();
  const submissionRepo = new InMemorySubmissionRepository();

  // Evaluator
  const compositeEvaluator = new CompositeEvaluator();

  // Use Cases
  const listProblemsUseCase = new ListProblemsUseCase(problemRepo);
  const getProblemDetailUseCase = new GetProblemDetailUseCase(problemRepo);
  const startAttemptUseCase = new StartAttemptUseCase(attemptRepo, problemRepo);
  const submitSolutionUseCase = new SubmitSolutionUseCase(
    attemptRepo,
    problemRepo,
    submissionRepo,
    compositeEvaluator
  );
  const getAttemptHistoryUseCase = new GetAttemptHistoryUseCase(attemptRepo);
  const getSubmissionDetailUseCase = new GetSubmissionDetailUseCase(submissionRepo);

  // Controllers
  const problemController = new ProblemController(listProblemsUseCase, getProblemDetailUseCase);
  const attemptController = new AttemptController(startAttemptUseCase, getAttemptHistoryUseCase);
  const submissionController = new SubmissionController(submitSolutionUseCase, getSubmissionDetailUseCase);

  // Routes
  router.get("/problems", problemController.getAll);
  router.get("/problems/:id", problemController.getById);

  router.post("/attempts/start", attemptController.start);
  router.get("/attempts/history/:problemId", attemptController.getHistory);

  router.post("/submissions", submissionController.submit);
  router.get("/submissions/:id", submissionController.getById);

  return router;
}
