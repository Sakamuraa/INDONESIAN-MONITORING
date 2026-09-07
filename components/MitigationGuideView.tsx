'use client';

import React, { useState } from 'react';
import {
  Activity,
  Waves,
  Mountain,
  Droplets,
  Flame,
  LifeBuoy,
  Info,
} from 'lucide-react';

/* ── Hazard tab definitions ─────────────────────────────────────────────── */
const HAZARD_TABS = [
  { key: 'earthquake' as const, icon: Activity, label: 'Gempa Bumi', color: 'orange' },
  { key: 'tsunami' as const, icon: Waves, label: 'Tsunami (20-20-20)', color: 'blue' },
  { key: 'volcano' as const, icon: Mountain, label: 'Erupsi Gunung Api', color: 'red' },
  { key: 'flood' as const, icon: Droplets, label: 'Banjir & Bandang', color: 'cyan' },
  { key: 'mmi' as const, icon: Info, label: 'Tabel Skala MMI', color: 'purple' },
];

/* ── Earthquake timeline data ───────────────────────────────────────────── */
const EQ_STEPS = [
  {
    label: 'Pra-Bencana',
    sub: 'Sebelum Gempa',
    color: 'amber',
    iconBg: 'bg-amber-500/8 border-amber-500/20 text-amber-500',
    numBg: 'bg-amber-500/6 border-amber-500/15',
    items: [
      'Pastikan struktur rumah tahan gempa. Tata perabotan berat menempel kuat ke dinding.',
      'Tentukan tempat aman di setiap ruangan — di bawah meja kokoh, dekat pilar utama.',
      'Siapkan Tas Siaga Bencana: senter, P3K, air minum, peluit, dokumen identitas.',
      'Ketahui cara mematikan saklar listrik utama, regulator gas LPG, dan kran air PDAM.',
    ],
  },
  {
    label: 'Tanggap Darurat',
    sub: 'Saat Terjadi Gempa',
    color: 'red',
    iconBg: 'bg-red-500/10 border-red-500/25 text-red-500',
    numBg: 'bg-red-500/8 border-red-500/20',
    items: [
      'DROP, COVER, HOLD ON — berlutut, lindungi kepala dan leher, atau berlindung di bawah meja.',
      'Jangan gunakan lift. Gunakan tangga darurat setelah getaran berhenti.',
      'Di luar gedung: jauhi dinding kaca, tiang listrik, papan reklame, pohon besar.',
      'Saat berkendara: tepikan mobil ke bahu jalan, jauh dari jembatan layang dan tebing.',
    ],
  },
  {
    label: 'Pasca-Bencana',
    sub: 'Setelah Gempa',
    color: 'emerald',
    iconBg: 'bg-emerald-500/8 border-emerald-500/20 text-emerald-500',
    numBg: 'bg-emerald-500/6 border-emerald-500/15',
    items: [
      'Waspadai gempa susulan. Tetap di titik kumpul terbuka.',
      'Periksa kebocoran pipa gas dan korsleting kabel sebelum menyalakan api atau saklar.',
      'Bantu korban luka ringan. Evakuasi lansia dan anak-anak ke posko medis terdekat.',
      'Pantau rilis resmi BMKG terkait potensi tsunami atau parameter magnitudo akhir.',
    ],
  },
];

/* ── Volcano status levels data ─────────────────────────────────────────── */
const VOLCANO_LEVELS = [
  { level: 'Level I (Normal)', color: 'emerald', desc: 'Aktivitas dasar visual dan seismik tidak memperlihatkan peningkatan kelainan.' },
  { level: 'Level II (Waspada)', color: 'yellow', desc: 'Mulai ada peningkatan aktivitas seismik dan visual kawah. Pembatasan radius dekat kawah.' },
  { level: 'Level III (Siaga)', color: 'orange', desc: 'Peningkatan seismik nyata yang dapat berlanjut ke erupsi. Warga KRB bersiap mengungsi.' },
  { level: 'Level IV (Awas)', color: 'red', desc: 'Letusan utama sedang/segera terjadi. Pengungsian total seluruh warga dalam radius bahaya.' },
];

/* ── Flood timeline data ────────────────────────────────────────────────── */
const FLOOD_STEPS = [
  { phase: 'Pra-Banjir', color: 'cyan', desc: 'Tinggikan peralatan elektronik, bersihkan saluran air, amankan surat penting di kantong kedap air, kenali titik evakuasi bebas genangan.' },
  { phase: 'Saat Banjir', color: 'amber', desc: 'Matikan instalasi listrik di meteran utama. Hindari berjalan atau menyetir menerobos arus air deras yang dapat menghanyutkan kendaraan.' },
  { phase: 'Pasca-Banjir', color: 'emerald', desc: 'Waspadai binatang berbisa (ular/kelabang). Bersihkan endapan lumpur dengan desinfektan. Pastikan instalasi listrik kering sebelum dihidupkan.' },
];

