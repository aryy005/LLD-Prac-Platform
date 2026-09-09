import { RubricDimension } from "../enums/index.js";

export interface RubricCriterionProps {
  id: string;
  dimension: RubricDimension;
  name: string;
  description: string;
  weight: number; // e.g. 1 to 5
  maxScore: number; // default 5
}

export class RubricCriterion {
  public readonly id: string;
  public readonly dimension: RubricDimension;
  public readonly name: string;
  public readonly description: string;
  public readonly weight: number;
  public readonly maxScore: number;

  constructor(props: RubricCriterionProps) {
    if (!props.id || !props.name) {
      throw new Error("RubricCriterion must have an id and name.");
    }
    this.id = props.id;
    this.dimension = props.dimension;
    this.name = props.name;
    this.description = props.description;
    this.weight = props.weight > 0 ? props.weight : 1;
    this.maxScore = props.maxScore > 0 ? props.maxScore : 5;
  }
}
