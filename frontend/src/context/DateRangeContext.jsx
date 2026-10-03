import React, { createContext, useContext, useState } from 'react';

const DateRangeContext = createContext(null);

// Anchor date: 2026-10-03
export const PRESETS = [
  { id: 'last_28_days', label: 'Last 28 days', start: '2026-09-06', end: '2026-10-03' },
  { id: 'today', label: 'Today', start: '2026-10-03', end: '2026-10-03' },
  { id: 'yesterday', label: 'Yesterday', start: '2026-10-02', end: '2026-10-02' },
  { id: 'last_7_days', label: 'Last 7 days', start: '2026-09-27', end: '2026-10-03' },
  { id: 'last_14_days', label: 'Last 14 days', start: '2026-09-20', end: '2026-10-03' },
  { id: 'last_30_days', label: 'Last 30 days', start: '2026-09-04', end: '2026-10-03' },
  { id: 'last_90_days', label: 'Last 90 days', start: '2026-07-06', end: '2026-10-03' },
  { id: 'this_month', label: 'This month (Oct)', start: '2026-10-01', end: '2026-10-03' },
  { id: 'last_month', label: 'Last month (Sep)', start: '2026-09-01', end: '2026-09-30' },
  { id: 'this_quarter', label: 'This quarter (Q4)', start: '2026-10-01', end: '2026-10-03' },
  { id: 'last_quarter', label: 'Last quarter (Q3)', start: '2026-07-01', end: '2026-09-30' },
  { id: 'this_year', label: 'This year (2026)', start: '2026-01-01', end: '2026-10-03' }
];

export function DateRangeProvider({ children }) {
  const [activePreset, setActivePreset] = useState('last_28_days');
  const [startDate, setStartDate] = useState('2026-09-06');
  const [endDate, setEndDate] = useState('2026-10-03');
  const [comparisonEnabled, setComparisonEnabled] = useState(true);
  const [comparisonType, setComparisonType] = useState('previous_period'); // 'previous_period'

  const selectPreset = (presetId) => {
    const found = PRESETS.find(p => p.id === presetId);
    if (found) {
      setActivePreset(presetId);
      setStartDate(found.start);
      setEndDate(found.end);
    }
  };

  const setCustomRange = (start, end) => {
    setActivePreset('custom');
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <DateRangeContext.Provider value={{
      activePreset,
      startDate,
      endDate,
      comparisonEnabled,
      comparisonType,
      setComparisonEnabled,
      setComparisonType,
      selectPreset,
      setCustomRange,
      presets: PRESETS
    }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const ctx = useContext(DateRangeContext);
  if (!ctx) throw new Error('useDateRange must be used within a DateRangeProvider');
  return ctx;
}
