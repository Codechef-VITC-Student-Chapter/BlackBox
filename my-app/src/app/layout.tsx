import type { Metadata } from "next";
import "./globals.css";
import { SoundToggle } from "@/components/ui/SoundToggle";
// import { AuroraBackground } from "@/components/background/AuroraBackground";
import { AnimatedGrid } from "@/components/background/AnimatedGrid";
import { MouseGlow } from "@/components/background/MouseGlow";

export const metadata: Metadata = {
  title: "BLACKBOX | Recovery Interface",
  description: "The application works. The truth is hidden inside.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background min-h-screen relative">
        <MouseGlow />
        {/* <AuroraBackground /> */}
        <AnimatedGrid />
        
        <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 lg:p-12">
          {children}
        </main>
        
        <SoundToggle />
      </body>
    </html>
  );
}
