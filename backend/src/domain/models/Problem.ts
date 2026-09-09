import { Difficulty } from "../enums/index.js";
import { Rubric } from "./Rubric.js";
import { ClassDefinition, PatternJustification } from "./SubmissionPayload.js";

export interface StarterTemplate {
  requirementsAndAssumptions: string;
  entitiesAndInterfaces: ClassDefinition[];
  patternsAndTradeoffs: PatternJustification[];
  diagramOrCode?: string;
}

export interface ProblemProps {
  id: string;
  title: string;
  tagline: string;
  description: string;
  difficulty: Difficulty;
  requirements: string[];
  constraints: string[];
  rubric: Rubric;
  starterTemplate: StarterTemplate;
  sampleSolution?: StarterTemplate; // Provided for demonstration and testing
}

export class Problem {
  public readonly id: string;
  public readonly title: string;
  public readonly tagline: string;
  public readonly description: string;
  public readonly difficulty: Difficulty;
  public readonly requirements: string[];
  public readonly constraints: string[];
  public readonly rubric: Rubric;
  public readonly starterTemplate: StarterTemplate;
  public readonly sampleSolution?: StarterTemplate;

  constructor(props: ProblemProps) {
    this.id = props.id;
    this.title = props.title;
    this.tagline = props.tagline;
    this.description = props.description;
    this.difficulty = props.difficulty;
    this.requirements = props.requirements;
    this.constraints = props.constraints;
    this.rubric = props.rubric;
    this.starterTemplate = props.starterTemplate;
    this.sampleSolution = props.sampleSolution;
  }
}
