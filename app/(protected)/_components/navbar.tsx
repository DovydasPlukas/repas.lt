"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-secondary w-full max-w-md mx-auto p-4 rounded-xl shadow-sm">
      <div className="flex flex-wrap justify-center gap-6">
        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
          className="w-full sm:w-auto"
        >
          <Link href="/settings">Paskyra</Link>
        </Button>

        <Button
          asChild
          variant={pathname === "/user-address" ? "default" : "outline"}
          className="w-full sm:w-auto"
        >
          <Link href="/user-address">Adresas</Link>
        </Button>

        <Button
          asChild
          variant={pathname === "/asmuo" ? "default" : "outline"}
          className="w-full sm:w-auto"
        >
          <Link href="/asmuo">Asmuo</Link>
        </Button>
      </div>
    </nav>
  );
};