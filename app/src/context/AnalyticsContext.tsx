import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AnalyticsState, AnalyticsAction, StoreAnalytics, ScanRecord, ClickRecord } from '../types/analytics';
import { useAuth } from './AuthContext';

const initialState: AnalyticsState = {
  isLoading: true,
  analytics: [],
};

function analyticsReducer(state: AnalyticsState, action: AnalyticsAction): AnalyticsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload, isLoading: false };
    case 'ADD_SCAN':
      return {
        ...state,
        analytics: state.analytics.map(a =>
          a.storeId === action.payload.storeId
            ? {
                ...a,
                totalScans: a.totalScans + 1,
                scanRecords: [action.payload, ...a.scanRecords],
                scansByDay: updateScansByDay(a.scansByDay, action.payload.scannedAt),
                scansByDevice: updateScansByDevice(a.scansByDevice, action.payload.deviceType),
              }
            : a
        ),
      };
    case 'ADD_CLICK':
      return {
        ...state,
        analytics: state.analytics.map(a =>
          a.storeId === action.payload.storeId
            ? {
                ...a,
                totalClicks: a.totalClicks + 1,
                clickRecords: [action.payload, ...a.clickRecords],
                clicksByPlatform: updateClicksByPlatform(a.clicksByPlatform, action.payload.platform),
                clicksByDevice: updateClicksByDevice(a.clicksByDevice, action.payload.deviceType),
              }
            : a
        ),
      };
    case 'CLEAR_ANALYTICS':
      return initialState;
    default:
      return state;
  }
}

function updateScansByDay(scansByDay: { date: string; count: number }[], date: Date): { date: string; count: number }[] {
  const dateStr = date.toISOString().split('T')[0];
  const existing = scansByDay.find(s => s.date === dateStr);
  if (existing) {
    return scansByDay.map(s => (s.date === dateStr ? { ...s, count: s.count + 1 } : s));
  }
  return [{ date: dateStr, count: 1 }, ...scansByDay].slice(0, 30);
}

function updateScansByDevice(scansByDevice: { device: string; count: number }[], device: string): { device: string; count: number }[] {
  const existing = scansByDevice.find(d => d.device === device);
  if (existing) {
    return scansByDevice.map(d => (d.device === device ? { ...d, count: d.count + 1 } : d));
  }
  return [...scansByDevice, { device, count: 1 }];
}

function updateClicksByPlatform(clicksByPlatform: { platform: string; count: number }[], platform: string): { platform: string; count: number }[] {
  const existing = clicksByPlatform.find(c => c.platform === platform);
  if (existing) {
    return clicksByPlatform.map(c => (c.platform === platform ? { ...c, count: c.count + 1 } : c));
  }
  return [...clicksByPlatform, { platform, count: 1 }];
}

function updateClicksByDevice(clicksByDevice: { device: string; count: number }[], device: string): { device: string; count: number }[] {
  const existing = clicksByDevice.find(d => d.device === device);
  if (existing) {
    return clicksByDevice.map(d => (d.device === device ? { ...d, count: d.count + 1 } : d));
  }
  return [...clicksByDevice, { device, count: 1 }];
}

