"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { getToken, removeToken } from "@/src/lib/auth";
import type { AuthUser } from "@/src/types/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const loadUser = async () => {
      let shouldStopLoading = true;

      try {
        const { data } = await api.get<AuthUser>("/auth/me");
        setUser(data);
      } catch (loadError) {
        if (
          axios.isAxiosError(loadError) &&
          (loadError.response?.status === 401 ||
            loadError.response?.status === 403)
        ) {
          removeToken();
          shouldStopLoading = false;
          router.replace("/login");
          return;
        }

        setError(
          getApiErrorMessage(
            loadError,
            "Impossible de charger les informations utilisateur.",
          ),
        );
      } finally {
        if (shouldStopLoading) {
          setIsLoading(false);
        }
      }
    };

    void loadUser();
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.replace("/login");
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f7f9] px-4 text-neutral-950">
        <div className="rounded-md border border-neutral-200 bg-white px-5 py-4 text-sm text-neutral-600 shadow-sm">
          Chargement du dashboard...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f6f7f9] px-4 py-8 text-neutral-950">
        <div className="mx-auto w-full max-w-5xl">
          <header className="mb-8 flex items-center justify-between">
            <div className="text-lg font-semibold text-teal-700">TaffTaff</div>
            <button
              type="button"
              onClick={handleLogout}
              className="h-10 rounded-md border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              Logout
            </button>
          </header>

          <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] px-4 py-8 text-neutral-950">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10 flex items-center justify-between">
          <div className="text-lg font-semibold text-teal-700">TaffTaff</div>
          <button
            type="button"
            onClick={handleLogout}
            className="h-10 rounded-md border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
          >
            Logout
          </button>
        </header>

        <section className="mb-8">
          <h1 className="text-3xl font-semibold tracking-normal text-neutral-950">
            Dashboard
          </h1>
          <p className="mt-2 text-base text-neutral-600">
            Bienvenue sur TaffTaff
          </p>
        </section>

        <section className="max-w-xl rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-950">
            Utilisateur
          </h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex flex-col gap-1 border-b border-neutral-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <dt className="font-medium text-neutral-500">Email</dt>
              <dd className="text-neutral-950">
                {user?.email ?? "Non renseigne"}
              </dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-neutral-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <dt className="font-medium text-neutral-500">Prenom</dt>
              <dd className="text-neutral-950">
                {user?.firstName ?? "Non renseigne"}
              </dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <dt className="font-medium text-neutral-500">Nom</dt>
              <dd className="text-neutral-950">
                {user?.lastName ?? "Non renseigne"}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
