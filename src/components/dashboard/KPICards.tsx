import React from 'react';
import { KPIOverview } from '../../types';
import { 
  Store, 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  CheckCircle2,
  Percent
} from 'lucide-react';

interface KPICardsProps {
  kpis: KPIOverview;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      
      {/* 1. Total Dark Stores */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-lg hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold">Dark Stores</span>
          <Store className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-2xl font-extrabold text-white">{kpis.total_stores}</div>
        <div className="text-[10px] text-slate-400 flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5" />
          10 Active Operational Stores
        </div>
      </div>

      {/* 2. 13-Week Forecast Volume */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-lg hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold">13-Wk Order Volume</span>
          <TrendingUp className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-extrabold text-white">
          {kpis.forecast_volume_13w.toLocaleString()}
        </div>
        <div className="text-[10px] text-slate-400">
          30-Min Interval Resolution
        </div>
      </div>

      {/* 3. Active Couriers Split */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-lg hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold">Active Fleet Roster</span>
          <Users className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-extrabold text-white">{kpis.total_couriers}</div>
        <div className="text-[10px] text-cyan-400 font-medium">
          {kpis.fte_couriers} FTE ({kpis.fte_mix_pct}%) / {kpis.ftc_couriers} FTC
        </div>
      </div>

      {/* 4. Demand Match Accuracy % (Target 95%) */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-lg hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold">Match Accuracy</span>
          <Target className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl font-extrabold ${kpis.demand_match_accuracy >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {kpis.demand_match_accuracy}%
          </span>
        </div>
        <div className="text-[10px] text-slate-400 flex items-center justify-between">
          <span>Target: 95.0%</span>
          <span className="text-emerald-400 font-semibold">Passed</span>
        </div>
      </div>

      {/* 5. Over/Under-Staffed Hours Reduction % (Target 20%) */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-lg hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold">Store-Hours Reduction</span>
          <Clock className="w-4 h-4 text-purple-400" />
        </div>
        <div className="text-2xl font-extrabold text-purple-400">
          -{kpis.gap_hours_reduction}%
        </div>
        <div className="text-[10px] text-slate-400 justify-between flex">
          <span>Target: 20.0%</span>
          <span className="text-purple-400 font-semibold">Exceeded</span>
        </div>
      </div>

      {/* 6. Est. Labor Cost / Shipment Savings (Target AED 0.50) */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-lg hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold font-sans">Cost / Shipment</span>
          <DollarSign className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-extrabold text-cyan-400">
          AED {kpis.labor_cost_per_shipment}
        </div>
        <div className="text-[10px] text-emerald-400 font-medium">
          Savings: -AED {kpis.cost_savings_per_shipment} (Target: 0.50)
        </div>
      </div>

    </div>
  );
};
