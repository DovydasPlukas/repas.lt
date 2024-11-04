import type { Metadata } from "next";
import { Poppins } from'next/font/google';
import "./globals.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import PageFill from "./Components/PageFill";

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
        <Navbar/>
        <main className="relative overflow-hidden">
          {children}
        </main>
        <PageFill/>
        <Footer/>
      </body>
    </html>
  );
}
