"use client";
import { useEffect, useState } from "react";
import api from "./lib/api";
import Link from "next/link";
import Image from "next/image";
import { Flame, Users, ClipboardList, CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar, ArrowRight } from "lucide-react";

interface DeadlineStats { total: number; completed: number; pending: number; overdue: number; byCommittee: { _id: string; total: number; completed: number }[]; upcoming: { _id: string; title: string; date: string; committee: string; priority: string }[]; }
interface TeamStats { total: number; byCategory: { _id: string; count: number }[]; byCommittee: { _id: string; count: number }[]; }

export default function Dashboard() {
  const [dStats, setDStats] = useState<DeadlineStats | null>(null);
  const [tStats, setTStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/deadlines/stats"), api.get("/team/stats")])
      .then(([d, t]) => { setDStats(d.data); setTStats(t.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
      <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#D4763C", borderTopColor: "transparent" }} />
    </div>
  );

  const completionPct = dStats ? Math.round((dStats.completed / Math.max(dStats.total, 1)) * 100) : 0;

  return (
    <div style={{ background: "var(--cream)" }} className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1B3A5C 0%, #0F2440 60%, #1B3A5C 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full animate-float" style={{ background: "radial-gradient(circle, #D4763C, transparent)" }} />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, #5BA88C, transparent)", animation: "float 4s ease-in-out infinite 1s" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 flex flex-col items-center">
          <div className="text-center animate-fade-in-up flex flex-col items-center w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8" style={{ background: "rgba(212,118,60,0.2)", color: "#D4763C" }}>
              <Flame size={16} /> Office of Student Affairs — JKLU
            </div>
            
            <Image 
              src="/Assests/aarambh_logo_white.png" 
              alt="Aarambh 2026 Logo" 
              width={250} 
              height={150} 
              className="object-contain drop-shadow-2xl mb-6 hover:scale-105 transition-transform duration-500"
              priority
            />
            
            <p className="text-xl text-gray-300 mb-2 font-medium">Aarambh 2026 — Command Center</p>
            <p className="text-gray-400 max-w-2xl mx-auto mb-10">
              A dedicated team of <span className="font-bold text-white">177 students</span> powering the success of Aarambh 2026
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-16">
              <Link href="/team" className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-xl" style={{ background: "linear-gradient(135deg, #D4763C, #B85E2A)" }}>
                View Team Structure <ArrowRight size={18} />
              </Link>
              <Link href="/deadlines" className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white border-2 transition-all hover:scale-105" style={{ borderColor: "#5BA88C", background: "rgba(91,168,140,0.1)" }}>
                Track Deadlines <TrendingUp size={18} />
              </Link>
            </div>
            
            {/* Partner Logos */}
            <div className="flex flex-wrap gap-12 justify-center items-center opacity-60 hover:opacity-100 transition-opacity duration-300">
              <Image 
                src="/Assests/white_jklu_logo_upscayl_4x_upscayl-standard-4x.png" 
                alt="JKLU Logo" 
                width={160} 
                height={60} 
                className="object-contain"
              />
              <Image 
                src="/Assests/council_logo.png" 
                alt="Student Council Logo" 
                width={70} 
                height={70} 
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Team", value: tStats?.total || 0, icon: <Users size={28} />, color: "#1B3A5C" },
            { label: "Deadlines", value: dStats?.total || 0, icon: <ClipboardList size={28} />, color: "#D4763C" },
            { label: "Completed", value: dStats?.completed || 0, icon: <CheckCircle2 size={28} />, color: "#5BA88C" },
            { label: "Pending", value: dStats?.pending || 0, icon: <Clock size={28} />, color: "#F59E0B" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-5 shadow-lg border border-white/50 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-xl"
              style={{ background: "white", animationDelay: `${i * 0.1}s` }}>
              <div className="mb-3" style={{ color: s.color }}>{s.icon}</div>
              <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-sm text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Progress + Upcoming */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
        {/* Overall Progress */}
        <div className="rounded-2xl p-8 shadow-lg border" style={{ background: "white", borderColor: "#e5e7eb" }}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: "#1B3A5C" }}><TrendingUp size={24} /> Overall Progress</h2>
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
              <circle cx="100" cy="100" r="85" fill="none" stroke="#e5e7eb" strokeWidth="12" />
              <circle cx="100" cy="100" r="85" fill="none" stroke="#5BA88C" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${completionPct * 5.34} 534`} className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black" style={{ color: "#1B3A5C" }}>{completionPct}%</span>
              <span className="text-sm text-gray-400">Complete</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><div className="text-2xl font-bold" style={{ color: "#5BA88C" }}>{dStats?.completed || 0}</div><div className="text-xs text-gray-400 flex items-center justify-center gap-1"><CheckCircle2 size={12}/> Done</div></div>
            <div><div className="text-2xl font-bold" style={{ color: "#F59E0B" }}>{dStats?.pending || 0}</div><div className="text-xs text-gray-400 flex items-center justify-center gap-1"><Clock size={12}/> Pending</div></div>
            <div><div className="text-2xl font-bold" style={{ color: "#EF4444" }}>{dStats?.overdue || 0}</div><div className="text-xs text-gray-400 flex items-center justify-center gap-1"><AlertCircle size={12}/> Overdue</div></div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="rounded-2xl p-8 shadow-lg border" style={{ background: "white", borderColor: "#e5e7eb" }}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: "#1B3A5C" }}><Calendar size={24} color="#D4763C" /> Upcoming Deadlines</h2>
          <div className="space-y-4">
            {dStats?.upcoming?.map((d, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border hover:shadow-md transition-all"
                style={{ borderColor: "#e5e7eb", background: "#FAFAFA" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: d.priority === "critical" ? "#EF4444" : d.priority === "high" ? "#F59E0B" : "#5BA88C" }}>
                  {new Date(d.date).getDate()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ color: "#1A1A2E" }}>{d.title}</div>
                  <div className="text-xs text-gray-400">{d.committee}</div>
                </div>
                <div className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ background: d.priority === "critical" ? "#FEE2E2" : d.priority === "high" ? "#FEF3C7" : "#D1FAE5", color: d.priority === "critical" ? "#EF4444" : d.priority === "high" ? "#F59E0B" : "#10B981" }}>
                  {d.priority}
                </div>
              </div>
            ))}
            {(!dStats?.upcoming || dStats.upcoming.length === 0) && (
              <div className="text-center py-8 text-gray-400 flex flex-col items-center gap-2">
                <CheckCircle2 size={32} color="#D5ECDB" />
                No upcoming deadlines
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Committee Progress */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: "#1B3A5C" }}><ClipboardList size={24}/> Committee Progress</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dStats?.byCommittee?.map((c, i) => {
            const pct = Math.round((c.completed / Math.max(c.total, 1)) * 100);
            return (
              <div key={i} className="rounded-xl p-5 shadow border hover:shadow-lg transition-all"
                style={{ background: "white", borderColor: "#e5e7eb" }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-sm" style={{ color: "#1A1A2E" }}>{c._id}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "#D5ECDB", color: "#1B3A5C" }}>
                    {c.completed}/{c.total}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "#e5e7eb" }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: pct === 100 ? "#10B981" : pct > 50 ? "#5BA88C" : "#D4763C" }} />
                </div>
                <div className="text-right text-xs text-gray-400 mt-1">{pct}%</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
