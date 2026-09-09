import React from "react";
import { Evaluation } from "../types/index.js";
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Search,
  ArrowRight,
  Cpu,
  RefreshCw,
  TrendingUp,
  Sparkles
} from "lucide-react";

interface FeedbackViewProps {
  evaluation: Evaluation;
  onIterate: () => void;
  nextIterationNumber: number;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  evaluation,
  onIterate,
  nextIterationNumber
}) => {
  const { report, totalScore, maxScore, scorePercentage } = evaluation;

  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-nexcent-green-dark bg-nexcent-green-light border-nexcent-green/40";
    if (score === 3) return "text-amber-800 bg-amber-50 border-amber-300";
    return "text-rose-700 bg-rose-50 border-rose-300";
  };

  return (
    <div className="bg-white border border-nexcent-border rounded-2xl overflow-hidden shadow-sm space-y-7 p-8 sm:p-10">
      {/* Top Banner: Score & Architectural Synthesis */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-nexcent-border">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase px-3 py-1 rounded-full bg-nexcent-green-light text-nexcent-green border border-nexcent-green/25 tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-nexcent-green" />
              {report.evaluatorName}
            </span>
            <span className="text-xs font-medium text-nexcent-gray">
              Evaluated {new Date(evaluation.evaluatedAt).toLocaleTimeString()}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-nexcent-charcoal tracking-tight">
            Evaluation Report & Architectural Feedback
          </h3>

          <p className="text-sm text-nexcent-gray leading-relaxed font-normal">
            {report.overallSummary}
          </p>
        </div>

        {/* Nexcent Score Card */}
        <div className="flex items-center gap-5 bg-nexcent-silver border border-nexcent-border p-5 rounded-xl self-stretch md:self-auto justify-between md:justify-start">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-nexcent-gray">
              Rubric Total
            </div>
            <div className="text-3xl font-black text-nexcent-charcoal tracking-tight">
              {totalScore} <span className="text-nexcent-gray text-sm font-medium">/ {maxScore}</span>
            </div>
          </div>

          <div className="w-16 h-16 rounded-xl bg-nexcent-green flex flex-col items-center justify-center shadow-md shadow-nexcent-green/25 text-white font-black text-lg">
            {scorePercentage}%
            <span className="text-[9px] font-bold uppercase opacity-90 tracking-wider">Score</span>
          </div>
        </div>
      </div>

      {/* Strengths & Next Refactorings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Key Strengths */}
        <div className="bg-nexcent-green-light/60 border border-nexcent-green/30 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-nexcent-green-dark">
            <CheckCircle2 className="w-4 h-4 text-nexcent-green" />
            Key Architectural Strengths
          </div>
          <ul className="space-y-2 text-xs text-nexcent-charcoal font-medium">
            {report.keyStrengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-nexcent-green font-bold mt-0.5">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Priority Refactorings */}
        <div className="bg-nexcent-silver border border-nexcent-border rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-nexcent-charcoal">
            <TrendingUp className="w-4 h-4 text-nexcent-green" />
            Priority Refactorings for Next Attempt
          </div>
          <ul className="space-y-2 text-xs text-nexcent-charcoal font-medium">
            {report.priorityImprovements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-nexcent-charcoal font-bold mt-0.5">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Dimensional Rubric Breakdown */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-nexcent-charcoal">
          Dimensional Rubric Breakdown
        </h4>

        <div className="space-y-3.5">
          {report.items.map((item, idx) => (
            <div
              key={idx}
              className="bg-nexcent-silver/60 border border-nexcent-border rounded-xl p-5 space-y-3 hover:border-slate-300 transition-colors"
            >
              {/* Criterion Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getScoreColor(
                      item.score
                    )}`}
                  >
                    {item.score} / 5
                  </span>
                  <h5 className="text-sm font-bold text-nexcent-charcoal">{item.criterionName}</h5>
                </div>

                <span className="text-xs font-mono font-medium text-nexcent-gray">
                  Confidence: {Math.round(item.confidence * 100)}%
                </span>
              </div>

              {/* Evidence Citation */}
              <div className="bg-white rounded-lg p-3.5 border border-nexcent-border text-xs shadow-sm">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-nexcent-green uppercase tracking-wider mb-1">
                  <Search className="w-3.5 h-3.5" />
                  Evidence in Candidate Solution
                </div>
                <p className="text-nexcent-charcoal italic font-mono text-[12px] leading-relaxed">
                  "{item.evidence}"
                </p>
              </div>

              {/* Concern & Suggestion */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-3.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-700 uppercase tracking-wider mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    Architectural Concern
                  </div>
                  <p className="text-slate-700 leading-relaxed">{item.concern}</p>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-nexcent-green-dark uppercase tracking-wider mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-nexcent-green" />
                    Refactoring Suggestion
                  </div>
                  <p className="text-slate-700 leading-relaxed">{item.suggestion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Loop CTA */}
      <div className="bg-nexcent-silver border border-nexcent-border rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-sm font-bold text-nexcent-charcoal flex items-center justify-center sm:justify-start gap-2">
            <RefreshCw className="w-4 h-4 text-nexcent-green" />
            Complete the Learning Loop
          </div>
          <p className="text-xs text-nexcent-gray font-normal">
            Apply the suggested refactorings to boost your scores in Attempt #{nextIterationNumber}!
          </p>
        </div>

        <button
          onClick={onIterate}
          className="px-6 py-2.5 bg-nexcent-green hover:bg-nexcent-green-dark text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm shadow-nexcent-green/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <span>Start Attempt #{nextIterationNumber}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
