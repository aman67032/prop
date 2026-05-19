"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { CheckCircle2, Clock, AlertCircle, LayoutList } from "lucide-react";

interface Deadline { _id: string; title: string; description: string; date: string; committee: string; status: string; priority: string; createdBy?: { name: string }; completedAt?: string; }

const priorityColors: Record<string, { bg: string; text: string; dot: string }> = {
  critical: { bg: "#FEE2E2", text: "#DC2626", dot: "#EF4444" },
  high: { bg: "#FEF3C7", text: "#D97706", dot: "#F59E0B" },
  medium: { bg: "#DBEAFE", text: "#2563EB", dot: "#3B82F6" },
  low: { bg: "#D1FAE5", text: "#059669", dot: "#10B981" }
};

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/deadlines").then(r => setDeadlines(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? deadlines : deadlines.filter(d => d.status === filter);
  const grouped = filtered.reduce<Record<string, Deadline[]>>((acc, d) => {
    const key = new Date(d.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    (acc[key] = acc[key] || []).push(d);
    return acc;
  }, {});

  const now = new Date();
  const isOverdue = (d: Deadline) => d.status === "pending" && new Date(d.date) < now;
  const daysUntil = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - now.getTime()) / 86400000);
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return `${diff} days`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
      <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#D4763C", borderTopColor: "transparent" }} />
    </div>
  );

  return (
    <div style={{ background: "var(--cream)" }} className="min-h-screen">
      {/* Header */}
      <div className="py-12 px-6" style={{ background: "linear-gradient(135deg, #1B3A5C, #0F2440)" }}>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-black text-white mb-2">Deadline Timeline</h1>
          <p className="text-gray-400 mb-6">Track every milestone — never miss a beat</p>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All", icon: <LayoutList size={16}/> },
              { key: "pending", label: "Pending", icon: <Clock size={16}/> },
              { key: "completed", label: "Completed", icon: <CheckCircle2 size={16}/> },
              { key: "overdue", label: "Overdue", icon: <AlertCircle size={16}/> },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${filter === f.key ? "text-white shadow-lg" : "text-gray-400 hover:text-white bg-white/5"}`}
                style={filter === f.key ? { background: "#D4763C" } : {}}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 hidden md:block" style={{ background: "linear-gradient(to bottom, #D4763C, #5BA88C, #1B3A5C)" }} />

          {Object.entries(grouped).map(([date, items], gi) => (
            <div key={date} className="mb-10 animate-fade-in-up" style={{ animationDelay: `${gi * 0.1}s` }}>
              {/* Date label */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10 flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #1B3A5C, #0F2440)" }}>
                  {new Date(items[0].date).getDate()}
                </div>
                <h3 className="text-lg font-bold" style={{ color: "#1B3A5C" }}>{date}</h3>
              </div>

              {/* Deadline cards */}
              <div className="ml-0 md:ml-16 space-y-4">
                {items.map((d, i) => {
                  const overdue = isOverdue(d);
                  const colors = priorityColors[d.priority] || priorityColors.medium;
                  return (
                    <div key={d._id}
                      className="rounded-2xl p-5 shadow-md border-l-4 bg-white hover:shadow-xl transition-all hover:-translate-y-0.5"
                      style={{
                        borderLeftColor: d.status === "completed" ? "#10B981" : overdue ? "#EF4444" : colors.dot,
                        animationDelay: `${(gi * 0.1) + (i * 0.05)}s`,
                        opacity: d.status === "completed" ? 0.75 : 1
                      }}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className={`font-bold text-base ${d.status === "completed" ? "line-through text-gray-400" : ""}`}
                              style={{ color: d.status === "completed" ? undefined : "#1A1A2E" }}>
                              {d.title}
                            </h4>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: colors.bg, color: colors.text }}>
                              {d.priority}
                            </span>
                          </div>
                          {d.description && <p className="text-sm text-gray-500 mb-2">{d.description}</p>}
                          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                            <span className="px-2 py-1 rounded-lg" style={{ background: "#D5ECDB", color: "#1B3A5C" }}>
                              {d.committee}
                            </span>
                            <span>{daysUntil(d.date)}</span>
                            {d.createdBy && <span>by {d.createdBy.name}</span>}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {d.status === "completed" ? (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-green-600" style={{ background: "#D1FAE5" }}>
                              <CheckCircle2 size={20}/>
                            </div>
                          ) : overdue ? (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-red-600 animate-pulse-glow" style={{ background: "#FEE2E2" }}>
                              <AlertCircle size={20}/>
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-amber-600" style={{ background: "#FEF3C7" }}>
                              <Clock size={20}/>
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
            <div className="text-center py-20 text-gray-400 text-lg flex flex-col items-center gap-2">
              <CheckCircle2 size={40} color="#D5ECDB" />
              No deadlines found for this filter
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
