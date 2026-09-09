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

  const feedbackRef = useRef<HTMLDivElement>(null);

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

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMessage("Failed to start new attempt iteration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (payload: StarterTemplate) => {
    if (!activeAttempt || !selectedProblem) return;

    try {
      setIsSubmitting(true);
      setSubmissionState("EVALUATING");
      setErrorMessage(null);

      const submission = await api.submitSolution(activeAttempt.id, payload);
      setActiveSubmission(submission);
      setSubmissionState("SUCCESS");

      const history = await api.getAttemptHistory(selectedProblem.id);
      setAttemptsHistory(history);

      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 250);
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

  if (isLoading && problems.length === 0) {
    return (
      <div className="min-h-screen bg-nexcent-silver flex flex-col items-center justify-center text-nexcent-gray gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-nexcent-green" />
        <span className="text-xs uppercase font-bold tracking-wider">Loading Nexcent LLD Studio...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-nexcent-charcoal flex flex-col font-sans">
      {/* Nexcent Header */}
      <Header
        problems={problems}
        selectedProblem={selectedProblem}
        onSelectProblem={handleSelectProblem}
        activeAttempt={activeAttempt}
        historyCount={attemptsHistory.length}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenRubric={() => setIsRubricModalOpen(true)}
      />

      {/* Main Practice Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center justify-between gap-3 text-xs font-semibold shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs uppercase font-bold text-rose-700 hover:text-rose-900 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Selected Problem Overview with Hero Layout */}
        {selectedProblem && <ProblemOverview problem={selectedProblem} />}

        {/* Practice Studio Form */}
        {selectedProblem && (
          <PracticeStudio
            problem={selectedProblem}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submissionState={submissionState}
          />
        )}

        {/* Evaluation Feedback View */}
        <div ref={feedbackRef}>
          {activeSubmission?.evaluation && (
            <FeedbackView
              evaluation={activeSubmission.evaluation}
              onIterate={handleStartNewIteration}
              nextIterationNumber={(activeAttempt?.iteration || 1) + 1}
            />
          )}
        </div>
      </main>

      {/* Nexcent Footer */}
      <footer className="border-t border-nexcent-border bg-nexcent-charcoal text-white px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7">
              <polygon points="18,3 32,27 4,27" fill="#4CAF4F" />
              <polygon points="18,3 32,27 18,27" fill="#388E3C" opacity="0.9" />
              <polygon points="18,3 4,27 18,17" fill="#66BB6A" opacity="0.8" />
              <polygon points="18,17 32,27 18,27" fill="#2E7D32" opacity="0.85" />
            </svg>
            <span className="font-extrabold text-lg text-white">Nexcent</span>
            <span className="text-slate-500">|</span>
            <span className="text-xs text-slate-300 font-medium">Low-Level Design Practice Platform</span>
          </div>
          <p className="text-slate-400 text-xs font-normal">
            Copyright © 2026 Nexcent LLD. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Modals */}
      {selectedProblem && (
        <>
          <AttemptHistoryModal
            isOpen={isHistoryModalOpen}
            onClose={() => setIsHistoryModalOpen(false)}
            attempts={attemptsHistory}
            onSelectAttempt={handleSelectHistoricalAttempt}
            currentAttemptId={activeAttempt?.id}
          />

          <RubricModal
            isOpen={isRubricModalOpen}
            onClose={() => setIsRubricModalOpen(false)}
            rubric={selectedProblem.rubric}
          />
        </>
      )}
    </div>
  );
};
