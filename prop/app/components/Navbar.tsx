"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{
      background: "linear-gradient(135deg, rgba(27,58,92,0.95), rgba(27,58,92,0.85))",
      borderColor: "rgba(212,118,60,0.3)"
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/Assests/aarambh_logo_white.png" 
              alt="Aarambh Logo" 
              width={40} 
              height={40} 
              className="object-contain drop-shadow-md"
            />
            <div>
              <span className="text-white font-bold text-lg tracking-tight">Aarambh&apos;26</span>
              <span className="block text-xs" style={{ color: "#D4763C" }}>Command Center</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: "/", label: "Dashboard" },
              { href: "/team", label: "Team" },
              { href: "/deadlines", label: "Deadlines" },
            ].map(link => (
              <Link key={link.href} href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-3 ml-4">
                <Link href={user.role === "super_auth" ? "/admin" : "/organizer"}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg, #D4763C, #B85E2A)" }}>
                  {user.role === "super_auth" ? "⚡ Admin" : "📋 Panel"}
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "#5BA88C" }}>
                    {user.name.charAt(0)}
                  </div>
                  <button onClick={logout} className="text-xs text-gray-400 hover:text-red-400 transition-colors">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login"
                className="ml-4 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #D4763C, #B85E2A)" }}>
                Login
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white text-2xl">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {["/", "/team", "/deadlines"].map(href => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">
                {href === "/" ? "Dashboard" : href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
              </Link>
            ))}
            {user ? (
              <>
                <Link href={user.role === "super_auth" ? "/admin" : "/organizer"}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg font-semibold text-white"
                  style={{ background: "#D4763C" }}>
                  {user.role === "super_auth" ? "⚡ Admin Panel" : "📋 Organizer Panel"}
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-red-400">Logout</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded-lg font-semibold text-white" style={{ background: "#D4763C" }}>
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
