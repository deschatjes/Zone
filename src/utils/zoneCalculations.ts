import { BlockShortage, BlockTotals, FoodQuality, FoodSuggestion, MealTarget, PlateItem, ZoneFood } from '../types/zone';
import { ZONE_FOODS } from '../data/zoneFoods';

/**
 * Round number to specified decimal places
 */
export function round(value: number, decimals = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calculates blocks for a single food item entry
 */
export function calculateItemBlocks(
  grams: number,
  gramsPerBlock: number,
  primaryMacro: 'protein' | 'carb' | 'fat',
  isVegetarianProtein = false,
  foodId?: string
): { proteinBlocks: number; carbBlocks: number; fatBlocks: number } {
  if (grams <= 0 || gramsPerBlock <= 0) {
    return { proteinBlocks: 0, carbBlocks: 0, fatBlocks: 0 };
  }

  // Handle vegetarian fat block adjustment (1 fat block = 3g instead of 1.5g)
  let effectiveGramsPerBlock = gramsPerBlock;
  if (primaryMacro === 'fat' && isVegetarianProtein) {
    // If base table is 1.5g (olive oil) -> in vegetarian it's 3.0g
    // Scale by 2
    effectiveGramsPerBlock = gramsPerBlock * 2;
  }

  const baseBlocks = grams / effectiveGramsPerBlock;

  // Specific mixed food adjustments according to Zone / HYC guide
  if (foodId === 'whole-egg') {
    // 1 egg (~50g) = 1 P block + ~5g fat (~3.3 F blocks in classic 1.5g, or ~1.67 in veg)
    const eggCount = grams / 50;
    const fatPerEgg = isVegetarianProtein ? 5 / 3.0 : 5 / 1.5;
    return {
      proteinBlocks: round(eggCount, 2),
      carbBlocks: 0,
      fatBlocks: round(eggCount * fatPerEgg, 2),
    };
  }

  if (foodId === 'salmon') {
    // Salmon contains ~2.5g fat per 43g (1 P block)
    const pBlocks = grams / 43;
    const fatBlocks = isVegetarianProtein ? (pBlocks * 2.5) / 3.0 : (pBlocks * 2.5) / 1.5;
    return {
      proteinBlocks: round(pBlocks, 2),
      carbBlocks: 0,
      fatBlocks: round(fatBlocks, 2),
    };
  }

  if (foodId === 'feta') {
    // Feta ~50g = 1 P block + ~10g fat
    const pBlocks = grams / 50;
    const fatBlocks = isVegetarianProtein ? (pBlocks * 10) / 3.0 : (pBlocks * 10) / 1.5;
    return {
      proteinBlocks: round(pBlocks, 2),
      carbBlocks: 0,
      fatBlocks: round(fatBlocks, 2),
    };
  }

  if (foodId === 'greek-yogurt-nonfat') {
    // 69g = 1 P block + ~2.5g carbs (~0.28 C block)
    const pBlocks = grams / 69;
    return {
      proteinBlocks: round(pBlocks, 2),
      carbBlocks: round((pBlocks * 2.5) / 9, 2),
      fatBlocks: 0,
    };
  }

  if (foodId === 'edamame-boiled') {
    // 55g = 1 P block + ~0.4 C block
    const pBlocks = grams / 55;
    return {
      proteinBlocks: round(pBlocks, 2),
      carbBlocks: round(pBlocks * 0.4, 2),
      fatBlocks: 0,
    };
  }

  return {
    proteinBlocks: primaryMacro === 'protein' ? round(baseBlocks, 2) : 0,
    carbBlocks: primaryMacro === 'carb' ? round(baseBlocks, 2) : 0,
    fatBlocks: primaryMacro === 'fat' ? round(baseBlocks, 2) : 0,
  };
}

/**
 * Calculates plate totals across all added foods
 */
export function calculatePlateTotals(items: PlateItem[]): BlockTotals {
  let pBlocks = 0;
  let cBlocks = 0;
  let fBlocks = 0;

  for (const item of items) {
    pBlocks += item.proteinBlocks;
    cBlocks += item.carbBlocks;
    fBlocks += item.fatBlocks;
  }

  return {
    proteinBlocks: round(pBlocks, 1),
    carbBlocks: round(cBlocks, 1),
    fatBlocks: round(fBlocks, 1),
    proteinGrams: round(pBlocks * 7, 0),
    carbGrams: round(cBlocks * 9, 0),
    fatGrams: round(fBlocks * 1.5, 1),
  };
}

/**
 * Calculates block shortage relative to the selected meal target
 */
export function calculateShortage(totals: BlockTotals, target: MealTarget): BlockShortage {
  const pShort = round(target.proteinBlocks - totals.proteinBlocks, 1);
  const cShort = round(target.carbBlocks - totals.carbBlocks, 1);
  const fShort = round(target.fatBlocks - totals.fatBlocks, 1);

  // Balanced if all three macros are within 0.2 blocks of target
  const isBalanced =
    Math.abs(pShort) <= 0.2 && Math.abs(cShort) <= 0.2 && Math.abs(fShort) <= 0.2;

  // Perfect if all within 0.05 blocks
  const isPerfect =
    Math.abs(pShort) <= 0.05 && Math.abs(cShort) <= 0.05 && Math.abs(fShort) <= 0.05;

  return {
    proteinShortage: pShort,
    carbShortage: cShort,
    fatShortage: fShort,
    isBalanced,
    isPerfect,
  };
}

/**
 * Generate suggestions to complete any deficient blocks
 */
export function generateSuggestions(
  items: PlateItem[],
  shortage: BlockShortage,
  target: MealTarget
): {
  currentFoodSuggestions: FoodSuggestion[];
  alternativeFoodSuggestions: FoodSuggestion[];
} {
  const currentFoodSuggestions: FoodSuggestion[] = [];
  const alternativeFoodSuggestions: FoodSuggestion[] = [];

  const deficits: Array<{ macro: 'protein' | 'carb' | 'fat'; amount: number }> = [
    { macro: 'protein', amount: shortage.proteinShortage },
    { macro: 'carb', amount: shortage.carbShortage },
    { macro: 'fat', amount: shortage.fatShortage },
  ];

  for (const deficit of deficits) {
    if (deficit.amount <= 0.1) continue; // Not meaningfully short

    const missingBlocks = deficit.amount;

    // 1. Current foods on plate matching this macro
    const matchingCurrent = items.filter(
      (item) => item.primaryMacro === deficit.macro
    );

    for (const curItem of matchingCurrent) {
      let gPerBlock = curItem.gramsPerBlock;
      if (deficit.macro === 'fat' && target.isVegetarianProtein) {
        gPerBlock = gPerBlock * 2;
      }

      let gramsToAdd: number;
      if (deficit.macro === 'fat' && gPerBlock <= 2.5) {
        gramsToAdd = round(missingBlocks * gPerBlock, 1);
      } else {
        gramsToAdd = Math.max(1, Math.round(missingBlocks * gPerBlock));
      }
      const newTotal = round(curItem.grams + gramsToAdd, 1);

      currentFoodSuggestions.push({
        foodId: curItem.foodId,
        foodName: curItem.name,
        macro: deficit.macro,
        currentGrams: curItem.grams,
        suggestedGramsToAdd: gramsToAdd,
        suggestedTotalGrams: newTotal,
        blocksProvided: missingBlocks,
        quality: curItem.quality,
        isCurrentFood: true,
        explanation: `Add +${gramsToAdd}g of ${curItem.name} (to reach ${newTotal}g) to finish the ${deficit.macro} target.`,
      });
    }

    // 2. Alternative curated BEST foods from the Zone/HYC database
    const candidates = ZONE_FOODS.filter(
      (f) =>
        f.primaryMacro === deficit.macro &&
        (f.quality === 'BEST' || f.quality === 'EXTRA') &&
        !items.some((it) => it.foodId === f.id)
    );

    // Pick top 4-5 well-rounded suggestions per macro
    const preferredIdsByMacro: Record<'protein' | 'carb' | 'fat', string[]> = {
      protein: [
        'chicken-breast-skinless',
        'cod',
        'egg-whites',
        'greek-yogurt-nonfat',
        'tuna-canned-water',
        'salmon',
      ],
      carb: [
        'blueberries',
        'apple',
        'quinoa-cooked',
        'potato-boiled-baby',
        'broccoli-cooked',
        'raspberries',
      ],
      fat: [
        'olive-oil',
        'almonds',
        'avocado',
        'natural-peanut-butter',
        'pumpkin-seeds',
      ],
    };

    const targetList = candidates.sort((a, b) => {
      const aRank = preferredIdsByMacro[deficit.macro].indexOf(a.id);
      const bRank = preferredIdsByMacro[deficit.macro].indexOf(b.id);
      if (aRank !== -1 && bRank !== -1) return aRank - bRank;
      if (aRank !== -1) return -1;
      if (bRank !== -1) return 1;
      return 0;
    }).slice(0, 5);

    for (const food of targetList) {
      let gPerBlock = food.gramsPerBlock;
      if (deficit.macro === 'fat' && target.isVegetarianProtein) {
        gPerBlock = gPerBlock * 2;
      }

      let gramsToAdd: number;
      if (deficit.macro === 'fat' && gPerBlock <= 2.5) {
        gramsToAdd = round(missingBlocks * gPerBlock, 1);
      } else {
        gramsToAdd = Math.max(1, Math.round(missingBlocks * gPerBlock));
      }

      alternativeFoodSuggestions.push({
        foodId: food.id,
        foodName: food.name,
        macro: deficit.macro,
        suggestedGramsToAdd: gramsToAdd,
        suggestedTotalGrams: gramsToAdd,
        blocksProvided: missingBlocks,
        quality: food.quality,
        isCurrentFood: false,
        explanation: `Add ${gramsToAdd}g of ${food.name} to fulfill ${missingBlocks} missing ${deficit.macro} blocks.`,
      });
    }
  }

  return {
    currentFoodSuggestions,
    alternativeFoodSuggestions,
  };
}

/**
 * Calculates blocks from standard packaged nutrition label
 */
export function calculateBlocksFromLabel(
  proteinGrams: number,
  totalCarbGrams: number,
  fiberGrams: number,
  fatGrams: number,
  isVegetarian = false
): { proteinBlocks: number; carbBlocks: number; fatBlocks: number } {
  const p = Math.max(0, proteinGrams) / 7;
  const netCarbs = Math.max(0, totalCarbGrams - Math.max(0, fiberGrams));
  const c = netCarbs / 9;
  const fatDivisor = isVegetarian ? 3.0 : 1.5;
  const f = Math.max(0, fatGrams) / fatDivisor;

  return {
    proteinBlocks: round(p, 2),
    carbBlocks: round(c, 2),
    fatBlocks: round(f, 2),
  };
}

/**
 * Generates formatted text export for Apple Notes / Messages / AirDrop
 */
export function formatMealForExport(
  target: MealTarget,
  items: PlateItem[],
  totals: BlockTotals
): string {
  const lines: string[] = [];
  lines.push(`⚖️ ZONE DIET PLATE: ${target.name.toUpperCase()}`);
  lines.push(`Target: ${target.proteinBlocks}P • ${target.carbBlocks}C • ${target.fatBlocks}F`);
  lines.push(`Total Blocks: ${totals.proteinBlocks}P • ${totals.carbBlocks}C • ${totals.fatBlocks}F`);
  lines.push(`Macros: ${totals.proteinGrams}g Protein • ${totals.carbGrams}g Net Carbs • ${totals.fatGrams}g Fat`);
  lines.push('----------------------------------------');

  if (items.length === 0) {
    lines.push('(Plate is empty)');
  } else {
    lines.push('WEIGHED ITEMS (IN GRAMS):');
    for (const item of items) {
      const macroTag =
        item.primaryMacro === 'protein'
          ? `${item.proteinBlocks}P`
          : item.primaryMacro === 'carb'
          ? `${item.carbBlocks}C`
          : `${item.fatBlocks}F`;
      lines.push(`• ${item.name}: ${item.grams}g (${macroTag})`);
    }
  }

  lines.push('----------------------------------------');
  const pDiff = round(totals.proteinBlocks - target.proteinBlocks, 1);
  const cDiff = round(totals.carbBlocks - target.carbBlocks, 1);
  const fDiff = round(totals.fatBlocks - target.fatBlocks, 1);

  if (Math.abs(pDiff) <= 0.1 && Math.abs(cDiff) <= 0.1 && Math.abs(fDiff) <= 0.1) {
    lines.push('✅ STATUS: PERFECT 1:1:1 ZONE BALANCE ACHIEVED');
  } else {
    lines.push(
      `STATUS: ${pDiff >= 0 ? `+${pDiff}` : pDiff}P, ${cDiff >= 0 ? `+${cDiff}` : cDiff}C, ${fDiff >= 0 ? `+${fDiff}` : fDiff}F`
    );
  }
  lines.push(`Generated with Zone Block Gram Calculator`);

  return lines.join('\n');
}
