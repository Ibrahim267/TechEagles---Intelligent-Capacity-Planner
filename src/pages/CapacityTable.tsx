import React, { useState, useMemo } from 'react';
import { useCapacity } from '../context/CapacityContext';
import { StoreCapacitySummary } from '../types';
import { 
  Table as TableIcon, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  Building2,
  ArrowUpDown,
  Download
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const CapacityTable: React.FC = () => {
  const { 
    storeSummaries, 
    selectedEmirate, 
    setSelectedEmirate, 
    selectedWeek, 
    setSelectedWeek 
  } = useCapacity();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof StoreCapacitySummary>('net_gap_peak');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredStores = useMemo(() => {
    return storeSummaries.filter(store => {
      const matchEmirate = selectedEmirate === 'All' || store.emirate === selectedEmirate;
      const matchStatus = statusFilter === 'All' || store.status === statusFilter;
      const matchSearch = store.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          store.store_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          store.zone.toLowerCase().includes(searchTerm.toLowerCase());
      return matchEmirate && matchStatus && matchSearch;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc 
        ? String(valA).localeCompare(String(valB)) 
        : String(valB).localeCompare(String(valA));
    });
  }, [storeSummaries, selectedEmirate, statusFilter, searchTerm, sortField, sortAsc]);

  const toggleSort = (field: keyof StoreCapacitySummary) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const exportTableToExcel = () => {
    const dataToExport = filteredStores.map(s => ({
      'Store ID': s.store_id,
      'Store Name': s.store_name,
      'Emirate': s.emirate,
      'Zone': s.zone,
      'Base DPH': s.base_dph,
      'Active FTE': s.active_fte,
      'Active FTC': s.active_ftc,
      'FTE Ratio %': `${s.fte_ratio_pct}%`,
      'Peak Demand (Parcels)': s.peak_slot_demand,
      'Required Couriers Peak': s.required_couriers_peak,
      'Scheduled Couriers Peak': s.active_scheduled_peak,
      'Net Gap Peak': s.net_gap_peak,
      'Demand Match Accuracy': `${s.demand_match_accuracy}%`,
      'Status': s.status,
      'Action Required': s.action_required
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Store_Capacity');
    XLSX.writeFile(wb, 'EMX_DarkStore_Capacity_Grid.xlsx');
  };

  return (
    <div className="space-y-6 py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center">
            <TableIcon className="w-6 h-6 text-cyan-400 mr-2.5" />
            Dark Store Capacity & Staffing Grid
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time 30-minute slot granularity capacity gaps, active FTE/FTC mix, and operational status across 10 Dark Stores.
          </p>
        </div>

        <button
          onClick={exportTableToExcel}
          className="flex items-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 shadow-md transition-all shrink-0"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Excel Report</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search store name or ID..."
              className="bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-52"
            />
          </div>

          {/* Emirate Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-slate-400">Emirate:</span>
            <select
              value={selectedEmirate}
              onChange={(e) => setSelectedEmirate(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Emirates (10 Stores)</option>
              <option value="Dubai">Dubai (4 Stores)</option>
              <option value="Abu Dhabi">Abu Dhabi (2 Stores)</option>
              <option value="Sharjah">Sharjah (2 Stores)</option>
              <option value="Ajman">Ajman (1 Store)</option>
              <option value="RAK">RAK (1 Store)</option>
            </select>
          </div>

          {/* Week Horizon Selector */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-slate-400">Horizon:</span>
            <select
              value={selectedWeek || 'All'}
              onChange={(e) => setSelectedWeek(e.target.value === 'All' ? null : Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">Full 13-Week Horizon</option>
              {Array.from({ length: 13 }, (_, i) => i + 1).map(w => (
                <option key={w} value={w}>Week {w}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Healthy">Healthy (Green)</option>
              <option value="Risk">Risk (Yellow)</option>
              <option value="Shortage">Shortage (Red)</option>
            </select>
          </div>

        </div>

        <div className="text-xs text-slate-400 font-medium">
          Showing <strong className="text-white">{filteredStores.length}</strong> of {storeSummaries.length} Dark Stores
        </div>

      </div>

      {/* Main Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4 cursor-pointer hover:text-white" onClick={() => toggleSort('store_name')}>
                  <div className="flex items-center space-x-1">
                    <span>Dark Store</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-white" onClick={() => toggleSort('emirate')}>
                  <div className="flex items-center space-x-1">
                    <span>Emirate</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-center cursor-pointer hover:text-white" onClick={() => toggleSort('base_dph')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Base DPH</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-center">Active FTE / FTC</th>
                <th className="p-4 text-center cursor-pointer hover:text-white" onClick={() => toggleSort('peak_slot_demand')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Peak Slot Demand</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-center">Req vs Sched Peak</th>
                <th className="p-4 text-center cursor-pointer hover:text-white" onClick={() => toggleSort('net_gap_peak')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Net Gap</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-center cursor-pointer hover:text-white" onClick={() => toggleSort('status')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs text-slate-300 font-medium">
              {filteredStores.map((store) => (
                <tr key={store.store_id} className="hover:bg-slate-800/50 transition-colors">
                  
                  {/* Store Name & ID */}
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{store.store_name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{store.store_id} • {store.zone}</div>
                  </td>

                  {/* Emirate */}
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-[11px]">
                      {store.emirate}
                    </span>
                  </td>

                  {/* Base DPH */}
                  <td className="p-4 text-center font-bold text-cyan-400">
                    {store.base_dph} <span className="text-[10px] text-slate-500 font-normal">DPH</span>
                  </td>

                  {/* Active FTE / FTC */}
                  <td className="p-4 text-center">
                    <div className="font-semibold text-slate-200">
                      <span className="text-blue-400">{store.active_fte} FTE</span> / <span className="text-purple-400">{store.active_ftc} FTC</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Mix: {store.fte_ratio_pct}% FTE (Target: 60%)
                    </div>
                  </td>

                  {/* Peak Slot Demand */}
                  <td className="p-4 text-center">
                    <div className="font-bold text-white text-sm">{store.peak_slot_demand} <span className="text-[10px] text-slate-400 font-normal">orders</span></div>
                    <div className="text-[10px] text-slate-500">{store.peak_slot_time}</div>
                  </td>

                  {/* Req vs Sched Peak */}
                  <td className="p-4 text-center">
                    <div className="font-semibold">
                      <span className="text-amber-400">{store.required_couriers_peak} Req</span> / <span className="text-emerald-400">{store.active_scheduled_peak} Sched</span>
                    </div>
                  </td>

                  {/* Net Gap */}
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-xl font-extrabold text-xs inline-block ${
                      store.net_gap_peak > 0
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : store.net_gap_peak < 0
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {store.net_gap_peak > 0 ? `+${store.net_gap_peak} Shortage` : store.net_gap_peak < 0 ? `${store.net_gap_peak} Surplus` : 'Optimal'}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center space-x-1 ${
                      store.status === 'Healthy'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : store.status === 'Risk'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}>
                      {store.status === 'Healthy' && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                      {store.status === 'Risk' && <AlertTriangle className="w-3.5 h-3.5 mr-1" />}
                      {store.status === 'Shortage' && <AlertCircle className="w-3.5 h-3.5 mr-1" />}
                      <span>{store.status}</span>
                    </span>
                  </td>

                  {/* Action Required */}
                  <td className="p-4 text-xs font-semibold text-slate-300">
                    {store.action_required}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
