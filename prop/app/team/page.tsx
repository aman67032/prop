"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { Network, LayoutList } from "lucide-react";

interface Member { _id: string; name: string; rollNo: string; gender: string; position: string; committee: string; cluster: string; phone: string; email: string; category: string; }
interface Structure { organizingHeads: Member[]; committees: { name: string; heads: Member[]; volunteers: Member[]; clusterHeads: Member[]; cohortLeaders: Member[] }[]; }

const catColors: Record<string, string> = {
  organizing_head: "#D4763C", team_leader: "#1B3A5C", committee_head: "#1B3A5C",
  cluster_head: "#5BA88C", cohort_leader: "#7CC4A8", volunteer: "#8B9DC3"
};
const catLabels: Record<string, string> = {
  organizing_head: "Organizing Head", team_leader: "Team Leader", committee_head: "Committee Head",
  cluster_head: "Cluster Head", cohort_leader: "Cohort Leader", volunteer: "Volunteer"
};

export default function TeamPage() {
  const [structure, setStructure] = useState<Structure | null>(null);
  const [search, setSearch] = useState("");
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [view, setView] = useState<"tree" | "list">("tree");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/team/structure"), api.get("/team")])
      .then(([s, m]) => { setStructure(s.data); setAllMembers(m.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = search ? allMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.committee.toLowerCase().includes(search.toLowerCase()) ||
    m.rollNo.toLowerCase().includes(search.toLowerCase())
  ) : allMembers;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
      <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#D4763C", borderTopColor: "transparent" }} />
    </div>
  );

  return (
    <div style={{ background: "var(--cream)" }} className="min-h-screen">
      {/* Header */}
      <div className="py-12 px-6" style={{ background: "linear-gradient(135deg, #1B3A5C, #0F2440)" }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black text-white mb-2">Team Structure</h1>
          <p className="text-gray-400 mb-6">177 members powering Aarambh 2026</p>
          <div className="flex flex-wrap gap-4">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, roll no, committee..."
              className="flex-1 min-w-[250px] px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-orange-400 transition-all" />
            <div className="flex gap-2">
              <button onClick={() => setView("tree")} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${view === "tree" ? "text-white" : "text-gray-400 bg-white/5"}`}
                style={view === "tree" ? { background: "#D4763C" } : {}}><Network size={18}/> Tree</button>
              <button onClick={() => setView("list")} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${view === "list" ? "text-white" : "text-gray-400 bg-white/5"}`}
                style={view === "list" ? { background: "#D4763C" } : {}}><LayoutList size={18}/> List</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {view === "tree" && structure && !search ? (
          <div className="space-y-10">
            {/* Organizing Heads */}
            <div className="text-center">
              <h2 className="text-xl font-bold mb-1" style={{ color: "#1B3A5C" }}>Office of Student Affairs</h2>
              <div className="w-20 h-1 rounded mx-auto mb-6" style={{ background: "#D4763C" }} />
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {structure.organizingHeads.map(m => (
                  <MemberCard key={m._id} member={m} />
                ))}
              </div>
              <div className="w-px h-10 mx-auto" style={{ background: "#D4763C" }} />
            </div>

            {/* Committees */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {structure.committees.map((c, i) => (
                <div key={i} className="rounded-2xl overflow-hidden shadow-lg border hover:shadow-xl transition-all" style={{ borderColor: "#D5ECDB" }}>
                  <div className="p-4" style={{ background: "linear-gradient(135deg, #D5ECDB, #B8D9C1)" }}>
                    <h3 className="font-bold text-lg" style={{ color: "#1B3A5C" }}>{c.name}</h3>
                    <p className="text-sm" style={{ color: "#5BA88C" }}>
                      {c.heads.length + c.volunteers.length + c.clusterHeads.length + c.cohortLeaders.length} members
                    </p>
                  </div>
                  <div className="p-4 space-y-2 bg-white">
                    {c.heads.map(m => <MiniMember key={m._id} member={m} />)}
                    {c.clusterHeads.map(m => <MiniMember key={m._id} member={m} />)}
                    {c.volunteers.length > 0 && (
                      <details className="mt-2">
                        <summary className="text-sm font-medium cursor-pointer text-gray-500 hover:text-gray-700">
                          {c.volunteers.length} Volunteers
                        </summary>
                        <div className="mt-2 space-y-1">
                          {c.volunteers.map(m => <MiniMember key={m._id} member={m} />)}
                        </div>
                      </details>
                    )}
                    {c.cohortLeaders.length > 0 && (
                      <details className="mt-2">
                        <summary className="text-sm font-medium cursor-pointer text-gray-500 hover:text-gray-700">
                          {c.cohortLeaders.length} Cohort Leaders
                        </summary>
                        <div className="mt-2 space-y-1">
                          {c.cohortLeaders.map(m => <MiniMember key={m._id} member={m} />)}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#1B3A5C" }}>
                    {["Name", "Roll No", "Position", "Committee", "Contact"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, i) => (
                    <tr key={m._id} className="border-b border-gray-100 hover:bg-orange-50/50 transition-colors"
                      style={{ animationDelay: `${i * 0.02}s` }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ background: catColors[m.category] || "#8B9DC3" }}>
                            {m.name.charAt(0)}
                          </div>
                          <span className="font-medium text-sm">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{m.rollNo}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: `${catColors[m.category]}20`, color: catColors[m.category] }}>
                          {catLabels[m.category] || m.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{m.committee}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{m.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No members found</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="rounded-xl p-4 shadow-md border bg-white hover:shadow-lg hover:-translate-y-1 transition-all w-48"
      style={{ borderColor: "#D4763C30" }}>
      <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold"
        style={{ background: `linear-gradient(135deg, ${catColors[member.category]}, ${catColors[member.category]}CC)` }}>
        {member.name.charAt(0)}
      </div>
      <div className="text-center">
        <div className="font-bold text-sm" style={{ color: "#1A1A2E" }}>{member.name}</div>
        <div className="text-xs mt-1 px-2 py-0.5 rounded-full inline-block" style={{ background: "#FFF5ED", color: "#D4763C" }}>
          {catLabels[member.category]}
        </div>
      </div>
    </div>
  );
}

function MiniMember({ member }: { member: Member }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-all">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{ background: catColors[member.category] || "#8B9DC3" }}>
        {member.name.charAt(0)}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{member.name}</div>
        <div className="text-xs text-gray-400">{catLabels[member.category]}</div>
      </div>
    </div>
  );
}
