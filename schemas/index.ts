import { UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "El. paštas yra privalomas",
    }),
    password: z.string().min(1, {
        message: "Slaptažodis yra privalomas",
    }),
    code: z.optional(z.string()),
});


export const RegisterSchema = z.object({
    email: z.string().email({
        message: "El. paštas yra privalomas",
    }),
    password: z.string().min(6, {
        message: "Reikalingi mažiausiai 6 simboliai",
    }),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "El. paštas yra privalomas",
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Reikalingi mažiausiai 6 simboliai",
    }),
});

// role switch - "role: z.enum([UserRole.ADMIN, UserRole.USER]),"
export const SettingsSchema = z.object({
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
})
    .refine((data) => {
        if (data.password && !data.newPassword) {
            return false;
        }

        return true;
    }, {
        message: "Naujas slaptažodis yra privalomas",
        path: ["newPassword"]
    })
    .refine((data) => {
        if (data.newPassword && !data.password) {
            return false;
        }

        return true;
    }, {
        message: "Dabartinis slaptažodis yra privalomas",
        path: ["password"]
    });

export const PersonSchema = z.object({
    firstName: z.string().min(1, {
        message: "Vardas yra privalomas",
    }),
    lastName: z.string().min(1, {
        message: "Pavardė yra privaloma",
    }),
    phoneNumber: z.string().min(8, {
        message: "Telefonas turi turėti mažiausiai 8 skaičius",
    }).max(8, {
        message: "Telefonas negali viršyti 8 skaičių",
    }).regex(/^\d+$/, {
        message: "Telefonas turi turėti tik skaičius",
    }),
});