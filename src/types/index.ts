export type Emirate = 'Dubai' | 'Abu Dhabi' | 'Sharjah' | 'Ajman' | 'RAK';

export interface StoreMetadata {
  store_id: string;
  store_name: string;
  emirate: Emirate;
  zone: string;
  lat: number;
  lng: number;
  target_utilisation_pct: number;
  base_dph: number;
}

export interface DemandForecastSlot {
  store_id: string;
  store_name: string;
  date: string;
  week_number: number;
  day_name: string;
  is_weekend: 'Yes' | 'No';
  time_slot: string;
  forecast_volume: number;
  actual_volume: number;
  forecast_error: number;
}

export interface Courier {
  courier_id: string;
  store_id: string;
  employment_type: 'FTE' | 'FTC';
  shift_start: string;
  shift_end: string;
  working_hours: number;
  weekly_off_day: string;
  avg_delivery_hr: number;
  status: 'Active' | 'On Leave';
}

export type StoreCapacityStatus = 'Healthy' | 'Risk' | 'Shortage';

export interface StoreCapacitySummary {
  store_id: string;
  store_name: string;
  emirate: Emirate;
  zone: string;
  base_dph: number;
  total_fte: number;
  total_ftc: number;
  active_fte: number;
  active_ftc: number;
  fte_ratio_pct: number;
  target_utilization_pct: number;
  peak_slot_demand: number;
  peak_slot_time: string;
  required_couriers_peak: number;
  active_scheduled_peak: number;
  net_gap_peak: number;
  overstaffed_hours: number;
  understaffed_hours: number;
  demand_match_accuracy: number;
  status: StoreCapacityStatus;
  action_required: string;
  cost_per_shipment: number;
  cost_savings_delta: number;
}

export type RecommendationType = 'FTE_HIRING' | 'FTC_SURGE' | 'COURIER_REALLOCATION';
export type RecommendationPriority = 'Critical' | 'High' | 'Medium';

export interface RecommendationExplainability {
  target_utilization: number;
  forecast_error_rate: number;
  active_leave_count: number;
  historical_dph: number;
  lead_time_days: number;
  rationale: string;
  impact_statement: string;
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  store_id: string;
  store_name: string;
  emirate: Emirate;
  target_week: number;
  couriers_needed: number;
  lead_time_days: number;
  priority: RecommendationPriority;
  title: string;
  description: string;
  source_store_id?: string;
  source_store_name?: string;
  time_window?: string;
  explanation: RecommendationExplainability;
}

export interface SimulationParameters {
  demand_volatility: number;   // -0.30 to +0.30 (e.g. 0.05 = +5%)
  leave_rate_increase: number;  // 0.0 to 0.30 (e.g. 0.10 = +10%)
  dph_delta: number;            // -1.0 to +1.0 (e.g. -0.5)
  target_fte_split: number;     // 0.40 to 0.80 (e.g. 0.60)
}

export interface KPIOverview {
  total_stores: number;
  forecast_volume_13w: number;
  total_couriers: number;
  fte_couriers: number;
  ftc_couriers: number;
  fte_mix_pct: number;
  demand_match_accuracy: number; // Target 95%
  gap_hours_reduction: number;    // Target 20%
  labor_cost_per_shipment: number;
  cost_savings_per_shipment: number; // Target AED 0.50
  total_critical_alerts: number;
  understaffed_slots_count: number;
  overstaffed_slots_count: number;
}

export interface Dataset {
  stores: StoreMetadata[];
  demand: DemandForecastSlot[];
  couriers: Courier[];
  metadata: {
    ingested_at: string;
    total_slots: number;
    horizon_weeks: number;
    filename?: string;
  };
}
