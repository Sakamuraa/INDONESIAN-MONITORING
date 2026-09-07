'use client';

import React from 'react';
import { Activity, Flame, ShieldAlert, Mountain, ArrowUpRight } from 'lucide-react';
import { EarthquakeDetail, VolcanoDetail } from '@/types/disaster';
import { RegionRiskProfile } from '@/types/risk';
import { StatsOverviewSkeleton } from '@/components/LoadingSkeletons';
import { useLanguage } from '@/lib/LanguageContext';

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
  const { t } = useLanguage();
  if (isLoading) return <StatsOverviewSkeleton />;

  const activeAlertVolcanoes = volcanoes.filter((v) => {
    const lvl = (v.alertLevel || v.status || '').toLowerCase();
    return lvl.includes('siaga') || lvl.includes('awas');
  });
  const highRiskProvinces = provinces.filter((p) => p.irbiClass === 'Tinggi');

  const heroThumb = latestQuake?.shakemapUrl || 'https://picsum.photos/seed/onheil-seismic/640/460';
  const volcanoThumb = 'https://picsum.photos/seed/onheil-volcano/320/200';

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* HERO 7/12 — Gempa Terkini — amber accent, image + gradient */}
      <button
        id="stat-card-latest-quake"
        onClick={onOpenQuakeTab}
        className="group relative overflow-hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] text-left transition duration-200 hover:border-[var(--gh-border-active)] lg:col-span-7 flex flex-col min-h-[220px]"
      >
        {/* amber glow wash + image, not flat card */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_260px_at_85%_-20%,var(--gh-accent-soft),transparent_60%)] group-hover:opacity-100 transition" />
        <div className="flex flex-1 flex-col p-5 pr-4 sm:p-6 sm:pr-5">
          <div className="relative flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] text-[var(--gh-accent)]">
              <Activity className="h-3.5 w-3.5" strokeWidth={1.75} />
            </span>
            <span className="text-xs font-medium text-[var(--gh-text-muted)]">{t('stats.latest')}</span>
            <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--gh-text-subtle)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gh-success)]" />
              BMKG
            </span>
          </div>

          <div className="relative mt-4 flex items-baseline gap-2.5">
            <span className="font-mono text-4xl font-bold leading-none tracking-tighter text-[var(--gh-text)] sm:text-[44px]">
              {latestQuake ? `M ${latestQuake.magnitude}` : 'M --'}
            </span>
            <span className="text-sm font-medium text-[var(--gh-text-muted)]">
              {latestQuake ? `${latestQuake.depth ?? 0} km ${t('stats.latest_depth')}` : `-- km ${t('stats.latest_depth')}`}
            </span>
          </div>

          <p className="relative mt-2 line-clamp-1 max-w-[48ch] text-sm leading-relaxed text-[var(--gh-text-muted)]">
            {latestQuake?.location || t('stats.latest_wait')}
          </p>
          <p className="relative mt-1 text-[11px] text-[var(--gh-text-subtle)]">
            {latestQuake?.tanggal || ''}
            {latestQuake?.jam ? ` ${latestQuake.jam} WIB` : ''}
          </p>

          <span className="relative mt-auto pt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--gh-accent)]">
            {t('stats.view_catalog')}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
          </span>
        </div>

        {/* right asset — real visual, dark editorial */}
        <div className="relative hidden w-[190px] shrink-0 overflow-hidden border-l border-[var(--gh-border)] sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroThumb}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-90 grayscale-[25%] transition duration-300 group-hover:grayscale-0"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/seed/onheil-seismic-fallback/320/220';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--gh-surface)] via-[var(--gh-surface)]/20 to-transparent" />
          <span className="absolute bottom-2 left-2 font-mono text-[10px] text-[var(--gh-text-muted)]">
            {latestQuake?.lintang || t('stats.map_shake')}
          </span>
        </div>
      </button>

      {/* CELL 2 — 5/12 — Total Gempa — amber gradient wash, single accent */}
      <button
        id="stat-card-total-quakes"
        onClick={onOpenQuakeTab}
        className="group relative overflow-hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 text-left transition duration-200 hover:border-[var(--gh-border-active)] lg:col-span-5 flex flex-col justify-between"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(340px_220px_at_85%_0%,var(--gh-accent-soft),transparent_60%)] group-hover:opacity-100 transition" />
        <div className="relative flex items-start justify-between">
          <span className="text-xs font-medium text-[var(--gh-text-muted)]">{t('stats.total')}</span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] text-[var(--gh-text-muted)] group-hover:text-[var(--gh-accent)] transition">
            <Flame className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
        </div>
        <div className="relative mt-3 flex items-baseline gap-2">
          <span className="font-mono text-4xl font-bold tracking-tighter text-[var(--gh-text)]">{allEarthquakes.length}</span>
          <span className="text-xs font-medium text-[var(--gh-text-muted)]">{t('stats.total_sub')}</span>
        </div>
        <p className="relative mt-1 text-xs text-[var(--gh-text-subtle)]">{t('stats.total_desc')}</p>
      </button>

      {/* CELL 3 — 4/12 — Gunung Api — semantic top hairline (level cue only), image strip */}
      <button
        id="stat-card-volcanoes"
        onClick={onOpenVolcanoTab}
        className="group relative overflow-hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] text-left transition duration-200 hover:border-[var(--gh-border-active)] lg:col-span-4 flex flex-col"
      >
        <div
          className="h-0.5 w-full shrink-0"
          style={{ background: activeAlertVolcanoes.length > 0 ? 'var(--gh-warning)' : 'var(--gh-border)' }}
        />
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[var(--gh-text-muted)]">{t('stats.volcano')}</p>
            <Mountain className="h-3.5 w-3.5 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className="font-mono text-4xl font-bold tracking-tighter"
              style={{ color: activeAlertVolcanoes.length > 0 ? 'var(--gh-warning)' : 'var(--gh-text)' }}
            >
              {activeAlertVolcanoes.length}
            </span>
            <span className="text-xs text-[var(--gh-text-muted)]">{t('stats.volcano_of', { n: volcanoes.length })}</span>
          </div>
          <p className="mt-1 line-clamp-1 text-xs text-[var(--gh-text-subtle)]">{t('stats.volcano_names')}</p>
        </div>
        {/* second visual-variation cell */}
        <div className="relative mt-auto h-[72px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={volcanoThumb} alt="" className="h-full w-full object-cover opacity-70 transition group-hover:opacity-85" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--gh-surface)] via-[var(--gh-surface)]/30 to-transparent" />
          <span className="absolute bottom-2 left-3 font-mono text-[10px] text-[var(--gh-text-muted)]">PVMBG</span>
        </div>
      </button>

      {/* CELL 4 — 8/12 — Provinsi Risiko Tinggi — amber glow, inline chips, no border-t+b */}
      <button
        id="stat-card-high-risk-provinces"
        onClick={onOpenRiskTab}
        className="group relative overflow-hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 text-left transition duration-200 hover:border-[var(--gh-border-active)] lg:col-span-8 flex flex-col justify-between min-h-[200px]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(460px_240px_at_100%_100%,var(--gh-accent-soft),transparent_62%)] group-hover:opacity-100 transition" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[var(--gh-text-muted)]">{t('stats.risk')}</p>
            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="font-mono text-4xl font-bold tracking-tighter text-[var(--gh-text)]">{highRiskProvinces.length}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] px-2 py-0.5 text-xs font-medium text-[var(--gh-text-muted)]">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: highRiskProvinces.length ? 'var(--gh-danger)' : 'var(--gh-border)' }} />
                IRBI &gt; 130
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--gh-text-subtle)]">{t('stats.risk_desc')}</p>
          </div>
          <span className="hidden sm:inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] text-[var(--gh-text-subtle)] group-hover:text-[var(--gh-accent)] transition">
            <ShieldAlert className="h-5 w-5" strokeWidth={1.6} />
          </span>
        </div>

        <div className="relative mt-4 flex flex-wrap gap-1.5">
          {(highRiskProvinces.slice(0, 6).length ? highRiskProvinces.slice(0, 6) : provinces.slice(0, 6)).map((p) => (
            <span key={p.provinceCode} className="rounded-full border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] px-2.5 py-1 text-[11px] font-medium text-[var(--gh-text-muted)]">
              {p.provinceName}
            </span>
          ))}
          {highRiskProvinces.length > 6 && (
            <span className="px-1 py-1 text-[11px] text-[var(--gh-text-subtle)]">{t('stats.more', { n: highRiskProvinces.length - 6 })}</span>
          )}
        </div>

        <span className="relative mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--gh-accent)]">
          {t('stats.open_risk')}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
        </span>
      </button>
    </div>
  );
};
