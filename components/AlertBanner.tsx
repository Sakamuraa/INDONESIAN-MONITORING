'use client';

import React from 'react';
import { AlertTriangle, Waves, ChevronRight, X } from 'lucide-react';
import { Disaster } from '@/types/disaster';

interface AlertBannerProps {
  latestDisaster: Disaster | null;
  onSelectDisaster: (disaster: Disaster) => void;
}

/**
 * Muted alert strip — shows only for M≥6.0 or tsunami potential.
 * Not loud: subtle border accent, no ping animation, muted tones.
 */
export const AlertBanner: React.FC<AlertBannerProps> = ({ latestDisaster, onSelectDisaster }) => {
  const [dismissed, setDismissed] = React.useState(false);

  if (!latestDisaster || dismissed) return null;

  const isTsunamiAlert = latestDisaster.tsunamiPotential;
  const isMajorEarthquake = (latestDisaster.magnitude || 0) >= 6.0;

  if (!isTsunamiAlert && !isMajorEarthquake) return null;

  return (
    <div
      id="emergency-alert-banner"
      className="relative z-30 border-b border-amber-500/15 bg-[var(--gh-surface-inset)] backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
        {/* Left — muted icon + info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-500/10 border border-amber-500/15">
            {isTsunamiAlert ? (
              <Waves className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.75} />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.75} />
            )}
          </span>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
            <span className="font-semibold tracking-wide uppercase text-[10px] text-amber-400/80 shrink-0">
              {isTsunamiAlert ? 'Tsunami' : 'Gempa Signifikan'}
            </span>
            <span className="text-xs text-[var(--gh-text-muted)] truncate">
              {latestDisaster.title}
              {latestDisaster.location ? ` — ${latestDisaster.location}` : ''}
            </span>
          </div>
        </div>

        {/* Right — calm actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onSelectDisaster(latestDisaster)}
            className="flex items-center gap-1 text-[11px] font-medium text-[var(--gh-accent)] hover:underline transition px-1.5 py-1 rounded"
          >
            Detail
            <ChevronRight className="h-3 w-3" strokeWidth={1.75} />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="rounded p-1 text-[var(--gh-text-subtle)] hover:text-[var(--gh-text-muted)] transition"
            title="Tutup"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
};
