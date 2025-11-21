"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageFill from "./PageFill";
import NotFound from "../app/not-found";

interface Props {
  children: React.ReactNode;
}

export default function SiteWrapperClient({ children }: Props) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Admin check using extended session type
  const isAdmin = session?.user?.role === "ADMIN";

  const isDashboardRoute = pathname === "/dashboard";

  if (isDashboardRoute) {
    if (isAdmin) {
      return <>{children}</>;
    }

    return (
      <>
        <Navbar />
        <NotFound />
        <PageFill />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      {children}
      <PageFill />
      <Footer />
    </>
  );
}