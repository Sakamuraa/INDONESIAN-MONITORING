'use client';

import React, { useState, useMemo } from 'react';
import {
  Filter,
  MapPin,
  Clock,
  Gauge,
  AlertTriangle,
  Mountain,
  Eye,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { EarthquakeDetail, VolcanoDetail, Disaster } from '@/types/disaster';
import { DisasterListSkeleton } from '@/components/LoadingSkeletons';
import { useLanguage } from '@/lib/LanguageContext';

interface DisasterListProps {
  earthquakes: EarthquakeDetail[];
  volcanoes: VolcanoDetail[];
  isLoading?: boolean;
  onFocusMap: (lat: number, lng: number, title?: string) => void;
  onSelectDisaster: (disaster: Disaster) => void;
}

type FilterType = 'all' | 'quake-m5' | 'quake-felt' | 'volcano';

type ListItem = {
  id: string;
  category: 'earthquake' | 'volcano';
  title: string;
  location: string;
  time: string;
  magnitude?: number;
  depth?: number;
  felt?: string;
  alertLevel?: string;
  statusColor?: string;
  lat: number;
  lng: number;
  potential?: string;
  source: string;
  occurredAtRaw?: string;
  jamRaw?: string;
  raw: EarthquakeDetail | VolcanoDetail;
};

const MAX_VISIBLE = 8;

function magTone(m?: number) {
  if ((m ?? 0) >= 6) return 'bg-red-500/15 text-red-500 border-red-500/30';
  if ((m ?? 0) >= 5) return 'bg-orange-500/15 text-orange-500 border-orange-500/30';
  return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
}

function formatListTime(occurredAtRaw: string | undefined, jamRaw: string | undefined, lang: string, fallback: string) {
  if (jamRaw) return `${jamRaw} WIB`;
  if (!occurredAtRaw) return fallback;
  try {
    const d = new Date(occurredAtRaw);
    if (isNaN(d.getTime())) return occurredAtRaw;
    const locale = lang === 'en' ? 'en-GB' : 'id-ID';
    return d.toLocaleString(locale, { timeZone: 'Asia/Jakarta', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }) + ' WIB';
  } catch { return occurredAtRaw; }
}

export const DisasterList: React.FC<DisasterListProps> = ({
  earthquakes,
  volcanoes,
  isLoading = false,
  onFocusMap,
  onSelectDisaster,
}) => {
  const { t, lang } = useLanguage();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minMagnitude, setMinMagnitude] = useState<number>(0);
  const [expanded, setExpanded] = useState(false);

  const filteredItems = useMemo<ListItem[]>(() => {
    if (isLoading) return [];
    const items: ListItem[] = [];
    earthquakes.forEach((eq) => {
      const isM5 = (eq.magnitude || 0) >= 5.0;
      const isFelt = !!eq.felt;
      if (filterType === 'volcano') return;
      if (filterType === 'quake-m5' && !isM5) return;
      if (filterType === 'quake-felt' && !isFelt) return;
      if (minMagnitude > 0 && (eq.magnitude || 0) < minMagnitude) return;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchLoc = (eq.location || '').toLowerCase().includes(q);
        const matchFelt = eq.felt?.toLowerCase().includes(q);
        if (!matchLoc && !matchFelt) return;
      }
      items.push({
        id: eq.id,
        category: 'earthquake',
        title: eq.title,
        location: eq.location || t('list.region_fallback'),
        time: `${eq.occurredAt || ''} (${eq.jam || ''} WIB)`,
        occurredAtRaw: eq.occurredAt,
        jamRaw: eq.jam,
        magnitude: eq.magnitude,
        depth: eq.depth,
        felt: eq.felt,
        lat: eq.latitude || 0,
        lng: eq.longitude || 0,
        potential: eq.potential,
        source: 'BMKG',
        raw: eq,
      });
    });
    if (filterType === 'all' || filterType === 'volcano') {
      volcanoes.forEach((v) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = v.name.toLowerCase().includes(q);
          const matchProv = v.province.toLowerCase().includes(q);
          if (!matchName && !matchProv) return;
        }
        items.push({
          id: v.id,
          category: 'volcano',
          title: v.name,
          location: `${v.province} (${v.elevationMeters} mdpl)`,
          time: 'Aktivitas Terkini',
          alertLevel: v.alertLevel,
          statusColor: v.statusColor,
          lat: v.latitude,
          lng: v.longitude,
          potential: v.lastActivity,
          source: 'PVMBG / InaRISK',
          raw: v,
        });
      });
    }
    return items;
  }, [earthquakes, volcanoes, filterType, searchQuery, minMagnitude, isLoading]);

  const featured = useMemo(() => {
    const sig = [...filteredItems]
      .filter((i) => i.category === 'earthquake' && (i.magnitude ?? 0) >= 5)
      .sort((a, b) => (b.magnitude ?? 0) - (a.magnitude ?? 0))
      .slice(0, 2);
    return sig;
  }, [filteredItems]);

  const rest = useMemo(() => {
    const featIds = new Set(featured.map((f) => f.id));
    return filteredItems.filter((i) => !featIds.has(i.id));
  }, [filteredItems, featured]);

  // reset disclosure when filters change
  const visibleRest = expanded ? rest : rest.slice(0, Math.max(0, MAX_VISIBLE - featured.length));
  const visibleFeatured = expanded ? featured : featured.slice(0, Math.min(featured.length, MAX_VISIBLE));
  const totalVisible = visibleFeatured.length + visibleRest.length;
  const hasMore = filteredItems.length > MAX_VISIBLE;
  const hiddenCount = filteredItems.length - totalVisible;

  function handleSelect(item: ListItem) {
    if (item.category === 'earthquake') {
      const eq = item.raw as EarthquakeDetail;
      onSelectDisaster({
        id: eq.id,
        type: 'earthquake',
        title: eq.title,
        latitude: eq.latitude,
        longitude: eq.longitude,
        magnitude: eq.magnitude,
        depth: eq.depth,
        depthUnit: 'km',
        location: eq.location,
        severity: eq.severity,
        occurredAt: eq.occurredAt,
        source: 'BMKG',
        potential: eq.potential,
        felt: eq.felt,
        shakemapUrl: eq.shakemapUrl,
        verified: true,
      });
    } else {
      const v = item.raw as VolcanoDetail;
      onSelectDisaster({
        id: v.id,
        type: 'volcano',
        title: `${v.name} (${v.alertLevel})`,
        latitude: v.latitude,
        longitude: v.longitude,
        location: `${v.name}, ${v.province}`,
        province: v.province,
        severity: v.alertLevel.includes('Siaga') ? 'high' : 'moderate',
        occurredAt: new Date().toISOString(),
        source: 'PVMBG / InaRISK',
        potential: v.lastActivity,
        verified: true,
      });
    }
  }

  if (isLoading) return <DisasterListSkeleton />;

  const filterOpts: { id: FilterType; label: string }[] = [
    { id: 'all', label: t('list.filter_all') },
    { id: 'quake-m5', label: t('list.filter_m5') },
    { id: 'quake-felt', label: t('list.filter_felt') },
    { id: 'volcano', label: t('list.filter_volcano') },
  ];

  return (
    <div
      id="disaster-feed-container"
      className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 shadow-xs transition-colors duration-150"
    >
      {/* header - single eyebrow lives here only */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--gh-text-subtle)]">
              {t('list.active_monitor')}
            </p>
            <h2 className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-[var(--gh-text)]">
              <Filter className="h-4 w-4 text-rose-500" strokeWidth={1.75} />
              {t('list.title')}
            </h2>
            <p className="text-xs text-[var(--gh-text-muted)]">
              {t('list.count', { n: filteredItems.length })}
            </p>
          </div>

          {/* segmented control - replaces 4 equal pills */}
          <div className="flex rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] p-1">
            {filterOpts.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setFilterType(o.id);
                  setExpanded(false);
                }}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  filterType === o.id
                    ? 'bg-[#238636] text-white shadow-xs'
                    : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* search + magnitude - restrained second row */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t('list.search_ph')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setExpanded(false);
              }}
              className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-subtle)] focus:border-[var(--gh-border-active)] focus:outline-none transition shadow-xs"
            />
          </div>
          {filterType !== 'volcano' && (
            <select
              value={minMagnitude}
              onChange={(e) => {
                setMinMagnitude(Number(e.target.value));
                setExpanded(false);
              }}
              className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-[var(--gh-text)] focus:border-[var(--gh-border-active)] focus:outline-none transition shadow-xs sm:w-48"
            >
              <option value={0}>{t('list.mag_all')}</option>
              <option value={4}>{t('list.mag_4')}</option>
              <option value={5}>{t('list.mag_5')}</option>
              <option value={6}>{t('list.mag_6')}</option>
            </select>
          )}
        </div>
      </div>

      {/* empty */}
      {filteredItems.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-[var(--gh-border)] bg-[var(--gh-surface-raised)] py-12 text-center">
          <AlertTriangle className="mx-auto h-7 w-7 text-[var(--gh-text-subtle)]" strokeWidth={1.5} />
          <p className="mt-2 text-sm font-medium text-[var(--gh-text-muted)]">{t('list.empty')}</p>
          <p className="text-xs text-[var(--gh-text-subtle)]">{t('list.empty_hint')}</p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* featured - 1-2 significant quakes as primary tiles */}
          {visibleFeatured.length > 0 && (
            <section>
              <div className="mb-2.5 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[var(--gh-text)]">{t('list.featured')}</h3>
                <span className="text-[11px] text-[var(--gh-text-subtle)]">{t('list.significant_count', { n: visibleFeatured.length })}</span>
              </div>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {visibleFeatured.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] p-4 transition hover:border-[var(--gh-border-active)] hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border font-bold ${magTone(item.magnitude)}`}
                      >
                        <span className="text-[9px] uppercase tracking-widest font-mono">Mag</span>
                        <span className="text-base font-black leading-none">{item.magnitude?.toFixed(1)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-semibold text-[var(--gh-text)] group-hover:text-[var(--gh-accent)] transition">
                          {item.title}
                        </h4>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--gh-text-muted)]">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
                            {item.category === 'earthquake' && (item.occurredAtRaw || item.jamRaw) ? formatListTime(item.occurredAtRaw, item.jamRaw, lang, item.time) : item.time}
                          </span>
                          {item.depth !== undefined && (
                            <span className="inline-flex items-center gap-1">
                              <Gauge className="h-3 w-3 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
                              {t('list.depth', { n: item.depth })}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
                            {item.location}
                          </span>
                        </div>
                        {item.felt && (
                          <p className="mt-2 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2 py-1 text-xs font-mono text-amber-600">
                            {item.felt === 'Data tidak tersedia' || item.felt.toLowerCase().includes('tidak tersedia') ? t('list.no_felt') : t('list.felt', { v: item.felt })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--gh-text-muted)]">
                        {item.source}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => onFocusMap(item.lat, item.lng, item.title)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2.5 py-1 text-xs text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:border-[var(--gh-border-active)] transition"
                        >
                          <Eye className="h-3 w-3" strokeWidth={1.75} /> {t('list.focus_map')}
                        </button>
                        <button
                          onClick={() => handleSelect(item)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#238636] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#2ea043] transition shadow-xs"
                        >
                          {t('list.detail')} <ChevronRight className="h-3 w-3" strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* rest - compact 2-col grid */}
          {visibleRest.length > 0 && (
            <section>
              <div className="mb-2.5 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[var(--gh-text)]">
                  {visibleFeatured.length ? t('list.others') : t('list.monitored')}
                </h3>
                <span className="text-[11px] text-[var(--gh-text-subtle)]">
                  {t('list.total_showing', { total: filteredItems.length, visible: totalVisible })}{!expanded && hasMore ? '' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {visibleRest.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] p-3 transition hover:border-[var(--gh-border-active)]"
                  >
                    <div className="flex items-start gap-2.5">
                      {item.category === 'earthquake' ? (
                        <div className={`flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg border text-[10px] font-bold ${magTone(item.magnitude)}`}>
                          <span className="text-[8px] font-mono uppercase leading-none">M</span>
                          <span className="text-xs font-black leading-none">{item.magnitude?.toFixed(1)}</span>
                        </div>
                      ) : (
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-xs"
                          style={{ backgroundColor: item.statusColor || '#ea580c' }}
                        >
                          <Mountain className="h-4 w-4" strokeWidth={1.75} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="truncate text-xs font-semibold text-[var(--gh-text)] group-hover:text-[var(--gh-accent)] transition">
                            {item.title}
                          </h4>
                          {item.alertLevel && (
                            <span
                              className="shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium leading-none"
                              style={{
                                backgroundColor: `${item.statusColor}18`,
                                color: item.statusColor,
                                borderColor: `${item.statusColor}40`,
                              }}
                            >
                              {item.alertLevel}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-[11px] text-[var(--gh-text-muted)]">
                          {item.location} · {item.category === 'earthquake' && (item.occurredAtRaw || item.jamRaw) ? formatListTime(item.occurredAtRaw, item.jamRaw, lang, item.time) : item.time}
                          {item.depth !== undefined ? ` · ${t('list.depth', { n: item.depth })}` : ''}
                        </p>
                        {item.felt && (
                          <p className="mt-1 truncate text-[11px] font-mono text-amber-600">{item.felt === 'Data tidak tersedia' || item.felt.toLowerCase().includes('tidak tersedia') ? t('list.no_felt') : t('list.felt', { v: item.felt })}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between border-t border-[var(--gh-border)] pt-2">
                      <span className="text-[10px] font-mono text-[var(--gh-text-subtle)]">{item.source}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onFocusMap(item.lat, item.lng, item.title)}
                          aria-label={`${t('list.focus_map')} ${item.title}`}
                          className="rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] p-1 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:border-[var(--gh-border-active)] transition"
                        >
                          <Eye className="h-3 w-3" strokeWidth={1.75} />
                        </button>
                        <button
                          onClick={() => handleSelect(item)}
                          className="inline-flex items-center gap-0.5 rounded-md bg-[var(--gh-bg)] border border-[var(--gh-border)] px-2 py-1 text-[11px] font-medium text-[var(--gh-text)] hover:border-[var(--gh-border-active)] transition"
                        >
                          {t('list.detail')} <ChevronRight className="h-3 w-3" strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* disclosure */}
          {hasMore && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] py-2.5 text-xs font-medium text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:border-[var(--gh-border-active)] hover:bg-[var(--gh-bg)] transition"
            >
              {expanded ? (
                <>{t('list.show_less')} <ChevronDown className="h-3.5 w-3.5 rotate-180 transition-transform" strokeWidth={1.75} /></>
              ) : (
                <>{t('list.show_more', { n: filteredItems.length, k: hiddenCount })} <ChevronDown className="h-3.5 w-3.5 transition-transform" strokeWidth={1.75} /></>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
