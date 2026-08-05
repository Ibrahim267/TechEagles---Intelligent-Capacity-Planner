import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCapacity } from '../../context/CapacityContext';
import { 
  Home, 
  Upload, 
  LayoutDashboard, 
  Table, 
  Lightbulb, 
  Sliders, 
  Bot, 
  Store, 
  Users, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { kpiOverview, recommendations, storeSummaries } = useCapacity();

  const navItems = [
    { label: 'Landing Page', path: '/', icon: Home },
    { label: 'Dataset Upload', path: '/upload', icon: Upload },
    { label: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Dark Store Capacity Grid', path: '/capacity', icon: Table },
    { 
      label: 'AI Recommendations', 
      path: '/recommendations', 
      icon: Lightbulb,
      badge: recommendations.length > 0 ? recommendations.length : undefined
    },
    { label: 'Scenario Simulator', path: '/simulator', icon: Sliders },
    { label: 'AI Logistics Assistant', path: '/assistant', icon: Bot },
  ];

  const criticalStores = storeSummaries.filter(s => s.status === 'Shortage');

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-61px)]">
      <div className="p-4 space-y-6">
        
        {/* Navigation Menu */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-3">
            Core Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-cyan-400 border border-blue-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Store Network Quick Status */}
        <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center">
              <Store className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              Dark Stores (10)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              10 Active
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Total Fleet:</span>
              <strong className="text-slate-200 font-semibold">{kpiOverview.total_couriers} Couriers</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Workforce Target Mix:</span>
              <span className="text-blue-400 font-semibold">{kpiOverview.fte_mix_pct}% FTE / {(100 - kpiOverview.fte_mix_pct).toFixed(1)}% FTC</span>
            </div>
          </div>

          {criticalStores.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[11px] text-amber-400 font-semibold flex items-center mb-1">
                <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Shortage Risk Alert
              </div>
              <p className="text-[10px] text-slate-400">
                {criticalStores.length} store(s) require lead-time hiring action.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-[10px] text-slate-500 flex items-center justify-between">
        <span>7X EMX QComm Engine</span>
        <span className="text-cyan-400 font-medium">v1.0.0</span>
      </div>
    </aside>
  );
};
