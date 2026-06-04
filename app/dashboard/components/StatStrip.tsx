export default function StatStrip({
  stats,
}: {
  stats: Array<{ label: string; value: string | number }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="border border-gray-200 bg-white px-4 py-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{stat.label}</dt>
          <dd className="mt-2 text-2xl font-bold tracking-tight text-brand-black">{stat.value}</dd>
        </div>
      ))}
    </div>
  );
}
