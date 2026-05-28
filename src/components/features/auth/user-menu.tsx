import Image from "next/image";
import Link from "next/link";
import type { Session } from "next-auth";
import { UserRole } from "@prisma/client";
import { signOutUser } from "@/lib/auth-actions";

interface UserMenuProps {
  session: Session;
}

export default function UserMenu({ session }: UserMenuProps) {
  const user = session.user;
  const initials = getInitials(user.name ?? user.email ?? "User");

  return (
    <div className="flex items-center gap-3">
      {user.role === UserRole.ADMIN ? (
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded-full bg-[#154212] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[#2d5a27] active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
          Admin
        </Link>
      ) : null}
      <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white/70 py-1 pl-1 pr-3">
        {user.image ? (
          <Image
            alt={user.name ?? "User avatar"}
            src={user.image}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d0e8c5] text-sm font-bold text-[#154212]">
            {initials}
          </span>
        )}
        <span className="hidden max-w-32 truncate text-sm font-bold text-stone-700 sm:inline">
          {user.name ?? user.email}
        </span>
      </div>
      <form action={signOutUser}>
        <button
          type="submit"
          className="rounded-lg px-3 py-2 text-sm font-bold text-stone-600 transition-colors hover:bg-stone-100 hover:text-[#154212]"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}

function getInitials(value: string) {
  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
