import React from 'react';
import { MOCK_GUESTS } from '../constants';
import { Guest } from '../types';
import { Star, Calendar, DollarSign, ArrowRight } from 'lucide-react';

interface GuestListProps {
  onSelectGuest: (guest: Guest) => void;
}

export const GuestList: React.FC<GuestListProps> = ({ onSelectGuest }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Guest CRM</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">Guest Name</th>
                <th className="p-4 font-semibold text-gray-600">Tier</th>
                <th className="p-4 font-semibold text-gray-600">Total Spent</th>
                <th className="p-4 font-semibold text-gray-600">Last Stay</th>
                <th className="p-4 font-semibold text-gray-600">Preferences</th>
                <th className="p-4 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_GUESTS.map((guest) => (
                <tr key={guest.id} className="border-b border-gray-50 hover:bg-brand-50 transition-colors group">
                  <td className="p-4">
                    <div>
                      <div className="font-bold text-gray-900">{guest.name}</div>
                      <div className="text-xs text-gray-400">{guest.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      guest.tier === 'Platinum' ? 'bg-slate-800 text-white border-slate-800' :
                      guest.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      guest.tier === 'Silver' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                      'bg-white text-gray-500 border-gray-200'
                    }`}>
                      {guest.tier}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700 font-mono">
                    ${guest.totalSpent.toLocaleString()}
                  </td>
                  <td className="p-4 text-gray-500 text-sm">
                    {guest.lastStay}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {guest.preferences.slice(0, 2).map((p, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                          {p}
                        </span>
                      ))}
                      {guest.preferences.length > 2 && (
                        <span className="text-xs text-gray-400">+{guest.preferences.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => onSelectGuest(guest)}
                      className="flex items-center space-x-2 text-sm text-hotel-gold font-semibold hover:text-yellow-600 transition-colors"
                    >
                      <span>Generate Offer</span>
                      <ArrowRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};