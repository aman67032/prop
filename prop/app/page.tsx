"use client";
import { useEffect, useState } from "react";
import api from "./lib/api";
import Link from "next/link";
import Image from "next/image";
import { Flame, Users, ClipboardList, CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar, ArrowRight, Activity, Terminal, Network } from "lucide-react";

import Loader from "./components/Loader";

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
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <Loader />
    </div>
  );

  const completionPct = dStats ? Math.round((dStats.completed / Math.max(dStats.total, 1)) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4763C]/30 font-sans" 
         style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
      
      {/* Compact Futuristic Hero (11vh inspired) */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D4763C] opacity-20 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 min-h-[11vh]">
          <div className="flex items-center gap-6">
            <Image 
              src="/Assests/aarambh_logo_white.png" 
              alt="Aarambh 2026" 
              width={160} 
              height={80} 
              className="object-contain drop-shadow-[0_0_15px_rgba(212,118,60,0.5)]"
              priority
            />
            <div className="hidden md:block w-px h-16 bg-white/10" />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-2 border border-[#D4763C]/30 bg-[#D4763C]/10 text-[#D4763C]">
                <Activity size={12} className="animate-pulse" /> SYS.ACTIVE // CMD.CENTER
              </div>
              <p className="text-sm text-gray-400 font-mono">
                <span className="text-white font-bold">{tStats?.total || 0}</span> OPERATIVES ONLINE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/team" className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-mono transition-all">
              [ <Users size={14} className="text-[#5BA88C]" /> TEAM_DATA ]
            </Link>
            <Link href="/deadlines" className="group flex items-center gap-2 px-5 py-2.5 bg-[#D4763C] hover:bg-[#B85E2A] text-black border border-[#D4763C] rounded-lg text-sm font-bold shadow-[0_0_20px_rgba(212,118,60,0.3)] transition-all">
              TRACK_DEADLINES <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="max-w-7xl mx-auto px-6 py-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "SYS.OPERATIVES", value: tStats?.total || 0, icon: <Terminal size={20} />, color: "#5BA88C" },
            { label: "TOTAL.TASKS", value: dStats?.total || 0, icon: <ClipboardList size={20} />, color: "#8B9DC3" },
            { label: "TASKS.EXECUTED", value: dStats?.completed || 0, icon: <CheckCircle2 size={20} />, color: "#10B981" },
            { label: "TASKS.PENDING", value: dStats?.pending || 0, icon: <Clock size={20} />, color: "#D4763C" },
          ].map((s, i) => (
            <div key={i} className="group relative bg-[#0A0A0A] border border-white/10 rounded-xl p-5 hover:border-white/30 transition-colors overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity" style={{ color: s.color }}>{s.icon}</div>
              <div className="text-[10px] font-mono text-gray-500 mb-4 uppercase tracking-widest">{s.label}</div>
              <div className="text-4xl font-light font-mono" style={{ color: s.color }}>{s.value}</div>
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all w-0 group-hover:w-full" style={{ backgroundImage: `linear-gradient(to right, transparent, ${s.color})` }} />
            </div>
          ))}
        </div>
      </section>

      {/* Progress + Upcoming */}
      <section className="max-w-7xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-6">
        {/* Overall Progress */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#5BA88C] to-transparent opacity-50" />
          <h2 className="text-sm font-mono text-gray-400 flex items-center gap-2 mb-8 uppercase tracking-widest">
            <TrendingUp size={16} className="text-[#5BA88C]" /> Global.Completion_Rate
          </h2>
          
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
              <circle cx="100" cy="100" r="85" fill="none" stroke="#1A1A1A" strokeWidth="4" />
              <circle cx="100" cy="100" r="85" fill="none" stroke="#5BA88C" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${completionPct * 5.34} 534`} className="transition-all duration-1000 drop-shadow-[0_0_10px_rgba(91,168,140,0.8)]" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-light font-mono text-white">{completionPct}<span className="text-xl text-[#5BA88C]">%</span></span>
              <span className="text-[10px] text-[#5BA88C] tracking-widest uppercase mt-1 animate-pulse">Running</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center border-t border-white/10 pt-6">
            <div><div className="text-xl font-mono text-white">{dStats?.completed || 0}</div><div className="text-[10px] text-gray-500 uppercase tracking-widest">Done</div></div>
            <div><div className="text-xl font-mono text-white">{dStats?.pending || 0}</div><div className="text-[10px] text-gray-500 uppercase tracking-widest">Pending</div></div>
            <div><div className="text-xl font-mono text-[#EF4444]">{dStats?.overdue || 0}</div><div className="text-[10px] text-gray-500 uppercase tracking-widest">Overdue</div></div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4763C] to-transparent opacity-50" />
          <h2 className="text-sm font-mono text-gray-400 flex items-center gap-2 mb-6 uppercase tracking-widest">
            <Calendar size={16} className="text-[#D4763C]" /> Actionable.Targets
          </h2>
          
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {dStats?.upcoming?.map((d, i) => (
              <div key={i} className="group flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-lg transition-all cursor-crosshair">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-mono font-bold border
                  ${d.priority === 'critical' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 
                    d.priority === 'high' ? 'bg-[#D4763C]/10 text-[#D4763C] border-[#D4763C]/30' : 
                    'bg-[#5BA88C]/10 text-[#5BA88C] border-[#5BA88C]/30'}`}>
                  {new Date(d.date).getDate()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm text-gray-200 truncate group-hover:text-white transition-colors">{d.title}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{d.committee}</div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} className="text-gray-400" />
                </div>
              </div>
            ))}
            {(!dStats?.upcoming || dStats.upcoming.length === 0) && (
              <div className="text-center py-12 text-gray-600 flex flex-col items-center gap-3 font-mono text-sm">
                <CheckCircle2 size={24} className="text-[#5BA88C] opacity-50" />
                NO_TARGETS_FOUND
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Committee Progress */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-sm font-mono text-gray-400 flex items-center gap-2 mb-6 uppercase tracking-widest">
          <Network size={16} className="text-white" /> Subsystem.Status
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dStats?.byCommittee?.map((c, i) => {
            const pct = Math.round((c.completed / Math.max(c.total, 1)) * 100);
            return (
              <div key={i} className="bg-[#0A0A0A] p-5 border border-white/10 hover:border-white/20 rounded-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-xs text-gray-300 tracking-wider truncate pr-2">{c._id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 text-gray-400">
                    {c.completed}/{c.total}
                  </span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]" 
                       style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "#5BA88C" : pct > 50 ? "#8B9DC3" : "#D4763C", color: pct === 100 ? "#5BA88C" : pct > 50 ? "#8B9DC3" : "#D4763C" }} />
                </div>
                <div className="text-right text-[10px] font-mono text-gray-500 mt-2">{pct}%_SYNCED</div>
              </div>
            );
          })}
        </div>
      </section>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
