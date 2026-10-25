import React, { useState } from 'react';
import { BlockTotals, MealTarget, PlateItem } from '../types/zone';
import { formatMealForExport } from '../utils/zoneCalculations';
import { X, Share2, Copy, Check, Smartphone, Printer, ExternalLink, Sparkles } from 'lucide-react';

interface IPhoneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: MealTarget;
  items: PlateItem[];
  totals: BlockTotals;
  onOpenInstallApp: () => void;
  isInstalled?: boolean;
}

export const IPhoneExportModal: React.FC<IPhoneExportModalProps> = ({
  isOpen,
  onClose,
  target,
  items,
  totals,
  onOpenInstallApp,
  isInstalled,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!isOpen) return null;

  const exportText = formatMealForExport(target, items, totals);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Zone Plate: ${target.name}`,
          text: exportText,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
      } catch (err) {
        // User cancelled or error, fallback to copy
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight">
                Share Meal &amp; Scale Breakdown
              </h2>
              <p className="text-xs text-slate-400">
                Copy or send this plate's grams &amp; blocks to Apple Notes, Messages, or AirDrop
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

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Main Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Native Share button */}
            <button
              onClick={handleNativeShare}
              className="p-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{shareSuccess ? 'Shared!' : 'Share via iOS Sheet'}</span>
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-300" />
                  <span>Copy Formatted Text</span>
                </>
              )}
            </button>
          </div>

          {/* Formatted Text Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Meal Summary (Ready for Notes / Messages)
              </span>
              <button
                onClick={handlePrint}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap select-all leading-relaxed max-h-48 overflow-y-auto">
              {exportText}
            </pre>
          </div>

          {/* Switch to Whole App Install banner (only if not already installed) */}
          {!isInstalled && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/70 border border-red-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                  <Smartphone className="w-4 h-4 text-red-400" />
                  <span>Want to use the whole App on your iPhone?</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Install the complete Zone Block Calculator directly onto your iPhone Home Screen with our QR code and 3-step guide.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenInstallApp();
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition active:scale-95 cursor-pointer shrink-0"
              >
                📱 Install App on iPhone →
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
