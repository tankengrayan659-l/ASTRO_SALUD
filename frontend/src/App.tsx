import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Activity,
  AlertTriangle,
  Bell,
  BrainCircuit,
  CheckCheck,
  Cpu,
  HeartPulse,
  Layers3,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  UserRound,
  X,
} from 'lucide-react'
import FullBodyDiagnostics from './components/diagnostics/FullBodyDiagnostics'
import AstronautProfiles from './components/AstronautProfiles'
import MedicalAlerts from './components/MedicalAlerts'
import LandingPage from './components/LandingPage'
import MedicalInsights, { type InsightView } from './components/MedicalInsights'
import CrewCare, { type CrewCareView } from './components/CrewCare'
import VitalsTrendChart from './components/VitalsTrendChart'
import useSimulatedTelemetry from './hooks/useSimulatedTelemetry'

type DashboardView =
  | 'Mission Overview'
  | 'Astronaut Profiles'
  | 'Full Body Diagnostics'
  | 'Physiological Telemetry'
  | 'Device Network'
  | 'Health Complaints'
  | 'Medical Alerts'
  | 'Health Correlation'
  | 'Early Warning'
  | 'Mental Health'
  | 'Infection Control'

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
      { name: 'Medical Alerts', icon: AlertTriangle },
      { name: 'Health Correlation', icon: BrainCircuit },
      { name: 'Early Warning', icon: ShieldCheck },
      { name: 'Mental Health', icon: HeartPulse },
      { name: 'Infection Control', icon: ShieldCheck },
    ],
  },
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
  const liveVitals = useSimulatedTelemetry()
  const [dashboardOpen, setDashboardOpen] = useState(false)
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false)
  const [activeView, setActiveView] = useState<DashboardView>('Mission Overview')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notificationsRead, setNotificationsRead] = useState(false)
  const statCards = [
    { label: 'Heart rate', value: `${liveVitals.heartRate} bpm`, delta: 'SIM', tone: 'cyan' },
    { label: 'Hydration index', value: `${liveVitals.hydration}%`, delta: 'SIM', tone: 'emerald' },
    { label: 'Activity level', value: `${liveVitals.activity}%`, delta: 'SIM', tone: 'amber' },
    { label: 'Neural sync', value: `${liveVitals.neuralSync}%`, delta: 'SIM', tone: 'violet' },
  ]
  const telemetry = [
    { label: 'Heart rate', value: `${liveVitals.heartRate} bpm`, trend: 'SIM' },
    { label: 'SpO₂', value: `${liveVitals.spo2.toFixed(1)}%`, trend: 'SIM' },
    { label: 'Core temp', value: `${liveVitals.temperature.toFixed(1)}°C`, trend: 'SIM' },
    { label: 'Hydration', value: `${liveVitals.hydration}%`, trend: 'SIM' },
  ]

  if (diagnosticsOpen) {
    return <FullBodyDiagnostics liveVitals={liveVitals} onBack={() => {
      setDiagnosticsOpen(false)
      setActiveView('Mission Overview')
    }} />
  }

  if (!dashboardOpen) {
    return <LandingPage onEnterDashboard={() => setDashboardOpen(true)} />
  }

  return (
    <div className="astra-dashboard min-h-screen bg-[#07111f] text-slate-100">
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-700/80 bg-[#091b29]/95 p-4 lg:flex lg:flex-col">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/60 bg-cyan-400/10 text-cyan-300">
                <Activity className="h-4 w-4" />
              </span>
              <span className="font-mono text-xs font-semibold leading-relaxed tracking-[0.12em] text-slate-200">
                ASTRO-SALUD,<br />FOR GOOD LIFE
              </span>
            </div>
          </div>

          <nav className="mt-6 space-y-6">
            {navSections.map((section) => (
              <div key={section.label}>
                <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-cyan-300/90">
                  {section.label}
                </p>
                <div className="space-y-1">
                  {section.items.map(({ name, icon: Icon }) => {
                    const isActive = activeView === name
                    return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        const view = name as DashboardView
                        setActiveView(view)
                        setDiagnosticsOpen(view === 'Full Body Diagnostics')
                      }}
                      className={[
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition',
                        name === 'Full Body Diagnostics'
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                          : isActive
                          ? 'bg-slate-800/80 text-cyan-200 ring-1 ring-cyan-400/30'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100',
                      ].join(' ')}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{name}</span>
                    </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="relative z-30 border-b border-sky-100 bg-white px-4 py-4 lg:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
              <div className="flex w-full items-center justify-end gap-3 self-end md:self-auto">
                <div className="relative z-40">
                  <button
                    type="button"
                    aria-label="Notifications"
                    aria-expanded={notificationsOpen}
                    aria-haspopup="dialog"
                    onClick={() => setNotificationsOpen((open) => !open)}
                    className="relative rounded-xl border border-slate-700 bg-slate-900/70 p-2.5 text-cyan-300 transition hover:border-cyan-400 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  >
                    <Bell className="h-4 w-4" />
                    {!notificationsRead && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-600 text-[9px] font-bold text-white">
                        2
                      </span>
                    )}
                  </button>
                  {notificationsOpen && createPortal(
                    <section
                      role="dialog"
                      aria-label="Astronaut health progress notifications"
                      className="fixed right-4 top-[4.5rem] z-[100] w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-sky-100 bg-white p-4 text-slate-800 shadow-2xl"
                    >
                      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                        <div>
                          <h2 className="text-sm font-semibold text-slate-900">Crew health progress</h2>
                          <p className="mt-0.5 text-xs text-slate-500">2 recent astronaut updates</p>
                        </div>
                        <button
                          type="button"
                          aria-label="Close notifications"
                          onClick={() => setNotificationsOpen(false)}
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3 py-3">
                        <article className="rounded-xl bg-sky-50 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-xs font-semibold text-slate-900">Lt. Maya Rivera</h3>
                            <span className="text-[10px] text-slate-500">12 min ago</span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600">
                            Hydration index improved to 91%; vestibular symptoms remain under observation.
                          </p>
                        </article>
                        <article className="rounded-xl bg-sky-50 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-xs font-semibold text-slate-900">M. Tunde Osei</h3>
                            <span className="text-[10px] text-slate-500">1 hr ago</span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600">
                            Right shoulder mobility is improving; recovery exercises continue as planned.
                          </p>
                        </article>
                      </div>
                      <div className="flex items-center justify-between border-t border-sky-100 pt-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveView('Astronaut Profiles')
                            setNotificationsOpen(false)
                          }}
                          className="text-xs font-semibold text-sky-700 hover:text-sky-900"
                        >
                          View astronaut profiles
                        </button>
                        <button
                          type="button"
                          onClick={() => setNotificationsRead(true)}
                          disabled={notificationsRead}
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-sky-700 disabled:cursor-default disabled:opacity-60"
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                          Mark read
                        </button>
                      </div>
                    </section>,
                    document.body,
                  )}
                </div>

                <div
                  tabIndex={0}
                  role="group"
                  aria-label="Medical officer profile"
                  aria-describedby="medical-officer-info"
                  className="group relative flex cursor-help items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400 bg-cyan-400/10 text-xs font-bold text-cyan-200">
                    MO
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">Medical officer</p>
                    <p className="font-mono text-xs text-slate-100">DR. K. NIELSEN</p>
                  </div>
                  <div
                    id="medical-officer-info"
                    role="tooltip"
                    className="invisible absolute right-0 top-full z-50 mt-2 w-72 translate-y-1 rounded-2xl border border-sky-100 bg-white p-4 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                  >
                    <p className="font-semibold text-slate-900">Dr. Kai Nielsen</p>
                    <p className="mt-1 text-xs text-sky-700">Flight physician · AST-002</p>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      Oversees crew medical reviews and health monitoring. Current status: stable, with no active conditions reported.
                    </p>
                    <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      Simulated mission profile
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {activeView === 'Astronaut Profiles' ? <AstronautProfiles />
            : activeView === 'Medical Alerts' ? <MedicalAlerts />
            : activeView === 'Health Complaints' || activeView === 'Health Correlation' || activeView === 'Early Warning'
              ? <MedicalInsights view={activeView as InsightView} />
              : activeView === 'Mental Health' || activeView === 'Infection Control'
                ? <CrewCare view={activeView as CrewCareView} />
              : <main className="space-y-6 p-4 lg:p-6">
            <section className="overflow-hidden rounded-[28px] border border-sky-100 bg-white p-6 shadow-md">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-300">Mission control dashboard</p>
                  <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
                    Advanced health intelligence for human spaceflight
                  </h1>
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
              <VitalsTrendChart liveVitals={liveVitals} />
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
          </main>}
        </div>
      </div>
    </div>
  )
}

export default App
