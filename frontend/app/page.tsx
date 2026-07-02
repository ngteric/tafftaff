"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "@/src/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-[#f6f7f9] px-4 py-8 text-neutral-950">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col">
        <header className="flex items-center justify-between">
          <div className="text-lg font-semibold text-teal-700">TaffTaff</div>
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-white"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Inscription
            </Link>
          </nav>
        </header>

        <section className="flex flex-1 items-center py-16">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-normal text-teal-700">
              Suivi de candidatures
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-neutral-950 sm:text-5xl">
              Garde une vue claire sur ta recherche de job.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600">
              TaffTaff t’aide a centraliser tes opportunites et a preparer la
              suite, une etape apres l’autre.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="flex h-11 items-center justify-center rounded-md bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800"
              >
                Creer un compte
              </Link>
              <Link
                href="/login"
                className="flex h-11 items-center justify-center rounded-md border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
