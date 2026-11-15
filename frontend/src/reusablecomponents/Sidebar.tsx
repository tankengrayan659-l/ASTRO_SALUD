import { Home, User, Activity, Cpu, Layers, FileText, MessageSquare, ShieldAlert } from 'lucide-react';

interface SidebarProps {
  activePage?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ activePage, isOpen, setIsOpen }: SidebarProps) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#091b29] border-r border-[#1c5260] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 flex flex-col text-sm`}>
      <div className="p-4 flex items-center justify-between border-b border-[#1c5260]">
        <a href="index.html" className="flex items-center space-x-2">
          <span className="w-8 h-8 flex items-center justify-center border border-[#45d9e8] text-[#45d9e8] font-bold">A</span>
          <span className="font-bold tracking-wider text-white">ASTRA</span>
        </a>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-[#8daab5]">✕</button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-[#8daab5]">
        <div className="text-[10px] font-mono text-[#45d9e8] uppercase tracking-wider mb-2">Crew and telemetry</div>
        <a href="dashboard.html" className={`flex items-center space-x-3 p-2 rounded hover:bg-[#123041] hover:text-white ${activePage === 'dashboard' ? 'bg-[#123041] text-[#45d9e8]' : ''}`}>
          <Home size={16} /><span>Mission Overview</span>
        </a>
        <a href="astronaut-profile.html" className={`flex items-center space-x-3 p-2 rounded hover:bg-[#123041] hover:text-white ${activePage === 'profile' ? 'bg-[#123041] text-[#45d9e8]' : ''}`}>
          <User size={16} /><span>Astronaut Profiles</span>
        </a>
        <a href="dashboard.html#whole-body" className="flex items-center space-x-3 p-2 rounded hover:bg-[#123041] hover:text-white">
          <Activity size={16} /><span>Whole-Body Monitoring</span>
        </a>
        <a href="dashboard.html#telemetry" className="flex items-center space-x-3 p-2 rounded hover:bg-[#123041] hover:text-white">
          <Cpu size={16} /><span>Physiological Telemetry</span>
        </a>
        <a href="device-network.html" className={`flex items-center space-x-3 p-2 rounded hover:bg-[#123041] hover:text-white ${activePage === 'network' ? 'bg-[#123041] text-[#45d9e8]' : ''}`}>
          <Layers size={16} /><span>Device Network</span>
        </a>

        <div className="text-[10px] font-mono text-[#45d9e8] uppercase tracking-wider mt-4 mb-2">Medical intelligence</div>
        <a href="health-complaints.html" className={`flex items-center space-x-3 p-2 rounded hover:bg-[#123041] hover:text-white ${activePage === 'complaints' ? 'bg-[#123041] text-[#45d9e8]' : ''}`}>
          <FileText size={16} /><span>Health Complaints</span>
        </a>
        <a href="ai-health-assistant.html" className={`flex items-center space-x-3 p-2 rounded hover:bg-[#123041] hover:text-white ${activePage === 'assistant' ? 'bg-[#123041] text-[#45d9e8]' : ''}`}>
          <MessageSquare size={16} /><span>AI Health Assistant</span>
        </a>
        <a href="medical-alerts.html" className={`flex items-center space-x-3 p-2 rounded hover:bg-[#123041] hover:text-white ${activePage === 'alerts' ? 'bg-[#123041] text-[#45d9e8]' : ''}`}>
          <ShieldAlert size={16} /><span>Medical Alerts</span>
        </a>
      </nav>
      
      <div className="p-4 border-t border-[#1c5260]">
        <span className="inline-block px-2 py-1 bg-[#183746] border border-[#45d9e8] text-[10px] font-mono text-[#45d9e8] rounded">SIMULATED DATA</span>
      </div>
    </aside>
  );
}