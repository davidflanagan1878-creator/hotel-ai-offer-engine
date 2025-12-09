import { Guest, DashboardStats } from './types';

export const MOCK_GUESTS: Guest[] = [
  {
    id: 'g1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    tier: 'Platinum',
    totalSpent: 12500,
    stays: 8,
    preferences: ['Spa', 'Vegan Dining', 'High Floor', 'Late Checkout'],
    lastStay: '2023-11-15',
    upcomingBooking: {
      date: '2024-06-10',
      roomType: 'Deluxe King',
      nights: 3,
    },
  },
  {
    id: 'g2',
    name: 'Michael Chen',
    email: 'm.chen@tech.co',
    tier: 'Gold',
    totalSpent: 5400,
    stays: 4,
    preferences: ['Business Center', 'Gym', 'Early Check-in', 'Quiet Room'],
    lastStay: '2024-01-20',
    upcomingBooking: {
      date: '2024-06-12',
      roomType: 'Standard Queen',
      nights: 2,
    },
  },
  {
    id: 'g3',
    name: 'The Thompson Family',
    email: 'thompsons@family.net',
    tier: 'Silver',
    totalSpent: 3200,
    stays: 2,
    preferences: ['Connecting Rooms', 'Kids Club', 'Pool Access'],
    lastStay: '2023-07-04',
    upcomingBooking: {
      date: '2024-07-01',
      roomType: 'Suite',
      nights: 5,
    },
  },
  {
    id: 'g4',
    name: 'Elena Rodriguez',
    email: 'elena.r@design.studio',
    tier: 'Standard',
    totalSpent: 800,
    stays: 1,
    preferences: ['City View', 'Art Tours', 'Cocktail Bar'],
    lastStay: '2023-09-10',
    // No upcoming booking
  },
];

export const MOCK_STATS: DashboardStats = {
  revenue: 142500,
  occupancy: 78,
  offersGenerated: 1240,
  conversionRate: 18.5,
};

export const REVENUE_DATA = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];
