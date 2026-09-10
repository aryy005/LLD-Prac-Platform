import React, { useState, useEffect, useRef } from "react";
import { Problem, Attempt, Submission, StarterTemplate } from "./types/index.js";
import { api } from "./services/api.js";
import { Header } from "./components/Header.js";
import { ProblemOverview } from "./components/ProblemOverview.js";
import { PracticeStudio } from "./components/PracticeStudio.js";
import { FeedbackView } from "./components/FeedbackView.js";
import { AttemptHistoryModal } from "./components/AttemptHistoryModal.js";
import { RubricModal } from "./components/RubricModal.js";
import { AlertCircle, Loader2 } from "lucide-react";

export const App: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<Attempt | null>(null);
  const [attemptsHistory, setAttemptsHistory] = useState<Attempt[]>([]);
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<"IDLE" | "SUBMITTING" | "EVALUATING" | "SUCCESS" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);

  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const latestStudioDataRef = useRef<StarterTemplate | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const list = await api.getProblems();
        setProblems(list);
        if (list.length > 0) {
          await handleSelectProblem(list[0]);
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to load problems.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectProblem = async (problem: Problem) => {
    setSelectedProblem(problem);
    setActiveSubmission(null);
    setSubmissionState("IDLE");
    setErrorMessage(null);

    try {
      const attempt = await api.startAttempt(problem.id, false);
      setActiveAttempt(attempt);

      const history = await api.getAttemptHistory(problem.id);
      setAttemptsHistory(history);

      const latestSub = attempt.submissions[attempt.submissions.length - 1];
      if (latestSub?.evaluation) {
        setActiveSubmission(latestSub);
        setSubmissionState("SUCCESS");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Could not initialize attempt for problem.");
    }
  };

  const handlePrevProblem = () => {
    if (!selectedProblem || problems.length === 0) return;
    const currentIndex = problems.findIndex((p) => p.id === selectedProblem.id);
    const prevIndex = (currentIndex - 1 + problems.length) % problems.length;
    handleSelectProblem(problems[prevIndex]);
  };

  const handleNextProblem = () => {
    if (!selectedProblem || problems.length === 0) return;
    const currentIndex = problems.findIndex((p) => p.id === selectedProblem.id);
    const nextIndex = (currentIndex + 1) % problems.length;
    handleSelectProblem(problems[nextIndex]);
  };

  const handleRandomProblem = () => {
    if (problems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * problems.length);
    handleSelectProblem(problems[randomIndex]);
  };

  const handleStartNewIteration = async () => {
    if (!selectedProblem) return;
    try {
      setIsLoading(true);
      const newAttempt = await api.startAttempt(selectedProblem.id, true);
      setActiveAttempt(newAttempt);
      setActiveSubmission(null);
      setSubmissionState("IDLE");

      const history = await api.getAttemptHistory(selectedProblem.id);
      setAttemptsHistory(history);
    } catch (err: any) {
      setErrorMessage("Failed to start new attempt iteration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (payload?: StarterTemplate) => {
    if (!activeAttempt || !selectedProblem) return;

    // Use passed payload or fall back to template
    const finalPayload = payload || latestStudioDataRef.current || {
      requirementsAndAssumptions: selectedProblem.starterTemplate.requirementsAndAssumptions,
      entitiesAndInterfaces: selectedProblem.starterTemplate.entitiesAndInterfaces,
      patternsAndTradeoffs: selectedProblem.starterTemplate.patternsAndTradeoffs,
      diagramOrCode: selectedProblem.starterTemplate.diagramOrCode
    };

    try {
      setIsSubmitting(true);
      setSubmissionState("EVALUATING");
      setErrorMessage(null);

      const submission = await api.submitSolution(activeAttempt.id, finalPayload);
      setActiveSubmission(submission);
      setSubmissionState("SUCCESS");

      const history = await api.getAttemptHistory(selectedProblem.id);
      setAttemptsHistory(history);
    } catch (err: any) {
      setSubmissionState("ERROR");
      setErrorMessage(err.message || "Evaluation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectHistoricalAttempt = (attempt: Attempt) => {
    setActiveAttempt(attempt);
    const sub = attempt.submissions[attempt.submissions.length - 1];
    if (sub) {
      setActiveSubmission(sub);
      setSubmissionState("SUCCESS");
    }
  };

  // Shortcut key handling: Ctrl + Enter / Cmd + Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeAttempt, selectedProblem]);

  if (isLoading && problems.length === 0) {
    return (
      <div className="h-screen bg-[#1a1a1a] flex flex-col items-center justify-center text-slate-300 gap-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#2cbb5d]" />
        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
          Loading CodeArchitect LLD Studio...
        </span>
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div
      className={`h-screen flex flex-col overflow-hidden font-sans select-none transition-colors ${
        isDark ? "bg-[#1a1a1a] text-[#eff1f6]" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* LeetCode Workspace Top Navigation Header */}
      <Header
        problems={problems}
        selectedProblem={selectedProblem}
        onSelectProblem={handleSelectProblem}
        activeAttempt={activeAttempt}
        historyCount={attemptsHistory.length}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenRubric={() => setIsRubricModalOpen(true)}
        onSubmit={() => handleSubmit()}
        isSubmitting={isSubmitting}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        onPrevProblem={handlePrevProblem}
        onNextProblem={handleNextProblem}
        onRandomProblem={handleRandomProblem}
      />

      {/* Main Dual-Pane LeetCode Split Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Error Alert Overlay */}
        {errorMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-rose-900/90 border border-rose-700 text-rose-100 px-4 py-2.5 rounded-xl flex items-center gap-3 text-xs font-semibold shadow-lg backdrop-blur-md">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs uppercase font-bold text-rose-300 hover:text-white cursor-pointer ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Left Side: LeetCode Problem Info Hub */}
        <div
          className={`w-1/2 h-full border-r overflow-hidden ${
            isDark ? "border-[#3e3e3e]" : "border-slate-300"
          }`}
        >
          {selectedProblem && (
            <ProblemOverview
              problem={selectedProblem}
              attemptsHistory={attemptsHistory}
              onSelectAttempt={handleSelectHistoricalAttempt}
              theme={theme}
            />
          )}
        </div>

        {/* Right Side: Code & Design Studio + Output Console */}
        <div className="w-1/2 h-full flex flex-col overflow-hidden">
          {/* Upper Right: Code & Architecture Studio Editor */}
          <div className="flex-1 overflow-hidden">
            {selectedProblem && (
              <PracticeStudio
                problem={selectedProblem}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submissionState={submissionState}
                theme={theme}
              />
            )}
          </div>

          {/* Lower Right: Collapsible Test Results & Evaluation Console */}
          {activeSubmission?.evaluation && (
            <FeedbackView
              evaluation={activeSubmission.evaluation}
              onIterate={handleStartNewIteration}
              nextIterationNumber={(activeAttempt?.iteration || 1) + 1}
              theme={theme}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <AttemptHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        attempts={attemptsHistory}
        onSelectAttempt={handleSelectHistoricalAttempt}
        currentAttemptId={activeAttempt?.id}
      />

      {selectedProblem && (
        <RubricModal
          isOpen={isRubricModalOpen}
          onClose={() => setIsRubricModalOpen(false)}
          rubric={selectedProblem.rubric}
        />
      )}
    </div>
  );
};
