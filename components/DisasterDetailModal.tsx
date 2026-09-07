'use client';

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  AlertTriangle, 
  Share2, 
  Check, 
  LifeBuoy, 
  ExternalLink,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { Disaster } from '@/types/disaster';
import { useLanguage } from '@/lib/LanguageContext';

interface DisasterDetailModalProps {
  disaster: Disaster | null;
  onClose: () => void;
  onViewOnMap: (lat: number, lng: number, title?: string) => void;
}

export const DisasterDetailModal: React.FC<DisasterDetailModalProps> = ({
  disaster,
  onClose,
  onViewOnMap,
}) => {
  const [copied, setCopied] = useState(false);
  const { t, lang } = useLanguage();

  if (!disaster) return null;

  const formatMultiTimezones = (dateStr?: string) => {
    if (!dateStr) return { wib: '-', wita: '-', wit: '-', utc: '-' };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return { wib: dateStr, wita: '-', wit: '-', utc: '-' };
    }

    const opts: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    return {
      wib: d.toLocaleString(lang === 'en' ? 'en-GB' : 'id-ID', { ...opts, timeZone: 'Asia/Jakarta' }) + ' WIB',
      wita: d.toLocaleString(lang === 'en' ? 'en-GB' : 'id-ID', { ...opts, timeZone: 'Asia/Makassar' }) + ' WITA',
      wit: d.toLocaleString(lang === 'en' ? 'en-GB' : 'id-ID', { ...opts, timeZone: 'Asia/Jayapura' }) + ' WIT',
      utc: d.toISOString(),
    };
  };

  const times = formatMultiTimezones(disaster.occurredAt);

  const handleShare = async () => {
    const text = t('modal.share', { title: disaster.title, loc: disaster.location || 'Indonesia', src: disaster.source });
    if (navigator.share) {
      try {
        await navigator.share({
          title: disaster.title,
          text,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const hasCoords = disaster.latitude !== undefined && disaster.longitude !== undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div
        id="disaster-detail-modal-container"
        className="relative w-full max-w-3xl rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 sm:p-7 shadow-2xl text-[var(--gh-text)] my-8 overflow-hidden transition-colors duration-150"
      >
        <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-4">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-2.5 w-2.5 rounded-full ${
                disaster.severity === 'critical'
                  ? 'bg-red-500'
                  : disaster.severity === 'high'
                  ? 'bg-orange-500'
                  : 'bg-yellow-400'
              }`}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--gh-text-muted)]">
              Detail Resmi Bencana ({disaster.source})
            </span>
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500 border border-emerald-500/20">
              {lang === 'en' ? 'Verified' : 'Terverifikasi'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-md bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] px-3 py-1.5 text-xs text-[var(--gh-text)] hover:bg-[var(--gh-btn-hover)] transition"
              title={t('modal.share_btn')}
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.75} /> : <Share2 className="h-3.5 w-3.5 text-[var(--gh-text-muted)]" strokeWidth={1.75} />}
              <span>{copied ? t('modal.copied') : t('modal.share_btn')}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-[var(--gh-text-muted)] hover:bg-[var(--gh-surface-raised)] hover:text-[var(--gh-text)] transition"
              title={t('modal.close')}
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--gh-text)] leading-tight">
            {disaster.title}
          </h2>
          <p className="mt-1 text-xs text-[var(--gh-text-muted)] flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-rose-500" strokeWidth={1.75} />
            {disaster.location || 'Wilayah Indonesia'}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {disaster.magnitude !== undefined && (
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--gh-text-muted)]">
                Magnitudo
              </span>
              <p className="mt-1 text-2xl font-bold text-[var(--gh-text)]">
                M {disaster.magnitude.toFixed(1)}
              </p>
            </div>
          )}

          {disaster.depth !== undefined && (
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--gh-text-muted)]">
                {t('modal.depth')}
              </span>
              <p className="mt-1 text-2xl font-bold text-[var(--gh-text)]">
                {disaster.depth} <span className="text-xs font-normal text-[var(--gh-text-muted)]">km</span>
              </p>
            </div>
          )}

          <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--gh-text-muted)]">
              {t('modal.tsunami_pot')}
            </span>
            <p className="mt-1 text-xs font-semibold text-[var(--gh-text)] leading-tight">
              {disaster.tsunamiPotential ? (
                <span className="text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.75} /> {lang === 'en' ? 'Potential' : 'Berpotensi'}
                </span>
              ) : (
                <span className="text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} /> {lang === 'en' ? 'No Potential' : 'Tidak Berpotensi'}
                </span>
              )}
            </p>
          </div>

          <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--gh-text-muted)]">
              {t('modal.severity')}
            </span>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-rose-500">
              {disaster.severity || 'Moderat'}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-[var(--gh-surface-raised)] p-4 border border-[var(--gh-border)] text-xs space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <span className="text-[var(--gh-text-muted)] block font-medium">{t('modal.time_wib')}</span>
              <span className="text-[var(--gh-text)] font-mono">{times.wib}</span>
            </div>
            <div>
              <span className="text-[var(--gh-text-muted)] block font-medium">{t('modal.time_wita')}</span>
              <span className="text-[var(--gh-text)] font-mono">{times.wita}</span>
            </div>
            <div>
              <span className="text-[var(--gh-text-muted)] block font-medium">{t('modal.time_wit')}</span>
              <span className="text-[var(--gh-text)] font-mono">{times.wit}</span>
            </div>
          </div>

          {hasCoords && (
            <div className="pt-2 border-t border-[var(--gh-border)] flex flex-wrap items-center justify-between gap-2">
              <span className="text-[var(--gh-text-muted)]">
                {t('modal.coords', { c: `${disaster.latitude!.toFixed(4)}, ${disaster.longitude!.toFixed(4)}` })}
              </span>
              <button
                onClick={() => {
                  onClose();
                  onViewOnMap(disaster.latitude!, disaster.longitude!, disaster.title);
                }}
                className="flex items-center gap-1 rounded-md bg-[var(--gh-bg)] border border-[var(--gh-border)] px-2.5 py-1 text-xs font-medium text-[var(--gh-text)] hover:border-[var(--gh-border-active)] transition"
              >
                <Compass className="h-3.5 w-3.5 text-rose-500" strokeWidth={1.75} />
                {t('modal.to_map')}
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {disaster.shakemapUrl && (
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)] text-center">
              <span className="text-xs font-medium text-[var(--gh-text-muted)] block mb-2">
                {t('modal.shakemap')}
              </span>
              <img
                src={disaster.shakemapUrl}
                alt="Shakemap BMKG"
                className="w-full max-h-56 object-contain rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)]"
                loading="lazy"
              />
            </div>
          )}

          {disaster.felt && (
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-4 border border-[var(--gh-border)] flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-amber-500 block mb-1">
                  {t('modal.felt_area')}
                </span>
                <p className="text-xs text-[var(--gh-text)] font-mono leading-relaxed whitespace-pre-line">
                  {disaster.felt}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[var(--gh-border)] text-[11px] text-[var(--gh-text-subtle)]">
                {t('modal.mmi_note')}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-xs">
          <div className="flex items-center gap-2 text-amber-500 font-semibold mb-2">
            <LifeBuoy className="h-4 w-4" strokeWidth={1.75} />
            {t('modal.mitigation')}
          </div>
          <ul className="list-disc pl-4 space-y-1.5 text-[var(--gh-text)]">
            {disaster.type === 'earthquake' ? (
              <>
                <li><strong>{lang === 'en' ? 'During shaking:' : 'Saat Goncangan:'}</strong> {lang === 'en' ? 'Protect head and neck (Drop, Cover, Hold On). Crouch under a sturdy table.' : 'Lindungi kepala dan leher (Drop, Cover, Hold On). Menunduk dan berlindung di bawah meja yang kokoh.'}</li>
                <li><strong>{lang === 'en' ? 'Aftershocks:' : 'Waspadai Gempa Susulan:'}</strong> {lang === 'en' ? 'Stay away from tall buildings, cracked walls, power poles, and landslide-prone slopes.' : 'Jauhi gedung bertingkat, dinding retak, tiang listrik, dan lereng tebing rawan longsor.'}</li>
                <li><strong>{lang === 'en' ? 'If on the coast:' : 'Jika Berada di Pesisir:'}</strong> {lang === 'en' ? 'Evacuate immediately to high ground if shaking is strong for more than 20 seconds without waiting for sirens.' : 'Segera evakuasi mandiri ke tempat tinggi jika goncangan gempa terasa kuat lebih dari 20 detik tanpa menunggu sirine resmi.'}</li>
                <li><strong>{lang === 'en' ? 'Verified info:' : 'Informasi Valid:'}</strong> {lang === 'en' ? 'Trust only official BMKG and BNPB/BPBD channels. Do not spread unverified rumors.' : 'Hanya percayai kanal resmi BMKG dan BNPB/BPBD setempat. Hindari menyebarkan isu/hoaks yang tidak terverifikasi.'}</li>
              </>
            ) : (
              <>
                <li>{lang === 'en' ? 'Use particulate dust masks (at least N95/double surgical mask) against volcanic ash.' : 'Gunakan masker pelindung debu partikulat pernapasan (minimal N95/masker bedah ganda) terhadap abu vulkanik.'}</li>
                <li>{lang === 'en' ? 'Stay outside the Volcanic Disaster-Prone Area (KRB) designated by PVMBG/Geological Agency.' : 'Jauhi radius Kawasan Rawan Bencana (KRB) yang telah ditetapkan PVMBG/Badan Geologi.'}</li>
                <li>{lang === 'en' ? 'Beware of cold lahar along river basins originating from the volcano summit, especially during rain.' : 'Waspadai potensi bahaya lahar dingin di sepanjang daerah aliran sungai (DAS) yang berhulu di puncak gunung api terutama saat hujan.'}</li>
              </>
            )}
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--gh-border)] text-xs text-[var(--gh-text-muted)]">
          <span>{t('modal.verified', { src: disaster.source })}</span>
          <a
            href="https://www.bmkg.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[var(--gh-accent)] hover:underline"
          >
            {t('modal.bmkg_portal')} <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </div>
  );
};
