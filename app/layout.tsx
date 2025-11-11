import type { Metadata } from "next";
import { Poppins } from'next/font/google';
import "./globals.css";
import SiteWrapper from "../components/SiteWrapper";

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
        <SiteWrapper isAdmin={true}> {/* Set isAdmin based on your auth logic */}
          <main className="relative overflow-hidden bg-[--ContentBackground]">
            {children}
          </main>
        </SiteWrapper>
      </body>
    </html>
  );
}
