"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { th, thCenter } from "@/components/ui";
import { useI18n } from "@/components/I18n";

export type SortState = { key: string; dir: "asc" | "desc" };

export function toggleSort(current: SortState | null, key: string): SortState | null {
  if (!current || current.key !== key) return { key, dir: "asc" };
  if (current.dir === "asc") return { key, dir: "desc" };
  return null;
}

export function sortRows<T>(rows: T[], sort: SortState | null): T[] {
  if (!sort) return rows;
  const { key, dir } = sort;
  const get = (row: T): unknown => (row as Record<string, unknown>)[key];
  return [...rows].sort((a, b) => {
    const va = get(a);
    const vb = get(b);
    let cmp: number;
    if (typeof va === "number" && typeof vb === "number") {
      cmp = va - vb;
    } else if (va == null && vb == null) {
      cmp = 0;
    } else if (va == null) {
      cmp = -1;
    } else if (vb == null) {
      cmp = 1;
    } else {
      cmp = String(va).localeCompare(String(vb), "id");
    }
    return dir === "asc" ? cmp : -cmp;
  });
}

export function SortTh({
  label,
  id,
  sort,
  onSort,
  center,
}: {
  label: string;
  id: string;
  sort: SortState | null;
  onSort: (s: SortState | null) => void;
  center?: boolean;
}) {
  const { t } = useI18n();
  const active = sort?.key === id;
  return (
    <th className={(center ? thCenter : th) + " whitespace-nowrap"}>
      <button
        type="button"
        onClick={() => onSort(toggleSort(sort, id))}
        aria-label={t("sort.by", { label })}
        className={
          "group inline-flex items-center gap-1 transition-colors " +
          (active ? "text-white" : "hover:text-white")
        }
      >
        {label}
        {active ? (
          sort!.dir === "asc" ? (
            <ArrowUp size={11} className="text-[#1ed760]" />
          ) : (
            <ArrowDown size={11} className="text-[#1ed760]" />
          )
        ) : (
          <ChevronsUpDown size={11} className="text-[#7c7c7c] group-hover:text-[#b3b3b3]" />
        )}
      </button>
    </th>
  );
}
