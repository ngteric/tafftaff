export type JobOfferStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED";

export type JobOffer = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  salary: string | null;
  url: string | null;
  status: JobOfferStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type CreateJobOfferPayload = {
  title: string;
  company: string;
  location?: string;
  salary?: string;
  url?: string;
  status?: JobOfferStatus;
};

export type UpdateJobOfferPayload = Partial<CreateJobOfferPayload>;
