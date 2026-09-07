'use client';

import React from 'react';
import { MapPin, Clock, Gauge, AlertTriangle, ChevronRight, Eye, ShieldCheck } from 'lucide-react';
import { EarthquakeDetail } from '@/types/disaster';
import { LatestQuakeCardSkeleton } from '@/components/LoadingSkeletons';
import { useLanguage } from '@/lib/LanguageContext';

interface LatestQuakeCardProps {
  quake: EarthquakeDetail | null;
  isLoading?: boolean;
  onViewOnMap: (lat: number, lng: number, title: string) => void;
  onOpenDetails: (quake: EarthquakeDetail) => void;
}

export const LatestQuakeCard: React.FC<LatestQuakeCardProps> = ({
  quake,
  isLoading = false,
  onViewOnMap,
  onOpenDetails,
}) => {
  const { t } = useLanguage();
  if (isLoading || !quake) {
    return <LatestQuakeCardSkeleton />;
  }

  const mag = quake.magnitude ?? 0;
  const isSignificant = mag >= 5.0;
  const isCritical = quake.severity === 'critical' || mag >= 5.5;

  const severityLabel = isCritical ? t('quake.level_critical') : isSignificant ? t('quake.level_significant') : t('quake.level_moderate');
  const severityTone = isCritical
    ? 'bg-red-500/10 text-red-500 border-red-500/20'
    : isSignificant
      ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';

  // ponytail: WIB via Intl Asia/Jakarta, upgrade to date-fns-tz if locale complexity grows
  const formatWIB = (iso?: string, jam?: string) => {
    if (jam) return `${jam} WIB`;
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return (
        d.toLocaleString('id-ID', {
          timeZone: 'Asia/Jakarta',
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' WIB'
      );
    } catch {
      return iso;
    }
  };

  const hasCoords = Boolean(
    (quake.lintang && quake.bujur) || (quake.latitude != null && quake.longitude != null)
  );
  const coordLabel =
    quake.lintang && quake.bujur
      ? `${quake.lintang}, ${quake.bujur}`
      : quake.latitude != null
        ? `${quake.latitude.toFixed(4)}, ${quake.longitude?.toFixed(4)}`
        : '';

  const fallbackSeed = encodeURIComponent(String(quake.id ?? `${quake.latitude}-${quake.longitude}`));
  const fallbackUrl = `https://picsum.photos/seed/${fallbackSeed}/640/480`;
  const [imgError, setImgError] = React.useState(false);
  const imgSrc = !imgError && quake.shakemapUrl ? quake.shakemapUrl : fallbackUrl;
  const isFallback = imgError || !quake.shakemapUrl;

  return (
    <div
      id="latest-earthquake-showcase"
      className="relative overflow-hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 shadow-xs transition-colors duration-150"
    >
      {/* Header - clean, no Guncangan, sentence discipline */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--gh-border)] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--gh-text)]">
            {t('quake.latest_title')}
          </span>
          <span className="rounded-md border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] px-2 py-0.5 font-mono text-[11px] text-[var(--gh-text-muted)]">
            {t('quake.bmkg')}
          </span>
        </div>

        {quake.tsunamiPotential ? (
          <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">
            <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t('quake.tsunami_yes')}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t('quake.tsunami_no')}
          </span>
        )}
      </div>

      {/* Editorial manifesto - asymmetric 60/40, no 3-equal */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left 60% - hero stacked vertically */}
        <div className="flex flex-col lg:col-span-3">
          {/* Magnitude - mono 48-56px premium */}
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[52px] font-semibold leading-none tracking-tighter text-[var(--gh-text)] md:text-[56px]">
              M {quake.magnitude !== undefined ? quake.magnitude.toFixed(1) : '--'}
            </span>
            <span
              className={`rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${severityTone}`}
            >
              {severityLabel}
            </span>
          </div>

          {/* Meta stacked vertically, not row */}
          <div className="mt-5 space-y-2.5 border-t border-[var(--gh-border)] pt-5">
            <div className="flex items-center gap-2 text-xs text-[var(--gh-text-muted)]">
              <Clock className="h-3.5 w-3.5 shrink-0 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
              <span className="font-mono text-[var(--gh-text)]">{formatWIB(quake.occurredAt, quake.jam)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--gh-text-muted)]">
              <Gauge className="h-3.5 w-3.5 shrink-0 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
              <span>
                {t('quake.depth')} <strong className="font-mono font-semibold text-[var(--gh-text)]">{quake.depth} km</strong>
              </span>
            </div>
            {hasCoords && coordLabel && (
              <div className="flex items-center gap-2 text-xs text-[var(--gh-text-muted)]">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
                <span>
                  {t('quake.coords')} <span className="font-mono text-[var(--gh-text)]">{coordLabel}</span>
                </span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="mt-6">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--gh-text-muted)]">
              {t('quake.epi')}
            </span>
            <h3 className="mt-1.5 text-sm font-semibold leading-snug tracking-tight text-[var(--gh-text)]">
              {quake.location}
            </h3>

            {quake.potential && (
              <div className="mt-3 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] p-3 text-xs leading-relaxed text-[var(--gh-text-muted)]">
                <span className="font-semibold text-[var(--gh-text)]">{t('quake.advisory')}</span>
                {quake.potential}
              </div>
            )}

            {quake.felt && (
              <div className="mt-3 border-t border-[var(--gh-border)] pt-3">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--gh-text-muted)]">
                  {t('quake.felt')}
                </span>
                <p className="mt-1 font-mono text-xs leading-relaxed text-[var(--gh-text-muted)]">{quake.felt}</p>
              </div>
            )}
          </div>

          {/* Actions - gh-accent only on primary */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              id="btn-view-latest-quake-on-map"
              onClick={() => onViewOnMap(quake.latitude || 0, quake.longitude || 0, quake.location || '')}
              className="flex items-center gap-1.5 rounded-xl bg-[var(--gh-accent)] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:opacity-90 active:scale-[0.98]"
            >
              <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
              {t('quake.view_map')}
            </button>
            <button
              id="btn-open-latest-quake-details"
              onClick={() => onOpenDetails(quake)}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] px-4 py-2 text-xs font-semibold text-[var(--gh-text)] shadow-xs transition hover:bg-[var(--gh-border)] active:scale-[0.98]"
            >
              {t('quake.detail')}
              <ChevronRight className="h-3.5 w-3.5 text-[var(--gh-text-muted)]" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Right 40% - shakemap crowns */}
        <div className="lg:col-span-2">
          <div className="group relative overflow-hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface-raised)]">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--gh-bg)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc}
                alt={isFallback ? t('quake.illus') : t('quake.shakemap')}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                loading="lazy"
                onError={() => setImgError(true)}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-60" />
              <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-white backdrop-blur">
                {isFallback ? t('quake.illus') : t('quake.shakemap')}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="font-mono text-[11px] text-[var(--gh-text-muted)]">
                {quake.latitude?.toFixed(2)}, {quake.longitude?.toFixed(2)}
              </span>
              <span className="text-[11px] font-medium text-[var(--gh-text-muted)]">{t('quake.source_bmkg')}</span>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[var(--gh-text-muted)]">
            {t('quake.visual_desc')}
          </p>
        </div>
      </div>
    </div>
  );
};
