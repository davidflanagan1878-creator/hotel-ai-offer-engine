import { GoogleGenAI } from "@google/genai";
import { Guest, Offer } from "../types";

const getAiClient = () => {
  // Accept multiple common env var names so it's less likely to fail on naming differences
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "API Key not found. Please ensure process.env.API_KEY or process.env.GEMINI_API_KEY (or GOOGLE_API_KEY) is set."
    );
  }
  return new GoogleGenAI({ apiKey });
};

const offersJsonSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      originalPrice: { type: "number" },
      discountedPrice: { type: "number" },
      type: { type: "string", enum: ["UPGRADE", "PACKAGE", "AMENITY", "DINING"] },
      aiReasoning: { type: "string" },
      conversionProbability: { type: "integer" },
    },
    required: [
      "title",
      "description",
      "originalPrice",
      "discountedPrice",
      "type",
      "aiReasoning",
      "conversionProbability",
    ],
  },
};

export const generatePersonalizedOffers = async (guest: Guest): Promise<Offer[]> => {
  const ai = getAiClient();

  const prompt = `
    Act as a senior Hotel Revenue Manager and Concierge AI.
    Analyze the following guest profile and generate 3 highly personalized offers to increase direct booking value or guest satisfaction.
    
    Guest Profile:
    Name: ${guest.name}
    Tier: ${guest.tier}
    Preferences: ${guest.preferences?.join?.(", ") ?? ""}
    Upcoming Booking: ${
      guest.upcomingBooking ? `${guest.upcomingBooking.nights} nights in ${guest.upcomingBooking.roomType}` : "None currently"
    }
    Total Spent: $${guest.totalSpent ?? 0}

    Create 3 distinct offers (e.g., Room Upgrade, Spa Package, Dining Experience, Local Tour).
    For each offer, provide a clear 'aiReasoning' explaining why this specific guest would like it based on their data.
    Estimate a 'conversionProbability' (integer 0-100) based on fit.

    IMPORTANT: Respond ONLY with JSON that matches the provided schema (an array of offers). Do not include extra commentary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: offersJsonSchema,
      },
    });

    // Try usual places where the SDK puts JSON
    let jsonText: string | undefined = undefined;
    if (typeof response.text === "string" && response.text.trim()) jsonText = response.text;

    if (!jsonText && (response as any).output) {
      try {
        const output = (response as any).output;
        for (const out of output) {
          if (out?.content && Array.isArray(out.content)) {
            for (const c of out.content) {
              if (c?.mimeType === "application/json" && typeof c.text === "string") {
                jsonText = c.text;
                break;
              }
              if (typeof c?.text === "string" && c.text.trim().startsWith("[")) {
                jsonText = c.text;
                break;
              }
            }
            if (jsonText) break;
          }
        }
      } catch (err) {
        console.debug("Fallback output parsing failed:", err);
      }
    }

    if (!jsonText && Array.isArray((response as any).candidates)) {
      const cand = (response as any).candidates[0];
      if (cand) {
        if (typeof cand.text === "string") jsonText = cand.text;
        else if (cand.output?.[0]?.content?.[0]?.text) jsonText = cand.output[0].content[0].text;
      }
    }

    if (!jsonText) {
      // Nothing parseable found; include the raw response for easier debugging.
      console.error("No JSON text found in model response:", JSON.stringify(response, null, 2));
      throw new Error("Model response did not contain JSON text. See server logs for full response.");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      console.error("Failed to JSON.parse model output:", jsonText, err);
      throw new Error("Failed to parse JSON returned by model.");
    }

    if (!Array.isArray(parsed)) {
      console.error("Parsed model response is not an array:", parsed);
      throw new Error("Model returned unexpected shape (expected an array of offers).");
    }

    // Map offers and ensure ids
    const now = Date.now();
    return parsed.map((o: any, i: number) => {
      return {
        id: o.id ?? `ai-offer-${now}-${i}`,
        title: String(o.title ?? ""),
        description: String(o.description ?? ""),
        originalPrice: Number(o.originalPrice ?? 0),
        discountedPrice: Number(o.discountedPrice ?? 0),
        type: String(o.type ?? "PACKAGE"),
        aiReasoning: String(o.aiReasoning ?? ""),
        conversionProbability: Number.isFinite(Number(o.conversionProbability)) ? Number(o.conversionProbability) : 0,
      } as Offer;
    });
  } catch (error: any) {
    console.error("Error generating offers:", error);
    throw new Error(error?.message ? `Offer generation failed: ${error.message}` : "Offer generation failed");
  }
};
