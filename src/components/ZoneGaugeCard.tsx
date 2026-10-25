import React from 'react';
import { BlockShortage, BlockTotals, MealTarget } from '../types/zone';
import { CheckCircle2, AlertTriangle, Scale, Flame, Wheat, Droplets } from 'lucide-react';

interface ZoneGaugeCardProps {
  totals: BlockTotals;
  target: MealTarget;
  shortage: BlockShortage;
  itemCount?: number;
}

export const ZoneGaugeCard: React.FC<ZoneGaugeCardProps> = ({ totals, target, shortage, itemCount = 0 }) => {
  // Percentages towards target
  const pPercent = Math.min(100, Math.round((totals.proteinBlocks / (target.proteinBlocks || 1)) * 100));
  const cPercent = Math.min(100, Math.round((totals.carbBlocks / (target.carbBlocks || 1)) * 100));
  const fPercent = Math.min(100, Math.round((totals.fatBlocks / (target.fatBlocks || 1)) * 100));

  // Determine balanced/empty status
  const isEmpty = itemCount === 0 && totals.proteinBlocks === 0 && totals.carbBlocks === 0 && totals.fatBlocks === 0;
  const isBalanced = shortage.isBalanced && !isEmpty;
  const isOver = !isBalanced && !isEmpty && shortage.proteinShortage <= 0 && shortage.carbShortage <= 0 && shortage.fatShortage <= 0;

  return (
    <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-xl backdrop-blur">
      {/* Top status indicator bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 mb-4 border-b border-slate-700/60">
        <div className="flex flex-wrap items-center gap-2">
          <Scale className="w-5 h-5 text-red-400 shrink-0" />
          <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
            Plate Block Balance
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 font-semibold border border-slate-700">
            Target: {target.proteinBlocks}P : {target.carbBlocks}C : {target.fatBlocks}F
          </span>
        </div>

        {/* Dedicated single status badge - solid & steady, NO flashing/pulsing */}
        <div className="self-start sm:self-auto">
          {isEmpty ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-slate-400 text-xs font-semibold">
              <Scale className="w-3.5 h-3.5 text-slate-500" />
              <span>Plate Empty (0 / {target.proteinBlocks} blk)</span>
            </div>
          ) : isBalanced ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-bold shadow-sm shadow-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Meal Complete ({target.proteinBlocks}P • {target.carbBlocks}C • {target.fatBlocks}F)</span>
            </div>
          ) : isOver ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/60 text-rose-300 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Over Block Target</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/60 text-amber-300 text-xs font-bold shadow-sm shadow-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Meal Incomplete — Shortage Detected</span>
            </div>
          )}
        </div>
      </div>

      {/* 3 Macro Block Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* PROTEIN CARD */}
        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-red-500/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black tracking-wider uppercase text-red-400">
                  Protein (P)
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                1 blk = 7g
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {totals.proteinBlocks}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  / {target.proteinBlocks} blk
                </span>
              </div>
              <span className="text-xs font-bold text-red-300 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60">
                ~{totals.proteinGrams}g
              </span>
            </div>
          </div>

          <div className="mt-3">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-600 to-rose-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (totals.proteinBlocks / target.proteinBlocks) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[11px]">
              <span className="text-slate-400 font-medium">{isEmpty ? '0%' : `${pPercent}%`} fulfilled</span>
              <span
                className={`font-bold ${
                  isEmpty
                    ? 'text-slate-500'
                    : shortage.proteinShortage > 0
                    ? 'text-amber-400'
                    : shortage.proteinShortage < 0
                    ? 'text-rose-400'
                    : 'text-emerald-400'
                }`}
              >
                {isEmpty
                  ? '0 blk'
                  : shortage.proteinShortage > 0
                  ? `Short: -${shortage.proteinShortage} blk`
                  : shortage.proteinShortage < 0
                  ? `Over: +${Math.abs(shortage.proteinShortage)} blk`
                  : 'Balanced'}
              </span>
            </div>
          </div>
        </div>

        {/* CARBOHYDRATE CARD */}
        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-cyan-500/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                  <Wheat className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black tracking-wider uppercase text-cyan-400">
                  Carbs (C)
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                1 blk = 9g net
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {totals.carbBlocks}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  / {target.carbBlocks} blk
                </span>
              </div>
              <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                ~{totals.carbGrams}g net
              </span>
            </div>
          </div>

          <div className="mt-3">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-600 to-sky-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (totals.carbBlocks / target.carbBlocks) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[11px]">
              <span className="text-slate-400 font-medium">{isEmpty ? '0%' : `${cPercent}%`} fulfilled</span>
              <span
                className={`font-bold ${
                  isEmpty
                    ? 'text-slate-500'
                    : shortage.carbShortage > 0
                    ? 'text-amber-400'
                    : shortage.carbShortage < 0
                    ? 'text-sky-400'
                    : 'text-emerald-400'
                }`}
              >
                {isEmpty
                  ? '0 blk'
                  : shortage.carbShortage > 0
                  ? `Short: -${shortage.carbShortage} blk`
                  : shortage.carbShortage < 0
                  ? `Over: +${Math.abs(shortage.carbShortage)} blk`
                  : 'Balanced'}
              </span>
            </div>
          </div>
        </div>

        {/* FAT CARD */}
        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-amber-500/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400">
                  <Droplets className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black tracking-wider uppercase text-amber-400">
                  Fats (F)
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                1 blk = {target.isVegetarianProtein ? '3g' : '1.5g'}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {totals.fatBlocks}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  / {target.fatBlocks} blk
                </span>
              </div>
              <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                ~{totals.fatGrams}g
              </span>
            </div>
          </div>

          <div className="mt-3">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-600 to-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (totals.fatBlocks / target.fatBlocks) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[11px]">
              <span className="text-slate-400 font-medium">{isEmpty ? '0%' : `${fPercent}%`} fulfilled</span>
              <span
                className={`font-bold ${
                  isEmpty
                    ? 'text-slate-500'
                    : shortage.fatShortage > 0
                    ? 'text-amber-400'
                    : shortage.fatShortage < 0
                    ? 'text-yellow-400'
                    : 'text-emerald-400'
                }`}
              >
                {isEmpty
                  ? '0 blk'
                  : shortage.fatShortage > 0
                  ? `Short: -${shortage.fatShortage} blk`
                  : shortage.fatShortage < 0
                  ? `Over: +${Math.abs(shortage.fatShortage)} blk`
                  : 'Balanced'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
