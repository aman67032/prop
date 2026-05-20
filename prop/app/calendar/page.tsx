"use client";
import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Terminal, 
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  Info,
  Layers,
  Sparkles,
  Users
} from "lucide-react";

interface CalendarItem {
  t: string;      // Title
  c: string;      // Color Class / Tag
  tt?: string;    // Tooltip / Description
  changed?: boolean;
  new?: boolean;
}

const TASKS: Record<string, CalendarItem[]> = {
  "2026-05-20":[
    {t:"Brand guide LOCKED (Design)", c:"hard", tt:"Theme, color, logo & typography shared to ALL teams. Hex codes & fonts sent to Tech. Hard deadline — nothing starts without this."},
    {t:"Theme, color, logo & typography shared to ALL teams", c:"hard", tt:"Design distributes brand guide to every team."},
    {t:"Hex codes & fonts sent to Tech", c:"hard", tt:"Brand guide fonts and color codes delivered to developer team."}
  ],
  "2026-05-25":[
    {t:"Photos archive 100–200 (Photography)", c:"soft", tt:"Last year photos (100–200) edited & sorted, sent to Tech. Changed from 300–500 in v2.", changed:true},
    {t:"Content calendar (Social Media)", c:"soft", tt:"Drafted & approved by OHs."}
  ],
  "2026-05-28":[
    {t:"Website content (Media → Tech)", c:"hard", tt:"About, Events, FAQ, Team copy. OHs approve before submission."},
    {t:"Kwikpic finance doc + Photo Finder plan", c:"new", tt:"NEW task. Document of Kwikpic & its finance doc for Photo Finder planning of execution.", new:true},
    {t:"Web assets (.png, .ttf) from Design → Tech", c:"soft", tt:"Files named clearly, handed over task by task (if required)."}
  ],
  "2026-06-01":[
    {t:"Final schedule (OH → full team)", c:"hard", tt:"Final schedule by OH -> shared with full team."},
    {t:"Student rules & guidelines (Media → Tech)", c:"soft", tt:"Student rules & guidelines copy shared to Tech."},
    {t:"Campus Map details (Aman → Tech)", c:"new", tt:"NEW task. Map details shared by Aman to Tech team.", new:true},
    {t:"Campus Map made by Design for displays", c:"new", tt:"NEW task. Design creates digital campus map for display boards.", new:true}
  ],
  "2026-06-02":[
    {t:"Finalize vendors (Events, Design, equip)", c:"new", tt:"NEW task. Vendor of Event & Venue, Design & other equipment finalized.", new:true}
  ],
  "2026-06-05":[
    {t:"Website DEPLOYED to Firebase (Tech)", c:"hard", tt:"In any condition — non-negotiable. Mobile-responsive, countdown timer."}
  ],
  "2026-06-07":[
    {t:"Poster first drafts (Design)", c:"soft", tt:"Follow theme from brand guide. Separate print + digital files."}
  ],
  "2026-06-09":[
    {t:"All posters FINAL — print-ready (Design)", c:"soft", tt:"Correct DPI. Print + web versions both."}
  ],
  "2026-06-10":[
    {t:"Website LIVE", c:"hard", tt:"SEO, mobile-responsive, countdown timer live."},
    {t:"Registrations OPEN", c:"hard", tt:"Cashfree payment integration. Test sandbox first."},
    {t:"Brochure FINAL (Design)", c:"soft", tt:"Welcome note, theme reveal, events, schedule, venue map."},
    {t:"Insta post: Registration Open (Social Media)", c:"hard", tt:"Bio + highlights updated same day."},
    {t:"Check-in system live | Volunteer portal live", c:"hard", tt:"QR per student, multi-gate, offline fallback ready, role-based access, downloadable duty sheet."}
  ],
  "2026-06-15":[
    {t:"Feedback & Analytics Portal LIVE + testing (Tech)", c:"soft", tt:"QR per event, anonymous/named toggle. OH role-based access."},
    {t:"IA requirements list → OHs", c:"soft", tt:"Power, connectivity, extension cords, WiFi, generator."},
    {t:"Discipline Doc FINAL — all 3 types", c:"changed", tt:"SHIFTED from 1 July to 15 June. Covers volunteer, team leader, new student sections. Shifted from 1 July.", changed:true},
    {t:"Camera & gear list → OHs (Photography)", c:"soft", tt:"DSLR vs mirrorless, lens list, college vs rent gap."}
  ],
  "2026-06-18":[
    {t:"ID cards first drafts — 5 variants (Design)", c:"soft", tt:"Volunteer, Student, OH, Team Leader, OSA. B6 size, each variant looks distinct."}
  ],
  "2026-06-19":[
    {t:"Standees, banners, backdrop — ALL FINAL (Design)", c:"soft", tt:"Factor 3–5 days printing time. Print-ready DPI only."}
  ],
  "2026-06-20":[
    {t:"Tech equipment list (rent/buy) submitted", c:"soft", tt:"Include campus equipment available to issue."}
  ],
  "2026-06-21":[
    {t:"Volunteer portal for duties listing", c:"soft", tt:"Volunteer portal opened/listed for tasks and roles distribution."}
  ],
  "2026-06-23":[
    {t:"ID cards, Certs, T-shirts FINAL → printing", c:"changed", tt:"SHIFTED from 26 June to 23 June. 3 days earlier = more print lead time.", changed:true}
  ],
  "2026-06-24":[
    {t:"Kwikpic (Photo Finder) testing begins", c:"changed", tt:"SHIFTED from 1 July to 24 June. 1 week earlier — better bug-fix buffer. Testing with all meeting photos.", changed:true}
  ],
  "2026-06-25":[
    {t:"Duty chart FINALIZED", c:"changed", tt:"SHIFTED from 10 July to 25 June. 15-day shift — ensures teams have chart well in advance.", changed:true}
  ],
  "2026-06-28":[
    {t:"Discipline submits duty chart → all teams", c:"new", tt:"NEW task. Duty chart from Discipline distributed to every team.", new:true},
    {t:"10–15 Instagram posts published (Social Media)", c:"soft", tt:"Cumulative total by this date. At least 1 post every 2–3 days."}
  ],
  "2026-07-01":[
    {t:"Venue layout map → all teams (IA) + equip check", c:"changed", tt:"SHIFTED from 5 July to 1 July. All on-ground planning and layout depends on this. Equipment check on ground.", changed:true}
  ],
  "2026-07-05":[
    {t:"Check all equipment on ground", c:"soft", tt:"Physical inspection of every item on the ground."}
  ],
  "2026-07-10":[
    {t:"Deployment of teams on ground", c:"hard", tt:"Complete F&A team, Complete Hospitality Team, 3-4 Tech Members, 5-6 IA Members, 4-5 Event & Venue member, Complete Feedback & Registration Team, 1-2 Social Media Members, 1-2 Photography Members and Both Leaders of Discipline arrive at campus."}
  ],
  "2026-07-11":[
    {t:"Training: Discipline + Registration", c:"event", tt:"Training day for Discipline & Registration for all team. Check-in test run. Evacuation routes practiced."}
  ],
  "2026-07-12":[
    {t:"Registration offline started", c:"event", tt:"Registration offline started (day/night shift). Remaining team members come by 12 July."},
    {t:"Remaining team members arrival", c:"event", tt:"All remaining team members arrive and report on ground."}
  ],
  "2026-07-13":[
    {t:"Registration offline ongoing", c:"event", tt:"Registration offline ongoing (day/night shift)."}
  ],
  "2026-07-14":[
    {t:"MAIN EVENT: Aarambh Day 1", c:"event", tt:"MAIN EVENT begins. All teams on ground every day. Daily incident reports (Discipline), daily event reports (Media), photo selects to Social Media (Photography). Checking venue, keep checking status of new students."}
  ],
  "2026-07-15":[
    {t:"MAIN EVENT: Aarambh Day 2", c:"event", tt:"MAIN EVENT Day 2. All teams on ground. Daily incident reports (Discipline), daily event reports (Media), photo selects (Photography)."}
  ],
  "2026-07-16":[
    {t:"MAIN EVENT: Aarambh Day 3", c:"event", tt:"MAIN EVENT Day 3. All teams on ground. Daily incident reports (Discipline), daily event reports (Media), photo selects (Photography)."}
  ],
  "2026-07-17":[
    {t:"MAIN EVENT: Aarambh Day 4", c:"event", tt:"MAIN EVENT Day 4. All teams on ground. Daily incident reports (Discipline), daily event reports (Media), photo selects (Photography)."}
  ],
  "2026-07-18":[
    {t:"MAIN EVENT: Aarambh Day 5", c:"event", tt:"MAIN EVENT Day 5. All teams on ground. Daily incident reports (Discipline), daily event reports (Media), photo selects (Photography)."}
  ],
  "2026-07-19":[
    {t:"MAIN EVENT: Aarambh Day 6", c:"event", tt:"MAIN EVENT Day 6. All teams on ground. Daily incident reports (Discipline), daily event reports (Media), photo selects (Photography)."}
  ],
  "2026-07-20":[
    {t:"MAIN EVENT: Aarambh Day 7", c:"event", tt:"MAIN EVENT Day 7. All teams on ground. Daily incident reports (Discipline), daily event reports (Media), photo selects (Photography)."}
  ],
  "2026-07-21":[
    {t:"MAIN EVENT: Aarambh Day 8 (Concludes)", c:"event", tt:"MAIN EVENT Day 8. All teams on ground. Daily incident reports, event reports, photo selects. Event ends. Venue handover/breakdown begins."}
  ],
  "2026-07-22":[
    {t:"Venue breakdown & cleanup", c:"event", tt:"21–24 July breakdown: Breakdown, gear returned, admin handover."}
  ],
  "2026-07-23":[
    {t:"Rented gear returned", c:"event", tt:"Return of rented technical and lighting equipment."}
  ],
  "2026-07-24":[
    {t:"Formal venue handover to admin", c:"event", tt:"Final administrative checks and venue sign-offs with JKLU administration."}
  ],
  "2026-07-26":[
    {t:"Social Media recap reel published", c:"soft", tt:"Recap reel of the entire event goes live on social channels."},
    {t:"Final report submitted (Media)", c:"soft", tt:"Media team submits the final Aarambh'26 summary report."}
  ],
  "2026-07-28":[
    {t:"Aftermovie live - OHs approve first (Media)", c:"soft", tt:"Official aftermovie goes live after OH review & approval."},
    {t:"All photos to shared drive (Photography)", c:"soft", tt:"All photography assets uploaded to the master shared drive."}
  ]
};

