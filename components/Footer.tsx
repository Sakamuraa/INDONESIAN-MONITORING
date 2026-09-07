'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[var(--gh-border)] bg-[var(--gh-surface)] px-4 py-10 text-xs text-[var(--gh-text-muted)] transition-colors duration-150">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Integrity disclaimer — one card, compact */}
        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] p-4">
          <p className="text-[var(--gh-text-muted)] leading-relaxed">
            Seluruh data seismik dan ancaman bahaya disinkronisasi langsung dari server resmi{' '}
            <strong className="text-[var(--gh-text)]">BMKG</strong>,{' '}
            <strong className="text-[var(--gh-text)]">BNPB/InaRISK</strong>, dan{' '}
            <strong className="text-[var(--gh-text)]">PVMBG/MAGMA Indonesia</strong>{' '}
            — tanpa interpolasi model bahasa atau estimasi berbasis AI.
          </p>
        </div>

        {/* 1 wide + 2 compact columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Wide story column — 3/5 */}
          <div className="md:col-span-3">
            <h4 className="font-semibold text-[var(--gh-text)] text-xs uppercase tracking-wider mb-3">
              Tentang OnheilAlert
            </h4>
            <p className="text-[var(--gh-text-muted)] leading-relaxed">
              Platform monitoring bencana Indonesia yang mengutamakan data resmi
              dan transparansi. Tidak ada AI, tidak ada prediksi mesin — hanya
              visualisasi data aktual dari BMKG, BNPB, dan PVMBG yang dikemas
              untuk aksesibilitas publik. Dibangun dengan Next.js, MapLibre GL, dan API Gateway Golang (Fiber).
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[var(--gh-text-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              API beroperasi normal
            </div>
          </div>

          {/* Compact contact column — 1/5 */}
          <div className="md:col-span-1">
            <h4 className="font-semibold text-[var(--gh-text)] text-xs uppercase tracking-wider mb-3">
              Sumber Data
            </h4>
            <ul className="space-y-2">
              {[
                { href: 'https://data.bmkg.go.id', label: 'BMKG' },
                { href: 'https://inarisk.bnpb.go.id', label: 'InaRISK BNPB' },
                { href: 'https://magma.vsi.esdm.go.id', label: 'PVMBG/MAGMA' },
              ].map((src) => (
                <li key={src.href}>
                  <a
                    href={src.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--gh-accent)] transition"
                  >
                    {src.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Compact emergency column — 1/5 */}
          <div className="md:col-span-1">
            <h4 className="font-semibold text-[var(--gh-text)] text-xs uppercase tracking-wider mb-3">
              Darurat
            </h4>
            <ul className="space-y-2 font-mono">
              {[
                { num: '112', label: 'Darurat Nasional' },
                { num: '115', label: 'Basarnas' },
                { num: '117', label: 'Posko BNPB' },
                { num: '196', label: 'BMKG Info' },
              ].map((c) => (
                <li key={c.num} className="flex items-baseline gap-2">
                  <a href={`tel:${c.num}`} className="text-[var(--gh-text)] font-semibold hover:text-[var(--gh-accent)] transition">
                    {c.num}
                  </a>
                  <span className="text-[10px] text-[var(--gh-text-subtle)]">{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-[var(--gh-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--gh-text-muted)]">
          <span>&copy; {new Date().getFullYear()} The Onheil Foundation. Hak Cipta Dilindungi Undang-Undang.</span>
          <span className="text-[var(--gh-text-subtle)]">Koordinat WGS 84 &middot; WIB (UTC+7)</span>
        </div>
      </div>
    </footer>
  );
};
