import React from "react";
import { Problem, Attempt } from "../types/index.js";
import { Award, History, CheckCircle2, ArrowRight, Layers } from "lucide-react";

interface HeaderProps {
  problems: Problem[];
  selectedProblem: Problem | null;
  onSelectProblem: (problem: Problem) => void;
  activeAttempt: Attempt | null;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenRubric: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  problems,
  selectedProblem,
  onSelectProblem,
  activeAttempt,
  historyCount,
  onOpenHistory,
  onOpenRubric
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-nexcent-border px-6 py-4 shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Nexcent Geometric Faceted Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            {/* Faceted geometric triangle logo matching Nexcent */}
            <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
              <polygon points="18,3 32,27 4,27" fill="#4CAF4F" />
              <polygon points="18,3 32,27 18,27" fill="#388E3C" opacity="0.9" />
              <polygon points="18,3 4,27 18,17" fill="#66BB6A" opacity="0.8" />
              <polygon points="18,17 32,27 18,27" fill="#2E7D32" opacity="0.85" />
            </svg>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-nexcent-charcoal tracking-tight font-sans">
              Nexcent
            </span>
            <span className="text-[11px] font-bold text-nexcent-green bg-nexcent-green-light px-2 py-0.5 rounded uppercase tracking-wider">
              LLD Platform
            </span>
          </div>
        </div>

        {/* Problem Selector Dropdown / Nav Pills */}
        <div className="flex items-center bg-nexcent-silver rounded-lg p-1 border border-nexcent-border">
          {problems.map(prob => {
            const isSelected = selectedProblem?.id === prob.id;
            return (
              <button
                key={prob.id}
                onClick={() => onSelectProblem(prob)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-white text-nexcent-green shadow-sm font-bold border border-nexcent-border"
                    : "text-nexcent-gray hover:text-nexcent-charcoal hover:bg-slate-200/50"
                }`}
              >
                {prob.difficulty === "EASY" && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                )}
                {prob.difficulty === "MEDIUM" && (
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                )}
                {prob.difficulty === "HARD" && (
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                )}
                <span>{prob.title.replace("Design a ", "").replace("Design an ", "")}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons & Links */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenRubric}
            className="text-xs font-semibold text-nexcent-charcoal hover:text-nexcent-green px-3 py-2 rounded-md transition-colors flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-nexcent-green" />
            <span>Rubric (5D)</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="text-xs font-semibold text-nexcent-charcoal hover:text-nexcent-green px-3 py-2 rounded-md transition-colors flex items-center gap-1.5"
          >
            <History className="w-4 h-4 text-nexcent-green" />
            <span>Attempts ({historyCount})</span>
          </button>

          {/* Signature Nexcent Green Action Button */}
          {activeAttempt ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-nexcent-green text-white text-xs font-semibold shadow-sm shadow-nexcent-green/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Attempt #{activeAttempt.iteration}</span>
            </div>
          ) : (
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-nexcent-green hover:bg-nexcent-green-dark text-white text-xs font-bold transition-all shadow-sm shadow-nexcent-green/25"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