const MEETINGS: Record<string, CalendarItem[]> = {
  "2026-05-25":[
    {t:"① OSA + OH + Design Team", c:"mtg-new", tt:"Standees / banners / backdrop / t-shirts / wristbands / ID cards decided (sizes and quantity). Pre-final schedule. Evening activity requirements finalized. Vendor checking & suggestions. Invitation process for new students. Registration amount from new students."}
  ],
  "2026-05-28":[
    {t:"Meeting With Clubs with OH", c:"mtg-new", tt:"Discussion with club representatives and OHs."}
  ],
  "2026-05-30":[
    {t:"② Clusters + OH + Deepak Sir", c:"mtg-new", tt:"Admission data review. Distribution process planning."}
  ],
  "2026-06-01":[
    {t:"③ OH + Deepak Sir + Accounts Team", c:"mtg-new", tt:"Registration process. How it will work & display."},
    {t:"③.1 → Tech Team (after accounts)", c:"mtg-new", tt:"After accounts meeting. Progress update. Full structure flow. IT team requirements."},
    {t:"③.2 → Media + Design (after Tech)", c:"mtg-new", tt:"After Tech meeting. Aarambh brochure discussion."}
  ],
  "2026-06-02":[
    {t:"④ OH + Discipline Team", c:"mtg-new", tt:"Policies, protocol & rules discussion. Discipline doc deadline shifted: 1 July → 15 June."}
  ],
  "2026-06-03":[
    {t:"⑤ OH + Deepak Sir + IT Team", c:"mtg-new", tt:"Digital Campus Map. Hosting of Aarambh website. IT team process overview. All requirements submission to IT team."}
  ],
  "2026-06-05":[
    {t:"⑥ Feedback & Registration Team", c:"mtg-new", tt:"Finalize their workflow. Walk them through the entire process."}
  ],
  "2026-06-07":[
    {t:"⑦ Deepak Sir + OH + Design Team", c:"mtg-new", tt:"Poster of Aarambh review. Brochure progress update."}
  ],
  "2026-06-10":[
    {t:"⑧ Tech Team", c:"mtg", tt:"Registration live review & branding. Feedback & Analytics system structure & progress."}
  ],
  "2026-06-11":[
    {t:"⑨ Photography Team (first half)", c:"mtg-new", tt:"Equipment list, budget. Second half also joined by Social Media team for their requirements. Final combined suggestions."}
  ],
  "2026-06-15":[
    {t:"⑩ Progress review: OH + OSA", c:"mtg", tt:"Progress so far check-in between OHs and OSA."}
  ],
  "2026-06-16":[
    {t:"⑪ All OHs + Design Team", c:"mtg-new", tt:"ID card, t-shirt, wristband design discussion. Progress on standees, banners, stage backdrop, gate posters."}
  ],
  "2026-06-20":[
    {t:"⑫ Hospitality + Food & Accommodation", c:"mtg", tt:"Operational walkthrough meeting."}
  ],
  "2026-06-21":[
    {t:"⑬ All Team Leaders", c:"mtg-new", tt:"Finalizing duty chart."}
  ],
  "2026-06-22":[
    {t:"⑭ Clusters - open discussion (anything pending)", c:"mtg-new", tt:"Open discussion — anything pending or unresolved."}
  ],
  "2026-06-23":[
    {t:"⑮ Media Team", c:"mtg-new", tt:"Operation workflow. Pre-event all documents finalized."}
  ],
  "2026-06-26":[
    {t:"⑯ Discipline (DC) Team", c:"mtg-new", tt:"Review duty chart vs all team duty charts. All restricted area policy finalized."}
  ],
  "2026-07-01":[
    {t:"⑰ Full Team meeting - OH + OSA side", c:"mtg-new", tt:"Full team meeting from OH & OSA side."}
  ],
  "2026-07-10":[
    {t:"OH + OSA offline meeting", c:"mtg", tt:"Final alignment before event. Ground-readiness check."}
  ],
  "2026-07-11":[
    {t:"Day 0 coordination", c:"event", tt:"On-ground coordination. No formal meeting — all teams present."}
  ],
  "2026-07-12":[
    {t:"Operational", c:"event", tt:"Operational coordination on the ground."}
  ],
  "2026-07-13":[
    {t:"Operational", c:"event", tt:"Operational coordination on the ground."}
  ],
  "2026-07-14":[{t:"Morning OH meeting + EOD debrief", c:"event", tt:"Daily morning OH meetings + end-of-day debrief."}],
  "2026-07-15":[{t:"Morning OH meeting + EOD debrief", c:"event", tt:"Daily morning OH meetings + end-of-day debrief."}],
  "2026-07-16":[{t:"Morning OH meeting + EOD debrief", c:"event", tt:"Daily morning OH meetings + end-of-day debrief."}],
  "2026-07-17":[{t:"Morning OH meeting + EOD debrief", c:"event", tt:"Daily morning OH meetings + end-of-day debrief."}],
  "2026-07-18":[{t:"Morning OH meeting + EOD debrief", c:"event", tt:"Daily morning OH meetings + end-of-day debrief."}],
  "2026-07-19":[{t:"Morning OH meeting + EOD debrief", c:"event", tt:"Daily morning OH meetings + end-of-day debrief."}],
  "2026-07-20":[{t:"Morning OH meeting + EOD debrief", c:"event", tt:"Daily morning OH meetings + end-of-day debrief."}],
  "2026-07-21":[{t:"Post-event review: OSA + OHs", c:"event", tt:"Assessment of successes, challenges, recommendations. Daily morning OH meeting + end-of-day debrief."}]
};

