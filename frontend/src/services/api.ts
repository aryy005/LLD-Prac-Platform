import { Problem, Attempt, Submission, StarterTemplate } from "../types/index.js";

const BASE_URL = "/api";

export const api = {
  async getProblems(): Promise<Problem[]> {
    const res = await fetch(`${BASE_URL}/problems`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to fetch problems");
    return json.data;
  },

  async getProblem(id: string): Promise<Problem> {
    const res = await fetch(`${BASE_URL}/problems/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to fetch problem");
    return json.data;
  },

  async startAttempt(problemId: string, forceNewIteration: boolean = false): Promise<Attempt> {
    const res = await fetch(`${BASE_URL}/attempts/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId, forceNewIteration })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to start attempt");
    return json.data;
  },

  async getAttemptHistory(problemId: string): Promise<Attempt[]> {
    const res = await fetch(`${BASE_URL}/attempts/history/${problemId}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to fetch history");
    return json.data;
  },

  async submitSolution(attemptId: string, payload: StarterTemplate, idempotencyKey?: string): Promise<Submission> {
    const res = await fetch(`${BASE_URL}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attemptId,
        ...payload,
        idempotencyKey
      })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to submit solution");
    return json.data;
  }
};
