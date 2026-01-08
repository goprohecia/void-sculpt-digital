import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SpaceBackground } from "./SpaceBackground";
import { GlassAtmosphere } from "./GlassAtmosphere";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative glass-noise">
      <GlassAtmosphere />
      <SpaceBackground />
      <Header />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
