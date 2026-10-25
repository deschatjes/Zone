import React from 'react';
import { MealTarget } from '../types/zone';
import { Share2, BookOpen, BookmarkCheck, RotateCcw, Smartphone, Sparkles, Plus } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  target: MealTarget;
  onSelectTarget: (preset: 'snack' | 'light' | 'meal' | 'male' | 'custom', customBlocks?: number) => void;
  onToggleVegetarian: () => void;
  onOpenExport: () => void;
  onOpenInstallApp: () => void;
  isInstalled: boolean;
  onOpenQuickRef: () => void;
  onOpenSavedMeals: () => void;
  onClearPlate: () => void;
  itemCount: number;
  onOpenCustomTarget: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  target,
  onSelectTarget,
  onToggleVegetarian,
  onOpenExport,
  onOpenInstallApp,
  isInstalled,
  onOpenQuickRef,
  onOpenSavedMeals,
  onClearPlate,
  itemCount,
  onOpenCustomTarget,
}) => {
  const { isIOS, isInstallable, install } = usePWAInstall();

  // Helper to determine active preset
  const isSnack = target.proteinBlocks === 1 && target.carbBlocks === 1 && target.fatBlocks === 1;
  const isLight = target.proteinBlocks === 2 && target.carbBlocks === 2 && target.fatBlocks === 2;
  const isMeal = target.proteinBlocks === 3 && target.carbBlocks === 3 && target.fatBlocks === 3;
  const isMaleMeal = target.proteinBlocks === 4 && target.carbBlocks === 4 && target.fatBlocks === 4;
  const isCustom = !isSnack && !isLight && !isMeal && !isMaleMeal;

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-3">
        {/* Top bar with branding & iPhone export actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-cyan-500 p-0.5 shadow-lg shadow-red-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-black text-red-500 text-lg tracking-tighter">
                1:1:1
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight leading-tight">
                  Zone Block Gram Calculator
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 uppercase tracking-wider">
                  Scale-Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gram-based portioning &amp; auto-balancer from official Zone &amp; HYC guides
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Ref Guide */}
            <button
              onClick={onOpenQuickRef}
              title="Scale-Ready Cheat Sheet"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Cheat Sheet</span>
            </button>

            {/* Saved Meals */}
            <button
              onClick={onOpenSavedMeals}
              title="Saved Meals & Official Templates"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition active:scale-95 cursor-pointer"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Saved</span>
            </button>

            {/* Clear plate */}
            {itemCount > 0 && (
              <button
                onClick={onClearPlate}
                title="Clear plate"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900 transition active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            {/* Share Current Meal */}
            <button
              onClick={onOpenExport}
              title="Share or copy current meal breakdown"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition active:scale-95 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Share Meal</span>
            </button>

            {/* Install / Export Whole App on iPhone (Hidden once installed) */}
            {!isInstalled && (
              <button
                onClick={onOpenInstallApp}
                title="Install full app on iPhone Home Screen"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold text-white bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-md shadow-red-900/40 transition active:scale-95 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>📱 Install on iPhone</span>
              </button>
            )}
          </div>
        </div>

        {/* Meal Target Selector bar */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
              Target:
            </span>

            {/* 3-Block Meal */}
            <button
              onClick={() => onSelectTarget('meal')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 shrink-0 whitespace-nowrap ${
                isMeal
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>3-Block Meal</span>
              <span className="opacity-75 font-normal text-[10px]">(3P•3C•3F)</span>
            </button>

            {/* 1-Block Snack */}
            <button
              onClick={() => onSelectTarget('snack')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 shrink-0 whitespace-nowrap ${
                isSnack
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>1-Block Snack</span>
              <span className="opacity-75 font-normal text-[10px]">(1P•1C•1F)</span>
            </button>

            {/* 4-Block Male Meal */}
            <button
              onClick={() => onSelectTarget('male')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 shrink-0 whitespace-nowrap ${
                isMaleMeal
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>4-Block Male</span>
              <span className="opacity-75 font-normal text-[10px]">(4P•4C•4F)</span>
            </button>

            {/* 2-Block Light */}
            <button
              onClick={() => onSelectTarget('light')}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 whitespace-nowrap ${
                isLight
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              2-Block Light
            </button>

            {/* Custom Target */}
            <button
              onClick={onOpenCustomTarget}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1 shrink-0 whitespace-nowrap ${
                isCustom
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>Custom ({target.proteinBlocks}P•{target.carbBlocks}C•{target.fatBlocks}F)</span>
            </button>
          </div>

          {/* Vegetarian Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleVegetarian}
              title={
                target.isVegetarianProtein
                  ? 'Vegetarian mode: 1 Fat Block = 3.0g fat'
                  : 'Lean Animal Protein: 1 Fat Block = 1.5g added fat'
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition cursor-pointer ${
                target.isVegetarianProtein
                  ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${target.isVegetarianProtein ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              <span>{target.isVegetarianProtein ? 'Veg Fat Math (3g/blk)' : 'Animal Protein (1.5g/blk)'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
