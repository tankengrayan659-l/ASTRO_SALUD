import { useState } from 'react'
import { Activity, AlertTriangle, BrainCircuit, CheckCircle2, HeartHandshake, ShieldAlert, Wind } from 'lucide-react'

export type CrewCareView = 'Mental Health' | 'Infection Control'

const relaxationSteps = [
  {
    title: 'Paced breathing',
    detail: 'If comfortable, breathe in gently for 4 counts and out for 6 counts for about two minutes. Stop if it feels uncomfortable.',
    icon: Wind,
  },
  {
    title: 'Ground in the present',
    detail: 'Name five things you see, four things you feel, three things you hear, two things you smell, and one thing you taste.',
    icon: Activity,
  },
  {
    title: 'Reconnect with someone',
    detail: 'Schedule a private check-in with a crewmate, family contact, behavioral health specialist, or flight surgeon.',
    icon: HeartHandshake,
  },
]

export default function CrewCare({ view }: { view: CrewCareView }) {
  const [exposureReported, setExposureReported] = useState(false)
  const [symptomsReported, setSymptomsReported] = useState(false)
  const [reviewRequested, setReviewRequested] = useState(false)
  const [precautionsRecorded, setPrecautionsRecorded] = useState(false)

  if (view === 'Mental Health') {
    return (
      <main className="space-y-6 p-4 lg:p-6">
        <section className="rounded-[28px] border border-sky-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Crew wellbeing</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Mental Health & Stress Support</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Spaceflight can bring isolation, confinement, distance from loved ones, uncertainty, and fear. Stress is a human response—not a personal failure—and reaching out early is encouraged.
          </p>
          <p className="mt-4 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2.5 text-xs leading-relaxed text-sky-900">
            NASA identifies isolation and confinement as a human-spaceflight hazard. The suggestions below are general wellbeing practices, not a diagnosis or substitute for professional care.
          </p>
        </section>

        <section aria-label="Relaxation and connection suggestions" className="grid gap-4 lg:grid-cols-3">
          {relaxationSteps.map(({ title, detail, icon: Icon }) => (
            <article key={title} className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">Small routines that can help</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
              <li>• Keep a steady sleep and wake schedule when mission operations allow.</li>
              <li>• Make time for enjoyable activity, movement, and meals with the crew.</li>
              <li>• Break overwhelming tasks into small next steps and ask for support.</li>
              <li>• Share persistent anxiety, loneliness, low mood, or sleep changes with the behavioral health or medical team.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
            <div className="flex items-start gap-3">
              <BrainCircuit aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
              <div>
                <h2 className="font-semibold text-slate-900">When to get help now</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  If distress feels unmanageable, is getting worse, affects safe work, or includes thoughts of self-harm, contact the mission medical/behavioral-health team immediately and follow the mission emergency-support protocol.
                </p>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  NASA research context: <a className="font-semibold text-sky-700 underline underline-offset-4" href="https://www.nasa.gov/hrp/hazards/" target="_blank" rel="noreferrer">isolation and confinement hazards</a> and <a className="font-semibold text-sky-700 underline underline-offset-4" href="https://www.nasa.gov/hrp/ongoing-hrp-research/" target="_blank" rel="noreferrer">ongoing crew wellbeing research</a>.
                </p>
              </div>
            </div>
          </article>
        </section>
      </main>
    )
  }

  const assessmentNeeded = exposureReported || symptomsReported

  return (
    <main className="space-y-6 p-4 lg:p-6">
      <section className="rounded-[28px] border border-sky-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Crew health protection</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Infection Control & Isolation Review</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Track a reported exposure or possible infectious symptoms and route it to the medical officer. A change in sensor readings alone cannot identify a virus or confirm infection.
        </p>
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2.5 text-xs leading-relaxed text-sky-900">
          <ShieldAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          Isolation is a clinician- and mission-protocol decision. This demo does not diagnose illness, automatically quarantine crew, or set an isolation duration.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <article className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Exposure / symptom check-in</h2>
          <p className="mt-1 text-xs text-slate-500">Fictional demo scenario · select what was reported to request review</p>

          <div className="mt-5 space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/60 p-4">
              <input
                type="checkbox"
                checked={exposureReported}
                onChange={(event) => {
                  setExposureReported(event.target.checked)
                  setReviewRequested(false)
                  setPrecautionsRecorded(false)
                }}
                className="mt-0.5 h-4 w-4 accent-sky-700"
              />
              <span>
                <span className="block text-sm font-medium text-slate-900">Reported close contact with a contagious illness</span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-600">Record exposure details and timing for clinician assessment.</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/60 p-4">
              <input
                type="checkbox"
                checked={symptomsReported}
                onChange={(event) => {
                  setSymptomsReported(event.target.checked)
                  setReviewRequested(false)
                  setPrecautionsRecorded(false)
                }}
                className="mt-0.5 h-4 w-4 accent-sky-700"
              />
              <span>
                <span className="block text-sm font-medium text-slate-900">New symptoms or unusual health state reported</span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-600">For example, feverishness, cough, sore throat, rash, or feeling acutely unwell.</span>
              </span>
            </label>
          </div>

          <button
            type="button"
            disabled={!assessmentNeeded}
            onClick={() => {
              setReviewRequested(true)
              setPrecautionsRecorded(false)
            }}
            className="mt-4 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Request medical officer review
          </button>
          {!assessmentNeeded && <p className="mt-2 text-xs text-slate-500">Select an exposure or symptom report to enable review.</p>}

          {reviewRequested && (
            <div role="status" className="mt-4 flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Review requested. Follow mission infection-control precautions while the medical officer assesses the report.</span>
            </div>
          )}
        </article>

        <article className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <AlertTriangle aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">Isolation status</h2>
              <p className="text-xs text-slate-500">Requires medical officer authorization</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-sky-100 bg-sky-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-800">
              {precautionsRecorded ? 'Precautionary isolation recorded (demo)' : reviewRequested ? 'Awaiting clinician assessment' : 'No report submitted'}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {precautionsRecorded
                ? 'A demo isolation action has been recorded. Follow the medical officer’s instructions and mission infection-control protocol.'
                : reviewRequested
                  ? 'The medical officer should assess exposure, symptoms, and mission policy before deciding on isolation.'
                  : 'Submit an exposure or symptom report to route it for medical review.'}
            </p>
            <p className="mt-3 text-xs font-medium text-slate-600">Duration: set by the medical officer under mission protocol; no fixed period is assumed here.</p>
          </div>

          {reviewRequested && !precautionsRecorded && (
            <button
              type="button"
              onClick={() => setPrecautionsRecorded(true)}
              className="mt-4 rounded-xl border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-800 transition hover:bg-sky-50"
            >
              Record clinician-directed precautions (demo)
            </button>
          )}

          <div className="mt-5 border-t border-sky-50 pt-4">
            <h3 className="text-sm font-semibold text-slate-900">While awaiting review</h3>
            <ul className="mt-2 space-y-2 text-xs leading-relaxed text-slate-600">
              <li>• Notify the designated medical officer and document symptom onset and exposure timing.</li>
              <li>• Follow mission guidance on limiting close contact, hygiene, and protective equipment.</li>
              <li>• Seek urgent medical support if symptoms become severe or rapidly worsen.</li>
            </ul>
          </div>
        </article>
      </section>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
        <Activity aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        NASA research discusses altered immune responses and microbial interactions in spaceflight. These are population-level research topics, not a method to diagnose an individual:
        {' '}<a href="https://www.nasa.gov/hrp/risks/" target="_blank" rel="noreferrer" className="font-semibold text-sky-700 underline underline-offset-4">NASA Human Research Program risks</a>.
      </p>
    </main>
  )
}
