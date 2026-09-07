'use client';

import React from 'react';
import { Activity, Flame, ShieldAlert, Mountain } from 'lucide-react';
import { EarthquakeDetail, VolcanoDetail } from '@/types/disaster';
import { RegionRiskProfile } from '@/types/risk';
import { StatsOverviewSkeleton } from '@/components/LoadingSkeletons';

interface StatsOverviewProps {
  latestQuake: EarthquakeDetail | null;
  allEarthquakes: EarthquakeDetail[];
  volcanoes: VolcanoDetail[];
  provinces: RegionRiskProfile[];
  isLoading?: boolean;
  onOpenQuakeTab: () => void;
  onOpenVolcanoTab: () => void;
  onOpenRiskTab: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  latestQuake,
  allEarthquakes,
  volcanoes,
  provinces,
  isLoading = false,
  onOpenQuakeTab,
  onOpenVolcanoTab,
  onOpenRiskTab,
}) => {
  if (isLoading) return <StatsOverviewSkeleton />;

  const activeAlertVolcanoes = volcanoes.filter((v) => {
    const lvl = (v.alertLevel || v.status || '').toLowerCase();
    return lvl.includes('siaga') || lvl.includes('awas');
  });
  const highRiskProvinces = provinces.filter((p) => p.irbiClass === 'Tinggi');

  // shakemap or picsum fallback for hero thumb
  const heroThumb = latestQuake?.shakemapUrl || 'https://picsum.photos/seed/onheil-seismic/320/220';
  const volcanoThumb = 'https://picsum.photos/seed/onheil-volcano/320/180';

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* HERO 7/12 — Gempa Terkini — image + gradient, slightly larger */}
      <button
        id="stat-card-latest-quake"
        onClick={onOpenQuakeTab}
        className="group relative flex overflow-hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] text-left transition hover:border-[var(--gh-border-active)] lg:col-span-7 min-h-[168px]"
      >
        {/* subtle accent hairline */}
        <div className="absolute inset-x-0 top-0 h-px bg-[var(--gh-accent)] opacity-60" />
        <div className="flex flex-1 flex-col p-5 pr-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] text-[var(--gh-accent)]">
              <Activity className="h-3.5 w-3.5" strokeWidth={1.75} />
            </span>
            <span className="text-xs font-semibold tracking-wide text-[var(--gh-text-muted)]">Gempa Terkini</span>
            <span className="ml-auto rounded-full border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] px-2 py-0.5 text-[10px] font-medium text-[var(--gh-text-muted)]">BMKG realtime</span>
          </div>

          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="font-mono text-[28px] font-bold leading-none tracking-tighter text-[var(--gh-text)]">
              {latestQuake ? `M ${latestQuake.magnitude}` : 'M --'}
            </span>
            <span className="text-xs font-medium text-[var(--gh-text-muted)]">
              {latestQuake ? `${latestQuake.depth ?? 0} km` : '-- km'} kedalaman
            </span>
          </div>

          <p className="mt-1.5 line-clamp-1 text-xs leading-relaxed text-[var(--gh-text-muted)]">
            {latestQuake?.location || 'Menunggu data BMKG terbaru'}
          </p>
          <p className="mt-1 text-[11px] text-[var(--gh-text-subtle)]">
            {latestQuake?.tanggal || ''} {latestQuake?.jam ? `· ${latestQuake.jam} WIB` : ''}
          </p>

          <span className="mt-auto pt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--gh-accent)] opacity-80 group-hover:opacity-100">
            Lihat katalog <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
          </span>
        </div>

        {/* thumb — real visual variation, not flat card */}
        <div className="hidden w-[148px] shrink-0 relative overflow-hidden border-l border-[var(--gh-border)] sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroThumb}
            alt=""
            className="h-full w-full object-cover opacity-90 grayscale-[20%] group-hover:grayscale-0 transition duration-300"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/seed/onheil-seismic-fallback/320/220';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--gh-surface)]/70 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-2 rounded-md bg-[var(--gh-surface)]/90 px-1.5 py-0.5 text-[10px] font-mono text-[var(--gh-text-muted)] backdrop-blur">
            {latestQuake?.coordinatesFormatted || latestQuake?.lintang || 'Peta guncangan'}
          </div>
        </div>
      </button>

      {/* CELL 2 — 5/12 — Total Gempa — subtle gradient bg, icon top-right variation */}
      <button
        id="stat-card-total-quakes"
        onClick={onOpenQuakeTab}
        className="group relative overflow-hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 text-left transition hover:border-[var(--gh-border-active)] lg:col-span-5"
      >
        {/* gradient wash — only cell with tinted bg for bento diversity */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(420px_220px_at_85%_0%,var(--gh-accent)_0%,transparent_55%)] opacity-[0.08] group-hover:opacity-[0.12] transition" />
        <div className="relative flex items-start justify-between">
          <span className="text-xs font-semibold tracking-wide text-[var(--gh-text-muted)]">Total Gempa Signifikan</span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] text-[var(--gh-text-muted)] group-hover:text-[var(--gh-accent)] transition">
            <Flame className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
        </div>
        <div className="relative mt-3 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold tracking-tighter text-[var(--gh-text)]">{allEarthquakes.length}</span>
          <span className="text-xs font-medium text-[var(--gh-text-muted)]">M ≥ 5.0 dan dirasakan</span>
        </div>
        <p className="relative mt-1 text-xs text-[var(--gh-text-muted)]">Katalog seismik realtime BMKG</p>
        <div className="relative mt-3 h-1 overflow-hidden rounded-full bg-[var(--gh-surface-raised)]">
          <div className="h-full rounded-full bg-[var(--gh-accent)] transition-all" style={{ width: `${Math.min(100, allEarthquakes.length * 8)}%`, opacity: 0.9 }} />
        </div>
      </button>

      {/* CELL 3 — 4/12 — Gunung Api — top hairline, image strip, icon bottom */}
      <button
        id="stat-card-volcanoes"
        onClick={onOpenVolcanoTab}
        className="group relative overflow-hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] text-left transition hover:border-[var(--gh-border-active)] lg:col-span-4 flex flex-col"
      >
        {/* semantic hairline only here — level cue, not decor */}
        <div
          className="h-0.5 w-full"
          style={{ background: activeAlertVolcanoes.length > 0 ? 'var(--gh-warning)' : 'var(--gh-border)' }}
        />
        <div className="p-5 pb-3">
          <p className="text-xs font-semibold tracking-wide text-[var(--gh-text-muted)]">Gunung Api Siaga / Awas</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className="font-mono text-3xl font-bold tracking-tighter"
              style={{ color: activeAlertVolcanoes.length > 0 ? 'var(--gh-warning)' : 'var(--gh-text)' }}
            >
              {activeAlertVolcanoes.length}
            </span>
            <span className="text-xs text-[var(--gh-text-muted)]">dari {volcanoes.length} terpantau</span>
          </div>
          <p className="mt-1 line-clamp-1 text-xs text-[var(--gh-text-muted)]">Merapi, Semeru, Ibu, Lewotobi</p>
        </div>
        {/* image strip — second visual variation cell */}
        <div className="relative mt-auto h-[72px] overflow-hidden border-t border-[var(--gh-border)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={volcanoThumb} alt="" className="h-full w-full object-cover opacity-70 group-hover:opacity-80 transition" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--gh-surface)] via-[var(--gh-surface)]/40 to-transparent" />
          <span className="absolute bottom-2 left-3 inline-flex items-center gap-1 rounded-md bg-[var(--gh-surface)]/90 px-1.5 py-0.5 text-[10px] font-medium text-[var(--gh-text-muted)] backdrop-blur border border-[var(--gh-border)]">
            <Mountain className="h-3 w-3" strokeWidth={1.75} /> PVMBG
          </span>
          <span className="absolute bottom-2 right-3 inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--gh-surface)]/90 border border-[var(--gh-border)] text-[var(--gh-text-muted)] backdrop-blur">
            <Mountain className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
        </div>
      </button>

      {/* CELL 4 — 8/12 — Provinsi Risiko Tinggi — icon bottom-right, larger, semantic dot */}
      <button
        id="stat-card-high-risk-provinces"
        onClick={onOpenRiskTab}
        className="group relative overflow-hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 text-left transition hover:border-[var(--gh-border-active)] lg:col-span-8 min-h-[168px]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[var(--gh-text-muted)]">Provinsi Risiko Tinggi</p>
            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="font-mono text-3xl font-bold tracking-tighter text-[var(--gh-text)]">{highRiskProvinces.length}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] px-2 py-0.5 text-xs font-medium text-[var(--gh-text-muted)]">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: highRiskProvinces.length ? 'var(--gh-danger)' : 'var(--gh-border)' }} />
                IRBI &gt; 130
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--gh-text-muted)]">Indeks Risiko Bencana Indonesia · BNPB InaRISK</p>
          </div>
          {/* varied icon placement — bottom-right, not top */}
          <span className="hidden sm:inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] text-[var(--gh-text-muted)] group-hover:text-[var(--gh-accent)] transition">
            <ShieldAlert className="h-5 w-5" strokeWidth={1.6} />
          </span>
        </div>

        {/* inline province chips — density without table */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(highRiskProvinces.slice(0, 5).length ? highRiskProvinces.slice(0, 5) : provinces.slice(0, 5)).map((p) => (
            <span key={p.provinceCode} className="rounded-full border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] px-2 py-0.5 text-[11px] font-medium text-[var(--gh-text-muted)]">
              {p.provinceName}
            </span>
          ))}
          {highRiskProvinces.length > 5 && (
            <span className="px-1 py-0.5 text-[11px] text-[var(--gh-text-subtle)]">+{highRiskProvinces.length - 5} lagi</span>
          )}
        </div>

        <span className="pointer-events-none absolute bottom-3 right-3 hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] text-[var(--gh-text-subtle)] sm:hidden">
          <ShieldAlert className="h-4 w-4" />
        </span>
      </button>
    </div>
  );
};
