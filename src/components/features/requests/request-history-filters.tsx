import { cn } from "@/lib/utils";

type FilterType = "ALL" | "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";

interface RequestHistoryFiltersProps {
  currentFilter: FilterType;
  onChangeFilter: (filter: FilterType) => void;
}

export default function RequestHistoryFilters({ currentFilter, onChangeFilter }: RequestHistoryFiltersProps) {
  const tabs: FilterType[] = ["ALL", "PENDING", "IN_REVIEW", "APPROVED", "REJECTED"];

  return (
    <div className="flex flex-wrap gap-2 mb-6 border-b border-[#e3e3de] pb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChangeFilter(tab)}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-xl transition-all font-['Plus_Jakarta_Sans'] uppercase tracking-wider border",
            currentFilter === tab
              ? "bg-[#2d5a27] text-white border-[#2d5a27] shadow-sm"
              : "bg-white text-[#1a1c19]/60 border-[#c2c9bb] hover:bg-[#fafaf5]"
          )}
        >
          {tab.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}
