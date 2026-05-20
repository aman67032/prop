"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Zap, LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10 bg-[#050505]/80">
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4763C]/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/Assests/aarambh_logo_white.png" 
              alt="Aarambh Logo" 
              width={40} 
              height={40} 
              className="object-contain drop-shadow-[0_0_8px_rgba(212,118,60,0.5)] group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="text-white font-mono font-bold text-lg tracking-tight">Aarambh&apos;26</span>
              <span className="block text-[10px] font-mono tracking-widest uppercase text-[#D4763C]">SYS.CMD_CENTER</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {[
              { href: "/", label: "DASHBOARD" },
              { href: "/team", label: "TEAM_DATA" },
              { href: "/deadlines", label: "DEADLINES" },
              { href: "/calendar", label: "CALENDAR" },
            ].map(link => (
              <Link key={link.href} href={link.href}
                className="px-4 py-2 rounded-md text-xs font-mono text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                [{link.label}]
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                <Link href={user.role === "super_auth" ? "/admin" : "/organizer"}
                  className="flex items-center gap-2 px-4 py-1.5 rounded text-xs font-mono font-bold text-black bg-[#5BA88C] hover:bg-[#4a8a72] shadow-[0_0_10px_rgba(91,168,140,0.3)] transition-all">
                  {user.role === "super_auth" ? <><Zap size={14} /> ADMIN_OVR</> : <><LayoutDashboard size={14} /> PNL_ACCESS</>}
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded border border-[#D4763C]/30 flex items-center justify-center text-[#D4763C] text-xs font-mono bg-[#D4763C]/10">
                    {user.name.charAt(0)}
                  </div>
                  <button onClick={logout} className="text-gray-500 hover:text-[#EF4444] transition-colors" title="Disconnect">
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login"
                className="ml-4 px-5 py-2 rounded text-xs font-mono font-bold text-black bg-[#D4763C] hover:bg-[#b85e2a] shadow-[0_0_10px_rgba(212,118,60,0.3)] transition-all">
                SYS.LOGIN
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white font-mono border border-white/10 px-3 py-1 rounded hover:bg-white/5">
            {menuOpen ? "[X]" : "[=]"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-white/10 font-mono">
            {[
              { href: "/", label: "DASHBOARD" },
              { href: "/team", label: "TEAM_DATA" },
              { href: "/deadlines", label: "DEADLINES" },
              { href: "/calendar", label: "CALENDAR" },
            ].map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded">
                &gt; {link.label}
              </Link>
            ))}
            {user ? (
              <div className="pt-2 mt-2 border-t border-white/10 space-y-2">
                <Link href={user.role === "super_auth" ? "/admin" : "/organizer"}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded text-xs font-bold text-black bg-[#5BA88C]">
                  {user.role === "super_auth" ? <><Zap size={14} /> ADMIN_OVR</> : <><LayoutDashboard size={14} /> PNL_ACCESS</>}
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs text-[#EF4444] hover:bg-white/5 rounded">
                  <LogOut size={14} /> DISCONNECT
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 mt-2 rounded text-xs font-bold text-black bg-[#D4763C] text-center">
                SYS.LOGIN
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
