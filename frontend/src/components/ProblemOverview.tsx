import React, { useState } from "react";
import { Problem } from "../types/index.js";
import { CheckCircle2, ShieldCheck, ChevronDown, ChevronUp, FileCode2, Cpu, Check } from "lucide-react";

interface ProblemOverviewProps {
  problem: Problem;
}

export const ProblemOverview: React.FC<ProblemOverviewProps> = ({ problem }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Split title to give the signature Nexcent green highlight
  const titleWords = problem.title.split(" ");
  const firstPart = titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(" ");
  const highlightedPart = titleWords.slice(Math.ceil(titleWords.length / 2)).join(" ");

  return (
    <div className="bg-nexcent-silver rounded-2xl border border-nexcent-border overflow-hidden shadow-sm">
      {/* Nexcent Hero Layout */}
      <div className="px-8 sm:px-12 py-10 sm:py-14 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Column: Two-Tone Typography & CTA */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nexcent-green-light border border-nexcent-green/20 text-nexcent-green text-xs font-bold uppercase tracking-wider">
            <span>{problem.difficulty} LLD CHALLENGE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-nexcent-charcoal leading-[1.15] tracking-tight">
            {firstPart}{" "}
            <span className="text-nexcent-green">{highlightedPart}</span>
          </h1>

          <p className="text-sm sm:text-base text-nexcent-gray leading-relaxed max-w-xl font-normal">
            {problem.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-6 py-2.5 rounded-md bg-nexcent-green hover:bg-nexcent-green-dark text-white text-xs font-bold transition-all shadow-sm shadow-nexcent-green/20 cursor-pointer flex items-center gap-2"
            >
              <span>{isExpanded ? "Collapse Specs" : "Explore Requirements"}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <span className="text-xs text-nexcent-gray">
              {problem.requirements.length} functional rules • {problem.constraints.length} design constraints
            </span>
          </div>
        </div>

        {/* Right Column: Nexcent-Style Tech & Architecture Illustration */}
        <div className="w-full lg:w-auto flex justify-center">
          <div className="relative w-72 sm:w-80 h-64 flex items-center justify-center">
            {/* Monitor Frame */}
            <div className="w-64 h-48 bg-white border-2 border-slate-700 rounded-xl shadow-lg relative p-3 flex flex-col justify-between">
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-nexcent-green"></div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">class Diagram.ts</span>
              </div>

              {/* Flow / Architecture Diagram */}
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-center gap-2">
                  <div className="px-2 py-1 rounded bg-nexcent-green-light border border-nexcent-green/40 text-[10px] font-bold text-nexcent-green-dark">
                    Facade Manager
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-0.5 h-3 bg-slate-300"></div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[9px] font-semibold text-slate-600">
                    Strategy Pattern
                  </div>
                  <div className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[9px] font-semibold text-slate-600">
                    State Context
                  </div>
                </div>
              </div>

              {/* Bottom Monitor Base */}
              <div className="flex items-center justify-between text-[9px] text-nexcent-green font-bold pt-1 border-t border-slate-100">
                <span>100% Extensible</span>
                <Check className="w-3.5 h-3.5 text-nexcent-green" />
              </div>
            </div>

            {/* Stand */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-6 bg-slate-400 rounded-b"></div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-2 bg-slate-600 rounded-full"></div>

            {/* Floating Developer Badge */}
            <div className="absolute -bottom-1 -right-2 bg-white rounded-lg border border-slate-200 p-2.5 shadow-md flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-nexcent-green flex items-center justify-center text-white text-xs font-black">
                ✓
              </div>
              <div className="text-[11px] leading-tight">
                <strong className="text-nexcent-charcoal block">Rubric Ready</strong>
                <span className="text-nexcent-gray">5 Criteria Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Requirements and Constraints Section */}
      {isExpanded && (
        <div className="bg-white border-t border-nexcent-border p-8 sm:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Functional Requirements */}
            <div className="bg-nexcent-silver rounded-xl p-6 border border-nexcent-border">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-nexcent-green mb-3">
                <CheckCircle2 className="w-4 h-4 text-nexcent-green" />
                Functional Requirements
              </div>
              <ul className="space-y-2.5 text-xs text-nexcent-charcoal">
                {problem.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-nexcent-green mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Design Constraints */}
            <div className="bg-nexcent-silver rounded-xl p-6 border border-nexcent-border">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-nexcent-charcoal mb-3">
                <ShieldCheck className="w-4 h-4 text-nexcent-charcoal" />
                Architectural Constraints & LLD Goals
              </div>
              <ul className="space-y-2.5 text-xs text-nexcent-charcoal">
                {problem.constraints.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-nexcent-charcoal mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Carousel dots matching Nexcent screenshot */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-nexcent-green"></span>
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
          </div>
        </div>
      )}
    </div>
  );
};
