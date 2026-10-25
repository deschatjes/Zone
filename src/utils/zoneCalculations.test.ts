import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemBlocks,
  calculatePlateTotals,
  calculateShortage,
  generateSuggestions,
  calculateBlocksFromLabel,
  formatMealForExport,
} from './zoneCalculations';
import { PlateItem, MealTarget } from '../types/zone';

test('calculateItemBlocks returns accurate blocks for 1-block and 3-block portions', () => {
  // Chicken breast: 28g per block
  const chicken1Blk = calculateItemBlocks(28, 28, 'protein');
  assert.equal(chicken1Blk.proteinBlocks, 1.0);

  const chicken3Blk = calculateItemBlocks(84, 28, 'protein');
  assert.equal(chicken3Blk.proteinBlocks, 3.0);

  // Blueberries: 75g per block
  const blueberries1Blk = calculateItemBlocks(75, 75, 'carb');
  assert.equal(blueberries1Blk.carbBlocks, 1.0);

  // Olive oil: 1.5g per block (classic animal protein meal)
  const oil1Blk = calculateItemBlocks(1.5, 1.5, 'fat', false);
  assert.equal(oil1Blk.fatBlocks, 1.0);

  // Olive oil in vegetarian mode: 3.0g per block
  const oilVeg = calculateItemBlocks(3.0, 1.5, 'fat', true);
  assert.equal(oilVeg.fatBlocks, 1.0);
});

test('calculatePlateTotals sums macros and blocks accurately', () => {
  const items: PlateItem[] = [
    {
      id: '1',
      foodId: 'chicken-breast-skinless',
      name: 'Chicken breast, skinless',
      category: 'meat_poultry',
      primaryMacro: 'protein',
      grams: 84,
      gramsPerBlock: 28,
      quality: 'BEST',
      proteinBlocks: 3.0,
      carbBlocks: 0,
      fatBlocks: 0,
    },
    {
      id: '2',
      foodId: 'blueberries',
      name: 'Blueberries',
      category: 'fruits',
      primaryMacro: 'carb',
      grams: 150,
      gramsPerBlock: 75,
      quality: 'BEST',
      proteinBlocks: 0,
      carbBlocks: 2.0,
      fatBlocks: 0,
    },
    {
      id: '3',
      foodId: 'apple',
      name: 'Apple',
      category: 'fruits',
      primaryMacro: 'carb',
      grams: 90,
      gramsPerBlock: 90,
      quality: 'BEST',
      proteinBlocks: 0,
      carbBlocks: 1.0,
      fatBlocks: 0,
    },
    {
      id: '4',
      foodId: 'olive-oil',
      name: 'Extra virgin olive oil',
      category: 'fats',
      primaryMacro: 'fat',
      grams: 4.5,
      gramsPerBlock: 1.5,
      quality: 'BEST',
      proteinBlocks: 0,
      carbBlocks: 0,
      fatBlocks: 3.0,
    },
  ];

  const totals = calculatePlateTotals(items);
  assert.equal(totals.proteinBlocks, 3.0);
  assert.equal(totals.carbBlocks, 3.0);
  assert.equal(totals.fatBlocks, 3.0);
  assert.equal(totals.proteinGrams, 21);
  assert.equal(totals.carbGrams, 27);
  assert.equal(totals.fatGrams, 4.5);
});

test('calculateShortage flags shortage and detects 1:1:1 balance', () => {
  const target: MealTarget = {
    name: '3-Block Meal',
    proteinBlocks: 3,
    carbBlocks: 3,
    fatBlocks: 3,
    isVegetarianProtein: false,
  };

  const totalsShort = {
    proteinBlocks: 2.0,
    carbBlocks: 1.5,
    fatBlocks: 1.0,
    proteinGrams: 14,
    carbGrams: 13.5,
    fatGrams: 1.5,
  };

  const shortage = calculateShortage(totalsShort, target);
  assert.equal(shortage.proteinShortage, 1.0);
  assert.equal(shortage.carbShortage, 1.5);
  assert.equal(shortage.fatShortage, 2.0);
  assert.equal(shortage.isBalanced, false);
  assert.equal(shortage.isPerfect, false);

  const totalsPerfect = {
    proteinBlocks: 3.0,
    carbBlocks: 3.0,
    fatBlocks: 3.0,
    proteinGrams: 21,
    carbGrams: 27,
    fatGrams: 4.5,
  };
  const shortagePerfect = calculateShortage(totalsPerfect, target);
  assert.equal(shortagePerfect.isPerfect, true);
  assert.equal(shortagePerfect.isBalanced, true);
});

