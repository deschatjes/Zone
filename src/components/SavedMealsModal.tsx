import React, { useState, useEffect } from 'react';
import { MealTarget, PlateItem, SavedMeal } from '../types/zone';
import { BookmarkCheck, X, Trash2, Plus, Sparkles, Utensils, Check } from 'lucide-react';

interface SavedMealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlate: PlateItem[];
  currentTarget: MealTarget;
  onLoadMeal: (items: PlateItem[], target: MealTarget) => void;
}

export const OFFICIAL_TEMPLATES = [
  {
    id: 'tpl-1-block-cottage',
    name: '1-Block Snack: Cottage Cheese + Kiwi',
    description: '60g cottage cheese + 75g kiwi + 3g pumpkin seeds (~1P / 1C / 1F)',
    target: { name: '1-Block Snack', proteinBlocks: 1, carbBlocks: 1, fatBlocks: 1, isVegetarianProtein: false },
    items: [
      { foodId: 'cottage-cheese-1-pct', name: 'Cottage cheese 1%', grams: 60, category: 'egg_dairy_plant', primaryMacro: 'protein', gramsPerBlock: 60, quality: 'BEST' },
      { foodId: 'kiwi', name: 'Kiwi', grams: 75, category: 'fruits', primaryMacro: 'carb', gramsPerBlock: 75, quality: 'BEST' },
      { foodId: 'pumpkin-seeds', name: 'Pumpkin seeds', grams: 3, category: 'fats', primaryMacro: 'fat', gramsPerBlock: 3, quality: 'EXTRA' },
    ],
  },
  {
    id: 'tpl-1-block-yogurt',
    name: '1-Block Snack: Greek Yogurt + Blueberries',
    description: '69g non-fat Greek yogurt + 75g blueberries + 3g sunflower seeds',
    target: { name: '1-Block Snack', proteinBlocks: 1, carbBlocks: 1, fatBlocks: 1, isVegetarianProtein: false },
    items: [
      { foodId: 'greek-yogurt-nonfat', name: 'Greek yogurt, non-fat plain', grams: 69, category: 'egg_dairy_plant', primaryMacro: 'protein', gramsPerBlock: 69, quality: 'BEST' },
      { foodId: 'blueberries', name: 'Blueberries', grams: 75, category: 'fruits', primaryMacro: 'carb', gramsPerBlock: 75, quality: 'BEST' },
      { foodId: 'sunflower-seeds', name: 'Sunflower seeds', grams: 3, category: 'fats', primaryMacro: 'fat', gramsPerBlock: 3, quality: 'EXTRA' },
    ],
  },
  {
    id: 'tpl-3-block-chicken',
    name: '3-Block Chicken & Quinoa Meal',
    description: '84g chicken breast + 147g cooked quinoa + 4.5g olive oil (~3P / 3C / 3F)',
    target: { name: '3-Block Meal', proteinBlocks: 3, carbBlocks: 3, fatBlocks: 3, isVegetarianProtein: false },
    items: [
      { foodId: 'chicken-breast-skinless', name: 'Chicken breast, skinless', grams: 84, category: 'meat_poultry', primaryMacro: 'protein', gramsPerBlock: 28, quality: 'BEST' },
      { foodId: 'quinoa-cooked', name: 'Quinoa, cooked', grams: 147, category: 'grains_starches', primaryMacro: 'carb', gramsPerBlock: 49, quality: 'EXTRA' },
      { foodId: 'olive-oil', name: 'Extra virgin olive oil', grams: 4.5, category: 'fats', primaryMacro: 'fat', gramsPerBlock: 1.5, quality: 'BEST' },
    ],
  },
  {
    id: 'tpl-3-block-cod',
    name: '3-Block Cod, Potato & Pear Meal',
    description: '129g cod + 100g baby potato (2C) + 74g pear (1C) + 4.5g olive oil (3F)',
    target: { name: '3-Block Meal', proteinBlocks: 3, carbBlocks: 3, fatBlocks: 3, isVegetarianProtein: false },
    items: [
      { foodId: 'cod', name: 'Cod', grams: 129, category: 'fish_seafood', primaryMacro: 'protein', gramsPerBlock: 43, quality: 'BEST' },
      { foodId: 'potato-boiled-baby', name: 'Potato, boiled / baby potatoes', grams: 100, category: 'cooked_vegetables', primaryMacro: 'carb', gramsPerBlock: 50, quality: 'FAIR' },
      { foodId: 'pear', name: 'Pear', grams: 74, category: 'fruits', primaryMacro: 'carb', gramsPerBlock: 74, quality: 'BEST' },
      { foodId: 'olive-oil', name: 'Extra virgin olive oil', grams: 4.5, category: 'fats', primaryMacro: 'fat', gramsPerBlock: 1.5, quality: 'BEST' },
    ],
  },
  {
    id: 'tpl-3-block-tuna',
    name: '3-Block Tuna & Rice Meal',
    description: '84g tuna + 120g cooked brown/red rice + 4.5g olive oil (~3P / 3C / 3F)',
    target: { name: '3-Block Meal', proteinBlocks: 3, carbBlocks: 3, fatBlocks: 3, isVegetarianProtein: false },
    items: [
      { foodId: 'tuna-steak', name: 'Tuna steak', grams: 84, category: 'fish_seafood', primaryMacro: 'protein', gramsPerBlock: 28, quality: 'BEST' },
      { foodId: 'brown-rice-cooked', name: 'Brown rice, cooked', grams: 120, category: 'grains_starches', primaryMacro: 'carb', gramsPerBlock: 40, quality: 'POOR' },
      { foodId: 'olive-oil', name: 'Extra virgin olive oil', grams: 4.5, category: 'fats', primaryMacro: 'fat', gramsPerBlock: 1.5, quality: 'BEST' },
    ],
  },
  {
    id: 'tpl-3-block-shake',
    name: '3-Block Protein Shake',
    description: '26.4g whey powder (21g P) + 120g banana (3C) + 10.8g almonds (3F)',
    target: { name: '3-Block Meal', proteinBlocks: 3, carbBlocks: 3, fatBlocks: 3, isVegetarianProtein: false },
    items: [
      { foodId: 'whey-protein-isolate', name: 'Whey / Protein powder (80% protein)', grams: 26.4, category: 'egg_dairy_plant', primaryMacro: 'protein', gramsPerBlock: 8.8, quality: 'BEST' },
      { foodId: 'banana', name: 'Banana', grams: 120, category: 'fruits', primaryMacro: 'carb', gramsPerBlock: 40, quality: 'POOR' },
      { foodId: 'almonds', name: 'Almonds (whole / slivered)', grams: 10.8, category: 'fats', primaryMacro: 'fat', gramsPerBlock: 3.6, quality: 'BEST' },
    ],
  },
];

