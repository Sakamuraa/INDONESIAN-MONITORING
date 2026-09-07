'use client';

import React from 'react';
import { AlertTriangle, Waves, ChevronRight, X } from 'lucide-react';
import { Disaster } from '@/types/disaster';

interface AlertBannerProps {
  latestDisaster: Disaster | null;
  onSelectDisaster: (disaster: Disaster) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ latestDisaster, onSelectDisaster }) => {
  const [dismissed, setDismissed] = React.useState(false);

  if (!latestDisaster || dismissed) return null;

  const isTsunamiAlert = latestDisaster.tsunamiPotential;
  const isMajorEarthquake = (latestDisaster.magnitude || 0) >= 6.0;

  if (!isTsunamiAlert && !isMajorEarthquake) return null;

  return (
    <div
      id="emergency-alert-banner"
      className="relative z-30 border-b border-[var(--gh-border)] bg-[var(--gh-surface-inset)]"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface-raised)]">
            {isTsunamiAlert ? (
              <Waves className="h-3.5 w-3.5 text-[var(--gh-accent)]" strokeWidth={1.75} />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5 text-[var(--gh-warning)]" strokeWidth={1.75} />
            )}
          </span>
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[var(--gh-text-muted)]">
              {isTsunamiAlert ? 'Potensi Tsunami' : 'Gempa Signifikan'}
            </span>
            <span className="truncate text-xs text-[var(--gh-text-muted)]">
              {latestDisaster.title}
              {latestDisaster.location ? ` | ${latestDisaster.location}` : ''}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => onSelectDisaster(latestDisaster)}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-[var(--gh-accent)] transition hover:underline"
          >
            Detail
            <ChevronRight className="h-3 w-3" strokeWidth={1.75} />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="rounded-lg p-1 text-[var(--gh-text-subtle)] transition hover:text-[var(--gh-text-muted)]"
            aria-label="Tutup peringatan"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
};
