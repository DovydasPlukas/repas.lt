import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Navbar } from "./_components/navbar";
import { VantaBackground } from "@/components/VantaBackground";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <VantaBackground>
        <div className="h-full w-full flex flex-col gap-y-4 items-center justify-center p-10">
          <Navbar />
          {children}
        </div>
      </VantaBackground>
    </SessionProvider>
  );
}