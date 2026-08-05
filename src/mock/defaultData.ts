import { Dataset, StoreMetadata, Courier, DemandForecastSlot } from '../types';

export const INITIAL_STORES: StoreMetadata[] = [
  {
    store_id: 'QED_DXB_01',
    store_name: 'Al Quoz Dark Store',
    emirate: 'Dubai',
    zone: 'Al Quoz Industrial',
    lat: 25.1324,
    lng: 55.2281,
    target_utilisation_pct: 16,
    base_dph: 4.2
  },
  {
    store_id: 'QED_DXB_02',
    store_name: 'Business Bay Dark Store',
    emirate: 'Dubai',
    zone: 'Business Bay Core',
    lat: 25.1852,
    lng: 55.2744,
    target_utilisation_pct: 18,
    base_dph: 4.5
  },
  {
    store_id: 'QED_DXB_03',
    store_name: 'Dubai Marina Dark Store',
    emirate: 'Dubai',
    zone: 'Dubai Marina & JBR',
    lat: 25.0772,
    lng: 55.1332,
    target_utilisation_pct: 15,
    base_dph: 3.8
  },
  {
    store_id: 'QED_DXB_04',
    store_name: 'Jumeirah Dark Store',
    emirate: 'Dubai',
    zone: 'Jumeirah 1-3',
    lat: 25.2100,
    lng: 55.2500,
    target_utilisation_pct: 16,
    base_dph: 4.0
  },
  {
    store_id: 'QED_AUH_01',
    store_name: 'Al Reem Dark Store',
    emirate: 'Abu Dhabi',
    zone: 'Al Reem Island',
    lat: 24.4988,
    lng: 54.4069,
    target_utilisation_pct: 16,
    base_dph: 3.9
  },
  {
    store_id: 'QED_AUH_02',
    store_name: 'Corniche Dark Store',
    emirate: 'Abu Dhabi',
    zone: 'Corniche & Khalidiya',
    lat: 24.4686,
    lng: 54.3431,
    target_utilisation_pct: 17,
    base_dph: 4.1
  },
  {
    store_id: 'QED_SHJ_01',
    store_name: 'Al Majaz Dark Store',
    emirate: 'Sharjah',
    zone: 'Al Majaz Waterfront',
    lat: 25.3262,
    lng: 55.3853,
    target_utilisation_pct: 14,
    base_dph: 3.6
  },
  {
    store_id: 'QED_SHJ_02',
    store_name: 'University City Dark Store',
    emirate: 'Sharjah',
    zone: 'University City',
    lat: 25.2970,
    lng: 55.4740,
    target_utilisation_pct: 15,
    base_dph: 3.7
  },
  {
    store_id: 'QED_AJM_01',
    store_name: 'Al Nuaimiya Dark Store',
    emirate: 'Ajman',
    zone: 'Al Nuaimiya 1',
    lat: 25.3995,
    lng: 55.4797,
    target_utilisation_pct: 14,
    base_dph: 3.4
  },
  {
    store_id: 'QED_RAK_01',
    store_name: 'Al Nakheel Dark Store',
    emirate: 'RAK',
    zone: 'Al Nakheel Commercial',
    lat: 25.7895,
    lng: 55.9721,
    target_utilisation_pct: 14,
    base_dph: 3.3
  }
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Helper to generate 67 Couriers distributed across 10 stores
export function generateCouriers(): Courier[] {
  const couriers: Courier[] = [];
  let courierCount = 1;

  // Store distribution of couriers (approx 6-8 per store, total 67)
  const storeCourierCounts: { [key: string]: { fte: number; ftc: number } } = {
    'QED_DXB_01': { fte: 5, ftc: 3 }, // Al Quoz
    'QED_DXB_02': { fte: 4, ftc: 3 }, // Business Bay
    'QED_DXB_03': { fte: 3, ftc: 4 }, // Dubai Marina (short FTE for week 9 surge!)
    'QED_DXB_04': { fte: 4, ftc: 3 }, // Jumeirah
    'QED_AUH_01': { fte: 4, ftc: 3 }, // Al Reem
    'QED_AUH_02': { fte: 4, ftc: 2 }, // Corniche
    'QED_SHJ_01': { fte: 4, ftc: 3 }, // Al Majaz
    'QED_SHJ_02': { fte: 4, ftc: 2 }, // University City
    'QED_AJM_01': { fte: 3, ftc: 3 }, // Al Nuaimiya
    'QED_RAK_01': { fte: 4, ftc: 4 }  // Al Nakheel
  };

  const shiftWindows = [
    { start: '07:00', end: '16:00', hours: 9 },
    { start: '08:00', end: '17:00', hours: 9 },
    { start: '12:00', end: '21:00', hours: 9 },
    { start: '14:00', end: '23:00', hours: 9 },
    { start: '15:00', end: '00:00', hours: 9 }
  ];

  const offDays = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday'];

  INITIAL_STORES.forEach((store) => {
    const counts = storeCourierCounts[store.store_id] || { fte: 4, ftc: 3 };
    
    // FTE couriers
    for (let i = 0; i < counts.fte; i++) {
      const shift = shiftWindows[(i + courierCount) % shiftWindows.length];
      const off = offDays[(i + courierCount) % offDays.length];
      const isOnLeave = (courierCount === 12 || courierCount === 28 || courierCount === 45); // specific on leave couriers
      
      couriers.push({
        courier_id: `C${3000 + courierCount}`,
        store_id: store.store_id,
        employment_type: 'FTE',
        shift_start: shift.start,
        shift_end: shift.end,
        working_hours: shift.hours,
        weekly_off_day: off,
        avg_delivery_hr: Number((store.base_dph + (i % 2 === 0 ? 0.3 : -0.2)).toFixed(1)),
        status: isOnLeave ? 'On Leave' : 'Active'
      });
      courierCount++;
    }

    // FTC couriers
    for (let j = 0; j < counts.ftc; j++) {
      const shift = shiftWindows[(j + 2) % shiftWindows.length];
      const off = offDays[(j + 3) % offDays.length];
      
      couriers.push({
        courier_id: `C${3000 + courierCount}`,
        store_id: store.store_id,
        employment_type: 'FTC',
        shift_start: shift.start,
        shift_end: shift.end,
        working_hours: shift.hours,
        weekly_off_day: off,
        avg_delivery_hr: Number((store.base_dph + (j % 2 === 0 ? 0.1 : -0.3)).toFixed(1)),
        status: 'Active'
      });
      courierCount++;
    }
  });

  return couriers;
}

// Generate 43,680 30-minute demand forecast slots across 13 weeks for 10 stores
export function generateDemandForecast(): DemandForecastSlot[] {
  const slots: DemandForecastSlot[] = [];
  const startDate = new Date(2026, 7, 3); // Monday August 3, 2026

  // Generate 48 time slots for a day ("00:00" to "23:30")
  const timeSlots: string[] = [];
  for (let h = 0; h < 24; h++) {
    const hh = String(h).padStart(2, '0');
    timeSlots.push(`${hh}:00`);
    timeSlots.push(`${hh}:30`);
  }

  // Multipliers for time of day to create realistic QComm peak profiles
  const getTimeMultiplier = (slot: string): number => {
    const hour = parseInt(slot.split(':')[0], 10);
    const minute = parseInt(slot.split(':')[1], 10);
    const timeVal = hour + minute / 60;

    if (timeVal < 7) return 0.15; // Late night low demand
    if (timeVal < 11.5) return 0.6; // Morning standard
    if (timeVal <= 14.5) return 1.4; // Lunch peak
    if (timeVal < 17.5) return 0.85; // Afternoon lull
    if (timeVal <= 22) return 1.8; // Dinner peak
    return 0.4; // Late night wind down
  };

  // 13 Weeks
  for (let week = 1; week <= 13; week++) {
    // 7 Days per week
    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (week - 1) * 7 + dayIdx);
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayName = DAYS_OF_WEEK[dayIdx];
      const isWeekend = (dayName === 'Friday' || dayName === 'Saturday') ? 'Yes' : 'No';
      const weekendMultiplier = isWeekend === 'Yes' ? 1.25 : 1.0;

      // Week-specific growth/surge factors to trigger realistic scenarios:
      // - Week 3: Al Quoz local surge (+35%)
      // - Week 9: Dubai Marina major demand expansion (+45%)
      let weekFactor = 1.0 + (week * 0.015); // baseline trend

      INITIAL_STORES.forEach((store) => {
        let storeMultiplier = 1.0;
        if (store.store_id === 'QED_DXB_01' && week === 3) storeMultiplier = 1.35; // Al Quoz week 3 surge
        if (store.store_id === 'QED_DXB_03' && week >= 9) storeMultiplier = 1.45; // Dubai Marina week 9 surge

        timeSlots.forEach((timeSlot) => {
          const timeMult = getTimeMultiplier(timeSlot);
          const baseOrderRate = (store.base_dph * 4.5) * timeMult * weekendMultiplier * weekFactor * storeMultiplier;
          
          // Add deterministic small fluctuation for actual vs forecast
          const noise = Math.sin(week * 7 + dayIdx * 48 + timeSlots.indexOf(timeSlot)) * 1.5;
          const forecast_volume = Math.max(1, Math.round(baseOrderRate));
          const actual_volume = Math.max(1, Math.round(baseOrderRate + noise));
          const forecast_error = Number((actual_volume - forecast_volume).toFixed(1));

          slots.push({
            store_id: store.store_id,
            store_name: store.store_name,
            date: dateStr,
            week_number: week,
            day_name: dayName,
            is_weekend: isWeekend,
            time_slot: timeSlot,
            forecast_volume,
            actual_volume,
            forecast_error
          });
        });
      });
    }
  }

  return slots;
}

export function getDefaultDataset(): Dataset {
  const stores = INITIAL_STORES;
  const couriers = generateCouriers();
  const demand = generateDemandForecast();

  return {
    stores,
    couriers,
    demand,
    metadata: {
      ingested_at: new Date().toISOString(),
      total_slots: demand.length,
      horizon_weeks: 13,
      filename: 'EMX_DarkStore_Baseline_Dataset.xlsx'
    }
  };
}
