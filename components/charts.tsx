'use client';

import { useState } from "react";
import { useI18n } from "@/components/I18n";

export function scoreColor(v: number): string {
  if (v >= 75) return "#1ed760";
  if (v >= 60) return "#ffa42b";
  return "#f3727f";
}

const RANGES = [
  { label: "0–59", min: 0, max: 59 },
  { label: "60–69", min: 60, max: 69 },
  { label: "70–79", min: 70, max: 79 },
  { label: "80–89", min: 80, max: 89 },
  { label: "90–100", min: 90, max: 100 },
];

export function DistributionChart({
  values,
  emptyText,
}: {
  values: number[];
  emptyText?: string;
}) {
  const { t } = useI18n();
  const [hover, setHover] = useState<number | null>(null);
  const counts = RANGES.map((r) =>
    values.filter((v) => v >= r.min && v <= r.max).length
  );
  const total = counts.reduce((a, b) => a + b, 0);
  const max = Math.max(...counts, 1);

  if (total === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-[#b3b3b3]">
        {emptyText ?? t("empty.noGrades")}
      </p>
    );
  }

  return (
    <div className="px-4 py-5 sm:px-5">
      <div className="flex items-end gap-2 sm:gap-3">
        {RANGES.map((r, i) => {
          const pct = (counts[i] / total) * 100;
          const height = counts[i] > 0 ? Math.max((counts[i] / max) * 100, 6) : 3;
          const active = hover === i;
          return (
            <div
              key={r.label}
              className="flex flex-1 cursor-default flex-col items-center gap-1.5"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <span
                className={
                  "h-5 text-xs font-bold tabular-nums transition-colors " +
                  (active ? "text-white" : counts[i] > 0 ? "text-[#cbcbcb]" : "text-[#7c7c7c]")
                }
              >
                {active && counts[i] > 0 ? `${counts[i]} (${pct.toFixed(0)}%)` : counts[i]}
              </span>
              <div className="flex h-28 w-full items-end">
                <div
                  className="w-full rounded-t transition-all duration-300"
                  style={{
                    height: `${height}%`,
                    backgroundColor:
                      counts[i] === 0
                        ? "#1f1f1f"
                        : active
                          ? "#1ed760"
                          : "rgba(30,215,96,0.55)",
                  }}
                />
              </div>
              <span
                className={
                  "text-[11px] font-semibold transition-colors " +
                  (active ? "text-white" : "text-[#b3b3b3]")
                }
              >
                {r.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-[#7c7c7c]">
        {t("chart.rangeNote", { n: total })}
      </p>
    </div>
  );
}

export function DonutChart({
  segments,
  totalLabel = "Total",
  emptyText,
}: {
  segments: { label: string; value: number; color: string }[];
  totalLabel?: string;
  emptyText?: string;
}) {
  const { t } = useI18n();
  const [hover, setHover] = useState<number | null>(null);
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = 42;
  const c = 2 * Math.PI * r;

  if (total === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-[#b3b3b3]">
        {emptyText ?? t("empty.noData")}
      </p>
    );
  }

  const cumulative = segments.map((_, i) =>
    segments.slice(0, i).reduce((a, x) => a + x.value, 0)
  );
  const arcs = segments.map((s, i) => {
    const frac = total ? s.value / total : 0;
    const len = frac * c;
    return {
      ...s,
      dash: `${len} ${c - len}`,
      offset: -(cumulative[i] / (total || 1)) * c,
      frac,
    };
  });

  const centerValue = hover === null ? total : arcs[hover].value;
  const centerLabel = hover === null ? totalLabel : arcs[hover].label;

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-5 sm:px-5">
      <div className="relative">
        <svg viewBox="0 0 100 100" className="h-36 w-36 -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#1f1f1f" strokeWidth="12" />
          {arcs.map((a, i) => (
            <circle
              key={a.label}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={a.color}
              strokeWidth={hover === i ? 15 : 12}
              strokeDasharray={a.dash}
              strokeDashoffset={a.offset}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums text-white">{centerValue}</span>
          <span className="max-w-[80px] truncate text-center text-[11px] font-semibold text-[#b3b3b3]">
            {centerLabel}
          </span>
        </div>
      </div>
      <ul className="w-full space-y-2">
        {arcs.map((a, i) => (
          <li key={a.label}>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded px-1 py-0.5 text-left transition-colors hover:bg-[#252525]"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: a.color }}
              />
              <span className="min-w-0 flex-1 truncate text-xs text-[#cbcbcb]">
                {a.label}
              </span>
              <span className="text-xs font-bold tabular-nums text-white">{a.value}</span>
              <span className="w-10 text-right text-[11px] tabular-nums text-[#7c7c7c]">
                {(a.frac * 100).toFixed(0)}%
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HBarList({
  items,
  format = (v: number) => String(v),
  emptyText,
}: {
  items: { label: string; value: number }[];
  format?: (v: number) => string;
  emptyText?: string;
}) {
  const { t } = useI18n();
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...items.map((i) => i.value), 1);

  if (items.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-[#b3b3b3]">
        {emptyText ?? t("empty.noData")}
      </p>
    );
  }

  return (
    <ul className="space-y-4 px-4 py-5 sm:px-5">
      {items.map((it, i) => (
        <li
          key={it.label}
          className="group cursor-default"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
        >
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span
              className={
                "truncate text-xs font-semibold transition-colors " +
                (hover === i ? "text-white" : "text-[#cbcbcb]")
              }
            >
              {it.label}
            </span>
            <span className="shrink-0 text-xs font-bold tabular-nums text-white">
              {format(it.value)}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#1f1f1f]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max((it.value / max) * 100, it.value > 0 ? 4 : 0)}%`,
                backgroundColor: scoreColor(it.value),
                opacity: hover === null || hover === i ? 1 : 0.4,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function groupAvg<T>(
  items: T[],
  key: (item: T) => string,
  value: (item: T) => number
): { label: string; value: number }[] {
  const map = new Map<string, number[]>();
  for (const item of items) {
    const k = key(item);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(value(item));
  }
  return [...map.entries()]
    .map(([label, vals]) => ({ label, value: avg(vals) }))
    .sort((a, b) => b.value - a.value);
}
