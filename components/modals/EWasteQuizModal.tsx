'use client';

import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, RotateCcw, Trophy, Leaf, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Which of the following is the most hazardous toxic heavy metal commonly found in old CRT monitors and TV screens?",
    options: ["Aluminum", "Lead (Pb)", "Silicon", "Copper"],
    correct: 1,
    explanation: "Lead is extensively used in CRT screens and solder. It can cause severe neurological damage and is a major e-waste hazard.",
  },
  {
    id: 2,
    question: "Approximately how much e-waste does the world generate every year?",
    options: ["10 million tonnes", "30 million tonnes", "53–62 million tonnes", "100 million tonnes"],
    correct: 2,
    explanation: "Global e-waste generation is estimated at 53–62 million metric tonnes per year, making it the fastest-growing solid waste stream.",
  },
  {
    id: 3,
    question: "Which country is the world's largest e-waste dumping ground?",
    options: ["China", "Nigeria", "India", "Bangladesh"],
    correct: 0,
    explanation: "China (particularly Guiyu, Guangdong) has historically been the world's largest e-waste dump, though legislation has reduced formal imports.",
  },
  {
    id: 4,
    question: "What percentage of e-waste is formally recycled globally?",
    options: ["Less than 20%", "Around 40%", "Around 60%", "More than 80%"],
    correct: 0,
    explanation: "Only about 17–20% of global e-waste is formally documented as properly recycled. The rest is landfilled, burned, or informally processed.",
  },
  {
    id: 5,
    question: "Which regulation restricts the use of hazardous substances like lead, mercury, and cadmium in electronic equipment in Europe?",
    options: ["WEEE Directive", "RoHS Directive", "REACH Regulation", "ELV Directive"],
    correct: 1,
    explanation: "The RoHS (Restriction of Hazardous Substances) Directive restricts the use of specific hazardous materials in electrical and electronic equipment sold in the EU.",
  },
  {
    id: 6,
    question: "Which precious metal can be recovered from e-waste and is worth recycling?",
    options: ["Platinum only", "Silver only", "Gold, silver, palladium, and platinum", "Iron and steel"],
    correct: 2,
    explanation: "E-waste is called 'urban mining' because circuit boards contain gold, silver, palladium, and platinum at concentrations higher than natural ore.",
  },
  {
    id: 7,
    question: "What is the primary environmental concern with burning e-waste in open air?",
    options: [
      "It produces too much smoke",
      "It releases dioxins, furans, and heavy metal fumes into the air",
      "It uses too much energy",
      "It only destroys plastic casings",
    ],
    correct: 1,
    explanation: "Open-air burning of e-waste releases highly toxic dioxins, furans, and vaporized heavy metals that contaminate soil, water, and the respiratory systems of nearby communities.",
  },
  {
    id: 8,
    question: "What does the WEEE Directive stand for?",
    options: [
      "Worldwide Electronic Equipment Enforcement",
      "Waste Electrical and Electronic Equipment Directive",
      "Western European E-waste Elimination Directive",
      "Waste Energy Efficiency Enforcement",
    ],
    correct: 1,
    explanation: "WEEE stands for Waste Electrical and Electronic Equipment — a European Union directive mandating the collection, recycling, and recovery of electronics.",
  },
  {
    id: 9,
    question: "Which component in smartphones contains the toxic element Beryllium and is a major health hazard when improperly recycled?",
    options: ["Battery", "Screen glass", "Connector springs and contacts", "Processor chip"],
    correct: 2,
    explanation: "Beryllium copper is used in connector springs and contacts. Beryllium dust from grinding or sanding is highly toxic and can cause a chronic lung disease called berylliosis.",
  },
  {
    id: 10,
    question: "Which of the following describes 'Right to Repair' legislation?",
    options: [
      "Laws requiring manufacturers to offer free repairs",
      "Laws mandating consumers recycle broken devices",
      "Laws requiring manufacturers to make devices repairable and provide parts/tools",
      "Laws banning the sale of non-recyclable electronics",
    ],
    correct: 2,
    explanation: "Right to Repair laws require manufacturers to design products with repairability in mind and provide consumers and independent repair shops with spare parts, tools, and manuals.",
  },
];

