'use client';

import React from 'react';
import {
  Activity,
  Map,
  ShieldAlert,
  Compass,
  BookOpen,
  Search,
  RefreshCw,
  Flame,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useLanguage } from '@/lib/LanguageContext';

interface NavbarProps {
  activeTab: 'dashboard' | 'map' | 'volcanoes' | 'risk' | 'regions' | 'mitigation';
  setActiveTab: (tab: 'dashboard' | 'map' | 'volcanoes' | 'risk' | 'regions' | 'mitigation') => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  onOpenSearch: () => void;
}

const tabs = [
  { id: 'dashboard' as const, icon: Activity },
  { id: 'map' as const, icon: Map },
  { id: 'volcanoes' as const, icon: Flame },
  { id: 'risk' as const, icon: ShieldAlert },
  { id: 'regions' as const, icon: Compass },
  { id: 'mitigation' as const, icon: BookOpen },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRefresh,
  isRefreshing,
  lastUpdated,
  onOpenSearch,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const labels: Record<string, string> = {
    dashboard: t('nav.dashboard'),
    map: t('nav.map'),
    volcanoes: t('nav.volcanoes'),
    risk: t('nav.risk'),
    regions: t('nav.regions'),
    mitigation: t('nav.mitigation'),
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[var(--gh-surface)]/95 backdrop-blur-md border-b border-[var(--gh-border)]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo — navy-yellow H, left prominent */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 shrink-0 select-none"
          aria-label={t('nav.to_dashboard')}
        >
          <img
            src="/logo.png"
            alt="OnheilAlert"
            className="h-8 w-8 rounded-xl object-cover border border-[var(--gh-border)]"
            referrerPolicy="no-referrer"
          />
          <span className="font-semibold text-sm tracking-tight text-[var(--gh-text)] hidden sm:inline">
            OnheilAlert
          </span>
        </button>

        {/* Center segmented tabs — single line, no pill container */}
        <nav className="hidden lg:flex items-center gap-1 shrink-0" aria-label={t('nav.main')}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-2.5 py-1.5 text-xs transition-colors whitespace-nowrap ${
                  active
                    ? 'font-semibold text-[var(--gh-accent)]'
                    : 'font-medium text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                {labels[tab.id]}
                {active && (
                  <span className="absolute -bottom-1 left-2 right-2 h-0.5 rounded-full bg-[var(--gh-accent)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions — one line, right aligned */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="btn-global-search"
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] hover:border-[var(--gh-border-active)] transition"
            title={t('nav.search')}
            aria-label={t('nav.search')}
          >
            <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
            <kbd className="hidden md:inline text-[10px] text-[var(--gh-text-subtle)] font-mono border border-[var(--gh-border)] rounded px-1 py-0.5">
              {t('nav.search_kbd')}
            </kbd>
          </button>
          <button
            id="btn-toggle-theme"
            onClick={toggleTheme}
            className="flex items-center rounded-xl px-2 py-1.5 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] transition"
            title={theme === 'dark' ? t('nav.light') : t('nav.dark')}
            aria-label="Ganti tema"
          >
            {theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.75} />
            ) : (
              <Moon className="h-3.5 w-3.5 text-indigo-500" strokeWidth={1.75} />
            )}
          </button>
          {/* ID/EN toggle pill */}
          <div
            className="flex items-center rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-0.5"
            role="group"
            aria-label="Language"
          >
            <button
              onClick={() => setLang('id')}
              className={`rounded-lg px-2 py-1 text-xs transition ${
                lang === 'id'
                  ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] font-semibold'
                  : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
              }`}
              aria-pressed={lang === 'id'}
              aria-label={t('nav.lang_id')}
            >
              {t('nav.lang_id')}
            </button>
            <button
              onClick={() => setLang('en')}
              className={`rounded-lg px-2 py-1 text-xs transition ${
                lang === 'en'
                  ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] font-semibold'
                  : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
              }`}
              aria-pressed={lang === 'en'}
              aria-label={t('nav.lang_en')}
            >
              {t('nav.lang_en')}
            </button>
          </div>
          <button
            id="btn-refresh-data"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center rounded-xl px-2 py-1.5 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] transition disabled:opacity-50"
            title={t('nav.refresh')}
            aria-label={t('nav.refresh')}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'motion-safe:animate-spin' : ''}`} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
};
