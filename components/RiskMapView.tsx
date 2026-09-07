'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ChevronRight,
  Layers,
  Info,
  TrendingUp,
} from 'lucide-react';
import { RegionRiskProfile, GisLayerConfig } from '@/types/risk';
import { RiskMapViewSkeleton } from '@/components/LoadingSkeletons';

interface RiskMapViewProps {
  provinces: RegionRiskProfile[];
  riskLayers: GisLayerConfig[];
  isLoading?: boolean;
  onSelectProvince: (province: RegionRiskProfile) => void;
}

const RISK_GROUPS = ['Tinggi', 'Sedang', 'Rendah'] as const;

const HAZARD_NAMES: Record<string, string> = {
  gempa: 'Gempa Bumi',
  banjir: 'Banjir',
  longsor: 'Tanah Longsor',
  tsunami: 'Tsunami',
  karhutla: 'Karhutla',
  gunungapi: 'Gunung Api',
  kekeringan: 'Kekeringan',
  likuefaksi: 'Likuefaksi',
};

export const RiskMapView: React.FC<RiskMapViewProps> = ({
  provinces,
  riskLayers,
  isLoading = false,
  onSelectProvince,
}) => {
  const [selectedHazard, setSelectedHazard] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [activeProvince, setActiveProvince] = useState<RegionRiskProfile | null>(provinces[0] || null);

  if (isLoading || provinces.length === 0) {
    return <RiskMapViewSkeleton />;
  }

  const filteredProvinces = provinces.filter((p) => {
    if (selectedClass !== 'all' && p.irbiClass !== selectedClass) return false;
    return true;
  });

  const groupedByRisk = useMemo(() => {
    const groups: Record<string, RegionRiskProfile[]> = { Tinggi: [], Sedang: [], Rendah: [] };
    for (const p of filteredProvinces) {
      if (groups[p.irbiClass]) groups[p.irbiClass].push(p);
    }
    for (const key of RISK_GROUPS) {
      groups[key].sort((a, b) => b.irbiScore - a.irbiScore);
    }
    return groups;
  }, [filteredProvinces]);

  const counts = useMemo(() => ({
    Tinggi: provinces.filter((p) => p.irbiClass === 'Tinggi').length,
    Sedang: provinces.filter((p) => p.irbiClass === 'Sedang').length,
    Rendah: provinces.filter((p) => p.irbiClass === 'Rendah').length,
    total: provinces.length,
  }), [provinces]);

  return (
    <div id="inarisk-risk-map-view" className="space-y-5">
      {/* Header: compact formula + pillars */}
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="h-5 w-5 text-[var(--gh-accent)]" strokeWidth={1.75} />
              <h2 className="text-base sm:text-lg font-bold text-[var(--gh-text)]">
                Indeks Risiko Bencana Indonesia (IRBI)
              </h2>
            </div>
            <p className="text-xs text-[var(--gh-text-muted)] max-w-2xl leading-relaxed">
              Metrik standar nasional BNPB untuk menilai potensi kerugian jiwa, ekonomi, dan lingkungan akibat bencana di seluruh provinsi dan kabupaten/kota.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] px-3 py-2 flex-shrink-0">
            <span className="font-mono text-[11px] text-[var(--gh-text-muted)] block">
              Risiko = (<span className="text-orange-500">H</span> &times; <span className="text-yellow-500">V</span>) / <span className="text-emerald-500">C</span>
            </span>
          </div>
        </div>

        {/* Pillars: single line chips, not 3 equal cards */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: 'Bahaya (H)', color: 'text-orange-500', desc: 'Frekuensi & intensitas fenomena alam' },
            { label: 'Kerentanan (V)', color: 'text-yellow-500', desc: 'Kondisi fisik, sosial, ekonomi' },
            { label: 'Kapasitas (C)', color: 'text-emerald-500', desc: 'Kesiapsiagaan & infrastruktur' },
          ].map((pillar) => (
            <div
              key={pillar.label}
              className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] px-3 py-2 text-xs"
            >
              <span className={`font-semibold ${pillar.color}`}>{pillar.label}</span>
              <span className="text-[var(--gh-text-muted)] ml-2 text-[11px]">{pillar.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main: Choropleth-style grouped list + detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Segmented province list by risk level */}
        <div className="lg:col-span-7 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5">
          <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-3 mb-4">
            <div>
              <h3 className="text-xs font-semibold text-[var(--gh-text)] uppercase tracking-wider">
                Peringkat Provinsi per Level Risiko
              </h3>
              <span className="text-[11px] text-[var(--gh-text-muted)]">
                IRBI 2024 &middot; {counts.total} provinsi
              </span>
            </div>

            {/* Count chips */}
            <div className="flex items-center gap-1.5">
              {RISK_GROUPS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedClass(selectedClass === level ? 'all' : level)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition ${
                    selectedClass === level
                      ? 'border-[var(--gh-accent)] bg-[var(--gh-accent)]/10 text-[var(--gh-accent)]'
                      : 'border-[var(--gh-border)] bg-[var(--gh-surface-raised)] text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
                  }`}
                >
                  <span>{level}</span>
                  <span className="font-mono font-bold">{counts[level]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grouped list */}
          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
            {selectedClass === 'all' ? (
              RISK_GROUPS.map((level) => {
                const items = groupedByRisk[level];
                if (items.length === 0) return null;
                return (
                  <div key={level}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--gh-text-muted)]">
                        {level}
                      </span>
                      <span className="font-mono text-[11px] text-[var(--gh-text-subtle)]">
                        {items.length} provinsi
                      </span>
                      <div className="flex-1 h-px bg-[var(--gh-border)]" />
                    </div>
                    <div className="space-y-1">
                      {items.map((prov, idx) => (
                        <ProvinceRow
                          key={prov.provinceCode}
                          prov={prov}
                          rank={idx + 1}
                          isActive={activeProvince?.provinceCode === prov.provinceCode}
                          onSelect={() => {
                            setActiveProvince(prov);
                            onSelectProvince(prov);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="space-y-1">
                {filteredProvinces.map((prov, idx) => (
                  <ProvinceRow
                    key={prov.provinceCode}
                    prov={prov}
                    rank={idx + 1}
                    isActive={activeProvince?.provinceCode === prov.provinceCode}
                    onSelect={() => {
                      setActiveProvince(prov);
                      onSelectProvince(prov);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Province detail */}
        <div className="lg:col-span-5 space-y-4">
          {activeProvince ? (
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5">
              {/* Province title + score */}
              <div className="flex items-start justify-between border-b border-[var(--gh-border)] pb-3 mb-4">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--gh-accent)] block">
                    Profil Risiko Daerah
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--gh-text)] mt-0.5 truncate">
                    {activeProvince.provinceName}
                  </h3>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <span className="text-[10px] text-[var(--gh-text-muted)] block uppercase">Skor IRBI</span>
                  <span className="text-2xl sm:text-3xl font-black text-[var(--gh-accent)] font-mono leading-none">
                    {activeProvince.irbiScore}
                  </span>
                </div>
              </div>

              {/* Risk breakdown */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--gh-text-muted)] block mb-2">
                  Matriks Bahaya per Jenis Ancaman
                </span>
                <div className="space-y-1.5">
                  {Object.entries(activeProvince.riskBreakdown).map(([hazardKey, riskLevel]) => (
                    <div
                      key={hazardKey}
                      className="flex items-center justify-between rounded-lg bg-[var(--gh-surface-raised)] px-3 py-2 border border-[var(--gh-border)]"
                    >
                      <span className="text-xs text-[var(--gh-text-muted)]">
                        {HAZARD_NAMES[hazardKey] || hazardKey}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          riskLevel === 'Tinggi'
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : riskLevel === 'Sedang'
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}
                      >
                        {riskLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hazard score bars */}
              {activeProvince.hazardScores && activeProvince.hazardScores.length > 0 && (
                <div className="pt-3 border-t border-[var(--gh-border)]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--gh-text-muted)] block mb-2">
                    Indeks Komparatif (Skala 0&ndash;200)
                  </span>
                  <div className="space-y-2">
                    {activeProvince.hazardScores.map((h, i) => {
                      const score = h.score ?? 0;
                      const pct = Math.min(100, (score / 200) * 100);
                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-[var(--gh-text-muted)]">{h.hazardNameId}</span>
                            <span className="font-mono text-[var(--gh-text)] font-medium">{score.toFixed(1)}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[var(--gh-accent)]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Capacity + source */}
              <div className="mt-4 pt-3 border-t border-[var(--gh-border)] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[var(--gh-text-muted)]">Kapasitas: </span>
                  <span className="font-mono font-semibold text-[var(--gh-text)]">{activeProvince.capacityLevel}</span>
                </div>
                <div className="text-[var(--gh-text-muted)] flex items-center gap-1">
                  <Layers className="h-3 w-3" strokeWidth={1.75} />
                  ArcGIS BNPB
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-10 text-center text-[var(--gh-text-muted)] text-xs">
              Pilih provinsi untuk melihat profil risiko
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── ProvinceRow ─────────────────────────────────────────────────────────── */

const ProvinceRow: React.FC<{
  prov: RegionRiskProfile;
  rank: number;
  isActive: boolean;
  onSelect: () => void;
}> = ({ prov, rank, isActive, onSelect }) => (
  <div
    onClick={onSelect}
    className={`cursor-pointer rounded-lg px-3 py-2.5 border transition flex items-center justify-between ${
      isActive
        ? 'border-[var(--gh-accent)] bg-[var(--gh-accent)]/8'
        : 'border-[var(--gh-border)] bg-[var(--gh-surface)] hover:border-[var(--gh-border-active)] hover:bg-[var(--gh-surface-raised)]'
    }`}
  >
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="font-mono text-[11px] text-[var(--gh-text-subtle)] w-5 text-right flex-shrink-0">
        {rank}
      </span>
      <span className="text-xs sm:text-sm font-semibold text-[var(--gh-text)] truncate">
        {prov.provinceName}
      </span>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
      <span className="font-mono text-sm font-bold text-[var(--gh-text)]">{prov.irbiScore}</span>
      <ChevronRight className="h-3.5 w-3.5 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
    </div>
  </div>
);
