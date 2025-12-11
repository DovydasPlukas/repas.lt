"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-full max-w-2xl shadow-sm">
            <div className="flex gap-x-4 flex-wrap">
                <Button 
                    asChild
                    variant={pathname === "/settings" ? "default" : "outline"}
                >
                    <Link href="/settings">
                        Paskyra
                    </Link>
                </Button>
                <Button 
                    asChild
                    variant={pathname === "/user-address" ? "default" : "outline"}
                >
                    <Link href="/user-address">
                        Adresas
                    </Link>
                </Button>
                <Button 
                    asChild
                    variant={pathname === "/asmuo" ? "default" : "outline"}
                >
                    <Link href="/asmuo">
                        Asmuo
                    </Link>
                </Button>
                
            </div>
        {/* delete later*/}
            <UserButton />
        </nav>
    )
}