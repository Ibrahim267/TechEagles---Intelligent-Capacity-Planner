import * as XLSX from 'xlsx';
import { Dataset, StoreMetadata, DemandForecastSlot, Courier } from '../types';
import { getDefaultDataset } from '../mock/defaultData';

export async function parseExcelWorkbook(file: File): Promise<Dataset> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetNames = workbook.SheetNames;
        
        let stores: StoreMetadata[] = [];
        let demand: DemandForecastSlot[] = [];
        let couriers: Courier[] = [];

        // Parse Sheet 1: Store_Metadata
        const storeSheetName = sheetNames.find(s => s.toLowerCase().includes('store')) || sheetNames[0];
        if (storeSheetName && workbook.Sheets[storeSheetName]) {
          const rawStores = XLSX.utils.sheet_to_json<any>(workbook.Sheets[storeSheetName]);
          stores = rawStores.map(row => ({
            store_id: String(row.store_id || row.Store_ID || row['Store ID'] || ''),
            store_name: String(row.store_name || row.Store_Name || row['Store Name'] || ''),
            emirate: (row.emirate || row.Emirate || 'Dubai') as any,
            zone: String(row.zone || row.Zone || ''),
            lat: Number(row.lat || row.Lat || 25.2048),
            lng: Number(row.lng || row.Lng || 55.2708),
            target_utilisation_pct: Number(row.target_utilisation_pct || row['Target Utilisation %'] || 16),
            base_dph: Number(row.base_dph || row.Base_DPH || row['Base DPH'] || 4.0)
          })).filter(s => s.store_id);
        }

        // Parse Sheet 2: Demand_Forecast
        const demandSheetName = sheetNames.find(s => s.toLowerCase().includes('demand') || s.toLowerCase().includes('forecast')) || sheetNames[1];
        if (demandSheetName && workbook.Sheets[demandSheetName]) {
          const rawDemand = XLSX.utils.sheet_to_json<any>(workbook.Sheets[demandSheetName]);
          demand = rawDemand.map(row => ({
            store_id: String(row.store_id || row.Store_ID || ''),
            store_name: String(row.store_name || row.Store_Name || ''),
            date: String(row.date || row.Date || ''),
            week_number: Number(row.week_number || row.Week_Number || row.week || 1),
            day_name: String(row.day_name || row.Day_Name || ''),
            is_weekend: (row.is_weekend || row.Is_Weekend || 'No') as 'Yes' | 'No',
            time_slot: String(row.time_slot || row.Time_Slot || '08:00'),
            forecast_volume: Number(row.forecast_volume || row.Forecast_Volume || 0),
            actual_volume: Number(row.actual_volume || row.Actual_Volume || 0),
            forecast_error: Number(row.forecast_error || row.Forecast_Error || 0)
          })).filter(d => d.store_id);
        }

        // Parse Sheet 3: Courier_Roster
        const courierSheetName = sheetNames.find(s => s.toLowerCase().includes('courier') || s.toLowerCase().includes('roster')) || sheetNames[2];
        if (courierSheetName && workbook.Sheets[courierSheetName]) {
          const rawCouriers = XLSX.utils.sheet_to_json<any>(workbook.Sheets[courierSheetName]);
          couriers = rawCouriers.map(row => ({
            courier_id: String(row.courier_id || row.Courier_ID || ''),
            store_id: String(row.store_id || row.Store_ID || ''),
            employment_type: (row.employment_type || row.Employment_Type || 'FTE') as 'FTE' | 'FTC',
            shift_start: String(row.shift_start || row.Shift_Start || '08:00'),
            shift_end: String(row.shift_end || row.Shift_End || '17:00'),
            working_hours: Number(row.working_hours || row.Working_Hours || 8),
            weekly_off_day: String(row.weekly_off_day || row.Weekly_Off_Day || 'Friday'),
            avg_delivery_hr: Number(row.avg_delivery_hr || row.Avg_Delivery_Hr || 4.0),
            status: (row.status || row.Status || 'Active') as 'Active' | 'On Leave'
          })).filter(c => c.courier_id);
        }

        // Fallback to default mock data if parsed sheets are empty
        if (stores.length === 0 || demand.length === 0 || couriers.length === 0) {
          console.warn('Workbook parsed but missing sheets or empty. Falling back to default mock dataset.');
          resolve(getDefaultDataset());
          return;
        }

        const horizon_weeks = Math.max(...demand.map(d => d.week_number), 13);

        resolve({
          stores,
          demand,
          couriers,
          metadata: {
            ingested_at: new Date().toISOString(),
            total_slots: demand.length,
            horizon_weeks,
            filename: file.name
          }
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
