import { Request, Response } from "express";
import { StartAttemptUseCase } from "../../application/usecases/StartAttemptUseCase.js";
import { GetAttemptHistoryUseCase } from "../../application/usecases/GetAttemptHistoryUseCase.js";

export class AttemptController {
  constructor(
    private startAttemptUseCase: StartAttemptUseCase,
    private getAttemptHistoryUseCase: GetAttemptHistoryUseCase
  ) {}

  public start = async (req: Request, res: Response): Promise<void> => {
    try {
      const { problemId, userId, forceNewIteration } = req.body;
      if (!problemId) {
        res.status(400).json({ success: false, error: "problemId is required." });
        return;
      }
      const attempt = await this.startAttemptUseCase.execute({
        problemId,
        userId: userId || "learner-default",
        forceNewIteration: !!forceNewIteration
      });
      res.status(201).json({ success: true, data: attempt });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

  public getHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const problemId = req.params.problemId;
      const userId = (req.query.userId as string) || "learner-default";
      const history = await this.getAttemptHistoryUseCase.execute(userId, problemId);
      res.json({ success: true, data: history });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
}
