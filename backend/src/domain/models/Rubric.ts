import { RubricCriterion } from "./RubricCriterion.js";
import { RubricDimension } from "../enums/index.js";

export class Rubric {
  public readonly id: string;
  public readonly name: string;
  public readonly criteria: RubricCriterion[];

  constructor(id: string, name: string, criteria: RubricCriterion[]) {
    if (!id || !name) {
      throw new Error("Rubric must have an id and name.");
    }
    if (!criteria || criteria.length === 0) {
      throw new Error("Rubric must contain at least one criterion.");
    }
    this.id = id;
    this.name = name;
    this.criteria = criteria;
  }

  public getCriterionById(criterionId: string): RubricCriterion | undefined {
    return this.criteria.find(c => c.id === criterionId);
  }

  public getCriteriaByDimension(dimension: RubricDimension): RubricCriterion[] {
    return this.criteria.filter(c => c.dimension === dimension);
  }

  public getTotalMaxScore(): number {
    return this.criteria.reduce((acc, curr) => acc + curr.maxScore, 0);
  }

  public static createDefaultRubric(): Rubric {
    return new Rubric("default-lld-rubric", "Standard Low-Level Design Rubric", [
      new RubricCriterion({
        id: "crit-req",
        dimension: RubricDimension.REQUIREMENT_UNDERSTANDING,
        name: "Requirements & Scope Understanding",
        description: "Captures core functional requirements, reasonable assumptions, non-functional constraints, and scope boundaries.",
        weight: 1,
        maxScore: 5
      }),
      new RubricCriterion({
        id: "crit-srp",
        dimension: RubricDimension.CLASS_RESPONSIBILITY,
        name: "Class Responsibilities & SRP",
        description: "Each entity has high cohesion and a single clear responsibility. Avoids 'God objects' (e.g. monolithic manager doing everything).",
        weight: 1,
        maxScore: 5
      }),
      new RubricCriterion({
        id: "crit-coupling",
        dimension: RubricDimension.COUPLING_COHESION,
        name: "Coupling, Encapsulation & Interfaces",
        description: "Classes communicate via well-defined abstractions. Data is properly encapsulated, and dependencies are loosely coupled.",
        weight: 1,
        maxScore: 5
      }),
      new RubricCriterion({
        id: "crit-extensibility",
        dimension: RubricDimension.EXTENSIBILITY_PATTERNS,
        name: "Appropriate Abstraction & Extensibility",
        description: "Judicious use of design patterns (Strategy, State, Factory, Observer) where requirements might change, without over-engineering.",
        weight: 1,
        maxScore: 5
      }),
      new RubricCriterion({
        id: "crit-edge-cases",
        dimension: RubricDimension.EDGE_CASES_TESTABILITY,
        name: "Edge Cases, Concurrency & Testability",
        description: "Considers race conditions, resource contention, empty states, boundary inputs, and how the design can be unit tested.",
        weight: 1,
        maxScore: 5
      })
    ]);
  }
}