const MONTHS = [
  { year: 2026, month: 4, label: "MAY 2026" },
  { year: 2026, month: 5, label: "JUNE 2026" },
  { year: 2026, month: 6, label: "JULY 2026" },
];

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Styled classes for chips based on type in dark theme
const CHIP_STYLES: Record<string, { bg: string; text: string; border: string; label: string; dot: string }> = {
  hard: {
    bg: "bg-[#7F77DD]/10",
    text: "text-[#C1BCFF]",
    border: "border-[#7F77DD]/30 hover:border-[#7F77DD]/60",
    label: "HARD DEADLINE",
    dot: "bg-[#7F77DD]"
  },
  soft: {
    bg: "bg-[#639922]/10",
    text: "text-[#A3E635]",
    border: "border-[#639922]/30 hover:border-[#639922]/60",
    label: "REGULAR DEADLINE",
    dot: "bg-[#639922]"
  },
  changed: {
    bg: "bg-[#EF9F27]/10",
    text: "text-[#FDBA74]",
    border: "border-[#EF9F27]/30 hover:border-[#EF9F27]/60",
    label: "DATE SHIFTED ⚠️",
    dot: "bg-[#EF9F27]"
  },
  new: {
    bg: "bg-[#378ADD]/10",
    text: "text-[#93C5FD]",
    border: "border-[#378ADD]/30 hover:border-[#378ADD]/60",
    label: "NEW TASK",
    dot: "bg-[#378ADD]"
  },
  event: {
    bg: "bg-[#E24B4A]/10",
    text: "text-[#FCA5A5]",
    border: "border-[#E24B4A]/30 hover:border-[#E24B4A]/60",
    label: "EVENT TIMELINE 🎉",
    dot: "bg-[#E24B4A]"
  },
  mtg: {
    bg: "bg-[#7F77DD]/10",
    text: "text-[#C1BCFF]",
    border: "border-[#7F77DD]/30 hover:border-[#7F77DD]/60",
    label: "MEETING (V2)",
    dot: "bg-[#7F77DD]"
  },
  "mtg-new": {
    bg: "bg-[#1D9E75]/10",
    text: "text-[#6EE7B7]",
    border: "border-[#1D9E75]/30 hover:border-[#1D9E75]/60",
    label: "NEW MEETING ⚠️",
    dot: "bg-[#1D9E75]"
  }
};

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<"tasks" | "meetings">("tasks");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string | null>("2026-05-20");
  const [hoveredItem, setHoveredItem] = useState<{ date: string; index: number } | null>(null);

  const activeData = activeTab === "tasks" ? TASKS : MEETINGS;

  const dateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  // Filter items based on search query and category filters
  const getFilteredItemsForDate = (key: string) => {
    const items = activeData[key] || [];
    return items.filter(item => {
      const matchesSearch = item.t.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.tt && item.tt.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = filterType === "all" || item.c === filterType;
      return matchesSearch && matchesType;
    });
  };

  // Find all tasks or meetings in currently active dataset that match search criteria
  const getGlobalFilteredCount = () => {
    let count = 0;
    Object.keys(activeData).forEach(key => {
      count += getFilteredItemsForDate(key).length;
    });
    return count;
  };

  // Selected date details
  const selectedDateItems = selectedDate ? getFilteredItemsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4763C]/30 font-sans"
         style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
      
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="absolute top-0 left-1/4 w-[500px] h-[200px] bg-[#D4763C] opacity-10 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-3 border border-[#D4763C]/30 bg-[#D4763C]/10 text-[#D4763C]">
            <Terminal size={12} className="animate-pulse" /> COMMAND.SCHEDULER
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-light font-mono text-white mb-2 tracking-tight">MASTER_CALENDAR</h1>
              <p className="text-sm text-gray-500 font-mono">INTEGRATED TASK & MEETING COMPENDIUM</p>
            </div>
            
            {/* Search and Tab Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <input
                  type="text"
                  placeholder="SEARCH TIMELINE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#D4763C]/50 w-full sm:w-64 transition-all"
                />
              </div>

              {/* Tab Selector */}
              <div className="bg-white/5 border border-white/10 p-0.5 rounded-lg flex">
                <button
                  onClick={() => { setActiveTab("tasks"); setFilterType("all"); }}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-mono transition-all ${
                    activeTab === "tasks" 
                      ? "bg-[#D4763C] text-black font-bold shadow-[0_0_15px_rgba(212,118,60,0.3)]" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <CheckCircle2 size={12} /> TASKS
                </button>
                <button
                  onClick={() => { setActiveTab("meetings"); setFilterType("all"); }}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-mono transition-all ${
                    activeTab === "meetings" 
                      ? "bg-[#D4763C] text-black font-bold shadow-[0_0_15px_rgba(212,118,60,0.3)]" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <CalendarIcon size={12} /> MEETINGS
                </button>
              </div>
            </div>
          </div>

          {/* Filter Categories and Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase mr-2 flex items-center gap-1">
                <Filter size={10} /> Category Filter:
              </span>
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1 rounded text-[10px] font-mono border transition-all ${
                  filterType === "all"
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-transparent bg-white/5 text-gray-500 hover:text-gray-300"
                }`}
              >
                ALL
              </button>
              {activeTab === "tasks" ? (
                <>
                  {["hard", "soft", "changed", "new", "event"].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1 rounded text-[10px] font-mono border transition-all ${
                        filterType === type
                          ? `border-[#D4763C]/50 bg-[#D4763C]/10 text-white`
                          : "border-transparent bg-white/5 text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${CHIP_STYLES[type]?.dot}`} />
                      {CHIP_STYLES[type]?.label.split(" ")[0]}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {["mtg", "mtg-new", "event"].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1 rounded text-[10px] font-mono border transition-all ${
                        filterType === type
                          ? `border-[#D4763C]/50 bg-[#D4763C]/10 text-white`
                          : "border-transparent bg-white/5 text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${CHIP_STYLES[type]?.dot}`} />
                      {CHIP_STYLES[type]?.label.split(" ")[0]}
                    </button>
                  ))}
                </>
              )}
            </div>
            
            {/* Global result notification */}
            {searchQuery && (
              <div className="text-[10px] font-mono text-[#D4763C] bg-[#D4763C]/10 border border-[#D4763C]/30 px-3 py-1 rounded">
                FOUND {getGlobalFilteredCount()} matches in active database
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Workspace: Calendar Grid + Interactive Drawer */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8 relative z-20">
        
        {/* Left / Center Columns: Months Grids */}
        <div className="lg:col-span-2 space-y-12">
          {MONTHS.map(({ year, month, label }) => {
            const firstDayIndex = new Date(year, month, 1).getDay();
            const totalDays = new Date(year, month + 1, 0).getDate();
            const cells = [];

            // Pad previous empty blocks
            for (let i = 0; i < firstDayIndex; i++) {
              cells.push(<div key={`empty-${i}`} className="bg-transparent border-transparent min-h-[90px] rounded-lg p-2 opacity-25 border border-white/5" />);
            }

            // Pad remaining days of month
            for (let day = 1; day <= totalDays; day++) {
              const currentKey = dateKey(year, month, day);
              const dayItems = getFilteredItemsForDate(currentKey);
              const isSelected = selectedDate === currentKey;
              const hasItems = dayItems.length > 0;
              const isToday = currentKey === "2026-05-20"; // Highlight system simulation today's date

              cells.push(
                <div
                  key={currentKey}
                  onClick={() => setSelectedDate(currentKey)}
                  className={`min-h-[95px] border rounded-lg p-2 transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected 
                      ? "border-[#D4763C] bg-[#D4763C]/5 shadow-[0_0_15px_rgba(212,118,60,0.15)]" 
                      : hasItems 
                        ? "border-white/10 bg-[#0A0A0A] hover:border-white/30" 
                        : "border-white/5 bg-[#030303] hover:border-white/20"
                  } ${isToday ? "ring-1 ring-[#5BA88C]/50" : ""}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[11px] font-mono font-bold ${
                      isSelected 
                        ? "text-[#D4763C]" 
                        : isToday 
                          ? "text-[#5BA88C] font-black" 
                          : hasItems 
                            ? "text-white" 
                            : "text-gray-600"
                    }`}>
                      {day}
                      {isToday && <span className="text-[9px] text-[#5BA88C] ml-1 opacity-75">(TODAY)</span>}
                    </span>
                    
                    {hasItems && (
                      <span className="text-[9px] font-mono px-1 rounded bg-white/5 text-gray-500 border border-white/5">
                        {dayItems.length}
                      </span>
                    )}
                  </div>

                  {/* Day cell items (Chips) */}
                  <div className="space-y-1 mt-1 flex-1 flex flex-col justify-end overflow-hidden">
                    {dayItems.slice(0, 3).map((item, idx) => {
                      const style = CHIP_STYLES[item.c] || CHIP_STYLES.soft;
                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoveredItem({ date: currentKey, index: idx })}
                          onMouseLeave={() => setHoveredItem(null)}
                          className={`relative text-[9px] font-mono truncate px-1.5 py-0.5 rounded border transition-colors ${style.bg} ${style.text} ${style.border}`}
                          title={item.t}
                        >
                          {item.t}

                          {/* Hover Tooltip (Desktop) */}
                          {hoveredItem?.date === currentKey && hoveredItem?.index === idx && item.tt && (
                            <div className="absolute left-0 bottom-full mb-1 z-50 w-56 bg-black border border-white/15 p-3 rounded-lg shadow-2xl pointer-events-none text-left animate-fade-in-up">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">
                                  {style.label}
                                </span>
                              </div>
                              <h5 className="font-bold text-white text-[10px] leading-tight mb-1">{item.t}</h5>
                              <p className="text-[9px] text-gray-400 leading-normal font-sans font-medium whitespace-pre-wrap">{item.tt}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {dayItems.length > 3 && (
                      <div className="text-[8px] font-mono text-[#D4763C] text-right font-bold pr-1">
                        +{dayItems.length - 3} MORE
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <div key={label} className="bg-[#0A0A0A]/50 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <h3 className="font-mono text-sm font-bold tracking-widest text-[#D4763C]">{label}</h3>
                  <div className="text-[10px] font-mono text-gray-500 uppercase">
                    SYS.GRID_VIEW // {year}.M0{month + 1}
                  </div>
                </div>

                {/* Day Header */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {DAYS.map(day => (
                    <div key={day} className="text-center text-[10px] font-mono text-gray-600 py-1 font-semibold uppercase">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grid Cells */}
                <div className="grid grid-cols-7 gap-2">
                  {cells}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Inspector Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-[#0A0A0A] border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col min-h-[500px]">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4763C] to-transparent opacity-50" />
            
            <div className="flex items-center gap-2 mb-6">
              <Layers size={16} className="text-[#D4763C]" />
              <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Detail_Inspector</h2>
            </div>

            {selectedDate ? (
              <div className="flex-1 flex flex-col">
                {/* Date Heading */}
                <div className="border-b border-white/10 pb-4 mb-6">
                  <span className="text-[10px] font-mono text-[#D4763C] uppercase tracking-wider block mb-1">
                    SELECTED COORDINATES
                  </span>
                  <h4 className="text-xl font-bold font-mono text-white">
                    {new Date(selectedDate).toLocaleDateString("en-US", { 
                      weekday: "short", 
                      month: "long", 
                      day: "numeric", 
                      year: "numeric" 
                    }).toUpperCase()}
                  </h4>
                </div>

                {/* Date Items list */}
                <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                  {selectedDateItems.length > 0 ? (
                    selectedDateItems.map((item, idx) => {
                      const style = CHIP_STYLES[item.c] || CHIP_STYLES.soft;
                      return (
                        <div 
                          key={idx} 
                          className="bg-white/5 border border-white/5 hover:border-white/10 p-4 rounded-lg transition-all"
                        >
                          <div className="flex items-center gap-2 mb-2.5">
                            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                            <span className="text-[9px] font-mono font-bold text-gray-400 tracking-wider">
                              {style.label}
                            </span>
                            {item.changed && (
                              <span className="text-[8px] font-mono px-1 rounded bg-[#EF9F27]/10 text-[#FDBA74] border border-[#EF9F27]/30">
                                SHIFTED
                              </span>
                            )}
                            {item.new && (
                              <span className="text-[8px] font-mono px-1 rounded bg-[#378ADD]/10 text-[#93C5FD] border border-[#378ADD]/30">
                                NEW
                              </span>
                            )}
                          </div>
                          
                          <h4 className="text-sm font-mono font-semibold text-white leading-snug mb-2">
                            {item.t}
                          </h4>
                          
                          {item.tt ? (
                            <p className="text-xs text-gray-400 leading-relaxed font-sans font-medium">
                              {item.tt}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-600 font-mono italic">
                              NO_DESCRIPTION_PROVIDED
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-20 text-gray-600 flex flex-col items-center justify-center gap-3 font-mono text-xs">
                      <Sparkles size={20} className="text-gray-700 opacity-50 animate-pulse" />
                      NO_DEADLINES_ON_THIS_DATE
                      <span className="text-[9px] text-gray-800 leading-normal max-w-[180px] mt-1">
                        Select a highlighted day on the calendar grids to inspect active payloads.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-gray-600 font-mono text-xs">
                <Info size={24} className="mb-3 text-gray-700" />
                SELECT_DATE_TO_INSPECT
              </div>
            )}

            {/* Simulated Live status bar */}
            <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center text-[9px] font-mono text-gray-500 uppercase">
              <span>DB.COMMIT_STATE // SUCCESS</span>
              <span className="animate-pulse flex items-center gap-1 text-[#5BA88C]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5BA88C]" /> LIVE
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
