import { Request, Response } from "express";
import { ListProblemsUseCase } from "../../application/usecases/ListProblemsUseCase.js";
import { GetProblemDetailUseCase } from "../../application/usecases/GetProblemDetailUseCase.js";

export class ProblemController {
  constructor(
    private listProblemsUseCase: ListProblemsUseCase,
    private getProblemDetailUseCase: GetProblemDetailUseCase
  ) {}

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const problems = await this.listProblemsUseCase.execute();
      res.json({ success: true, data: problems });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const problem = await this.getProblemDetailUseCase.execute(req.params.id);
      if (!problem) {
        res.status(404).json({ success: false, error: "Problem not found." });
        return;
      }
      res.json({ success: true, data: problem });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
}
