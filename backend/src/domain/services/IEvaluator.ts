import { Problem } from "../models/Problem.js";
import { Submission } from "../models/Submission.js";
import { FeedbackReport } from "../models/FeedbackReport.js";

export interface IEvaluator {
  readonly name: string;
  evaluate(problem: Problem, submission: Submission): Promise<FeedbackReport>;
}
