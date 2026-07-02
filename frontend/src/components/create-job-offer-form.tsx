import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

export type CreateJobOfferFormValues = z.infer<typeof createJobOfferSchema>;

type CreateJobOfferFormProps = {
  error: string | null;
  onSubmit: (values: CreateJobOfferFormValues) => Promise<boolean>;
};

export function CreateJobOfferForm({
  error,
  onSubmit,
}: CreateJobOfferFormProps) {
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

  const handleFormSubmit = async (values: CreateJobOfferFormValues) => {
    const isCreated = await onSubmit(values);

    if (isCreated) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-5 space-y-4">
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
          <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
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
          <p className="mt-2 text-sm text-red-600">{errors.company.message}</p>
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
          <p className="mt-2 text-sm text-red-600">{errors.url.message}</p>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
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
  );
}
