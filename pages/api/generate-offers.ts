import type { NextApiRequest, NextApiResponse } from "next";
import { generatePersonalizedOffers } from "../../services/geminiService";
import { Guest } from "../../types";

type Data = {
  offers?: any;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { guest } = req.body as { guest?: Guest };
    if (!guest) {
      return res.status(400).json({ error: "Missing guest in request body." });
    }

    const offers = await generatePersonalizedOffers(guest);
    return res.status(200).json({ offers });
  } catch (err: any) {
    // Log detailed error on server for debugging
    console.error("API /api/generate-offers error:", err);
    return res.status(500).json({ error: err?.message || "Failed to generate offers" });
  }
}
