import React, { useState } from "react";
import { Evaluation } from "../types/index.js";
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Quote,
  Zap,
  RotateCw
} from "lucide-react";

interface FeedbackViewProps {
  evaluation: Evaluation;
  onIterate: () => void;
  nextIterationNumber: number;
  theme?: "dark" | "light";
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  evaluation,
  onIterate,
  nextIterationNumber,
  theme = "dark"
}) => {
  const [activeTab, setActiveTab] = useState<"feedback" | "breakdown" | "evidence">("feedback");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isDark = theme === "dark";

  const score = evaluation.scorePercentage ?? 0;
  const isPassed = score >= 70;

  return (
    <div
      className={`border-t flex flex-col transition-all shrink-0 ${
        isDark ? "bg-[#1f1f1f] border-[#3e3e3e] text-[#eff1f6]" : "bg-slate-50 border-slate-200 text-slate-800"
      }`}
    >
      {/* Console Header Toolbar */}
      <div
        className={`px-4 py-2 flex items-center justify-between shrink-0 select-none border-b ${
          isDark ? "bg-[#282828] border-[#3e3e3e]" : "bg-slate-200 border-slate-300"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Console Title & Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Evaluation Output Console
            </span>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1 ${
                isPassed
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
              }`}
            >
              {isPassed ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              <span>{isPassed ? "PASS" : "REFACTOR RECOMMENDED"}</span>
            </span>

            {/* Score Pill */}
            <span className="text-xs font-black text-[#2cbb5d] px-2 py-0.5 rounded bg-[#2cbb5d]/10 border border-[#2cbb5d]/20">
              Score: {score}%
            </span>
          </div>

          {/* Console Navigation Tabs */}
          {!isCollapsed && (
            <div className="flex items-center gap-1 ml-4 border-l border-[#3e3e3e]/40 pl-3">
              <button
                onClick={() => setActiveTab("feedback")}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                  activeTab === "feedback"
                    ? isDark
                      ? "bg-[#1a1a1a] text-[#2cbb5d]"
                      : "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Summary & Suggestions
              </button>

              <button
                onClick={() => setActiveTab("breakdown")}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                  activeTab === "breakdown"
                    ? isDark
                      ? "bg-[#1a1a1a] text-[#2cbb5d]"
                      : "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Rubric Criteria ({evaluation.report?.items?.length || 0})
              </button>

              <button
                onClick={() => setActiveTab("evidence")}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                  activeTab === "evidence"
                    ? isDark
                      ? "bg-[#1a1a1a] text-[#2cbb5d]"
                      : "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Evidence Breakdown
              </button>
            </div>
          )}
        </div>

        {/* Right Controls & Next Iteration CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={onIterate}
            className="px-3 py-1 rounded bg-[#2cbb5d] hover:bg-[#26a350] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Refactor (Attempt #{nextIterationNumber})</span>
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1 rounded transition-colors ${
              isDark ? "hover:bg-[#3e3e3e] text-slate-400" : "hover:bg-slate-300 text-slate-600"
            }`}
            title={isCollapsed ? "Expand Console" : "Collapse Console"}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Console Content Body */}
      {!isCollapsed && (
        <div className="p-4 max-h-[260px] overflow-y-auto space-y-4">
          {/* TAB 1: SUMMARY & SUGGESTIONS */}
          {activeTab === "feedback" && (
            <div className="space-y-3 text-xs">
              {/* Executive Summary */}
              <div
                className={`p-3.5 rounded-xl border leading-relaxed ${
                  isDark ? "bg-[#1a1a1a] border-[#3e3e3e] text-slate-300" : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Evaluator Summary ({evaluation.report.evaluatorName})</span>
                </div>
                <span>{evaluation.report.overallSummary}</span>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  className={`p-3 rounded-xl border space-y-1.5 ${
                    isDark ? "bg-[#1a1a1a] border-[#3e3e3e]" : "bg-white border-slate-200"
                  }`}
                >
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Key Strengths</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {evaluation.report.keyStrengths.map((str: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`p-3 rounded-xl border space-y-1.5 ${
                    isDark ? "bg-[#1a1a1a] border-[#3e3e3e]" : "bg-white border-slate-200"
                  }`}
                >
                  <div className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Priority Improvements</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {evaluation.report.priorityImprovements.map((imp: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RUBRIC CRITERIA BREAKDOWN */}
          {activeTab === "breakdown" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {evaluation.report.items.map((item, idx: number) => {
                const scorePct = (item.score / 5) * 100;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border space-y-1.5 ${
                      isDark ? "bg-[#1a1a1a] border-[#3e3e3e]" : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-[11px] truncate max-w-[180px]">
                        {item.criterionName}
                      </span>
                      <span className="font-extrabold text-[#2cbb5d]">{item.score}/5</span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-[#3e3e3e] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2cbb5d] transition-all duration-500"
                        style={{ width: `${scorePct}%` }}
                      />
                    </div>

                    <div className={`text-[10px] space-y-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {item.concern && <div><strong className="text-amber-400">Concern:</strong> {item.concern}</div>}
                      {item.suggestion && <div><strong className="text-[#2cbb5d]">Suggestion:</strong> {item.suggestion}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: EVIDENCE CITATIONS */}
          {activeTab === "evidence" && (
            <div className="space-y-2 text-xs">
              {evaluation.report.items.map((item, idx: number) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    isDark ? "bg-[#1a1a1a] border-[#3e3e3e]" : "bg-white border-slate-200"
                  }`}
                >
                  <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-amber-400 text-[11px]">{item.criterionName} ({item.dimension})</div>
                    <div className={`text-[11px] ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      <strong>Evidence Cited:</strong> "{item.evidence}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
