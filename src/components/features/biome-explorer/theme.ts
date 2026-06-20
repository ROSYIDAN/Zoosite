import type { BiomeTheme } from "@/types/biome.types";

export const BIOME_UI_THEMES: Record<string, BiomeTheme> = {
  forests: {
    iconBg: "bg-[#2d5a27] dark:bg-[#3d7a35]",
    badgeBg: "bg-[#2d5a27]/10 dark:bg-[#3d7a35]/20",
    badgeText: "text-[#2d5a27] dark:text-[#d0e8c5]",
    tagClass: "bg-[#2d5a27]/5 text-[#2d5a27] border-[#2d5a27]/10 hover:bg-[#2d5a27]/10 dark:text-[#d0e8c5] dark:border-[#3d7a35]/30",
  },
  grasslands: {
    iconBg: "bg-amber-600 dark:bg-amber-700",
    badgeBg: "bg-amber-50 dark:bg-amber-950/20",
    badgeText: "text-amber-800 dark:text-amber-300",
    tagClass: "bg-amber-50 dark:bg-amber-950/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30 hover:bg-amber-100/50",
  },
  wetlands: {
    iconBg: "bg-teal-600 dark:bg-teal-700",
    badgeBg: "bg-teal-50 dark:bg-teal-950/20",
    badgeText: "text-teal-800 dark:text-teal-300",
    tagClass: "bg-teal-50 dark:bg-teal-950/10 text-teal-700 dark:text-teal-400 border-teal-100 dark:border-teal-900/30 hover:bg-teal-100/50",
  },
  waters: {
    iconBg: "bg-blue-600 dark:bg-blue-700",
    badgeBg: "bg-blue-50 dark:bg-blue-950/20",
    badgeText: "text-blue-800 dark:text-blue-300",
    tagClass: "bg-blue-50 dark:bg-blue-950/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30 hover:bg-blue-100/50",
  },
  "deserts-drylands": {
    iconBg: "bg-orange-600 dark:bg-orange-700",
    badgeBg: "bg-orange-50 dark:bg-orange-950/20",
    badgeText: "text-orange-800 dark:text-orange-300",
    tagClass: "bg-orange-50 dark:bg-orange-950/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-900/30 hover:bg-orange-100/50",
  },
  "polar-tundra": {
    iconBg: "bg-sky-600 dark:bg-sky-700",
    badgeBg: "bg-sky-50 dark:bg-sky-950/20",
    badgeText: "text-sky-800 dark:text-sky-300",
    tagClass: "bg-sky-50 dark:bg-sky-950/10 text-sky-700 dark:text-sky-400 border-sky-100 dark:border-sky-900/30 hover:bg-sky-100/50",
  },
  "mountains-highlands": {
    iconBg: "bg-stone-600 dark:bg-stone-700",
    badgeBg: "bg-stone-100 dark:bg-stone-900/20",
    badgeText: "text-stone-800 dark:text-stone-300",
    tagClass: "bg-stone-100 dark:bg-stone-900/10 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-800/30 hover:bg-stone-200/50",
  },
};
