// components/Navbar.tsx
import { useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';

interface NavbarProps {
  onOpenSidebar: () => void;
}

export default function Navbar({ onOpenSidebar }: NavbarProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F5F7F6]/90 backdrop-blur-md border-b border-slate-200/70 px-4 py-3.5 sm:px-6">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        
        {/* Left Mobile Menu & Search Pill */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenSidebar} 
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs"
          >
            <Menu size={18} />
          </button>

          <a href="index.html" className="flex items-center space-x-2 md:hidden">
            <span className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">A</span>
            <span className="font-bold text-slate-900">ASTRA</span>
          </a>

          <div className="hidden sm:flex items-center gap-2.5 rounded-full bg-white px-4 py-2 w-72 border border-slate-200/70 shadow-2xs">
            <Search size={15} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search mission telemetry or patient..."
              className="w-full bg-transparent text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Mission Status Badges & Notifications */}
        <div className="flex items-center space-x-3 ml-auto">
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-white border border-slate-200/70 px-3.5 py-1.5 text-xs text-slate-600 shadow-2xs">
            <span className="text-slate-400">Mission ID:</span>
            <strong className="font-semibold text-slate-800">ASTRA-117</strong>
          </div>

          <div className="relative">
            <button 
              onClick={() => setNotificationOpen(!notificationOpen)} 
              className="p-2.5 relative bg-white border border-slate-200/70 rounded-full hover:bg-slate-50 shadow-2xs transition"
            >
              <Bell size={16} className="text-slate-600" />
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-2xs">3</span>
            </button>
            
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-68 bg-white border border-slate-200 rounded-2xl shadow-lg p-3.5 z-50 text-xs">
                <div className="flex justify-between font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">
                  <span>Alert Queue</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">SIMULATED</span>
                </div>
                <p className="py-1.5 text-slate-600">⚠️ Hydration drift | review pending</p>
                <p className="py-1.5 text-slate-600">🚨 Vestibular cluster | elevated</p>
                <p className="py-1.5 text-slate-600">📡 Oximeter link | offline</p>
              </div>
            )}
          </div>

          {/* Medical Officer Profile Badge */}
          <div className="flex items-center space-x-2.5 bg-white border border-slate-200/70 rounded-full py-1.5 px-3 shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              KN
            </div>
            <div className="hidden sm:block text-left pr-1">
              <span className="block text-[10px] text-slate-400 leading-none">Medical Officer</span>
              <strong className="text-xs font-bold text-slate-800 leading-tight">Dr. K. Nielsen</strong>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}