import { motion, useReducedMotion } from 'framer-motion'
import { Activity, ArrowRight, HeartPulse, ShieldCheck, Sparkles } from 'lucide-react'

interface LandingPageProps {
  onEnterDashboard: () => void
}

const healthFeatures = [
  {
    icon: HeartPulse,
    title: 'Crew-first care',
    detail: 'Keep astronaut health signals in one clear view.',
  },
  {
    icon: Activity,
    title: 'Connected monitoring',
    detail: 'Follow health trends throughout the mission.',
  },
  {
    icon: ShieldCheck,
    title: 'Timely awareness',
    detail: 'Surface changes that may need a closer look.',
  },
]

const spaceflightHazards = [
  {
    title: 'Space radiation',
    detail: 'Radiation exposure is a major human-spaceflight hazard and is an area of active protection research.',
    source: 'NASA Human Research Program hazards',
    href: 'https://www.nasa.gov/hrp/hazards/',
  },
  {
    title: 'Isolation and confinement',
    detail: 'Long periods in a small, isolated environment can affect crew behavior and team performance.',
    source: 'NASA Human Research Program hazards',
    href: 'https://www.nasa.gov/hrp/hazards/',
  },
  {
    title: 'Distance from Earth',
    detail: 'As crews travel farther away, receiving instructions, supplies, and medical support becomes more difficult.',
    source: 'NASA Human Research Program hazards',
    href: 'https://www.nasa.gov/hrp/hazards/',
  },
  {
    title: 'Gravity fields',
    detail: 'Changing gravity can affect muscles, bones, the inner ear, and other body systems.',
    source: 'NASA Human Research Program hazards',
    href: 'https://www.nasa.gov/hrp/hazards/',
  },
  {
    title: 'Hostile or closed environments',
    detail: 'Spacecraft habitability includes monitoring temperature, pressure, lighting, noise, and microbes.',
    source: 'NASA Human Research Program hazards',
    href: 'https://www.nasa.gov/hrp/hazards/',
  },
]

