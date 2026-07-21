import { Link } from 'react-router-dom';

interface ErrorPageProps {
  statusCode: number;
  title: string;
  message: string;
  actionLabel?: string;
  actionLink?: string;
}

export default function ErrorPage({
  statusCode,
  title,
  message,
  actionLabel = 'Go back home',
  actionLink = '/home',
}: ErrorPageProps) {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <main className="relative flex min-h-screen items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-500">{statusCode}</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-400">
            {message}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-4">
            <Link
              to={actionLink}
              className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {actionLabel}
            </Link>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-sm font-semibold text-white hover:text-indigo-300"
            >
              Refresh page
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
