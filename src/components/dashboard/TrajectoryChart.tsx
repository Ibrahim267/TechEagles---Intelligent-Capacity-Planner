import React, { useMemo } from 'react';
import { useCapacity } from '../../context/CapacityContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export const TrajectoryChart: React.FC = () => {
  const { simulatedDataset } = useCapacity();
  const { demand, couriers } = simulatedDataset;

  const trajectoryData = useMemo(() => {
    const weeksData: { week: string; demand: number; fteCapacity: number; ftcCapacity: number; totalCapacity: number }[] = [];

    for (let w = 1; w <= 13; w++) {
      const weekSlots = demand.filter(d => d.week_number === w);
      const totalDemand = weekSlots.reduce((acc, d) => acc + d.forecast_volume, 0);

      // Estimate weekly capacity based on active FTE and FTC couriers
      const fteCount = couriers.filter(c => c.employment_type === 'FTE' && c.status === 'Active').length;
      const ftcCount = couriers.filter(c => c.employment_type === 'FTC' && c.status === 'Active').length;

      // 6 working days * working_hours per week
      const weeklyFteParcels = fteCount * 8 * 6 * 4.0;
      const weeklyFtcParcels = ftcCount * 8 * 6 * 4.0;

      weeksData.push({
        week: `W${w}`,
        demand: Math.round(totalDemand / 10), // Average per store
        fteCapacity: Math.round(weeklyFteParcels / 10),
        ftcCapacity: Math.round(weeklyFtcParcels / 10),
        totalCapacity: Math.round((weeklyFteParcels + weeklyFtcParcels) / 10)
      });
    }

    return weeksData;
  }, [demand, couriers]);

  return (
    <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center">
            <TrendingUp className="w-5 h-5 text-indigo-400 mr-2" />
            13-Week Demand Trajectory & Staffing Buffer
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Weekly average order volume per dark store vs FTE / FTC capacity envelope
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5" />
            Order Demand
          </span>
          <span className="flex items-center text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1.5" />
            FTE Capacity Buffer
          </span>
          <span className="flex items-center text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 mr-1.5" />
            FTC Flex Buffer
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trajectoryData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

            <Area type="monotone" dataKey="fteCapacity" name="FTE Permanent Base" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            <Area type="monotone" dataKey="ftcCapacity" name="FTC Contract Flex" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
            <Area type="monotone" dataKey="demand" name="Projected Demand" stroke="#3b82f6" strokeWidth={3} fill="none" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
