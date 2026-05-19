"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { Zap, ShieldCheck, ClipboardList, Users, Plus, CheckCircle2, RotateCcw, Edit2, Trash2 } from "lucide-react";

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
    if (confirm("Delete this deadline?")) {
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
    if (confirm("Remove this member?")) {
      await api.delete(`/team/${id}`);
      await refreshData();
    }
  };

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
      <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#D4763C", borderTopColor: "transparent" }} />
    </div>
  );

  if (!user) return null;

  return (
    <div style={{ background: "var(--cream)" }} className="min-h-screen">
      {/* Header */}
      <div className="py-8 px-6" style={{ background: "linear-gradient(135deg, #1B3A5C, #0F2440)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                {isSuperAuth ? <><Zap size={28} /> Super Admin</> : <><ShieldCheck size={28} /> Organizer Panel</>}
              </h1>
              <p className="text-gray-400 mt-1">Welcome, {user.name}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setTab("deadlines")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${tab === "deadlines" ? "text-white" : "text-gray-400 bg-white/5"}`}
                style={tab === "deadlines" ? { background: "#D4763C" } : {}}><ClipboardList size={18} /> Deadlines</button>
              {isSuperAuth && (
                <button onClick={() => setTab("team")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${tab === "team" ? "text-white" : "text-gray-400 bg-white/5"}`}
                  style={tab === "team" ? { background: "#D4763C" } : {}}><Users size={18} /> Team</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Deadline Management */}
        {tab === "deadlines" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: "#1B3A5C" }}>Manage Deadlines</h2>
              <button onClick={() => { setShowDeadlineForm(true); setEditingDeadline(null); setForm({ title: "", description: "", date: "", committee: "", priority: "medium" }); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #D4763C, #B85E2A)" }}><Plus size={18} /> Add Deadline</button>
            </div>

            {/* Deadline Form Modal */}
            {showDeadlineForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                  <h3 className="text-xl font-bold mb-4" style={{ color: "#1B3A5C" }}>
                    {editingDeadline ? "Edit Deadline" : "New Deadline"}
                  </h3>
                  <div className="space-y-4">
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-400" />
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-400" rows={3} />
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-400" />
                    <input value={form.committee} onChange={e => setForm({ ...form, committee: e.target.value })} placeholder="Committee"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-400" />
                    <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-400">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={saveDeadline} className="flex-1 py-3 rounded-xl font-bold text-white"
                      style={{ background: "#D4763C" }}>Save</button>
                    <button onClick={() => { setShowDeadlineForm(false); setEditingDeadline(null); }}
                      className="px-6 py-3 rounded-xl font-bold text-gray-500 bg-gray-100">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* Deadline List */}
            <div className="space-y-3">
              {deadlines.map(d => (
                <div key={d._id} className="bg-white rounded-xl p-4 shadow border border-gray-100 flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold ${d.status === "completed" ? "line-through text-gray-400" : ""}`}>{d.title}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                        background: d.priority === "critical" ? "#FEE2E2" : d.priority === "high" ? "#FEF3C7" : "#DBEAFE",
                        color: d.priority === "critical" ? "#DC2626" : d.priority === "high" ? "#D97706" : "#2563EB"
                      }}>{d.priority}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: d.status === "completed" ? "#D1FAE5" : "#FEF3C7", color: d.status === "completed" ? "#059669" : "#D97706" }}>{d.status}</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{d.committee} · {new Date(d.date).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {d.status === "pending" && (
                      <button onClick={() => completeDeadline(d._id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: "#10B981" }}><CheckCircle2 size={14}/> Done</button>
                    )}
                    {d.status === "completed" && isSuperAuth && (
                      <button onClick={() => reopenDeadline(d._id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: "#F59E0B" }}><RotateCcw size={14}/> Reopen</button>
                    )}
                    {isSuperAuth && (
                      <>
                        <button onClick={() => {
                          setEditingDeadline(d);
                          setForm({ title: d.title, description: d.description, date: d.date.slice(0, 10), committee: d.committee, priority: d.priority });
                          setShowDeadlineForm(true);
                        }} className="p-2 rounded-lg text-xs font-bold bg-gray-100 text-gray-600"><Edit2 size={16}/></button>
                        <button onClick={() => deleteDeadline(d._id)} className="p-2 rounded-lg text-xs font-bold bg-red-50 text-red-500"><Trash2 size={16}/></button>
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
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: "#1B3A5C" }}>Manage Team ({members.length})</h2>
              <button onClick={() => { setShowMemberForm(true); setEditingMember(null); setMemberForm({ name: "", rollNo: "", gender: "", position: "", committee: "", phone: "", email: "", category: "volunteer" }); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #D4763C, #B85E2A)" }}><Plus size={18}/> Add Member</button>
            </div>

            {showMemberForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[80vh] overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4" style={{ color: "#1B3A5C" }}>
                    {editingMember ? "Edit Member" : "Add Member"}
                  </h3>
                  <div className="space-y-4">
                    {(["name", "rollNo", "gender", "position", "committee", "phone", "email"] as const).map(f => (
                      <input key={f} value={memberForm[f]} onChange={e => setMemberForm({ ...memberForm, [f]: e.target.value })}
                        placeholder={f.charAt(0).toUpperCase() + f.slice(1).replace(/([A-Z])/g, " $1")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-400" />
                    ))}
                    <select value={memberForm.category} onChange={e => setMemberForm({ ...memberForm, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200">
                      {["organizing_head", "team_leader", "cluster_head", "cohort_leader", "volunteer"].map(c => (
                        <option key={c} value={c}>{c.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={saveMember} className="flex-1 py-3 rounded-xl font-bold text-white" style={{ background: "#D4763C" }}>Save</button>
                    <button onClick={() => { setShowMemberForm(false); setEditingMember(null); }}
                      className="px-6 py-3 rounded-xl font-bold text-gray-500 bg-gray-100">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#1B3A5C" }}>
                    {["Name", "Roll No", "Committee", "Category", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-white uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m._id} className="border-b border-gray-50 hover:bg-orange-50/30">
                      <td className="px-4 py-3 text-sm font-medium">{m.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{m.rollNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{m.committee}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full" style={{ background: "#D5ECDB", color: "#1B3A5C" }}>{m.category}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => {
                            setEditingMember(m);
                            setMemberForm({ name: m.name, rollNo: m.rollNo, gender: m.gender, position: m.position, committee: m.committee, phone: m.phone, email: m.email, category: m.category });
                            setShowMemberForm(true);
                          }} className="p-2 rounded bg-gray-100 text-gray-600"><Edit2 size={14}/></button>
                          <button onClick={() => deleteMember(m._id)} className="p-2 rounded bg-red-50 text-red-500"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
