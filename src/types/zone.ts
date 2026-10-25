export type MacroType = 'protein' | 'carb' | 'fat' | 'mixed';

export type FoodCategory =
  | 'meat_poultry'
  | 'fish_seafood'
  | 'egg_dairy_plant'
  | 'raw_vegetables'
  | 'cooked_vegetables'
  | 'fruits'
  | 'grains_starches'
  | 'fats'
  | 'custom';

export type FoodQuality = 'BEST' | 'FAIR' | 'POOR' | 'EXTRA' | 'MIXED';

export interface ZoneFood {
  id: string;
  name: string;
  category: FoodCategory;
  primaryMacro: 'protein' | 'carb' | 'fat';
  gramsPerBlock: number; // grams for 1 block
  gramsPerThreeBlocks?: number; // grams for 3 blocks
  quality: FoodQuality;
  notes?: string;
  householdUnit?: string; // e.g. "1 oz", "1/2 cup", "1 large"
  secondaryMacros?: {
    proteinBlocksPer100g?: number;
    carbBlocksPer100g?: number;
    fatBlocksPer100g?: number;
  };
}

export interface PlateItem {
  id: string; // unique plate entry id
  foodId: string;
  name: string;
  category: FoodCategory;
  primaryMacro: 'protein' | 'carb' | 'fat';
  grams: number;
  gramsPerBlock: number;
  quality: FoodQuality;
  notes?: string;
  // Computed blocks for this item
  proteinBlocks: number;
  carbBlocks: number;
  fatBlocks: number;
}

export interface MealTarget {
  name: string;
  proteinBlocks: number;
  carbBlocks: number;
  fatBlocks: number;
  isVegetarianProtein: boolean; // if true, 1 fat block is 3.0g instead of 1.5g
}

export interface BlockTotals {
  proteinBlocks: number;
  carbBlocks: number;
  fatBlocks: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
}

export interface BlockShortage {
  proteinShortage: number; // >0 means missing blocks, <0 means surplus
  carbShortage: number;
  fatShortage: number;
  isBalanced: boolean;
  isPerfect: boolean;
}

export interface FoodSuggestion {
  foodId: string;
  foodName: string;
  macro: 'protein' | 'carb' | 'fat';
  currentGrams?: number;
  suggestedGramsToAdd: number;
  suggestedTotalGrams: number;
  blocksProvided: number;
  quality: FoodQuality;
  isCurrentFood: boolean;
  explanation: string;
}

export interface SavedMeal {
  id: string;
  name: string;
  createdAt: string;
  target: MealTarget;
  items: Array<{
    foodId: string;
    name: string;
    grams: number;
    category: FoodCategory;
    primaryMacro: 'protein' | 'carb' | 'fat';
    gramsPerBlock: number;
    quality: FoodQuality;
  }>;
}
