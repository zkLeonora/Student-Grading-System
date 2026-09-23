export const pageBg = "bg-[#121212]";

export const panel =
  "overflow-hidden rounded-lg bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.045),0_1px_3px_rgba(0,0,0,0.25)]";

export const panelHeader =
  "flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5";

export const sectionTitle = "text-sm font-bold text-white";

export const label = "mb-1.5 block text-sm font-medium text-[#cbcbcb]";

const insetBorder =
  "shadow-[0_1px_0_0_rgb(18,18,18),0_0_0_1px_rgb(124,124,124)_inset]";

const insetBorderFocus =
  "focus:shadow-[0_1px_0_0_rgb(18,18,18),0_0_0_1px_rgb(30,215,96)_inset]";

export const input =
  "w-full rounded bg-[#1f1f1f] px-3 py-2.5 text-sm text-white placeholder:text-[#7c7c7c] transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 " +
  insetBorder +
  " " +
  insetBorderFocus;

export const select =
  "w-full rounded bg-[#1f1f1f] px-3 py-2.5 text-sm text-white transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 " +
  insetBorder +
  " " +
  insetBorderFocus;

export const btnCta =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#1ed760] px-5 py-2.5 text-sm font-bold uppercase tracking-[1.4px] text-black transition-colors hover:bg-[#1db954] disabled:cursor-not-allowed disabled:opacity-60";

export const btnDarkPill =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#1f1f1f] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#252525] disabled:cursor-not-allowed disabled:opacity-60";

export const btnDangerPill =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#f3727f] px-4 py-2 text-sm font-bold text-[#121212] transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60";

export const btnSmNeutral =
  "inline-flex items-center rounded-full bg-[#1f1f1f] px-3 py-1 text-xs font-semibold text-[#cbcbcb] transition-colors hover:bg-[#252525] hover:text-white";

export const btnSmPrimary =
  "inline-flex items-center rounded-full bg-[#1ed760] px-3 py-1 text-xs font-bold text-black transition-colors hover:bg-[#1db954]";

export const btnSmDanger =
  "inline-flex items-center rounded-full bg-[#1f1f1f] px-3 py-1 text-xs font-semibold text-[#f3727f] transition-colors hover:bg-[#252525]";

export const th =
  "px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-[#b3b3b3]";

export const thCenter = th + " text-center";

export const td = "px-4 py-3 text-sm text-[#cbcbcb]";

export const tdCenter = "px-4 py-3 text-center text-sm text-[#cbcbcb]";

export const tr =
  "border-b border-white/[0.06] transition-colors last:border-b-0 hover:bg-[#252525]";

export const tableHeadRow = "border-b border-[#4d4d4d]";

export const emptyCell = "px-4 py-10 text-center text-sm text-[#b3b3b3]";

export const modalOverlay =
  "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4";

export const modalPanel =
  "max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-[#181818] shadow-[0_8px_24px_rgba(0,0,0,0.5)]";

export const modalBody = "p-5 sm:p-6";

export const modalTitle = "text-base font-bold text-white";

export const modalFooter =
  "flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:flex-row sm:justify-end";

export const statStrip =
  "grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/10 lg:grid-cols-4";

export const statStripTwo =
  "grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-white/10 sm:grid-cols-2";

export const statStripFour =
  "grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/10 lg:grid-cols-4";

export const statItem = "bg-[#181818] px-5 py-4";

export const searchInput =
  "w-full rounded-full bg-[#1f1f1f] px-4 py-2 text-sm text-white placeholder:text-[#7c7c7c] transition-colors focus:outline-none sm:max-w-xs " +
  insetBorder +
  " " +
  insetBorderFocus;

export const statLabel =
  "text-xs font-bold uppercase tracking-[1.2px] text-[#b3b3b3]";

export const statValue =
  "mt-1.5 text-2xl font-bold tabular-nums text-white";

const badgeBase =
  "inline-flex items-center rounded-full bg-[#1f1f1f] px-2.5 py-0.5 text-[11px] font-semibold";

export function badgeStatusNilai(status: string): string {
  return status === "Sudah Dinilai"
    ? badgeBase + " text-[#1ed760]"
    : badgeBase + " text-[#ffa42b]";
}

export function badgeKelulusan(status: string | null): string {
  return status === "Lulus"
    ? badgeBase + " text-[#1ed760]"
    : badgeBase + " text-[#f3727f]";
}
