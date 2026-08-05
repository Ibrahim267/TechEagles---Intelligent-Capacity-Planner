import React from 'react';
import { useCapacity } from '../context/CapacityContext';
import { KPICards } from '../components/dashboard/KPICards';
import { DemandVsCapacityChart } from '../components/dashboard/DemandVsCapacityChart';
import { TrajectoryChart } from '../components/dashboard/TrajectoryChart';
import { 
  Sparkles, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { kpiOverview, recommendations, storeSummaries } = useCapacity();
  const navigate = useNavigate();

  const criticalRecs = recommendations.filter(r => r.priority === 'Critical');

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-cyan-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Capacity Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Executive Capacity Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time workforce planning metrics, 30-minute interval capacity supply, and hackathon target benchmarks across 10 EMX Dark Stores.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => navigate('/recommendations')}
            className="flex items-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-all"
          >
            <Lightbulb className="w-4 h-4 text-cyan-300" />
            <span>View {recommendations.length} AI Recommendations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Metric Cards */}
      <KPICards kpis={kpiOverview} />

      {/* Critical Alert Banner if any */}
      {criticalRecs.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between space-x-4 text-xs">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block text-sm">
                Critical Lead-Time Action Required: {criticalRecs[0].title}
              </span>
              <p className="text-slate-300 mt-0.5">
                {criticalRecs[0].description} ({criticalRecs[0].lead_time_days}-day recruitment lead time requirement).
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/recommendations')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs border border-amber-500/40 shrink-0 transition-colors"
          >
            View Details
          </button>
        </div>
      )}

      {/* Interactive Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DemandVsCapacityChart />
        <TrajectoryChart />
      </div>

      {/* Quick Summary Grid of Top 3 At-Risk Stores */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center">
            <Building2 className="w-4 h-4 text-blue-400 mr-2" />
            Dark Store Capacity Health Snapshot
          </h3>
          <button
            onClick={() => navigate('/capacity')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center"
          >
            <span>View Full Capacity Table</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {storeSummaries.slice(0, 3).map((store) => (
            <div 
              key={store.store_id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{store.store_name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  store.status === 'Healthy' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : store.status === 'Risk'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {store.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span>Emirate:</span>
                  <strong className="text-slate-200">{store.emirate}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Peak Net Gap:</span>
                  <strong className={store.net_gap_peak > 0 ? 'text-red-400' : 'text-emerald-400'}>
                    {store.net_gap_peak > 0 ? `+${store.net_gap_peak} Short` : 'Balanced'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>FTE / FTC Mix:</span>
                  <span className="text-cyan-400 font-medium">{store.fte_ratio_pct}% FTE</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
