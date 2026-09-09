import { IEvaluator } from "../../domain/services/IEvaluator.js";
import { Problem } from "../../domain/models/Problem.js";
import { Submission } from "../../domain/models/Submission.js";
import { FeedbackReport } from "../../domain/models/FeedbackReport.js";
import { FeedbackItem } from "../../domain/models/FeedbackItem.js";
import { RubricDimension } from "../../domain/enums/index.js";
import { SemanticRuleEvaluator } from "./SemanticRuleEvaluator.js";

export class GeminiLlmEvaluator implements IEvaluator {
  public readonly name = "GeminiLlmEvaluator (AI Engine)";
  private fallbackEvaluator = new SemanticRuleEvaluator();

  public async evaluate(problem: Problem, submission: Submission): Promise<FeedbackReport> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful fallback to offline semantic engine
      return this.fallbackEvaluator.evaluate(problem, submission);
    }

    try {
      const prompt = `You are a Principal Software Architect evaluating a candidate's Low-Level Design (LLD) submission.
Evaluate strictly against the following 5 rubric criteria:
1. crit-req (Requirements & Scope Understanding)
2. crit-srp (Class Responsibilities & SRP)
3. crit-coupling (Coupling, Encapsulation & Interfaces)
4. crit-extensibility (Appropriate Abstraction & Extensibility)
5. crit-edge-cases (Edge Cases, Concurrency & Testability)

Problem Title: ${problem.title}
Requirements: ${problem.requirements.join("; ")}
Constraints: ${problem.constraints.join("; ")}

Candidate's Submission:
${submission.payload.toTextSummary()}

Respond ONLY with a JSON object in the following format (no markdown fences, pure JSON):
{
  "items": [
    {
      "criterionId": "crit-req",
      "criterionName": "Requirements & Scope Understanding",
      "dimension": "REQUIREMENT_UNDERSTANDING",
      "score": <1-5>,
      "evidence": "<exact quote or specific reference to candidate's text>",
      "concern": "<identified architectural flaw or omission>",
      "suggestion": "<concrete refactoring advice>",
      "confidence": <0.8 to 1.0>
    }
    // repeat for all 5 criteria
  ],
  "overallSummary": "<overall synthesis of the design>",
  "keyStrengths": ["<strength 1>", "<strength 2>"],
  "priorityImprovements": ["<improvement 1>", "<improvement 2>"]
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );

      if (!response.ok) {
        console.warn(`Gemini API returned status ${response.status}. Falling back to SemanticRuleEvaluator.`);
        return this.fallbackEvaluator.evaluate(problem, submission);
      }

      const data: any = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        return this.fallbackEvaluator.evaluate(problem, submission);
      }

      const parsed = JSON.parse(rawText);
      const items = (parsed.items || []).map(
        (it: any) =>
          new FeedbackItem({
            criterionId: it.criterionId || "crit-general",
            criterionName: it.criterionName || "General",
            dimension: (it.dimension as RubricDimension) || RubricDimension.REQUIREMENT_UNDERSTANDING,
            score: Number(it.score) || 3,
            evidence: it.evidence || "Based on candidate submission structure.",
            concern: it.concern || "Areas for improvement identified.",
            suggestion: it.suggestion || "Refactor according to SOLID principles.",
            confidence: Number(it.confidence) || 0.9
          })
      );

      return new FeedbackReport({
        items,
        overallSummary: parsed.overallSummary || "LLM architectural review complete.",
        keyStrengths: parsed.keyStrengths || ["Clear structural decomposition"],
        priorityImprovements: parsed.priorityImprovements || ["Refine pattern justifications"],
        evaluatorName: this.name
      });
    } catch (err) {
      console.warn("Error calling Gemini API. Falling back to SemanticRuleEvaluator.", err);
      return this.fallbackEvaluator.evaluate(problem, submission);
    }
  }
}
