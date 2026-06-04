import Link from "next/link";
import { Database, FileArchive, FolderKanban } from "lucide-react";
import type { ReactNode } from "react";
import type { AccountRow, AccountRole } from "@/lib/dashboard/types";
import LogoutButton from "./LogoutButton";

export default function DashboardFrame({
  account,
  role,
  children,
}: {
  account: AccountRow;
  role: AccountRole;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-off-white text-brand-black">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/dashboard" className="text-xl font-bold tracking-tight">
              WISCON
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span>{account.name}</span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span>{role}</span>
              {account.subscription_tier && (
                <>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span>{account.subscription_tier}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 px-3 text-sm font-medium text-gray-700 transition hover:border-brand-green hover:text-brand-green"
            >
              <Database aria-hidden="true" size={16} />
              Records
            </Link>
            <Link
              href="/dashboard/exports"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 px-3 text-sm font-medium text-gray-700 transition hover:border-brand-green hover:text-brand-green"
            >
              <FileArchive aria-hidden="true" size={16} />
              Exports
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 px-3 text-sm font-medium text-gray-700 transition hover:border-brand-green hover:text-brand-green"
            >
              <FolderKanban aria-hidden="true" size={16} />
              Plan
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
