"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { getToken, removeToken } from "@/src/lib/auth";
import { getJobOffers } from "@/src/lib/job-offers";
import type { AuthUser } from "@/src/types/auth";
import type { JobOffer, JobOfferStatus } from "@/src/types/job-offer";

const statusLabels: Record<JobOfferStatus, string> = {
  SAVED: "Sauvegardee",
  APPLIED: "Postulee",
  INTERVIEW: "Entretien",
  OFFER: "Offre",
  REJECTED: "Refusee",
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
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
        const [{ data: currentUser }, currentJobOffers] = await Promise.all([
          api.get<AuthUser>("/auth/me"),
          getJobOffers(),
        ]);

        setUser(currentUser);
        setJobOffers(currentJobOffers);
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

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-950">
                  Candidatures
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  {jobOffers.length} opportunite
                  {jobOffers.length > 1 ? "s" : ""} suivie
                  {jobOffers.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {jobOffers.length === 0 ? (
              <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center">
                <p className="text-sm font-medium text-neutral-800">
                  Aucune candidature pour le moment.
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  Tu pourras bientot ajouter ta premiere opportunite ici.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {jobOffers.map((jobOffer) => (
                  <article
                    key={jobOffer.id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-neutral-950">
                        {jobOffer.title}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-600">
                        {jobOffer.company}
                        {jobOffer.location ? ` - ${jobOffer.location}` : ""}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                        {jobOffer.salary ? <span>{jobOffer.salary}</span> : null}
                        {jobOffer.url ? (
                          <a
                            href={jobOffer.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-teal-700 hover:text-teal-800"
                          >
                            Voir le poste
                          </a>
                        ) : null}
                        <span>Ajoutee le {formatDate(jobOffer.createdAt)}</span>
                      </div>
                    </div>
                    <span className="inline-flex h-7 shrink-0 items-center rounded-full bg-teal-50 px-3 text-xs font-semibold text-teal-700">
                      {statusLabels[jobOffer.status]}
                    </span>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-950">
              Utilisateur
            </h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex flex-col gap-1 border-b border-neutral-100 pb-4">
                <dt className="font-medium text-neutral-500">Email</dt>
                <dd className="text-neutral-950">
                  {user?.email ?? "Non renseigne"}
                </dd>
              </div>
              <div className="flex flex-col gap-1 border-b border-neutral-100 pb-4">
                <dt className="font-medium text-neutral-500">Prenom</dt>
                <dd className="text-neutral-950">
                  {user?.firstName ?? "Non renseigne"}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-medium text-neutral-500">Nom</dt>
                <dd className="text-neutral-950">
                  {user?.lastName ?? "Non renseigne"}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </main>
  );
}
