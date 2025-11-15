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
    name: z.string().min(1, {
        message: "Vardas yra privalomas",
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

export const SettingsSchema = z.object({
    name: z.optional(z.string()),
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