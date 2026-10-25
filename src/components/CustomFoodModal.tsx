import React, { useState } from 'react';
import { calculateBlocksFromLabel, round } from '../utils/zoneCalculations';
import { PlateItem } from '../types/zone';
import { X, SlidersHorizontal, Plus, Info } from 'lucide-react';

interface CustomFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomPlateItem: (item: PlateItem) => void;
  isVegetarianProtein: boolean;
}

export const CustomFoodModal: React.FC<CustomFoodModalProps> = ({
  isOpen,
  onClose,
  onAddCustomPlateItem,
  isVegetarianProtein,
}) => {
  const [name, setName] = useState('');
  const [portionGrams, setPortionGrams] = useState<string>('100');
  const [proteinG, setProteinG] = useState<string>('');
  const [carbsG, setCarbsG] = useState<string>('');
  const [fiberG, setFiberG] = useState<string>('0');
  const [fatG, setFatG] = useState<string>('');

  if (!isOpen) return null;

  const pNum = parseFloat(proteinG) || 0;
  const cNum = parseFloat(carbsG) || 0;
  const fibNum = parseFloat(fiberG) || 0;
  const fNum = parseFloat(fatG) || 0;
  const gramsNum = parseFloat(portionGrams) || 100;

  const blocks = calculateBlocksFromLabel(pNum, cNum, fibNum, fNum, isVegetarianProtein);

  // Determine dominant macro
  let dominantMacro: 'protein' | 'carb' | 'fat' = 'protein';
  if (blocks.carbBlocks > blocks.proteinBlocks && blocks.carbBlocks > blocks.fatBlocks) {
    dominantMacro = 'carb';
  } else if (blocks.fatBlocks > blocks.proteinBlocks && blocks.fatBlocks > blocks.carbBlocks) {
    dominantMacro = 'fat';
  }

  const handleAdd = () => {
    if (!name.trim()) return;

    const newItem: PlateItem = {
      id: `custom-${Date.now()}`,
      foodId: `custom-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name: name.trim(),
      category: 'custom',
      primaryMacro: dominantMacro,
      grams: gramsNum,
      gramsPerBlock:
        dominantMacro === 'protein'
          ? pNum > 0 ? round((gramsNum * 7) / pNum, 1) : 28
          : dominantMacro === 'carb'
          ? (cNum - fibNum) > 0 ? round((gramsNum * 9) / (cNum - fibNum), 1) : 50
          : fNum > 0 ? round((gramsNum * (isVegetarianProtein ? 3 : 1.5)) / fNum, 1) : 3,
      quality: 'EXTRA',
      notes: `Custom label math: ${pNum}g P, ${cNum - fibNum}g Net C, ${fNum}g F`,
      proteinBlocks: blocks.proteinBlocks,
      carbBlocks: blocks.carbBlocks,
      fatBlocks: blocks.fatBlocks,
    };

    onAddCustomPlateItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Package Nutrition Label Math
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong>Rule 8 (HYC Guide): "Let The Label Win"</strong>
              <p className="text-slate-400 mt-0.5">
                For yogurts, protein bars/powders, prepared soups, deli meats, or sauces, enter the exact nutrition facts from the back of the package.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Food / Brand Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Oikos Triple Zero Yogurt, Kirkland Protein Bar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Weighed Portion on Scale (Grams) *
            </label>
            <input
              type="number"
              min="1"
              value={portionGrams}
              onChange={(e) => setPortionGrams(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Macros in this portion */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-red-400 mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={proteinG}
                onChange={(e) => setProteinG(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-800 border border-red-500/40 rounded-lg text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="text-[10px] text-slate-400">÷ 7g</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-cyan-400 mb-1">
                Total Carbs (g)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={carbsG}
                onChange={(e) => setCarbsG(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-800 border border-cyan-500/40 rounded-lg text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Fiber (g)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={fiberG}
                onChange={(e) => setFiberG(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              <span className="text-[10px] text-cyan-400 font-semibold">Net: {Math.max(0, cNum - fibNum)}g</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-400 mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={fatG}
                onChange={(e) => setFatG(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-800 border border-amber-500/40 rounded-lg text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[10px] text-slate-400">÷ {isVegetarianProtein ? '3g' : '1.5g'}</span>
            </div>
          </div>

          {/* Live Calculated Output */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Calculated Zone Blocks:
            </span>
            <div className="flex items-center justify-around gap-2 text-center">
              <div>
                <span className="text-xl font-black text-red-400">{blocks.proteinBlocks}</span>
                <span className="block text-[10px] font-bold text-slate-400">P BLOCKS</span>
              </div>
              <span className="text-slate-600 font-bold">•</span>
              <div>
                <span className="text-xl font-black text-cyan-400">{blocks.carbBlocks}</span>
                <span className="block text-[10px] font-bold text-slate-400">C BLOCKS</span>
              </div>
              <span className="text-slate-600 font-bold">•</span>
              <div>
                <span className="text-xl font-black text-amber-400">{blocks.fatBlocks}</span>
                <span className="block text-[10px] font-bold text-slate-400">F BLOCKS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed shadow transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add To Plate
          </button>
        </div>
      </div>
    </div>
  );
};
