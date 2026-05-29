interface RequestHistoryEmptyStateProps {
  onNewRequest: () => void;
  isBanned?: boolean;
}

export default function RequestHistoryEmptyState({ onNewRequest, isBanned = false }: RequestHistoryEmptyStateProps) {
  return (
    <div className="col-span-full bg-white border border-[#c2c9bb] border-dashed rounded-2xl p-12 text-center text-[#1a1c19]/40 flex flex-col items-center justify-center min-h-[300px]">
      <span className="material-symbols-outlined text-[48px] text-[#1a1c19]/30 mb-2">assignment_late</span>
      <p className="text-sm font-semibold">No requests found matching filters.</p>
      {!isBanned && (
        <button
          onClick={onNewRequest}
          className="text-xs text-[#2d5a27] hover:underline font-bold mt-2"
        >
          Submit your first request
        </button>
      )}
    </div>
  );
}
