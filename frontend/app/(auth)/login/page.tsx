"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthCard } from "@/src/components/auth-card";
import { api } from "@/src/lib/api";
import { getApiErrorMessage } from "@/src/lib/api-error";
import { isAuthenticated, setToken } from "@/src/lib/auth";
import type { LoginFormValues, LoginResponse } from "@/src/types/auth";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export default function LoginPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null);

    try {
      const { data } = await api.post<LoginResponse>("/auth/login", values);
      const token = data.access_token ?? data.accessToken;

      if (!token) {
        setApiError("Token manquant dans la reponse du serveur.");
        return;
      }

      setToken(token);
      router.push("/dashboard");
    } catch (error) {
      setApiError(
        getApiErrorMessage(error, "Connexion impossible pour le moment."),
      );
    }
  };

  return (
    <AuthCard
      title="Connexion"
      subtitle="Retrouve ton suivi de candidatures et garde le cap sur tes prochaines opportunites."
      footerText="Pas encore de compte ?"
      footerHref="/register"
      footerLink="Creer un compte"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="password"
              className="text-sm font-medium text-neutral-800"
            >
              Mot de passe
            </label>
            <Link href="/register" className="text-sm text-neutral-500">
              Nouveau ici ?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
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
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </AuthCard>
  );
}
