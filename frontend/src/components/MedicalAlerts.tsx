import { AlertTriangle, CheckCircle2, Clock3 } from 'lucide-react'

const medicalAlerts = [
  {
    title: 'Hydration below baseline',
    astronaut: 'Dr. Noah Williams · AST-008',
    priority: 'Moderate',
    observed: 'Hydration intake is trending below the mission baseline during the latest monitoring window.',
    action: 'Follow the crew hydration protocol, record the next intake check, and escalate if the trend persists.',
    status: 'Monitoring',
    researchContext: 'NASA describes closed-environment habitability as a human-spaceflight concern; this simulated alert is not from NASA data.',
    researchUrl: 'https://www.nasa.gov/hrp/hazards/',
  },
  {
    title: 'Vestibular symptoms reported',
    astronaut: 'Lt. Maya Rivera · AST-001',
    priority: 'Review',
    observed: 'Brief dizziness reported after rapid head movement; vestibular adaptation is being monitored.',
    action: 'Document triggers and duration; request clinician review at the next scheduled health check.',
    status: 'Clinician review recommended',
    researchContext: 'NASA identifies altered sensorimotor and vestibular function as a spaceflight risk; this is general research context, not a diagnosis.',
    researchUrl: 'https://www.nasa.gov/hrp/risks/',
  },
  {
    title: 'Shoulder mobility recovery',
    astronaut: 'M. Tunde Osei · AST-003',
    priority: 'Watch',
    observed: 'Right shoulder strain remains on the recovery watch list; mobility is reported as improving.',
    action: 'Continue the approved recovery exercises and report any worsening pain or reduced mobility.',
    status: 'Follow-up scheduled',
    researchContext: 'NASA studies reduced musculoskeletal fitness and countermeasures during spaceflight; this source does not verify this simulated injury.',
    researchUrl: 'https://www.nasa.gov/hrp/risks/',
  },
]

export default function MedicalAlerts() {
  return (
    <main className="space-y-6 p-4 lg:p-6">
      <section className="rounded-[28px] border border-sky-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Medical intelligence</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Medical Alerts</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Crew health observations that may need monitoring or clinician follow-up. These are simulated demo alerts, not confirmed diagnoses.
        </p>
      </section>

      <section aria-label="Crew medical alerts" className="space-y-4">
        {medicalAlerts.map((alert) => (
          <article key={alert.title} className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  <AlertTriangle aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-semibold text-slate-900">{alert.title}</h2>
                  <p className="mt-1 text-xs text-slate-500">{alert.astronaut}</p>
                </div>
              </div>
              <span className="w-fit rounded-full bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                {alert.priority} priority
              </span>
            </div>

            <div className="mt-5 grid gap-4 border-t border-sky-50 pt-4 md:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">Observation</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{alert.observed}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">Recommended follow-up</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{alert.action}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">Related NASA research</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{alert.researchContext}</p>
              <a
                href={alert.researchUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-xs font-semibold text-sky-700 underline decoration-sky-200 underline-offset-4 hover:text-sky-900"
              >
                Open NASA Human Research Program source
              </a>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-sky-50 pt-3 text-xs text-slate-500">
              {alert.status === 'Monitoring' ? <Clock3 aria-hidden="true" className="h-3.5 w-3.5 text-sky-600" /> : <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 text-sky-600" />}
              <span>Status: {alert.status}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
