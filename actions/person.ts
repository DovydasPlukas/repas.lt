"use server";
/* eslint-disable */

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PersonSchema } from "@/schemas";
import { getContactByUserId } from "@/data/contact";

export const savePerson = async (values: z.infer<typeof PersonSchema>) => {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: "Neatpažinta sesija" };
    }

    const validatedFields = PersonSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Neteisingi duomenys" };
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return { error: "Vartotojas nerastas" };
    }

    try {
        // Ensure phone number has +370 prefix
        const phoneNumber = validatedFields.data.phoneNumber.startsWith("+370")
            ? validatedFields.data.phoneNumber
            : "+370" + validatedFields.data.phoneNumber;

        await db.contact.upsert({
            where: { userId: user.id },
            update: {
                firstName: validatedFields.data.firstName,
                lastName: validatedFields.data.lastName,
                phoneNumber: phoneNumber,
            },
            create: {
                userId: user.id,
                firstName: validatedFields.data.firstName,
                lastName: validatedFields.data.lastName,
                phoneNumber: phoneNumber,
            },
        });

        return { success: "Duomenys sėkmingai išsaugoti" };
    } catch (error) {
        return { error: "Nepavyko išsaugoti duomenų" };
    }
};

export const getPersonData = async () => {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: "Neatpažinta sesija", data: null };
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return { error: "Vartotojas nerastas", data: null };
    }

    const contact = await getContactByUserId(user.id);

    if (contact) {
        // Strip +370 prefix for display in form
        const phoneNumber = contact.phoneNumber.startsWith("+370")
            ? contact.phoneNumber.slice(4)
            : contact.phoneNumber;

        return {
            success: "Duomenys gauti",
            data: {
                firstName: contact.firstName,
                lastName: contact.lastName,
                phoneNumber: phoneNumber,
            }
        };
    }

    return {
        success: "Duomenys gauti",
        data: {
            firstName: "",
            lastName: "",
            phoneNumber: ""
        }
    };
};