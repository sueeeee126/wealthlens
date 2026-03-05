"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";

interface NavItem {
  path: string;
  svgKey: string;
  labelKey: string;
  isPro?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { path: "/overview", svgKey: "overview", labelKey: "overview" },
  { path: "/assets",   svgKey: "assets",   labelKey: "assets" },
  { path: "/trends",   svgKey: "trends",   labelKey: "trendsTab" },
  { path: "/pro",      svgKey: "pro",      labelKey: "proTab", isPro: true },
];

const NAV_SVGS: Record<string, React.ReactNode> = {
  overview: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.3"/>
      <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.3"/>
      <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor"/>
      <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
  assets: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="2.5" rx="1.25" fill="currentColor" opacity="0.3"/>
      <rect x="3" y="10.75" width="14" height="2.5" rx="1.25" fill="currentColor"/>
      <rect x="3" y="16.5" width="10" height="2.5" rx="1.25" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
  trends: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <polyline points="3,17 8,12 13,14 21,7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <polyline points="17,7 21,7 21,11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  pro: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
};

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile"
      style={{
        background: "rgba(242,242,247,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
        zIndex: 30,
      }}
    >
      <div className="flex items-stretch h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          const label = t[item.labelKey as keyof typeof t] as string;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90"
              style={{
                color: item.isPro
                  ? "#FF9500"
                  : isActive ? "#007AFF" : "#8E8E93",
              }}
            >
              <div className="relative">
                {NAV_SVGS[item.svgKey]}
                {item.isPro && (
                  <span
                    className="absolute -top-1 -right-2 text-[9px] font-bold px-1 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #FF9500, #FF3B30)",
                      color: "#FFFFFF",
                      lineHeight: "14px",
                    }}
                  >
                    PRO
                  </span>
                )}
              </div>
              <span
                className="text-[10px] font-medium"
                style={{
                  color: item.isPro
                    ? "#FF9500"
                    : isActive ? "#007AFF" : "#8E8E93",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
