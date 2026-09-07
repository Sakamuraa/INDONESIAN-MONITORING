'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Radio } from 'lucide-react';

/**
 * Base skeleton primitive
 * gh tokens, rounded-xl scale, reduced-motion safe
 */
export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-md bg-[var(--gh-surface-raised)] relative overflow-hidden motion-safe:animate-pulse after:absolute after:inset-0 after:-translate-x-full motion-safe:after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-[var(--gh-border)]/40 after:to-transparent motion-reduce:after:hidden',
        className
      )}
      {...props}
    />
  );
};

/**
 * Top KPI stats — 4 cards, bento varied widths
 */
export const StatsOverviewSkeleton: React.FC = () => {
  const cards = [
    { w1: 'w-20', w2: 'w-14', w3: 'w-16' },
    { w1: 'w-24', w2: 'w-10', w3: 'w-20' },
    { w1: 'w-28', w2: 'w-12', w3: 'w-14' },
    { w1: 'w-22', w2: 'w-16', w3: 'w-18' },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Memuat statistik">
      {cards.map((c, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className={`h-3 ${c.w1}`} />
            <Skeleton className="h-8 w-8 rounded-xl" />
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-7 w-16" />
              <Skeleton className={`h-3 ${c.w2}`} />
            </div>
            <Skeleton className={`h-3 ${c.w3}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Hero showcase — latest quake banner, matches editorial hero shape
 */
export const LatestQuakeCardSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-36 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-2">
        <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <Skeleton className="h-5 w-[72%] max-w-[320px]" />
          <Skeleton className="h-4 w-36" />
          <div className="flex flex-wrap gap-2 pt-1">
            <Skeleton className="h-6 w-28 rounded-xl" />
            <Skeleton className="h-6 w-32 rounded-xl" />
            <Skeleton className="h-6 w-24 rounded-xl" />
          </div>
        </div>
      </div>
      <div className="pt-3 border-t border-[var(--gh-border)] flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-4 w-52" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-8 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

/**
 * Interactive map stage — editorial map chrome
 */
export const InteractiveMapSkeleton: React.FC<{ heightClass?: string }> = ({
  heightClass = 'h-[460px] sm:h-[540px]',
}) => {
  return (
    <div
      className={cn(
        'relative w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface-inset)] overflow-hidden flex flex-col items-center justify-center p-6',
        heightClass
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--gh-border)_12%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--gh-border)_12%,transparent)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Skeleton className="h-8 w-28 rounded-xl" />
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>
      <div className="absolute top-4 right-4 z-10 flex gap-1.5">
        <Skeleton className="h-8 w-36 rounded-xl" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-full w-full rounded-full bg-[var(--gh-accent)]/15 motion-safe:animate-ping motion-reduce:hidden" />
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gh-surface)] border border-[var(--gh-border)] text-[var(--gh-accent)]">
            <Radio className="h-6 w-6 motion-safe:animate-pulse" strokeWidth={1.75} />
          </div>
        </div>
        <div className="space-y-1">
          <Skeleton className="h-4 w-44 mx-auto" />
          <Skeleton className="h-3 w-32 mx-auto" />
        </div>
      </div>
      <div className="absolute bottom-4 left-4 z-10 hidden sm:block">
        <Skeleton className="h-16 w-52 rounded-xl" />
      </div>
    </div>
  );
};

/**
 * Disaster feed list — grouped rows, not equal pulses
 */
export const DisasterListSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--gh-border)] pb-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-7 w-16 rounded-xl" />
          <Skeleton className="h-7 w-20 rounded-xl" />
          <Skeleton className="h-7 w-20 rounded-xl" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-xl" />
        <Skeleton className="h-9 w-32 rounded-xl hidden sm:block" />
      </div>
      <div className="space-y-3 pt-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface-raised)]/40 p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 w-full min-w-0">
                <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Skeleton className={`h-4 ${i === 1 ? 'w-[68%]' : i === 2 ? 'w-[52%]' : i === 3 ? 'w-[74%]' : 'w-44'} max-w-xs`} />
                    <Skeleton className="h-4 w-12 rounded hidden sm:block" />
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-28 hidden sm:block" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-4 w-10 shrink-0 rounded" />
            </div>
            <div className="pt-2 border-t border-[var(--gh-border)] flex justify-end gap-2">
              <Skeleton className="h-7 w-24 rounded-xl" />
              <Skeleton className="h-7 w-28 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Volcano monitor — header + 6 KPI + filter + bento grid
 */
export const VolcanoMonitorSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" aria-label="Memuat data gunung api">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--gh-surface)] p-4 rounded-xl border border-[var(--gh-border)]">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-3.5 space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-2 w-2 rounded-full" />
            </div>
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[var(--gh-surface)]/60 p-3 rounded-xl border border-[var(--gh-border)]">
        <div className="flex gap-2 overflow-hidden">
          <Skeleton className="h-7 w-20 rounded-xl" />
          <Skeleton className="h-7 w-16 rounded-xl" />
          <Skeleton className="h-7 w-16 rounded-xl hidden sm:block" />
          <Skeleton className="h-7 w-16 rounded-xl hidden sm:block" />
        </div>
        <Skeleton className="h-8 w-full sm:w-64 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <Skeleton className={`h-4 ${i % 2 === 0 ? 'w-28' : 'w-32'}`} />
                  <Skeleton className="h-4 w-20 rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <div className="pt-3 border-t border-[var(--gh-border)] flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex gap-1.5">
                    <Skeleton className="h-6 w-6 rounded-xl" />
                    <Skeleton className="h-6 w-6 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] divide-y divide-[var(--gh-border)] p-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-28 w-full rounded-xl" />
                <div className="flex justify-between items-center pt-1">
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Volcano detail
 */
export const VolcanoDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" aria-label="Memuat detail gunung api">
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-64 sm:w-80" />
            <div className="flex flex-wrap gap-4 pt-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-44 hidden sm:block" />
            </div>
            <Skeleton className="h-16 w-full rounded-xl mt-2" />
          </div>
          <div className="flex flex-row md:flex-col gap-2 shrink-0">
            <Skeleton className="h-10 w-44 rounded-xl" />
            <Skeleton className="h-10 w-44 rounded-xl" />
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-xl" />
          <Skeleton className="h-5 w-60" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-4 pt-2">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2 border-b border-[var(--gh-border)] pb-4 last:border-0">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Risk map — formula banner + split
 */
export const RiskMapViewSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" aria-label="Memuat data peta risiko">
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-72" />
            <Skeleton className="h-3 w-full max-w-lg" />
          </div>
          <Skeleton className="h-14 w-60 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[var(--gh-border)]">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-[var(--gh-border)]">
            <Skeleton className="h-5 w-44" />
            <div className="flex gap-1.5">
              <Skeleton className="h-6 w-14 rounded-xl" />
              <Skeleton className="h-6 w-14 rounded-xl" />
            </div>
          </div>
          <div className="space-y-2.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-6 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-[var(--gh-border)]">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-7 w-48" />
            </div>
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
          <Skeleton className="h-4 w-40" />
          <div className="grid grid-cols-2 gap-2.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Region explorer
 */
export const RegionExplorerSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" aria-label="Memuat eksplorasi wilayah">
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-3 w-80 max-w-full" />
          </div>
          <Skeleton className="h-9 w-full sm:w-72 rounded-xl" />
        </div>
        <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--gh-border)]">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-[var(--gh-border)]">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-28 rounded-xl" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

/**
 * Full dashboard
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" aria-label="Memuat dashboard bencana">
      <StatsOverviewSkeleton />
      <LatestQuakeCardSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-32" />
          </div>
          <InteractiveMapSkeleton />
        </div>
        <div className="lg:col-span-5">
          <DisasterListSkeleton />
        </div>
      </div>
    </div>
  );
};

/**
 * Muted alert strip — matches AlertBanner muted inset
 */
export const AlertBannerSkeleton: React.FC = () => {
  return (
    <div className="border-b border-[var(--gh-border)] bg-[var(--gh-surface-inset)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Skeleton className="h-6 w-6 rounded-xl" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-64 hidden sm:block" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
};

/**
 * Mitigation guide — editorial bento: left rail + body
 */
export const MitigationGuideSkeleton: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-5 w-5 rounded-xl" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-3 w-96 max-w-full mt-2" />
        <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-[var(--gh-border)]">
          {[72, 108, 118, 92, 96].map((w, i) => (
            <Skeleton key={i} className="h-6 rounded-xl" style={{ width: w }} />
          ))}
        </div>
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-xl border overflow-hidden border-[var(--gh-border)] bg-[var(--gh-surface)]"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="flex sm:flex-col items-center gap-3 sm:gap-2 px-5 py-4 sm:w-44 shrink-0 sm:border-r border-b sm:border-b-0 border-[var(--gh-border)] bg-[var(--gh-surface-raised)]/40">
              <Skeleton className="h-8 w-8 rounded-xl" />
              <div className="flex flex-col sm:items-center gap-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-2.5 w-20 hidden sm:block" />
              </div>
            </div>
            <div className="flex-1 p-5 sm:p-6 space-y-3">
              {[0, 1, 2].map((b) => (
                <div key={b} className="flex items-start gap-2.5">
                  <Skeleton className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" />
                  <Skeleton className="h-3 flex-1" style={{ width: `${100 - b * 14}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
