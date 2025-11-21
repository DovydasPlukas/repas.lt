import type { Metadata } from "next";
import { Poppins } from'next/font/google';
import "./globals.css";
import SiteWrapper from "../components/SiteWrapper";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

const FontPoppins = Poppins({
  subsets:['latin'],
  weight: ['100','200','300','400','500','600','700'],
});

export const metadata: Metadata = {
  title: "Repas.lt",
  description: "Skalbimo paslaugos",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="lt">
      <body className={`${FontPoppins}  antialiased flex flex-col min-h-screen`}>
        <SessionProvider >
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