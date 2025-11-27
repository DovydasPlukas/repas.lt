"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Įvesti neteisingi duomenys!" };
    }

    const { email, password} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Šis el. paštas jau naudojamas!" };
    }

    await db.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    const verificationToken = await generateVerificationToken(email);

    if (!verificationToken.email) {
        return { error: "Nepavyko sugeneruoti patvirtinimo kodo!" };
    }

    await sendVerificationEmail(
        email,
        verificationToken.token,
    );

    return { success: "Patvirtinimo el. laiškas išsiųstas!" };
};