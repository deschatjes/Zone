import React from 'react';
import { BookOpen, X, Plus } from 'lucide-react';
import { ZONE_FOODS } from '../data/zoneFoods';
import { ZoneFood } from '../types/zone';

interface QuickReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (food: ZoneFood, grams: number) => void;
  isVegetarianProtein: boolean;
}

export const QuickReferenceModal: React.FC<QuickReferenceModalProps> = ({
  isOpen,
  onClose,
  onAddFood,
  isVegetarianProtein,
}) => {
  if (!isOpen) return null;

  // Curated table from Page 11 of HYC guide
  const tableData: Array<{
    id: string;
    name: string;
    oneBlk: number;
    threeBlk: number;
    macro: 'protein' | 'carb' | 'fat';
    asterisk?: boolean;
  }> = [
    // PROTEIN
    { id: 'chicken-breast-skinless', name: 'Chicken breast', oneBlk: 28, threeBlk: 84, macro: 'protein' },
    { id: 'turkey-breast-skinless', name: 'Turkey breast', oneBlk: 28, threeBlk: 84, macro: 'protein' },
    { id: 'cod', name: 'Cod', oneBlk: 43, threeBlk: 129, macro: 'protein' },
    { id: 'salmon', name: 'Salmon', oneBlk: 43, threeBlk: 129, macro: 'protein' },
    { id: 'sea-bass', name: 'Sea bass', oneBlk: 57, threeBlk: 171, macro: 'protein' },
    { id: 'snapper', name: 'Snapper', oneBlk: 28, threeBlk: 84, macro: 'protein' },
    { id: 'trout', name: 'Trout', oneBlk: 28, threeBlk: 84, macro: 'protein' },
    { id: 'tuna-steak', name: 'Tuna', oneBlk: 28, threeBlk: 84, macro: 'protein' },
    { id: 'octopus-cooked', name: 'Octopus (cooked)', oneBlk: 24, threeBlk: 72, macro: 'protein', asterisk: true },
    { id: 'cottage-cheese-1-pct', name: 'Cottage cheese 1%', oneBlk: 60, threeBlk: 180, macro: 'protein' },
    { id: 'greek-yogurt-nonfat', name: 'Greek yogurt non-fat', oneBlk: 69, threeBlk: 207, macro: 'protein' },
    { id: 'egg-whites', name: 'Egg whites', oneBlk: 66, threeBlk: 198, macro: 'protein' },

    // CARBOHYDRATES
    { id: 'quinoa-cooked', name: 'Quinoa (cooked)', oneBlk: 49, threeBlk: 147, macro: 'carb', asterisk: true },
    { id: 'brown-rice-cooked', name: 'Brown / red rice (cooked)', oneBlk: 40, threeBlk: 120, macro: 'carb', asterisk: true },
    { id: 'potato-boiled-baby', name: 'Boiled / baby potato', oneBlk: 50, threeBlk: 150, macro: 'carb', asterisk: true },
    { id: 'apple', name: 'Apple', oneBlk: 90, threeBlk: 270, macro: 'carb', asterisk: true },
    { id: 'pear', name: 'Pear', oneBlk: 74, threeBlk: 222, macro: 'carb' },
    { id: 'kiwi', name: 'Kiwi', oneBlk: 75, threeBlk: 225, macro: 'carb', asterisk: true },
    { id: 'banana', name: 'Banana', oneBlk: 40, threeBlk: 120, macro: 'carb', asterisk: true },
    { id: 'blueberries', name: 'Blueberries', oneBlk: 75, threeBlk: 225, macro: 'carb', asterisk: true },
    { id: 'raspberries', name: 'Raspberries', oneBlk: 165, threeBlk: 495, macro: 'carb', asterisk: true },
    { id: 'carrot-raw', name: 'Carrot (raw)', oneBlk: 132, threeBlk: 396, macro: 'carb' },

    // FATS
    { id: 'olive-oil', name: 'Olive oil', oneBlk: isVegetarianProtein ? 3 : 1.5, threeBlk: isVegetarianProtein ? 9 : 4.5, macro: 'fat' },
    { id: 'almonds', name: 'Almonds', oneBlk: isVegetarianProtein ? 7.2 : 3.6, threeBlk: isVegetarianProtein ? 21.6 : 10.8, macro: 'fat', asterisk: true },
    { id: 'walnuts-chopped', name: 'Walnuts', oneBlk: isVegetarianProtein ? 5 : 2.5, threeBlk: isVegetarianProtein ? 15 : 7.5, macro: 'fat', asterisk: true },
    { id: 'pumpkin-seeds', name: 'Pumpkin seeds', oneBlk: isVegetarianProtein ? 6 : 3, threeBlk: isVegetarianProtein ? 18 : 9, macro: 'fat', asterisk: true },
    { id: 'sunflower-seeds', name: 'Sunflower seeds', oneBlk: isVegetarianProtein ? 6 : 3, threeBlk: isVegetarianProtein ? 18 : 9, macro: 'fat', asterisk: true },
    { id: 'avocado', name: 'Avocado', oneBlk: isVegetarianProtein ? 30 : 15, threeBlk: isVegetarianProtein ? 90 : 45, macro: 'fat', asterisk: true },
    { id: 'natural-peanut-butter', name: 'Peanut butter', oneBlk: isVegetarianProtein ? 5 : 2.5, threeBlk: isVegetarianProtein ? 15 : 7.5, macro: 'fat', asterisk: true },
  ];

  const handleAddFromSheet = (item: typeof tableData[0], grams: number) => {
    const foundFood = ZONE_FOODS.find((f) => f.id === item.id);
    if (foundFood) {
      onAddFood(foundFood, grams);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Scale-Ready Cheat Sheet (1 &amp; 3 Blocks)
              </h2>
              <p className="text-xs text-slate-400">
                Official HYC Guide quick-reference weights designed directly for the kitchen scale
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700/80 text-slate-300">
                  <th className="py-2.5 px-3 font-bold">Food</th>
                  <th className="py-2.5 px-2 font-bold text-center">Type</th>
                  <th className="py-2.5 px-2 font-bold text-center">1 Block (g)</th>
                  <th className="py-2.5 px-2 font-bold text-center">3 Blocks (g)</th>
                  <th className="py-2.5 px-3 font-bold text-right">Quick Add</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {tableData.map((row) => {
                  const badgeColor =
                    row.macro === 'protein'
                      ? 'text-red-400 bg-red-950/60 border-red-800'
                      : row.macro === 'carb'
                      ? 'text-cyan-400 bg-cyan-950/60 border-cyan-800'
                      : 'text-amber-400 bg-amber-950/60 border-amber-800';

                  return (
                    <tr key={row.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 font-semibold text-white">
                        {row.name}
                        {row.asterisk && <span className="text-slate-500 ml-0.5">*</span>}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span
                          className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded border ${badgeColor}`}
                        >
                          {row.macro[0].toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-200">
                        {row.oneBlk}g
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-red-400">
                        {row.threeBlk}g
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleAddFromSheet(row, row.oneBlk)}
                            title={`Add 1 block (${row.oneBlk}g)`}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                          >
                            +1B
                          </button>
                          <button
                            onClick={() => handleAddFromSheet(row, row.threeBlk)}
                            title={`Add 3 blocks (${row.threeBlk}g)`}
                            className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-[10px] font-bold text-white shadow-sm cursor-pointer"
                          >
                            +3B
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-[11px] text-slate-400 italic">
            * Asterisk indicates practical kitchen scale targets derived from standard food composition. Rounding 28g chicken to 30g (~90g for 3 blocks) is acceptable for day-to-day coaching.
          </p>
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
