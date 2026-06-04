import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <form action="/api/dashboard/auth/logout" method="post">
      <button
        type="submit"
        className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 px-3 text-sm font-medium text-gray-700 transition hover:border-brand-green hover:text-brand-green"
      >
        <LogOut aria-hidden="true" size={16} />
        Sign out
      </button>
    </form>
  );
}
