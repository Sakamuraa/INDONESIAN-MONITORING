'use client';

import React, { useState } from 'react';
import {
  Search,
  MapPin,
  BookOpen,
  Compass,
} from 'lucide-react';
import { RegionRiskProfile } from '@/types/risk';
import { OFFICIAL_DISTRICT_RISK, DistrictRiskProfile } from '@/lib/inarisk-data';
import { RegionExplorerSkeleton } from '@/components/LoadingSkeletons';

interface RegionExplorerViewProps {
  provinces: RegionRiskProfile[];
  isLoading?: boolean;
  onFocusMap: (lat: number, lng: number, title?: string) => void;
}

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

const TOP_PROVINCES_COUNT = 4;

export const RegionExplorerView: React.FC<RegionExplorerViewProps> = ({
  provinces,
  isLoading = false,
  onFocusMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<RegionRiskProfile>(provinces[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictRiskProfile | null>(null);

  if (isLoading || provinces.length === 0) {
    return <RegionExplorerSkeleton />;
  }

  const filteredProvinces = provinces.filter((p) =>
    p.provinceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableDistricts = OFFICIAL_DISTRICT_RISK.filter(
    (d) => d.provinceCode === selectedProvince?.provinceCode
  );

  const activeBreakdown = selectedDistrict
    ? selectedDistrict.riskBreakdown
    : selectedProvince.riskBreakdown;
  const activeCapacity = selectedDistrict ? selectedDistrict.capacityLevel : selectedProvince.capacityLevel;
  const activeName = selectedDistrict ? selectedDistrict.districtName : selectedProvince.provinceName;

  return (
    <div id="region-explorer-container" className="space-y-5">
      {/* Header with search */}
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Compass className="h-5 w-5 text-[var(--gh-accent)] flex-shrink-0" strokeWidth={1.75} />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--gh-text)] leading-tight">
                Eksplorasi Profil Risiko Wilayah
              </h2>
              <p className="text-xs text-[var(--gh-text-muted)]">
                Profil ketahanan daerah, indeks IRBI, dan kerentanan per provinsi
              </p>
            </div>
          </div>
          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Cari provinsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] pl-9 pr-3 py-2 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-subtle)] focus:border-[var(--gh-border-active)] focus:outline-none transition"
            />
          </div>
        </div>

        {/* Top province quick-select — max 4, no pill spam */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {filteredProvinces.slice(0, TOP_PROVINCES_COUNT).map((p) => (
            <button
              key={p.provinceCode}
              onClick={() => {
                setSelectedProvince(p);
                setSelectedDistrict(null);
              }}
              className={`rounded-md px-2.5 py-1 text-xs font-medium border transition ${
                selectedProvince?.provinceCode === p.provinceCode
                  ? 'border-[var(--gh-accent)] bg-[var(--gh-accent)]/10 text-[var(--gh-accent)]'
                  : 'border-[var(--gh-border)] bg-[var(--gh-surface-raised)] text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
              }`}
            >
              {p.provinceName}
            </button>
          ))}
          {filteredProvinces.length > TOP_PROVINCES_COUNT && (
            <span className="text-[11px] text-[var(--gh-text-subtle)] self-center ml-1">
              +{filteredProvinces.length - TOP_PROVINCES_COUNT} lainnya
            </span>
          )}
        </div>
      </div>

      {selectedProvince && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 60%: Main province profile */}
          <div className="lg:col-span-7 space-y-4">
            {/* Map thumbnail + province header */}
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] overflow-hidden">
              {/* Map thumbnail placeholder */}
              <div className="relative h-40 bg-[var(--gh-surface-raised)]">
                <img
                  src={`https://picsum.photos/seed/${selectedProvince.provinceCode}/800/200`}
                  alt={`Peta ${selectedProvince.provinceName}`}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--gh-surface)] via-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--gh-accent)]">
                      Provinsi Terpilih
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[var(--gh-text)] leading-tight">
                      {selectedProvince.provinceName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-[var(--gh-text-muted)] block">IRBI</span>
                    <span className="text-2xl sm:text-3xl font-black font-mono leading-none text-[var(--gh-accent)]">
                      {selectedProvince.irbiScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="px-4 py-3 border-t border-[var(--gh-border)] flex items-center gap-4 text-xs">
                <div>
                  <span className="text-[var(--gh-text-muted)]">Tingkat Risiko: </span>
                  <span className={`font-semibold ${selectedProvince.irbiClass === 'Tinggi' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {selectedProvince.irbiClass}
                  </span>
                </div>
                <div className="h-3 w-px bg-[var(--gh-border)]" />
                <div>
                  <span className="text-[var(--gh-text-muted)]">Kapasitas: </span>
                  <span className="font-mono font-semibold text-[var(--gh-text)]">{activeCapacity}</span>
                </div>
                <div className="h-3 w-px bg-[var(--gh-border)]" />
                <div>
                  <span className="text-[var(--gh-text-muted)]">Sumber: </span>
                  <span className="text-[var(--gh-text)]">{selectedProvince.source}</span>
                </div>
              </div>
            </div>

            {/* District selector — compact dropdown feel, not pills */}
            {availableDistricts.length > 0 && (
              <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--gh-text-muted)] block mb-2">
                  Kabupaten / Kota
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedDistrict(null)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium border transition ${
                      selectedDistrict === null
                        ? 'border-[var(--gh-accent)] bg-[var(--gh-accent)]/10 text-[var(--gh-accent)]'
                        : 'border-[var(--gh-border)] text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
                    }`}
                  >
                    Semua
                  </button>
                  {availableDistricts.map((d) => (
                    <button
                      key={d.districtCode}
                      onClick={() => setSelectedDistrict(d)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium border transition ${
                        selectedDistrict?.districtCode === d.districtCode
                          ? 'border-[var(--gh-accent)] bg-[var(--gh-accent)]/10 text-[var(--gh-accent)]'
                          : 'border-[var(--gh-border)] text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
                      }`}
                    >
                      {d.districtName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* District detail banner */}
            {selectedDistrict && (
              <div className="rounded-xl border border-[var(--gh-accent)]/20 bg-[var(--gh-accent)]/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-[var(--gh-accent)]">Tingkat Kab/Kota</span>
                    <h4 className="text-base font-bold text-[var(--gh-text)]">{selectedDistrict.districtName}</h4>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-lg font-bold text-[var(--gh-text)]">{selectedDistrict.irbiScore}</span>
                    <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold rounded border border-[var(--gh-accent)]/20 bg-[var(--gh-accent)]/10 text-[var(--gh-accent)]">
                      {selectedDistrict.irbiClass}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Hazard matrix — no center-aligned pill spam, left-aligned list */}
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--gh-text-muted)] mb-3">
                Matriks Bahaya &mdash; {activeName}
              </h4>
              <div className="space-y-1.5">
                {Object.entries(activeBreakdown).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between rounded-lg bg-[var(--gh-surface-raised)] px-3 py-2 border border-[var(--gh-border)]"
                  >
                    <span className="text-xs text-[var(--gh-text-muted)]">{HAZARD_NAMES[k] || k}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        v === 'Tinggi'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : v === 'Sedang'
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 40%: Recommendations sidebar */}
          <div className="lg:col-span-5 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5">
            <div className="flex items-center gap-2 text-[var(--gh-text)] font-semibold text-xs uppercase tracking-wider border-b border-[var(--gh-border)] pb-3 mb-4">
              <BookOpen className="h-4 w-4 text-[var(--gh-accent)]" strokeWidth={1.75} />
              Rekomendasi Kesiapsiagaan
            </div>

            <div className="space-y-3 text-xs text-[var(--gh-text)]">
              <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
                <span className="font-semibold block mb-1">1. Jalur & Titik Evakuasi</span>
                <p className="text-[var(--gh-text-muted)] leading-relaxed text-[11px]">
                  Kenali lokasi Tempat Evakuasi Sementara (TES) dan Tempat Evakuasi Akhir (TEA) resmi di sekitar pemukiman Anda.
                </p>
              </div>

              <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
                <span className="font-semibold block mb-1">2. Tas Siaga Bencana</span>
                <p className="text-[var(--gh-text-muted)] leading-relaxed text-[11px]">
                  Dokumen berharga, obat-obatan, senter, peluit, air bersih, makanan tahan lama &mdash; kebutuhan mandiri 3 hari.
                </p>
              </div>

              <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
                <span className="font-semibold block mb-1">3. Kontak Darurat BPBD</span>
                <p className="text-[var(--gh-text-muted)] leading-relaxed text-[11px]">
                  Simpan nomor Call Center 112 atau Posko BPBD {selectedProvince.provinceName} di ponsel Anda.
                </p>
              </div>

              <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
                <span className="font-semibold block mb-1">4. Verifikasi Informasi</span>
                <p className="text-[var(--gh-text-muted)] leading-relaxed text-[11px]">
                  Ikuti informasi resmi dari BMKG, portal InaRISK BNPB, dan instansi berwenang.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
