import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SpaceBackground } from "./SpaceBackground";
import { GlassAtmosphere } from "./GlassAtmosphere";
import { SideNav } from "./SideNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative glass-noise">
      <GlassAtmosphere />
      <SpaceBackground />
      <Header />
      <div className="flex-1 relative z-10 flex">
        <main className="flex-1">{children}</main>
        <div className="hidden lg:block pr-4 pt-[50vh]">
          <SideNav />
        </div>
      </div>
      <Footer />
    </div>
  );
}
