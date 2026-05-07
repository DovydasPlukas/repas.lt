"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import {
  sendVerificationEmail,
  sendTwoFactorTokenEmail,
} from "@/lib/mail";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

type LoginActionResult =
  | { error: string }
  | { success: string }
  | { twoFactor: true };

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
): Promise<LoginActionResult> => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Neteisingi duomenys!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "El. paštas neegzistuoja!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Patvirtinimo el. laiškas išsiųstas!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: "Neteisingas kodas!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Neteisingas kodas!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Kodo galiojimas pasibaigė!" };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorTokenEmail(
        twoFactorToken.email,
        twoFactorToken.token
      );

      return { twoFactor: true };
    }
  }

  try {
    const safeCallbackUrl =
      callbackUrl && callbackUrl.startsWith("/")
        ? callbackUrl
        : DEFAULT_LOGIN_REDIRECT;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: safeCallbackUrl,
    });

    return { success: "Prisijungta!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Neteisingi prisijungimo duomenys!" };
        default:
          return { error: "Įvyko klaida!" };
      }
    }

    throw error;
  }
};