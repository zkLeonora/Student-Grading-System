"use client";

import { Clock, User } from "lucide-react";
import { useI18n } from "@/components/I18n";

export type TimelineItem = {
  id: number | string;
  title: string;
  subtitle?: string;
  actor?: string;
  date?: string | null;
  badge?: string;
};

function toDate(date?: string | null): Date | null {
  if (!date) return null;
  const d = new Date(date.replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? null : d;
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function timeLabel(d: Date, locale: string): string {
  return d.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Timeline({
  items,
  emptyText,
}: {
  items: TimelineItem[];
  emptyText?: string;
}) {
  const { t, locale } = useI18n();

  const dayLabel = (d: Date): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (dayKey(d) === dayKey(today)) return t("time.today");
    if (dayKey(d) === dayKey(yesterday)) return t("time.yesterday");
    return d.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (items.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-[#b3b3b3]">
        {emptyText ?? t("empty.noActivity")}
      </p>
    );
  }

  const groups: { label: string; items: { item: TimelineItem; date: Date | null }[] }[] = [];
  for (const item of items) {
    const date = toDate(item.date);
    const label = date ? dayLabel(date) : t("time.unknown");
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.items.push({ item, date });
    } else {
      groups.push({ label, items: [{ item, date }] });
    }
  }

  return (
    <div className="px-2 py-3">
      {groups.map((group, gi) => (
        <div key={group.label + gi}>
          <p className="px-4 pb-2 pt-2 text-[11px] font-bold uppercase tracking-[1.4px] text-[#7c7c7c]">
            {group.label}
          </p>
          <ol className="px-2">
            {group.items.map(({ item, date }, i) => {
              const isLast = i === group.items.length - 1;
              return (
                <li
                  key={item.id}
                  className={
                    "group relative cursor-default rounded-lg py-3 pl-9 pr-3 transition-colors hover:bg-[#252525] " +
                    (isLast ? "pb-2" : "")
                  }
                >
                  {!isLast && (
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-[7.5px] top-[26px] w-px bg-white/10"
                    />
                  )}
                  <span
                    aria-hidden
                    className="absolute left-[3.5px] top-[19px] h-2.5 w-2.5 rounded-full bg-[#1ed760] ring-4 ring-[#181818] transition-transform group-hover:scale-125"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {item.title}
                      </p>
                      {item.subtitle ? (
                        <p className="mt-0.5 truncate text-xs text-[#b3b3b3]">
                          {item.subtitle}
                        </p>
                      ) : null}
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#7c7c7c]">
                        {item.actor ? (
                          <span className="inline-flex items-center gap-1">
                            <User size={11} />
                            {item.actor}
                          </span>
                        ) : null}
                        {date ? (
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <Clock size={11} />
                            {timeLabel(date, locale)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {item.badge !== undefined ? (
                      <span className="shrink-0 rounded-full bg-[#1f1f1f] px-2.5 py-1 text-xs font-bold tabular-nums text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
