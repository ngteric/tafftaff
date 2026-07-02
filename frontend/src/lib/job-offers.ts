import { api } from "./api";
import type {
  CreateJobOfferPayload,
  JobOffer,
  UpdateJobOfferPayload,
} from "@/src/types/job-offer";

export const getJobOffers = async () => {
  const { data } = await api.get<JobOffer[]>("/job-offers");

  return data;
};

export const createJobOffer = async (payload: CreateJobOfferPayload) => {
  const { data } = await api.post<JobOffer>("/job-offers", payload);

  return data;
};

export const updateJobOffer = async (
  id: string,
  payload: UpdateJobOfferPayload,
) => {
  const { data } = await api.patch<JobOffer>(`/job-offers/${id}`, payload);

  return data;
};

export const deleteJobOffer = async (id: string) => {
  await api.delete(`/job-offers/${id}`);
};
