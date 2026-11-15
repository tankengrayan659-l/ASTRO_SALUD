import { useState } from 'react';
import { 
  Menu, Bell, Send, Home, User, Activity, 
  Cpu, FileText, MessageSquare, ShieldAlert, Layers 
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
    <div className="min-h-screen bg-[#06111c] text-[#e8f4f5] font-sans flex flex-col">
      <div className="flex flex-1 mission-shell overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#091b29] border-r border-[#1c5260] transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 flex flex-col`}>
          <div className="p-4 flex items-center justify-between border-b border-[#1c5260]">
            <a href="index.html" className="flex items-center space-x-2">
              <span className="w-8 h-8 flex items-center justify-center border border-[#45d9e8] text-[#45d9e8] font-bold">A</span>
              <span className="font-bold tracking-wider">ASTRA</span>
            </a>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-[#8daab5]">✕</button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-sm">
            <div className="text-[10px] font-mono text-[#45d9e8] uppercase tracking-wider mb-2">Crew and telemetry</div>
            <a href="dashboard.html#mission-overview" className="flex items-center space-x-3 p-2 rounded hover:bg-[#123041] text-[#8daab5] hover:text-white"><Home size={16} /><span>Mission Overview</span></a>
            <a href="astronaut-profile.html" className="flex items-center space-x-3 p-2 rounded hover:bg-[#123041] text-[#8daab5] hover:text-white"><User size={16} /><span>Astronaut Profiles</span></a>
            <a href="dashboard.html#whole-body" className="flex items-center space-x-3 p-2 rounded hover:bg-[#123041] text-[#8daab5] hover:text-white"><Activity size={16} /><span>Whole-Body Monitoring</span></a>
            <a href="dashboard.html#telemetry" className="flex items-center space-x-3 p-2 rounded hover:bg-[#123041] text-[#8daab5] hover:text-white"><Cpu size={16} /><span>Physiological Telemetry</span></a>
            <a href="device-network.html" className="flex items-center space-x-3 p-2 rounded hover:bg-[#123041] text-[#8daab5] hover:text-white"><Layers size={16} /><span>Device Network</span></a>

            <div className="text-[10px] font-mono text-[#45d9e8] uppercase tracking-wider mt-4 mb-2">Medical intelligence</div>
            <a href="health-complaints.html" className="flex items-center space-x-3 p-2 rounded hover:bg-[#123041] text-[#8daab5] hover:text-white"><FileText size={16} /><span>Health Complaints</span></a>
            <a href="ai-health-assistant.html" className="flex items-center space-x-3 p-2 rounded bg-[#123041] text-[#45d9e8] border border-[#1c5260]"><MessageSquare size={16} /><span>AI Health Assistant</span></a>
            <a href="medical-alerts.html" className="flex items-center space-x-3 p-2 rounded hover:bg-[#123041] text-[#8daab5] hover:text-white"><ShieldAlert size={16} /><span>Medical Alerts</span></a>
          </nav>
          
          <div className="p-4 border-t border-[#1c5260]">
            <span className="inline-block px-2 py-1 bg-[#183746] border border-[#45d9e8] text-[10px] font-mono text-[#45d9e8] rounded">SIMULATED ASSISTANT</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* Operational Header Bar */}
          <header className="bg-[#091b29] border-b border-[#1c5260] p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden text-[#45d9e8]"><Menu size={20} /></button>
              <a href="index.html" className="flex items-center space-x-2 md:hidden">
                <span className="w-6 h-6 flex items-center justify-center border border-[#45d9e8] text-[#45d9e8] font-bold text-xs">A</span>
                <span className="font-bold">ASTRA</span>
              </a>
              <div className="hidden sm:block">
                <span className="block text-[10px] font-mono text-[#8daab5]">Mission ID</span>
                <strong className="text-xs font-mono">ASTRA-117 // SIM</strong>
              </div>
              <div className="hidden sm:block">
                <span className="block text-[10px] font-mono text-[#8daab5]">Selected astronaut</span>
                <strong className="text-xs font-mono">LT. M. RIVERA // SIM</strong>
              </div>
            </div>

            <div className="flex items-center space-x-4 ml-auto">
              <div className="relative">
                <button onClick={() => setNotificationOpen(!notificationOpen)} className="p-2 relative bg-[#06111c] border border-[#1c5260] rounded hover:border-[#45d9e8]">
                  <Bell size={18} className="text-[#45d9e8]" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">3</span>
                </button>
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#091b29] border border-[#1c5260] rounded shadow-lg p-3 z-50 text-xs">
                    <div className="flex justify-between font-bold mb-2 border-b border-[#1c5260] pb-1">
                      <span>Alert queue</span>
                      <span className="text-[#45d9e8]">SIMULATED</span>
                    </div>
                    <p className="py-1 text-[#8daab5]">⚠️ Hydration drift | review pending</p>
                    <p className="py-1 text-[#8daab5]">🚨 Vestibular cluster | elevated</p>
                    <p className="py-1 text-[#8daab5]">📡 Oximeter link | offline</p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-[#183746] border border-[#45d9e8] flex items-center justify-center font-bold text-xs text-[#45d9e8]">MO</div>
                <div>
                  <span className="block text-[10px] font-mono text-[#8daab5]">Medical officer</span>
                  <strong className="text-xs font-mono">DR. K. NIELSEN</strong>
                </div>
              </div>
            </div>
          </header>

          {/* Core Assistant Body */}
          <main className="p-4 md:p-6 flex-1 space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-[#45d9e8] uppercase">Crew dialogue / clinical review</p>
                <h1 className="text-2xl font-bold">AI Health Assistant</h1>
                <p className="text-sm text-[#8daab5] mt-1">A structured conversation workspace for symptom reporting, follow-up and medical-team review.</p>
              </div>
              <span className="px-3 py-1 bg-[#183746] border border-[#45d9e8] text-xs font-mono text-[#45d9e8] rounded self-start">
                SIMULATED ASSISTANT | NO LIVE CLINICAL AI
              </span>
            </header>

            {/* Provenance Key */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-[#091b29] border border-[#1c5260] p-4 rounded">
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded font-mono">ASTRONAUT-REPORTED</span>
                <p className="text-[#8daab5]">Original crew message. Preserved exactly as submitted.</p>
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded font-mono">AI-GENERATED INTERPRETATION</span>
                <p className="text-[#8daab5]">Structured extraction and follow-up prompts are simulated.</p>
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-mono">CLINICIAN-REVIEWED</span>
                <p className="text-[#8daab5]">Only entered by a designated medical reviewer.</p>
              </div>
            </section>

            {/* Three Column Assistant Workspace Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Column 1: Conversations Queue */}
              <aside className="lg:col-span-3 bg-[#091b29] border border-[#1c5260] p-4 rounded flex flex-col">
                <div className="flex items-center justify-between mb-3 border-b border-[#1c5260] pb-2">
                  <div>
                    <p className="text-[10px] font-mono text-[#45d9e8] uppercase">01 / Active intake</p>
                    <h2 className="font-bold text-sm">Conversations</h2>
                  </div>
                  <span className="text-xs font-mono text-[#45d9e8] bg-[#06111c] px-2 py-0.5 rounded border border-[#1c5260]">03</span>
                </div>

                <div className="flex gap-1 mb-3 text-xs font-mono">
                  {(['all', 'open', 'review'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`flex-1 py-1 px-2 rounded border uppercase transition ${filter === f ? 'bg-[#123041] border-[#45d9e8] text-[#45d9e8]' : 'bg-[#06111c] border-[#1c5260] text-[#8daab5]'}`}
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
                      className={`w-full text-left p-3 rounded border transition ${activeThread.id === c.id ? 'bg-[#123041] border-[#45d9e8]' : 'bg-[#06111c] border-[#1c5260] hover:bg-[#0b2231]'}`}
                    >
                      <div className="text-[10px] font-mono text-[#45d9e8]">{c.id}</div>
                      <div className="font-bold text-xs truncate mt-0.5">{c.title}</div>
                      <div className="text-[10px] text-[#8daab5] mt-1">{c.astronaut}</div>
                    </button>
                  ))}
                </div>
              </aside>

              {/* Column 2: Conversation Thread Workspace */}
              <section className="lg:col-span-6 bg-[#091b29] border border-[#1c5260] p-4 rounded flex flex-col justify-between">
                <div>
                  <div className="border-b border-[#1c5260] pb-3 mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-mono text-[#45d9e8]">{activeThread.id}</p>
                      <h2 className="text-base font-bold">{activeThread.title}</h2>
                      <p className="text-xs text-[#8daab5]">{activeThread.astronaut} | {activeThread.date} | SIMULATED THREAD</p>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
                      {activeThread.status}
                    </span>
                  </div>

                  {/* Message Stream */}
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 mb-4">
                    {activeThread.messages.map((msg, idx) => (
                      <div key={idx} className={`p-3 rounded border ${msg.type === 'reported' ? 'bg-[#0b2231] border-[#1c5260]' : 'bg-[#06111c] border-cyan-500/30'}`}>
                        <div className="text-[10px] font-mono text-[#45d9e8] mb-1">{msg.sender}</div>
                        <p className="text-xs leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Compose Form */}
                <form onSubmit={handleSendMessage} className="pt-3 border-t border-[#1c5260]">
                  <label className="block text-xs text-[#8daab5] mb-1">New astronaut report <span className="text-[10px] text-gray-500">| Natural-language entry</span></label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={2}
                    maxLength={1200}
                    placeholder="Describe what you noticed, in your own words..."
                    className="w-full bg-[#06111c] border border-[#1c5260] p-2.5 rounded text-xs text-white focus:outline-none focus:border-[#45d9e8]"
                    required
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-mono text-[#8daab5]">{newMessage.length} / 1200</span>
                    <button type="submit" className="flex items-center space-x-1.5 bg-[#45d9e8]/10 border border-[#45d9e8] text-[#45d9e8] px-3 py-1.5 rounded text-xs font-bold hover:bg-[#45d9e8]/20 transition">
                      <Send size={12} />
                      <span>ADD REPORT</span>
                    </button>
                  </div>
                </form>
              </section>

              {/* Column 3: Extraction & Review Workspace */}
              <aside className="lg:col-span-3 bg-[#091b29] border border-[#1c5260] p-4 rounded space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between border-b border-[#1c5260] pb-2 mb-2">
                    <div>
                      <p className="text-[10px] font-mono text-[#45d9e8] uppercase">02 / Review workspace</p>
                      <h2 className="font-bold">Structured extraction</h2>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#183746] text-[#45d9e8] border border-[#45d9e8] rounded">DEMO AI</span>
                  </div>
                  <p className="text-[11px] text-[#8daab5]">AI-generated interpretation only. Not a clinical diagnosis.</p>
                </div>

                <div className="bg-[#06111c] border border-[#1c5260] p-2.5 rounded space-y-1">
                  <span className="block text-[10px] font-mono text-[#8daab5]">Extraction confidence</span>
                  <div className="flex items-center justify-between font-mono font-bold text-sm text-[#45d9e8]">
                    <span>{activeThread.confidence}</span>
                  </div>
                  <div className="w-full bg-gray-800 h-1 rounded overflow-hidden">
                    <div className="bg-[#45d9e8] h-full" style={{ width: `${parseFloat(activeThread.confidence) * 100}%` }}></div>
                  </div>
                  <p className="text-[10px] text-amber-300 mt-1">{activeThread.uncertainty}</p>
                </div>

                <div className="bg-[#06111c] border border-[#1c5260] p-2.5 rounded space-y-1">
                  <span className="block text-[10px] font-mono text-[#45d9e8]">Suggested follow-up question</span>
                  <p className="text-[#8daab5]">{activeThread.followUp}</p>
                </div>

                <div className="border-t border-[#1c5260] pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#8daab5]">Clinician-reviewed conclusion</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${reviewState === 'REVIEWED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                      {reviewState}
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    value={clinicianNote}
                    onChange={(e) => setClinicianNote(e.target.value)}
                    placeholder="Add a review note..."
                    className="w-full bg-[#06111c] border border-[#1c5260] p-2 rounded text-xs text-white focus:outline-none focus:border-[#45d9e8]"
                  />

                  <button
                    onClick={handleMarkReviewed}
                    type="button"
                    className="w-full py-1.5 bg-emerald-500/10 border border-emerald-500 text-emerald-400 font-bold rounded text-[10px] hover:bg-emerald-500/20 transition"
                  >
                    MARK REVIEWED | DEMO
                  </button>
                </div>
              </aside>

            </div>
          </main>

          {/* Footer */}
          <footer className="bg-[#091b29] border-t border-[#1c5260] p-4 text-center text-[10px] font-mono text-[#8daab5] flex justify-between px-6">
            <span>ASTRA CLINICAL CONVERSATION WORKSPACE</span>
            <span>SIMULATED TRAINING DATA | HUMAN REVIEW REQUIRED</span>
          </footer>
        </div>
      </div>
    </div>
  );
}