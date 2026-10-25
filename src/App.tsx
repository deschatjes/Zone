/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MealTarget, PlateItem, ZoneFood } from './types/zone';
import { ZONE_FOODS } from './data/zoneFoods';
import {
  calculateItemBlocks,
  calculatePlateTotals,
  calculateShortage,
  generateSuggestions,
  round,
} from './utils/zoneCalculations';
import { Header } from './components/Header';
import { ZoneGaugeCard } from './components/ZoneGaugeCard';
import { CurrentPlateCard } from './components/CurrentPlateCard';
import { AutoSuggesterCard } from './components/AutoSuggesterCard';
import { FoodSearchModal } from './components/FoodSearchModal';
import { CustomFoodModal } from './components/CustomFoodModal';
import { IPhoneExportModal } from './components/IPhoneExportModal';
import { InstallAppModal } from './components/InstallAppModal';
import { QuickReferenceModal } from './components/QuickReferenceModal';
import { SavedMealsModal, OFFICIAL_TEMPLATES } from './components/SavedMealsModal';
import { CustomTargetModal } from './components/CustomTargetModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import { Download, Smartphone, Sparkles, Scale, Info } from 'lucide-react';

export default function App() {
  const { isIOS, isInstallable, install, isInstalled, markAsInstalled } = usePWAInstall();

  // Selected meal target (default to standard 3-Block Meal: 3P, 3C, 3F)
  const [target, setTarget] = useState<MealTarget>({
    name: '3-Block Meal',
    proteinBlocks: 3,
    carbBlocks: 3,
    fatBlocks: 3,
    isVegetarianProtein: false,
  });

  // Plate items (starts empty)
  const [items, setItems] = useState<PlateItem[]>([]);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCustomLabelOpen, setIsCustomLabelOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isInstallAppOpen, setIsInstallAppOpen] = useState(false);
  const [isQuickRefOpen, setIsQuickRefOpen] = useState(false);
  const [isSavedMealsOpen, setIsSavedMealsOpen] = useState(false);
  const [isCustomTargetOpen, setIsCustomTargetOpen] = useState(false);

  // Totals & Shortage Calculations
  const totals = useMemo(() => calculatePlateTotals(items), [items]);
  const shortage = useMemo(() => calculateShortage(totals, target), [totals, target]);
  const { currentFoodSuggestions, alternativeFoodSuggestions } = useMemo(
    () => generateSuggestions(items, shortage, target),
    [items, shortage, target]
  );

  // Target selection handler
  const handleSelectTarget = (
    preset: 'snack' | 'light' | 'meal' | 'male' | 'custom',
    customBlocks?: number
  ) => {
    if (preset === 'snack') {
      setTarget((prev) => ({
        name: '1-Block Snack',
        proteinBlocks: 1,
        carbBlocks: 1,
        fatBlocks: 1,
        isVegetarianProtein: prev.isVegetarianProtein,
      }));
    } else if (preset === 'light') {
      setTarget((prev) => ({
        name: '2-Block Light',
        proteinBlocks: 2,
        carbBlocks: 2,
        fatBlocks: 2,
        isVegetarianProtein: prev.isVegetarianProtein,
      }));
    } else if (preset === 'meal') {
      setTarget((prev) => ({
        name: '3-Block Meal',
        proteinBlocks: 3,
        carbBlocks: 3,
        fatBlocks: 3,
        isVegetarianProtein: prev.isVegetarianProtein,
      }));
    } else if (preset === 'male') {
      setTarget((prev) => ({
        name: '4-Block Male Meal',
        proteinBlocks: 4,
        carbBlocks: 4,
        fatBlocks: 4,
        isVegetarianProtein: prev.isVegetarianProtein,
      }));
    } else if (preset === 'custom' && customBlocks) {
      setTarget((prev) => ({
        name: `${customBlocks}-Block Custom`,
        proteinBlocks: customBlocks,
        carbBlocks: customBlocks,
        fatBlocks: customBlocks,
        isVegetarianProtein: prev.isVegetarianProtein,
      }));
    }
  };

  const handleToggleVegetarian = () => {
    setTarget((prev) => {
      const nextVeg = !prev.isVegetarianProtein;
      // Recalculate fat blocks for existing plate items
      setItems((currentItems) =>
        currentItems.map((item) => {
          const blocks = calculateItemBlocks(
            item.grams,
            item.gramsPerBlock,
            item.primaryMacro,
            nextVeg,
            item.foodId
          );
          return {
            ...item,
            ...blocks,
          };
        })
      );
      return {
        ...prev,
        isVegetarianProtein: nextVeg,
      };
    });
  };

  // Gram update handler
  const handleUpdateGrams = (id: string, newGrams: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const blocks = calculateItemBlocks(
          newGrams,
          item.gramsPerBlock,
          item.primaryMacro,
          target.isVegetarianProtein,
          item.foodId
        );
        return {
          ...item,
          grams: newGrams,
          ...blocks,
        };
      })
    );
  };

  // Remove item handler
  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Add food from search or quick ref
  const handleAddFood = (food: ZoneFood, grams: number) => {
    const blocks = calculateItemBlocks(
      grams,
      food.gramsPerBlock,
      food.primaryMacro,
      target.isVegetarianProtein,
      food.id
    );

    // If already exists on plate, increase grams
    const existingIndex = items.findIndex((i) => i.foodId === food.id);
    if (existingIndex !== -1) {
      const updatedGrams = items[existingIndex].grams + grams;
      handleUpdateGrams(items[existingIndex].id, updatedGrams);
      return;
    }

    const newItem: PlateItem = {
      id: `plate-${food.id}-${Date.now()}`,
      foodId: food.id,
      name: food.name,
      category: food.category,
      primaryMacro: food.primaryMacro,
      grams,
      gramsPerBlock: food.gramsPerBlock,
      quality: food.quality,
      notes: food.notes,
      ...blocks,
    };

    setItems((prev) => [...prev, newItem]);
  };

  // Add custom label item
  const handleAddCustomPlateItem = (item: PlateItem) => {
    setItems((prev) => [...prev, item]);
  };

  // Apply auto-complete suggestion to existing food
  const handleApplyCurrentFoodGrams = (foodId: string, newTotalGrams: number) => {
    const found = items.find((i) => i.foodId === foodId);
    if (found) {
      handleUpdateGrams(found.id, newTotalGrams);
    }
  };

  // Add alternative food to complete block
  const handleAddAlternativeFood = (foodId: string, grams: number) => {
    const found = ZONE_FOODS.find((f) => f.id === foodId);
    if (found) {
      handleAddFood(found, grams);
    }
  };

  // 1-Click Auto-Balance Plate
  const handleAutoBalanceMeal = () => {
    let currentItems = [...items];

    // 1. Protein shortfall
    if (shortage.proteinShortage > 0.05) {
      const curP = currentItems.find((i) => i.primaryMacro === 'protein');
      if (curP) {
        const extraG = Math.max(1, Math.round(shortage.proteinShortage * curP.gramsPerBlock));
        const newG = curP.grams + extraG;
        const blocks = calculateItemBlocks(newG, curP.gramsPerBlock, 'protein', target.isVegetarianProtein, curP.foodId);
        currentItems = currentItems.map((i) => (i.id === curP.id ? { ...i, grams: newG, ...blocks } : i));
      } else {
        const chicken = ZONE_FOODS.find((f) => f.id === 'chicken-breast-skinless')!;
        const g = Math.max(1, Math.round(shortage.proteinShortage * chicken.gramsPerBlock));
        const blocks = calculateItemBlocks(g, chicken.gramsPerBlock, 'protein', target.isVegetarianProtein);
        currentItems.push({
          id: `plate-chicken-${Date.now()}`,
          foodId: chicken.id,
          name: chicken.name,
          category: chicken.category,
          primaryMacro: chicken.primaryMacro,
          grams: g,
          gramsPerBlock: chicken.gramsPerBlock,
          quality: chicken.quality,
          ...blocks,
        });
      }
    }

    // 2. Carb shortfall
    if (shortage.carbShortage > 0.05) {
      const curC = currentItems.find((i) => i.primaryMacro === 'carb');
      if (curC) {
        const extraG = Math.max(1, Math.round(shortage.carbShortage * curC.gramsPerBlock));
        const newG = curC.grams + extraG;
        const blocks = calculateItemBlocks(newG, curC.gramsPerBlock, 'carb', target.isVegetarianProtein, curC.foodId);
        currentItems = currentItems.map((i) => (i.id === curC.id ? { ...i, grams: newG, ...blocks } : i));
      } else {
        const blueberries = ZONE_FOODS.find((f) => f.id === 'blueberries')!;
        const g = Math.max(1, Math.round(shortage.carbShortage * blueberries.gramsPerBlock));
        const blocks = calculateItemBlocks(g, blueberries.gramsPerBlock, 'carb', target.isVegetarianProtein);
        currentItems.push({
          id: `plate-blueberries-${Date.now()}`,
          foodId: blueberries.id,
          name: blueberries.name,
          category: blueberries.category,
          primaryMacro: blueberries.primaryMacro,
          grams: g,
          gramsPerBlock: blueberries.gramsPerBlock,
          quality: blueberries.quality,
          ...blocks,
        });
      }
    }

    // 3. Fat shortfall
    if (shortage.fatShortage > 0.05) {
      const curF = currentItems.find((i) => i.primaryMacro === 'fat');
      const effectiveGPerBlock = target.isVegetarianProtein ? 3 : 1.5;
      if (curF) {
        let gPerBlock = curF.gramsPerBlock;
        if (target.isVegetarianProtein) gPerBlock *= 2;
        const extraG = Math.max(0.5, round(shortage.fatShortage * gPerBlock, 1));
        const newG = round(curF.grams + extraG, 1);
        const blocks = calculateItemBlocks(newG, curF.gramsPerBlock, 'fat', target.isVegetarianProtein, curF.foodId);
        currentItems = currentItems.map((i) => (i.id === curF.id ? { ...i, grams: newG, ...blocks } : i));
      } else {
        const oil = ZONE_FOODS.find((f) => f.id === 'olive-oil')!;
        const g = Math.max(0.5, round(shortage.fatShortage * effectiveGPerBlock, 1));
        const blocks = calculateItemBlocks(g, oil.gramsPerBlock, 'fat', target.isVegetarianProtein);
        currentItems.push({
          id: `plate-oil-${Date.now()}`,
          foodId: oil.id,
          name: oil.name,
          category: oil.category,
          primaryMacro: oil.primaryMacro,
          grams: g,
          gramsPerBlock: oil.gramsPerBlock,
          quality: oil.quality,
          ...blocks,
        });
      }
    }

    setItems(currentItems);
  };

  // Load template
  const handleLoadTemplate = (templateName: string) => {
    let tpl: (typeof OFFICIAL_TEMPLATES)[0] | undefined;
    if (templateName === 'chicken-meal') {
      tpl = OFFICIAL_TEMPLATES.find((t) => t.id === 'tpl-3-block-chicken');
    } else if (templateName === 'yogurt-snack') {
      tpl = OFFICIAL_TEMPLATES.find((t) => t.id === 'tpl-1-block-yogurt');
    }
    if (tpl) {
      const mapped: PlateItem[] = tpl.items.map((it) => {
        const blocks = calculateItemBlocks(
          it.grams,
          it.gramsPerBlock,
          it.primaryMacro as any,
          tpl!.target.isVegetarianProtein,
          it.foodId
        );
        return {
          id: `plate-${it.foodId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          foodId: it.foodId,
          name: it.name,
          category: it.category as any,
          primaryMacro: it.primaryMacro as any,
          grams: it.grams,
          gramsPerBlock: it.gramsPerBlock,
          quality: it.quality as any,
          ...blocks,
        };
      });
      handleLoadMeal(mapped, tpl.target);
    }
  };

  const handleLoadMeal = (newItems: PlateItem[], newTarget: MealTarget) => {
    setTarget(newTarget);
    setItems(newItems);
  };

  const handleClearPlate = () => {
    setItems([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top navigation */}
      <Header
        target={target}
        onSelectTarget={handleSelectTarget}
        onToggleVegetarian={handleToggleVegetarian}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenInstallApp={() => setIsInstallAppOpen(true)}
        isInstalled={isInstalled}
        onOpenQuickRef={() => setIsQuickRefOpen(true)}
        onOpenSavedMeals={() => setIsSavedMealsOpen(true)}
        onClearPlate={handleClearPlate}
        itemCount={items.length}
        onOpenCustomTarget={() => setIsCustomTargetOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-5 space-y-5">
        {/* PWA Home Screen Banner for iPhone/Chromium users (hidden once installed) */}
        {!isInstalled && (
          <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/40 border border-red-500/30 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-red-900/40">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>Want this entire app on your iPhone?</span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Standalone
                  </span>
                </p>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                  Scan our QR code with your iPhone camera to install it directly to your Home Screen — works offline by your kitchen scale!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={markAsInstalled}
                title="I have already installed this app"
                className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 transition cursor-pointer"
              >
                Already installed?
              </button>
              <button
                onClick={() => setIsInstallAppOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-900/30 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <Smartphone className="w-4 h-4" />
                <span>📱 Get App on iPhone</span>
              </button>
            </div>
          </div>
        )}

        {/* 1. Current Food Scale Card (Top of screen) */}
        <CurrentPlateCard
          items={items}
          onUpdateGrams={handleUpdateGrams}
          onRemoveItem={handleRemoveItem}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCustomLabel={() => setIsCustomLabelOpen(true)}
          onLoadTemplate={handleLoadTemplate}
        />

        {/* 2. Plate Block Balance Gauge Card */}
        <ZoneGaugeCard totals={totals} target={target} shortage={shortage} itemCount={items.length} />

        {/* 3. Auto-Complete Block Suggestions Card (Shown when items are on the scale) */}
        {items.length > 0 && (
          <AutoSuggesterCard
            items={items}
            shortage={shortage}
            target={target}
            currentSuggestions={currentFoodSuggestions}
            alternativeSuggestions={alternativeFoodSuggestions}
            onApplyCurrentFoodGrams={handleApplyCurrentFoodGrams}
            onAddAlternativeFood={handleAddAlternativeFood}
            onAutoBalanceMeal={handleAutoBalanceMeal}
            onOpenExport={() => setIsExportOpen(true)}
          />
        )}

        {/* Educational Footer Note */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3.5 text-xs text-slate-400 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-300">
              Zone Diet Fundamentals (1:1:1 Block Ratio):
            </p>
            <p>
              <strong>1 Protein Block = 7g protein</strong> • <strong>1 Carb Block = 9g net carbs</strong> (total carb minus fiber) • <strong>1 Fat Block = 1.5g added fat</strong> (or 3g if vegetarian).
            </p>
            <p className="text-[11px] text-slate-500">
              Reference: Zone Living / Zone Labs &amp; The HYC Zone Ultimate Gram Guide 2026. Edible scale weights are specified in raw or cooked state as listed in the table.
            </p>
          </div>
        </div>
      </main>

      {/* Modals */}
      <FoodSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAddFood={handleAddFood}
        isVegetarianProtein={target.isVegetarianProtein}
      />

      <CustomFoodModal
        isOpen={isCustomLabelOpen}
        onClose={() => setIsCustomLabelOpen(false)}
        onAddCustomPlateItem={handleAddCustomPlateItem}
        isVegetarianProtein={target.isVegetarianProtein}
      />

      <IPhoneExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        target={target}
        items={items}
        totals={totals}
        onOpenInstallApp={() => setIsInstallAppOpen(true)}
        isInstalled={isInstalled}
      />

      <InstallAppModal
        isOpen={isInstallAppOpen}
        onClose={() => setIsInstallAppOpen(false)}
        onMarkAsInstalled={markAsInstalled}
      />

      <QuickReferenceModal
        isOpen={isQuickRefOpen}
        onClose={() => setIsQuickRefOpen(false)}
        onAddFood={handleAddFood}
        isVegetarianProtein={target.isVegetarianProtein}
      />

      <SavedMealsModal
        isOpen={isSavedMealsOpen}
        onClose={() => setIsSavedMealsOpen(false)}
        currentPlate={items}
        currentTarget={target}
        onLoadMeal={handleLoadMeal}
      />

      <CustomTargetModal
        isOpen={isCustomTargetOpen}
        onClose={() => setIsCustomTargetOpen(false)}
        currentTarget={target}
        onSaveTarget={(newTarget) => setTarget(newTarget)}
      />
    </div>
  );
}
