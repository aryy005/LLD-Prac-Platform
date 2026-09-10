import React from "react";
import { Problem, Attempt } from "../types/index.js";
import {
  Award,
  History,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Sun,
  Moon,
  Play,
  Loader2,
  Code2
} from "lucide-react";

interface HeaderProps {
  problems: Problem[];
  selectedProblem: Problem | null;
  onSelectProblem: (problem: Problem) => void;
  activeAttempt: Attempt | null;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenRubric: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onPrevProblem: () => void;
  onNextProblem: () => void;
  onRandomProblem: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  problems,
  selectedProblem,
  onSelectProblem,
  activeAttempt,
  historyCount,
  onOpenHistory,
  onOpenRubric,
  onSubmit,
  isSubmitting,
  theme,
  onToggleTheme,
  onPrevProblem,
  onNextProblem,
  onRandomProblem
}) => {
  const isDark = theme === "dark";

  return (
    <header
      className={`h-14 border-b px-4 flex items-center justify-between shrink-0 select-none transition-colors ${
        isDark
          ? "bg-[#282828] border-[#3e3e3e] text-[#eff1f6]"
          : "bg-white border-slate-200 text-slate-800"
      }`}
    >
      {/* Left: Brand Logo & Problem Picker */}
      <div className="flex items-center gap-3">
        {/* LeetCode Style LLD Logo */}
        <div className="flex items-center gap-2 pr-2 border-r border-[#3e3e3e]/40">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-sm">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight font-sans">CodeArchitect</span>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              LLD
            </span>
          </div>
        </div>

        {/* Problem Selector & Nav Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevProblem}
            title="Previous Problem"
            className={`p-1.5 rounded-md transition-colors ${
              isDark ? "hover:bg-[#3e3e3e] text-slate-300" : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Problem Selector Dropdown */}
          <select
            value={selectedProblem?.id || ""}
            onChange={(e) => {
              const found = problems.find((p) => p.id === e.target.value);
              if (found) onSelectProblem(found);
            }}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-md cursor-pointer outline-none transition-all ${
              isDark
                ? "bg-[#1a1a1a] text-[#eff1f6] border border-[#3e3e3e] hover:border-slate-500"
                : "bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400"
            }`}
          >
            {problems.map((p) => (
              <option key={p.id} value={p.id} className={isDark ? "bg-[#282828]" : "bg-white"}>
                {p.title} ({p.difficulty})
              </option>
            ))}
          </select>

          <button
            onClick={onNextProblem}
            title="Next Problem"
            className={`p-1.5 rounded-md transition-colors ${
              isDark ? "hover:bg-[#3e3e3e] text-slate-300" : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onRandomProblem}
            title="Random Problem"
            className={`p-1.5 rounded-md transition-colors ml-0.5 ${
              isDark ? "hover:bg-[#3e3e3e] text-slate-300" : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Difficulty Badge */}
        {selectedProblem && (
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[#3e3e3e]/40">
            {selectedProblem.difficulty === "EASY" && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Easy
              </span>
            )}
            {selectedProblem.difficulty === "MEDIUM" && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Medium
              </span>
            )}
            {selectedProblem.difficulty === "HARD" && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                Hard
              </span>
            )}
          </div>
        )}
      </div>

      {/* Center: LeetCode Central Action (Run / Submit) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-4 py-1.5 rounded-md bg-[#2cbb5d] hover:bg-[#26a350] disabled:bg-opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Submit Solution</span>
              <kbd className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-white/80 border border-white/20">
                Ctrl + Enter
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Right: Modal Controls & Theme Toggle */}
      <div className="flex items-center gap-2">
        {/* Rubric Trigger */}
        <button
          onClick={onOpenRubric}
          className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
            isDark ? "hover:bg-[#3e3e3e] text-slate-300" : "hover:bg-slate-100 text-slate-700"
          }`}
          title="View 5-Dimension Evaluation Rubric"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Rubric</span>
        </button>

        {/* History Trigger */}
        <button
          onClick={onOpenHistory}
          className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
            isDark ? "hover:bg-[#3e3e3e] text-slate-300" : "hover:bg-slate-100 text-slate-700"
          }`}
          title="View Attempt Iteration History"
        >
          <History className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Submissions</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
            isDark ? "bg-[#1a1a1a] text-slate-300" : "bg-slate-200 text-slate-700"
          }`}>
            {historyCount}
          </span>
        </button>

        {/* Iteration Counter Badge */}
        {activeAttempt && (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Attempt #{activeAttempt.iteration}</span>
          </div>
        )}

        {/* Theme Switcher */}
        <button
          onClick={onToggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`p-1.5 rounded-md transition-colors ${
            isDark ? "hover:bg-[#3e3e3e] text-amber-400" : "hover:bg-slate-100 text-slate-600"
          }`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
