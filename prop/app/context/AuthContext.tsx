"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../lib/api";

interface User { id: string; name: string; email: string; role: string; }
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("aarambh_token");
    if (saved) {
      setToken(saved);
      api.get("/auth/me").then(r => setUser(r.data.user)).catch(() => {
        localStorage.removeItem("aarambh_token");
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem("aarambh_token", res.data.token);
  };

  const logout = () => {
    setUser(null); setToken(null);
    localStorage.removeItem("aarambh_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
