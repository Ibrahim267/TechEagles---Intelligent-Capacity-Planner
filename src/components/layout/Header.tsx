import React from 'react';
import { useCapacity } from '../../context/CapacityContext';
import { 
  Building2, 
  Sparkles, 
  UploadCloud, 
  Sliders, 
  MessageSquare, 
  ShieldCheck, 
  TrendingUp, 
  Clock
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  onToggleAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleAssistant }) => {
  const { kpiOverview, dataset } = useCapacity();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3">
      <div className="flex items-center justify-between">
        
        {/* Left: Brand & Status */}
        <div className="flex items-center space-x-4">
          <div 
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white tracking-wide">EMX</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20 font-medium">
                  QComm Dark Stores
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Intelligent Capacity Planner</p>
            </div>
          </div>

          <div className="hidden xl:flex items-center space-x-2 pl-6 border-l border-slate-800 text-xs">
            <span className="flex items-center text-slate-400">
              <Clock className="w-3.5 h-3.5 mr-1 text-blue-400" />
              Horizon: <strong className="text-slate-200 ml-1">13 Weeks (43,680 slots)</strong>
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Dataset: <strong className="text-slate-200 ml-1">{dataset.metadata.filename || 'EMX Hackathon Dataset'}</strong>
            </span>
          </div>
        </div>

        {/* Center: Live Hackathon Target Quick Metrics */}
        <div className="hidden lg:flex items-center space-x-4 bg-slate-950/80 px-4 py-1.5 rounded-xl border border-slate-800/80">
          <div className="text-center px-2">
            <div className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Demand Match</div>
            <div className={`text-sm font-bold ${kpiOverview.demand_match_accuracy >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {kpiOverview.demand_match_accuracy}% <span className="text-[10px] text-slate-400 font-normal">(Target: 95%)</span>
            </div>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Over/Under Hours</div>
            <div className="text-sm font-bold text-emerald-400">
              -{kpiOverview.gap_hours_reduction}% <span className="text-[10px] text-slate-400 font-normal">(Target: -20%)</span>
            </div>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Cost / Shipment</div>
            <div className="text-sm font-bold text-cyan-400">
              AED {kpiOverview.labor_cost_per_shipment} <span className="text-[10px] text-emerald-400 font-normal">(-AED {kpiOverview.cost_savings_per_shipment})</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/upload')}
            className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-all ${
              location.pathname === '/upload'
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-blue-400" />
            <span>Dataset Ingestion</span>
          </button>

          <button
            onClick={() => navigate('/simulator')}
            className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-all ${
              location.pathname === '/simulator'
                ? 'bg-purple-600/20 text-purple-400 border-purple-500/30'
                : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>Simulator</span>
          </button>

          <button
            onClick={onToggleAssistant}
            className="flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Assistant</span>
          </button>
        </div>

      </div>
    </header>
  );
};
