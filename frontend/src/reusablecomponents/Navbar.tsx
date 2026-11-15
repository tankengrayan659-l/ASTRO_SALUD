// components/Navbar.tsx
import { useState } from 'react';
import { Menu, Bell } from 'lucide-react';

interface NavbarProps {
  onOpenSidebar: () => void;
}

export default function Navbar({ onOpenSidebar }: NavbarProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <header className="bg-[#091b29] border-b border-[#1c5260] p-4 flex flex-wrap items-center justify-between gap-4 text-[#e8f4f5]">
      <div className="flex items-center space-x-4">
        <button onClick={onOpenSidebar} className="md:hidden text-[#45d9e8]"><Menu size={20} /></button>
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
  );
}