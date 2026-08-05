import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Sliders, 
  Users, 
  Store,
  Layers,
  ChevronRight
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden">
      
      {/* Background Glow Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Landing Navbar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-xl shadow-blue-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl text-white tracking-tight">EMX</span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20">
              7X Quick Commerce
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="flex items-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all"
        >
          <span>Ingest Dataset</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-12 pb-20 text-center">
        
        {/* Hackathon Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-xs font-medium text-cyan-400 shadow-md mb-8">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Hackathon Operational Intelligence Engine</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          EMX Intelligent <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Capacity Planner
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          AI-Powered Workforce Planning & 13-Week Capacity Intelligence for 7X / EMX Dark Store Operations.
          Converting 43,680 30-minute demand slots into lead-time aware courier hiring and shift schedules.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/upload')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-base shadow-2xl shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-3"
          >
            <span>Launch Capacity Planner</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base transition-all flex items-center justify-center space-x-2"
          >
            <span>View Executive Dashboard</span>
          </button>
        </div>

        {/* Core Target Hackathon Metrics Bar */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">KPI 1</span>
            </div>
            <div className="text-2xl font-extrabold text-white">95% Match</div>
            <div className="text-xs font-medium text-slate-400 mt-1">Demand Match Accuracy target across 30-minute granularity slots.</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-blue-400 mb-2">
              <Clock className="w-6 h-6" />
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">KPI 2</span>
            </div>
            <div className="text-2xl font-extrabold text-white">20% Reduction</div>
            <div className="text-xs font-medium text-slate-400 mt-1">Reduction in over/under-staffed store-hours through gap detection.</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-cyan-400 mb-2">
              <DollarSign className="w-6 h-6" />
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">KPI 3</span>
            </div>
            <div className="text-2xl font-extrabold text-white">AED 0.50 Savings</div>
            <div className="text-xs font-medium text-slate-400 mt-1">Cost reduction per shipment by optimizing 60% FTE / 40% FTC mix split.</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-purple-400 mb-2">
              <ShieldCheck className="w-6 h-6" />
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">KPI 4</span>
            </div>
            <div className="text-2xl font-extrabold text-white">Lead-Time Aware</div>
            <div className="text-xs font-medium text-slate-400 mt-1">Factors FTE (60-day) and FTC (10-day) lead times to prevent bottleneck.</div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 text-left">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Enterprise Capability Overview</h2>
            <p className="text-sm text-slate-400 mt-2">Designed specifically for EMX Dark Store logistics and courier roster optimization</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">10 Dark Store Network</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full coverage across Dubai, Abu Dhabi, Sharjah, Ajman, and RAK dark stores with localized DPH efficiencies and target utilization percentages.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Scenario Simulator Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulate demand volatility (-30% to +30%), courier leave spikes, DPH productivity changes, and FTE/FTC ratio tweaks with live recalculations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Explainable AI Recommendations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every hiring or shift reallocation recommendation includes human-readable explainability referencing utilization, forecast error, and leave impact.
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500">
        <p>EMX Intelligent Capacity Planner • 7X Quick Commerce Dark Store Operations</p>
      </footer>

    </div>
  );
};
