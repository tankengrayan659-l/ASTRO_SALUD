import { useState } from 'react'
import {
  Activity,
  ArrowLeft,
  AudioLines,
  Brain,
  CircleHelp,
  HeartPulse,
  Rotate3D,
  ScanLine,
  ShieldAlert,
  Wind,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

type View = 'front' | 'back'
type Severity = 'NOMINAL' | 'WATCH' | 'ELEVATED'

type Region = {
  name: string
  system: string
  front: [number, number]
  back: [number, number]
  severity: Severity
  finding: string
  source: string
  time: string
}

const regions: Region[] = [
  {
    name: 'Neurological',
    system: 'Balance and coordination',
    front: [200, 104],
    back: [200, 105],
    severity: 'WATCH',
    finding: 'One brief dizziness report after rapid head movement.',
    source: 'Crew-reported · CMP-117-006',
    time: '24 APR · 09:14 UTC',
  },
  {
    name: 'Cardiovascular',
    system: 'Heart rate and circulation',
    front: [200, 184],
    back: [200, 184],
    severity: 'NOMINAL',
    finding: 'Resting heart-rate trend remains within the crew baseline.',
    source: 'Wearable telemetry · ECG-02',
    time: '24 APR · 09:12 UTC',
  },
  {
    name: 'Respiratory',
    system: 'Oxygenation and respiration',
    front: [220, 205],
    back: [220, 205],
    severity: 'NOMINAL',
    finding: 'Oxygen saturation and respiratory cadence are nominal.',
    source: 'Pulse oximeter · OXI-04',
    time: '24 APR · 09:11 UTC',
  },
  {
    name: 'Musculoskeletal',
    system: 'Mobility and muscle loading',
    front: [147, 266],
    back: [147, 266],
    severity: 'NOMINAL',
    finding: 'No new mobility limitation reported in this interval.',
    source: 'Crew-reported · daily check-in',
    time: '24 APR · 08:40 UTC',
  },
  {
    name: 'Digestive',
    system: 'Nutrition and gastrointestinal',
    front: [200, 258],
    back: [200, 258],
    severity: 'WATCH',
    finding: 'Hydration intake is trending below the mission target.',
    source: 'Water-use log · HYD-01',
    time: '24 APR · 08:56 UTC',
  },
  {
    name: 'Spinal alignment',
    system: 'Back and posture',
    front: [200, 316],
    back: [200, 316],
    severity: 'NOMINAL',
    finding: 'No posture-related concern has been reported.',
    source: 'Crew-reported · daily check-in',
    time: '24 APR · 08:40 UTC',
  },
  {
    name: 'Lower limbs',
    system: 'Legs and circulation',
    front: [176, 426],
    back: [176, 426],
    severity: 'NOMINAL',
    finding: 'No lower-limb discomfort reported.',
    source: 'Crew-reported · daily check-in',
    time: '24 APR · 08:40 UTC',
  },
  {
    name: 'Sleep and recovery',
    system: 'Sleep and circadian rhythm',
    front: [220, 494],
    back: [220, 494],
    severity: 'WATCH',
    finding: 'Mild fatigue noted; compare against the sleep-cycle log.',
    source: 'Crew-reported · CMP-117-007',
    time: '24 APR · 07:30 UTC',
  },
]

const vitals = [
  { label: 'Heart rate', value: '72', unit: 'BPM', Icon: HeartPulse, trend: 'Within baseline' },
  { label: 'SpO₂', value: '99.2', unit: '%', Icon: Wind, trend: 'Within baseline' },
  { label: 'Core temp', value: '36.8', unit: '°C', Icon: Activity, trend: 'Within baseline' },
  { label: 'Audio check', value: 'Clear', unit: '', Icon: AudioLines, trend: 'Last sync · 09:08 UTC' },
]

const severityStyles: Record<Severity, string> = {
  NOMINAL: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  WATCH: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  ELEVATED: 'border-orange-400/30 bg-orange-400/10 text-orange-200',
}

const severityColors: Record<Severity, string> = {
  NOMINAL: '#50d9b5',
  WATCH: '#e8d459',
  ELEVATED: '#f07856',
}

function AnatomyMap({
  view,
  selected,
  onSelect,
}: {
  view: View
  selected: string
  onSelect: (name: string) => void
}) {
  const back = view === 'back'

  return (
    <motion.div
      className="relative z-10 h-full w-full"
      style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'visible' }}
      initial={false}
      animate={{ rotateY: back ? 180 : 0 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        viewBox="0 0 400 560"
        role="img"
        aria-label={`Schematic ${view} view of astronaut anatomy. Select a marker to review its data.`}
        className="h-full min-h-[440px] w-full overflow-visible"
        style={{ transform: back ? 'scaleX(-1)' : undefined }}
      >
        <defs>
          <linearGradient id="body-fill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#50d9b5" stopOpacity=".17" />
            <stop offset="50%" stopColor="#45d9e8" stopOpacity=".07" />
            <stop offset="100%" stopColor="#45d9e8" stopOpacity=".16" />
          </linearGradient>
          <radialGradient id="body-glow">
            <stop offset="0%" stopColor="#45d9e8" stopOpacity=".16" />
            <stop offset="100%" stopColor="#45d9e8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="200" cy="275" rx="150" ry="240" fill="url(#body-glow)" />
        <g
          fill="url(#body-fill)"
          stroke="#50d9b5"
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0 0 14px rgba(69,217,232,.16))' }}
        >
          <circle cx="200" cy="68" r="32" />
          <path d="M183 101h34v22h-34z" />
          <path d="M164 121c-24 5-38 17-47 41l-29 82c-4 11 2 20 11 22 9 2 15-3 19-13l24-60-12 83c-2 14 3 26 15 34l-3 61-19 113c-2 12 4 20 14 21 9 1 15-5 18-16l26-106 19-29 19 29 26 106c3 11 9 17 18 16 10-1 16-9 14-21l-19-113-3-61c12-8 17-20 15-34l-12-83 24 60c4 10 10 15 19 13 9-2 15-11 11-22l-29-82c-9-24-23-36-47-41l-22 13h-48z" />
        </g>
        {back ? (
          <g fill="none" stroke="#45d9e8" strokeOpacity=".4" strokeWidth="1.5">
            <path d="M160 144c25 15 55 15 80 0M160 164c24 10 56 10 80 0M178 134v168m22-168v168m22-168v168" />
            <path d="M166 203c20 13 48 13 68 0M169 231c18 11 44 11 62 0M170 261c18 10 42 10 60 0M173 290c16 9 38 9 54 0" />
            <path d="m160 353 40 14 40-14m-47 36-16 67m30-67 16 67" />
          </g>
        ) : (
          <g fill="none" stroke="#45d9e8" strokeOpacity=".48" strokeWidth="1.5">
            <path d="M158 144c25 12 59 12 84 0M174 139v18m52-18v18" />
            <path d="M181 164c-17 1-24 14-24 29v34c0 11 7 19 17 18l14-4v-66c0-7-2-11-7-11Zm38 0c17 1 24 14 24 29v34c0 11-7 19-17 18l-14-4v-66c0-7 2-11 7-11Z" />
            <path d="M184 164c6 11 26 11 32 0m-16 1v57m0 0c-19 8-20 29 0 33 20-4 19-25 0-33Zm-23 45c10 8 36 8 46 0m-45 21c10 8 34 8 44 0m-42 22c9 7 31 7 40 0m-34 25c11 9 25 9 36 0" />
          </g>
        )}
        <text x="200" y="536" textAnchor="middle" fill="#8daab5" fontSize="8" fontFamily="monospace" letterSpacing="2">
          SCHEMATIC · NOT DIAGNOSTIC IMAGING
        </text>
        {regions.map((region, index) => {
          const [x, y] = back ? region.back : region.front
          const active = selected === region.name
          const color = severityColors[region.severity]
          return (
            <g
              key={region.name}
              role="button"
              tabIndex={0}
              aria-label={`${region.name}, ${region.severity.toLowerCase()}`}
              aria-pressed={active}
              className="cursor-pointer outline-none"
              onClick={() => onSelect(region.name)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelect(region.name)
                }
              }}
            >
              {region.severity !== 'NOMINAL' && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r="13"
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  initial={{ opacity: 0.7, scale: 0.8 }}
                  animate={{ opacity: [0.25, 0.75, 0.25], scale: [0.85, 1.15, 0.85] }}
                  transition={{ duration: 2.4 + (index % 2) * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={active ? 7 : 5}
                fill={color}
                stroke={active ? '#f0fdfa' : '#071723'}
                strokeWidth={active ? 2 : 1}
                className="transition-all duration-200"
              />
              <title>{`${region.name}: ${region.finding}`}</title>
            </g>
          )
        })}
      </svg>
    </motion.div>
  )
}

export default function FullBodyDiagnostics({ onBack }: { onBack: () => void }) {
  const [selectedRegion, setSelectedRegion] = useState('Neurological')
  const [view, setView] = useState<View>('front')
  const [astronaut, setAstronaut] = useState('LT. M. RIVERA')
  const reduceMotion = useReducedMotion()
  const selected = regions.find((region) => region.name === selectedRegion) ?? regions[0]
  const motionDuration = reduceMotion ? 0 : 0.45

  return (
    <div className="min-h-screen bg-[#06111c] text-[#e8f4f5]">
      <div className="mx-auto max-w-[1720px] px-4 py-5 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionDuration }}
          className="mb-5 flex flex-col gap-5 border-b border-[#1c5260] pb-5 xl:flex-row xl:items-center xl:justify-between"
        >
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={onBack}
              className="mt-1 inline-flex items-center gap-2 rounded-lg border border-[#1c5260] bg-[#091b29] px-3 py-2 text-xs text-[#b8ced4] transition hover:border-cyan-300 hover:text-cyan-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Mission overview
            </button>
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/50 bg-cyan-300/10 font-mono text-lg text-cyan-200">
                A
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.22em] text-cyan-300">ASTRA · Integrated crew health</p>
                <h1 className="mt-1 text-xl font-semibold tracking-wide text-white sm:text-2xl">Full Body Diagnostics</h1>
                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8daab5]">
                  Evidence-linked systems review · schematic anatomy · clinical review required
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
            <label className="rounded-xl border-l-2 border-[#45d9e8] bg-[#091b29] px-3 py-2">
              <span className="block font-mono text-[9px] uppercase tracking-[.18em] text-[#8daab5]">Selected astronaut</span>
              <select
                value={astronaut}
                onChange={(event) => setAstronaut(event.target.value)}
                className="mt-1 w-full bg-transparent font-mono text-xs text-white outline-none"
              >
                <option className="bg-[#091b29]" value="LT. M. RIVERA">LT. M. RIVERA</option>
                <option className="bg-[#091b29]" value="DR. K. NIELSEN">DR. K. NIELSEN</option>
                <option className="bg-[#091b29]" value="M. OSEI">M. OSEI</option>
              </select>
            </label>
            <div className="rounded-xl border-l-2 border-[#45d9e8] bg-[#091b29] px-3 py-2">
              <span className="block font-mono text-[9px] uppercase tracking-[.18em] text-[#8daab5]">Mission ID</span>
              <span className="mt-1 block font-mono text-xs text-white">ASTRA-117 // SIM</span>
            </div>
            <div className="rounded-xl border-l-2 border-emerald-300 bg-[#091b29] px-3 py-2">
              <span className="block font-mono text-[9px] uppercase tracking-[.18em] text-[#8daab5]">Data status</span>
              <span className="mt-1 flex items-center gap-2 font-mono text-xs text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                SIMULATED FEED
              </span>
            </div>
          </div>
        </motion.header>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1c5260]/80 bg-[#091b29]/80 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-[#8daab5]">
            <ScanLine className="h-4 w-4 text-cyan-300" />
            <span>Last synchronization <strong className="font-mono font-medium text-slate-200">24 APR 2026 · 09:14 UTC</strong></span>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-200">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Telemetry nominal · 8 sources
          </p>
        </div>

        <main className="grid items-start gap-4 xl:grid-cols-[minmax(230px,0.82fr)_minmax(390px,1.35fr)_minmax(260px,0.9fr)]">
          <motion.section
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionDuration, delay: reduceMotion ? 0 : 0.08 }}
            className="rounded-2xl border border-[#1c5260] bg-gradient-to-br from-[#0b2231] to-[#071723] p-4"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.2em] text-cyan-300">01 / System coverage</p>
                <h2 className="mt-1 text-base font-semibold text-white">Body systems</h2>
              </div>
              <span className="font-mono text-[10px] text-[#8daab5]">08 REGIONS</span>
            </div>
            <div className="space-y-1">
              {regions.map((region) => (
                <button
                  key={region.name}
                  type="button"
                  onClick={() => setSelectedRegion(region.name)}
                  aria-pressed={selectedRegion === region.name}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                    selectedRegion === region.name
                      ? 'bg-[#123041] ring-1 ring-cyan-300/40'
                      : 'hover:bg-[#102a38]'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-slate-100">{region.name}</span>
                    <span className="mt-0.5 block truncate text-[10px] text-[#8daab5]">{region.system}</span>
                  </span>
                  <span className={`shrink-0 rounded-full border px-2 py-1 font-mono text-[8px] ${severityStyles[region.severity]}`}>
                    {region.severity}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/[.06] p-3">
              <div className="flex items-center gap-2 text-amber-200">
                <ShieldAlert className="h-4 w-4" />
                <span className="font-mono text-[9px] uppercase tracking-wider">Review candidate</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#b7c8ce]">Hydration drift and a brief dizziness report need clinician review.</p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionDuration, delay: reduceMotion ? 0 : 0.14 }}
            className="overflow-hidden rounded-2xl border border-[#1c5260] bg-gradient-to-br from-[#0b2231] to-[#071723] p-4"
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.2em] text-cyan-300">02 / Digital anatomy</p>
                <h2 className="mt-1 text-base font-semibold text-white">Whole-body evidence map</h2>
              </div>
              <div className="flex rounded-lg border border-[#1c5260] bg-[#06111c] p-1" role="group" aria-label="Anatomy view">
                {(['front', 'back'] as const).map((side) => (
                  <button
                    key={side}
                    type="button"
                    aria-pressed={view === side}
                    onClick={() => setView(side)}
                    className={`rounded px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider transition ${
                      view === side ? 'bg-[#123041] text-cyan-200' : 'text-[#8daab5] hover:text-white'
                    }`}
                  >
                    {side}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="relative h-[500px] overflow-hidden rounded-xl border border-[#1c5260]/70 bg-[radial-gradient(ellipse_at_50%_42%,rgba(69,217,232,.12),transparent_58%),linear-gradient(180deg,rgba(6,17,28,.8),rgba(7,23,35,.95))]"
              style={{ perspective: '900px' }}
            >
              <motion.div
                className="pointer-events-none absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent"
                animate={reduceMotion ? undefined : { y: [-170, 170] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-cyan-300/10"
                animate={reduceMotion ? undefined : { rotateZ: 360 }}
                transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center px-3 py-2">
                <div className="h-full w-full max-w-[390px]">
                  <AnatomyMap view={view} selected={selectedRegion} onSelect={setSelectedRegion} />
                </div>
              </div>
              <div className="absolute left-3 top-3 rounded border border-[#1c5260] bg-[#06111c]/80 px-2 py-1 font-mono text-[8px] tracking-wider text-[#8daab5]">
                {view.toUpperCase()} VIEW · INTERACTIVE
              </div>
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded border border-[#1c5260] bg-[#06111c]/85 px-2 py-1.5 text-[9px] text-[#8daab5]">
                <Rotate3D className="h-3.5 w-3.5 text-cyan-300" />
                Select a marker · flip view
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[9px] font-mono uppercase tracking-wider text-[#8daab5]">
              <span><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-300" />Nominal</span>
              <span><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-amber-300" />Watch</span>
              <span><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-orange-400" />Elevated</span>
              <span className="text-right">Schematic only · not diagnostic imaging</span>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionDuration, delay: reduceMotion ? 0 : 0.2 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-[#1c5260] bg-gradient-to-br from-[#0b2231] to-[#071723] p-4">
              <div className="mb-3">
                <p className="font-mono text-[9px] uppercase tracking-[.2em] text-cyan-300">03 / Physiology</p>
                <h2 className="mt-1 text-base font-semibold text-white">Live telemetry</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {vitals.map(({ label, value, unit, Icon, trend }) => (
                  <div key={label} className="rounded-xl border border-[#1c5260]/70 bg-[#06111c]/70 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-[#8daab5]">{label}</span>
                      <Icon className="h-3.5 w-3.5 text-cyan-300" />
                    </div>
                    <p className="mt-3 text-lg font-semibold text-white">
                      {value}<span className="ml-1 text-[10px] font-normal text-[#8daab5]">{unit}</span>
                    </p>
                    <p className="mt-1 text-[8px] text-emerald-200">{trend}</p>
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selected.name}
                initial={{ opacity: 0, x: reduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduceMotion ? 0 : -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.22 }}
                className="rounded-2xl border border-[#1c5260] bg-gradient-to-br from-[#0b2231] to-[#071723] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[.2em] text-cyan-300">04 / Selected evidence</p>
                    <h2 className="mt-1 text-base font-semibold text-white">{selected.name}</h2>
                    <p className="mt-1 text-[10px] text-[#8daab5]">{selected.system}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2 py-1 font-mono text-[8px] ${severityStyles[selected.severity]}`}>
                    {selected.severity}
                  </span>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-200">{selected.finding}</p>
                <div className="mt-4 space-y-2 border-t border-[#1c5260]/70 pt-3">
                  <p className="font-mono text-[9px] text-[#8daab5]">{selected.source}</p>
                  <p className="font-mono text-[9px] text-[#8daab5]">{selected.time}</p>
                </div>
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-cyan-300/15 bg-cyan-300/[.05] p-2.5 text-[10px] leading-relaxed text-[#afc8cf]">
                  <CircleHelp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-300" />
                  Evidence summary only. This display does not provide a diagnosis.
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="rounded-2xl border border-amber-300/25 bg-amber-300/[.06] p-4">
              <div className="flex items-center gap-2 text-amber-200">
                <Brain className="h-4 w-4" />
                <h2 className="font-mono text-[9px] uppercase tracking-[.16em]">Clinical review required</h2>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-[#b7c8ce]">
                Findings are simulated for demonstration. A qualified clinician must review source records before any action.
              </p>
            </div>
          </motion.section>
        </main>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: motionDuration, delay: reduceMotion ? 0 : 0.25 }}
          className="mt-5 flex flex-col gap-2 border-t border-[#1c5260]/70 pt-4 font-mono text-[9px] uppercase tracking-wider text-[#8daab5] sm:flex-row sm:justify-between"
        >
          <span>ASTRA integrated health intelligence · training interface</span>
          <span>Simulated data · human review required</span>
        </motion.footer>
      </div>
    </div>
  )
}
