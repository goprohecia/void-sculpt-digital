import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type DemoRole = "admin" | "client";

interface DemoUser {
  email: string;
  nom: string;
  role: DemoRole;
}

interface DemoAuthContextType {
  user: DemoUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const DEMO_ACCOUNTS: Record<string, { password: string; user: DemoUser }> = {
  "admin@mba.demo": {
    password: "demo2026",
    user: { email: "admin@mba.demo", nom: "Admin MBA", role: "admin" },
  },
  "client@mba.demo": {
    password: "demo2026",
    user: { email: "client@mba.demo", nom: "Client Demo", role: "client" },
  },
};

const DemoAuthContext = createContext<DemoAuthContextType | null>(null);

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(() => {
    const stored = sessionStorage.getItem("demo_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email: string, password: string): boolean => {
    const account = DEMO_ACCOUNTS[email.toLowerCase()];
    if (account && account.password === password) {
      setUser(account.user);
      sessionStorage.setItem("demo_user", JSON.stringify(account.user));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("demo_user");
  }, []);

  return (
    <DemoAuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error("useDemoAuth must be used within a DemoAuthProvider");
  }
  return context;
}
