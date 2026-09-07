'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Map,
  Flame,
  ShieldAlert,
  Compass,
  ArrowUp,
} from 'lucide-react';

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

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* 5 tabs max — drop 'regions' from mobile bottom (accessible via overflow row on desktop or from Navbar above) */
  const navItems = [
    { id: 'dashboard' as const, label: 'Beranda', icon: Activity },
    { id: 'map' as const, label: 'Peta', icon: Map },
    { id: 'volcanoes' as const, label: 'Api', icon: Flame, badge: siagaVolcanoCount > 0 ? siagaVolcanoCount : undefined },
    { id: 'risk' as const, label: 'Risiko', icon: ShieldAlert },
    { id: 'mitigation' as const, label: 'Tindakan', icon: Compass },
  ];

  return (
    <>
      {/* Scroll to top — only after deep scroll */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Kembali ke atas"
          className="fixed bottom-16 right-3 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] shadow-md backdrop-blur-md active:scale-90 transition md:hidden"
        >
          <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      )}

      {/* Bottom bar */}
      <nav
        aria-label="Navigasi Mobile"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-[var(--gh-border)] bg-[var(--gh-surface)]/95 backdrop-blur-md shadow-lg px-2 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative flex flex-col items-center justify-center w-14 py-1.5 rounded-xl transition-colors ${
                  active ? 'text-[var(--gh-accent)]' : 'text-[var(--gh-text-muted)]'
                }`}
              >
                <div className="relative">
                  <Icon className="h-4.5 w-4.5" strokeWidth={active ? 2 : 1.5} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2.5 min-w-[14px] h-3.5 flex items-center justify-center rounded-full bg-orange-500 text-[8px] font-bold text-white px-0.5">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 leading-tight truncate max-w-full">
                  {item.label}
                </span>
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-[var(--gh-accent)]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
