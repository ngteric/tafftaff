import Link from "next/link";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerHref: string;
  footerLink: string;
};

export function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerHref,
  footerLink,
}: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7f9] px-4 py-10 text-neutral-950">
      <section className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center text-sm font-semibold text-teal-700"
          >
            TaffTaff
          </Link>
          <h1 className="text-2xl font-semibold tracking-normal text-neutral-950">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-neutral-600">{subtitle}</p>
        </div>

        {children}

        <p className="mt-6 text-center text-sm text-neutral-600">
          {footerText}{" "}
          <Link
            href={footerHref}
            className="font-medium text-teal-700 hover:text-teal-800"
          >
            {footerLink}
          </Link>
        </p>
      </section>
    </main>
  );
}
