import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { RequestDetail } from "@/components/features/requests/types";

export type FilterType = "ALL" | "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";

interface UseRequestHistoryProps {
  initialRequests: RequestDetail[];
  isBanned: boolean;
  bannedUntil: string | null;
}

export function useRequestHistory({
  initialRequests,
  isBanned,
  bannedUntil,
}: UseRequestHistoryProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestDetail[]>(initialRequests);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState<boolean>(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const alreadyRead = localStorage.getItem("zoosite_guidelines_read") === "true";
    if (!alreadyRead) {
      setIsGuidelinesOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isBanned || !bannedUntil) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(bannedUntil) - +new Date();
      if (difference <= 0) {
        setTimeLeft("");
        router.refresh();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const parts: string[] = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setTimeLeft(parts.join(" "));
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [isBanned, bannedUntil, router]);

  const filteredRequests = requests.filter((req) => {
    if (filter === "ALL") return true;
    return req.status === filter;
  });

  const handleWithdraw = async (id: string) => {
    if (!confirm("Are you sure you want to withdraw this request? This will permanently delete it.")) {
      return;
    }

    setIsDeletingId(id);
    const toastId = toast.loading("Withdrawing request...");
    try {
      const res = await fetch(`/api/animals/request/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Request withdrawn successfully!", { id: toastId });
        setRequests((prev) => prev.filter((r) => r.id !== id));
        router.refresh();
      } else {
        const json = await res.json().catch(() => ({}));
        toast.error(json.message || "Failed to withdraw request.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.", { id: toastId });
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleResubmit = (req: RequestDetail) => {
    localStorage.setItem("resubmit_animal_request", JSON.stringify(req));
    router.push("/request-animal?resubmit=true");
  };

  return {
    requests,
    setRequests,
    filter,
    setFilter,
    isGuidelinesOpen,
    setIsGuidelinesOpen,
    isDeletingId,
    timeLeft,
    filteredRequests,
    handleWithdraw,
    handleResubmit,
  };
}