/* ── MMI scale data ─────────────────────────────────────────────────────── */
const MMI_ROWS = [
  { range: 'I – II', color: 'emerald', desc: 'Getaran tidak dirasakan atau hanya dirasakan oleh beberapa orang dalam keadaan diam. Benda ringan yang digantung bergoyang.' },
  { range: 'III – IV', color: 'yellow', desc: 'Getaran dirasakan nyata di dalam rumah seakan-akan ada truk berlalu. Jendela, pintu berderik, dinding berbunyi.' },
  { range: 'V – VI', color: 'orange', desc: 'Getaran dirasakan oleh hampir semua penduduk. Orang banyak terbangun, gerabah pecah, barang terpelanting, plester dinding retak ringan.' },
  { range: 'VII – VIII', color: 'red', desc: 'Kerusakan ringan pada bangunan konstruksi baik. Bangunan sederhana roboh, cerobong asap roboh, perabot berat bergeser.' },
];

/* ── Main component ─────────────────────────────────────────────────────── */
export const MitigationGuideView: React.FC = () => {
  const [activeHazard, setActiveHazard] = useState<
    'earthquake' | 'tsunami' | 'volcano' | 'flood' | 'mmi'
  >('earthquake');

  return (
    <div id="mitigation-guide-container" className="space-y-5 transition-colors duration-150">
      {/* ── Header + Tabs ─────────────────────────────────────── */}
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] px-5 py-4 sm:px-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <LifeBuoy className="h-5 w-5 text-[var(--gh-danger)]" strokeWidth={1.75} />
          <h2 className="text-base sm:text-lg font-bold text-[var(--gh-text)]">
            Panduan Mitigasi & Kesiapsiagaan Bencana
          </h2>
        </div>
        <p className="mt-1 text-xs text-[var(--gh-text-muted)] max-w-3xl leading-relaxed">
          SOP keselamatan mandiri, keluarga, dan komunitas berdasarkan panduan resmi BNPB.
        </p>

        {/* Tab bar — slightly irregular widths, not uniform pills */}
        <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-[var(--gh-border)]">
          {HAZARD_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveHazard(t.key)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium border transition ${
                activeHazard === t.key
                  ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] border-[var(--gh-border-active)] shadow-sm'
                  : 'text-[var(--gh-text-muted)] border-transparent hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]'
              }`}
            >
              <t.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Earthquake — Editorial Timeline ────────────────────── */}
      {activeHazard === 'earthquake' && (
        <div className="space-y-3">
          {EQ_STEPS.map((step, idx) => (
            <div
              key={step.label}
              className={`rounded-xl border border-[var(--gh-border)] overflow-hidden ${
                idx === 1
                  ? 'bg-red-500/5 border-red-500/20'
                  : 'bg-[var(--gh-surface)]'
              }`}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Left — Icon + Number column */}
                <div className="flex sm:flex-col items-center gap-3 sm:gap-2 px-5 py-4 sm:w-44 shrink-0 sm:border-r border-b sm:border-b-0 border-[var(--gh-border)] bg-[var(--gh-surface-raised)]/50">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-mono font-bold ${step.numBg}`}>
                    {idx + 1}
                  </span>
                  <div className="flex flex-col sm:items-center">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${
                      step.color === 'amber' ? 'text-amber-500' :
                      step.color === 'red' ? 'text-red-500' :
                      'text-emerald-500'
                    }`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-[var(--gh-text-subtle)] mt-0.5 hidden sm:block">
                      {step.sub}
                    </span>
                  </div>
                </div>

                {/* Right — Body */}
                <div className="flex-1 p-5 sm:p-6">
                  <ul className="space-y-2.5">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-[var(--gh-text-muted)] leading-relaxed">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                          step.color === 'amber' ? 'bg-amber-500/60' :
                          step.color === 'red' ? 'bg-red-500/60' :
                          'bg-emerald-500/60'
                        }`} />
                        <span dangerouslySetInnerHTML={{
                          __html: item.replace(
                            /^(DROP, COVER, HOLD ON)/,
                            '<strong class="text-[var(--gh-text)] font-semibold">$1</strong>'
                          )
                        }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tsunami — 20-20-20 Card ────────────────────────────── */}
      {activeHazard === 'tsunami' && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Waves className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--gh-text)]">Metode Evakuasi Mandiri 20 – 20 – 20</h3>
              <p className="text-[11px] text-[var(--gh-text-muted)]">Aturan emas penyelamatan diri di kawasan pesisir rawan tsunami (BNPB)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { num: '20', unit: 'Detik', color: 'red', label: 'Goncangan Gempa', desc: 'Gempa terasa kuat terus menerus selama 20 detik atau lebih' },
              { num: '20', unit: 'Menit', color: 'orange', label: 'Waktu Evakuasi', desc: 'Lari menjauhi pantai dalam < 20 menit tanpa menunggu sirine' },
              { num: '20', unit: 'Meter', color: 'emerald', label: 'Ketinggian Aman', desc: 'Bukit atau bangunan vertikal ≥ 20 m di atas muka laut' },
            ].map((c) => (
              <div key={c.unit} className="rounded-lg bg-[var(--gh-surface-raised)] p-4 border border-[var(--gh-border)]">
                <span className={`text-2xl sm:text-3xl font-bold font-mono ${
                  c.color === 'red' ? 'text-red-500' :
                  c.color === 'orange' ? 'text-orange-500' :
                  'text-emerald-500'
                }`}>{c.num} <span className="text-lg">{c.unit}</span></span>
                <span className="block text-xs font-semibold text-[var(--gh-text)] mt-1.5">{c.label}</span>
                <p className="text-[11px] text-[var(--gh-text-muted)] mt-1 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Volcano — Status Levels ────────────────────────────── */}
      {activeHazard === 'volcano' && (
        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Mountain className="h-4 w-4 text-orange-500" strokeWidth={1.75} />
            <h3 className="text-sm sm:text-base font-bold text-[var(--gh-text)]">Tingkatan Status Gunung Api Indonesia (PVMBG)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VOLCANO_LEVELS.map((lv) => (
              <div key={lv.level} className={`rounded-lg bg-[var(--gh-surface-raised)] p-3.5 border ${
                lv.color === 'emerald' ? 'border-emerald-500/20' :
                lv.color === 'yellow' ? 'border-yellow-500/20' :
                lv.color === 'orange' ? 'border-orange-500/20' :
                'border-red-500/20'
              }`}>
                <span className={`text-xs font-semibold block mb-1 ${
                  lv.color === 'emerald' ? 'text-emerald-500' :
                  lv.color === 'yellow' ? 'text-yellow-500' :
                  lv.color === 'orange' ? 'text-orange-500' :
                  'text-red-500'
                }`}>{lv.level}</span>
                <p className="text-[11px] text-[var(--gh-text-muted)] leading-relaxed">{lv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Flood — Asymmetric Timeline ────────────────────────── */}
      {activeHazard === 'flood' && (
        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-cyan-500" strokeWidth={1.75} />
            <h3 className="text-sm sm:text-base font-bold text-[var(--gh-text)]">Panduan Menghadapi Banjir & Banjir Bandang</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FLOOD_STEPS.map((s) => (
              <div key={s.phase} className="rounded-lg bg-[var(--gh-surface-raised)] p-3.5 border border-[var(--gh-border)]">
                <span className={`text-xs font-semibold block mb-1.5 ${
                  s.color === 'cyan' ? 'text-cyan-500' :
                  s.color === 'amber' ? 'text-amber-500' :
                  'text-emerald-500'
                }`}>{s.phase}</span>
                <p className="text-[11px] text-[var(--gh-text-muted)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MMI Scale Table ────────────────────────────────────── */}
      {activeHazard === 'mmi' && (
        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 shadow-sm space-y-4">
          <div className="border-b border-[var(--gh-border)] pb-3">
            <h3 className="text-sm sm:text-base font-bold text-[var(--gh-text)]">Tabel Skala Intensitas Gempa MMI (BMKG)</h3>
            <p className="text-[11px] text-[var(--gh-text-muted)]">Klasifikasi berdasarkan dampak permukaan dan persepsi manusia</p>
          </div>
          <div className="space-y-2">
            {MMI_ROWS.map((r) => (
              <div key={r.range} className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)] flex items-start gap-3">
                <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded bg-[var(--gh-surface)] border shrink-0 ${
                  r.color === 'emerald' ? 'text-emerald-500 border-emerald-500/20' :
                  r.color === 'yellow' ? 'text-yellow-500 border-yellow-500/20' :
                  r.color === 'orange' ? 'text-orange-500 border-orange-500/20' :
                  'text-red-500 border-red-500/20'
                }`}>{r.range} MMI</span>
                <span className="text-[11px] text-[var(--gh-text-muted)] leading-relaxed">{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
