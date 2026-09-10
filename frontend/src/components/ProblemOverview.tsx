import React, { useState } from "react";
import { Problem, Attempt } from "../types/index.js";
import {
  FileText,
  Award,
  History,
  Lightbulb,
  CheckCircle2,
  ShieldAlert,
  Boxes,
  Cpu,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp
} from "lucide-react";

interface ProblemOverviewProps {
  problem: Problem;
  attemptsHistory?: Attempt[];
  onSelectAttempt?: (attempt: Attempt) => void;
  theme?: "dark" | "light";
}

export const ProblemOverview: React.FC<ProblemOverviewProps> = ({
  problem,
  attemptsHistory = [],
  onSelectAttempt,
  theme = "dark"
}) => {
  const [activeTab, setActiveTab] = useState<"description" | "rubric" | "history" | "guidelines">("description");
  const isDark = theme === "dark";

  return (
    <div
      className={`h-full flex flex-col overflow-hidden transition-colors ${
        isDark ? "bg-[#282828] text-[#eff1f6]" : "bg-white text-slate-800"
      }`}
    >
      {/* Left Panel Tabs Bar */}
      <div
        className={`flex items-center gap-1 border-b px-3 shrink-0 select-none ${
          isDark ? "border-[#3e3e3e] bg-[#222222]" : "border-slate-200 bg-slate-100"
        }`}
      >
        <button
          onClick={() => setActiveTab("description")}
          className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "description"
              ? "border-[#2cbb5d] text-[#2cbb5d] font-bold"
              : isDark
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Description</span>
        </button>

        <button
          onClick={() => setActiveTab("rubric")}
          className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "rubric"
              ? "border-[#2cbb5d] text-[#2cbb5d] font-bold"
              : isDark
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Rubric (5D)</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "history"
              ? "border-[#2cbb5d] text-[#2cbb5d] font-bold"
              : isDark
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Submissions ({attemptsHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("guidelines")}
          className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "guidelines"
              ? "border-[#2cbb5d] text-[#2cbb5d] font-bold"
              : isDark
              ? "border-transparent text-slate-400 hover:text-slate-200"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Guidelines</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* TAB 1: DESCRIPTION */}
        {activeTab === "description" && (
          <div className="space-y-6">
            {/* Title & Metadata */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-bold font-sans tracking-tight">{problem.title}</span>
                {problem.difficulty === "EASY" && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Easy
                  </span>
                )}
                {problem.difficulty === "MEDIUM" && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Medium
                  </span>
                )}
                {problem.difficulty === "HARD" && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    Hard
                  </span>
                )}
              </div>

              {/* Topic Badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    isDark ? "bg-[#1a1a1a] text-slate-300 border border-[#3e3e3e]" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  System Design
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    isDark ? "bg-[#1a1a1a] text-slate-300 border border-[#3e3e3e]" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Object-Oriented Design
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    isDark ? "bg-[#1a1a1a] text-slate-300 border border-[#3e3e3e]" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Design Patterns
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    isDark ? "bg-[#1a1a1a] text-slate-300 border border-[#3e3e3e]" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Clean Architecture
                </span>
              </div>
            </div>

            {/* Overview Description */}
            <div className={`p-4 rounded-xl text-xs leading-relaxed ${
              isDark ? "bg-[#1f1f1f] border border-[#3e3e3e] text-slate-300" : "bg-slate-50 border border-slate-200 text-slate-700"
            }`}>
              {problem.description}
            </div>

            {/* Functional Requirements */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Functional Requirements</span>
              </h3>
              <ul className="space-y-2">
                {problem.requirements.map((req, idx) => (
                  <li
                    key={idx}
                    className={`p-3 rounded-lg text-xs leading-normal border flex items-start gap-2.5 ${
                      isDark
                        ? "bg-[#1f1f1f] border-[#3e3e3e] text-slate-300"
                        : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Design & Non-Functional Constraints */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Design & Operational Constraints</span>
              </h3>
              <ul className="space-y-2">
                {problem.constraints.map((cst, idx) => (
                  <li
                    key={idx}
                    className={`p-3 rounded-lg text-xs leading-normal border flex items-start gap-2.5 ${
                      isDark
                        ? "bg-[#1f1f1f] border-[#3e3e3e] text-slate-300"
                        : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      !
                    </span>
                    <span>{cst}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: RUBRIC (5D) */}
        {activeTab === "rubric" && (
          <div className="space-y-5 text-xs">
            <div>
              <h3 className="font-bold text-sm text-[#2cbb5d] flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>5-Dimensional Rubric Engine</span>
              </h3>
              <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Submissions are evaluated deterministically and semantically across five core design dimensions.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { title: "1. Scope & Requirement Understanding", desc: "Verifies functional boundaries, concurrency considerations, and explicit non-goals." },
                { title: "2. Domain Modeling & Single Responsibility (SRP)", desc: "Evaluates class cohesion, distinct ownership of duties, and absence of God objects." },
                { title: "3. Design Patterns & Extensibility", desc: "Checks explicit design pattern choices (e.g. Strategy, State, Observer, Factory) and trade-off rationales." },
                { title: "4. Structural Clean Architecture", desc: "Inspects clean boundaries between domain models, application use cases, and interface adapters." },
                { title: "5. Edge Cases & Operational Concurrency", desc: "Assesses thread-safety mechanisms, race conditions, capacity limits, and error handling." }
              ].map((dim, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border ${
                    isDark ? "bg-[#1f1f1f] border-[#3e3e3e]" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="font-bold text-xs text-amber-400">{dim.title}</div>
                  <div className={`text-[11px] mt-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {dim.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SUBMISSIONS HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#2cbb5d] flex items-center gap-2">
                <History className="w-4 h-4" />
                <span>Submission Attempts History</span>
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded ${isDark ? "bg-[#1a1a1a] text-slate-400" : "bg-slate-100 text-slate-600"}`}>
                {attemptsHistory.length} attempts
              </span>
            </div>

            {attemptsHistory.length === 0 ? (
              <div className={`p-8 text-center rounded-xl border border-dashed ${
                isDark ? "border-[#3e3e3e] text-slate-400" : "border-slate-300 text-slate-500"
              }`}>
                No previous attempts yet. Click **Submit Solution** above to create your first attempt.
              </div>
            ) : (
              <div className="space-y-3">
                {attemptsHistory.map((att, idx) => {
                  const sub = att.submissions[att.submissions.length - 1];
                  const score = sub?.evaluation?.scorePercentage ?? 0;

                  return (
                    <div
                      key={att.id}
                      onClick={() => onSelectAttempt?.(att)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-[#2cbb5d] ${
                        isDark ? "bg-[#1f1f1f] border-[#3e3e3e]" : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#2cbb5d]">
                            Attempt #{att.iteration}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded ${
                            att.status === "COMPLETED"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          }`}>
                            {att.status}
                          </span>
                        </div>
                        {score > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-[#2cbb5d]">{score}%</span>
                          </div>
                        )}
                      </div>
                      <div className={`text-[11px] mt-2 flex items-center justify-between ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}>
                        <span>Submissions: {att.submissions.length}</span>
                        <span>{new Date(att.startedAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: GUIDELINES */}
        {activeTab === "guidelines" && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-[#2cbb5d] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Low-Level Design Best Practices</span>
            </h3>
            <ul className="space-y-2.5">
              <li className={`p-3 rounded-lg border leading-relaxed ${isDark ? "bg-[#1f1f1f] border-[#3e3e3e] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                <strong className="text-amber-400 block mb-1">1. Separate Responsibilities (SRP):</strong>
                Avoid putting all business logic inside one large `Manager` class. Create focused entities (e.g. `PaymentProcessor`, `SpotAllocator`, `PricingStrategy`).
              </li>
              <li className={`p-3 rounded-lg border leading-relaxed ${isDark ? "bg-[#1f1f1f] border-[#3e3e3e] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                <strong className="text-amber-400 block mb-1">2. Use Interface Abstractions:</strong>
                Program to interfaces, not concrete classes. Interfaces allow plugging in new algorithms without breaking existing callers.
              </li>
              <li className={`p-3 rounded-lg border leading-relaxed ${isDark ? "bg-[#1f1f1f] border-[#3e3e3e] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                <strong className="text-amber-400 block mb-1">3. Document Concurrency Strategy:</strong>
                State clearly how concurrent requests (e.g. 10 vehicles attempting to park at once) will be synchronized.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
