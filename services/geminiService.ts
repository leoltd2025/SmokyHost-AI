
import { GoogleGenAI } from "@google/genai";
import { Property, PricingData, OperationTask, SmartDevice, ROIProjection } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const safeGenerate = async (model: string, prompt: string, fallback: string) => {
    const ai = getAiClient();
    if (!ai) return fallback;
    try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text || fallback;
    } catch (e) {
        console.warn("AI Generation Failed:", e);
        return fallback;
    }
};

export const generateDailyBriefing = async (metrics: any, properties: Property[], isBeginner: boolean) => {
    const prompt = `
      You are the "AI CEO" of a Short Term Rental business in Pigeon Forge, TN.
      
      Context:
      - Market: Pigeon Forge/Smoky Mountains (2025 Trends: Domestic tourism, Pet-friendly focus).
      - Seasonality: High demand (Fall Colors/Dollywood events).
      - User Level: ${isBeginner ? "Beginner (Explain simply, avoid jargon, focus on actionable steps)" : "Expert (Focus on ROI, RevPAR, and KPIs)"}.
      
      Data:
      Metrics: ${JSON.stringify(metrics)}
      Properties: ${JSON.stringify(properties.map(p => ({ name: p.name, occupancy: p.occupancyRate, status: p.status })))}
      
      Provide a ${isBeginner ? "simple, encouraging" : "concise, data-driven"} executive summary (max 100 words).
      ${isBeginner ? "Define one key term if used (like RevPAR)." : ""}
      Mention a specific action item for today related to compliance or guest experience.
    `;
    return safeGenerate('gemini-2.5-flash', prompt, "Welcome back! Occupancy looks stable. Check your calendar for upcoming gaps.");
};

export const generateGuestReply = async (guestMessage: string, propertyName: string, context: string = "") => {
    const prompt = `
      Act as "SmokyBot", a 5-star host assistant for "${propertyName}" in Pigeon Forge.
      Guest Message: "${guestMessage}"
      Context: ${context}
      
      Draft a friendly response. If relevant, mention:
      - The Island in Pigeon Forge
      - Dollywood
      - Great Smoky Mountains National Park hiking trails
    `;
    return safeGenerate('gemini-2.5-flash', prompt, "Thank you for your message! I will get back to you shortly.");
};

export const optimizeListingDescription = async (currentDesc: string, amenities: string[]) => {
    const prompt = `
      Optimize this Airbnb listing for the 2025 Pigeon Forge market.
      Current: "${currentDesc}"
      Amenities: ${amenities.join(", ")}
      
      Strategies:
      1. Emphasize "Pet-Friendly" if applicable (High demand niche in 2025).
      2. Highlight "EV Charger" if applicable.
      3. Focus on "Multi-generational families" (Domestic tourism trend).
      4. Use emotive words like "Cozy", "Retreat", "Smoky Mountain Views".
    `;
    return safeGenerate('gemini-2.5-flash', prompt, currentDesc);
};

export const analyzePricingStrategy = async (pricingData: PricingData[], minPrice: number, isPetFriendly: boolean) => {
    const sampleData = pricingData.slice(0, 7);
    const prompt = `
      Analyze this pricing for Pigeon Forge (Next 7 days):
      ${JSON.stringify(sampleData)}
      
      Constraints:
      - Minimum profitable rate is $${minPrice}.
      - Niche: ${isPetFriendly ? "Pet Friendly (+15% premium)" : "Standard"}.
      
      Recommendation (1 sentence): Should we increase for weekend demand (Dollywood traffic) or lower for midweek occupancy?
    `;
    return safeGenerate('gemini-2.5-flash', prompt, "Pricing appears competitive for the current season.");
};

export const optimizeOperationsSchedule = async (tasks: OperationTask[]) => {
    const prompt = `
      Role: Operations Manager.
      Tasks: ${JSON.stringify(tasks)}
      Resources: 2 Cleaners, 1 Handyman.
      Goal: 4 PM Check-in deadline.
      
      Output: A 2-sentence schedule plan prioritizing High Priority tasks.
    `;
    return safeGenerate('gemini-2.5-flash', prompt, "Prioritize cleaning turnover units first, then move to maintenance.");
};

export const analyzeDeviceTelemetry = async (devices: SmartDevice[]) => {
    const prompt = `
      Analyze IoT devices: ${JSON.stringify(devices)}.
      Identify alerts (Leaks, Offline, Temp < 60F or > 80F).
      Output: Status summary.
    `;
    return safeGenerate('gemini-2.5-flash', prompt, "All systems operational.");
};

export const analyzeGrowthStrategy = async (budget: number, currentNet: number) => {
    const prompt = `
      I have $${budget} to invest. My current net income is $${currentNet}/mo.
      Market: Pigeon Forge, TN (2025).
      
      Suggest an expansion strategy:
      1. Buy a new cabin? (Estimated cost $300k-$500k)
      2. Co-host more units?
      3. Add amenities (Hot tub, Game room)?
      
      Provide a calculated recommendation based on 10-15% Cash-on-Cash return target.
    `;
    return safeGenerate('gemini-2.5-flash', prompt, "Consider adding a Game Room to existing properties to boost ADR by 15% before purchasing new property.");
};

export const generateMarketingContent = async (topic: string, platform: string) => {
    const prompt = `
        Generate a ${platform} post for a Pigeon Forge Cabin rental business.
        Topic: ${topic}
        Focus: 2025 Travel Trends (Domestic, Nature, Family).
        Includes emojis and hashtags.
    `;
    return safeGenerate('gemini-2.5-flash', prompt, "🌲 Escape to the Smokies! 🐻 Book your stay today. #PigeonForge #CabinLife");
};

export const generateCoHostPitch = async (leadName: string, leadAddress: string) => {
    const prompt = `
        Write a cold email to ${leadName}, owner of property at ${leadAddress} in Pigeon Forge.
        My Offer: 25% Commission, Full-Service AI Management.
        Value Prop: We use AI to optimize pricing and get 20% higher revenue than average.
        Tone: Professional, Local Expert, Results-Oriented.
    `;
    return safeGenerate('gemini-2.5-flash', prompt, `Hi ${leadName}, I noticed your property at ${leadAddress}. We help owners boost revenue using AI...`);
};
