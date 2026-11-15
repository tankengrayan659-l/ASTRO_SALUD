// components/Sidebar.tsx
import { Home, User, Activity, Cpu, Layers, FileText, MessageSquare, ShieldAlert } from 'lucide-react';

interface SidebarProps {
  activePage?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ activePage, isOpen, setIsOpen }: SidebarProps) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/70 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 flex flex-col justify-between text-sm shadow-xs`}>
      <div>
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <a href="index.html" className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Activity size={18} />
            </span>
            <span className="font-bold text-lg tracking-tight text-slate-900">ASTRA</span>
          </a>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-slate-700">✕</button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1 text-slate-600">
          <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Crew &amp; Telemetry</div>
          
          <a href="dashboard.html" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activePage === 'dashboard' ? 'bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-200' : 'hover:bg-slate-50 hover:text-slate-900'}`}>
            <Home size={17} className={activePage === 'dashboard' ? 'text-emerald-700' : 'text-slate-400'} />
            <span>Mission Overview</span>
          </a>
          
          <a href="astronaut-profile.html" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activePage === 'profile' ? 'bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-200' : 'hover:bg-slate-50 hover:text-slate-900'}`}>
            <User size={17} className={activePage === 'profile' ? 'text-emerald-700' : 'text-slate-400'} />
            <span>Astronaut Profiles</span>
          </a>
          
          <a href="dashboard.html#whole-body" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition">
            <Activity size={17} className="text-slate-400" />
            <span>Whole-Body Monitoring</span>
          </a>
          
          <a href="dashboard.html#telemetry" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition">
            <Cpu size={17} className="text-slate-400" />
            <span>Physiological Telemetry</span>
          </a>
          
          <a href="device-network.html" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activePage === 'network' ? 'bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-200' : 'hover:bg-slate-50 hover:text-slate-900'}`}>
            <Layers size={17} className={activePage === 'network' ? 'text-emerald-700' : 'text-slate-400'} />
            <span>Device Network</span>
          </a>

          <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider pt-6 mb-2">Medical Intelligence</div>
          
          <a href="health-complaints.html" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activePage === 'complaints' ? 'bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-200' : 'hover:bg-slate-50 hover:text-slate-900'}`}>
            <FileText size={17} className={activePage === 'complaints' ? 'text-emerald-700' : 'text-slate-400'} />
            <span>Health Complaints</span>
          </a>
          
          <a href="ai-health-assistant.html" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activePage === 'assistant' ? 'bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-200' : 'hover:bg-slate-50 hover:text-slate-900'}`}>
            <MessageSquare size={17} className={activePage === 'assistant' ? 'text-emerald-700' : 'text-slate-400'} />
            <span>AI Health Assistant</span>
          </a>
          
          <a href="medical-alerts.html" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${activePage === 'alerts' ? 'bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-200' : 'hover:bg-slate-50 hover:text-slate-900'}`}>
            <ShieldAlert size={17} className={activePage === 'alerts' ? 'text-emerald-700' : 'text-slate-400'} />
            <span>Medical Alerts</span>
          </a>
        </nav>
      </div>
      
      {/* Telemetry promo card */}
      <div className="p-4 border-t border-slate-100">
        <div className="rounded-2xl bg-sky-50 p-3.5 border border-sky-200 shadow-2xs">
          <p className="text-xs font-bold text-slate-900">ASTRA Telemetry</p>
          <p className="text-[10px] font-semibold text-sky-800 mt-0.5">Simulated Data Active</p>
          <p className="text-[11px] text-slate-600 mt-1 leading-snug">
            All biometrics sync with orbital arrays in real time.
          </p>
        </div>
      </div>
    </aside>
  );
}