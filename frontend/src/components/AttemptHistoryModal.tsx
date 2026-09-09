import React from "react";
import { Attempt } from "../types/index.js";
import { X, History, TrendingUp, CheckCircle2, ChevronRight } from "lucide-react";

interface AttemptHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  attempts: Attempt[];
  onSelectAttempt: (attempt: Attempt) => void;
  currentAttemptId?: string;
}

export const AttemptHistoryModal: React.FC<AttemptHistoryModalProps> = ({
  isOpen,
  onClose,
  attempts,
  onSelectAttempt,
  currentAttemptId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-nexcent-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-nexcent-border flex items-center justify-between bg-nexcent-silver">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-nexcent-green-light text-nexcent-green-dark border border-nexcent-green/30">
              <History className="w-5 h-5 text-nexcent-green" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-nexcent-charcoal">
                Attempt Progression History
              </h3>
              <p className="text-xs text-nexcent-gray">
                Observe how your architectural decisions improved across iterations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-nexcent-charcoal hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-6 overflow-y-auto space-y-3.5">
          {attempts.length === 0 ? (
            <div className="text-center py-10 text-nexcent-gray text-sm font-medium">
              No previous attempts recorded for this problem yet.
            </div>
          ) : (
            attempts.map((att, idx) => {
              const latestSub = att.submissions[att.submissions.length - 1];
              const evalReport = latestSub?.evaluation;
              const prevAtt = idx > 0 ? attempts[idx - 1] : null;
              const prevEval = prevAtt?.submissions[prevAtt.submissions.length - 1]?.evaluation;

              const scoreDelta =
                evalReport && prevEval
                  ? evalReport.scorePercentage - prevEval.scorePercentage
                  : null;

              const isCurrent = att.id === currentAttemptId;

              return (
                <div
                  key={att.id}
                  className={`bg-nexcent-silver/70 border rounded-xl p-4 transition-all ${
                    isCurrent
                      ? "border-nexcent-green ring-1 ring-nexcent-green shadow-xs"
                      : "border-nexcent-border hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-nexcent-green text-white">
                          Iteration #{att.iteration}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-bold text-nexcent-green-dark bg-nexcent-green-light px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        )}
                        <span className="text-xs text-nexcent-gray">
                          {new Date(att.startedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-nexcent-charcoal font-medium">
                        {latestSub
                          ? `Submitted ${latestSub.payload.entitiesAndInterfaces.length} entities & ${latestSub.payload.patternsAndTradeoffs.length} patterns`
                          : "Draft in progress"}
                      </p>
                    </div>

                    {/* Scores & Delta */}
                    {evalReport ? (
                      <div className="flex items-center gap-4">
                        {scoreDelta !== null && scoreDelta !== 0 && (
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                              scoreDelta > 0
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-rose-100 text-rose-800 border border-rose-300"
                            }`}
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                            {scoreDelta > 0 ? `+${scoreDelta}%` : `${scoreDelta}%`}
                          </span>
                        )}

                        <div className="text-right">
                          <div className="text-xl font-extrabold text-nexcent-charcoal">
                            {evalReport.totalScore}
                            <span className="text-xs text-nexcent-gray font-normal"> / {evalReport.maxScore}</span>
                          </div>
                          <div className="text-[10px] font-bold text-nexcent-green uppercase tracking-wider">
                            {evalReport.scorePercentage}% Score
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onSelectAttempt(att);
                            onClose();
                          }}
                          className="p-2 rounded-md bg-white hover:bg-slate-100 border border-nexcent-border text-nexcent-charcoal shadow-xs transition-all"
                          title="View this attempt's solution and feedback"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-nexcent-gray italic">Not evaluated</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
