"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageFill from "./PageFill";
import NotFound from "../app/not-found";

interface Props {
  children: React.ReactNode;
  isAdmin: boolean; // pass this prop from your auth/session
}

export default function SiteWrapper({ children, isAdmin }: Props) {
  const pathname = usePathname();

  const isDashboardRoute =
    pathname === "/dashboard";

  if (isDashboardRoute) {
    // Admin sees dashboard without wrapper
    if (isAdmin) return <>{children}</>;

    // Non-admin sees error page with layout
    return (
      <>
        <Navbar />
        <NotFound />
        <PageFill />
        <Footer />
      </>
    );
  }

  // All other pages
  return (
    <>
      <Navbar />
      {children}
      <PageFill />
      <Footer />
    </>
  );
}