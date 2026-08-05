import React, { useState, useMemo } from 'react';
import { useCapacity } from '../../context/CapacityContext';
import { calculateSlotMetrics } from '../../services/capacityEngine';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { Layers, Calendar, Filter } from 'lucide-react';

export const DemandVsCapacityChart: React.FC = () => {
  const { simulatedDataset, selectedStoreId, setSelectedStoreId } = useCapacity();
  const { stores, couriers, demand } = simulatedDataset;

  const [selectedWeekNum, setSelectedWeekNum] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<string>('Friday');

  const activeStoreId = selectedStoreId === 'All' ? stores[0]?.store_id || 'QED_DXB_01' : selectedStoreId;
  const currentStore = stores.find(s => s.store_id === activeStoreId) || stores[0];

  // Aggregate 30-minute interval data for selected store, week, and day
  const chartData = useMemo(() => {
    const daySlots = demand.filter(
      d => d.store_id === activeStoreId && d.week_number === selectedWeekNum && d.day_name === selectedDay
    );

    return daySlots.map(slot => {
      const metrics = calculateSlotMetrics(
        activeStoreId,
        slot.time_slot,
        selectedDay,
        slot.forecast_volume,
        couriers,
        currentStore?.base_dph || 4.0
      );

      return {
        time_slot: slot.time_slot,
        forecast_volume: slot.forecast_volume,
        capacity_volume: Math.round(metrics.slotCapacityVolume),
        scheduled_couriers: metrics.scheduledActiveCount,
        required_couriers: metrics.requiredCouriers,
        net_gap: metrics.netGapCouriers
      };
    });
  }, [demand, couriers, activeStoreId, selectedWeekNum, selectedDay, currentStore]);

  return (
    <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
      
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center">
            <Layers className="w-5 h-5 text-cyan-400 mr-2" />
            24-Hour Peak Demand vs Courier Supply (30-Min Resolution)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare slot order volume against scheduled courier delivery capacity
          </p>
        </div>

        {/* Dropdowns for Store, Week, Day */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Store Selector */}
          <select
            value={activeStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            {stores.map(s => (
              <option key={s.store_id} value={s.store_id}>
                {s.store_name} ({s.emirate})
              </option>
            ))}
          </select>

          {/* Week Selector */}
          <select
            value={selectedWeekNum}
            onChange={(e) => setSelectedWeekNum(Number(e.target.value))}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            {Array.from({ length: 13 }, (_, i) => i + 1).map(w => (
              <option key={w} value={w}>
                Week {w}
              </option>
            ))}
          </select>

          {/* Day Selector */}
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis 
              dataKey="time_slot" 
              stroke="#94a3b8" 
              fontSize={10} 
              interval={3} 
            />
            <YAxis 
              yAxisId="volume" 
              stroke="#94a3b8" 
              fontSize={10} 
              label={{ value: 'Parcels / Slot', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
            />
            <YAxis 
              yAxisId="couriers" 
              orientation="right" 
              stroke="#60a5fa" 
              fontSize={10} 
              label={{ value: 'Couriers', angle: 90, position: 'insideRight', fill: '#60a5fa', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            
            <Bar yAxisId="volume" dataKey="forecast_volume" name="Forecast Order Volume" fill="#3b82f6" opacity={0.8} radius={[4, 4, 0, 0]} />
            <Area yAxisId="volume" type="monotone" dataKey="capacity_volume" name="Courier Capacity Supply" fill="#06b6d4" stroke="#0891b2" fillOpacity={0.25} />
            <Line yAxisId="couriers" type="monotone" dataKey="required_couriers" name="Required Couriers" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line yAxisId="couriers" type="stepAfter" dataKey="scheduled_couriers" name="Scheduled Active Couriers" stroke="#10b981" strokeWidth={2.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
