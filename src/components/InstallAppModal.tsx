import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Smartphone, Copy, Check, QrCode, ExternalLink, ArrowRight, Sparkles, Share2 } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkAsInstalled: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  onMarkAsInstalled,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Determine the best URL for the user's phone:
  // Prefer the current window location or the pre-configured deployment URL
  const appUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-zdndy33n5pyfbtdmrmhksp-968435729246.europe-west2.run.app';

  useEffect(() => {
    if (isOpen && appUrl) {
      QRCode.toDataURL(appUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('Failed to generate QR code', err));
    }
  }, [isOpen, appUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleShareLink = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Zone Block Gram Calculator',
          text: 'Open the Zone Block Gram Calculator on your iPhone:',
          url: appUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                Install App on iPhone
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase tracking-wider">
                  No App Store Needed
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Put the whole Zone Block Calculator on your iPhone Home Screen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main 2-Column layout: Step 1 (QR Code) and Step 2 (Safari Install) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* STEP 1: SCAN WITH IPHONE */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/60 text-red-300 border border-red-800/80 text-[11px] font-black uppercase tracking-wider mb-3">
                  <span>Step 1: Open on iPhone</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Scan With Your iPhone Camera
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Point your iPhone camera at this code to open the app directly in Safari:
                </p>

                {/* QR Code Container */}
                <div className="p-3 bg-white rounded-2xl shadow-xl inline-block mx-auto mb-3 border-2 border-slate-200">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="Scan to open on iPhone"
                      className="w-44 h-44 sm:w-48 sm:h-48 rounded-lg object-contain mx-auto"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-slate-400">
                      Generating QR...
                    </div>
                  )}
                </div>
              </div>

              {/* URL & Link copy buttons */}
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-left">
                  <span className="text-[11px] text-slate-400 font-mono truncate flex-1 select-all">
                    {appUrl}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    title="Copy Link"
                    className="p-1 hover:bg-slate-800 rounded text-cyan-400 hover:text-cyan-300 transition shrink-0 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy App Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShareLink}
                    className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Send / AirDrop</span>
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 2: ADD TO IPHONE HOME SCREEN */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 text-[11px] font-black uppercase tracking-wider mb-3">
                  <span>Step 2: Install to Home Screen</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">
                  Add to iPhone Home Screen
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Follow these 3 quick taps in Safari to make it a standalone app on your iPhone:
                </p>

                {/* 3 Illustrated Steps */}
                <div className="space-y-3 text-left">
                  {/* Step A */}
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 font-black text-xs flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        Tap the Share button in Safari
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        It's the box with an arrow pointing up{' '}
                        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700 text-[10px]">
                          [↑]
                        </span>{' '}
                        in the bottom menu bar of Safari.
                      </p>
                    </div>
                  </div>

                  {/* Step B */}
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-amber-600/20 border border-amber-500/40 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        Scroll down and tap "Add to Home Screen"
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Look for the{' '}
                        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold border border-slate-700 text-[10px]">
                          [+] Add to Home Screen
                        </span>{' '}
                        option in the action list.
                      </p>
                    </div>
                  </div>

                  {/* Step C */}
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        Tap "Add" in top-right corner
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        The <strong>ZoneBlocks</strong> icon appears on your iPhone home screen with your other apps!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Native Benefits Callout */}
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-[11px] text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Launches in full-screen (no Safari browser bars) and works offline in your kitchen!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            onClick={() => {
              onMarkAsInstalled();
              onClose();
            }}
            className="w-full sm:w-auto text-xs font-semibold text-slate-400 hover:text-emerald-300 py-1.5 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>I've already installed it (hide install buttons)</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
