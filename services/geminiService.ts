
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, UserInputs } from "../types.ts";

export const performBusinessAnalysis = async (inputs: UserInputs): Promise<AnalysisResult> => {
  // Creating instance inside the function to ensure up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Act as SMART BUZIBOT ANALYZER. Analyze the following business scenario:
    Business: ${inputs.businessType}
    Location: ${inputs.locationName} (${inputs.latitude}, ${inputs.longitude})
    Budget: ${inputs.budget} Lakhs (INR)
    Space: ${inputs.area} Sq.M
    Radius for analysis: ${inputs.radius} KM

    Analyze location suitability, costs, risks, and success probability. 
    Incorporate failure causes: No market demand (~42%), Cash flow (~29%), Team gaps (~23%), Competition (~19%).
    Provide a detailed, quantitative feasibility report.
    
    CRITICAL INSTRUCTIONS:
    1. The "prediction.successProb" and "prediction.failureProb" MUST sum to exactly 100.
    2. The "finalRecommendation" MUST be exactly 5 to 6 lines of "Expert Advice". 
       Write it in very simple, friendly, and non-technical English that any user can understand immediately.
       Use a helpful, encouraging mentor tone. Focus on clear next steps and actionable wisdom.
    3. Ensure the "timeToProfitability" is a specific range like "12-16 months".
    4. Do not use jargon like "Heuristic" or "OpEx" in the final recommendation; use "smart guesses" or "monthly bills" instead if needed.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          locationOverview: { type: Type.STRING },
          suitabilityScore: { type: Type.NUMBER },
          suitabilityBreakdown: {
            type: Type.OBJECT,
            properties: {
              populationDensity: { type: Type.NUMBER },
              footTraffic: { type: Type.NUMBER },
              competitionScore: { type: Type.NUMBER },
              accessibility: { type: Type.NUMBER },
              parking: { type: Type.NUMBER }
            },
            required: ["populationDensity", "footTraffic", "competitionScore", "accessibility", "parking"]
          },
          competitionAnalysis: {
            type: Type.OBJECT,
            properties: {
              count: { type: Type.NUMBER },
              avgRating: { type: Type.NUMBER },
              successfulCount: { type: Type.NUMBER },
              failedCount: { type: Type.NUMBER },
              pressureIndex: { type: Type.NUMBER }
            },
            required: ["count", "avgRating", "successfulCount", "failedCount", "pressureIndex"]
          },
          costEstimation: {
            type: Type.OBJECT,
            properties: {
              initialSetup: { type: Type.NUMBER },
              monthlyRent: { type: Type.NUMBER },
              monthlySalaries: { type: Type.NUMBER },
              monthlyUtilities: { type: Type.NUMBER },
              monthlySupplies: { type: Type.NUMBER },
              monthlyMarketing: { type: Type.NUMBER },
              monthlyMaintenance: { type: Type.NUMBER },
              totalMonthly: { type: Type.NUMBER },
              breakEvenMonths: { type: Type.NUMBER },
              feasibilityScore: { type: Type.NUMBER }
            },
            required: ["initialSetup", "monthlyRent", "monthlySalaries", "monthlyUtilities", "monthlySupplies", "monthlyMarketing", "monthlyMaintenance", "totalMonthly", "breakEvenMonths", "feasibilityScore"]
          },
          riskAnalysis: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              level: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              identifiedRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
              mitigationFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["score", "level", "identifiedRisks", "mitigationFactors"]
          },
          prediction: {
            type: Type.OBJECT,
            properties: {
              successProb: { type: Type.NUMBER },
              failureProb: { type: Type.NUMBER },
              confidence: { type: Type.NUMBER },
              timeToProfitability: { type: Type.STRING },
              keyRiskContributors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    factor: { type: Type.STRING },
                    impact: { type: Type.NUMBER }
                  },
                  required: ["factor", "impact"]
                }
              }
            },
            required: ["successProb", "failureProb", "confidence", "timeToProfitability", "keyRiskContributors"]
          },
          reasoning: { type: Type.STRING },
          finalRecommendation: { type: Type.STRING },
          competitors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER },
                rating: { type: Type.NUMBER },
                status: { type: Type.STRING, enum: ["Successful", "Failed", "Active"] }
              },
              required: ["name", "type", "lat", "lng", "rating", "status"]
            }
          }
        },
        required: [
          "locationOverview", "suitabilityScore", "suitabilityBreakdown", 
          "competitionAnalysis", "costEstimation", "riskAnalysis", 
          "prediction", "reasoning", "finalRecommendation", "competitors"
        ]
      }
    }
  });

  const jsonStr = response.text || "{}";
  const result = JSON.parse(jsonStr);
  
  return {
    ...result,
    center: [inputs.latitude, inputs.longitude]
  };
};