import React, { useState, useEffect } from 'react';
import { Guest, Offer } from '../types';
import { generatePersonalizedOffers } from '../services/geminiService';
import { MOCK_GUESTS } from '../constants';
import { Sparkles, Loader2, Tag, CheckCircle, AlertCircle, ShoppingCart } from 'lucide-react';

interface OfferGeneratorProps {
  initialGuestId?: string;
}

export const OfferGenerator: React.FC<OfferGeneratorProps> = ({ initialGuestId }) => {
  const [selectedGuestId, setSelectedGuestId] = useState<string>(initialGuestId || MOCK_GUESTS[0].id);
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const selectedGuest = MOCK_GUESTS.find(g => g.id === selectedGuestId);

  // If initialGuestId changes (e.g., coming from Guest List), update selection
  useEffect(() => {
    if (initialGuestId) {
      setSelectedGuestId(initialGuestId);
      setOffers([]); // Clear previous offers when switching guests
    }
  }, [initialGuestId]);

  const handleGenerate = async () => {
    if (!selectedGuest) return;

    setLoading(true);
    setError(null);
    setOffers([]);
    
    try {
      const generatedOffers = await generatePersonalizedOffers(selectedGuest);
      setOffers(generatedOffers);
    } catch (err) {
      setError("Failed to generate offers. Please check your API key and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="text-hotel-gold" />
            AI Offer Generator
          </h2>
          <p className="text-gray-500 text-sm mt-1">Select a guest to generate real-time personalized packages using Gemini.</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-white p-2 rounded-lg border border-gray-200">
          <label className="text-sm font-medium text-gray-600 px-2">Selected Guest:</label>
          <select 
            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-md focus:ring-hotel-gold focus:border-hotel-gold block w-64 p-2.5 outline-none"
            value={selectedGuestId}
            onChange={(e) => {
              setSelectedGuestId(e.target.value);
              setOffers([]); // Reset offers on change
            }}
          >
            {MOCK_GUESTS.map(g => (
              <option key={g.id} value={g.id}>{g.name} ({g.tier})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Guest Context Card */}
      {selectedGuest && (
        <div className="bg-gradient-to-r from-hotel-dark to-gray-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles size={120} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-white">{selectedGuest.name}</h3>
                <span className="bg-hotel-gold text-black text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {selectedGuest.tier}
                </span>
              </div>
              <div className="text-gray-300 text-sm space-y-1">
                <p>Loyalty ID: #{selectedGuest.id.toUpperCase()}992</p>
                <p>Email: {selectedGuest.email}</p>
              </div>
            </div>
            
            <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-8">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Known Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {selectedGuest.preferences.map((pref, i) => (
                  <span key={i} className="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
                    {pref}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-8">
               <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Upcoming Stay</h4>
               {selectedGuest.upcomingBooking ? (
                 <div>
                    <p className="text-lg font-semibold">{selectedGuest.upcomingBooking.roomType}</p>
                    <p className="text-sm text-hotel-gold">{selectedGuest.upcomingBooking.nights} Nights • Starting {selectedGuest.upcomingBooking.date}</p>
                 </div>
               ) : (
                 <p className="text-sm text-gray-500 italic">No upcoming booking found.</p>
               )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-lg font-bold text-sm shadow-lg transform transition-all
                ${loading 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-hotel-gold text-black hover:bg-yellow-500 hover:scale-105 active:scale-95'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate Personalized Offers</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Results Grid */}
      {offers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {offers.map((offer, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
              <div className={`h-2 w-full rounded-t-xl ${
                offer.type === 'UPGRADE' ? 'bg-purple-500' :
                offer.type === 'PACKAGE' ? 'bg-blue-500' :
                offer.type === 'DINING' ? 'bg-orange-500' : 'bg-emerald-500'
              }`} />
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${
                    offer.type === 'UPGRADE' ? 'bg-purple-50 text-purple-700' :
                    offer.type === 'PACKAGE' ? 'bg-blue-50 text-blue-700' :
                    offer.type === 'DINING' ? 'bg-orange-50 text-orange-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {offer.type}
                  </span>
                  <div className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                    {offer.conversionProbability}% match
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3">{offer.description}</p>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                   <div className="flex items-start gap-2">
                      <Sparkles size={14} className="text-hotel-gold mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-600 italic">"{offer.aiReasoning}"</p>
                   </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 line-through mr-2">${offer.originalPrice}</span>
                    <span className="text-xl font-bold text-gray-900">${offer.discountedPrice}</span>
                  </div>
                  <button className="flex items-center space-x-1 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    <CheckCircle size={16} />
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && offers.length === 0 && selectedGuest && !error && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="text-gray-300" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No offers generated yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mt-2">Click the button above to have Gemini AI analyze the guest profile and create revenue-driving offers.</p>
        </div>
      )}
    </div>
  );
};