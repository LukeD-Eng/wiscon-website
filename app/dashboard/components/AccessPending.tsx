import DashboardLogin from "./DashboardLogin";

export default function AccessPending({ email }: { email?: string | null }) {
  return (
    <main className="min-h-screen bg-white px-5 py-12 sm:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-green">
          WISCON Dashboard
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-brand-black">
          Access pending
        </h1>
        <p className="mb-6 text-base leading-relaxed text-gray-600">
          {email ? `${email} is signed in, but it is not linked to a WISCON company account yet.` : "This login is not linked to a WISCON company account yet."}
        </p>
        <form action="/api/dashboard/auth/logout" method="post">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand-green px-5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Use another email
          </button>
        </form>
      </div>
    </main>
  );
}

export function ConfigMissing({ message }: { message: string }) {
  return <DashboardLogin configError={message} />;
}
