import { useState } from 'react'
import { Search, UserRound } from 'lucide-react'

const astronauts = [
  { name: 'Lt. Maya Rivera', id: 'AST-001', role: 'Mission commander', status: 'Monitoring', condition: 'Vestibular adaptation; occasional dizziness after rapid head movement', diagnosis: 'Reported positional dizziness, consistent with vestibular adaptation; clinician review recommended.', carePlan: 'Track symptom timing and triggers, maintain hydration, and review during the next medical check.', researchContext: 'NASA identifies altered sensorimotor and vestibular function as a human-spaceflight risk. This is general research context, not evidence about this simulated person.', researchUrl: 'https://www.nasa.gov/hrp/risks/' },
  { name: 'Dr. Kai Nielsen', id: 'AST-002', role: 'Flight physician', status: 'Stable', condition: 'No active conditions reported', diagnosis: 'No active diagnosis reported.', carePlan: 'Continue routine self-monitoring and scheduled crew health checks.', researchContext: 'NASA research uses consistent health measures to better understand how spaceflight affects crew members; no personal record is represented here.', researchUrl: 'https://www.nasa.gov/hrp/ongoing-hrp-research/' },
  { name: 'M. Tunde Osei', id: 'AST-003', role: 'Flight engineer', status: 'Monitoring', condition: 'Right shoulder strain; recovery exercises in progress', diagnosis: 'Reported right shoulder strain, currently under recovery monitoring.', carePlan: 'Continue approved mobility exercises and report any increased pain or reduced range of motion.', researchContext: 'NASA studies reduced cardiorespiratory and musculoskeletal fitness during spaceflight. That population-level risk does not diagnose an individual injury.', researchUrl: 'https://www.nasa.gov/hrp/risks/' },
  { name: 'Cmdr. Elena Park', id: 'AST-004', role: 'Pilot', status: 'Stable', condition: 'Intermittent sleep disruption; sleep schedule monitored', diagnosis: 'Intermittent sleep disruption noted; no acute concern recorded in this simulated profile.', carePlan: 'Continue sleep tracking and maintain the planned sleep schedule.', researchContext: 'NASA ARCHeR research examines astronaut wellbeing, activity, and sleep patterns during deep-space missions.', researchUrl: 'https://www.nasa.gov/hrp/ongoing-hrp-research/' },
  { name: 'Dr. Amara Okafor', id: 'AST-005', role: 'Mission scientist', status: 'Stable', condition: 'Seasonal allergy symptoms; managed per care plan', diagnosis: 'Seasonal allergy symptoms reported and managed under the existing care plan.', carePlan: 'Continue the clinician-approved plan and monitor for changes in symptoms.', researchContext: 'NASA studies altered immune responses in space. The research is not a source for this simulated profile’s allergy history.', researchUrl: 'https://www.nasa.gov/hrp/risks/' },
  { name: 'Capt. Luca Moretti', id: 'AST-006', role: 'Payload specialist', status: 'Monitoring', condition: 'Mild lower-back discomfort after extended seated work', diagnosis: 'Mild work-associated lower-back discomfort reported; follow-up monitoring advised.', carePlan: 'Use scheduled movement breaks and report persistent or worsening discomfort.', researchContext: 'NASA examines exercise and countermeasures to protect musculoskeletal health in spaceflight; this does not establish the cause of the simulated discomfort.', researchUrl: 'https://www.nasa.gov/hrp/risks/' },
  { name: 'Sgt. Priya Shah', id: 'AST-007', role: 'Systems specialist', status: 'Stable', condition: 'No active conditions reported', diagnosis: 'No active diagnosis reported.', carePlan: 'Continue routine health checks and standard mission monitoring.', researchContext: 'NASA ongoing research collects standardized health information to study spaceflight effects; this profile does not represent that dataset.', researchUrl: 'https://www.nasa.gov/hrp/ongoing-hrp-research/' },
  { name: 'Dr. Noah Williams', id: 'AST-008', role: 'Medical researcher', status: 'Monitoring', condition: 'Hydration below baseline; intake being monitored', diagnosis: 'Hydration intake trending below the mission baseline; not a confirmed medical diagnosis.', carePlan: 'Increase fluids according to the crew hydration protocol and recheck the next intake reading.', researchContext: 'NASA describes interconnected spaceflight hazards and health risks. The cited material does not supply or verify this simulated hydration observation.', researchUrl: 'https://www.nasa.gov/hrp/hazards/' },
  { name: 'Lt. Sofia Andersson', id: 'AST-009', role: 'Communications officer', status: 'Stable', condition: 'No active conditions reported', diagnosis: 'No active diagnosis reported.', carePlan: 'Continue routine self-monitoring and scheduled crew health checks.', researchContext: 'The Canadian Space Agency describes research and technology development for monitoring radiation exposure; this is mission-level context, not a personal medical record.', researchUrl: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp' },
  { name: 'Cmdr. Mateo Silva', id: 'AST-010', role: 'EVA specialist', status: 'Monitoring', condition: 'Orthostatic intolerance under routine observation', diagnosis: 'Orthostatic symptoms are being observed; clinical assessment should guide diagnosis.', carePlan: 'Record symptoms and associated activity, follow the clinician-directed countermeasure plan, and review at the next check.', researchContext: 'NASA identifies cardiovascular adaptations as a spaceflight risk. Only a qualified clinician with authorized records can assess an individual.', researchUrl: 'https://www.nasa.gov/hrp/risks/' },
]

export default function AstronautProfiles() {
  const [query, setQuery] = useState('')
  const [selectedAstronautId, setSelectedAstronautId] = useState<string | null>(null)
  const filteredAstronauts = astronauts.filter((astronaut) =>
    `${astronaut.name} ${astronaut.id} ${astronaut.role} ${astronaut.condition}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  )

  return (
    <main className="space-y-6 p-4 lg:p-6">
      <section className="rounded-[28px] border border-sky-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Crew and telemetry</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Astronaut Profiles</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Example crew health records for the demo only. NASA and CSA links provide general research context—not personal astronaut medical histories.
            </p>
          </div>
          <label className="flex w-full items-center gap-2 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2.5 md:max-w-sm">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-sky-600" />
            <span className="sr-only">Search astronaut profiles</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search crew or condition"
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500"
            />
          </label>
        </div>
      </section>

      <section aria-label="Astronaut health conditions" className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {filteredAstronauts.map((astronaut) => (
          <article key={astronaut.id} className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
            <button
              type="button"
              aria-expanded={selectedAstronautId === astronaut.id}
              aria-controls={`diagnosis-${astronaut.id}`}
              onClick={() => setSelectedAstronautId((selectedId) => selectedId === astronaut.id ? null : astronaut.id)}
              className="block w-full p-5 text-left transition hover:bg-sky-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500"
            >
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <UserRound aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold text-slate-900">{astronaut.name}</h2>
                  <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                    {astronaut.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{astronaut.id} · {astronaut.role}</p>
              </div>
            </div>
            <div className="mt-5 border-t border-sky-50 pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">Health condition</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{astronaut.condition}</p>
            </div>
            <p className="mt-3 text-xs font-medium text-sky-700">
              {selectedAstronautId === astronaut.id ? 'Hide diagnosis' : 'View diagnosis and care plan'}
            </p>
            </button>
            {selectedAstronautId === astronaut.id && (
              <div id={`diagnosis-${astronaut.id}`} className="border-t border-sky-100 bg-sky-50/70 px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">Simulated assessment</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{astronaut.diagnosis}</p>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">Monitoring / care plan</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{astronaut.carePlan}</p>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">Related agency research</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{astronaut.researchContext}</p>
                <a
                  href={astronaut.researchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex text-xs font-semibold text-sky-700 underline decoration-sky-200 underline-offset-4 hover:text-sky-900"
                >
                  Open NASA / CSA source
                </a>
                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                  Simulated demo only; this is not a NASA medical record, clinical diagnosis, or medical advice.
                </p>
              </div>
            )}
          </article>
        ))}
        {filteredAstronauts.length === 0 && (
          <p className="rounded-2xl border border-sky-100 bg-white p-6 text-sm text-slate-600 md:col-span-2 2xl:col-span-3">
            No astronaut profiles match “{query}”.
          </p>
        )}
      </section>
    </main>
  )
}
