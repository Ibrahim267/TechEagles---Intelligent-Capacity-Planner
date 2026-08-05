import React, { createContext, useContext, useState, useMemo } from 'react';
import { Dataset, SimulationParameters, Emirate, StoreCapacitySummary, KPIOverview, Recommendation } from '../types';
import { getDefaultDataset } from '../mock/defaultData';
import { runSimulation } from '../services/simulationEngine';
import { computeStoreSummaries, computeOverallKPIs } from '../services/capacityEngine';
import { generateRecommendations } from '../services/recommendationEngine';

const DEFAULT_SIMULATION_PARAMS: SimulationParameters = {
  demand_volatility: 0,
  leave_rate_increase: 0,
  dph_delta: 0,
  target_fte_split: 0.60
};

interface CapacityContextType {
  dataset: Dataset;
  simulationParams: SimulationParameters;
  simulatedDataset: Dataset;
  selectedEmirate: string;
  selectedWeek: number | null;
  selectedStoreId: string;
  storeSummaries: StoreCapacitySummary[];
  kpiOverview: KPIOverview;
  recommendations: Recommendation[];
  setSelectedEmirate: (e: string) => void;
  setSelectedWeek: (w: number | null) => void;
  setSelectedStoreId: (s: string) => void;
  updateSimulationParams: (params: Partial<SimulationParameters>) => void;
  resetSimulation: () => void;
  loadBaselineDataset: () => void;
  loadCustomDataset: (newDataset: Dataset) => void;
}

const CapacityContext = createContext<CapacityContextType | undefined>(undefined);

export const CapacityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataset, setDataset] = useState<Dataset>(getDefaultDataset());
  const [simulationParams, setSimulationParams] = useState<SimulationParameters>(DEFAULT_SIMULATION_PARAMS);
  const [selectedEmirate, setSelectedEmirate] = useState<string>('All');
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('All');

  // Compute simulated dataset live
  const simulatedDataset = useMemo(() => {
    return runSimulation(dataset, simulationParams);
  }, [dataset, simulationParams]);

  // Compute store summaries live
  const storeSummaries = useMemo(() => {
    return computeStoreSummaries(simulatedDataset, selectedWeek || undefined);
  }, [simulatedDataset, selectedWeek]);

  // Compute overall KPIs live
  const kpiOverview = useMemo(() => {
    return computeOverallKPIs(simulatedDataset, selectedWeek || undefined);
  }, [simulatedDataset, selectedWeek]);

  // Compute AI recommendations live
  const recommendations = useMemo(() => {
    return generateRecommendations(simulatedDataset);
  }, [simulatedDataset]);

  const updateSimulationParams = (params: Partial<SimulationParameters>) => {
    setSimulationParams(prev => ({ ...prev, ...params }));
  };

  const resetSimulation = () => {
    setSimulationParams(DEFAULT_SIMULATION_PARAMS);
  };

  const loadBaselineDataset = () => {
    setDataset(getDefaultDataset());
    setSimulationParams(DEFAULT_SIMULATION_PARAMS);
  };

  const loadCustomDataset = (newDataset: Dataset) => {
    setDataset(newDataset);
    setSimulationParams(DEFAULT_SIMULATION_PARAMS);
  };

  return (
    <CapacityContext.Provider
      value={{
        dataset,
        simulationParams,
        simulatedDataset,
        selectedEmirate,
        selectedWeek,
        selectedStoreId,
        storeSummaries,
        kpiOverview,
        recommendations,
        setSelectedEmirate,
        setSelectedWeek,
        setSelectedStoreId,
        updateSimulationParams,
        resetSimulation,
        loadBaselineDataset,
        loadCustomDataset
      }}
    >
      {children}
    </CapacityContext.Provider>
  );
};

export const useCapacity = () => {
  const context = useContext(CapacityContext);
  if (!context) {
    throw new Error('useCapacity must be used within a CapacityProvider');
  }
  return context;
};
