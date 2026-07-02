import type { JobOfferStatus } from "@/src/types/job-offer";

export const jobOfferStatusLabels: Record<JobOfferStatus, string> = {
  SAVED: "Sauvegardée",
  APPLIED: "Postulée",
  INTERVIEW: "Entretien",
  OFFER: "Offre",
  REJECTED: "Refusée",
};

export const jobOfferStatusOptions: JobOfferStatus[] = [
  "SAVED",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

export const jobOfferStatusClasses: Record<JobOfferStatus, string> = {
  SAVED: "border-neutral-200 bg-neutral-50 text-neutral-600",
  APPLIED: "border-neutral-300 bg-neutral-100 text-neutral-800",
  INTERVIEW: "border-orange-200 bg-orange-50 text-orange-700",
  OFFER: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
};

export const formatJobOfferDate = (date: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
