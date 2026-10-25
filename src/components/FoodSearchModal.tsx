import React, { useState, useMemo } from 'react';
import { FoodCategory, FoodQuality, ZoneFood } from '../types/zone';
import { ZONE_FOODS } from '../data/zoneFoods';
import { Search, X, Plus, Sparkles, Filter, Check } from 'lucide-react';

interface FoodSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (food: ZoneFood, grams: number) => void;
  isVegetarianProtein: boolean;
}

const CATEGORIES: Array<{ key: 'all' | FoodCategory | 'best_only'; label: string }> = [
  { key: 'all', label: 'All Foods' },
  { key: 'best_only', label: '⭐ Best Only' },
  { key: 'meat_poultry', label: 'Meat & Poultry' },
  { key: 'fish_seafood', label: 'Fish & Seafood' },
  { key: 'egg_dairy_plant', label: 'Egg, Dairy & Plant' },
  { key: 'fruits', label: 'Fruits' },
  { key: 'cooked_vegetables', label: 'Cooked Veg & Beans' },
  { key: 'raw_vegetables', label: 'Raw Veg & Salads' },
  { key: 'grains_starches', label: 'Grains & Starches' },
  { key: 'fats', label: 'Oils, Nuts & Seeds' },
];

export const FoodSearchModal: React.FC<FoodSearchModalProps> = ({
  isOpen,
  onClose,
  onAddFood,
  isVegetarianProtein,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | FoodCategory | 'best_only'>('all');
  const [customGramsInput, setCustomGramsInput] = useState<{ [id: string]: string }>({});

  const filteredFoods = useMemo(() => {
    return ZONE_FOODS.filter((food) => {
      // Query filter
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesName = food.name.toLowerCase().includes(q);
        const matchesNotes = food.notes ? food.notes.toLowerCase().includes(q) : false;
        const matchesHousehold = food.householdUnit ? food.householdUnit.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesNotes && !matchesHousehold) return false;
      }

      // Category filter
      if (selectedCategory === 'best_only') {
        return food.quality === 'BEST';
      }
      if (selectedCategory !== 'all') {
        return food.category === selectedCategory;
      }

      return true;
    });
  }, [query, selectedCategory]);

  if (!isOpen) return null;

  const handleCustomAdd = (food: ZoneFood) => {
    const val = parseFloat(customGramsInput[food.id]);
    if (!isNaN(val) && val > 0) {
      onAddFood(food, val);
      onClose();
    } else {
      // Fallback to 1 block
      onAddFood(food, food.gramsPerBlock);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Search className="w-5 h-5 text-red-500" />
              Zone Food Block Database
            </h2>
            <p className="text-xs text-slate-400">
              Gram portions &amp; quality from the Zone &amp; HYC Ultimate 2026 Guides
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-3 bg-slate-950/70 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search chicken, blueberries, olive oil, quinoa, salmon..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-red-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Foods List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-slate-800/80">
          {filteredFoods.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <p>No matching foods found for "{query}".</p>
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-red-400 hover:underline text-xs font-semibold cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFoods.map((food) => {
              const macroTag =
                food.primaryMacro === 'protein'
                  ? 'text-red-400 bg-red-950/80 border-red-800'
                  : food.primaryMacro === 'carb'
                  ? 'text-cyan-400 bg-cyan-950/80 border-cyan-800'
                  : 'text-amber-400 bg-amber-950/80 border-amber-800';

              const oneBlockGrams =
                food.primaryMacro === 'fat' && isVegetarianProtein
                  ? food.gramsPerBlock * 2
                  : food.gramsPerBlock;

              const threeBlockGrams =
                food.gramsPerThreeBlocks || Math.round(oneBlockGrams * 3);

              return (
                <div
                  key={food.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-850/50 rounded-xl px-2.5 transition"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white tracking-tight">
                        {food.name}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded border ${macroTag}`}
                      >
                        {food.primaryMacro}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          food.quality === 'BEST'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : food.quality === 'FAIR'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : food.quality === 'EXTRA'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {food.quality}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>
                        1 Block = <strong className="text-white font-bold">{oneBlockGrams}g</strong>
                      </span>
                      <span>•</span>
                      <span>
                        3 Blocks = <strong className="text-slate-200 font-semibold">{threeBlockGrams}g</strong>
                      </span>
                      {food.householdUnit && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400">({food.householdUnit})</span>
                        </>
                      )}
                      {food.notes && (
                        <>
                          <span className="hidden md:inline">•</span>
                          <span className="text-slate-500 italic hidden md:inline">{food.notes}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quick Add buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    {/* Add 1 Block */}
                    <button
                      onClick={() => {
                        onAddFood(food, oneBlockGrams);
                        onClose();
                      }}
                      title={`Add 1 block (${oneBlockGrams}g)`}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-emerald-400" />
                      1 Blk ({oneBlockGrams}g)
                    </button>

                    {/* Add 3 Blocks */}
                    <button
                      onClick={() => {
                        onAddFood(food, threeBlockGrams);
                        onClose();
                      }}
                      title={`Add 3 blocks (${threeBlockGrams}g)`}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      3 Blk ({threeBlockGrams}g)
                    </button>

                    {/* Custom grams */}
                    <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5 ml-1">
                      <input
                        type="number"
                        placeholder="g"
                        value={customGramsInput[food.id] || ''}
                        onChange={(e) =>
                          setCustomGramsInput({
                            ...customGramsInput,
                            [food.id]: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCustomAdd(food);
                        }}
                        className="w-12 bg-transparent text-center text-xs font-bold text-white focus:outline-none px-1"
                      />
                      <button
                        onClick={() => handleCustomAdd(food)}
                        title="Add custom grams"
                        className="p-1 hover:bg-slate-700 rounded text-cyan-400 hover:text-white cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
