import React, { useState } from 'react';
import { MealTarget } from '../types/zone';
import { X, Target, Check } from 'lucide-react';

interface CustomTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTarget: MealTarget;
  onSaveTarget: (target: MealTarget) => void;
}

export const CustomTargetModal: React.FC<CustomTargetModalProps> = ({
  isOpen,
  onClose,
  currentTarget,
  onSaveTarget,
}) => {
  const [name, setName] = useState(currentTarget.name);
  const [pBlocks, setPBlocks] = useState(currentTarget.proteinBlocks.toString());
  const [cBlocks, setCBlocks] = useState(currentTarget.carbBlocks.toString());
  const [fBlocks, setFBlocks] = useState(currentTarget.fatBlocks.toString());
  const [isVegetarian, setIsVegetarian] = useState(currentTarget.isVegetarianProtein);

  if (!isOpen) return null;

  const handleSave = () => {
    const p = parseFloat(pBlocks) || 3;
    const c = parseFloat(cBlocks) || 3;
    const f = parseFloat(fBlocks) || 3;

    onSaveTarget({
      name: name.trim() || `${p}P • ${c}C • ${f}F Custom Target`,
      proteinBlocks: p,
      carbBlocks: c,
      fatBlocks: f,
      isVegetarianProtein: isVegetarian,
    });
    onClose();
  };

  const handleSetEqual = (num: number) => {
    setPBlocks(num.toString());
    setCBlocks(num.toString());
    setFBlocks(num.toString());
    setName(`${num}-Block Meal`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-black text-white tracking-tight">
              Custom Block Targets
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
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
              Target Preset Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Quick presets */}
          <div>
            <span className="block text-xs font-bold text-slate-400 mb-1.5">
              Quick Equal Ratio (1:1:1):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 2.5, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => handleSetEqual(n)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                >
                  {n} Blocks
                </button>
              ))}
            </div>
          </div>

          {/* 3 Macro Block Inputs */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div>
              <label className="block text-xs font-bold text-red-400 mb-1">
                Protein (P)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="15"
                value={pBlocks}
                onChange={(e) => setPBlocks(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-800 border border-red-500/40 rounded-xl text-sm text-white font-bold text-center focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="block text-center text-[10px] text-slate-400 mt-1">
                ~{(parseFloat(pBlocks) || 0) * 7}g protein
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-cyan-400 mb-1">
                Carbs (C)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="15"
                value={cBlocks}
                onChange={(e) => setCBlocks(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-800 border border-cyan-500/40 rounded-xl text-sm text-white font-bold text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <span className="block text-center text-[10px] text-slate-400 mt-1">
                ~{(parseFloat(cBlocks) || 0) * 9}g net
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-400 mb-1">
                Fats (F)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="15"
                value={fBlocks}
                onChange={(e) => setFBlocks(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-800 border border-amber-500/40 rounded-xl text-sm text-white font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="block text-center text-[10px] text-slate-400 mt-1">
                ~{(parseFloat(fBlocks) || 0) * (isVegetarian ? 3 : 1.5)}g fat
              </span>
            </div>
          </div>

          {/* Vegetarian toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={isVegetarian}
                onChange={(e) => setIsVegetarian(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
              />
              <span>Vegetarian Fat Accounting (3g fat per block)</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 shadow transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Set Target
          </button>
        </div>
      </div>
    </div>
  );
};
