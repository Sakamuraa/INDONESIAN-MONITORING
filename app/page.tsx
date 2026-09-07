'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { AlertBanner } from '@/components/AlertBanner';
import { StatsOverview } from '@/components/StatsOverview';
import { LatestQuakeCard } from '@/components/LatestQuakeCard';
import { InteractiveMap } from '@/components/InteractiveMap';
import { DisasterList } from '@/components/DisasterList';
import { DisasterDetailModal } from '@/components/DisasterDetailModal';
import { RiskMapView } from '@/components/RiskMapView';
import { RegionExplorerView } from '@/components/RegionExplorerView';
import { MitigationGuideView } from '@/components/MitigationGuideView';
import { VolcanoMonitorView } from '@/components/VolcanoMonitorView';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';

import { EarthquakeDetail, VolcanoDetail, Disaster } from '@/types/disaster';
import { RegionRiskProfile, GisLayerConfig } from '@/types/risk';
import { OFFICIAL_ACTIVE_VOLCANOES, INARISK_GIS_LAYERS, OFFICIAL_PROVINCE_RISK } from '@/lib/inarisk-data';
import { Flame } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'volcanoes' | 'risk' | 'regions' | 'mitigation'>('dashboard');

  const [latestQuake, setLatestQuake] = useState<EarthquakeDetail | null>(null);
  const [earthquakes, setEarthquakes] = useState<EarthquakeDetail[]>([]);
  const [volcanoes, setVolcanoes] = useState<VolcanoDetail[]>(OFFICIAL_ACTIVE_VOLCANOES);
  const [provinces, setProvinces] = useState<RegionRiskProfile[]>(OFFICIAL_PROVINCE_RISK);
  const [riskLayers, setRiskLayers] = useState<GisLayerConfig[]>(INARISK_GIS_LAYERS);

  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; title?: string } | null>(null);

  const siagaVolcanoCount = React.useMemo(() => {
    return volcanoes.filter((v) => {
      const lvl = (v.alertLevel || v.status || '').toLowerCase();
      return (
        lvl.includes('siaga') ||
        lvl.includes('awas') ||
        lvl.includes('level 3') ||
        lvl.includes('level 4') ||
        lvl.includes('level iii') ||
        lvl.includes('level iv')
      );
    }).length;
  }, [volcanoes]);

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const resLatest = await fetch('/api/earthquakes/latest', { cache: 'no-store' });
      const dataLatest = await resLatest.json();
      if (dataLatest.success && dataLatest.data) {
        setLatestQuake(dataLatest.data);
      }

      const resQuakes = await fetch('/api/earthquakes', { cache: 'no-store' });
      const dataQuakes = await resQuakes.json();
      if (dataQuakes.success && dataQuakes.data) {
        setEarthquakes(dataQuakes.data);
      }

      const resVolcanoes = await fetch('/api/volcanoes', { cache: 'no-store' });
      const dataVolcanoes = await resVolcanoes.json();
      if (dataVolcanoes.success && Array.isArray(dataVolcanoes.data)) {
        const mapped = dataVolcanoes.data
          .filter((v: any) => v.latitude != null && v.longitude != null)
          .map((v: any) => ({
            id: v.id,
            name: v.name,
            latitude: v.latitude,
            longitude: v.longitude,
            elevationMeters: v.elevation,
            province: v.province,
            alertLevel: v.status || 'Level I (Normal)',
            statusColor: v.statusColor || '#059669',
            lastActivity: v.lastActivity || v.status,
            source: 'PVMBG / MAGMA Indonesia',
            reportUrl: v.reportUrl,
            recommendation: v.recommendation,
          }));
        if (mapped.length > 0) {
          setVolcanoes(mapped);
        }
      }

      const resRisk = await fetch('/api/risk', { cache: 'no-store' });
      const dataRisk = await resRisk.json();
      if (dataRisk.success && dataRisk.provinces) {
        setProvinces(dataRisk.provinces);
      }

      const resLayers = await fetch('/api/map/layers', { cache: 'no-store' });
      const dataLayers = await resLayers.json();
      if (dataLayers.success && dataLayers.data) {
        setRiskLayers(dataLayers.data);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching disaster data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        const tab = searchParams.get('tab');
        if (tab === 'volcanoes' || tab === 'map' || tab === 'risk' || tab === 'regions' || tab === 'mitigation' || tab === 'dashboard') {
          setActiveTab(tab as any);
        }
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        const name = searchParams.get('name');
        if (lat && lng) {
          setSelectedLocation({ lat: parseFloat(lat), lng: parseFloat(lng), title: name || undefined });
        }
      }
    }, 0);

    const runInitialFetch = async () => {
      await loadData(false);
    };
    runInitialFetch();

    const interval = setInterval(() => {
      if (isMounted) {
        loadData(true);
      }
    }, 60000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [loadData]);

  const handleFocusMap = (lat: number, lng: number, title?: string) => {
    setSelectedLocation({ lat, lng, title });
    setActiveTab('map');
  };

  const handleSelectProvinceByName = (name: string) => {
    const prov = provinces.find((p) => p.provinceName.toLowerCase().includes(name.toLowerCase()));
    if (prov) {
      setActiveTab('regions');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--gh-bg)] text-[var(--gh-text)] font-sans antialiased">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={() => loadData(true)}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <AlertBanner
        latestDisaster={
          latestQuake
            ? {
                id: latestQuake.id,
                type: 'earthquake',
                title: latestQuake.title,
                latitude: latestQuake.latitude,
                longitude: latestQuake.longitude,
                magnitude: latestQuake.magnitude,
                depth: latestQuake.depth,
                depthUnit: 'km',
                location: latestQuake.location,
                severity: latestQuake.severity,
                occurredAt: latestQuake.occurredAt,
                source: 'BMKG',
                potential: latestQuake.potential,
                tsunamiPotential: latestQuake.tsunamiPotential,
                shakemapUrl: latestQuake.shakemapUrl,
                verified: true,
              }
            : null
        }
        onSelectDisaster={(d) => setSelectedDisaster(d)}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-5 pb-8 sm:px-6 pb-24 md:pb-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            <StatsOverview
              latestQuake={latestQuake}
              allEarthquakes={earthquakes}
              volcanoes={volcanoes}
              provinces={provinces}
              isLoading={loading}
              onOpenQuakeTab={() => setActiveTab('dashboard')}
              onOpenVolcanoTab={() => setActiveTab('volcanoes')}
              onOpenRiskTab={() => setActiveTab('risk')}
            />

            {/* Volcano banner — calm, left content, right asset, sentence case, no dot */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] px-4 py-4 sm:px-5 shadow-xs">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold tracking-tight text-[var(--gh-text)]">
                    Volcano monitor
                  </span>
                  <span className="rounded border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] px-2 py-0.5 text-[11px] font-medium text-[var(--gh-text-muted)]">
                    PVMBG / MAGMA
                  </span>
                </div>
                <p className="mt-1 max-w-[65ch] text-xs leading-relaxed text-[var(--gh-text-muted)]">
                  {volcanoes.length} gunung api dipantau resmi. Status Level I-IV dan riwayat erupsi terkini.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
                <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-500">
                  <Flame className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <button
                  onClick={() => setActiveTab('volcanoes')}
                  className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] px-3 py-1.5 text-xs font-medium text-[var(--gh-text)] transition hover:border-[var(--gh-border-active)] hover:bg-[var(--gh-btn-hover)] active:scale-[0.98]"
                >
                  Buka monitor &rarr;
                </button>
              </div>
            </div>

            <LatestQuakeCard
              quake={latestQuake}
              isLoading={loading}
              onViewOnMap={(lat, lng, title) => handleFocusMap(lat, lng, title)}
              onOpenDetails={(q) => {
                setSelectedDisaster({
                  id: q.id,
                  type: 'earthquake',
                  title: q.title,
                  latitude: q.latitude,
                  longitude: q.longitude,
                  magnitude: q.magnitude,
                  depth: q.depth,
                  depthUnit: 'km',
                  location: q.location,
                  severity: q.severity,
                  occurredAt: q.occurredAt,
                  source: 'BMKG',
                  potential: q.potential,
                  felt: q.felt,
                  shakemapUrl: q.shakemapUrl,
                  verified: true,
                });
              }}
            />

            {/* Map + List — distinct grid family (12-col), not bento, not editorial */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div className="lg:col-span-7">
                {/* Vertical stack header — not split-header */}
                <div className="mb-3">
                  <h2 className="text-sm font-semibold tracking-tight text-[var(--gh-text)]">
                    Peta pantauan bencana interaktif
                  </h2>
                  <p className="mt-1 max-w-[65ch] text-xs leading-relaxed text-[var(--gh-text-muted)]">
                    Sebaran seismik BMKG, vulkanik PVMBG, dan layer bahaya InaRISK dalam satu peta.
                  </p>
                  <button
                    onClick={() => setActiveTab('map')}
                    className="mt-2 text-xs font-medium text-[var(--gh-accent)] hover:underline"
                  >
                    Buka mode layar penuh &rarr;
                  </button>
                </div>
                <InteractiveMap
                  earthquakes={earthquakes}
                  volcanoes={volcanoes}
                  latestQuake={latestQuake}
                  riskLayers={riskLayers}
                  selectedLocation={selectedLocation}
                  onSelectDisaster={(d) => setSelectedDisaster(d)}
                />
              </div>

              <div className="lg:col-span-5">
                <DisasterList
                  earthquakes={earthquakes}
                  volcanoes={volcanoes}
                  isLoading={loading}
                  onFocusMap={(lat, lng, title) => handleFocusMap(lat, lng, title)}
                  onSelectDisaster={(d) => setSelectedDisaster(d)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-4">
            {/* Vertical stack — not split-header */}
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-[var(--gh-text)]">
                Peta interaktif kebencanaan Indonesia
              </h1>
              <p className="mt-1 max-w-[65ch] text-xs leading-relaxed text-[var(--gh-text-muted)]">
                Visualisasi GIS seismik BMKG, PVMBG, dan layer bahaya InaRISK BNPB.
              </p>
              <span className="mt-2 inline-flex rounded-md border border-[var(--gh-border)] bg-[var(--gh-surface)] px-2.5 py-1 font-mono text-[11px] text-[var(--gh-text-muted)]">
                WGS 84 • EPSG:4326
              </span>
            </div>

            <InteractiveMap
              earthquakes={earthquakes}
              volcanoes={volcanoes}
              latestQuake={latestQuake}
              riskLayers={riskLayers}
              selectedLocation={selectedLocation}
              onSelectDisaster={(d) => setSelectedDisaster(d)}
            />
          </div>
        )}

        {activeTab === 'risk' && (
          <RiskMapView
            provinces={provinces}
            riskLayers={riskLayers}
            isLoading={loading}
            onSelectProvince={(prov) => {}}
          />
        )}

        {activeTab === 'regions' && (
          <RegionExplorerView
            provinces={provinces}
            isLoading={loading}
            onFocusMap={(lat, lng, title) => handleFocusMap(lat, lng, title)}
          />
        )}

        {activeTab === 'mitigation' && <MitigationGuideView />}

        {activeTab === 'volcanoes' && (
          <VolcanoMonitorView
            onFocusMap={(lat, lng, title) => handleFocusMap(lat, lng, title)}
          />
        )}
      </main>

      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        siagaVolcanoCount={siagaVolcanoCount}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onFocusMap={(lat, lng, title) => handleFocusMap(lat, lng, title)}
        onSelectDisaster={(d) => setSelectedDisaster(d)}
        onSelectProvinceByName={handleSelectProvinceByName}
      />

      <DisasterDetailModal
        disaster={selectedDisaster}
        onClose={() => setSelectedDisaster(null)}
        onViewOnMap={(lat, lng, title) => handleFocusMap(lat, lng, title)}
      />

      <Footer />
    </div>
  );
}
