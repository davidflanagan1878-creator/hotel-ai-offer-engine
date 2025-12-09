import React, { useState, useEffect } from "react";
import { Guest, Offer } from "../types";
import { MOCK_GUESTS } from "../constants";
import { Sparkles, Loader2, Tag, CheckCircle, AlertCircle, ShoppingCart } from "lucide-react";

interface OfferGeneratorProps {
  initialGuestId?: string;
}

export const OfferGenerator: React.FC<OfferGeneratorProps> = ({ initialGuestId }) => {
  const [selectedGuestId, setSelectedGuestId] = useState<string>(initialGuestId || MOCK_GUESTS[0].id);
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [rawDebug, setRawDebug] = useState<any>(null);

  const selectedGuest = MOCK_GUESTS.find((g) => g.id === selectedGuestId);

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
    setRawDebug(null);

    try {
      const res = await fetch("/api/generate-offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest: selectedGuest }),
      });

      const text = await res.text();
      if (!res.ok) {
        // If server returned a helpful error message, show it
        let serverMessage = text;
        try {
          const parsed = JSON.parse(text);
          serverMessage = parsed?.error || JSON.stringify(parsed);
        } catch {
          // text might not be JSON
        }
        throw new Error(`Server returned ${res.status}: ${serverMessage}`);
      }

      // Try to parse JSON response like { offers: [...] }
      let payload: any;
      try {
        payload = JSON.parse(text);
      } catch (err) {
        throw new Error("Failed to parse server JSON response.");
      }

      if (!payload || !Array.isArray(payload.offers)) {
        // Allow payload.offers or payload directly being an array (defensive)
        if (Array.isArray(payload)) {
          setOffers(payload);
        } else {
          throw new Error("Server returned unexpected shape. See debug output.");
        }
      } else {
        setOffers(payload.offers);
      }

      setRawDebug(payload);
    } catch (err: any) {
      const message = err?.message || JSON.stringify(err);
      setError(`Failed to generate offers: ${message}`);
      console.error("Offer generation error (client):", err);
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
            {MOCK_GUESTS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.tier})
              </option>
            ))}
          </select>
          <button
            className="ml-3 inline-flex items-center px-4 py-2 bg-hotel-gold text-white rounded-md disabled:opacity-60"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
            Generate Offers
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <div className="flex items-start gap-2">
            <AlertCircle />
            <div>
              <div className="font-medium">Error</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        </div>
      )}

      {rawDebug && (
        <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto">{JSON.stringify(rawDebug, null, 2)}</pre>
      )}

      {/* Guest Context Card */}
      {selectedGuest && (
        <div className="bg-gradient-to-r from-hotel-dark to-gray-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles size={120} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-8">
            {/* existing guest context UI (unchanged) */}
          </div>
        </div>
      )}

      {/* Offers display */}
      {offers.length > 0 && (
        <div className="grid gap-4">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white p-4 rounded-md border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{offer.title}</h3>
                  <p className="text-sm text-gray-600">{offer.description}</p>
                </div>
                <div className="text-hotel-gold font-bold">{offer.discountedPrice ? `$${offer.discountedPrice}` : ""}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
