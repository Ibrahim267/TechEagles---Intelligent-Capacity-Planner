import React from 'react';
import { useCapacity } from '../context/CapacityContext';
import { 
  Sliders, 
  RotateCcw, 
  Play, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  ShieldAlert,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Simulator: React.FC = () => {
  const { 
    simulationParams, 
    updateSimulationParams, 
    resetSimulation, 
    kpiOverview 
  } = useCapacity();

  const navigate = useNavigate();

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400 mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Capacity Simulation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Scenario Simulator Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Stress-test dark store capacity against demand shocks, leave spikes, courier efficiency shifts, and workforce target split modifications.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={resetSimulation}
            className="flex items-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 shadow-md transition-all"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls Sliders on Left (7 cols), Real-Time KPI Impact on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center">
              <Sliders className="w-5 h-5 text-purple-400 mr-2" />
              Operational Stress Parameters
            </h3>
            <span className="text-xs text-slate-400 font-mono">Live Recalculation Enabled</span>
          </div>

          <div className="space-y-6">
            
            {/* 1. Demand Volatility Multiplier (-30% to +30%) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-200">Demand Volatility Multiplier</span>
                <span className="text-cyan-400 font-mono text-sm">
                  {simulationParams.demand_volatility >= 0 ? `+${(simulationParams.demand_volatility * 100).toFixed(0)}%` : `${(simulationParams.demand_volatility * 100).toFixed(0)}%`}
                </span>
              </div>
              <input
                type="range"
                min="-0.30"
                max="0.30"
                step="0.05"
                value={simulationParams.demand_volatility}
                onChange={(e) => updateSimulationParams({ demand_volatility: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-30% (Volume Drop)</span>
                <span>0% (Baseline)</span>
                <span>+30% (Surge Peak)</span>
              </div>
            </div>

            {/* 2. Courier Leave Rate Increase (+0% to +30%) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-200">Courier Leave Rate Increase</span>
                <span className="text-amber-400 font-mono text-sm">
                  +{(simulationParams.leave_rate_increase * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.30"
                step="0.05"
                value={simulationParams.leave_rate_increase}
                onChange={(e) => updateSimulationParams({ leave_rate_increase: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0% (Standard Leave)</span>
                <span>+15% (Seasonal Sick Leave)</span>
                <span>+30% (High Absenteeism)</span>
              </div>
            </div>

            {/* 3. Courier DPH Delta (-1.0 to +1.0) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-200">Courier DPH Productivity Delta</span>
                <span className="text-emerald-400 font-mono text-sm">
                  {simulationParams.dph_delta >= 0 ? `+${simulationParams.dph_delta.toFixed(1)}` : simulationParams.dph_delta.toFixed(1)} DPH
                </span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="1.0"
                step="0.1"
                value={simulationParams.dph_delta}
                onChange={(e) => updateSimulationParams({ dph_delta: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-1.0 DPH (Traffic Delays)</span>
                <span>0.0 DPH (Standard)</span>
                <span>+1.0 DPH (Batch Delivery Optimization)</span>
              </div>
            </div>

            {/* 4. Target FTE / FTC Split Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-200">Target Workforce Mix (FTE Permanent Split)</span>
                <span className="text-purple-400 font-mono text-sm">
                  {(simulationParams.target_fte_split * 100).toFixed(0)}% FTE / {((1 - simulationParams.target_fte_split) * 100).toFixed(0)}% FTC
                </span>
              </div>
              <input
                type="range"
                min="0.40"
                max="0.80"
                step="0.05"
                value={simulationParams.target_fte_split}
                onChange={(e) => updateSimulationParams({ target_fte_split: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>40% FTE / 60% FTC</span>
                <span>60% FTE / 40% FTC (Target)</span>
                <span>80% FTE / 20% FTC</span>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-purple-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Apply & View Dashboard Impact</span>
            </button>
          </div>

        </div>

        {/* Right Column: Live Recalculated KPI Impact */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center">
              <Sparkles className="w-5 h-5 text-cyan-400 mr-2" />
              Live Simulated KPI Delta
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              Active Simulation
            </span>
          </div>

          <div className="space-y-4">
            
            {/* KPI 1: Demand Match Accuracy */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Demand Match Accuracy</span>
                <span className="text-xs text-slate-500">Target: 95.0%</span>
              </div>
              <div className="text-right">
                <span className={`text-xl font-extrabold ${kpiOverview.demand_match_accuracy >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {kpiOverview.demand_match_accuracy}%
                </span>
              </div>
            </div>

            {/* KPI 2: Store-Hours Gap Reduction */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Over/Under-Staffed Reduction</span>
                <span className="text-xs text-slate-500">Target: 20.0%</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-purple-400">
                  -{kpiOverview.gap_hours_reduction}%
                </span>
              </div>
            </div>

            {/* KPI 3: Labor Cost / Shipment */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Est. Labor Cost / Shipment</span>
                <span className="text-xs text-emerald-400">Savings: -AED {kpiOverview.cost_savings_per_shipment}</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-cyan-400">
                  AED {kpiOverview.labor_cost_per_shipment}
                </span>
              </div>
            </div>

            {/* KPI 4: Critical Store Shortage Alerts */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Store Shortage Alerts</span>
                <span className="text-xs text-slate-500">Stores with Net Gap &gt; 2</span>
              </div>
              <div className="text-right">
                <span className={`text-xl font-extrabold ${kpiOverview.total_critical_alerts > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {kpiOverview.total_critical_alerts} Store(s)
                </span>
              </div>
            </div>

          </div>

          <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/25 text-xs text-blue-300 space-y-1">
            <span className="font-bold block text-slate-200">Simulation Insight:</span>
            <p>
              Moving sliders instantly updates slot capacity solvers and hiring triggers across all 8 application pages.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
