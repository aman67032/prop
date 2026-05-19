"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { Network, LayoutList, Search, Terminal } from "lucide-react";

interface Member { _id: string; name: string; rollNo: string; gender: string; position: string; committee: string; cluster: string; phone: string; email: string; category: string; }
interface Structure { organizingHeads: Member[]; committees: { name: string; heads: Member[]; volunteers: Member[]; clusterHeads: Member[]; cohortLeaders: Member[] }[]; }

const catColors: Record<string, string> = {
  organizing_head: "#D4763C", team_leader: "#5BA88C", committee_head: "#5BA88C",
  cluster_head: "#8B9DC3", cohort_leader: "#8B9DC3", volunteer: "#6B7280"
};

const catLabels: Record<string, string> = {
  organizing_head: "SYS.CORE", team_leader: "LEAD.NODE", committee_head: "LEAD.NODE",
  cluster_head: "CLUSTER.OP", cohort_leader: "COHORT.OP", volunteer: "BASE.UNIT"
};

import Loader from "../components/Loader";

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
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <Loader />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4763C]/30 font-sans"
         style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
      
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="absolute top-0 right-1/4 w-[500px] h-[200px] bg-[#5BA88C] opacity-10 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 flex flex-col md:flex-row items-end justify-between gap-6 min-h-[11vh]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-3 border border-[#5BA88C]/30 bg-[#5BA88C]/10 text-[#5BA88C]">
              <Terminal size={12} className="animate-pulse" /> NETWORK.TOPOLOGY
            </div>
            <h1 className="text-3xl md:text-4xl font-light font-mono text-white mb-1 tracking-tight">OPERATIVE_DIRECTORY</h1>
            <p className="text-sm text-gray-500 font-mono"><span className="text-white">{allMembers.length}</span> ACTIVE NODES FOUND</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4763C] transition-colors" size={16} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="QUERY.DATABASE..."
                className="w-full sm:w-[300px] pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:border-[#D4763C]/50 focus:shadow-[0_0_15px_rgba(212,118,60,0.2)] transition-all placeholder-gray-600" />
            </div>
            <div className="flex bg-[#0A0A0A] border border-white/10 rounded-lg p-1">
              <button onClick={() => setView("tree")} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-mono transition-all ${view === "tree" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                [ <Network size={14}/> MAP ]
              </button>
              <button onClick={() => setView("list")} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-mono transition-all ${view === "list" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                [ <LayoutList size={14}/> LOG ]
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-20">
        {view === "tree" && structure && !search ? (
          <div className="space-y-16">
            {/* Core Command */}
            <div className="text-center relative">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded bg-[#0A0A0A] border border-[#D4763C]/30 text-xs font-mono text-[#D4763C] mb-8 relative z-10">
                // SYS.CORE_COMMAND
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 relative z-10">
                {structure.organizingHeads.map(m => (
                  <MemberCard key={m._id} member={m} glowColor="#D4763C" />
                ))}
              </div>
              {/* Data line down */}
              <div className="w-px h-16 bg-gradient-to-b from-[#D4763C]/50 to-transparent mx-auto mt-4" />
            </div>

            {/* Subsystems */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {structure.committees.map((c, i) => (
                <div key={i} className="bg-[#0A0A0A] border border-white/10 hover:border-[#5BA88C]/40 rounded-xl overflow-hidden transition-all group">
                  <div className="p-4 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#5BA88C]/30 to-transparent" />
                    <h3 className="font-mono text-sm text-gray-200 group-hover:text-white transition-colors">{c.name}</h3>
                    <p className="text-[10px] font-mono text-[#5BA88C] mt-1 tracking-widest">
                      {c.heads.length + c.volunteers.length + c.clusterHeads.length + c.cohortLeaders.length} NODES_ACTIVE
                    </p>
                  </div>
                  <div className="p-4 space-y-2 bg-black/20">
                    {c.heads.map(m => <MiniMember key={m._id} member={m} />)}
                    {c.clusterHeads.map(m => <MiniMember key={m._id} member={m} />)}
                    
                    {c.volunteers.length > 0 && (
                      <details className="mt-2 group/det">
                        <summary className="text-[10px] font-mono tracking-widest cursor-pointer text-gray-500 hover:text-[#8B9DC3] py-2 border-t border-white/5 uppercase flex items-center gap-2">
                          <span className="text-[#8B9DC3] opacity-50 group-open/det:rotate-90 transition-transform">▸</span> 
                          {c.volunteers.length} BASE.UNITS
                        </summary>
                        <div className="pt-2 space-y-1 pl-2 border-l border-white/5 ml-1.5">
                          {c.volunteers.map(m => <MiniMember key={m._id} member={m} />)}
                        </div>
                      </details>
                    )}
                    {c.cohortLeaders.length > 0 && (
                      <details className="mt-2 group/det">
                        <summary className="text-[10px] font-mono tracking-widest cursor-pointer text-gray-500 hover:text-[#8B9DC3] py-2 border-t border-white/5 uppercase flex items-center gap-2">
                          <span className="text-[#8B9DC3] opacity-50 group-open/det:rotate-90 transition-transform">▸</span> 
                          {c.cohortLeaders.length} COHORT.OPS
                        </summary>
                        <div className="pt-2 space-y-1 pl-2 border-l border-white/5 ml-1.5">
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
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-[10px] text-gray-500 uppercase tracking-widest">ID/Name</th>
                    <th className="px-6 py-4 text-[10px] text-gray-500 uppercase tracking-widest hidden sm:table-cell">Registration</th>
                    <th className="px-6 py-4 text-[10px] text-gray-500 uppercase tracking-widest">Clearance</th>
                    <th className="px-6 py-4 text-[10px] text-gray-500 uppercase tracking-widest hidden md:table-cell">Subsystem</th>
                    <th className="px-6 py-4 text-[10px] text-gray-500 uppercase tracking-widest hidden lg:table-cell">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((m) => (
                    <tr key={m._id} className="hover:bg-white/5 transition-colors group cursor-crosshair">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded border flex items-center justify-center text-xs font-bold"
                            style={{ borderColor: `${catColors[m.category]}30`, color: catColors[m.category], backgroundColor: `${catColors[m.category]}10` }}>
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{m.name}</span>
                            <span className="block sm:hidden text-[10px] text-gray-600 mt-0.5">{m.rollNo}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 hidden sm:table-cell">{m.rollNo}</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] px-2 py-1 rounded border" style={{ borderColor: `${catColors[m.category]}30`, color: catColors[m.category], backgroundColor: `${catColors[m.category]}10` }}>
                          {catLabels[m.category] || m.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 hidden md:table-cell">{m.committee}</td>
                      <td className="px-6 py-4 text-xs text-gray-600 group-hover:text-gray-400 transition-colors hidden lg:table-cell">{m.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-600 font-mono text-sm flex flex-col items-center gap-2">
                <Terminal size={24} className="opacity-50 mb-2" />
                ERR: NO_RECORDS_MATCH_QUERY
              </div>
            )}
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

function MemberCard({ member, glowColor }: { member: Member, glowColor: string }) {
  return (
    <div className="relative group bg-[#0A0A0A] border rounded-xl p-6 w-56 text-center transition-all hover:-translate-y-1 hover:border-[#D4763C]/50"
      style={{ borderColor: "rgba(255,255,255,0.1)" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-xl pointer-events-none" />
      <div className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity pointer-events-none" style={{ backgroundColor: glowColor }} />
      
      <div className="relative z-10">
        <div className="w-16 h-16 rounded border mx-auto mb-4 flex items-center justify-center text-xl font-bold font-mono"
          style={{ borderColor: `${glowColor}50`, color: glowColor, backgroundColor: `${glowColor}10` }}>
          {member.name.charAt(0)}
        </div>
        <div className="font-mono text-sm text-gray-200 group-hover:text-white transition-colors truncate">{member.name}</div>
        <div className="text-[10px] mt-2 font-mono tracking-widest uppercase" style={{ color: glowColor }}>
          {catLabels[member.category]}
        </div>
      </div>
    </div>
  );
}

function MiniMember({ member }: { member: Member }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-crosshair">
      <div className="w-6 h-6 rounded border flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0"
        style={{ borderColor: `${catColors[member.category]}50`, color: catColors[member.category], backgroundColor: `${catColors[member.category]}10` }}>
        {member.name.charAt(0)}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-mono text-gray-300 truncate">{member.name}</div>
        <div className="text-[9px] font-mono text-gray-600 mt-0.5 tracking-wider uppercase">{catLabels[member.category]}</div>
      </div>
    </div>
  );
}
