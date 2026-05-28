import { useRouter } from "next/navigation";
import { RequestDetail } from "./types";

interface RequestHistoryItemProps {
  req: RequestDetail;
  onWithdraw: (id: string) => void;
  onResubmit: (req: RequestDetail) => void;
  isDeleting: boolean;
}

export default function RequestHistoryItem({ req, onWithdraw, onResubmit, isDeleting }: RequestHistoryItemProps) {
  const router = useRouter();

  const getStatusBadge = (status: RequestDetail["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f4f7] border border-[#d0d5dd] text-xs font-semibold text-[#344054] font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
            Pending
          </span>
        );
      case "IN_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-700 font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">search</span>
            In Review
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-xs font-semibold text-green-700 font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-semibold text-red-700 font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">cancel</span>
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div className="space-y-4">
        {/* Top line */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-md font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans']">{req.animal_name}</h3>
            {req.scientific_name && (
              <p className="text-xs italic text-[#1a1c19]/60 mt-0.5">{req.scientific_name}</p>
            )}
          </div>
          {getStatusBadge(req.status)}
        </div>

        {/* Image & Type */}
        <div className="flex items-center gap-4">
          {req.image_url ? (
            <img
              src={req.image_url}
              alt={req.animal_name}
              className="w-16 h-16 rounded-xl object-cover border border-[#c2c9bb] shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-[#fafaf5] border border-dashed border-[#c2c9bb] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px] text-[#1a1c19]/30">image</span>
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold text-[#1a1c19]/40 uppercase tracking-wider">Request Type</p>
            <p className="text-xs font-semibold text-[#1a1c19] font-['Plus_Jakarta_Sans'] mt-0.5">
              {req.request_type === "FULL_DETAIL" ? "🟢 Full Details" : "🟡 Quick Details"}
            </p>
            <p className="text-[10px] text-[#1a1c19]/50 mt-1">
              Submitted: {new Date(req.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Rejection Alert */}
        {req.status === "REJECTED" && req.reject_reason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex gap-2.5 text-red-950">
            <span className="material-symbols-outlined text-red-500 text-[18px] shrink-0">info</span>
            <div className="text-xs">
              <strong className="block mb-0.5">Rejection Feedback:</strong>
              {req.reject_reason}
            </div>
          </div>
        )}
      </div>

      {/* Actions Bottom Bar */}
      <div className="border-t border-[#e3e3de] pt-4 mt-6 flex justify-end gap-2">
        {req.status === "PENDING" && (
          <button
            onClick={() => onWithdraw(req.id)}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            Withdraw
          </button>
        )}

        {req.status === "REJECTED" && (
          <button
            onClick={() => onResubmit(req)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2d5a27]/10 hover:bg-[#2d5a27]/20 text-[#2d5a27] text-xs font-bold transition-colors font-['Plus_Jakarta_Sans'] uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-[14px]">edit_square</span>
            Fix & Resubmit
          </button>
        )}

        {req.status === "APPROVED" && req.approved_animal?.canonical_slug && (
          <button
            onClick={() => router.push(`/animals/${req.approved_animal?.canonical_slug}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2d5a27] hover:bg-[#1f3f1b] text-white text-xs font-bold transition-all font-['Plus_Jakarta_Sans'] uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-[14px]">visibility</span>
            View Animal
          </button>
        )}
      </div>
    </div>
  );
}
