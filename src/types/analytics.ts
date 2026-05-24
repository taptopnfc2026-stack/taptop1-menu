// Analytics Types for Store Dashboard

export interface ScanRecord {
  id: string;
  storeId: string;
  scannedAt: Date;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  source?: string; // e.g., 'direct', 'google', 'facebook'
}

export interface ClickRecord {
  id: string;
  storeId: string;
  platform: 'google' | 'facebook' | 'yelp' | 'trustpilot' | 'website';
  clickedAt: Date;
  deviceType: 'mobile' | 'desktop' | 'tablet';
}

export interface StoreAnalytics {
  storeId: string;
  storeName: string;
  totalScans: number;
  totalClicks: number;
  scanRecords: ScanRecord[];
  clickRecords: ClickRecord[];
  scansByDay: { date: string; count: number }[];
  clicksByPlatform: { platform: string; count: number }[];
  scansByDevice: { device: string; count: number }[];
  clicksByDevice: { device: string; count: number }[];
}

export interface AnalyticsState {
  isLoading: boolean;
  analytics: StoreAnalytics[];
}

export type AnalyticsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ANALYTICS'; payload: StoreAnalytics[] }
  | { type: 'ADD_SCAN'; payload: ScanRecord }
  | { type: 'ADD_CLICK'; payload: ClickRecord }
  | { type: 'CLEAR_ANALYTICS' };
