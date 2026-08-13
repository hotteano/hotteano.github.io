import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(date);
}

export function readingTime(html: string) {
  if (!html) return "1 min read";
  const textOnly = html.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).length;
  const readingTimeMinutes = ((wordCount / 200) + 1).toFixed();
  return `${readingTimeMinutes} min read`;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function tagHref(tag: string): string {
  return `/blog/tag/${slugify(tag)}`;
}

export function dateRange(startDate: Date, endDate?: Date | string): string {
  const startMonth = startDate.toLocaleString("default", { month: "short" });
  const startYear = startDate.getFullYear().toString();
  let endMonth;
  let endYear;

  if (endDate) {
    if (typeof endDate === "string") {
      endMonth = "";
      endYear = endDate;
    } else {
      endMonth = endDate.toLocaleString("default", { month: "short" });
      endYear = endDate.getFullYear().toString();
    }
  }

  return `${startMonth}${startYear} - ${endMonth}${endYear}`;
}

export function venueBadge(venue?: string): string {
  if (venue?.startsWith("NeurIPS")) {
    return "border-blue-500/30 bg-blue-500/10 !text-blue-700 dark:!text-blue-300";
  }
  if (venue?.startsWith("AAAI")) {
    return "border-amber-500/30 bg-amber-500/10 !text-amber-700 dark:!text-amber-300";
  }
  if (venue?.startsWith("ICLR")) {
    return "border-teal-500/30 bg-teal-500/10 !text-teal-700 dark:!text-teal-300";
  }
  return "";
}