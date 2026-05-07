"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form/form-error";
import { FormSuccess } from "@/components/form/form-success";
import { login } from "@/actions/login";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Šis el. paštas jau naudojamas su kitu prisijungimo būdu!"
      : "";

  const router = useRouter();
  const { update } = useSession();

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const getRedirectUrl = () => {
    if (callbackUrl && callbackUrl.startsWith("/")) {
      return callbackUrl;
    }
    return DEFAULT_LOGIN_REDIRECT;
  };

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      login(values, callbackUrl)
        .then(async (data) => {
          if (!data) {
            setError("Įvyko klaida. Bandykite dar kartą.");
            return;
          }

          if ("error" in data) {
            form.reset();
            setShowTwoFactor(false);
            setError(data.error);
            return;
          }

          if ("twoFactor" in data) {
            setShowTwoFactor(true);
            return;
          }

          if ("success" in data) {
            form.reset();
            setShowTwoFactor(false);
            setSuccess(data.success);

            await update();

            const redirectTo = getRedirectUrl();
            router.push(redirectTo);
            router.refresh();
          }
        })
        .catch(() => {
          setError("Įvyko klaida. Bandykite dar kartą.");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Sveiki sugrįžę"
      backButtonLabel="Neturite paskyros?"
      backButtonHref="/registracija"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dviejų veiksnių kodas</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>El. paštas</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="vardas.pavarde@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slaptažodis</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="******"
                          type="password"
                        />
                      </FormControl>

                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/reset">
                          Pamiršote slaptažodį?
                        </Link>
                      </Button>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <FormError message={error || urlError} />
          <FormSuccess message={success} />

          <Button
            disabled={isPending}
            type="submit"
            className="w-full hover:bg-[--RepasBlue] transition-all duration-300 ease-in-out"
          >
            {showTwoFactor ? "Patvirtinti" : "Prisijungti"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};