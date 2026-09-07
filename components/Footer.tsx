'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[var(--gh-border)] bg-[var(--gh-surface)] px-4 py-10 text-xs text-[var(--gh-text-muted)]">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Integrity disclaimer */}
        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] p-4">
          <p className="leading-relaxed text-[var(--gh-text-muted)]">
            Seluruh data seismik dan ancaman bahaya disinkronisasi langsung dari server resmi{' '}
            <strong className="text-[var(--gh-text)]">BMKG</strong>,{' '}
            <strong className="text-[var(--gh-text)]">BNPB/InaRISK</strong>, dan{' '}
            <strong className="text-[var(--gh-text)]">PVMBG/MAGMA Indonesia</strong> tanpa interpolasi
            model bahasa atau estimasi berbasis AI.
          </p>
        </div>

        {/* Grid: 1 wide story + 1 compact sources + 1 compact emergency */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* Story — spans 3 */}
          <div className="md:col-span-3">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--gh-text)]">
              Tentang OnheilAlert
            </h4>
            <p className="leading-relaxed text-[var(--gh-text-muted)]">
              Platform monitoring bencana Indonesia yang mengutamakan data resmi dan transparansi. Tidak
              ada AI, tidak ada prediksi mesin, hanya visualisasi data aktual dari BMKG, BNPB, dan PVMBG
              yang dikemas untuk aksesibilitas publik. Dibangun dengan Next.js, MapLibre GL, dan API
              Gateway Golang (Fiber).
            </p>
          </div>

          {/* Sources */}
          <div className="md:col-span-1">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--gh-text)]">
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
                    className="transition hover:text-[var(--gh-accent)]"
                  >
                    {src.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div className="md:col-span-1">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--gh-text)]">
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
                  <a
                    href={`tel:${c.num}`}
                    className="font-semibold text-[var(--gh-text)] transition hover:text-[var(--gh-accent)]"
                  >
                    {c.num}
                  </a>
                  <span className="text-[10px] text-[var(--gh-text-subtle)]">{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--gh-border)] pt-6 text-center text-[11px] text-[var(--gh-text-muted)] sm:text-left">
          <span>&copy; {new Date().getFullYear()} The Onheil Foundation. Hak Cipta Dilindungi Undang-Undang.</span>
        </div>
      </div>
    </footer>
  );
};
