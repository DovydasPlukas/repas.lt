import { db } from "@/lib/db";

export const getContactByUserId = async (userId: string) => {
    try {
        const contact = await db.contact.findUnique({
            where: { userId },
        });

        return contact;
    } catch {
        return null;
    }
};
