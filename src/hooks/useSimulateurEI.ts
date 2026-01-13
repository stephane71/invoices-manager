"use client";

import { useCallback, useMemo, useState } from "react";

import {
  calculateSimulation,
  type ConfigState,
  type ConsequenceRule,
  DEFAULT_CONFIG,
  getApplicableAlerts,
  getApplicableConsequences,
  getAvailableTaxRegimes,
  type SimulationResult,
  type ThresholdAlert,
} from "@/lib/simulateur-ei";

interface UseSimulateurEIReturn {
  // Configuration
  config: ConfigState;
  setConfig: (updates: Partial<ConfigState>) => void;

  // Simulation inputs
  turnover: number;
  setTurnover: (value: number) => void;
  expenses: number;
  setExpenses: (value: number) => void;

  // Computed results
  results: SimulationResult | null;
  consequences: ConsequenceRule[];
  alerts: ThresholdAlert[];

  // Actions
  reset: () => void;
}

/**
 * Custom hook for managing the Simulateur EI state and calculations
 */
export const useSimulateurEI = (): UseSimulateurEIReturn => {
  // Configuration state
  const [config, setConfigState] = useState<ConfigState>(DEFAULT_CONFIG);

  // Simulation inputs
  const [turnover, setTurnover] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);

  /**
   * Update configuration with validation of coupled values
   */
  const setConfig = useCallback((updates: Partial<ConfigState>) => {
    setConfigState((prev) => {
      const newConfig = { ...prev, ...updates };

      // If benefit type changes, check if current tax regime is still valid
      if (updates.benefitType !== undefined) {
        const availableRegimes = getAvailableTaxRegimes(updates.benefitType);
        if (!availableRegimes.includes(newConfig.taxRegime)) {
          // Reset to MICRO (always available)
          newConfig.taxRegime = "MICRO";
        }
      }

      return newConfig;
    });
  }, []);

  /**
   * Calculate simulation results
   */
  const results = useMemo((): SimulationResult | null => {
    if (turnover <= 0) {
      return null;
    }

    return calculateSimulation({
      ...config,
      turnover,
      expenses,
    });
  }, [config, turnover, expenses]);

  /**
   * Get applicable consequences for current configuration
   */
  const consequences = useMemo((): ConsequenceRule[] => {
    return getApplicableConsequences(config);
  }, [config]);

  /**
   * Get applicable threshold alerts
   */
  const alerts = useMemo((): ThresholdAlert[] => {
    return getApplicableAlerts(config, turnover);
  }, [config, turnover]);

  /**
   * Reset all state to defaults
   */
  const reset = useCallback(() => {
    setConfigState(DEFAULT_CONFIG);
    setTurnover(0);
    setExpenses(0);
  }, []);

  return {
    config,
    setConfig,
    turnover,
    setTurnover,
    expenses,
    setExpenses,
    results,
    consequences,
    alerts,
    reset,
  };
};
