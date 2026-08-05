import React, { useState } from 'react';
import { useCapacity } from '../context/CapacityContext';
import { Recommendation } from '../types';
import { 
  Lightbulb, 
  UserPlus, 
  Clock, 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles
} from 'lucide-react';

export const Recommendations: React.FC = () => {
  const { recommendations } = useCapacity();
  const [selectedRecId, setSelectedRecId] = useState<string>(recommendations[0]?.id || 'REC-FTE-01');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filteredRecs = recommendations.filter(r => {
    if (activeFilter === 'ALL') return true;
    return r.type === activeFilter;
  });

  const selectedRec = recommendations.find(r => r.id === selectedRecId) || recommendations[0];

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-cyan-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Capacity Optimization Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Hiring & Optimization Recommender</h1>
          <p className="text-xs text-slate-400 mt-1">
            Lead-time aware hiring alerts (FTE 60-day / FTC 10-day) and zero-cost cross-store shift reallocations with full explainability.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'ALL' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            All ({recommendations.length})
          </button>
          <button
            onClick={() => setActiveFilter('FTE_HIRING')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'FTE_HIRING' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            FTE Hiring
          </button>
          <button
            onClick={() => setActiveFilter('FTC_SURGE')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'FTC_SURGE' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            FTC Surge
          </button>
          <button
            onClick={() => setActiveFilter('COURIER_REALLOCATION')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'COURIER_REALLOCATION' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Reallocation
          </button>
        </div>
      </div>

      {/* Main Grid: Left Recommendation Cards, Right Explainability Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recommendation Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {filteredRecs.map((rec) => {
            const isSelected = rec.id === selectedRecId;

            let icon = <UserPlus className="w-5 h-5 text-blue-400" />;
            let badgeBg = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

            if (rec.type === 'FTC_SURGE') {
              icon = <Clock className="w-5 h-5 text-purple-400" />;
              badgeBg = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            } else if (rec.type === 'COURIER_REALLOCATION') {
              icon = <ArrowRightLeft className="w-5 h-5 text-cyan-400" />;
              badgeBg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            }

            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRecId(rec.id)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                  isSelected
                    ? 'bg-slate-900 border-blue-500/60 ring-2 ring-blue-500/20 shadow-2xl'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      {icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${badgeBg}`}>
                          {rec.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {rec.store_name} ({rec.emirate})
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">{rec.title}</h3>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    rec.priority === 'Critical' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {rec.priority} Priority
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {rec.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center space-x-4 text-slate-400">
                    <span>Target Horizon: <strong className="text-white">Week {rec.target_week}</strong></span>
                    <span>Lead Time: <strong className="text-cyan-400">{rec.lead_time_days} Days</strong></span>
                    <span>Couriers: <strong className="text-emerald-400">+{rec.couriers_needed}</strong></span>
                  </div>

                  <span className="text-xs font-semibold text-blue-400 flex items-center">
                    <span>Inspect AI Rationale</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Integrated Explainability Panel (5 cols) */}
        {selectedRec && (
          <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-6 sticky top-24 h-fit">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">AI Explainability Panel</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20 font-mono">
                {selectedRec.id}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium">Selected Recommendation:</span>
              <h4 className="text-lg font-extrabold text-white mt-0.5">{selectedRec.title}</h4>
              <p className="text-xs text-cyan-300 mt-1 font-medium">{selectedRec.store_name} • Week {selectedRec.target_week}</p>
            </div>

            {/* Explainability Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block">Target Utilisation %</span>
                <span className="text-lg font-bold text-white">{selectedRec.explanation.target_utilization}%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block">Forecast Error Rate</span>
                <span className="text-lg font-bold text-amber-400">{selectedRec.explanation.forecast_error_rate}%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block">Couriers on Leave</span>
                <span className="text-lg font-bold text-purple-400">{selectedRec.explanation.active_leave_count} Active</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block">Lead Time Window</span>
                <span className="text-lg font-bold text-emerald-400">{selectedRec.explanation.lead_time_days} Days</span>
              </div>

            </div>

            {/* Human-Readable Rationale */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Operational Rationale</h5>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-normal">
                {selectedRec.explanation.rationale}
              </div>
            </div>

            {/* Projected SLA & Financial Impact */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Projected SLA Impact</h5>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 font-medium leading-relaxed">
                {selectedRec.explanation.impact_statement}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
