import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBandScore(score: number | null | undefined): string {
  if (score == null) return "—";
  return score % 1 === 0 ? score.toFixed(0) : score.toFixed(1);
}

export function getBandColor(band: number): string {
  if (band >= 7) return "text-success";
  if (band >= 5) return "text-warning";
  return "text-danger";
}

export function getBandBg(band: number): string {
  if (band >= 7) return "bg-green-100 text-green-800";
  if (band >= 5) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

// IELTS official band conversion table (Listening & Reading out of 40)
const BAND_TABLE: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7],
  [27, 6.5], [23, 6], [20, 5.5], [16, 5], [13, 4.5],
  [10, 4], [8, 3.5], [6, 3], [4, 2.5],
];

export function scoreToBand(correct: number): number {
  for (const [min, band] of BAND_TABLE) {
    if (correct >= min) return band;
  }
  return 1;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
