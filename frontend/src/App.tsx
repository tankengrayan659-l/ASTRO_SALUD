import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  BrainCircuit,
  Cpu,
  HeartPulse,
  Layers3,
  Menu,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  UserRound,
} from 'lucide-react'
import FullBodyDiagnostics from './components/diagnostics/FullBodyDiagnostics'

const navSections = [
  {
    label: 'Crew and telemetry',
    items: [
      { name: 'Mission Overview', icon: Activity, active: true },
      { name: 'Astronaut Profiles', icon: UserRound },
      { name: 'Full Body Diagnostics', icon: HeartPulse },
      { name: 'Physiological Telemetry', icon: Cpu },
      { name: 'Device Network', icon: Layers3 },
    ],
  },
  {
    label: 'Medical intelligence',
    items: [
      { name: 'Health Complaints', icon: Stethoscope },
      { name: 'AI Health Assistant', icon: MessageSquareText },
      { name: 'Medical Alerts', icon: AlertTriangle },
      { name: 'Health Correlation', icon: BrainCircuit },
      { name: 'Early Warning', icon: ShieldCheck },
    ],
  },
]

const statCards = [
  { label: 'Core vitals', value: 'Nominal', delta: '+2.4%', tone: 'cyan' },
  { label: 'Hydration index', value: '91%', delta: '+6.8%', tone: 'emerald' },
  { label: 'Stress variance', value: 'Low', delta: '-11.2%', tone: 'amber' },
  { label: 'AI anomaly score', value: '0.07', delta: '-0.04', tone: 'violet' },
]

const telemetry = [
  { label: 'Heart rate', value: '72 bpm', trend: '+3.2%' },
  { label: 'SpO₂', value: '99.2%', trend: '+0.8%' },
  { label: 'Core temp', value: '36.8°C', trend: '+0.3°' },
  { label: 'Sleep rhythm', value: '8.4h', trend: '+1.1h' },
]

const alerts = [
  { title: 'Hydration drift', detail: 'Crew intake trending 9% below nominal', severity: 'Moderate' },
  { title: 'Vestibular cluster', detail: 'Movement instability elevated during EVA prep', severity: 'Elevated' },
  { title: 'Telemetry sync', detail: 'One wearable dropped connection for 14s', severity: 'Watch' },
]

const crew = [
  { name: 'Lt. M. Rivera', role: 'Primary operator', status: 'Stable', accent: 'bg-cyan-500/15 text-cyan-200 ring-cyan-500/30' },
  { name: 'Dr. K. Nielsen', role: 'Flight physician', status: 'Reviewing', accent: 'bg-violet-500/15 text-violet-200 ring-violet-500/30' },
  { name: 'M. Osei', role: 'Duty engineer', status: 'Nominal', accent: 'bg-emerald-500/15 text-emerald-200 ring-emerald-500/30' },
]

