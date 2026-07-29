import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Return age group label for a given age.
 * Ranges (inclusive):
 * 6-7 -> "Under 8"
 * 8-9 -> "Under 10"
 * 10-11 -> "Under 12"
 * 12-13 -> "Under 14"
 * 14-15 -> "Under 16"
 * 16-17 -> "Under 18"
 * Otherwise -> "Other"
 */
export function getAgeGroup(age: number | null | undefined): string {
  if (typeof age !== "number" || Number.isNaN(age)) return "Other";
  if (age >= 6 && age <= 7) return "Under 8";
  if (age >= 8 && age <= 9) return "Under 10";
  if (age >= 10 && age <= 11) return "Under 12";
  if (age >= 12 && age <= 13) return "Under 14";
  if (age >= 14 && age <= 15) return "Under 16";
  if (age >= 16 && age <= 17) return "Under 18";
  return "Other";
}
