"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { CheckCircle2, Clock, AlertCircle, LayoutList, Terminal } from "lucide-react";

interface Deadline { _id: string; title: string; description: string; date: string; committee: string; status: string; priority: string; createdBy?: { name: string }; completedAt?: string; }

const priorityColors: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "#EF444410", text: "#EF4444", border: "#EF444430" },
  high: { bg: "#D4763C10", text: "#D4763C", border: "#D4763C30" },
  medium: { bg: "#5BA88C10", text: "#5BA88C", border: "#5BA88C30" },
  low: { bg: "#8B9DC310", text: "#8B9DC3", border: "#8B9DC330" }
};

import Loader from "../components/Loader";

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/deadlines").then(r => setDeadlines(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? deadlines : deadlines.filter(d => d.status === filter);
  const grouped = filtered.reduce<Record<string, Deadline[]>>((acc, d) => {
    const key = new Date(d.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
    (acc[key] = acc[key] || []).push(d);
    return acc;
  }, {});

  const now = new Date();
  const isOverdue = (d: Deadline) => d.status === "pending" && new Date(d.date) < now;
  const daysUntil = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - now.getTime()) / 86400000);
    if (diff < 0) return `-${Math.abs(diff)}D OVERDUE`;
    if (diff === 0) return "T-0 (TODAY)";
    if (diff === 1) return "T-1 (TMRW)";
    return `T-${diff} DAYS`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <Loader />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4763C]/30 font-sans"
         style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
      
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="absolute top-0 left-1/4 w-[500px] h-[200px] bg-[#EF4444] opacity-10 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 py-12 relative z-10 min-h-[11vh]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-3 border border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]">
            <Terminal size={12} className="animate-pulse" /> MISSION.TIMELINE
          </div>
          <h1 className="text-3xl md:text-4xl font-light font-mono text-white mb-2 tracking-tight">MILESTONE_TRACKER</h1>
          <p className="text-sm text-gray-500 font-mono mb-8">SYNCHRONIZED DEPLOYMENT SCHEDULE</p>
          
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "ALL", icon: <LayoutList size={14}/> },
              { key: "pending", label: "PENDING", icon: <Clock size={14}/> },
              { key: "completed", label: "COMPLETED", icon: <CheckCircle2 size={14}/> },
              { key: "overdue", label: "OVERDUE", icon: <AlertCircle size={14}/> },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-mono tracking-widest transition-all border
                  ${filter === f.key ? "bg-[#D4763C]/10 text-[#D4763C] border-[#D4763C]/50 shadow-[0_0_15px_rgba(212,118,60,0.2)]" : "bg-white/5 text-gray-500 border-white/10 hover:border-white/20 hover:text-gray-300"}`}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <div className="max-w-5xl mx-auto px-6 py-12 relative z-20">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px hidden md:block" style={{ background: "linear-gradient(to bottom, #D4763C, #5BA88C, #1B3A5C, transparent)" }} />

          {Object.entries(grouped).map(([date, items], gi) => (
            <div key={date} className="mb-12 animate-fade-in-up" style={{ animationDelay: `${gi * 0.1}s` }}>
              {/* Date label */}
              <div className="flex items-center gap-6 mb-6">
                <div className="w-12 h-12 rounded border border-white/10 bg-[#0A0A0A] flex items-center justify-center text-white font-mono font-bold shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 flex-shrink-0">
                  {new Date(items[0].date).getDate()}
                </div>
                <h3 className="text-sm font-mono tracking-widest text-[#5BA88C] uppercase">{date}</h3>
              </div>

              {/* Deadline cards */}
              <div className="ml-0 md:ml-16 space-y-4">
                {items.map((d, i) => {
                  const overdue = isOverdue(d);
                  const colors = priorityColors[d.priority] || priorityColors.medium;
                  const isDone = d.status === "completed";
                  return (
                    <div key={d._id}
                      className="group bg-[#0A0A0A] border rounded-lg p-5 transition-all hover:-translate-y-0.5"
                      style={{
                        borderColor: isDone ? "#5BA88C30" : overdue ? "#EF444450" : colors.border,
                        boxShadow: overdue ? "0 0 20px rgba(239,68,68,0.1)" : "none",
                        animationDelay: `${(gi * 0.1) + (i * 0.05)}s`,
                        opacity: isDone ? 0.6 : 1
                      }}>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap mb-2">
                            <h4 className={`font-mono text-sm ${isDone ? "line-through text-gray-500" : "text-gray-200 group-hover:text-white"}`}>
                              {d.title}
                            </h4>
                            <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded border" style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}>
                              {d.priority}
                            </span>
                          </div>
                          {d.description && <p className="text-xs text-gray-500 font-mono mb-3">{d.description}</p>}
                          <div className="flex flex-wrap gap-3 text-[10px] font-mono tracking-widest uppercase">
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400 group-hover:text-gray-300 transition-colors">
                              [{d.committee}]
                            </span>
                            <span className="px-2 py-1 text-gray-500 flex items-center gap-1">
                              <Clock size={10}/> {daysUntil(d.date)}
                            </span>
                    
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {isDone ? (
                            <div className="w-10 h-10 rounded border border-[#5BA88C]/30 bg-[#5BA88C]/10 flex items-center justify-center text-[#5BA88C]">
                              <CheckCircle2 size={16}/>
                            </div>
                          ) : overdue ? (
                            <div className="w-10 h-10 rounded border border-[#EF4444]/50 bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] animate-pulse">
                              <AlertCircle size={16}/>
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded border border-[#D4763C]/30 bg-[#D4763C]/10 flex items-center justify-center text-[#D4763C]">
                              <Clock size={16}/>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-24 text-gray-600 font-mono text-sm flex flex-col items-center gap-3">
              <CheckCircle2 size={32} className="opacity-30" />
              NO_ACTIVE_TARGETS_FOUND
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
