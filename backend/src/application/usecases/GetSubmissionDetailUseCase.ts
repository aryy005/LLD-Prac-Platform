import { ISubmissionRepository } from "../../domain/repositories/ISubmissionRepository.js";
import { Submission } from "../../domain/models/Submission.js";

export class GetSubmissionDetailUseCase {
  constructor(private submissionRepo: ISubmissionRepository) {}

  public async execute(submissionId: string): Promise<Submission | null> {
    return this.submissionRepo.findById(submissionId);
  }
}
