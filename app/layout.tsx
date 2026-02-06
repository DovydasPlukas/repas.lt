import { Poppins } from "next/font/google";
import "./globals.css";
import SiteWrapper from "../components/SiteWrapper";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
import { siteMetadata } from "./metadata";

const FontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
})

export const metadata = siteMetadata;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // get server-side session (from custom auth() helper)
  let session = null
  try {
    session = await auth()
  } catch (err) {
    console.error("Failed to read session in RootLayout:", err)
    session = null
  }

  return (
    <html lang="lt">
      <body className={`${FontPoppins}  antialiased flex flex-col min-h-screen`}>
        <SessionProvider session={session}>
          <Toaster />
          <SiteWrapper>
            <main className="relative overflow-hidden bg-[--ContentBackground]">
              {children}
            </main>
          </SiteWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}