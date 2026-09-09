# AI Usage Log: Key AI-Assisted Decisions

**Project:** Low-Level Design (LLD) Practice Platform  
**Author:** Aryaman Malik  
**Scope:** Transparent log of meaningful AI-assisted suggestions, design choices, accepted/rejected ideas, and engineering rationale.

---

### Decision 1: Submission Input Model — Free-form Text vs. Structured Canvas

- **AI Suggestion**:  
  The AI initially suggested supporting an open-ended Markdown editor where candidates write freely, arguing this offers the least friction and lets users copy-paste existing design notes.
- **Accepted / Rejected**:  
  **Rejected the open-ended text box; Accepted a structured multi-component submission model.**
- **Rationale**:  
  In LLD, unstructured text frequently leads to candidates skipping critical architectural aspects (e.g. omitting interface contracts, concurrency assumptions, or pattern trade-offs). An unconstrained text dump also forces the evaluation engine into fuzzy prompt parsing, resulting in inconsistent feedback. We selected a structured canvas with explicit sections: (1) Requirements & Scope Assumptions, (2) Class & Interface Contracts, (3) Design Patterns & Trade-offs, and (4) Structural Diagram / Code Skeleton. This ensures evidence is cleanly isolated for each rubric dimension while maintaining a low friction authoring experience.

---

### Decision 2: Feedback Generation Strategy — Monolithic LLM Prompt vs. Multi-Stage Composite Pipeline

- **AI Suggestion**:  
  The AI suggested a direct prompt: *"Act as a Principal Engineer and evaluate this submission from 1 to 100, providing feedback on SOLID principles."*
- **Accepted / Rejected**:  
  **Rejected the monolithic 1–100 score prompt; Accepted a Composite Evaluator with a Deterministic Gatekeeper + Criterion-by-Criterion Evidence Model.**
- **Rationale**:  
  A generic 0–100 score lacks explainability and produces high variance between runs. Furthermore, if the learner omits core domain entities, burning LLM tokens to evaluate SRP on nonexistent classes is wasteful. Instead, we designed a `DeterministicRuleEvaluator` that verifies baseline structural requirements first (missing entities, God-class thresholds), followed by an intelligent evaluation mapped to a fixed rubric schema (`criterion -> score (1-5) -> evidence -> concern -> suggestion -> confidence`). This makes feedback reproducible and anchored in what the learner actually wrote.

---

### Decision 3: Submission Lifecycle & Resilience — Synchronous In-Flight Evaluation vs. Persist-First State Machine

- **AI Suggestion**:  
  The AI suggested a simple request-response API: `POST /api/submissions` immediately runs the evaluation in memory and returns the evaluated result directly in the HTTP response.
- **Accepted / Rejected**:  
  **Rejected synchronous in-memory evaluation; Accepted a Persist-First State Machine (`SUBMITTED` $\to$ `EVALUATING` $\to$ `COMPLETED`/`FAILED`) with Idempotency Guard.**
- **Rationale**:  
  AI evaluations and in-depth semantic parsers introduce latency and external network dependencies. If an evaluation times out or encounters network degradation during an in-flight HTTP request, the candidate's entire solution would be lost. By persisting the submission immediately with status `SUBMITTED` and an idempotency key, we guarantee zero data loss. The evaluation runs asynchronously (or synchronously with safe fallback), and failed evaluations can be retried without re-authoring the solution.

---

### Decision 4: Fallback & Offline Independence — Pure Cloud LLM vs. Dual-Mode Heuristic Engine

- **AI Suggestion**:  
  The AI suggested relying exclusively on the Google Gemini API or OpenAI API, requiring an API key for every run.
- **Accepted / Rejected**:  
  **Rejected hard external API dependency; Accepted a Pluggable Strategy with an Offline Heuristic Engine.**
- **Rationale**:  
  Evaluators and reviewers running this prototype in an interview or automated CI setting may not have active external API keys configured, or could experience quota limits. To ensure 100% testability and reliability, we implemented a `SemanticRuleEvaluator` heuristic engine that evaluates OOP coupling, inheritance, and pattern presence offline. When `GEMINI_API_KEY` is present, the system automatically uses `GeminiLlmEvaluator`; when absent or on failure, it seamlessly falls back to the heuristic engine without throwing runtime errors.

---

### Decision 5: Attempt History & Practice Progression — Flat Submission List vs. Multi-Iteration Attempt Aggregate

- **AI Suggestion**:  
  The AI proposed a flat `submissions` table where each submit is simply another row associated with the problem.
- **Accepted / Rejected**:  
  **Rejected flat submissions; Accepted an `Attempt` aggregate root encapsulating multiple `Submission` iterations.**
- **Rationale**:  
  The primary learner problem identified in our research is the lack of an iterative learning loop (Try $\to$ Feedback $\to$ Refactor $\to$ Compare). By establishing `Attempt` as an explicit aggregate with sequential iterations, the platform can compare Attempt 1 vs. Attempt 2 directly, showing learners the delta in their rubric scores (e.g. +2 on Extensibility after introducing the Strategy pattern) and reinforcing positive learning habits.