const agencySources = [
  {
    label: 'NASA Human Research Program: Hazards',
    href: 'https://www.nasa.gov/hrp/hazards/',
  },
  {
    label: 'NASA Human Research Program: Risks',
    href: 'https://www.nasa.gov/hrp/risks/',
  },
  {
    label: 'NASA ongoing HRP research',
    href: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
  },
  {
    label: 'Canadian Space Agency: Monitoring radiation for astronaut health',
    href: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp',
  },
  {
    label: 'Canadian Space Agency: Why conduct science experiments in space?',
    href: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp',
  },
]

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900">
      <header className="relative z-20 border-b border-sky-100/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <a href="#home" aria-label="Astro-Salud home" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-700">
              <Activity aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="font-mono text-xs font-bold leading-relaxed tracking-[0.14em] text-slate-800">
              ASTRO-SALUD
              <span className="block text-[10px] tracking-[0.22em] text-sky-700">FOR GOOD LIFE</span>
            </span>
          </a>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#home" className="transition hover:text-sky-700">Home</a>
            <a href="#health" className="transition hover:text-sky-700">Health approach</a>
            <a href="#spaceflight-health-title" className="transition hover:text-sky-700">NASA research</a>
            <a href="#mission" className="transition hover:text-sky-700">Mission</a>
          </nav>

          <button
            type="button"
            onClick={onEnterDashboard}
            className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:-translate-y-0.5 hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:px-5 sm:text-sm"
          >
            Open health dashboard
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main id="home" className="relative isolate">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -12, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-[12%] top-12 hidden h-24 w-24 rounded-full border border-white/80 bg-white/30 md:block"
          />
        </div>

        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:min-h-[650px] lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' }}
            className="relative z-10"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-sky-800 shadow-sm">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              HEALTHCARE FOR HUMAN SPACEFLIGHT
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Caring for the people who
              <span className="text-sky-600"> explore beyond Earth.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Astro-Salud brings crew health profiles, vital trends, and medical alerts together to support informed care throughout a space mission.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onEnterDashboard}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-sky-700/20 transition hover:-translate-y-0.5 hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                Explore crew health
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
              <a
                href="#health"
                className="rounded-xl border border-sky-200 bg-white/80 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-white"
              >
                Learn about the platform
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />Crew-centered monitoring</span>
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-500" />Mission health insights</span>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, x: 18 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.1, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-2xl"
          >
            <div className="relative overflow-hidden rounded-[2rem] border-[8px] border-white bg-sky-100 shadow-[0_24px_70px_rgba(27,102,142,0.16)] sm:border-[12px]">
              <motion.img
                src="https://assets.spaceappschallenge.org/media/images/Astronaut_exercise_2.2e16d0ba.fill-785x660.jpg"
                alt="Astronaut exercising in a spacecraft while health data is displayed on a nearby monitor and Earth is visible through a window."
                className="h-[340px] w-full object-cover sm:h-[430px] lg:h-[490px]"
                initial={reduceMotion ? false : { scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 1.1, ease: 'easeOut' }}
              />
              <div aria-hidden="true" className="absolute inset-0 bg-slate-950/10" />
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur sm:bottom-7 sm:left-7 sm:right-auto sm:w-[290px]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <HeartPulse aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Crew health, in context</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">Wellbeing supports mission readiness</p>
                  </div>
                </div>
                <div className="mt-4 flex h-8 items-end gap-1.5" aria-hidden="true">
                  {[35, 54, 43, 76, 57, 91, 67, 82, 61, 95, 73, 88].map((height, index) => (
                    <motion.span
                      key={index}
                      animate={reduceMotion ? undefined : { height: [`${height}%`, `${Math.max(20, height - 14)}%`, `${height}%`] }}
                      transition={{ duration: 2.4, delay: index * 0.06, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex-1 rounded-full bg-sky-600"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
            <p className="mt-3 text-right text-[10px] leading-relaxed text-slate-500">
              Image: NASA Space Apps Challenge, “Create Health Monitoring Software for Astronauts on Space Missions.”{' '}
              <a
                href="https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-900"
              >
                View challenge
              </a>
            </p>
          </motion.div>
        </section>

        <section id="health" className="border-y border-sky-100 bg-white/75">
          <div className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:px-8 md:grid-cols-3">
            {healthFeatures.map(({ icon: Icon, title, detail }, index) => (
              <motion.article
                key={title}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.08 }}
                className="flex gap-4 rounded-2xl p-4 transition hover:bg-sky-50/80"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-semibold text-slate-900">{title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{detail}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section aria-labelledby="spaceflight-health-title" className="border-b border-sky-100 bg-sky-50/60">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">NASA / CSA research context</p>
              <h2 id="spaceflight-health-title" className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Health considerations for human spaceflight
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                NASA identifies five connected hazards: space radiation, isolation and confinement, distance from Earth,
                gravity fields, and hostile or closed environments. Research helps characterize related risks and develop
                countermeasures; it does not determine an individual crew member&apos;s diagnosis.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {spaceflightHazards.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : index * 0.05 }}
                  className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.detail}</p>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-xs font-semibold text-sky-700 underline decoration-sky-200 underline-offset-4 hover:text-sky-900"
                  >
                    {item.source}
                  </a>
                </motion.article>
              ))}
            </div>

            <p className="mt-5 rounded-xl border border-sky-100 bg-white px-4 py-3 text-sm leading-relaxed text-slate-600">
              NASA also researches related health risks such as vestibular changes, cardiovascular adaptations,
              musculoskeletal fitness, altered immune responses, and spaceflight-associated neuro-ocular syndrome (SANS).
              {' '}
              <a
                href="https://www.nasa.gov/hrp/risks/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-sky-700 underline decoration-sky-200 underline-offset-4 hover:text-sky-900"
              >
                Explore NASA risks
              </a>
              {' '}and{' '}
              <a
                href="https://www.nasa.gov/hrp/ongoing-hrp-research/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-sky-700 underline decoration-sky-200 underline-offset-4 hover:text-sky-900"
              >
                ongoing research
              </a>
              , including work on sleep, activity, and wellbeing.
            </p>

            <div className="mt-8 rounded-2xl border border-sky-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900">Research and source links</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                The CSA reports a $5.5 million contract for continued development of the Canadian Active Neutron
                Spectrometer. Its ISS science overview describes how space experiments contribute to safer space travel.
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {agencySources.map((source) => (
                  <li key={source.href}>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-sky-700 underline decoration-sky-200 underline-offset-4 hover:text-sky-900"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              These references describe population-level risks and research. Astro-Salud&apos;s individual crew histories,
              vital readings, alerts, and care notes are simulated demo data and are not NASA records or clinical diagnoses.
            </p>
          </div>
        </section>

        <section id="mission" className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Built for the mission ahead</p>
            <p className="mt-2 text-sm text-slate-600">A simulated crew health platform informed by published NASA and Canadian Space Agency research.</p>
          </div>
          <button
            type="button"
            onClick={onEnterDashboard}
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-sky-700 transition hover:gap-3 hover:text-sky-900"
          >
            Enter Astro-Salud
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </section>
      </main>
    </div>
  )
}
