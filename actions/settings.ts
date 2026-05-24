"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const settings = async (
    values: z.infer<typeof SettingsSchema>
) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Neleistina" };
    }

    if (!user.id) {
        return { error: "Neleistina" };
    }
    
    const dbUser = await getUserById(user.id);

    if (!dbUser){
        return { error: "Neleistina" };
    }

    // Block changes if user is OAuth
    if (user.is0Auth){
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    // Check if email is being changed
    if (values.email && values.email !== user.email){
        const existingUser = await getUserByEmail(values.email);

        if (existingUser && existingUser.id !== user.id) {
            return { error: "Šis el. paštas jau naudojamas!" };
        }

        const verificationToken = await generateVerificationToken(values.email);

        if (!verificationToken.email) {
            return { error: "Nepavyko gauti el. pašto patvirtinimo kodo!" };
        }

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return { success: "Patvirtinimo el. laiškas išsiųstas!" };
    }

    // Change password
    if (values.password && values.newPassword && dbUser.password){
        const passwordsMatch = await bcrypt.compare(
            values.password,
            dbUser.password,
        );

        if (!passwordsMatch) {
            return { error: "Įvestas slaptažodis neteisingas!" };
        }

        const hashedPassword = await bcrypt.hash(
            values.newPassword,
            10,
        );
        values.password = hashedPassword;
        values.newPassword = undefined;
    }

    await db.user.update({
        where: { id: dbUser.id },
        data: {
            ...values,
        }
    });

    return { success: "Nustatymai sėkmingai atnaujinti!" };
}