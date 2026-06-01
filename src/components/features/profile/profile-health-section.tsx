import React, { useState, useEffect } from "react";

interface ProfileHealthSectionProps {
  user: {
    is_request_banned: boolean;
    request_banned_until: string | Date | null;
  };
  rejectionCount: number;
}

export const ProfileHealthSection: React.FC<ProfileHealthSectionProps> = ({
  user,
  rejectionCount,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  const banUntilDate = user.request_banned_until ? new Date(user.request_banned_until) : null;
  const isCurrentlyBanned =
    user.is_request_banned || (banUntilDate && banUntilDate > new Date());

  // Effective strikes capped at 3 for UI purposes
  const strikes = Math.min(rejectionCount, 3);

  // Determine status details
  const getStatusDetails = () => {
    if (isCurrentlyBanned) {
      return {
        label: "Suspended",
        colorClass: "text-[#ba1a1a]",
        bgClass: "bg-[#ffdad6]/40 border-[#ba1a1a]/30",
        barColor: "bg-[#ba1a1a]",
        tip: "Your cataloguing privileges have been suspended. Please review the contribution guidelines while you wait.",
        icon: "block",
      };
    }
    if (strikes === 2) {
      return {
        label: "At Risk",
        colorClass: "text-[#ba1a1a]",
        bgClass: "bg-[#ffdad6]/20 border-[#ffdad6]",
        barColor: "bg-[#ba1a1a]",
        tip: "You are at risk of suspension! One more rejected request will temporarily suspend your cataloguing privileges.",
        icon: "warning",
      };
    }
    if (strikes === 1) {
      return {
        label: "Caution",
        colorClass: "text-[#805533]",
        bgClass: "bg-[#ffdcc5]/20 border-[#fdc39a]",
        barColor: "bg-[#805533]",
        tip: "You have 1 rejection strike. Carefully review the Guidelines modal inside the Request panel before submitting again.",
        icon: "error_outline",
      };
    }
    return {
      label: "Excellent",
      colorClass: "text-[#154212]",
      bgClass: "bg-[#bcf0ae]/20 border-[#a1d494]",
      barColor: "bg-[#154212]",
      tip: "Your standing is perfect! Keep up the amazing work and continue to populate our wildlife encyclopedia.",
      icon: "check_circle",
    };
  };

  const status = getStatusDetails();

  // Countdown timer logic
  useEffect(() => {
    if (!banUntilDate || banUntilDate <= new Date() || user.is_request_banned) {
      return;
    }

    const updateTimer = () => {
      const difference = banUntilDate.getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft("");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setTimeLeft(parts.join(" "));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [user.request_banned_until, banUntilDate]);

  return (
    <div className="w-full rounded-3xl border border-[#c2c9bb]/60 bg-[#ffffff]/60 backdrop-blur-md shadow-md p-6 flex flex-col h-full justify-between">
      <div>
        <h2 className="text-xl font-headline font-semibold text-[#1a1c19] flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#2d5a27]">health_and_safety</span>
          Account Health
        </h2>

        {/* Health Status Block */}
        <div className={`p-4 rounded-2xl border flex items-start gap-3 mt-4 ${status.bgClass}`}>
          <span className={`material-symbols-outlined ${status.colorClass} shrink-0 text-[24px]`}>
            {status.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-[#42493e] font-body uppercase tracking-wider font-bold">
                Privilege Status
              </p>
              <span className={`text-sm font-bold font-headline ${status.colorClass}`}>
                {status.label}
              </span>
            </div>
            <p className="text-xs text-[#42493e] font-body mt-1 leading-relaxed">
              {status.tip}
            </p>
          </div>
        </div>

        {/* Strikes meter */}
        <div className="mt-6">
          <div className="flex justify-between items-center text-xs font-body font-semibold text-[#1a1c19]">
            <span>Rejection Strikes</span>
            <span>{strikes} / 3</span>
          </div>

          {/* Progress bar container */}
          <div className="w-full h-3 bg-[#eeeee9] rounded-full mt-2 overflow-hidden flex gap-[2px]">
            <div
              className={`h-full rounded-l-full transition-all duration-500 ease-out ${
                strikes >= 1 ? status.barColor : "bg-transparent"
              }`}
              style={{ width: "33.33%" }}
            />
            <div
              className={`h-full transition-all duration-500 ease-out ${
                strikes >= 2 ? status.barColor : "bg-transparent"
              }`}
              style={{ width: "33.33%" }}
            />
            <div
              className={`h-full rounded-r-full transition-all duration-500 ease-out ${
                strikes >= 3 ? "bg-[#ba1a1a]" : "bg-transparent"
              }`}
              style={{ width: "33.33%" }}
            />
          </div>
        </div>
      </div>

      {/* Countdown timer footer */}
      {isCurrentlyBanned && (
        <div className="mt-6 pt-4 border-t border-[#c2c9bb]/40 text-center">
          {user.is_request_banned ? (
            <p className="text-xs font-semibold text-[#ba1a1a] font-body flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[16px]">gavel</span>
              Privileges are permanently suspended
            </p>
          ) : (
            timeLeft && (
              <div>
                <p className="text-[10px] text-[#42493e] font-body uppercase font-bold tracking-wider">
                  Suspension Lift Countdown
                </p>
                <p className="text-lg font-headline font-bold text-[#ba1a1a] mt-1 tabular-nums animate-pulse">
                  {timeLeft}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
