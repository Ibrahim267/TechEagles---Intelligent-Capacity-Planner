import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

const STEPS = [
  "Ingesting 43,680 30-minute demand intervals across 10 EMX Dark Stores...",
  "Evaluating courier shift windows, DPH productivity, and weekly off-days...",
  "Benchmarking workforce target mix (60% FTE / 40% FTC)...",
  "Factoring recruitment lead times (FTE: 60 days | FTC: 10 days)...",
  "Generating actionable capacity optimization recommendations..."
];

export const AnalysisLoading: React.FC = () => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          // After finishing steps, navigate to Executive Dashboard
          setTimeout(() => {
            navigate('/dashboard');
          }, 800);
          return prev;
        }
      });
    }, 900); // 900ms per step

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center max-w-2xl mx-auto py-12 px-6">
      
      <div className="text-center space-y-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-2xl shadow-blue-500/30 mx-auto animate-pulse">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          EMX AI Capacity Intelligence Engine
        </h1>
        <p className="text-xs text-slate-400">
          Running 30-minute interval capacity solvers across 10 Dark Stores & 67 Courier Shift Rosters
        </p>
      </div>

      {/* Progress Card */}
      <div className="w-full bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-4">
        
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-400">Processing Operational Dataset</span>
            <span className="text-slate-400">{Math.round(((currentStepIndex + 1) / STEPS.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-500 rounded-full"
              style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Items */}
        <div className="space-y-3 pt-4">
          {STEPS.map((stepText, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 p-3 rounded-xl transition-all ${
                  isCurrent 
                    ? 'bg-blue-600/15 border border-blue-500/30 text-white font-medium shadow-md' 
                    : isCompleted 
                    ? 'text-slate-300' 
                    : 'text-slate-600 opacity-60'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-600">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <span className="text-xs leading-relaxed">{stepText}</span>
              </div>
            );
          })}
        </div>

        {currentStepIndex === STEPS.length - 1 && (
          <div className="pt-2 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center space-x-1">
            <span>Optimization complete! Redirecting to Executive Dashboard...</span>
            <ArrowRight className="w-3.5 h-3.5 animate-bounce" />
          </div>
        )}

      </div>

    </div>
  );
};
