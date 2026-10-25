import React from 'react';
import { PlateItem } from '../types/zone';
import { Utensils, Trash2, Plus, Minus, Search, Sparkles, SlidersHorizontal } from 'lucide-react';

interface CurrentPlateCardProps {
  items: PlateItem[];
  onUpdateGrams: (id: string, newGrams: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenSearch: () => void;
  onOpenCustomLabel: () => void;
  onLoadTemplate: (templateName: string) => void;
}

export const CurrentPlateCard: React.FC<CurrentPlateCardProps> = ({
  items,
  onUpdateGrams,
  onRemoveItem,
  onOpenSearch,
  onOpenCustomLabel,
  onLoadTemplate,
}) => {
  return (
    <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-xl backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-red-400" />
          <h2 className="text-base font-bold text-white tracking-tight">
            Current Food Scale ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCustomLabel}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-700/70 hover:bg-slate-700 hover:text-white border border-slate-600 transition active:scale-95 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Nutrition Label</span>
          </button>
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-900/30 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food</span>
          </button>
        </div>
      </div>

      {/* Plate Items List */}
      {items.length === 0 ? (
        <div className="py-8 px-4 text-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/40">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
            <Utensils className="w-6 h-6 text-slate-500" />
          </div>
          <h3 className="text-sm font-bold text-slate-200">Your Plate is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Tap <strong>"Add Food"</strong> to pick foods from the Zone guide and weigh them in grams.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={onOpenSearch}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Browse Zone Foods
            </button>
            <span className="text-xs text-slate-500">or try quick start:</span>
            <button
              onClick={() => onLoadTemplate('chicken-meal')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-red-400" />
              3-Blk Chicken
            </button>
            <button
              onClick={() => onLoadTemplate('yogurt-snack')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              1-Blk Greek Yogurt
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const macroBg =
              item.primaryMacro === 'protein'
                ? 'border-red-500/40 bg-red-950/20'
                : item.primaryMacro === 'carb'
                ? 'border-cyan-500/40 bg-cyan-950/20'
                : 'border-amber-500/40 bg-amber-950/20';

            const macroTag =
              item.primaryMacro === 'protein'
                ? 'text-red-400 bg-red-950/80 border-red-800'
                : item.primaryMacro === 'carb'
                ? 'text-cyan-400 bg-cyan-950/80 border-cyan-800'
                : 'text-amber-400 bg-amber-950/80 border-amber-800';

            return (
              <div
                key={item.id}
                className={`p-3 sm:p-3.5 rounded-xl border ${macroBg} bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition`}
              >
                {/* Food info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-tight truncate">
                      {item.name}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded border ${macroTag}`}
                    >
                      {item.primaryMacro.toUpperCase()}
                    </span>
                    {item.quality && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          item.quality === 'BEST'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : item.quality === 'FAIR'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : item.quality === 'EXTRA'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {item.quality}
                      </span>
                    )}
                  </div>

                  {/* Block breakdown */}
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span>
                      1 blk = <strong className="text-slate-300">{item.gramsPerBlock}g</strong>
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-200">
                      Current:{' '}
                      <span className="text-white font-bold">
                        {item.primaryMacro === 'protein' && `${item.proteinBlocks} P blocks`}
                        {item.primaryMacro === 'carb' && `${item.carbBlocks} C blocks`}
                        {item.primaryMacro === 'fat' && `${item.fatBlocks} F blocks`}
                      </span>
                    </span>
                    {item.notes && (
                      <>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:inline text-[11px] text-slate-400 italic">
                          {item.notes}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Gram controls & Delete */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Gram Input & Quick Adjusters */}
                  <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-1">
                    <button
                      onClick={() => onUpdateGrams(item.id, Math.max(1, item.grams - 10))}
                      title="Decrease by 10g"
                      className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center px-1.5">
                      <input
                        type="number"
                        min="1"
                        max="2000"
                        value={item.grams}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val >= 0) {
                            onUpdateGrams(item.id, val);
                          }
                        }}
                        className="w-16 bg-transparent text-center font-bold text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500 rounded"
                      />
                      <span className="text-xs font-semibold text-slate-400">g</span>
                    </div>

                    <button
                      onClick={() => onUpdateGrams(item.id, item.grams + 10)}
                      title="Increase by 10g"
                      className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Preset Quick Snap buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateGrams(item.id, item.gramsPerBlock)}
                      title="Set to exactly 1 Block"
                      className="px-1.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                    >
                      1B ({item.gramsPerBlock}g)
                    </button>
                    <button
                      onClick={() => onUpdateGrams(item.id, Math.round(item.gramsPerBlock * 3))}
                      title="Set to exactly 3 Blocks"
                      className="px-1.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                    >
                      3B ({Math.round(item.gramsPerBlock * 3)}g)
                    </button>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    title={`Remove ${item.name}`}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition active:scale-95 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