function App() {
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false)

  if (diagnosticsOpen) {
    return <FullBodyDiagnostics onBack={() => setDiagnosticsOpen(false)} />
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100">
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-700/80 bg-[#091b29]/95 p-4 lg:flex lg:flex-col">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/60 bg-cyan-400/10 font-mono text-sm font-bold text-cyan-300">
                A
              </span>
              <span className="font-mono text-sm tracking-[0.28em] text-slate-200">ASTRA</span>
            </div>
            <button className="rounded-md border border-slate-600 p-2 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-200">
              <Menu className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-6 space-y-6">
            {navSections.map((section) => (
              <div key={section.label}>
                <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-cyan-300/90">
                  {section.label}
                </p>
                <div className="space-y-1">
                  {section.items.map(({ name, icon: Icon, active }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setDiagnosticsOpen(name === 'Full Body Diagnostics')}
                      className={[
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition',
                        name === 'Full Body Diagnostics'
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                          : active
                          ? 'bg-slate-800/80 text-cyan-200 ring-1 ring-cyan-400/30'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100',
                      ].join(' ')}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-cyan-300">Simulation</p>
            <p className="mt-2 text-sm text-slate-200">Feed nominal · monitoring active</p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-slate-700/80 bg-[#091b29]/85 px-4 py-4 backdrop-blur-sm lg:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <button className="rounded-lg border border-slate-600 p-2 text-cyan-300 lg:hidden">
                  <Menu className="h-4 w-4" />
                </button>
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Mission ID</span>
                  <span className="font-mono text-sm text-slate-100">ASTRA-117 // SIM</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <div className="relative">
                  <button className="relative rounded-xl border border-slate-700 bg-slate-900/70 p-2.5 text-cyan-300 transition hover:border-cyan-400 hover:text-cyan-200">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                      3
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400 bg-cyan-400/10 text-xs font-bold text-cyan-200">
                    MO
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">Medical officer</p>
                    <p className="font-mono text-xs text-slate-100">DR. K. NIELSEN</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="space-y-6 p-4 lg:p-6">
            <section className="overflow-hidden rounded-[28px] border border-slate-700/80 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_30%),linear-gradient(135deg,#071826_0%,#0b2134_55%,#06131d_100%)] p-6 shadow-[0_30px_60px_rgba(2,6,23,0.5)]">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-300">Mission control dashboard</p>
                  <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
                    Advanced health intelligence for human spaceflight
                  </h1>
                </div>

                <div className="flex items-center gap-3 self-start rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-200">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Demo feed nominal
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map(({ label, value, delta, tone }) => (
                  <div key={label} className="rounded-2xl border border-slate-700/80 bg-slate-950/30 p-4">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
                      <span>{label}</span>
                      <span className={[
                        'rounded-full px-2 py-1 font-medium',
                        tone === 'cyan' && 'bg-cyan-500/10 text-cyan-200',
                        tone === 'emerald' && 'bg-emerald-500/10 text-emerald-200',
                        tone === 'amber' && 'bg-amber-500/10 text-amber-200',
                        tone === 'violet' && 'bg-violet-500/10 text-violet-200',
                      ].join(' ')}>{delta}</span>
                    </div>
                    <p className="mt-5 text-3xl font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
              <div className="rounded-[28px] border border-slate-700/80 bg-slate-950/40 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Patient telemetry</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Vitals trend</h2>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-200">
                    Last 72h <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-700/80 bg-[linear-gradient(180deg,rgba(12,25,38,0.95),rgba(9,19,30,0.9))] p-4">
                  <div className="flex h-64 items-end gap-2">
                    {[42, 48, 52, 60, 56, 78, 65, 82, 76, 88, 94, 72].map((height, index) => (
                      <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-cyan-600 via-cyan-400 to-sky-200/80" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-6 gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-700/80 bg-slate-950/40 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Monitoring</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">System health</h2>
                  </div>
                  <Sparkles className="h-5 w-5 text-cyan-300" />
                </div>

                <div className="mt-5 space-y-3">
                  {telemetry.map(({ label, value, trend }) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-700/80 bg-slate-900/70 px-3 py-3">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">{label}</p>
                        <p className="mt-1 text-lg font-semibold text-white">{value}</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-200">{trend}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[28px] border border-slate-700/80 bg-slate-950/40 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Clinical signals</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Active alerts</h2>
                  </div>
                  <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-200">
                    Review queue
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {alerts.map(({ title, detail, severity }) => (
                    <div key={title} className="flex items-start gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/70 p-3">
                      <div className="mt-1 rounded-full bg-amber-500/15 p-2 text-amber-300">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-white">{title}</p>
                          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-amber-200">
                            {severity}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-300">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-700/80 bg-slate-950/40 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Operations</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Crew status</h2>
                  </div>
                  <TrendingUp className="h-5 w-5 text-cyan-300" />
                </div>

                <div className="mt-5 space-y-3">
                  {crew.map(({ name, role, status, accent }) => (
                    <div key={name} className="flex items-center justify-between rounded-2xl border border-slate-700/80 bg-slate-900/70 p-3">
                      <div>
                        <p className="font-medium text-white">{name}</p>
                        <p className="text-sm text-slate-400">{role}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] ring-1 ${accent}`}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
