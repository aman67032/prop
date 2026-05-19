"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { Zap, ShieldCheck, ClipboardList, Users, Plus, CheckCircle2, RotateCcw, Edit2, Trash2, Terminal, Network } from "lucide-react";

interface Member { _id: string; name: string; rollNo: string; gender: string; position: string; committee: string; phone: string; email: string; category: string; }
interface Deadline { _id: string; title: string; description: string; date: string; committee: string; status: string; priority: string; }

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"deadlines" | "team">("deadlines");
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeadlineForm, setShowDeadlineForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", committee: "", priority: "medium" });
  const [memberForm, setMemberForm] = useState({ name: "", rollNo: "", gender: "", position: "", committee: "", phone: "", email: "", category: "volunteer" });

  const isSuperAuth = user?.role === "super_auth";

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      Promise.all([api.get("/deadlines"), api.get("/team")])
        .then(([d, t]) => { setDeadlines(d.data); setMembers(t.data); })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const refreshData = async () => {
    const [d, t] = await Promise.all([api.get("/deadlines"), api.get("/team")]);
    setDeadlines(d.data); setMembers(t.data);
  };

  // Deadline CRUD
  const saveDeadline = async () => {
    if (editingDeadline) {
      await api.put(`/deadlines/${editingDeadline._id}`, form);
    } else {
      await api.post("/deadlines", form);
    }
    setShowDeadlineForm(false); setEditingDeadline(null);
    setForm({ title: "", description: "", date: "", committee: "", priority: "medium" });
    await refreshData();
  };

  const completeDeadline = async (id: string) => {
    await api.patch(`/deadlines/${id}/complete`);
    await refreshData();
  };

  const reopenDeadline = async (id: string) => {
    await api.patch(`/deadlines/${id}/reopen`);
    await refreshData();
  };

  const deleteDeadline = async (id: string) => {
    if (confirm("INITIATE DELETION PROTOCOL?")) {
      await api.delete(`/deadlines/${id}`);
      await refreshData();
    }
  };

  // Member CRUD
  const saveMember = async () => {
    if (editingMember) {
      await api.put(`/team/${editingMember._id}`, memberForm);
    } else {
      await api.post("/team", memberForm);
    }
    setShowMemberForm(false); setEditingMember(null);
    setMemberForm({ name: "", rollNo: "", gender: "", position: "", committee: "", phone: "", email: "", category: "volunteer" });
    await refreshData();
  };

  const deleteMember = async (id: string) => {
    if (confirm("REMOVE OPERATIVE FROM SYSTEM?")) {
      await api.delete(`/team/${id}`);
      await refreshData();
    }
  };

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-[#5BA88C] animate-spin" />
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#5BA88C]/30 font-sans"
         style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
      
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="absolute top-0 right-1/4 w-[500px] h-[200px] bg-[#5BA88C] opacity-10 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#5BA88C]/30 bg-[#5BA88C]/10 text-[#5BA88C] text-[10px] font-mono tracking-widest uppercase mb-3">
                <Terminal size={12} className="animate-pulse" /> SECURE_CONNECTION_ESTABLISHED
              </div>
              <h1 className="text-3xl font-light font-mono text-white flex items-center gap-3">
                {isSuperAuth ? <><Zap size={28} className="text-[#D4763C] drop-shadow-[0_0_10px_rgba(212,118,60,0.8)]" /> ROOT_ACCESS</> : <><ShieldCheck size={28} className="text-[#5BA88C] drop-shadow-[0_0_10px_rgba(91,168,140,0.8)]" /> PNL_ACCESS</>}
              </h1>
              <p className="text-xs text-gray-500 font-mono mt-2 tracking-widest uppercase">ID: {user.name} // AUTH_LEVEL: {user.role}</p>
            </div>
            <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-lg">
              <button onClick={() => setTab("deadlines")} className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono transition-all uppercase tracking-widest ${tab === "deadlines" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                <ClipboardList size={14} /> TGT_LOG
              </button>
              {isSuperAuth && (
                <button onClick={() => setTab("team")} className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono transition-all uppercase tracking-widest ${tab === "team" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                  <Network size={14} /> OPS_DATA
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Deadline Management */}
        {tab === "deadlines" && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-mono tracking-widest uppercase text-gray-400">Target Control Center</h2>
              <button onClick={() => { setShowDeadlineForm(true); setEditingDeadline(null); setForm({ title: "", description: "", date: "", committee: "", priority: "medium" }); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#D4763C] hover:bg-[#b85e2a] text-black rounded text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(212,118,60,0.3)] hover:shadow-[0_0_20px_rgba(212,118,60,0.5)]">
                <Plus size={14} /> ADD_TARGET
              </button>
            </div>

            {/* Deadline Form Modal */}
            {showDeadlineForm && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4763C]/50 to-transparent" />
                  <h3 className="text-sm font-mono tracking-widest uppercase text-[#D4763C] mb-6 flex items-center gap-2">
                    <Terminal size={14} /> {editingDeadline ? "EDIT_TARGET" : "INITIALIZE_NEW_TARGET"}
                  </h3>
                  <div className="space-y-4">
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="TARGET_TITLE"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-sm font-mono text-white focus:outline-none focus:border-[#D4763C]/50 transition-all placeholder-gray-600" />
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="TARGET_DESCRIPTION"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-sm font-mono text-white focus:outline-none focus:border-[#D4763C]/50 transition-all placeholder-gray-600" rows={3} />
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-sm font-mono text-white focus:outline-none focus:border-[#D4763C]/50 transition-all text-gray-400" />
                    <input value={form.committee} onChange={e => setForm({ ...form, committee: e.target.value })} placeholder="ASSIGNED_SUBSYSTEM"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-sm font-mono text-white focus:outline-none focus:border-[#D4763C]/50 transition-all placeholder-gray-600" />
                    <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-sm font-mono text-white focus:outline-none focus:border-[#D4763C]/50 transition-all">
                      <option value="low">LOW_PRIORITY</option>
                      <option value="medium">MEDIUM_PRIORITY</option>
                      <option value="high">HIGH_PRIORITY</option>
                      <option value="critical">CRITICAL_PRIORITY</option>
                    </select>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button onClick={saveDeadline} className="flex-1 py-3 rounded text-xs font-mono font-bold text-black uppercase tracking-widest bg-[#D4763C] hover:bg-[#b85e2a] transition-colors">
                      EXECUTE
                    </button>
                    <button onClick={() => { setShowDeadlineForm(false); setEditingDeadline(null); }}
                      className="px-6 py-3 rounded text-xs font-mono font-bold text-gray-400 border border-white/10 hover:bg-white/5 transition-colors">
                      ABORT
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Deadline List */}
            <div className="space-y-3">
              {deadlines.map(d => (
                <div key={d._id} className="bg-[#0A0A0A] border border-white/5 hover:border-white/20 rounded-lg p-4 flex flex-wrap items-center gap-4 transition-all group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className={`font-mono text-sm ${d.status === "completed" ? "line-through text-gray-600" : "text-gray-200 group-hover:text-white"}`}>{d.title}</span>
                      <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded border" style={{
                        background: d.priority === "critical" ? "#EF444410" : d.priority === "high" ? "#D4763C10" : "#5BA88C10",
                        borderColor: d.priority === "critical" ? "#EF444430" : d.priority === "high" ? "#D4763C30" : "#5BA88C30",
                        color: d.priority === "critical" ? "#EF4444" : d.priority === "high" ? "#D4763C" : "#5BA88C"
                      }}>{d.priority}</span>
                      <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded border" style={{ 
                        background: d.status === "completed" ? "#5BA88C10" : "#8B9DC310", 
                        borderColor: d.status === "completed" ? "#5BA88C30" : "#8B9DC330",
                        color: d.status === "completed" ? "#5BA88C" : "#8B9DC3" 
                      }}>{d.status}</span>
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">[{d.committee}] // TGT_DATE: {d.date.slice(0, 10)}</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    {d.status === "pending" && (
                      <button onClick={() => completeDeadline(d._id)} className="flex items-center gap-1 px-3 py-1.5 rounded text-[10px] font-mono font-bold text-[#5BA88C] border border-[#5BA88C]/30 hover:bg-[#5BA88C]/10 transition-colors"><CheckCircle2 size={12}/> MARK_DONE</button>
                    )}
                    {d.status === "completed" && isSuperAuth && (
                      <button onClick={() => reopenDeadline(d._id)} className="flex items-center gap-1 px-3 py-1.5 rounded text-[10px] font-mono font-bold text-[#D4763C] border border-[#D4763C]/30 hover:bg-[#D4763C]/10 transition-colors"><RotateCcw size={12}/> REVERSE</button>
                    )}
                    {isSuperAuth && (
                      <>
                        <button onClick={() => {
                          setEditingDeadline(d);
                          setForm({ title: d.title, description: d.description, date: d.date.slice(0, 10), committee: d.committee, priority: d.priority });
                          setShowDeadlineForm(true);
                        }} className="p-1.5 rounded border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><Edit2 size={14}/></button>
                        <button onClick={() => deleteDeadline(d._id)} className="p-1.5 rounded border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"><Trash2 size={14}/></button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Management (Super Auth only) */}
        {tab === "team" && isSuperAuth && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-mono tracking-widest uppercase text-gray-400">Operative Database ({members.length} ENTRIES)</h2>
              <button onClick={() => { setShowMemberForm(true); setEditingMember(null); setMemberForm({ name: "", rollNo: "", gender: "", position: "", committee: "", phone: "", email: "", category: "volunteer" }); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#5BA88C] hover:bg-[#4a8a72] text-black rounded text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(91,168,140,0.3)] hover:shadow-[0_0_20px_rgba(91,168,140,0.5)]">
                <Plus size={14}/> ADD_OPERATIVE
              </button>
            </div>

            {showMemberForm && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] max-h-[80vh] overflow-y-auto custom-scrollbar relative group">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#5BA88C]/50 to-transparent" />
                  <h3 className="text-sm font-mono tracking-widest uppercase text-[#5BA88C] mb-6 flex items-center gap-2">
                    <Terminal size={14} /> {editingMember ? "UPDATE_OPERATIVE_RECORD" : "REGISTER_NEW_OPERATIVE"}
                  </h3>
                  <div className="space-y-4">
                    {(["name", "rollNo", "gender", "position", "committee", "phone", "email"] as const).map(f => (
                      <input key={f} value={memberForm[f]} onChange={e => setMemberForm({ ...memberForm, [f]: e.target.value })}
                        placeholder={f.toUpperCase()}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-sm font-mono text-white focus:outline-none focus:border-[#5BA88C]/50 transition-all placeholder-gray-600" />
                    ))}
                    <select value={memberForm.category} onChange={e => setMemberForm({ ...memberForm, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-sm font-mono text-white focus:outline-none focus:border-[#5BA88C]/50 transition-all">
                      {["organizing_head", "team_leader", "cluster_head", "cohort_leader", "volunteer"].map(c => (
                        <option key={c} value={c}>{c.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button onClick={saveMember} className="flex-1 py-3 rounded text-xs font-mono font-bold text-black uppercase tracking-widest bg-[#5BA88C] hover:bg-[#4a8a72] transition-colors">
                      COMMIT_RECORD
                    </button>
                    <button onClick={() => { setShowMemberForm(false); setEditingMember(null); }}
                      className="px-6 py-3 rounded text-xs font-mono font-bold text-gray-400 border border-white/10 hover:bg-white/5 transition-colors">
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left font-mono">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      {["OP_NAME", "REG_ID", "SUBSYSTEM", "CLEARANCE", "SYS_CMDS"].map(h => (
                        <th key={h} className="px-6 py-4 text-[10px] text-gray-500 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {members.map(m => (
                      <tr key={m._id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-3 text-sm text-gray-300 group-hover:text-white transition-colors">{m.name}</td>
                        <td className="px-6 py-3 text-xs text-gray-500">{m.rollNo}</td>
                        <td className="px-6 py-3 text-xs text-gray-400">{m.committee}</td>
                        <td className="px-6 py-3">
                          <span className="text-[9px] px-2 py-1 rounded border border-[#5BA88C]/30 bg-[#5BA88C]/10 text-[#5BA88C] uppercase tracking-widest">
                            {m.category.replace("_", ".")}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => {
                              setEditingMember(m);
                              setMemberForm({ name: m.name, rollNo: m.rollNo, gender: m.gender, position: m.position, committee: m.committee, phone: m.phone, email: m.email, category: m.category });
                              setShowMemberForm(true);
                            }} className="p-1.5 rounded border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><Edit2 size={14}/></button>
                            <button onClick={() => deleteMember(m._id)} className="p-1.5 rounded border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"><Trash2 size={14}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
