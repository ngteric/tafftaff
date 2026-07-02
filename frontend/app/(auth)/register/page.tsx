"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthCard } from "@/src/components/auth-card";
import { api } from "@/src/lib/api";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { isAuthenticated } from "@/src/lib/auth";
import type { RegisterFormValues } from "@/src/types/auth";

const registerSchema = z.object({
  firstName: z.string().min(1, "Le prenom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caracteres"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = async (values: RegisterFormValues) => {
    setApiError(null);

    try {
      await api.post("/auth/register", values);
      router.push("/login");
    } catch (error) {
      setApiError(
        getApiErrorMessage(error, "Creation du compte impossible pour le moment."),
      );
    }
  };

  return (
    <AuthCard
      title="Creer un compte"
      subtitle="Centralise tes candidatures et garde une trace claire de chaque opportunite."
      footerText="Deja inscrit ?"
      footerHref="/login"
      footerLink="Se connecter"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-neutral-800"
            >
              Prenom
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              {...register("firstName")}
            />
            {errors.firstName ? (
              <p className="mt-2 text-sm text-red-600">
                {errors.firstName.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-neutral-800"
            >
              Nom
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              {...register("lastName")}
            />
            {errors.lastName ? (
              <p className="mt-2 text-sm text-red-600">
                {errors.lastName.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-neutral-800"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-neutral-800"
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            {...register("password")}
          />
          {errors.password ? (
            <p className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        {apiError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {apiError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-11 w-full items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {isSubmitting ? "Creation..." : "Creer mon compte"}
        </button>
      </form>
    </AuthCard>
  );
}
