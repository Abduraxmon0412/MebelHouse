"use client";
import { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; name: string; email: string; bio?: string; avatar?: string } | null;

const AuthContext = createContext<{
  user: User;
  loading: boolean;
  refresh: () => void;
}>({ user: null, loading: true, refresh: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(({ user }) => setUser(user))
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  return <AuthContext.Provider value={{ user, loading, refresh }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
