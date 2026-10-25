import React, { useState } from 'react';
import { BlockShortage, FoodSuggestion, MealTarget, PlateItem } from '../types/zone';
import { Sparkles, ArrowRight, PlusCircle, CheckCircle2, ChevronRight, Wand2, Lightbulb } from 'lucide-react';

interface AutoSuggesterCardProps {
  items: PlateItem[];
  shortage: BlockShortage;
  target: MealTarget;
  currentSuggestions: FoodSuggestion[];
  alternativeSuggestions: FoodSuggestion[];
  onApplyCurrentFoodGrams: (foodId: string, newTotalGrams: number) => void;
  onAddAlternativeFood: (foodId: string, grams: number) => void;
  onAutoBalanceMeal: () => void;
  onOpenExport: () => void;
}

export const AutoSuggesterCard: React.FC<AutoSuggesterCardProps> = ({
  items,
  shortage,
  target,
  currentSuggestions,
  alternativeSuggestions,
  onApplyCurrentFoodGrams,
  onAddAlternativeFood,
  onAutoBalanceMeal,
  onOpenExport,
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'alternatives'>('current');

  const isBalanced = shortage.isBalanced;

  if (isBalanced) {
    return (
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-800 to-teal-950/60 rounded-2xl p-5 border border-emerald-500/40 shadow-xl backdrop-blur">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Meal Requirement Complete!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-300/90 mt-0.5">
                Exact {target.proteinBlocks}P : {target.carbBlocks}C : {target.fatBlocks}F Zone balance achieved. Ready to cook or weigh.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenExport}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/40 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Export for iPhone
          </button>
        </div>
      </div>
    );
  }

  // Group alternative suggestions by missing macro
  const pAlternatives = alternativeSuggestions.filter((s) => s.macro === 'protein');
  const cAlternatives = alternativeSuggestions.filter((s) => s.macro === 'carb');
  const fAlternatives = alternativeSuggestions.filter((s) => s.macro === 'fat');

  return (
    <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-red-500/40 shadow-2xl backdrop-blur">
      {/* Header with smart auto-balance button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-700/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white tracking-tight">
                Auto-Complete Block Suggestions
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                Short of {target.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automatically calculates gram adjustments to finish all incomplete blocks
            </p>
          </div>
        </div>

        {/* 1-Click Auto Solve button */}
        <button
          onClick={onAutoBalanceMeal}
          title="Instantly completes all deficient blocks"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:opacity-95 shadow-md shadow-red-900/30 transition active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>1-Click Auto-Balance</span>
        </button>
      </div>

      {/* Missing blocks breakdown chip banner */}
      <div className="flex flex-wrap items-center gap-2 mb-4 p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/60 text-xs">
        <span className="font-bold text-slate-300 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          Shortfall Needed:
        </span>
        {shortage.proteinShortage > 0.05 && (
          <span className="px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 font-bold border border-red-800">
            +{shortage.proteinShortage} P Blocks (~{Math.round(shortage.proteinShortage * 7)}g)
          </span>
        )}
        {shortage.carbShortage > 0.05 && (
          <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-800">
            +{shortage.carbShortage} C Blocks (~{Math.round(shortage.carbShortage * 9)}g)
          </span>
        )}
        {shortage.fatShortage > 0.05 && (
          <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 font-bold border border-amber-800">
            +{shortage.fatShortage} F Blocks (~
            {Math.round(shortage.fatShortage * (target.isVegetarianProtein ? 3 : 1.5))}g)
          </span>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 border-b border-slate-700/80 mb-4 pb-1">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'current'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Adjust Foods On Plate</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
            {currentSuggestions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('alternatives')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'alternatives'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Add Alternative Foods</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
            {alternativeSuggestions.length}
          </span>
        </button>
      </div>

      {/* TAB 1: ADJUST CURRENT FOODS */}
      {activeTab === 'current' && (
        <div className="space-y-2.5">
          {currentSuggestions.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 text-center text-xs text-slate-400">
              <p>No matching foods currently on your plate for the missing macros.</p>
              <button
                onClick={() => setActiveTab('alternatives')}
                className="mt-2 text-cyan-400 hover:underline font-bold inline-flex items-center gap-1"
              >
                Browse Alternative Foods to complete <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            currentSuggestions.map((suggestion) => {
              const macroColor =
                suggestion.macro === 'protein'
                  ? 'border-red-500/40 text-red-300'
                  : suggestion.macro === 'carb'
                  ? 'border-cyan-500/40 text-cyan-300'
                  : 'border-amber-500/40 text-amber-300';

              return (
                <div
                  key={`${suggestion.foodId}-${suggestion.macro}`}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-600 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {suggestion.foodName}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded border ${macroColor} bg-slate-950`}
                      >
                        {suggestion.macro}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>Currently: <strong className="text-slate-200">{suggestion.currentGrams}g</strong></span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        Add <strong className="text-emerald-400 font-bold">+{suggestion.suggestedGramsToAdd}g</strong> (Total: <strong className="text-white">{suggestion.suggestedTotalGrams}g</strong>)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onApplyCurrentFoodGrams(
                        suggestion.foodId,
                        suggestion.suggestedTotalGrams
                      )
                    }
                    className="self-end sm:self-center px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow transition active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span>Apply (+{suggestion.suggestedGramsToAdd}g)</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: ADD ALTERNATIVE FOODS */}
      {activeTab === 'alternatives' && (
        <div className="space-y-4">
          {/* Missing Protein Alternatives */}
          {shortage.proteinShortage > 0.05 && pAlternatives.length > 0 && (
            <div>
              <div className="text-xs font-bold text-red-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Fill Protein Shortfall (+{shortage.proteinShortage} blk):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pAlternatives.map((alt) => (
                  <div
                    key={alt.foodId}
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between gap-2 hover:border-red-500/40 transition"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {alt.foodName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Add <strong className="text-red-400 font-bold">{alt.suggestedGramsToAdd}g</strong> to plate
                      </div>
                    </div>
                    <button
                      onClick={() => onAddAlternativeFood(alt.foodId, alt.suggestedGramsToAdd)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold text-white bg-red-600 hover:bg-red-500 transition active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <PlusCircle className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Carb Alternatives */}
          {shortage.carbShortage > 0.05 && cAlternatives.length > 0 && (
            <div>
              <div className="text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                Fill Carbohydrate Shortfall (+{shortage.carbShortage} blk):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cAlternatives.map((alt) => (
                  <div
                    key={alt.foodId}
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between gap-2 hover:border-cyan-500/40 transition"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {alt.foodName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Add <strong className="text-cyan-400 font-bold">{alt.suggestedGramsToAdd}g</strong> to plate
                      </div>
                    </div>
                    <button
                      onClick={() => onAddAlternativeFood(alt.foodId, alt.suggestedGramsToAdd)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <PlusCircle className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Fat Alternatives */}
          {shortage.fatShortage > 0.05 && fAlternatives.length > 0 && (
            <div>
              <div className="text-xs font-bold text-amber-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Fill Fat Shortfall (+{shortage.fatShortage} blk):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fAlternatives.map((alt) => (
                  <div
                    key={alt.foodId}
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between gap-2 hover:border-amber-500/40 transition"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {alt.foodName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Add <strong className="text-amber-400 font-bold">{alt.suggestedGramsToAdd}g</strong> to plate
                      </div>
                    </div>
                    <button
                      onClick={() => onAddAlternativeFood(alt.foodId, alt.suggestedGramsToAdd)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold text-white bg-amber-600 hover:bg-amber-500 transition active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <PlusCircle className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