interface AnalyticsContextType {
  state: AnalyticsState;
  getStoreAnalytics: (storeId: string) => StoreAnalytics | undefined;
  recordScan: (storeId: string, deviceType?: 'mobile' | 'desktop' | 'tablet', source?: string) => void;
  recordClick: (storeId: string, platform: 'google' | 'facebook' | 'yelp' | 'trustpilot' | 'website', deviceType?: 'mobile' | 'desktop' | 'tablet') => void;
  generateMockData: (storeId: string, storeName: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getRandomDevice(): 'mobile' | 'desktop' | 'tablet' {
  const devices: ('mobile' | 'desktop' | 'tablet')[] = ['mobile', 'desktop', 'tablet'];
  return devices[Math.floor(Math.random() * devices.length)];
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(analyticsReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      dispatch({ type: 'CLEAR_ANALYTICS' });
      return;
    }

    const stored = localStorage.getItem('taptopmenu_analytics');
    if (stored) {
      const parsed = JSON.parse(stored);
      const analyticsWithDates = parsed.analytics.map((a: StoreAnalytics) => ({
        ...a,
        scanRecords: a.scanRecords.map((s: ScanRecord) => ({ ...s, scannedAt: new Date(s.scannedAt) })),
        clickRecords: a.clickRecords.map((c: ClickRecord) => ({ ...c, clickedAt: new Date(c.clickedAt) })),
      }));
      dispatch({ type: 'SET_ANALYTICS', payload: analyticsWithDates });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user]);

  useEffect(() => {
    if (!state.isLoading && user) {
      localStorage.setItem('taptopmenu_analytics', JSON.stringify(state));
    }
  }, [state, user]);

  const getStoreAnalytics = (storeId: string): StoreAnalytics | undefined => {
    return state.analytics.find(a => a.storeId === storeId);
  };

  const recordScan = (
    storeId: string,
    deviceType: 'mobile' | 'desktop' | 'tablet' = 'mobile',
    source?: string
  ) => {
    const record: ScanRecord = {
      id: generateId(),
      storeId,
      scannedAt: new Date(),
      deviceType,
      source,
    };
    dispatch({ type: 'ADD_SCAN', payload: record });
  };

  const recordClick = (
    storeId: string,
    platform: 'google' | 'facebook' | 'yelp' | 'trustpilot' | 'website',
    deviceType: 'mobile' | 'desktop' | 'tablet' = 'mobile'
  ) => {
    const record: ClickRecord = {
      id: generateId(),
      storeId,
      platform,
      clickedAt: new Date(),
      deviceType,
    };
    dispatch({ type: 'ADD_CLICK', payload: record });
  };

  const generateMockData = (storeId: string, storeName: string) => {
    const existing = state.analytics.find(a => a.storeId === storeId);
    if (existing) return;

    const scanRecords: ScanRecord[] = [];
    const clickRecords: ClickRecord[] = [];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      scanRecords.push({
        id: generateId(),
        storeId,
        scannedAt: date,
        deviceType: getRandomDevice(),
        source: ['direct', 'google', 'facebook'][Math.floor(Math.random() * 3)],
      });

      if (Math.random() > 0.3) {
        const platforms: ('google' | 'facebook' | 'yelp' | 'trustpilot' | 'website')[] = ['google', 'facebook', 'yelp', 'trustpilot', 'website'];
        clickRecords.push({
          id: generateId(),
          storeId,
          platform: platforms[Math.floor(Math.random() * platforms.length)],
          clickedAt: date,
          deviceType: getRandomDevice(),
        });
      }
    }

    const scansByDay: { date: string; count: number }[] = [];
    const scansByDevice: { device: string; count: number }[] = [
      { device: 'mobile', count: 0 },
      { device: 'desktop', count: 0 },
      { device: 'tablet', count: 0 },
    ];
    const clicksByPlatform: { platform: string; count: number }[] = [
      { platform: 'google', count: 0 },
      { platform: 'facebook', count: 0 },
      { platform: 'yelp', count: 0 },
      { platform: 'trustpilot', count: 0 },
      { platform: 'website', count: 0 },
    ];
    const clicksByDevice: { device: string; count: number }[] = [
      { device: 'mobile', count: 0 },
      { device: 'desktop', count: 0 },
      { device: 'tablet', count: 0 },
    ];

    scanRecords.forEach(scan => {
      const dateStr = scan.scannedAt.toISOString().split('T')[0];
      const existingDay = scansByDay.find(d => d.date === dateStr);
      if (existingDay) {
        existingDay.count++;
      } else {
        scansByDay.push({ date: dateStr, count: 1 });
      }
      const deviceEntry = scansByDevice.find(d => d.device === scan.deviceType);
      if (deviceEntry) deviceEntry.count++;
    });

    clickRecords.forEach(click => {
      const platformEntry = clicksByPlatform.find(p => p.platform === click.platform);
      if (platformEntry) platformEntry.count++;
      const deviceEntry = clicksByDevice.find(d => d.device === click.deviceType);
      if (deviceEntry) deviceEntry.count++;
    });

    scansByDay.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    scansByDay.slice(0, 30);

    const newAnalytics: StoreAnalytics = {
      storeId,
      storeName,
      totalScans: scanRecords.length,
      totalClicks: clickRecords.length,
      scanRecords,
      clickRecords,
      scansByDay,
      clicksByPlatform,
      scansByDevice,
      clicksByDevice,
    };

    dispatch({ type: 'SET_ANALYTICS', payload: [...state.analytics, newAnalytics] });
  };

  return (
    <AnalyticsContext.Provider value={{ state, getStoreAnalytics, recordScan, recordClick, generateMockData }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