function getResultTier(score: number): { label: string; description: string; color: string; emoji: string } {
  if (score === 10) return { label: "E-Waste Expert!", description: "Perfect score! You're a sustainability champion. Your knowledge can make a real difference in the fight against e-waste.", color: "text-[#A7F3D0]", emoji: "🏆" };
  if (score >= 8) return { label: "Green Guardian", description: "Excellent! You have a deep understanding of e-waste challenges. Share your knowledge to inspire others!", color: "text-emerald-400", emoji: "🌿" };
  if (score >= 6) return { label: "Eco Explorer", description: "Good effort! You know a fair bit about e-waste. Keep learning and spread awareness around you.", color: "text-teal-400", emoji: "🔍" };
  if (score >= 4) return { label: "Circuit Learner", description: "You're on the right track. Explore our assignments and portfolio to deepen your e-waste knowledge.", color: "text-yellow-400", emoji: "📚" };
  return { label: "Recycling Rookie", description: "Every expert was once a beginner! Dive into our portfolio content to learn more about the e-waste crisis.", color: "text-orange-400", emoji: "🌱" };
}

interface EWasteQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EWasteQuizModal({ isOpen, onClose }: EWasteQuizModalProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(10).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  if (!isOpen) return null;

  const question = questions[currentQ];
  const isAnswered = answers[currentQ] !== null;
  const isCorrect = isAnswered && answers[currentQ] === question.correct;
  const score = answers.filter((a, i) => a === questions[i].correct).length;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
    setSelectedOption(idx);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(answers[currentQ + 1]);
      setShowExplanation(answers[currentQ + 1] !== null);
    } else {
      setQuizComplete(true);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelectedOption(answers[currentQ - 1]);
      setShowExplanation(answers[currentQ - 1] !== null);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelectedOption(null);
    setAnswers(Array(10).fill(null));
    setShowExplanation(false);
    setQuizComplete(false);
  };

  const tier = getResultTier(score);

  const getOptionStyle = (idx: number) => {
    const base = "w-full text-left px-5 py-4 rounded-2xl border text-sm font-medium transition-all duration-200 flex items-start gap-3";
    if (!isAnswered) {
      return `${base} border-[#87A96B]/20 bg-[#0b2b20] text-[#D1CDBC] hover:border-[#87A96B]/60 hover:bg-[#0f3524] cursor-pointer`;
    }
    if (idx === question.correct) {
      return `${base} border-emerald-400/60 bg-emerald-400/10 text-emerald-300 cursor-default`;
    }
    if (idx === answers[currentQ] && idx !== question.correct) {
      return `${base} border-red-400/60 bg-red-400/10 text-red-300 cursor-default`;
    }
    return `${base} border-[#87A96B]/10 bg-[#071c15] text-[#D1CDBC]/50 cursor-default`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(7,28,21,0.85)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl bg-[#0b2b20] border border-[#87A96B]/25 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#87A96B]/15 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-[#14532D] glow-mint">
              <Leaf className="w-4 h-4 text-[#A7F3D0]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F5F3EA] font-serif">E-Waste Knowledge Quiz</h2>
              <p className="text-xs text-[#87A96B]">10 Questions · Test Your Awareness</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#071c15] border border-[#87A96B]/20 text-[#D1CDBC] hover:text-[#A7F3D0] hover:border-[#A7F3D0]/40 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quiz Content */}
        <div className="overflow-y-auto flex-1 px-7 py-6">
          {!quizComplete ? (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[#87A96B] font-medium">
                  <span>Question {currentQ + 1} of {questions.length}</span>
                  <span>{answers.filter(a => a !== null).length} answered</span>
                </div>
                <div className="h-1.5 bg-[#071c15] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#87A96B] to-[#A7F3D0] rounded-full transition-all duration-500"
                    style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                  />
                </div>
                {/* Dot progress */}
                <div className="flex gap-1.5 pt-1">
                  {questions.map((_, i) => {
                    const ans = answers[i];
                    const correct = ans === questions[i].correct;
                    return (
                      <div
                        key={i}
                        onClick={() => { setCurrentQ(i); setSelectedOption(answers[i]); setShowExplanation(answers[i] !== null); }}
                        className={`h-2 flex-1 rounded-full cursor-pointer transition-all ${
                          i === currentQ
                            ? 'bg-[#A7F3D0] ring-1 ring-[#A7F3D0]/50'
                            : ans !== null
                            ? correct ? 'bg-emerald-400' : 'bg-red-400'
                            : 'bg-[#14532D]/50 hover:bg-[#14532D]'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Question */}
              <div className="p-6 bg-[#071c15] rounded-2xl border border-[#87A96B]/15">
                <p className="text-base font-semibold text-[#F5F3EA] leading-relaxed">{question.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className={getOptionStyle(idx)}
                    onClick={() => handleSelectOption(idx)}
                  >
                    <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                      !isAnswered
                        ? 'border-[#87A96B]/40 text-[#87A96B]'
                        : idx === question.correct
                        ? 'border-emerald-400 text-emerald-400'
                        : idx === answers[currentQ]
                        ? 'border-red-400 text-red-400'
                        : 'border-[#87A96B]/20 text-[#87A96B]/40'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {isAnswered && idx === question.correct && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />}
                    {isAnswered && idx === answers[currentQ] && idx !== question.correct && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className={`flex gap-3 p-4 rounded-2xl border text-sm leading-relaxed ${
                  isCorrect
                    ? 'bg-emerald-400/5 border-emerald-400/25 text-emerald-200'
                    : 'bg-red-400/5 border-red-400/25 text-red-200'
                }`}>
                  {isCorrect
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    : <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                  <div>
                    <span className="font-semibold">{isCorrect ? 'Correct! ' : 'Incorrect. '}</span>
                    {question.explanation}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center space-y-6 py-4">
              <div className="text-6xl">{tier.emoji}</div>
              <div>
                <p className={`text-2xl font-bold font-serif ${tier.color}`}>{tier.label}</p>
                <p className="text-5xl font-black text-[#F5F3EA] mt-2">{score}<span className="text-xl text-[#87A96B] font-normal">/10</span></p>
              </div>
              <p className="text-sm text-[#D1CDBC] max-w-md mx-auto leading-relaxed">{tier.description}</p>

              {/* Per-question review */}
              <div className="text-left space-y-2 mt-4">
                <p className="text-xs font-semibold text-[#87A96B] uppercase tracking-widest mb-3">Your Answers</p>
                {questions.map((q, i) => {
                  const correct = answers[i] === q.correct;
                  return (
                    <div
                      key={i}
                      onClick={() => { setQuizComplete(false); setCurrentQ(i); setSelectedOption(answers[i]); setShowExplanation(true); }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all hover:opacity-80 ${
                        correct
                          ? 'bg-emerald-400/5 border-emerald-400/20'
                          : 'bg-red-400/5 border-red-400/20'
                      }`}
                    >
                      {correct
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                      <span className="text-xs text-[#D1CDBC] line-clamp-1 flex-1">{q.question}</span>
                      <span className={`text-xs font-semibold ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
                        {correct ? '+1' : '0'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-7 py-5 border-t border-[#87A96B]/15 flex-shrink-0 gap-3">
          {!quizComplete ? (
            <>
              <button
                onClick={handlePrev}
                disabled={currentQ === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#071c15] border border-[#87A96B]/25 text-sm text-[#D1CDBC] hover:border-[#87A96B]/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <div className="text-xs text-[#87A96B]">
                Score: <span className="font-bold text-[#A7F3D0]">{answers.filter((a, i) => a === questions[i].correct).length}</span>/{answers.filter(a => a !== null).length} answered
              </div>
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  isAnswered
                    ? 'bg-[#87A96B] text-[#071c15] hover:bg-[#A7F3D0] glow-mint'
                    : 'bg-[#0b2b20] text-[#64748b] cursor-not-allowed border border-[#87A96B]/10'
                }`}
              >
                {currentQ === questions.length - 1 ? 'See Results' : 'Next'} <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#071c15] border border-[#87A96B]/25 text-sm text-[#D1CDBC] hover:border-[#87A96B]/50 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Retake Quiz
              </button>
              <a
                href="#projects-grid"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#87A96B] text-[#071c15] text-sm font-semibold hover:bg-[#A7F3D0] glow-mint transition-all"
              >
                <Trophy className="w-4 h-4" /> View Portfolio
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
