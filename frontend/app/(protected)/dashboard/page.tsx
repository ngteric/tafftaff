"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/src/lib/api";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { getToken, removeToken } from "@/src/lib/auth";
import {
  createJobOffer,
  deleteJobOffer,
  getJobOffers,
  updateJobOffer,
} from "@/src/lib/job-offers";
import type { AuthUser } from "@/src/types/auth";
import type { JobOffer, JobOfferStatus } from "@/src/types/job-offer";

const createJobOfferSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  company: z.string().min(1, "Entreprise requise"),
  location: z.string(),
  salary: z.string(),
  url: z
    .string()
    .url("URL invalide")
    .or(z.literal("")),
});

type CreateJobOfferFormValues = z.infer<typeof createJobOfferSchema>;

const statusLabels: Record<JobOfferStatus, string> = {
  SAVED: "Sauvegardee",
  APPLIED: "Postulee",
  INTERVIEW: "Entretien",
  OFFER: "Offre",
  REJECTED: "Refusee",
};

const statusOptions: JobOfferStatus[] = [
  "SAVED",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

const statusClasses: Record<JobOfferStatus, string> = {
  SAVED: "border-neutral-200 bg-neutral-50 text-neutral-600",
  APPLIED: "border-neutral-300 bg-neutral-100 text-neutral-800",
  INTERVIEW: "border-orange-200 bg-orange-50 text-orange-700",
  OFFER: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
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
  const [createError, setCreateError] = useState<string | null>(null);
  const [jobOfferActionError, setJobOfferActionError] = useState<string | null>(
    null,
  );
  const [updatingJobOfferId, setUpdatingJobOfferId] = useState<string | null>(
    null,
  );
  const [deletingJobOfferId, setDeletingJobOfferId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobOfferFormValues>({
    resolver: zodResolver(createJobOfferSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      salary: "",
      url: "",
    },
  });

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

  const onCreateJobOffer = async (values: CreateJobOfferFormValues) => {
    setCreateError(null);
    setJobOfferActionError(null);

    try {
      const jobOffer = await createJobOffer({
        title: values.title.trim(),
        company: values.company.trim(),
        location: values.location.trim() || undefined,
        salary: values.salary.trim() || undefined,
        url: values.url.trim() || undefined,
      });

      setJobOffers((currentJobOffers) => [jobOffer, ...currentJobOffers]);
      reset();
    } catch (createJobOfferError) {
      if (
        axios.isAxiosError(createJobOfferError) &&
        (createJobOfferError.response?.status === 401 ||
          createJobOfferError.response?.status === 403)
      ) {
        removeToken();
        router.replace("/login");
        return;
      }

      setCreateError(
        getApiErrorMessage(
          createJobOfferError,
          "Impossible de creer la candidature.",
        ),
      );
    }
  };

  const handleStatusChange = async (
    id: string,
    status: JobOfferStatus,
  ) => {
    const previousJobOffers = jobOffers;

    setJobOfferActionError(null);
    setUpdatingJobOfferId(id);
    setJobOffers((currentJobOffers) =>
      currentJobOffers.map((jobOffer) =>
        jobOffer.id === id ? { ...jobOffer, status } : jobOffer,
      ),
    );

    try {
      const updatedJobOffer = await updateJobOffer(id, { status });

      setJobOffers((currentJobOffers) =>
        currentJobOffers.map((jobOffer) =>
          jobOffer.id === id ? updatedJobOffer : jobOffer,
        ),
      );
    } catch (updateJobOfferError) {
      if (
        axios.isAxiosError(updateJobOfferError) &&
        (updateJobOfferError.response?.status === 401 ||
          updateJobOfferError.response?.status === 403)
      ) {
        removeToken();
        router.replace("/login");
        return;
      }

      setJobOffers(previousJobOffers);
      setJobOfferActionError(
        getApiErrorMessage(
          updateJobOfferError,
          "Impossible de mettre a jour le statut.",
        ),
      );
    } finally {
      setUpdatingJobOfferId(null);
    }
  };

  const handleDeleteJobOffer = async (id: string) => {
    const previousJobOffers = jobOffers;

    setJobOfferActionError(null);
    setDeletingJobOfferId(id);
    setJobOffers((currentJobOffers) =>
      currentJobOffers.filter((jobOffer) => jobOffer.id !== id),
    );

    try {
      await deleteJobOffer(id);
    } catch (deleteJobOfferError) {
      if (
        axios.isAxiosError(deleteJobOfferError) &&
        (deleteJobOfferError.response?.status === 401 ||
          deleteJobOfferError.response?.status === 403)
      ) {
        removeToken();
        router.replace("/login");
        return;
      }

      setJobOffers(previousJobOffers);
      setJobOfferActionError(
        getApiErrorMessage(
          deleteJobOfferError,
          "Impossible de supprimer la candidature.",
        ),
      );
    } finally {
      setDeletingJobOfferId(null);
    }
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

            {jobOfferActionError ? (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {jobOfferActionError}
              </div>
            ) : null}

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
                    <div className="flex shrink-0 flex-col gap-2">
                      <label className="flex flex-col gap-1 text-xs font-medium text-neutral-500">
                        Statut
                        <select
                          value={jobOffer.status}
                          disabled={
                            updatingJobOfferId === jobOffer.id ||
                            deletingJobOfferId === jobOffer.id
                          }
                          onChange={(event) =>
                            void handleStatusChange(
                              jobOffer.id,
                              event.target.value as JobOfferStatus,
                            )
                          }
                          className={`h-9 rounded-md border px-2 text-sm font-semibold outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 disabled:cursor-not-allowed disabled:opacity-70 ${statusClasses[jobOffer.status]}`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {statusLabels[status]}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        disabled={deletingJobOfferId === jobOffer.id}
                        onClick={() => void handleDeleteJobOffer(jobOffer.id)}
                        className="h-9 rounded-md border border-red-200 bg-white px-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
                      >
                        {deletingJobOfferId === jobOffer.id
                          ? "Suppression..."
                          : "Supprimer"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-950">
                Ajouter une candidature
              </h2>
              <form
                onSubmit={handleSubmit(onCreateJobOffer)}
                className="mt-5 space-y-4"
              >
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-neutral-800"
                  >
                    Poste
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                    {...register("title")}
                  />
                  {errors.title ? (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="mb-2 block text-sm font-medium text-neutral-800"
                  >
                    Entreprise
                  </label>
                  <input
                    id="company"
                    type="text"
                    className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                    {...register("company")}
                  />
                  {errors.company ? (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.company.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-neutral-800"
                  >
                    Localisation
                  </label>
                  <input
                    id="location"
                    type="text"
                    className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                    {...register("location")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="salary"
                    className="mb-2 block text-sm font-medium text-neutral-800"
                  >
                    Salaire
                  </label>
                  <input
                    id="salary"
                    type="text"
                    className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                    {...register("salary")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="url"
                    className="mb-2 block text-sm font-medium text-neutral-800"
                  >
                    URL
                  </label>
                  <input
                    id="url"
                    type="url"
                    className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                    {...register("url")}
                  />
                  {errors.url ? (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.url.message}
                    </p>
                  ) : null}
                </div>

                {createError ? (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {createError}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-10 w-full items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
                >
                  {isSubmitting ? "Ajout..." : "Ajouter"}
                </button>
              </form>
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
          </aside>
        </div>
      </div>
    </main>
  );
}
