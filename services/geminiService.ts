import { GoogleGenAI, Type } from "@google/genai";
import { Guest, Offer } from "../types";

// Helper to get the AI client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please ensure process.env.API_KEY is set.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePersonalizedOffers = async (guest: Guest): Promise<Offer[]> => {
  const ai = getAiClient();

  const prompt = `
    Act as a senior Hotel Revenue Manager and Concierge AI.
    Analyze the following guest profile and generate 3 highly personalized offers to increase direct booking value or guest satisfaction.
    
    Guest Profile:
    Name: ${guest.name}
    Tier: ${guest.tier}
    Preferences: ${guest.preferences.join(', ')}
    Upcoming Booking: ${guest.upcomingBooking ? `${guest.upcomingBooking.nights} nights in ${guest.upcomingBooking.roomType}` : 'None currently'}
    Total Spent: $${guest.totalSpent}

    Create 3 distinct offers (e.g., Room Upgrade, Spa Package, Dining Experience, Local Tour).
    For each offer, provide a clear 'aiReasoning' explaining why this specific guest would like it based on their data.
    Estimate a 'conversionProbability' (integer 0-100) based on fit.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              originalPrice: { type: Type.NUMBER },
              discountedPrice: { type: Type.NUMBER },
              type: { type: Type.STRING, enum: ['UPGRADE', 'PACKAGE', 'AMENITY', 'DINING'] },
              aiReasoning: { type: Type.STRING },
              conversionProbability: { type: Type.INTEGER },
            },
            required: ['title', 'description', 'originalPrice', 'discountedPrice', 'type', 'aiReasoning', 'conversionProbability']
          }
        }
      }
    });

    if (response.text) {
      const offers = JSON.parse(response.text) as Offer[];
      // Ensure IDs are unique-ish if the AI hallucinates simple ones
      return offers.map((o, index) => ({ ...o, id: `ai-offer-${Date.now()}-${index}` }));
    }
    
    return [];
  } catch (error) {
    console.error("Error generating offers:", error);
    throw error;
  }
};