import { IEvaluator } from "../../domain/services/IEvaluator.js";
import { Problem } from "../../domain/models/Problem.js";
import { Submission } from "../../domain/models/Submission.js";
import { FeedbackReport } from "../../domain/models/FeedbackReport.js";
import { FeedbackItem } from "../../domain/models/FeedbackItem.js";
import { RubricDimension } from "../../domain/enums/index.js";

export class SemanticRuleEvaluator implements IEvaluator {
  public readonly name = "SemanticRuleEvaluator (Heuristic Engine)";

  public async evaluate(problem: Problem, submission: Submission): Promise<FeedbackReport> {
    const payload = submission.payload;
    const assumptions = (payload.requirementsAndAssumptions || "").toLowerCase();
    const entities = payload.entitiesAndInterfaces || [];
    const patterns = payload.patternsAndTradeoffs || [];
    const diagramOrCode = (payload.diagramOrCode || "").toLowerCase();

    const items: FeedbackItem[] = [];
    const keyStrengths: string[] = [];
    const priorityImprovements: string[] = [];

    // --- 1. Requirements & Scope Understanding ---
    let reqScore = 3;
    let reqEvidence = "";
    let reqConcern = "";
    let reqSuggestion = "";

    const hasConcurrencyMention = assumptions.includes("concurr") || assumptions.includes("lock") || assumptions.includes("thread") || assumptions.includes("race");
    const hasCapacityMention = assumptions.includes("floor") || assumptions.includes("capacity") || assumptions.includes("scale") || assumptions.includes("limit");
    const hasScopeClarity = assumptions.length > 80;

    if (hasScopeClarity && hasConcurrencyMention && hasCapacityMention) {
      reqScore = 5;
      reqEvidence = `Assumptions clearly address concurrency, capacity, and scope bounds (${payload.requirementsAndAssumptions.slice(0, 80)}...).`;
      reqConcern = "None significant; requirements context is solid.";
      reqSuggestion = "Maintain this clarity by explicitly declaring non-goals or out-of-scope features.";
      keyStrengths.push("Thorough requirements breakdown including non-functional constraints.");
    } else if (hasScopeClarity) {
      reqScore = 4;
      reqEvidence = `Assumptions define scope well, but lacks explicit non-functional boundaries.`;
      reqConcern = "Implicit assumptions regarding peak traffic or multi-threaded access.";
      reqSuggestion = "Document explicit non-functional constraints like concurrent transaction volume and failover handling.";
      priorityImprovements.push("Clarify non-functional constraints (concurrency, peak load) in assumptions.");
    } else {
      reqScore = 2;
      reqEvidence = `Assumptions are brief (${assumptions.length} characters).`;
      reqConcern = "Risk of building the wrong abstraction due to unstated requirements.";
      reqSuggestion = "State clear functional scope, system boundaries, and assumptions before defining classes.";
      priorityImprovements.push("Expand assumptions to cover operational edge cases and scale.");
    }

    items.push(
      new FeedbackItem({
        criterionId: "crit-req",
        criterionName: "Requirements & Scope Understanding",
        dimension: RubricDimension.REQUIREMENT_UNDERSTANDING,
        score: reqScore,
        evidence: reqEvidence,
        concern: reqConcern,
        suggestion: reqSuggestion,
        confidence: 0.95
      })
    );

    // --- 2. Class Responsibilities & SRP ---
    let srpScore = 3;
    let srpEvidence = "";
    let srpConcern = "";
    let srpSuggestion = "";

    const entityCount = entities.length;
    const godClasses = entities.filter(e => (e.methods || []).length > 5 || (e.responsibilities || "").length > 150);
    const wellDivided = entityCount >= 4 && godClasses.length === 0;

    if (wellDivided) {
      srpScore = 5;
      srpEvidence = `Defined ${entityCount} focused entities (${entities.map(e => e.name).join(", ")}). Each has concise, cohesive duties.`;
      srpConcern = "Ensure domain entities do not leak internal collections to callers.";
      srpSuggestion = "Expose unmodifiable views or iterator patterns when accessing child collections.";
      keyStrengths.push("High cohesion with well-segregated entity responsibilities.");
    } else if (godClasses.length > 0) {
      srpScore = 2;
      srpEvidence = `Class '${godClasses[0].name}' contains ${godClasses[0].methods?.length || 0} methods and broad responsibilities: '${godClasses[0].responsibilities}'.`;
      srpConcern = `'${godClasses[0].name}' is acting as a God Object, orchestrating state, calculation, and transactions simultaneously.`;
      srpSuggestion = `Extract sub-responsibilities from '${godClasses[0].name}'. Delegate fee/dispatch calculations to dedicated policy strategies.`;
      priorityImprovements.push(`Refactor God Object '${godClasses[0].name}' into smaller, focused collaborators.`);
    } else if (entityCount <= 2) {
      srpScore = 2;
      srpEvidence = `Only ${entityCount} entities defined.`;
      srpConcern = "Too few abstractions; core business domain is oversimplified.";
      srpSuggestion = "Introduce dedicated domain models (e.g. separate Value Objects, Managers, and Strategies).";
      priorityImprovements.push("Decompose system into distinct domain entities and value objects.");
    } else {
      srpScore = 4;
      srpEvidence = `Found ${entityCount} entities with reasonable separation of responsibilities.`;
      srpConcern = "Minor overlap in coordination vs entity state management.";
      srpSuggestion = "Ensure coordinator classes delegate rather than directly manipulate state of child entities.";
    }

    items.push(
      new FeedbackItem({
        criterionId: "crit-srp",
        criterionName: "Class Responsibilities & SRP",
        dimension: RubricDimension.CLASS_RESPONSIBILITY,
        score: srpScore,
        evidence: srpEvidence,
        concern: srpConcern,
        suggestion: srpSuggestion,
        confidence: 0.92
      })
    );

    // --- 3. Coupling, Encapsulation & Interfaces ---
    let couplingScore = 3;
    let couplingEvidence = "";
    let couplingConcern = "";
    let couplingSuggestion = "";

    const interfaceCount = entities.filter(e => e.isInterface || e.name.startsWith("I") || (e.relationships || []).some(r => r.toLowerCase().includes("interface"))).length;
    const hasStrategyOrInterface = interfaceCount > 0;

    if (interfaceCount >= 2) {
      couplingScore = 5;
      couplingEvidence = `Defines ${interfaceCount} interfaces (${entities.filter(e => e.isInterface || e.name.startsWith("I")).map(e => e.name).join(", ")}). High inversion of control.`;
      couplingConcern = "Ensure interface method signatures accept abstractions rather than concrete types.";
      couplingSuggestion = "Verify Interface Segregation Principle (ISP) so clients don't depend on unused methods.";
      keyStrengths.push("Excellent loose coupling via well-abstracted interfaces.");
    } else if (hasStrategyOrInterface) {
      couplingScore = 4;
      couplingEvidence = `Found interface abstraction: ${entities.filter(e => e.isInterface || e.name.startsWith("I"))[0]?.name || "interface"}.`;
      couplingConcern = "Some subsystems may still couple directly to concrete classes.";
      couplingSuggestion = "Introduce interfaces for external boundary integrations (e.g. payment, hardware controllers).";
    } else {
      couplingScore = 2;
      couplingEvidence = `No interface abstractions detected among ${entityCount} entities.`;
      couplingConcern = "Tight coupling to concrete implementations inhibits testability and mocking.";
      couplingSuggestion = "Abstract critical behaviors (e.g. dispatch algorithm, pricing, payment) behind interfaces.";
      priorityImprovements.push("Introduce interface abstractions for core business algorithms to reduce coupling.");
    }

    items.push(
      new FeedbackItem({
        criterionId: "crit-coupling",
        criterionName: "Coupling, Encapsulation & Interfaces",
        dimension: RubricDimension.COUPLING_COHESION,
        score: couplingScore,
        evidence: couplingEvidence,
        concern: couplingConcern,
        suggestion: couplingSuggestion,
        confidence: 0.90
      })
    );

    // --- 4. Appropriate Abstraction & Extensibility ---
    let extScore = 3;
    let extEvidence = "";
    let extConcern = "";
    let extSuggestion = "";

    const patternCount = patterns.length;
    const hasValidPatterns = patterns.some(p => p.patternName.toLowerCase().includes("strategy") || p.patternName.toLowerCase().includes("state") || p.patternName.toLowerCase().includes("factory") || p.patternName.toLowerCase().includes("observer"));

    if (patternCount >= 2 && hasValidPatterns) {
      extScore = 5;
      extEvidence = `Applied patterns: ${patterns.map(p => `${p.patternName} (${p.whereApplied})`).join("; ")}. Rationales demonstrate architectural justification.`;
      extConcern = "Beware of over-engineering if requirements don't warrant multiple factory abstractions.";
      extSuggestion = "Validate that pattern implementations can be configured via dependency injection.";
      keyStrengths.push("Judicious application of Design Patterns with grounded trade-off rationales.");
    } else if (patternCount === 1 || hasValidPatterns) {
      extScore = 4;
      extEvidence = `Identified pattern: ${patterns[0]?.patternName || "Strategy/State"}.`;
      extConcern = "Additional extension points (such as payment or event notifications) remain hardcoded.";
      extSuggestion = "Consider applying State Pattern for lifecycle transitions or Observer Pattern for real-time boards/signage.";
    } else {
      extScore = 2;
      extEvidence = `Zero design patterns justified or detailed.`;
      extConcern = "Future requirement changes (e.g., dynamic rates, new car dispatching policies) will require modifying existing classes (violating OCP).";
      extSuggestion = "Employ the Strategy Pattern for swappable algorithms or State Pattern for entity lifecycle management.";
      priorityImprovements.push("Apply Strategy or State design patterns to make the architecture easily extensible.");
    }

    items.push(
      new FeedbackItem({
        criterionId: "crit-extensibility",
        dimension: RubricDimension.EXTENSIBILITY_PATTERNS,
        criterionName: "Appropriate Abstraction & Extensibility",
        score: extScore,
        evidence: extEvidence,
        concern: extConcern,
        suggestion: extSuggestion,
        confidence: 0.92
      })
    );

    // --- 5. Edge Cases, Concurrency & Testability ---
    let edgeScore = 3;
    let edgeEvidence = "";
    let edgeConcern = "";
    let edgeSuggestion = "";

    const mentionsConcurrency = assumptions.includes("concurr") || assumptions.includes("lock") || assumptions.includes("mutex") || assumptions.includes("atomic") || diagramOrCode.includes("lock");
    const mentionsEdgeCases = assumptions.includes("full") || assumptions.includes("empty") || assumptions.includes("overload") || assumptions.includes("fail") || assumptions.includes("refund");

    if (mentionsConcurrency && mentionsEdgeCases) {
      edgeScore = 5;
      edgeEvidence = `Explicitly addresses concurrency control and operational edge cases (${assumptions.slice(0, 90)}...).`;
      edgeConcern = "Ensure optimistic/pessimistic locking strategy is compatible with database or distributed cache.";
      edgeSuggestion = "Specify isolation level or atomic compare-and-swap semantics for spot/door allocation.";
      keyStrengths.push("Robust handling of edge cases, empty/full states, and concurrency.");
    } else if (mentionsConcurrency || mentionsEdgeCases) {
      edgeScore = 3;
      edgeEvidence = mentionsConcurrency
        ? "Mentions concurrency or locking, but lacks edge case elaboration (e.g. system full, out-of-stock, cancellations)."
        : "Mentions edge conditions, but lacks concurrency mechanisms.";
      edgeConcern = mentionsConcurrency
        ? "Missing handling for failure scenarios (e.g., payment failure, hardware door obstruction)."
        : "High risk of race conditions when multiple gates or elevator buttons are pressed simultaneously.";
      edgeSuggestion = "Detail synchronized locks or atomic primitives to prevent double-booking, and outline rollback handling.";
      priorityImprovements.push("Detail thread-safety / locking strategies to prevent race conditions.");
    } else {
      edgeScore = 2;
      edgeEvidence = "No mention of concurrency, locking, or boundary edge cases.";
      edgeConcern = "System assumes single-threaded happy path, which collapses under real-world multi-user operations.";
      edgeSuggestion = "Identify shared mutable state (e.g., parking spot occupancy, elevator car queue) and specify synchronization mechanisms.";
      priorityImprovements.push("Add concurrency safeguards (mutex, atomic flags) and handle failure edge cases.");
    }

    items.push(
      new FeedbackItem({
        criterionId: "crit-edge-cases",
        dimension: RubricDimension.EDGE_CASES_TESTABILITY,
        criterionName: "Edge Cases, Concurrency & Testability",
        score: edgeScore,
        evidence: edgeEvidence,
        concern: edgeConcern,
        suggestion: edgeSuggestion,
        confidence: 0.88
      })
    );

    const totalScore = items.reduce((s, i) => s + i.score, 0);
    const overallSummary = `Solution demonstrates solid domain formulation with a total score of ${totalScore}/25 (${Math.round((totalScore / 25) * 100)}%). Key strengths include ${keyStrengths[0] || "structured breakdown"}. Primary focus for the next iteration: ${priorityImprovements[0] || "further refine concurrency safeguards"}.`;

    return new FeedbackReport({
      items,
      overallSummary,
      keyStrengths,
      priorityImprovements,
      evaluatorName: this.name
    });
  }
}
