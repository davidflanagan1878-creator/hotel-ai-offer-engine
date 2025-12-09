export interface Guest {
  id: string;
  name: string;
  email: string;
  tier: 'Standard' | 'Silver' | 'Gold' | 'Platinum';
  totalSpent: number;
  stays: number;
  preferences: string[];
  lastStay: string;
  upcomingBooking?: {
    date: string;
    roomType: string;
    nights: number;
  };
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  type: 'UPGRADE' | 'PACKAGE' | 'AMENITY' | 'DINING';
  aiReasoning: string; // Why the AI chose this
  conversionProbability: number; // 0-100
}

export interface DashboardStats {
  revenue: number;
  occupancy: number;
  offersGenerated: number;
  conversionRate: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  GUESTS = 'GUESTS',
  GENERATOR = 'GENERATOR',
  SETTINGS = 'SETTINGS',
}