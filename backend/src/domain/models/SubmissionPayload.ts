import { PayloadType } from "../enums/index.js";

export interface ClassDefinition {
  name: string;
  isInterface?: boolean;
  responsibilities: string;
  fields?: string[];
  methods?: string[];
  relationships?: string[]; // e.g. "extends Vehicle", "implements PaymentStrategy"
}

export interface PatternJustification {
  patternName: string; // e.g. "Strategy Pattern"
  whereApplied: string; // e.g. "ParkingFeeCalculation"
  rationale: string; // Why this pattern was chosen over alternatives
}

export interface ISubmissionPayload {
  readonly type: PayloadType;
  readonly requirementsAndAssumptions: string;
  readonly entitiesAndInterfaces: ClassDefinition[];
  readonly patternsAndTradeoffs: PatternJustification[];
  readonly diagramOrCode?: string; // Optional Mermaid diagram or code implementation

  toTextSummary(): string;
}

export class StructuredTextPayload implements ISubmissionPayload {
  public readonly type = PayloadType.STRUCTURED_SPEC;

  constructor(
    public readonly requirementsAndAssumptions: string,
    public readonly entitiesAndInterfaces: ClassDefinition[],
    public readonly patternsAndTradeoffs: PatternJustification[],
    public readonly diagramOrCode?: string
  ) {}

  public toTextSummary(): string {
    const entitiesSummary = this.entitiesAndInterfaces
      .map(
        e =>
          `[${e.isInterface ? "Interface" : "Class"}: ${e.name}]\n  Responsibilities: ${
            e.responsibilities
          }\n  Methods: ${(e.methods || []).join(", ")}\n  Relationships: ${(
            e.relationships || []
          ).join(", ")}`
      )
      .join("\n\n");

    const patternsSummary = this.patternsAndTradeoffs
      .map(p => `[Pattern: ${p.patternName} in ${p.whereApplied}]\n  Rationale: ${p.rationale}`)
      .join("\n\n");

    return `=== REQUIREMENTS & ASSUMPTIONS ===\n${this.requirementsAndAssumptions}\n\n=== ENTITIES & INTERFACES ===\n${entitiesSummary}\n\n=== PATTERNS & TRADEOFFS ===\n${patternsSummary}${
      this.diagramOrCode ? `\n\n=== DIAGRAM / CODE SKELETON ===\n${this.diagramOrCode}` : ""
    }`;
  }
}

export class DiagramPayload implements ISubmissionPayload {
  public readonly type = PayloadType.DIAGRAM;

  constructor(
    public readonly requirementsAndAssumptions: string,
    public readonly entitiesAndInterfaces: ClassDefinition[],
    public readonly patternsAndTradeoffs: PatternJustification[],
    public readonly diagramOrCode: string // Mermaid or PlantUML
  ) {}

  public toTextSummary(): string {
    return `[Diagram Submission]\n${this.diagramOrCode}\n\nAssumptions: ${this.requirementsAndAssumptions}`;
  }
}
