import { Dataset, SimulationParameters, Courier, DemandForecastSlot } from '../types';

export function runSimulation(baseDataset: Dataset, params: SimulationParameters): Dataset {
  const { demand_volatility, leave_rate_increase, dph_delta, target_fte_split } = params;

  // 1. Recalculate Demand Forecast Slots
  const simulatedDemand: DemandForecastSlot[] = baseDataset.demand.map(slot => {
    const volatilityMultiplier = 1.0 + demand_volatility;
    const newForecastVolume = Math.max(1, Math.round(slot.forecast_volume * volatilityMultiplier));
    const newActualVolume = Math.max(1, Math.round(slot.actual_volume * volatilityMultiplier));
    const newForecastError = Number((newActualVolume - newForecastVolume).toFixed(1));

    return {
      ...slot,
      forecast_volume: newForecastVolume,
      actual_volume: newActualVolume,
      forecast_error: newForecastError
    };
  });

  // 2. Recalculate Courier Roster
  const totalCouriers = baseDataset.couriers.length;
  const targetFteCount = Math.round(totalCouriers * target_fte_split);

  const simulatedCouriers: Courier[] = baseDataset.couriers.map((courier, index) => {
    // Adjust FTE / FTC mix split based on index
    const employment_type: 'FTE' | 'FTC' = index < targetFteCount ? 'FTE' : 'FTC';

    // Adjust leave rate
    let status = courier.status;
    if (leave_rate_increase > 0) {
      // Deterministically pick couriers to mark on leave based on leave rate increase
      const leaveThreshold = 0.05 + leave_rate_increase;
      const isLeaveCandidate = (index * 7 + 3) % 100 / 100 < leaveThreshold;
      status = isLeaveCandidate ? 'On Leave' : 'Active';
    }

    // Adjust Courier DPH
    const newAvgDph = Math.max(1.5, Number((courier.avg_delivery_hr + dph_delta).toFixed(1)));

    return {
      ...courier,
      employment_type,
      status,
      avg_delivery_hr: newAvgDph
    };
  });

  return {
    ...baseDataset,
    demand: simulatedDemand,
    couriers: simulatedCouriers,
    metadata: {
      ...baseDataset.metadata,
      ingested_at: new Date().toISOString()
    }
  };
}