test('generateSuggestions calculates exact grams to complete blocks', () => {
  const target: MealTarget = {
    name: '3-Block Meal',
    proteinBlocks: 3,
    carbBlocks: 3,
    fatBlocks: 3,
    isVegetarianProtein: false,
  };

  // Plate has 56g chicken (2.0 P blocks), 75g blueberries (1.0 C block), no fats
  const items: PlateItem[] = [
    {
      id: 'item-1',
      foodId: 'chicken-breast-skinless',
      name: 'Chicken breast, skinless',
      category: 'meat_poultry',
      primaryMacro: 'protein',
      grams: 56,
      gramsPerBlock: 28,
      quality: 'BEST',
      proteinBlocks: 2.0,
      carbBlocks: 0,
      fatBlocks: 0,
    },
    {
      id: 'item-2',
      foodId: 'blueberries',
      name: 'Blueberries',
      category: 'fruits',
      primaryMacro: 'carb',
      grams: 75,
      gramsPerBlock: 75,
      quality: 'BEST',
      proteinBlocks: 0,
      carbBlocks: 1.0,
      fatBlocks: 0,
    },
  ];

  const totals = calculatePlateTotals(items);
  const shortage = calculateShortage(totals, target);
  assert.equal(shortage.proteinShortage, 1.0);
  assert.equal(shortage.carbShortage, 2.0);
  assert.equal(shortage.fatShortage, 3.0);

  const { currentFoodSuggestions, alternativeFoodSuggestions } = generateSuggestions(
    items,
    shortage,
    target
  );

  // Current food suggestions:
  // For chicken (28g/blk), shortage 1.0 blk -> add 28g to reach 84g
  const chickenSuggestion = currentFoodSuggestions.find(
    (s) => s.foodId === 'chicken-breast-skinless'
  );
  assert.ok(chickenSuggestion);
  assert.equal(chickenSuggestion.suggestedGramsToAdd, 28);
  assert.equal(chickenSuggestion.suggestedTotalGrams, 84);

  // For blueberries (75g/blk), shortage 2.0 blk -> add 150g to reach 225g
  const berrySuggestion = currentFoodSuggestions.find(
    (s) => s.foodId === 'blueberries'
  );
  assert.ok(berrySuggestion);
  assert.equal(berrySuggestion.suggestedGramsToAdd, 150);
  assert.equal(berrySuggestion.suggestedTotalGrams, 225);

  // Alternative suggestions for Fat (since no fat currently on plate):
  const oliveOilAlt = alternativeFoodSuggestions.find(
    (s) => s.foodId === 'olive-oil'
  );
  assert.ok(oliveOilAlt);
  // Olive oil is 1.5g per block; 3 blocks missing -> 4.5g
  assert.equal(oliveOilAlt.suggestedGramsToAdd, 4.5);
});

test('calculateBlocksFromLabel works correctly with fiber deduction', () => {
  // A bar with 14g protein, 22g carb, 4g fiber (18g net carb), 3g fat
  const res = calculateBlocksFromLabel(14, 22, 4, 3, false);
  assert.equal(res.proteinBlocks, 2.0); // 14 / 7
  assert.equal(res.carbBlocks, 2.0); // (22 - 4) / 9 = 18 / 9
  assert.equal(res.fatBlocks, 2.0); // 3 / 1.5
});

test('formatMealForExport produces clean readable text for iPhone copy/share', () => {
  const target: MealTarget = {
    name: '3-Block Meal',
    proteinBlocks: 3,
    carbBlocks: 3,
    fatBlocks: 3,
    isVegetarianProtein: false,
  };
  const items: PlateItem[] = [
    {
      id: '1',
      foodId: 'chicken-breast-skinless',
      name: 'Chicken breast, skinless',
      category: 'meat_poultry',
      primaryMacro: 'protein',
      grams: 84,
      gramsPerBlock: 28,
      quality: 'BEST',
      proteinBlocks: 3.0,
      carbBlocks: 0,
      fatBlocks: 0,
    },
  ];
  const totals = calculatePlateTotals(items);
  const text = formatMealForExport(target, items, totals);
  assert.ok(text.includes('ZONE DIET PLATE: 3-BLOCK MEAL'));
  assert.ok(text.includes('Chicken breast, skinless: 84g (3P)'));
});
