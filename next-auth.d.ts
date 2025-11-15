import { UserRole } from "@prisma/client";
import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole;
    isTwoFactorEnabled: boolean;
    is0Auth: boolean;
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}