import type { DashboardProjectSummary, RecordFilters } from "@/lib/dashboard/types";
import { MODULE_OPTIONS } from "@/lib/dashboard/filters";

const STATUS_OPTIONS = [
  "active",
  "awaiting_gc_confirm",
  "sent_to_client",
  "sent",
  "approved",
  "accepted",
  "declined",
  "expired",
  "OPEN",
  "PENDING_REVIEW",
  "CLOSED",
  "logged",
  "reported",
  "closed",
  "booked",
];

export default function FilterBar({
  filters,
  projects,
}: {
  filters: RecordFilters;
  projects: DashboardProjectSummary[];
}) {
  return (
    <form className="grid gap-3 border-y border-gray-200 bg-white px-4 py-4 md:grid-cols-4 xl:grid-cols-8">
      <label className="block md:col-span-2 xl:col-span-2">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Search</span>
        <input
          name="q"
          defaultValue={filters.q ?? ""}
          className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
          placeholder="Client, snag, quote..."
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Project</span>
        <select
          name="projectId"
          defaultValue={filters.projectId ?? ""}
          className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
        >
          <option value="">All</option>
          {projects.map((project) => (
            <option key={project.project_id} value={project.project_id}>
              {project.project_name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Module</span>
        <select
          name="module"
          defaultValue={filters.module ?? ""}
          className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
        >
          <option value="">All</option>
          {MODULE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Status</span>
        <select
          name="status"
          defaultValue={filters.status ?? ""}
          className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
        >
          <option value="">All</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">From</span>
        <input
          name="from"
          type="date"
          defaultValue={filters.from ?? ""}
          className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">To</span>
        <input
          name="to"
          type="date"
          defaultValue={filters.to ?? ""}
          className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
        />
      </label>
      <div className="flex items-end gap-2">
        <button
          type="submit"
          className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-brand-black px-4 text-sm font-semibold text-white transition hover:bg-black"
        >
          Filter
        </button>
        <a
          href="/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:border-brand-green hover:text-brand-green"
        >
          Reset
        </a>
      </div>
    </form>
  );
}
