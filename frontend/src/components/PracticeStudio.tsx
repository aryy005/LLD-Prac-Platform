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
  RotateCcw,
  Code,
  Layers,
  ChevronDown
} from "lucide-react";

interface PracticeStudioProps {
  problem: Problem;
  onSubmit: (payload: StarterTemplate) => Promise<void>;
  isSubmitting: boolean;
  submissionState: "IDLE" | "SUBMITTING" | "EVALUATING" | "SUCCESS" | "ERROR";
  theme?: "dark" | "light";
}

export const PracticeStudio: React.FC<PracticeStudioProps> = ({
  problem,
  onSubmit,
  isSubmitting,
  submissionState,
  theme = "dark"
}) => {
  const [activeTab, setActiveTab] = useState<"assumptions" | "entities" | "patterns" | "diagram">("assumptions");

  const [assumptions, setAssumptions] = useState("");
  const [entities, setEntities] = useState<ClassDefinition[]>([]);
  const [patterns, setPatterns] = useState<PatternJustification[]>([]);
  const [diagramOrCode, setDiagramOrCode] = useState("");

  const isDark = theme === "dark";

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

  return (
    <div
      className={`h-full flex flex-col overflow-hidden transition-colors ${
        isDark ? "bg-[#282828] text-[#eff1f6]" : "bg-white text-slate-800"
      }`}
    >
      {/* Studio Header Toolbar Tabs */}
      <div
        className={`flex items-center justify-between border-b px-3 shrink-0 select-none ${
          isDark ? "border-[#3e3e3e] bg-[#222222]" : "border-slate-200 bg-slate-100"
        }`}
      >
        {/* Editor Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("assumptions")}
            className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "assumptions"
                ? "border-[#2cbb5d] text-[#2cbb5d] font-bold"
                : isDark
                ? "border-transparent text-slate-400 hover:text-slate-200"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Scope & Assumptions</span>
          </button>

          <button
            onClick={() => setActiveTab("entities")}
            className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "entities"
                ? "border-[#2cbb5d] text-[#2cbb5d] font-bold"
                : isDark
                ? "border-transparent text-slate-400 hover:text-slate-200"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Entities & Signatures ({entities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("patterns")}
            className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "patterns"
                ? "border-[#2cbb5d] text-[#2cbb5d] font-bold"
                : isDark
                ? "border-transparent text-slate-400 hover:text-slate-200"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Patterns ({patterns.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("diagram")}
            className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "diagram"
                ? "border-[#2cbb5d] text-[#2cbb5d] font-bold"
                : isDark
                ? "border-transparent text-slate-400 hover:text-slate-200"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Class Diagram / Code</span>
          </button>
        </div>

        {/* Quick Demo Scaffolding Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadStarter}
            title="Reset to Starter Scaffolding"
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors flex items-center gap-1 ${
              isDark
                ? "bg-[#1a1a1a] text-slate-300 hover:bg-[#3e3e3e] border border-[#3e3e3e]"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={loadSample}
            title="Load Golden Sample Architecture"
            className="px-2.5 py-1 text-[11px] font-bold text-[#2cbb5d] bg-[#2cbb5d]/10 hover:bg-[#2cbb5d]/20 rounded border border-[#2cbb5d]/30 flex items-center gap-1 transition-all"
          >
            <Sparkles className="w-3 h-3 text-[#2cbb5d]" />
            <span>Load Sample Architecture</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Tab 1: Scope & Assumptions */}
        {activeTab === "assumptions" && (
          <div className="h-full flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Requirements & Operational Constraints
                </label>
                <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Define functional boundaries, concurrency handling, and explicit non-goals.
                </p>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                isDark ? "bg-[#1a1a1a] text-slate-400" : "bg-slate-100 text-slate-600"
              }`}>
                {assumptions.length} characters
              </span>
            </div>

            <textarea
              value={assumptions}
              onChange={(e) => setAssumptions(e.target.value)}
              className={`flex-1 w-full p-3.5 text-xs font-mono rounded-xl border outline-none leading-relaxed resize-none transition-all ${
                isDark
                  ? "bg-[#1a1a1a] border-[#3e3e3e] text-[#eff1f6] focus:border-[#2cbb5d]"
                  : "bg-slate-50 border-slate-300 text-slate-800 focus:border-emerald-500"
              }`}
              rows={14}
              placeholder="e.g. Assumptions & Scope:
1. System handles multi-level parking with Motorcycle, Compact, and Truck slots.
2. Concurrent entry gates synchronize spot reservations using a synchronized allocator.
3. Pricing policy separates rates per vehicle category using a Strategy Pattern."
            />
          </div>
        )}

        {/* Tab 2: Domain Entities & Signatures */}
        {activeTab === "entities" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Domain Classes, Interfaces & Single Responsibility (SRP)
                </h4>
                <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Declare domain entities, method contracts, and class relationships.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddEntity}
                className="px-2.5 py-1 bg-[#2cbb5d] hover:bg-[#26a350] text-white rounded text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Entity
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {entities.map((entity, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border space-y-3 ${
                    isDark ? "bg-[#1f1f1f] border-[#3e3e3e]" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={entity.name}
                      onChange={(e) => handleUpdateEntity(idx, { name: e.target.value })}
                      className={`font-mono text-xs font-bold px-2 py-1 rounded border outline-none flex-1 ${
                        isDark ? "bg-[#1a1a1a] border-[#3e3e3e] text-[#2cbb5d]" : "bg-white border-slate-300 text-emerald-600"
                      }`}
                      placeholder="Entity / Class Name"
                    />

                    <label className="flex items-center gap-1 cursor-pointer select-none text-[11px]">
                      <input
                        type="checkbox"
                        checked={entity.isInterface}
                        onChange={(e) => handleUpdateEntity(idx, { isInterface: e.target.checked })}
                        className="rounded accent-[#2cbb5d]"
                      />
                      <span className={entity.isInterface ? "text-amber-400 font-bold" : "text-slate-400"}>
                        Interface
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemoveEntity(idx)}
                      className="p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-500/10 rounded transition-colors"
                      title="Remove entity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Cohesive Duty (SRP)
                    </label>
                    <input
                      type="text"
                      value={entity.responsibilities}
                      onChange={(e) => handleUpdateEntity(idx, { responsibilities: e.target.value })}
                      className={`w-full text-xs px-2 py-1 rounded border outline-none ${
                        isDark ? "bg-[#1a1a1a] border-[#3e3e3e] text-slate-300" : "bg-white border-slate-300 text-slate-700"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Method Signatures (comma separated)
                    </label>
                    <input
                      type="text"
                      value={entity.methods ? entity.methods.join(", ") : ""}
                      onChange={(e) =>
                        handleUpdateEntity(idx, {
                          methods: e.target.value.split(",").map((m) => m.trim())
                        })
                      }
                      className={`w-full text-xs font-mono px-2 py-1 rounded border outline-none ${
                        isDark ? "bg-[#1a1a1a] border-[#3e3e3e] text-slate-300" : "bg-white border-slate-300 text-slate-700"
                      }`}
                      placeholder="e.g. parkVehicle(v: Vehicle): Ticket, checkout(): float"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Design Patterns & Trade-offs */}
        {activeTab === "patterns" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Design Pattern Justifications & Extensibility
                </h4>
                <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Justify design pattern selections (Strategy, State, Observer, Factory) and trade-offs.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddPattern}
                className="px-2.5 py-1 bg-[#2cbb5d] hover:bg-[#26a350] text-white rounded text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Pattern
              </button>
            </div>

            <div className="space-y-3">
              {patterns.map((pat, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border space-y-2.5 ${
                    isDark ? "bg-[#1f1f1f] border-[#3e3e3e]" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={pat.patternName}
                      onChange={(e) => handleUpdatePattern(idx, { patternName: e.target.value })}
                      className={`font-mono text-xs font-bold px-2 py-1 rounded border outline-none flex-1 ${
                        isDark ? "bg-[#1a1a1a] border-[#3e3e3e] text-amber-400" : "bg-white border-slate-300 text-amber-600"
                      }`}
                      placeholder="e.g. Strategy Pattern"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemovePattern(idx)}
                      className="p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-500/10 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Where Applied
                      </label>
                      <input
                        type="text"
                        value={pat.whereApplied}
                        onChange={(e) => handleUpdatePattern(idx, { whereApplied: e.target.value })}
                        className={`w-full text-xs px-2 py-1 rounded border outline-none ${
                          isDark ? "bg-[#1a1a1a] border-[#3e3e3e] text-slate-300" : "bg-white border-slate-300 text-slate-700"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Extensibility Rationale & Trade-off
                      </label>
                      <input
                        type="text"
                        value={pat.rationale}
                        onChange={(e) => handleUpdatePattern(idx, { rationale: e.target.value })}
                        className={`w-full text-xs px-2 py-1 rounded border outline-none ${
                          isDark ? "bg-[#1a1a1a] border-[#3e3e3e] text-slate-300" : "bg-white border-slate-300 text-slate-700"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Class Diagram & Code */}
        {activeTab === "diagram" && (
          <div className="h-full flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Mermaid Class Diagram / Code Skeleton
                </label>
                <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Express class interactions in Mermaid notation or TypeScript/Java code skeletons.
                </p>
              </div>
            </div>

            <textarea
              value={diagramOrCode}
              onChange={(e) => setDiagramOrCode(e.target.value)}
              className={`flex-1 w-full p-3.5 text-xs font-mono rounded-xl border outline-none leading-relaxed resize-none transition-all ${
                isDark
                  ? "bg-[#1a1a1a] border-[#3e3e3e] text-[#eff1f6] focus:border-[#2cbb5d]"
                  : "bg-slate-50 border-slate-300 text-slate-800 focus:border-emerald-500"
              }`}
              rows={14}
              placeholder="classDiagram
    class ParkingLot {
        +parkVehicle(v: Vehicle): Ticket
    }
    class PricingStrategy {
        <<interface>>
        +calculateFee(hours: float): float
    }
    ParkingLot --> PricingStrategy"
            />
          </div>
        )}
      </div>
    </div>
  );
};