export const SavedMealsModal: React.FC<SavedMealsModalProps> = ({
  isOpen,
  onClose,
  currentPlate,
  currentTarget,
  onLoadMeal,
}) => {
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [saveName, setSaveName] = useState('');
  const [activeTab, setActiveTab] = useState<'official' | 'custom'>('official');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('zone_saved_meals');
      if (stored) {
        setSavedMeals(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCurrent = () => {
    if (!saveName.trim() || currentPlate.length === 0) return;

    const newMeal: SavedMeal = {
      id: `meal-${Date.now()}`,
      name: saveName.trim(),
      createdAt: new Date().toLocaleDateString(),
      target: currentTarget,
      items: currentPlate.map((p) => ({
        foodId: p.foodId,
        name: p.name,
        grams: p.grams,
        category: p.category,
        primaryMacro: p.primaryMacro,
        gramsPerBlock: p.gramsPerBlock,
        quality: p.quality,
      })),
    };

    const updated = [newMeal, ...savedMeals];
    setSavedMeals(updated);
    try {
      localStorage.setItem('zone_saved_meals', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    setSaveName('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = savedMeals.filter((m) => m.id !== id);
    setSavedMeals(updated);
    try {
      localStorage.setItem('zone_saved_meals', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleSelectTemplate = (template: typeof OFFICIAL_TEMPLATES[0]) => {
    const loadedItems: PlateItem[] = template.items.map((it) => {
      const p = it.primaryMacro === 'protein' ? it.grams / it.gramsPerBlock : 0;
      const c = it.primaryMacro === 'carb' ? it.grams / it.gramsPerBlock : 0;
      const f = it.primaryMacro === 'fat' ? it.grams / it.gramsPerBlock : 0;
      return {
        id: `plate-${it.foodId}-${Date.now()}-${Math.random()}`,
        foodId: it.foodId,
        name: it.name,
        category: it.category as any,
        primaryMacro: it.primaryMacro as any,
        grams: it.grams,
        gramsPerBlock: it.gramsPerBlock,
        quality: it.quality as any,
        proteinBlocks: Math.round(p * 10) / 10,
        carbBlocks: Math.round(c * 10) / 10,
        fatBlocks: Math.round(f * 10) / 10,
      };
    });

    onLoadMeal(loadedItems, template.target);
    onClose();
  };

  const handleSelectCustomMeal = (meal: SavedMeal) => {
    const loadedItems: PlateItem[] = meal.items.map((it) => {
      const p = it.primaryMacro === 'protein' ? it.grams / it.gramsPerBlock : 0;
      const c = it.primaryMacro === 'carb' ? it.grams / it.gramsPerBlock : 0;
      const f = it.primaryMacro === 'fat' ? it.grams / it.gramsPerBlock : 0;
      return {
        id: `plate-${it.foodId}-${Date.now()}-${Math.random()}`,
        foodId: it.foodId,
        name: it.name,
        category: it.category,
        primaryMacro: it.primaryMacro,
        grams: it.grams,
        gramsPerBlock: it.gramsPerBlock,
        quality: it.quality,
        proteinBlocks: Math.round(p * 10) / 10,
        carbBlocks: Math.round(c * 10) / 10,
        fatBlocks: Math.round(f * 10) / 10,
      };
    });

    onLoadMeal(loadedItems, meal.target);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Saved Meals &amp; Guide Recipes
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-4 pt-3 border-b border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('official')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'official'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            HYC Guide Examples ({OFFICIAL_TEMPLATES.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'custom'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-red-400" />
            My Saved Meals ({savedMeals.length})
          </button>
        </div>

        {/* Save Current Plate bar */}
        {currentPlate.length > 0 && (
          <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Name current plate (e.g. My Favorite Chicken Meal)..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              onClick={handleSaveCurrent}
              disabled={!saveName.trim()}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Plate</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'official' ? (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-400 mb-2">
                Pre-loaded practical examples straight from page 12 of the HYC Zone Guide:
              </p>
              {OFFICIAL_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3 hover:border-amber-500/50 transition"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white">{tpl.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{tpl.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-slate-700">
                        {tpl.target.name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectTemplate(tpl)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow transition active:scale-95 cursor-pointer shrink-0"
                  >
                    Load Onto Plate
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedMeals.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <p>You haven't saved any custom meals yet.</p>
                  <p className="text-slate-500 mt-1">
                    Add foods to your plate and name it above to save for 1-tap recall!
                  </p>
                </div>
              ) : (
                savedMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3 hover:border-red-500/50 transition"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white truncate">{meal.name}</h3>
                        <span className="text-[10px] text-slate-500">{meal.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {meal.items.map((i) => `${i.name} (${i.grams}g)`).join(' • ')}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-red-300 border border-slate-700">
                          {meal.target.proteinBlocks}P • {meal.target.carbBlocks}C • {meal.target.fatBlocks}F
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleSelectCustomMeal(meal)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow transition active:scale-95 cursor-pointer"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(meal.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                        title="Delete saved meal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
