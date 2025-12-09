import React from 'react';
import { MOCK_STATS, REVENUE_DATA } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, Percent, ShoppingBag, TrendingUp } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string; trend?: string }> = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
      {trend && <p className="text-xs font-medium text-green-600 mt-1 flex items-center"><TrendingUp size={12} className="mr-1"/> {trend}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
      <Icon size={24} className={color.replace('bg-', 'text-')} />
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Performance Overview</h2>
        <div className="text-sm text-gray-500">Last updated: Just now</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${MOCK_STATS.revenue.toLocaleString()}`} 
          icon={DollarSign} 
          color="text-emerald-600 bg-emerald-600"
          trend="+12.5% vs last month"
        />
        <StatCard 
          title="Occupancy Rate" 
          value={`${MOCK_STATS.occupancy}%`} 
          icon={Users} 
          color="text-blue-600 bg-blue-600"
          trend="+2.1% vs last month"
        />
        <StatCard 
          title="Offers Generated" 
          value={MOCK_STATS.offersGenerated.toLocaleString()} 
          icon={ShoppingBag} 
          color="text-purple-600 bg-purple-600"
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${MOCK_STATS.conversionRate}%`} 
          icon={Percent} 
          color="text-hotel-gold bg-hotel-gold"
          trend="+4.3% vs last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Direct Revenue Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Offer Engagement</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
              <Tooltip 
                 cursor={{fill: '#f3f4f6'}}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="value" fill="#c5a059" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Simple icon wrapper needed for the StatCard to work
function Users(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
