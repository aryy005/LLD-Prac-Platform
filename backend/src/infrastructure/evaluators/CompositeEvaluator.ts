import { IEvaluator } from "../../domain/services/IEvaluator.js";
import { Problem } from "../../domain/models/Problem.js";
import { Submission } from "../../domain/models/Submission.js";
import { FeedbackReport } from "../../domain/models/FeedbackReport.js";
import { FeedbackItem } from "../../domain/models/FeedbackItem.js";
import { DeterministicRuleEvaluator } from "./DeterministicRuleEvaluator.js";
import { GeminiLlmEvaluator } from "./GeminiLlmEvaluator.js";
import { SemanticRuleEvaluator } from "./SemanticRuleEvaluator.js";

export class CompositeEvaluator implements IEvaluator {
  public readonly name = "CompositeEvaluator (Deterministic Gatekeeper + Intelligent Rubric)";
  private deterministicEvaluator: DeterministicRuleEvaluator;
  private intelligentEvaluator: IEvaluator;

  constructor(
    deterministicEvaluator = new DeterministicRuleEvaluator(),
    intelligentEvaluator: IEvaluator = process.env.GEMINI_API_KEY
      ? new GeminiLlmEvaluator()
      : new SemanticRuleEvaluator()
  ) {
    this.deterministicEvaluator = deterministicEvaluator;
    this.intelligentEvaluator = intelligentEvaluator;
  }

  public async evaluate(problem: Problem, submission: Submission): Promise<FeedbackReport> {
    // 1. Run deterministic checks first
    const ruleChecks = this.deterministicEvaluator.evaluateRules(problem, submission);

    // 2. Run intelligent/rubric evaluation
    const deepReport = await this.intelligentEvaluator.evaluate(problem, submission);

    // 3. Synthesize items: If deterministic checks identified missing key entities or god classes,
    // ensure those concrete deterministic findings enrich the final feedback report.
    const enrichedItems: FeedbackItem[] = deepReport.items.map(item => {
      // If God class was detected, enforce penalty on SRP
      if (item.criterionId === "crit-srp" && ruleChecks.godClassCandidates.length > 0) {
        return new FeedbackItem({
          criterionId: item.criterionId,
          criterionName: item.criterionName,
          dimension: item.dimension,
          score: Math.min(item.score, 2),
          evidence: `Deterministic inspection detected God Object candidate(s): ${ruleChecks.godClassCandidates.join(", ")}.`,
          concern: `Class '${ruleChecks.godClassCandidates[0]}' owns too many methods or responsibilities.`,
          suggestion: `Decompose '${ruleChecks.godClassCandidates[0]}' by extracting business calculations or policy algorithms into dedicated Strategy classes.`,
          confidence: 1.0
        });
      }

      // If missing core domain entities detected
      if (item.criterionId === "crit-req" && ruleChecks.missingKeyEntities.length > 0) {
        return new FeedbackItem({
          criterionId: item.criterionId,
          criterionName: item.criterionName,
          dimension: item.dimension,
          score: Math.min(item.score, 3),
          evidence: `Omitted canonical domain entities for ${problem.title}: ${ruleChecks.missingKeyEntities.join(", ")}.`,
          concern: "Missing foundational domain entities required to fulfill core user journeys.",
          suggestion: `Introduce explicitly: ${ruleChecks.missingKeyEntities.join(", ")}.`,
          confidence: 1.0
        });
      }

      return item;
    });

    const keyStrengths = [...deepReport.keyStrengths];
    if (ruleChecks.hasInterfaces && !keyStrengths.some(s => s.toLowerCase().includes("interface"))) {
      keyStrengths.push("Good adoption of interface abstractions");
    }

    const priorityImprovements = [...deepReport.priorityImprovements];
    if (ruleChecks.missingKeyEntities.length > 0) {
      priorityImprovements.unshift(`Add missing key entities: ${ruleChecks.missingKeyEntities.join(", ")}`);
    }

    return new FeedbackReport({
      items: enrichedItems,
      overallSummary: deepReport.overallSummary,
      keyStrengths: Array.from(new Set(keyStrengths)),
      priorityImprovements: Array.from(new Set(priorityImprovements)),
      evaluatorName: this.name
    });
  }
}
