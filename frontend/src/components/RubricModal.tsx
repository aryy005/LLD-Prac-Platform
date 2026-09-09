import React from "react";
import { Rubric } from "../types/index.js";
import { X, Award, Cpu } from "lucide-react";

interface RubricModalProps {
  isOpen: boolean;
  onClose: () => void;
  rubric: Rubric;
}

export const RubricModal: React.FC<RubricModalProps> = ({ isOpen, onClose, rubric }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-nexcent-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-nexcent-border flex items-center justify-between bg-nexcent-silver">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-nexcent-green-light text-nexcent-green-dark border border-nexcent-green/30">
              <Award className="w-5 h-5 text-nexcent-green" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-nexcent-charcoal">
                LLD Evaluation Rubric (5 Dimensions)
              </h3>
              <p className="text-xs text-nexcent-gray">
                Standardized evaluation criteria applied by the Composite Evaluator
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

        {/* Criteria List */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <p className="text-nexcent-charcoal leading-relaxed">
            The platform assesses your architecture across 5 fundamental object-oriented dimensions, extracting concrete evidence directly from what you specified:
          </p>

          <div className="space-y-3">
            {rubric.criteria.map(crit => (
              <div key={crit.id} className="bg-nexcent-silver/70 border border-nexcent-border rounded-xl p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-nexcent-green"></span>
                    <h4 className="text-sm font-bold text-nexcent-charcoal">{crit.name}</h4>
                  </div>
                  <span className="text-nexcent-green-dark font-bold text-xs">Max {crit.maxScore} pts</span>
                </div>
                <p className="text-nexcent-gray leading-relaxed">{crit.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-nexcent-green-light/60 border border-nexcent-green/30 rounded-xl p-4 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-nexcent-green-dark flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-nexcent-green" />
              Structured Feedback Schema
            </div>
            <p className="text-nexcent-charcoal font-mono text-[11.5px]">
              criterion → score (1–5) → evidence citation → concern → suggestion → confidence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
