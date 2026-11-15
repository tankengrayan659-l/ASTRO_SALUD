import { Activity, AlertTriangle, ArrowUpRight, Clock3, Info, TrendingDown, TrendingUp } from 'lucide-react'

export type InsightView = 'Health Complaints' | 'Health Correlation' | 'Early Warning'

const complaints = [
  {
    person: 'Lt. Maya Rivera · AST-001',
    complaint: 'Brief dizziness after rapid head movement',
    context: 'Reported after a movement sequence; duration and triggers are being logged.',
    recorded: 'Today · 09:14 UTC',
    status: 'Clinician review',
    source: 'NASA vestibular and sensorimotor risks',
    href: 'https://www.nasa.gov/hrp/risks/',
  },
  {
    person: 'Dr. Noah Williams · AST-008',
    complaint: 'Hydration intake below the mission baseline',
    context: 'Intake trend is being monitored; no diagnosis is implied by this observation.',
    recorded: 'Today · 08:40 UTC',
    status: 'Monitoring',
    source: 'NASA human spaceflight hazards',
    href: 'https://www.nasa.gov/hrp/hazards/',
  },
  {
    person: 'M. Tunde Osei · AST-003',
    complaint: 'Right shoulder discomfort during mobility checks',
    context: 'Crew-reported discomfort with recovery exercise follow-up scheduled.',
    recorded: 'Yesterday · 17:20 UTC',
    status: 'Follow-up scheduled',
    source: 'NASA musculoskeletal risks',
    href: 'https://www.nasa.gov/hrp/risks/',
  },
  {
    person: 'Cmdr. Elena Park · AST-004',
    complaint: 'Interrupted sleep over recent rest periods',
    context: 'Sleep timing and activity are tracked for discussion at the next crew health review.',
    recorded: 'Yesterday · 06:10 UTC',
    status: 'Monitoring',
    source: 'NASA ongoing HRP research',
    href: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
  },
]

const correlations = [
  {
    title: 'Sleep duration and reaction time',
    people: 'Cmdr. Elena Park · AST-004',
    observation: 'In this demo dataset, shorter sleep windows coincide with slower reaction-time readings across three sample periods.',
    strength: 'Moderate association',
    icon: TrendingDown,
    source: 'NASA ARCHeR research',
    href: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
  },
  {
    title: 'Hydration intake and orthostatic symptoms',
    people: 'Dr. Noah Williams · AST-008',
    observation: 'Lower recorded fluid intake coincides with more frequent postural symptom reports in the simulated timeline.',
    strength: 'Early pattern',
    icon: Activity,
    source: 'NASA cardiovascular adaptation risks',
    href: 'https://www.nasa.gov/hrp/risks/',
  },
  {
    title: 'Exercise completion and mobility trend',
    people: 'M. Tunde Osei · AST-003',
    observation: 'Improving mobility scores appear alongside completion of the planned recovery sessions in this demo.',
    strength: 'Improving trend',
    icon: TrendingUp,
    source: 'NASA musculoskeletal fitness risks',
    href: 'https://www.nasa.gov/hrp/risks/',
  },
]

const warnings = [
  {
    title: 'Vestibular symptoms after head movement',
    person: 'Lt. Maya Rivera · AST-001',
    signal: 'Two brief dizziness reports in the latest monitoring window.',
    nextStep: 'Continue symptom and trigger logging; clinician review is recommended if symptoms persist or worsen.',
    priority: 'Review',
  },
  {
    title: 'Hydration trend below baseline',
    person: 'Dr. Noah Williams · AST-008',
    signal: 'Fluid intake remains below the simulated mission target across consecutive checks.',
    nextStep: 'Follow the crew hydration protocol and recheck; escalate persistent changes to the medical officer.',
    priority: 'Monitor',
  },
  {
    title: 'Sleep interruption pattern',
    person: 'Cmdr. Elena Park · AST-004',
    signal: 'Fragmented sleep appears in three consecutive simulated rest logs.',
    nextStep: 'Review schedule, environment, and workload during the next crew health check.',
    priority: 'Monitor',
  },
]

const pageCopy: Record<InsightView, { eyebrow: string; description: string }> = {
  'Health Complaints': {
    eyebrow: 'Crew-reported observations',
    description: 'A review queue of example symptoms and health observations. Entries are simulated and are not confirmed diagnoses.',
  },
  'Health Correlation': {
    eyebrow: 'Exploratory telemetry review',
    description: 'Example co-occurring signal patterns from simulated telemetry. Association does not establish cause or clinical significance.',
  },
  'Early Warning': {
    eyebrow: 'Monitoring priorities',
    description: 'Example trends that may merit follow-up. These demo indicators are not clinical alarms and require clinician interpretation.',
  },
}

export default function MedicalInsights({ view }: { view: InsightView }) {
  const copy = pageCopy[view]

  return (
    <main className="space-y-6 p-4 lg:p-6">
      <section className="rounded-[28px] border border-sky-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">{copy.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{view}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{copy.description}</p>
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2.5 text-xs leading-relaxed text-sky-900">
          <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          All person-specific records and readings below are fictional demo data. NASA links provide general research context, not individual astronaut records or medical advice.
        </p>
      </section>

      {view === 'Health Complaints' && (
        <section aria-label="Crew health complaints" className="grid gap-4 xl:grid-cols-2">
          {complaints.map((item) => (
            <article key={item.person} className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-sky-700">{item.person}</p>
                  <h2 className="mt-1 text-base font-semibold text-slate-900">{item.complaint}</h2>
                </div>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-800">
                  {item.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.context}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-sky-50 pt-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
                  {item.recorded}
                </span>
                <a href={item.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900">
                  {item.source}<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </section>
      )}

      {view === 'Health Correlation' && (
        <section aria-label="Exploratory health correlations" className="grid gap-4 xl:grid-cols-3">
          {correlations.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] font-semibold text-sky-800">{item.strength}</span>
                </div>
                <h2 className="mt-4 font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-1 text-xs text-slate-500">{item.people}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.observation}</p>
                <a href={item.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900">
                  {item.source}<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              </article>
            )
          })}
        </section>
      )}

      {view === 'Early Warning' && (
        <section aria-label="Early warning indicators" className="space-y-4">
          {warnings.map((item) => (
            <article key={item.title} className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                    <AlertTriangle aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-sky-700">{item.person}</p>
                    <h2 className="mt-1 font-semibold text-slate-900">{item.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.signal}</p>
                  </div>
                </div>
                <span className="w-fit rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-800">
                  {item.priority}
                </span>
              </div>
              <p className="mt-4 border-t border-sky-50 pt-3 text-sm leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-800">Suggested follow-up: </span>{item.nextStep}
              </p>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
