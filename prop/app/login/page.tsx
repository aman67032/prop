"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Terminal, Lock, KeyRound } from "lucide-react";

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
      setError("ERR_UNAUTHORIZED: CREDENTIALS_REJECTED");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 bg-[#050505] text-white font-sans selection:bg-[#D4763C]/30"
         style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4763C] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-10 flex flex-col items-center">
          <Image 
            src="/Assests/aarambh_logo_white.png" 
            alt="Aarambh 2026 Logo" 
            width={160} 
            height={80} 
            className="object-contain drop-shadow-[0_0_15px_rgba(212,118,60,0.5)] mb-4"
          />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0A0A0A] border border-white/10 text-[10px] font-mono tracking-widest uppercase text-gray-500">
            <Terminal size={12} className="text-[#D4763C]" /> SYSTEM_AUTHENTICATION
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0A0A0A] rounded-xl p-8 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4763C]/50 to-transparent" />
          
          {error && (
            <div className="mb-6 p-3 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs font-mono text-[#EF4444] uppercase tracking-widest text-center animate-pulse">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-[10px] font-mono tracking-widest uppercase text-gray-500 mb-2 flex items-center gap-2">
              <Lock size={12} className="text-[#5BA88C]" /> OPERATIVE_ID
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 bg-white/5 text-white font-mono text-sm border border-white/10 rounded focus:outline-none focus:border-[#D4763C]/50 focus:bg-white/10 transition-all placeholder-gray-700"
              placeholder="UID@jklu.edu.in" />
          </div>
          <div className="mb-8">
            <label className="block text-[10px] font-mono tracking-widest uppercase text-gray-500 mb-2 flex items-center gap-2">
              <KeyRound size={12} className="text-[#5BA88C]" /> ENCRYPTION_KEY
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-4 py-3 bg-white/5 text-white font-mono text-sm border border-white/10 rounded focus:outline-none focus:border-[#D4763C]/50 focus:bg-white/10 transition-all placeholder-gray-700 tracking-[0.2em]"
              placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded text-xs font-mono font-bold text-black uppercase tracking-widest transition-all disabled:opacity-50 hover:bg-[#b85e2a]"
            style={{ background: "#D4763C", boxShadow: "0 0 20px rgba(212,118,60,0.2)" }}>
            {loading ? "AUTHENTICATING..." : "INITIATE_HANDSHAKE"}
          </button>
        </form>

        <p className="text-center text-[10px] font-mono tracking-widest uppercase text-gray-600 mt-8">
          PUBLIC.ACCESS_LEVEL &gt; <a href="/" className="text-[#5BA88C] hover:text-white transition-colors">GUEST_MODE</a>
        </p>
      </div>
    </div>
  );
}
