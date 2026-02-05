import { Navbar } from "./_components/navbar";
import { VantaBackground } from "@/components/VantaBackground";

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  return (
      <VantaBackground>
        <div className="h-full w-full flex flex-col gap-y-4 items-center justify-center p-10">
          <Navbar />
          {children}
        </div>
      </VantaBackground>
  );
}