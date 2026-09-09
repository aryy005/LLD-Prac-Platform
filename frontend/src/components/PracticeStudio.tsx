import React, { useState, useEffect } from "react";
import { Problem, StarterTemplate, ClassDefinition, PatternJustification } from "../types/index.js";
import {
  FileText,
  Boxes,
  Compass,
  GitBranch,
  Plus,
  Trash2,
  Sparkles,
  Send,
  CheckCircle2,
  Loader2
} from "lucide-react";

interface PracticeStudioProps {
  problem: Problem;
  onSubmit: (payload: StarterTemplate) => Promise<void>;
  isSubmitting: boolean;
  submissionState: "IDLE" | "SUBMITTING" | "EVALUATING" | "SUCCESS" | "ERROR";
}

export const PracticeStudio: React.FC<PracticeStudioProps> = ({
  problem,
  onSubmit,
  isSubmitting,
  submissionState
}) => {
  const [activeTab, setActiveTab] = useState<"assumptions" | "entities" | "patterns" | "diagram">("assumptions");

  const [assumptions, setAssumptions] = useState("");
  const [entities, setEntities] = useState<ClassDefinition[]>([]);
  const [patterns, setPatterns] = useState<PatternJustification[]>([]);
  const [diagramOrCode, setDiagramOrCode] = useState("");

  useEffect(() => {
    loadStarter();
  }, [problem.id]);

  const loadStarter = () => {
    if (problem.starterTemplate) {
      setAssumptions(problem.starterTemplate.requirementsAndAssumptions || "");
      setEntities(JSON.parse(JSON.stringify(problem.starterTemplate.entitiesAndInterfaces || [])));
      setPatterns(JSON.parse(JSON.stringify(problem.starterTemplate.patternsAndTradeoffs || [])));
      setDiagramOrCode(problem.starterTemplate.diagramOrCode || "");
    }
  };

  const loadSample = () => {
    if (problem.sampleSolution) {
      setAssumptions(problem.sampleSolution.requirementsAndAssumptions || "");
      setEntities(JSON.parse(JSON.stringify(problem.sampleSolution.entitiesAndInterfaces || [])));
      setPatterns(JSON.parse(JSON.stringify(problem.sampleSolution.patternsAndTradeoffs || [])));
      setDiagramOrCode(problem.sampleSolution.diagramOrCode || "");
    }
  };

  const handleAddEntity = () => {
    setEntities([
      ...entities,
      {
        name: `NewEntity${entities.length + 1}`,
        isInterface: false,
        responsibilities: "Describe the primary cohesive duty owned by this entity.",
        methods: ["executeAction(): void"],
        relationships: []
      }
    ]);
  };

  const handleRemoveEntity = (index: number) => {
    setEntities(entities.filter((_, i) => i !== index));
  };

  const handleUpdateEntity = (index: number, updated: Partial<ClassDefinition>) => {
    const next = [...entities];
    next[index] = { ...next[index], ...updated };
    setEntities(next);
  };

  const handleAddPattern = () => {
    setPatterns([
      ...patterns,
      {
        patternName: "Strategy Pattern",
        whereApplied: "Decouple algorithm from host class",
        rationale: "Accommodates future algorithm variations without modifying existing classes."
      }
    ]);
  };

  const handleRemovePattern = (index: number) => {
    setPatterns(patterns.filter((_, i) => i !== index));
  };

  const handleUpdatePattern = (index: number, updated: Partial<PatternJustification>) => {
    const next = [...patterns];
    next[index] = { ...next[index], ...updated };
    setPatterns(next);
  };

  const handleSubmit = async () => {
    await onSubmit({
      requirementsAndAssumptions: assumptions,
      entitiesAndInterfaces: entities,
      patternsAndTradeoffs: patterns,
      diagramOrCode
    });
  };

  return (
    <div className="bg-white border border-nexcent-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Studio Header Toolbar */}
      <div className="bg-white border-b border-nexcent-border px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Underlined Navigation Tabs */}
        <div className="flex items-center gap-1 border-b sm:border-b-0 border-slate-100">
          <button
            onClick={() => setActiveTab("assumptions")}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "assumptions"
                ? "border-nexcent-green text-nexcent-green"
                : "border-transparent text-nexcent-gray hover:text-nexcent-charcoal"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Scope & Assumptions</span>
          </button>

          <button
            onClick={() => setActiveTab("entities")}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "entities"
                ? "border-nexcent-green text-nexcent-green"
                : "border-transparent text-nexcent-gray hover:text-nexcent-charcoal"
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Entities & Signatures ({entities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("patterns")}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "patterns"
                ? "border-nexcent-green text-nexcent-green"
                : "border-transparent text-nexcent-gray hover:text-nexcent-charcoal"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Patterns & Trade-offs ({patterns.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("diagram")}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "diagram"
                ? "border-nexcent-green text-nexcent-green"
                : "border-transparent text-nexcent-gray hover:text-nexcent-charcoal"
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Class Diagram</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadStarter}
            className="px-3 py-1.5 text-xs font-medium text-nexcent-gray hover:text-nexcent-charcoal bg-nexcent-silver rounded-md border border-nexcent-border transition-colors"
            title="Reset to starter scaffolding"
          >
            Reset Starter
          </button>

          <button
            type="button"
            onClick={loadSample}
            className="px-3.5 py-1.5 text-xs font-bold text-nexcent-green bg-nexcent-green-light hover:bg-nexcent-green hover:text-white rounded-md border border-nexcent-green/30 flex items-center gap-1.5 transition-all shadow-sm"
            title="Load golden sample solution for demonstration"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Sample Solution
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-7 min-h-[360px]">
        {/* Tab 1: Scope & Assumptions */}
        {activeTab === "assumptions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="assumptions-nexcent" className="text-xs font-bold uppercase tracking-wider text-nexcent-charcoal block">
                  Requirements Understanding & Operational Assumptions
                </label>
                <p className="text-xs text-nexcent-gray mt-0.5">
                  State clear concurrency mechanisms, boundary limits, and non-goals before designing classes.
                </p>
              </div>
              <span className="text-xs font-mono font-medium text-nexcent-gray bg-nexcent-silver px-2.5 py-1 rounded">
                {assumptions.length} characters
              </span>
            </div>

            <textarea
              id="assumptions-nexcent"
              value={assumptions}
              onChange={e => setAssumptions(e.target.value)}
              rows={12}
              className="w-full bg-nexcent-silver border border-nexcent-border rounded-xl p-4 text-xs font-mono text-nexcent-charcoal focus:outline-none focus:ring-2 focus:ring-nexcent-green/20 focus:border-nexcent-green transition-all resize-y leading-relaxed"
              placeholder="e.g. Assumptions:
1. Multi-level parking lot with motorcycle, compact, and truck bays.
2. Concurrent entry gates: thread safety addressed via synchronized spot reservation.
3. Pricing policy separates rates by vehicle category."
            />
          </div>
        )}

        {/* Tab 2: Entities & Interfaces */}
        {activeTab === "entities" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-nexcent-charcoal">
                  Domain Classes, Interfaces & Single Responsibility (SRP)
                </h4>
                <p className="text-xs text-nexcent-gray mt-0.5">
                  Declare cohesive entities and explicit interface abstractions.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddEntity}
                className="px-3 py-1.5 bg-nexcent-green hover:bg-nexcent-green-dark text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Entity
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-1">
              {entities.map((entity, idx) => (
                <div key={idx} className="bg-nexcent-silver border border-nexcent-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={entity.name}
                        onChange={e => handleUpdateEntity(idx, { name: e.target.value })}
                        className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs font-bold text-nexcent-charcoal focus:outline-none focus:border-nexcent-green w-48 shadow-sm"
                        placeholder="Entity Name"
                      />
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-nexcent-gray cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!entity.isInterface}
                          onChange={e => handleUpdateEntity(idx, { isInterface: e.target.checked })}
                          className="rounded border-slate-300 text-nexcent-green focus:ring-0"
                        />
                        <span>Interface</span>
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveEntity(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      title="Delete entity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-nexcent-gray block mb-1">
                      Single Responsibility (SRP)
                    </label>
                    <textarea
                      value={entity.responsibilities}
                      onChange={e => handleUpdateEntity(idx, { responsibilities: e.target.value })}
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-md p-2 text-xs text-nexcent-charcoal focus:outline-none focus:border-nexcent-green leading-relaxed"
                      placeholder="What single cohesive duty belongs here?"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-nexcent-gray block mb-1">
                      Key Methods (comma separated)
                    </label>
                    <input
                      type="text"
                      value={(entity.methods || []).join(", ")}
                      onChange={e =>
                        handleUpdateEntity(idx, {
                          methods: e.target.value.split(",").map(m => m.trim()).filter(Boolean)
                        })
                      }
                      className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-mono text-nexcent-charcoal focus:outline-none focus:border-nexcent-green"
                      placeholder="e.g. parkVehicle(v), unpark(ticket)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Patterns & Trade-offs */}
        {activeTab === "patterns" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-nexcent-charcoal">
                  Design Patterns Applied & Architectural Rationale
                </h4>
                <p className="text-xs text-nexcent-gray mt-0.5">
                  Explain why each pattern was chosen and how it supports open/closed extensibility.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddPattern}
                className="px-3 py-1.5 bg-nexcent-green hover:bg-nexcent-green-dark text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Pattern
              </button>
            </div>

            <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
              {patterns.map((pattern, idx) => (
                <div key={idx} className="bg-nexcent-silver border border-nexcent-border rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={pattern.patternName}
                      onChange={e => handleUpdatePattern(idx, { patternName: e.target.value })}
                      className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs font-bold text-nexcent-green focus:outline-none focus:border-nexcent-green w-52 shadow-sm"
                      placeholder="e.g. Strategy Pattern"
                    />

                    <input
                      type="text"
                      value={pattern.whereApplied}
                      onChange={e => handleUpdatePattern(idx, { whereApplied: e.target.value })}
                      className="flex-1 bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs text-nexcent-charcoal focus:outline-none focus:border-nexcent-green"
                      placeholder="Where applied (e.g. SpotAssignmentStrategy, PricingEngine)"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemovePattern(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      title="Delete pattern"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-nexcent-gray block mb-1">
                      Architectural Rationale
                    </label>
                    <textarea
                      value={pattern.rationale}
                      onChange={e => handleUpdatePattern(idx, { rationale: e.target.value })}
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-md p-2 text-xs text-nexcent-charcoal focus:outline-none focus:border-nexcent-green leading-relaxed"
                      placeholder="Explain what change this pattern isolates from core classes."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Diagram / Code */}
        {activeTab === "diagram" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="diagram-input-nexcent" className="text-xs font-bold uppercase tracking-wider text-nexcent-charcoal block">
                  Mermaid Class Diagram or Implementation Skeleton
                </label>
                <p className="text-xs text-nexcent-gray mt-0.5">
                  Visual relationship mapping (Change Test A support).
                </p>
              </div>
              <span className="text-[11px] font-bold text-nexcent-green bg-nexcent-green-light px-2.5 py-1 rounded border border-nexcent-green/30">
                Polymorphic Payload
              </span>
            </div>

            <textarea
              id="diagram-input-nexcent"
              value={diagramOrCode}
              onChange={e => setDiagramOrCode(e.target.value)}
              rows={12}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-300 focus:outline-none focus:ring-2 focus:ring-nexcent-green/20 transition-all resize-y leading-relaxed"
              placeholder="classDiagram
    ParkingLot *-- ParkingFloor
    ParkingFloor *-- ParkingSpot
    ParkingLot --> SpotStrategy"
            />
          </div>
        )}
      </div>

      {/* Footer Bar */}
      <div className="bg-nexcent-silver border-t border-nexcent-border px-7 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-nexcent-gray">
          {submissionState === "EVALUATING" && (
            <div className="flex items-center gap-2 text-nexcent-green font-bold animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Running Composite Rubric Evaluator...</span>
            </div>
          )}
          {submissionState === "SUCCESS" && (
            <div className="flex items-center gap-1.5 text-nexcent-green font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Evaluation complete! Detailed rubric report ready below.</span>
            </div>
          )}
          {submissionState === "IDLE" && (
            <span>Ready for evaluation against 5-dimensional rubric.</span>
          )}
        </div>

        {/* Nexcent Green Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-md bg-nexcent-green hover:bg-nexcent-green-dark disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 shadow-sm shadow-nexcent-green/25 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Submit for Evaluation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
