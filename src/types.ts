export type Freshness = 'Aman' | 'Segera dipakai' | 'Hampir kedaluwarsa';

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  freshness: Freshness;
}

export interface NutritionInfo {
  servings: number;
  caloriesKcal: number;
  proteinGrams: number;
  carbohydrateGrams: number;
  fatGrams: number;
  fiberGrams: number;
  sodiumMg?: number;
  nutritionLabel: string;
  nutritionNote: string;
  balancedMealSuggestion: string;
  disclaimer: string;
}

export interface ShoppingItem {
  name: string;
  estimatedPriceIdr: number;
}

export interface Recipe {
  name: string;
  antiWasteScore: number;
  scoreLabel: string;
  estimatedSavingsIdr: number;
  cookingTime: string;
  difficulty: string;
  budgetFit: string;
  toolsNeeded: string[];
  whyThisRecipe: string;
  ingredientsUsed: string[];
  optionalIngredients: string[];
  steps: string[];
  antiWasteNote: string;
  nutrition: NutritionInfo;
  shoppingList: {
    availableIngredients: string[];
    optionalToBuy: ShoppingItem[];
    totalAdditionalCostIdr: number;
    shoppingNote: string;
  };
}

export interface AISummary {
  totalIngredientsUsed: number;
  estimatedSavingsIdr: number;
  weeklySavingsIdr: number;
  monthlySavingsIdr: number;
  wastePrevented: string;
  bestRecommendation: string;
  urgentIngredientsSaved: string[];
}

export interface AIResponse {
  summary: AISummary;
  recipes: Recipe[];
  isDemo?: boolean;
}

export interface SavingsHistory {
  id: string;
  date: string;
  recipeName: string;
  antiWasteScore: number;
  savingsIdr: number;
  weeklySavingsIdr: number;
  monthlySavingsIdr: number;
  ingredientsUsed: number;
  nutritionLabel: string;
}
