import { useState } from 'react';
import { 
  Menu, Bell, Send, Home, User, Activity, 
  Cpu, FileText, MessageSquare, ShieldAlert, Layers, Search, CheckCircle2 
} from 'lucide-react';

interface Message {
  sender: string;
  text: string;
  type: 'reported' | 'ai';
}

interface Conversation {
  id: string;
  title: string;
  astronaut: string;
  date: string;
  status: 'AWAITING CLINICIAN REVIEW' | 'REVIEWED';
  confidence: string;
  uncertainty: string;
  followUp: string;
  messages: Message[];
}

export default function AiHealthAssistant() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'review'>('all');
  
  const [conversations] = useState<Conversation[]>([
    {
      id: 'CMP-117-006',
      title: 'Transient dizziness after head movement',
      astronaut: 'LT. M. RIVERA',
      date: '22 APR 2026',
      status: 'AWAITING CLINICIAN REVIEW',
      confidence: '0.82',
      uncertainty: 'Moderate uncertainty | confirm details with crew',
      followUp: 'When did the dizziness begin, how long did it last, and has it happened more than once?',
      messages: [
        { sender: 'LT. M. RIVERA', text: 'Experienced brief dizziness when turning head quickly during shift setup.', type: 'reported' },
        { sender: 'AI Assistant', text: 'Structured extraction logged. Flagged under vestibular tracking telemetry.', type: 'ai' }
      ]
    },
    {
      id: 'CMP-117-007',
      title: 'Mild fatigue variance after sleep cycle',
      astronaut: 'LT. M. RIVERA',
      date: '23 APR 2026',
      status: 'AWAITING CLINICIAN REVIEW',
      confidence: '0.78',
      uncertainty: 'Low-to-moderate confidence | review against sleep logs',
      followUp: 'Did you wake up during the sleep cycle, and how long did the fatigue persist?',
      messages: [
        { sender: 'LT. M. RIVERA', text: 'Woke up feeling slightly sluggish despite 8 hours in sleep harness.', type: 'reported' }
      ]
    },
    {
      id: 'CMP-117-008',
      title: 'Hydration intake drop anomaly',
      astronaut: 'LT. M. RIVERA',
      date: '24 APR 2026',
      status: 'REVIEWED',
      confidence: '0.91',
      uncertainty: 'High confidence match with telemetry water usage',
      followUp: 'Can you increase electrolyte intake for the next two operational cycles?',
      messages: [
        { sender: 'DR. K. NIELSEN', text: 'Reviewed water packet consumption logs. Please boost fluids.', type: 'reported' }
      ]
    }
  ]);

  const [activeThread, setActiveThread] = useState<Conversation>(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [clinicianNote, setClinicianNote] = useState('');
  const [reviewState, setReviewState] = useState<'NOT REVIEWED' | 'REVIEWED'>('NOT REVIEWED');

  const filteredConversations = conversations.filter(c => {
    if (filter === 'open') return c.status === 'AWAITING CLINICIAN REVIEW';
    if (filter === 'review') return c.status === 'REVIEWED';
    return true;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const updatedMessages: Message[] = [
      ...activeThread.messages,
      { sender: 'LT. M. RIVERA', text: newMessage, type: 'reported' }
    ];

    const updatedThread = { ...activeThread, messages: updatedMessages };
    setActiveThread(updatedThread);
    setNewMessage('');
  };

  const handleMarkReviewed = () => {
    setReviewState('REVIEWED');
  };

  return (
    <div className="min-h-screen bg-[#040d16] text-slate-100 font-sans flex flex-col antialiased relative overflow-hidden">
      
      {/* Astronomy Space Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full bg-blue-700/10 blur-[150px]" />
      </div>

      <div className="flex flex-1 mission-shell overflow-hidden relative z-10">
        
        {/* Sidebar Navigation */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#081b2d]/90 backdrop-blur-xl border-r border-sky-500/20 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 flex flex-col justify-between`}>
          <div>
            <div className="p-5 flex items-center justify-between border-b border-sky-500/20">
              <a href="index.html" className="flex items-center space-x-2.5">
                <span className="w-8 h-8 rounded-xl bg-sky-400 flex items-center justify-center text-black font-bold shadow-[0_0_10px_rgba(56,189,248,0.5)]">
                  <Activity size={18} />
                </span>
                <span className="font-bold text-lg tracking-wider text-white">ASTRA</span>
              </a>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">✕</button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1 text-sm text-slate-300">
              <div className="px-3 text-[11px] font-mono text-sky-400 uppercase tracking-wider mb-2">Crew &amp; Telemetry</div>
              <a href="dashboard.html#mission-overview" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-sky-950/40 hover:text-white transition">
                <Home size={17} className="text-sky-400" /><span>Mission Overview</span>
              </a>
              <a href="astronaut-profile.html" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-sky-950/40 hover:text-white transition">
                <User size={17} className="text-sky-400" /><span>Astronaut Profiles</span>
              </a>
              <a href="dashboard.html#whole-body" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-sky-950/40 hover:text-white transition">
                <Activity size={17} className="text-sky-400" /><span>Whole-Body Monitoring</span>
              </a>
              <a href="dashboard.html#telemetry" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-sky-950/40 hover:text-white transition">
                <Cpu size={17} className="text-sky-400" /><span>Physiological Telemetry</span>
              </a>
              <a href="device-network.html" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-sky-950/40 hover:text-white transition">
                <Layers size={17} className="text-sky-400" /><span>Device Network</span>
              </a>

              <div className="px-3 text-[11px] font-mono text-sky-400 uppercase tracking-wider pt-6 mb-2">Medical Intelligence</div>
              <a href="health-complaints.html" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-sky-950/40 hover:text-white transition">
                <FileText size={17} className="text-sky-400" /><span>Health Complaints</span>
              </a>
              <a href="ai-health-assistant.html" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-sky-500/20 border border-sky-400/40 text-white font-semibold shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                <MessageSquare size={17} className="text-sky-300" /><span>AI Health Assistant</span>
              </a>
              <a href="medical-alerts.html" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-sky-950/40 hover:text-white transition">
                <ShieldAlert size={17} className="text-sky-400" /><span>Medical Alerts</span>
              </a>
            </nav>
          </div>
          
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-sky-400 text-black flex items-center justify-center font-bold text-xs">
                KN
              </div>
              <div>
                <p className="text-xs font-bold text-white">Dr. K. Nielsen</p>
                <p className="text-[11px] font-mono text-sky-400">ID: ASTRA-117</p>
              </div>
            </div>

            <div className="rounded-2xl bg-sky-50 p-4 border border-sky-200">
              <p className="text-sm font-bold text-white">AI Health Update</p>
              <p className="text-[11px] font-mono text-sky-300 mt-1">Simulated Assistant</p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                Structured symptom extraction &amp; clinical review engine active.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          <header className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 bg-[#040d16]/80 backdrop-blur-xl border-b border-sky-500/20">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden text-sky-400"><Menu size={20} /></button>
              <div className="hidden sm:flex items-center gap-2.5 rounded-full bg-[#081b2d] px-4 py-2 w-72 border border-sky-500/30 shadow-inner">
                <Search size={15} className="text-sky-400" />
                <input
                  type="text"
                  placeholder="Search clinical threads..."
                  className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 ml-auto">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-[#081b2d] border border-sky-500/30 px-3.5 py-1.5 text-xs font-mono text-sky-300">
                <span className="text-slate-400">Mission:</span>
                <strong className="font-semibold text-white">ASTRA-117</strong>
              </div>

              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="p-2.5 relative bg-[#081b2d] border border-sky-500/30 rounded-full hover:bg-sky-500/20 transition text-sky-300"
                >
                  <Bell size={16} />
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</span>
                </button>
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-68 bg-[#081b2d] border border-sky-500/30 rounded-2xl shadow-2xl p-3.5 z-50 text-xs backdrop-blur-xl">
                    <div className="flex justify-between font-bold text-white mb-2 border-b border-sky-500/20 pb-2 font-mono">
                      <span>Alert Queue</span>
                      <span className="text-sky-400">SIMULATED</span>
                    </div>
                    <p className="py-1.5 text-slate-300">⚠️ Hydration drift | review pending</p>
                    <p className="py-1.5 text-slate-300">🚨 Vestibular cluster | elevated</p>
                    <p className="py-1.5 text-slate-300">📡 Oximeter link | offline</p>
                  </div>
                )}
              </div>

              <span className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-full shadow-sm font-mono">
                LT. M. RIVERA
              </span>
            </div>
          </header>

          <main className="px-6 pb-8 pt-6 flex-1 space-y-6 max-w-[1400px] w-full mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-sky-400 uppercase tracking-wider">Crew Dialogue / Clinical Review</p>
                <h1 className="text-2xl font-bold text-white tracking-tight">AI Health Assistant</h1>
                <p className="text-xs text-slate-400 mt-1">A structured conversation workspace for symptom reporting, follow-up and medical-team review.</p>
              </div>
              <span className="px-3.5 py-1.5 bg-[#081b2d] border border-sky-500/30 text-xs font-mono text-sky-300 rounded-full self-start">
                SIMULATED ASSISTANT · NO LIVE CLINICAL AI
              </span>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-[#081b2d]/80 border border-sky-500/20 p-4 rounded-3xl backdrop-blur-md shadow-xl">
              <div className="space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-full text-[10px] font-mono">
                  ASTRONAUT-REPORTED
                </span>
                <p className="text-slate-400">Original crew message. Preserved exactly as submitted.</p>
              </div>
              <div className="space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-mono">
                  AI-GENERATED INTERPRETATION
                </span>
                <p className="text-slate-400">Structured extraction and follow-up prompts are simulated.</p>
              </div>
              <div className="space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-mono">
                  CLINICIAN-REVIEWED
                </span>
                <p className="text-slate-400">Only entered by a designated medical reviewer.</p>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <aside className="lg:col-span-3 bg-[#081b2d]/80 border border-sky-500/20 p-5 rounded-3xl shadow-xl backdrop-blur-md flex flex-col">
                <div className="flex items-center justify-between mb-3 border-b border-sky-500/20 pb-3">
                  <div>
                    <p className="text-[11px] font-mono text-sky-400 uppercase">01 / Active Intake</p>
                    <h2 className="font-bold text-sm text-white">Conversations</h2>
                  </div>
                  <span className="text-xs font-mono text-sky-300 bg-sky-950 px-2.5 py-0.5 rounded-full border border-sky-500/30">03</span>
                </div>

                <div className="flex gap-1 mb-3 p-1 bg-sky-950/60 rounded-full text-xs font-mono border border-sky-500/20">
                  {(['all', 'open', 'review'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`flex-1 py-1 px-2 rounded-full uppercase transition ${
                        filter === f
                          ? 'bg-sky-400 text-black font-bold shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto max-h-[400px]">
                  {filteredConversations.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveThread(c)}
                      className={`w-full text-left p-3.5 rounded-2xl transition border ${
                        activeThread.id === c.id
                          ? 'bg-sky-500/20 border-sky-400/50 shadow-[0_0_10px_rgba(56,189,248,0.15)]'
                          : 'bg-[#040d16]/60 border-sky-500/10 hover:bg-sky-950/40'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-sky-400">{c.id}</div>
                      <div className="font-bold text-xs text-white truncate mt-0.5">{c.title}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-1">{c.astronaut}</div>
                    </button>
                  ))}
                </div>
              </aside>

              <section className="lg:col-span-6 bg-[#081b2d]/80 border border-sky-500/20 p-5 rounded-3xl shadow-xl backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="border-b border-sky-500/20 pb-3.5 mb-4 flex flex-wrap items-center justify-between gap-2 font-mono">
                    <div>
                      <p className="text-[11px] text-sky-400">{activeThread.id}</p>
                      <h2 className="text-base font-bold text-white font-sans">{activeThread.title}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">{activeThread.astronaut} · {activeThread.date}</p>
                    </div>
                    <span className="px-3 py-1 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                      {activeThread.status}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 mb-4">
                    {activeThread.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border ${
                          msg.type === 'reported'
                            ? 'bg-[#040d16]/60 border-sky-500/20 text-slate-200'
                            : 'bg-sky-500/10 border-sky-400/30 text-sky-100'
                        }`}
                      >
                        <div className="text-[11px] font-mono text-sky-400 mb-1">{msg.sender}</div>
                        <p className="text-xs leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendMessage} className="pt-3.5 border-t border-sky-500/20">
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    New astronaut report <span className="text-[11px] text-slate-500">· Natural-language entry</span>
                  </label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={2}
                    maxLength={1200}
                    placeholder="Describe what you noticed, in your own words..."
                    className="w-full bg-[#040d16] border border-sky-500/30 p-3 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition font-mono"
                    required
                  />
                  <div className="flex items-center justify-between mt-2.5 font-mono">
                    <span className="text-[11px] text-slate-500">{newMessage.length} / 1200</span>
                    <button
                      type="submit"
                      className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-full text-xs font-bold shadow-sm transition active:scale-95"
                    >
                      <Send size={13} />
                      <span>Add Report</span>
                    </button>
                  </div>
                </form>
              </section>

              <aside className="lg:col-span-3 bg-[#081b2d]/80 border border-sky-500/20 p-5 rounded-3xl shadow-xl backdrop-blur-md space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between border-b border-sky-500/20 pb-3 mb-2.5 font-mono">
                    <div>
                      <p className="text-[11px] text-sky-400 uppercase">02 / Review Workspace</p>
                      <h2 className="font-bold text-sm text-white font-sans">Structured Extraction</h2>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 bg-sky-950 text-sky-300 rounded-full border border-sky-500/30">
                      DEMO AI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">AI-generated interpretation only. Not a clinical diagnosis.</p>
                </div>

                <div className="bg-[#040d16]/60 border border-sky-500/20 p-3.5 rounded-2xl space-y-1.5 font-mono">
                  <span className="block text-[11px] text-slate-400">Extraction confidence</span>
                  <div className="flex items-center justify-between font-bold text-base text-white">
                    <span>{Math.round(parseFloat(activeThread.confidence) * 100)}%</span>
                    <span className="text-xs text-sky-400">{activeThread.confidence}</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-sky-500/20">
                    <div
                      className="bg-sky-600 h-full rounded-full"
                      style={{ width: `${parseFloat(activeThread.confidence) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-amber-400 pt-1">{activeThread.uncertainty}</p>
                </div>

                <div className="bg-[#040d16]/60 border border-sky-500/20 p-3.5 rounded-2xl space-y-1">
                  <span className="block text-[11px] font-mono font-bold text-sky-300">Suggested follow-up question</span>
                  <p className="text-slate-300 leading-relaxed">{activeThread.followUp}</p>
                </div>

                <div className="border-t border-sky-500/20 pt-3.5 space-y-2.5 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] text-slate-300">Clinician conclusion</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        reviewState === 'REVIEWED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {reviewState}
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    value={clinicianNote}
                    onChange={(e) => setClinicianNote(e.target.value)}
                    placeholder="Add a review note..."
                    className="w-full bg-[#040d16] border border-sky-500/30 p-2.5 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition"
                  />

                  <button
                    onClick={handleMarkReviewed}
                    type="button"
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-full text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 size={14} />
                    <span>Mark Reviewed</span>
                  </button>
                </div>
              </aside>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}