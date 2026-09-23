"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useI18n, type Lang } from "@/components/I18n";

const OPTIONS: { code: Lang; label: string; flag: React.ReactNode }[] = [
  {
    code: "id",
    label: "ID",
    flag: (
      <span
        aria-hidden
        className="inline-block h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
        style={{
          background:
            "linear-gradient(to bottom, #ff0000 0 50%, #ffffff 50% 100%)",
        }}
      />
    ),
  },
  {
    code: "en",
    label: "EN",
    flag: (
      <svg
        aria-hidden
        viewBox="0 0 60 36"
        className="h-3.5 w-5 shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
      >
        <rect width="60" height="36" fill="#012169" />
        <path
          d="M0 0 L60 36 M60 0 L0 36"
          stroke="#fff"
          strokeWidth="7"
        />
        <path
          d="M0 0 L60 36 M60 0 L0 36"
          stroke="#C8102E"
          strokeWidth="4"
        />
        <path
          d="M30 0 V36 M0 18 H60"
          stroke="#fff"
          strokeWidth="12"
        />
        <path
          d="M30 0 V36 M0 18 H60"
          stroke="#C8102E"
          strokeWidth="7"
        />
      </svg>
    ),
  },
];

function flagOf(code: Lang) {
  return OPTIONS.find((o) => o.code === code)?.flag ?? null;
}

function labelOf(code: Lang) {
  return OPTIONS.find((o) => o.code === code)?.label ?? code.toUpperCase();
}

export function LangSwitch() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      aria-label={t("shell.switchLang")}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("shell.switchLang")}
        className="flex items-center gap-1.5 rounded-full bg-[#1f1f1f] px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-[1px] text-white transition-colors hover:bg-[#252525]"
      >
        <span className="flex items-center gap-1.5">
          {flagOf(lang)}
          <span>{labelOf(lang)}</span>
        </span>
        <ChevronDown
          size={12}
          className={
            "shrink-0 text-[#b3b3b3] transition-transform " +
            (open ? "rotate-180" : "")
          }
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-lg border border-white/10 bg-[#181818] py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.045),0_8px_24px_rgba(0,0,0,0.5)]"
        >
          {OPTIONS.map((opt) => {
            const selected = lang === opt.code;
            return (
              <li key={opt.code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    setLang(opt.code);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-[#252525]"
                >
                  {opt.flag}
                  <span className="flex-1">{opt.label}</span>
                  {selected && (
                    <Check size={16} className="shrink-0 text-[#1ed760]" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
