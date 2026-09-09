import { IEvaluator } from "../../domain/services/IEvaluator.js";
import { Problem } from "../../domain/models/Problem.js";
import { Submission } from "../../domain/models/Submission.js";
import { FeedbackReport } from "../../domain/models/FeedbackReport.js";
import { FeedbackItem } from "../../domain/models/FeedbackItem.js";
import { RubricDimension } from "../../domain/enums/index.js";

export interface DeterministicCheckResult {
  hasSufficientAssumptions: boolean;
  entityCount: number;
  hasInterfaces: boolean;
  godClassCandidates: string[];
  missingKeyEntities: string[];
}

export class DeterministicRuleEvaluator implements IEvaluator {
  public readonly name = "DeterministicRuleEvaluator";

  public evaluateRules(problem: Problem, submission: Submission): DeterministicCheckResult {
    const payload = submission.payload;
    const assumptions = payload.requirementsAndAssumptions || "";
    const entities = payload.entitiesAndInterfaces || [];

    const hasSufficientAssumptions = assumptions.trim().length > 30;
    const entityCount = entities.length;
    const hasInterfaces = entities.some(e => e.isInterface || e.name.startsWith("I") || (e.relationships || []).some(r => r.toLowerCase().includes("interface")));

    // Detect God Class: entity with excessive methods/responsibilities
    const godClassCandidates: string[] = [];
    entities.forEach(e => {
      const methodCount = (e.methods || []).length;
      const respLength = (e.responsibilities || "").length;
      if (methodCount >= 8 || respLength > 250) {
        godClassCandidates.push(e.name);
      }
    });

    // Check problem-specific core entity requirements
    const missingKeyEntities: string[] = [];
    const entityNamesUpper = entities.map(e => e.name.toUpperCase());

    if (problem.id === "parking-lot") {
      if (!entityNamesUpper.some(n => n.includes("PARKING") || n.includes("LOT"))) {
        missingKeyEntities.push("ParkingLot (Facade/Coordinator)");
      }
      if (!entityNamesUpper.some(n => n.includes("SPOT") || n.includes("SPACE") || n.includes("SLOT"))) {
        missingKeyEntities.push("ParkingSpot / Slot");
      }
      if (!entityNamesUpper.some(n => n.includes("TICKET") || n.includes("RECEIPT"))) {
        missingKeyEntities.push("Ticket / Entry Record");
      }
    } else if (problem.id === "elevator-system") {
      if (!entityNamesUpper.some(n => n.includes("ELEVATOR") || n.includes("CAR"))) {
        missingKeyEntities.push("ElevatorCar");
      }
      if (!entityNamesUpper.some(n => n.includes("DISPATCH") || n.includes("CONTROLLER") || n.includes("SCHEDUL"))) {
        missingKeyEntities.push("Dispatcher / ElevatorController");
      }
    } else if (problem.id === "vending-machine") {
      if (!entityNamesUpper.some(n => n.includes("STATE") || n.includes("VENDING"))) {
        missingKeyEntities.push("VendingState / Context");
      }
      if (!entityNamesUpper.some(n => n.includes("INVENTORY") || n.includes("ITEM") || n.includes("PRODUCT"))) {
        missingKeyEntities.push("Inventory / Product");
      }
    }

    return {
      hasSufficientAssumptions,
      entityCount,
      hasInterfaces,
      godClassCandidates,
      missingKeyEntities
    };
  }

  public async evaluate(problem: Problem, submission: Submission): Promise<FeedbackReport> {
    const checks = this.evaluateRules(problem, submission);
    const items: FeedbackItem[] = [];

    // Check 1: Requirement understanding
    const reqScore = checks.hasSufficientAssumptions ? 4 : 2;
    items.push(
      new FeedbackItem({
        criterionId: "crit-req",
        criterionName: "Requirements & Scope Understanding",
        dimension: RubricDimension.REQUIREMENT_UNDERSTANDING,
        score: reqScore,
        evidence: checks.hasSufficientAssumptions
          ? `Provided ${submission.payload.requirementsAndAssumptions.slice(0, 100)}...`
          : "Assumptions section is empty or very brief (< 30 characters).",
        concern: checks.hasSufficientAssumptions
          ? "Ensure edge-case boundary conditions are fully enumerated."
          : "Insufficient problem assumptions. Real-world LLD requires clarifying capacity, concurrency, and operating constraints.",
        suggestion: checks.hasSufficientAssumptions
          ? "Consider detailing specific SLAs, failure modes, and peak load assumptions."
          : "Explicitly document non-functional assumptions such as concurrency, scale, and supported payment/input modes.",
        confidence: 1.0
      })
    );

    // Check 2: Responsibilities / SRP
    const srpScore = checks.godClassCandidates.length > 0 ? 2 : checks.entityCount >= 3 ? 4 : 2;
    items.push(
      new FeedbackItem({
        criterionId: "crit-srp",
        criterionName: "Class Responsibilities & SRP",
        dimension: RubricDimension.CLASS_RESPONSIBILITY,
        score: srpScore,
        evidence: checks.godClassCandidates.length > 0
          ? `Classes with potential god-object smell: ${checks.godClassCandidates.join(", ")}`
          : `Defined ${checks.entityCount} entities with segregated responsibilities.`,
        concern: checks.godClassCandidates.length > 0
          ? `Classes like ${checks.godClassCandidates[0]} take on too many coordination, calculation, and persistence tasks.`
          : "Verify that entity responsibilities don't bleed into UI or persistence concerns.",
        suggestion: checks.godClassCandidates.length > 0
          ? `Decompose ${checks.godClassCandidates[0]} by extracting business policies (pricing, dispatching) into distinct classes.`
          : "Keep class responsibilities lean and delegate algorithmic logic to dedicated strategy classes.",
        confidence: 0.95
      })
    );

    return new FeedbackReport({
      items,
      overallSummary: `Deterministic structural check completed. Found ${checks.entityCount} entities.`,
      keyStrengths: checks.hasInterfaces ? ["Uses interface abstractions", "Clear entity separation"] : ["Base entity structure established"],
      priorityImprovements: checks.missingKeyEntities.length > 0 ? [`Add missing key domain entities: ${checks.missingKeyEntities.join(", ")}`] : ["Deepen edge case considerations"],
      evaluatorName: this.name
    });
  }
}
