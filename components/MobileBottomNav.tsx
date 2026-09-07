'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Map, Flame, ShieldAlert, Compass, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface MobileBottomNavProps {
  activeTab: 'dashboard' | 'map' | 'volcanoes' | 'risk' | 'regions' | 'mitigation';
  setActiveTab: (tab: 'dashboard' | 'map' | 'volcanoes' | 'risk' | 'regions' | 'mitigation') => void;
  siagaVolcanoCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  siagaVolcanoCount = 0,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: 'dashboard' as const, label: t('nav.dashboard'), icon: Activity },
    { id: 'map' as const, label: t('nav.map'), icon: Map },
    { id: 'volcanoes' as const, label: t('nav.volcanoes'), icon: Flame, badge: siagaVolcanoCount > 0 ? siagaVolcanoCount : undefined },
    { id: 'risk' as const, label: t('nav.risk'), icon: ShieldAlert },
    { id: 'mitigation' as const, label: t('nav.mitigation'), icon: Compass },
  ];

  const triggerHaptic = () => {
    try { navigator.vibrate?.(10); } catch { /* ignore */ }
  };

  return (
    <>
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Kembali ke atas"
          className="fixed bottom-16 right-3 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] text-[var(--gh-text-muted)] shadow-md backdrop-blur-md transition hover:text-[var(--gh-text)] active:scale-90 md:hidden"
        >
          <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      )}

      <nav
        aria-label="Navigasi Mobile"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--gh-border)] bg-[var(--gh-surface)]/95 backdrop-blur-md px-2 pb-[max(0.375rem,env(safe-area-inset-bottom))] md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  triggerHaptic();
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative flex flex-col items-center justify-center py-1.5 transition-colors ${
                  active ? 'text-[var(--gh-accent)]' : 'text-[var(--gh-text-muted)]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[var(--gh-accent)]" />
                )}
                <span className="relative">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2 : 1.75} />
                  {item.badge !== undefined && (
                    <span className="absolute -right-2.5 -top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-[var(--gh-warning)] px-0.5 text-[8px] font-bold leading-none text-white">
                      {item.badge}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 text-[10px] leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
