import { GoogleGenAI } from "@google/genai";
import { Ingredient, AIResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PROMPT = `You are MasakApa, an Indonesian AI cooking assistant focused on reducing food waste, saving money, and helping Indonesian households cook practical and reasonably nutritious meals. Always answer in Indonesian. 

CRITICAL RULES:
1. ONLY use ingredients from the user's list. If you must suggest extra ingredients, put them in 'optionalToBuy' and keep them at a minimum.
2. Prioritize ingredients marked 'Hampir kedaluwarsa' and 'Segera dipakai'.
3. Recommend exactly 3 realistic Indonesian home-cooking recipes.
4. If Emergency Fridge Mode is active, urgently prioritize ingredients that may spoil soon.
5. If Anak Kos Mode is active, create cheap recipes suitable for boarding house kitchens, limited tools (Rice cooker/Wajan), and the selected budget.
6. Estimate savings in Indonesian Rupiah based on using ingredients already at home.
7. Calculate Anti-Waste Score (0-100) based on: % of existing ingredients used, usage of urgent ingredients, and minimal extra cost.
8. Estimate simple nutrition per serving (calories, protein, carbs, fat, fiber). Use ± for estimates.

OUTPUT FORMAT (JSON ONLY):
{
  "summary": {
    "totalIngredientsUsed": number,
    "estimatedSavingsIdr": number,
    "weeklySavingsIdr": number,
    "monthlySavingsIdr": number,
    "wastePrevented": "string description",
    "bestRecommendation": "name of top recipe",
    "urgentIngredientsSaved": ["string"]
  },
  "recipes": [
    {
      "name": "string",
      "antiWasteScore": number,
      "scoreLabel": "string (Sangat Anti-Boros, Cukup, etc)",
      "estimatedSavingsIdr": number,
      "cookingTime": "string",
      "difficulty": "string",
      "budgetFit": "string",
      "toolsNeeded": ["string"],
      "whyThisRecipe": "string reasoning",
      "ingredientsUsed": ["string"],
      "optionalIngredients": ["string"],
      "steps": ["string"],
      "antiWasteNote": "string",
      "nutrition": {
        "servings": number,
        "caloriesKcal": number,
        "proteinGrams": number,
        "carbohydrateGrams": number,
        "fatGrams": number,
        "fiberGrams": number,
        "nutritionLabel": "string",
        "nutritionNote": "string",
        "balancedMealSuggestion": "string",
        "disclaimer": "Estimasi gizi bersifat perkiraan."
      },
      "shoppingList": {
        "availableIngredients": ["string"],
        "optionalToBuy": [{ "name": "string", "estimatedPriceIdr": number }],
        "totalAdditionalCostIdr": number,
        "shoppingNote": "string"
      }
    }
  ]
}`;

export async function getRecipes(ingredients: Ingredient[], settings: any): Promise<AIResponse | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const userPrompt = `Daftar Bahan di Dapur: ${JSON.stringify(ingredients)}. 
    Settings Pengguna: EmergencyMode=${settings.emergencyMode}, AnakKosMode=${settings.anakKosMode}, Budget=${settings.kosBudget} IDR.
    Tolong berikan 3 resep yang paling relevan dengan bahan-bahan di atas.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}

export async function scanIngredients(imageBase64: string): Promise<any[] | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: "user", parts: [
          { text: "Identify the food ingredients in this image. List them clearly in Indonesian. Return a JSON array of objects with 'name', 'estimatedQuantity', and 'confidence' (Tinggi, Sedang, Rendah)." },
          { inlineData: { data: imageBase64.split(",")[1], mimeType: "image/jpeg" } }
        ]}
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "[]";
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : (data.ingredients || data.detected || []);
  } catch (error) {
    console.error("Gemini Scan Error:", error);
    return null;
  }
}
