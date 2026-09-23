"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/components/I18n";
import { LangSwitch } from "@/components/LangSwitch";

export type NavItem = { href: string; labelKey: string; icon: LucideIcon };

export type ShellRole = "admin" | "guru" | "siswa";

const NAV: Record<ShellRole, NavItem[]> = {
  admin: [
    { href: "/admin/dashboard", labelKey: "shell.nav.dashboard", icon: LayoutDashboard },
    { href: "/admin/kelola-siswa", labelKey: "shell.nav.kelolaSiswa", icon: Users },
    { href: "/admin/kelola-guru", labelKey: "shell.nav.kelolaGuru", icon: GraduationCap },
    { href: "/admin/laporan-nilai", labelKey: "shell.nav.laporanNilai", icon: FileText },
  ],
  guru: [
    { href: "/guru/dashboard", labelKey: "shell.nav.dashboard", icon: LayoutDashboard },
    { href: "/guru/kelola-nilai", labelKey: "shell.nav.kelolaNilai", icon: Users },
    { href: "/guru/laporan-nilai", labelKey: "shell.nav.laporanNilai", icon: FileText },
  ],
  siswa: [
    { href: "/siswa/dashboard", labelKey: "shell.nav.dashboard", icon: LayoutDashboard },
  ],
};

type SidebarContentProps = {
  role: ShellRole;
  active: string;
  onNavigate: (href: string) => void;
  onLogout: () => void;
};

function SidebarContent({
  role,
  active,
  onNavigate,
  onLogout,
}: SidebarContentProps) {
  const items = NAV[role];
  const { t } = useI18n();

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center gap-3 px-2 py-2">
        <Image
          src="/logo.png"
          alt={t("login.logoAlt")}
          width={36}
          height={36}
          className="rounded-md object-cover"
          priority
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-snug text-white">
            {t("shell.brand")}
          </p>
          <p className="mt-0.5 text-xs text-[#b3b3b3]">{t(`role.${role}`)}</p>
        </div>
      </div>

      <p className="mb-2 mt-6 px-3 text-[11px] font-bold uppercase tracking-[1.4px] text-[#7c7c7c]">
        {t("shell.menu")}
      </p>

      <nav className="flex-1 space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.href;
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => onNavigate(item.href)}
              aria-current={isActive ? "page" : undefined}
              className={
                "flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left text-sm transition-colors " +
                (isActive
                  ? "font-bold text-white"
                  : "font-normal text-[#b3b3b3] hover:bg-[#1f1f1f] hover:text-white")
              }
            >
              <Icon size={16} className="shrink-0" />
              <span className="truncate">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#1f1f1f] px-4 py-2.5 text-sm font-bold text-[#b3b3b3] transition-colors hover:bg-[#252525] hover:text-[#f3727f]"
      >
        <LogOut size={16} />
        <span>{t("shell.logout")}</span>
      </button>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
  stackAction = false,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  stackAction?: boolean;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
        {description ? (
          <div className="mt-1 text-sm text-[#b3b3b3]" suppressHydrationWarning>
            {description}
          </div>
        ) : null}
      </div>
      <div
        className={
          stackAction
            ? "flex shrink-0 flex-col items-end gap-3 self-start"
            : "flex shrink-0 flex-wrap items-center gap-3 self-start"
        }
      >
        <LangSwitch />
        {action}
      </div>
    </div>
  );
}

type AppShellProps = {
  role: ShellRole;
  active: string;
  onNavigate: (href: string) => void;
  onLogout: () => void;
  children: ReactNode;
};

export default function AppShell({
  role,
  active,
  onNavigate,
  onLogout,
  children,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const navigateAndClose = (href: string) => {
    setMobileOpen(false);
    onNavigate(href);
  };

  return (
    <div className="min-h-screen text-white" suppressHydrationWarning>
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 md:block">
          <SidebarContent
            role={role}
            active={active}
            onNavigate={onNavigate}
            onLogout={onLogout}
          />
        </aside>

        <div className="relative min-w-0 flex-1 flex-col">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label={t("shell.openNav")}
            className="absolute top-4 left-4 z-40 rounded-full bg-[#1f1f1f] p-2 text-white transition-colors hover:bg-[#252525] md:hidden"
          >
            <Menu size={16} />
          </button>

          <main className="flex-1 px-4 pt-14 pb-4 sm:px-6 sm:pt-6 sm:pb-6 lg:px-8 lg:pb-8">
            {children}
          </main>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Tutup menu navigasi"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-white/10 bg-[#121212] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Tutup menu navigasi"
                className="rounded-full bg-[#1f1f1f] p-2 text-white transition-colors hover:bg-[#252525]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <SidebarContent
                role={role}
                active={active}
                onNavigate={navigateAndClose}
                onLogout={onLogout}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
