'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  Search,
  MapPin,
  ExternalLink,
  Clock,
  AlertTriangle,
  Info,
  Map as MapIcon,
  Mountain,
} from 'lucide-react';
import { Volcano, VolcanicActivity, VolcanoStatusSummary } from '@/types/volcano';
import { fetchVolcanoes, fetchVolcanoStatus, fetchVolcanicActivities } from '@/lib/volcano-client';
import { VolcanoMonitorSkeleton } from '@/components/LoadingSkeletons';
import { useLanguage } from '@/lib/LanguageContext';

interface VolcanoMonitorViewProps {
  onFocusMap?: (lat: number, lng: number, title?: string) => void;
}

type LevelKey = 'awas' | 'siaga' | 'waspada' | 'normal';

function levelOf(status: string): LevelKey {
  const s = status.toLowerCase();
  if (s.includes('awas')) return 'awas';
  if (s.includes('siaga')) return 'siaga';
  if (s.includes('waspada')) return 'waspada';
  return 'normal';
}

export const VolcanoMonitorView: React.FC<VolcanoMonitorViewProps> = ({ onFocusMap }) => {
  const { t } = useLanguage();
  const [volcanoes, setVolcanoes] = useState<Volcano[]>([]);
  const [summary, setSummary] = useState<VolcanoStatusSummary | null>(null);
  const [activities, setActivities] = useState<VolcanicActivity[]>([]);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const LEVELS: { key: LevelKey; rank: number; short: string; label: string; color: string; soft: string }[] = [
    { key: 'normal', rank: 1, short: 'I', label: t('volcano.levelI'), color: 'var(--gh-success)', soft: 'rgba(63,185,80,0.12)' },
    { key: 'waspada', rank: 2, short: 'II', label: t('volcano.levelII'), color: 'var(--gh-warning)', soft: 'rgba(210,153,34,0.12)' },
    { key: 'siaga', rank: 3, short: 'III', label: t('volcano.levelIII'), color: '#d17a38', soft: 'rgba(209,122,56,0.12)' },
    { key: 'awas', rank: 4, short: 'IV', label: t('volcano.levelIV'), color: 'var(--gh-danger)', soft: 'rgba(248,81,73,0.12)' },
  ];

  const finishBatch = useCallback(
    (volcanoRes: PromiseSettledResult<{ volcanoes: Volcano[] }>, statusRes: PromiseSettledResult<VolcanoStatusSummary>, actRes: PromiseSettledResult<VolcanicActivity[]>, pending: boolean) => {
      let hasSuccess = false;
      if (volcanoRes.status === 'fulfilled') {
        setVolcanoes(volcanoRes.value.volcanoes);
        hasSuccess = true;
      }
      if (statusRes.status === 'fulfilled') {
        setSummary(statusRes.value);
        hasSuccess = true;
      }
      if (actRes.status === 'fulfilled') {
        setActivities(actRes.value);
        hasSuccess = true;
      }
      if (!hasSuccess) {
        setErrorMessage('Data gunung api sementara tidak tersedia. Sumber: PVMBG / MAGMA Indonesia');
      } else {
        setLastUpdated(new Date());
      }
      if (!pending) setLoading(false);
    },
    []
  );

  const fetchAll = useCallback(async () => {
    const [volcanoRes, statusRes, actRes] = await Promise.allSettled([
      fetchVolcanoes(),
      fetchVolcanoStatus(),
      fetchVolcanicActivities(),
    ]);
    return { volcanoRes, statusRes, actRes };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { volcanoRes, statusRes, actRes } = await fetchAll();
        if (active) finishBatch(volcanoRes, statusRes, actRes, false);
      } catch {
        if (active) {
          setErrorMessage('Data gunung api sementara tidak tersedia. Sumber: PVMBG / MAGMA Indonesia');
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [fetchAll, finishBatch]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setErrorMessage(null);
    const { volcanoRes, statusRes, actRes } = await fetchAll();
    finishBatch(volcanoRes, statusRes, actRes, true);
    setIsRefreshing(false);
  }, [fetchAll, finishBatch]);

  const filteredVolcanoes = volcanoes
    .filter((v) => {
      const matchesFilter =
        statusFilter === 'all' ||
        (statusFilter === 'awas' && v.status.toLowerCase().includes('awas')) ||
        (statusFilter === 'siaga' && v.status.toLowerCase().includes('siaga')) ||
        (statusFilter === 'waspada' && v.status.toLowerCase().includes('waspada')) ||
        (statusFilter === 'normal' && v.status.toLowerCase().includes('normal'));
      const matchesSearch =
        !searchQuery.trim() ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.province.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const ra = LEVELS.find((l) => l.key === levelOf(a.status))?.rank ?? 1;
      const rb = LEVELS.find((l) => l.key === levelOf(b.status))?.rank ?? 1;
      return rb - ra;
    });

  const byLevel = (key: LevelKey) =>
    volcanoes.filter((v) => levelOf(v.status) === key).length;

  const maxLevel = Math.max(1, ...LEVELS.map((l) => byLevel(l.key)));

  const totalMonitored = summary?.totalVolcanoes ?? volcanoes.length;
  const featured = filteredVolcanoes[0] ?? null;
  const rest = filteredVolcanoes.slice(1);

  const countsForRow: Record<string, number> = {
    all: filteredVolcanoes.length,
    awas: byLevel('awas'),
    siaga: byLevel('siaga'),
    waspada: byLevel('waspada'),
    normal: byLevel('normal'),
  };

  if (loading) {
    return <VolcanoMonitorSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--gh-text)] tracking-tight">
            {t('volcano.title')}
          </h1>
          <p className="mt-1 text-sm text-[var(--gh-text-muted)]">
            {t('volcano.sub')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-[var(--gh-text-subtle)] font-mono">
              {lastUpdated.toLocaleTimeString('id-ID')} WIB
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] px-3.5 py-2 text-sm font-medium text-[var(--gh-text)] transition hover:border-[var(--gh-border-active)] active:scale-[0.98] disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 text-[var(--gh-text-muted)] ${isRefreshing ? 'animate-spin' : ''}`}
              strokeWidth={1.75}
            />
            {t('volcano.refresh')}
          </button>
        </div>
      </header>

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" strokeWidth={1.75} />
          <div>
            <p className="text-sm font-medium text-amber-500">{errorMessage}</p>
            <p className="mt-0.5 text-xs text-[var(--gh-text-muted)]">
              Data sementara tidak dapat diambil dari MAGMA ESDM. Sistem tidak menampilkan prediksi buatan.
            </p>
          </div>
        </div>
      )}

      {/* KPI: asymmetric bento. Row 1 = level bars, Row 2 = 3 stats with variation. */}
      <section aria-label="Statistik status gunung api" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {LEVELS.map((lvl) => {
          const count = byLevel(lvl.key);
          const active = statusFilter === lvl.key;
          return (
            <button
              key={lvl.key}
              onClick={() => setStatusFilter(active ? 'all' : lvl.key)}
              className="group relative flex flex-col gap-2 rounded-xl border bg-[var(--gh-surface)] p-4 text-left transition active:scale-[0.98]"
              style={{
                borderColor: active ? lvl.color : 'var(--gh-border)',
                boxShadow: active ? `inset 0 0 0 1px ${lvl.color}` : 'none',
              }}
              aria-pressed={active}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold" style={{ color: active ? lvl.color : 'var(--gh-text)' }}>
                  {lvl.label}
                </span>
              </div>
              <div className="text-2xl font-semibold text-[var(--gh-text)] font-mono tabular-nums">
                {count}
              </div>
              <div
                className="h-1 w-full rounded-full"
                style={{ backgroundColor: lvl.soft, overflow: 'hidden' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(count / maxLevel) * 100}%`, backgroundColor: lvl.color }}
                />
              </div>
            </button>
          );
        })}
      </section>

      {/* Row 2 stats: 3 tiles, real variation in weight and treatment. */}
      <section aria-label="Ringkasan pemantauan" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative overflow-hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5">
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[var(--gh-accent)]/10 to-transparent" />
          <div className="text-xs text-[var(--gh-text-muted)]">{t('volcano.total')}</div>
          <div className="mt-1 text-3xl font-semibold text-[var(--gh-accent)] font-mono tabular-nums">
            {totalMonitored}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[var(--gh-text-subtle)]">
            <Mountain className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t('volcano.active')}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5">
          <div className="text-xs text-[var(--gh-text-muted)]">{t('volcano.recent')}</div>
          <div className="flex items-end justify-between gap-2">
            <div className="text-3xl font-semibold text-[var(--gh-text)] font-mono tabular-nums">
              {activities.length}
            </div>
            <span className="mb-1 inline-flex items-center gap-1.5 text-xs text-[var(--gh-danger)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gh-danger)]" />
              Live
            </span>
          </div>
          <div className="text-xs text-[var(--gh-text-subtle)]">{t('volcano.recent_sub')}</div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5">
          <div className="text-xs text-[var(--gh-text-muted)]">{t('volcano.source')}</div>
          <div className="text-sm font-semibold text-[var(--gh-text)]">{t('volcano.official')}</div>
          <a
            href="https://magma.esdm.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--gh-accent)] hover:underline"
          >
            {t('volcano.portal')} <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
          </a>
        </div>
      </section>

      {/* Filter + Search */}
      <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="inline-flex items-center gap-1 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-1"
          role="tablist"
          aria-label="Filter status"
        >
          {(['all', 'awas', 'siaga', 'waspada', 'normal'] as const).map((key) => {
            const lvl = key === 'all' ? null : LEVELS.find((l) => l.key === key)!;
            const active = statusFilter === key;
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                role="tab"
                aria-selected={active}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition active:scale-[0.98] ${
                  active
                    ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)]'
                    : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
                }`}
              >
                {lvl && active && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: lvl.color }} />}
                {key === 'all' ? t('volcano.all', { n: countsForRow.all }) : `${lvl!.label} (${countsForRow[key as LevelKey]})`}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('volcano.search_ph')}
            className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] py-2 pl-9 pr-8 text-sm text-[var(--gh-text)] placeholder-[var(--gh-text-subtle)] transition focus:border-[var(--gh-border-active)] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Bersihkan pencarian"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]"
            >
              <Search className="h-3.5 w-3.5 rotate-45" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </section>

      {/* Main: volcano list + activity timeline */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {filteredVolcanoes.length === 0 ? (
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-10 text-center">
              <Info className="mx-auto h-6 w-6 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
              <p className="mt-3 text-sm font-medium text-[var(--gh-text)]">
                {t('volcano.no_match')}
              </p>
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 text-sm font-medium text-[var(--gh-accent)] hover:underline"
              >
                {t('volcano.show_all')}
              </button>
            </div>
          ) : (
            <>
              {/* Featured hero: highest severity */}
              {featured && (
                <VolcanoHero volcano={featured} onFocusMap={onFocusMap} />
              )}

              {/* Compact list: 2-col tiles on desktop */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {rest.map((volcano) => (
                    <VolcanoTile key={volcano.id} volcano={volcano} onFocusMap={onFocusMap} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: activity feed as vertical timeline */}
        <aside className="space-y-4">
          <h2 className="text-sm font-semibold text-[var(--gh-text)]">{t('volcano.activity')}</h2>
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 max-h-[720px] overflow-y-auto">
            {activities.length === 0 ? (
              <p className="text-xs text-[var(--gh-text-muted)]">
                {t('volcano.no_activity')}
              </p>
            ) : (
              <ol className="relative space-y-5 border-l border-[var(--gh-border)] pl-5">
                {activities.map((act) => {
                  const lvlColor = (() => {
                    const k = levelOf(act.status);
                    if (k === 'awas') return 'var(--gh-danger)';
                    if (k === 'siaga') return '#d17a38';
                    if (k === 'waspada') return 'var(--gh-warning)';
                    return 'var(--gh-success)';
                  })();
                  return (
                  <li key={act.id} className="relative">
                    <span
                      className="absolute -left-[23px] top-1.5 h-2 w-2 rounded-full border-2 border-[var(--gh-surface)]"
                      style={{ backgroundColor: lvlColor }}
                    />
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-[var(--gh-text)]">{act.volcanoName}</span>
                      <span className="text-[11px] font-mono text-[var(--gh-text-subtle)]">{act.occurredAt}</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--gh-text-muted)] line-clamp-4">
                      {act.description}
                    </p>
                    {act.imageUrl && (
                      <div className="mt-2 overflow-hidden rounded-lg border border-[var(--gh-border)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={act.imageUrl}
                          alt={`Foto letusan ${act.volcanoName}`}
                          className="h-28 w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--gh-text-subtle)]">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" strokeWidth={1.75} />
                        {act.author ? `Observer: ${act.author}` : 'PVMBG'}
                      </span>
                      {act.sourceUrl && (
                        <a
                          href={act.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-[var(--gh-accent)] hover:underline"
                        >
                          Detail <ExternalLink className="h-2.5 w-2.5" strokeWidth={1.75} />
                        </a>
                      )}
                    </div>
                  </li>
                  );
                })}
              </ol>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

function VolcanoHero({
  volcano,
  onFocusMap,
}: {
  volcano: Volcano;
  onFocusMap?: (lat: number, lng: number, title?: string) => void;
}) {
  const { t } = useLanguage();
  const lvl = (() => {
    const k = levelOf(volcano.status);
    const map: Record<LevelKey, { label: string; color: string; soft: string }> = {
      normal: { label: t('volcano.levelI'), color: 'var(--gh-success)', soft: 'rgba(63,185,80,0.12)' },
      waspada: { label: t('volcano.levelII'), color: 'var(--gh-warning)', soft: 'rgba(210,153,34,0.12)' },
      siaga: { label: t('volcano.levelIII'), color: '#d17a38', soft: 'rgba(209,122,56,0.12)' },
      awas: { label: t('volcano.levelIV'), color: 'var(--gh-danger)', soft: 'rgba(248,81,73,0.12)' },
    };
    return map[k];
  })();
  return (
    <article
      className="relative overflow-hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6"
      style={{
        backgroundImage: `linear-gradient(120deg, ${lvl.soft} 0%, transparent 45%)`,
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-2xl font-semibold text-[var(--gh-text)] tracking-tight">
            {volcano.name}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-[var(--gh-text-muted)]">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
            {volcano.province}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-mono text-[var(--gh-text-subtle)]">
            {volcano.elevation && <span>{volcano.elevation.toLocaleString('id-ID')} mdpl</span>}
            {volcano.latitude && volcano.longitude && (
              <span>
                {volcano.latitude.toFixed(2)}°, {volcano.longitude.toFixed(2)}°
              </span>
            )}
            {volcano.recommendation && <span className="font-sans">{volcano.recommendation}</span>}
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-center gap-3 sm:flex-col sm:items-end">
          <span
            className="rounded-lg px-3 py-1 text-sm font-semibold"
            style={{ backgroundColor: lvl.soft, color: lvl.color }}
          >
            {lvl.label}
          </span>
          <div className="flex items-center gap-2">
            {volcano.latitude && volcano.longitude && onFocusMap && (
              <button
                onClick={() => onFocusMap(volcano.latitude!, volcano.longitude!, volcano.name)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] px-3 py-1.5 text-xs font-medium text-[var(--gh-text)] transition hover:border-[var(--gh-border-active)] active:scale-[0.98]"
              >
                <MapIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                Buka di peta
              </button>
            )}
            {volcano.reportUrl && (
              <a
                href={volcano.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--gh-border)] px-3 py-1.5 text-xs font-medium text-[var(--gh-text)] transition hover:border-[var(--gh-border-active)] active:scale-[0.98]"
              >
                Laporan resmi <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function VolcanoTile({
  volcano,
  onFocusMap,
}: {
  volcano: Volcano;
  onFocusMap?: (lat: number, lng: number, title?: string) => void;
}) {
  const { t } = useLanguage();
  const lvl = (() => {
    const k = levelOf(volcano.status);
    const map: Record<LevelKey, { label: string; color: string; soft: string }> = {
      normal: { label: t('volcano.levelI'), color: 'var(--gh-success)', soft: 'rgba(63,185,80,0.12)' },
      waspada: { label: t('volcano.levelII'), color: 'var(--gh-warning)', soft: 'rgba(210,153,34,0.12)' },
      siaga: { label: t('volcano.levelIII'), color: '#d17a38', soft: 'rgba(209,122,56,0.12)' },
      awas: { label: t('volcano.levelIV'), color: 'var(--gh-danger)', soft: 'rgba(248,81,73,0.12)' },
    };
    return map[k];
  })();
  return (
    <article className="group flex flex-col justify-between rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-4 transition hover:border-[var(--gh-border-active)] hover:bg-[var(--gh-surface-raised)]">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold leading-snug text-[var(--gh-text)]">
            {volcano.name}
          </h3>
          <span
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold"
            style={{ borderColor: lvl.color, color: lvl.color, backgroundColor: lvl.soft }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: lvl.color }} />
            {lvl.label}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--gh-text-muted)]">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
          <span className="truncate">{volcano.province}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--gh-border)] pt-3">
        <Link
          href={`/volcanoes/${volcano.id}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--gh-accent)] hover:underline"
        >
          Lihat detail
        </Link>
        <div className="flex items-center gap-1">
          {volcano.latitude && volcano.longitude && onFocusMap && (
            <button
              onClick={() => onFocusMap(volcano.latitude!, volcano.longitude!, volcano.name)}
              className="rounded-md p-1.5 text-[var(--gh-text-muted)] transition hover:bg-[var(--gh-btn-hover)] hover:text-[var(--gh-text)]"
              title="Tampilkan di peta interaktif"
              aria-label={`Tampilkan ${volcano.name} di peta`}
            >
              <MapIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          )}
          {volcano.reportUrl && (
            <a
              href={volcano.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-1.5 text-[var(--gh-text-muted)] transition hover:bg-[var(--gh-btn-hover)] hover:text-[var(--gh-text)]"
              title="Buka laporan resmi MAGMA ESDM"
              aria-label={`Buka laporan resmi ${volcano.name}`}
            >
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
