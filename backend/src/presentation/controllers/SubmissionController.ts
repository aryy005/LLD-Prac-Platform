import { Request, Response } from "express";
import { SubmitSolutionUseCase } from "../../application/usecases/SubmitSolutionUseCase.js";
import { GetSubmissionDetailUseCase } from "../../application/usecases/GetSubmissionDetailUseCase.js";

export class SubmissionController {
  constructor(
    private submitSolutionUseCase: SubmitSolutionUseCase,
    private getSubmissionDetailUseCase: GetSubmissionDetailUseCase
  ) {}

  public submit = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        attemptId,
        requirementsAndAssumptions,
        entitiesAndInterfaces,
        patternsAndTradeoffs,
        diagramOrCode,
        idempotencyKey
      } = req.body;

      if (!attemptId) {
        res.status(400).json({ success: false, error: "attemptId is required." });
        return;
      }

      const submission = await this.submitSolutionUseCase.execute({
        attemptId,
        requirementsAndAssumptions: requirementsAndAssumptions || "",
        entitiesAndInterfaces: entitiesAndInterfaces || [],
        patternsAndTradeoffs: patternsAndTradeoffs || [],
        diagramOrCode,
        idempotencyKey
      });

      res.status(200).json({ success: true, data: submission });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const submission = await this.getSubmissionDetailUseCase.execute(req.params.id);
      if (!submission) {
        res.status(404).json({ success: false, error: "Submission not found." });
        return;
      }
      res.json({ success: true, data: submission });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
}
