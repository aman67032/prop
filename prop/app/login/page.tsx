"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #1B3A5C, #0F2440)" }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full animate-float" style={{ background: "radial-gradient(circle, #D4763C, transparent)" }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, #5BA88C, transparent)", animation: "float 4s ease-in-out infinite 1s" }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8 flex flex-col items-center">
          <Image 
            src="/Assests/aarambh_logo_white.png" 
            alt="Aarambh 2026 Logo" 
            width={180} 
            height={100} 
            className="object-contain drop-shadow-lg mb-4"
          />
          <p className="text-gray-400 mt-1">Command Center Login</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-8 shadow-2xl border"
          style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm font-medium" style={{ background: "#FEE2E2", color: "#DC2626" }}>
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-500 border border-white/20 focus:outline-none focus:border-orange-400 transition-all"
              placeholder="your@jklu.edu.in" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-500 border border-white/20 focus:outline-none focus:border-orange-400 transition-all"
              placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #D4763C, #B85E2A)" }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Public viewers don&apos;t need to login — <a href="/" className="underline" style={{ color: "#D4763C" }}>browse freely</a>
        </p>
      </div>
    </div>
  );
}
