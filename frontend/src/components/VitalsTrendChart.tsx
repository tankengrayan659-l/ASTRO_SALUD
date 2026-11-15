import { useMemo, useState } from 'react'
import { Activity, ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import type { LiveVitals, LiveVitalsSample } from '../hooks/useSimulatedTelemetry'

type MetricId = 'heartRate' | 'oxygen' | 'temperature'
type TimeRange = 24 | 72

const observations = [
  { time: '-72h', heartRate: 68, oxygen: 98.8, temperature: 36.6 },
  { time: '-66h', heartRate: 72, oxygen: 99.0, temperature: 36.7 },
  { time: '-60h', heartRate: 71, oxygen: 99.1, temperature: 36.7 },
  { time: '-54h', heartRate: 74, oxygen: 98.9, temperature: 36.8 },
  { time: '-48h', heartRate: 69, oxygen: 99.2, temperature: 36.6 },
  { time: '-42h', heartRate: 76, oxygen: 99.0, temperature: 36.8 },
  { time: '-36h', heartRate: 80, oxygen: 98.7, temperature: 36.9 },
  { time: '-30h', heartRate: 73, oxygen: 99.3, temperature: 36.8 },
  { time: '-24h', heartRate: 72, oxygen: 99.1, temperature: 36.7 },
  { time: '-18h', heartRate: 70, oxygen: 99.2, temperature: 36.8 },
  { time: '-12h', heartRate: 75, oxygen: 99.4, temperature: 36.9 },
  { time: '-6h', heartRate: 74, oxygen: 99.1, temperature: 36.8 },
  { time: 'Now', heartRate: 72, oxygen: 99.2, temperature: 36.8 },
]

const metrics: Record<MetricId, {
  label: string
  shortLabel: string
  unit: string
  precision: number
  color: string
  targetMin: number
  targetMax: number
  normalText: string
}> = {
  heartRate: {
    label: 'Heart rate',
    shortLabel: 'HR',
    unit: 'bpm',
    precision: 0,
    color: '#0284c7',
    targetMin: 60,
    targetMax: 100,
    normalText: '60–100 bpm',
  },
  oxygen: {
    label: 'Blood oxygen',
    shortLabel: 'SpO₂',
    unit: '%',
    precision: 1,
    color: '#0891b2',
    targetMin: 95,
    targetMax: 100,
    normalText: '≥95%',
  },
  temperature: {
    label: 'Core temperature',
    shortLabel: 'Temp',
    unit: '°C',
    precision: 1,
    color: '#4f46e5',
    targetMin: 36.1,
    targetMax: 37.2,
    normalText: '36.1–37.2 °C',
  },
}

const chart = { width: 720, height: 280, left: 58, right: 18, top: 18, bottom: 42 }

function formatValue(value: number, precision: number) {
  return value.toFixed(precision)
}

export default function VitalsTrendChart({ liveVitals }: { liveVitals: LiveVitals }) {
  const [selectedMetric, setSelectedMetric] = useState<MetricId>('heartRate')
  const [timeRange, setTimeRange] = useState<TimeRange>(72)
  const metric = metrics[selectedMetric]

  const sample = useMemo(() => {
    const sampleLimit = timeRange === 24 ? 5 : 13
    const liveSamples = liveVitals.history.slice(-sampleLimit)
    const historicalCount = sampleLimit - Math.max(liveSamples.length, 1)
    const historical = timeRange === 24
      ? observations.slice(-(historicalCount + 1), -1)
      : observations.slice(0, -1).slice(-historicalCount)
    const stream = liveSamples.length
      ? liveSamples.map((point: LiveVitalsSample) => ({
          time: point.time,
          heartRate: point.heartRate,
          oxygen: point.spo2,
          temperature: point.temperature,
        }))
      : [{
          time: liveVitals.updatedAt,
          heartRate: liveVitals.heartRate,
          oxygen: liveVitals.spo2,
          temperature: liveVitals.temperature,
        }]

    return [
      ...historical,
      ...stream,
    ]
  }, [liveVitals, timeRange])

  const values = sample.map((point) => point[selectedMetric])
  const latest = values[values.length - 1]
  const first = values[0]
  const average = values.reduce((sum, value) => sum + value, 0) / values.length
  const minimum = Math.min(...values)
  const maximum = Math.max(...values)
  const delta = latest - first
  const allInTarget = values.every((value) => value >= metric.targetMin && value <= metric.targetMax)

  const rawMin = Math.min(minimum, metric.targetMin)
  const rawMax = Math.max(maximum, metric.targetMax)
  const padding = (rawMax - rawMin) * 0.12
  const yMin = rawMin - padding
  const yMax = rawMax + padding
  const plotWidth = chart.width - chart.left - chart.right
  const plotHeight = chart.height - chart.top - chart.bottom
  const xFor = (index: number) => chart.left + (index / Math.max(sample.length - 1, 1)) * plotWidth
  const yFor = (value: number) => chart.top + ((yMax - value) / (yMax - yMin)) * plotHeight
  const linePath = sample.map((point, index) =>
    `${index === 0 ? 'M' : 'L'} ${xFor(index)} ${yFor(point[selectedMetric])}`,
  ).join(' ')
  const areaPath = `${linePath} L ${xFor(sample.length - 1)} ${chart.top + plotHeight} L ${xFor(0)} ${chart.top + plotHeight} Z`
  const ticks = Array.from({ length: 5 }, (_, index) => yMin + ((yMax - yMin) * index) / 4).reverse()

  return (
    <section aria-labelledby="vitals-trend-title" className="rounded-[28px] border border-sky-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-sky-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-sky-600" />
            Simulated live sensor feed · updates every 2 seconds
          </p>
          <h2 id="vitals-trend-title" className="mt-1 text-2xl font-semibold text-slate-900">Vitals trend analysis</h2>
          <p className="mt-1 text-xs text-slate-500">Changing demo values only; no wearable or patient sensor is connected.</p>
        </div>
        <div className="inline-flex w-fit rounded-full border border-sky-100 bg-sky-50 p-1" aria-label="Select analysis period">
          {([24, 72] as const).map((range) => (
            <button
              key={range}
              type="button"
              aria-pressed={timeRange === range}
              onClick={() => setTimeRange(range)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                timeRange === range ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-sky-800'
              }`}
            >
              {range}h
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Choose vital sign">
        {(Object.keys(metrics) as MetricId[]).map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={selectedMetric === id}
            onClick={() => setSelectedMetric(id)}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              selectedMetric === id
                ? 'border-sky-200 bg-sky-50 text-sky-800'
                : 'border-transparent bg-slate-50 text-slate-500 hover:border-sky-100 hover:text-sky-700'
            }`}
          >
            {metrics[id].label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl bg-sky-50/80 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Latest</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {formatValue(latest, metric.precision)} <span className="text-xs font-medium text-slate-500">{metric.unit}</span>
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Period average</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {formatValue(average, metric.precision)} <span className="text-xs font-medium text-slate-500">{metric.unit}</span>
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Observed range</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {formatValue(minimum, metric.precision)}–{formatValue(maximum, metric.precision)}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Change</p>
          <p className="mt-1 flex items-center gap-1 text-xl font-bold text-slate-900">
            {delta > 0 ? <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-sky-700" /> : delta < 0 ? <ArrowDownRight aria-hidden="true" className="h-4 w-4 text-sky-700" /> : <Minus aria-hidden="true" className="h-4 w-4 text-slate-500" />}
            {delta > 0 ? '+' : ''}{formatValue(delta, metric.precision)} <span className="text-xs font-medium text-slate-500">{metric.unit}</span>
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-sky-100 bg-[#f7fbfe] p-2 sm:p-4">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2 px-2 pt-2">
          <p className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: metric.color }} />
            {metric.label} <span className="font-normal text-slate-500">({metric.unit})</span>
          </p>
          <p className="text-[10px] text-slate-500">Reference range: {metric.normalText}</p>
        </div>

        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          role="img"
          aria-label={`${metric.label} trend over the last ${timeRange} hours. Latest ${formatValue(latest, metric.precision)} ${metric.unit}, average ${formatValue(average, metric.precision)} ${metric.unit}, range ${formatValue(minimum, metric.precision)} to ${formatValue(maximum, metric.precision)}.`}
          className="block h-auto max-h-[360px] w-full overflow-visible"
        >
          <rect
            x={chart.left}
            y={yFor(Math.min(metric.targetMax, yMax))}
            width={plotWidth}
            height={Math.max(0, yFor(Math.max(metric.targetMin, yMin)) - yFor(Math.min(metric.targetMax, yMax)))}
            rx="4"
            fill="#dff3fb"
            opacity="0.8"
          />
          {ticks.map((tick, index) => (
            <g key={index}>
              <line
                x1={chart.left}
                x2={chart.width - chart.right}
                y1={yFor(tick)}
                y2={yFor(tick)}
                stroke="#dbe8ef"
                strokeDasharray="4 5"
              />
              <text x={chart.left - 10} y={yFor(tick) + 4} textAnchor="end" fill="#71879a" fontSize="10">
                {formatValue(tick, metric.precision)}
              </text>
            </g>
          ))}
          <path d={areaPath} fill="#dff3fb" opacity="0.7" />
          <path d={linePath} fill="none" stroke={metric.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {sample.map((point, index) => (
            <g key={point.time}>
              <circle cx={xFor(index)} cy={yFor(point[selectedMetric])} r="9" fill={metric.color} opacity="0.12" />
              <circle cx={xFor(index)} cy={yFor(point[selectedMetric])} r="4" fill="white" stroke={metric.color} strokeWidth="2.5">
                <title>{`${point.time}: ${formatValue(point[selectedMetric], metric.precision)} ${metric.unit}`}</title>
              </circle>
              {(index === 0 || index === sample.length - 1 || index === Math.floor((sample.length - 1) / 2)) && <text
                x={xFor(index)}
                y={chart.height - 13}
                textAnchor="middle"
                fill="#71879a"
                fontSize="10"
              >
                {point.time}
              </text>}
            </g>
          ))}
          <line
            x1={chart.left}
            x2={chart.width - chart.right}
            y1={yFor(average)}
            y2={yFor(average)}
            stroke="#64748b"
            strokeDasharray="5 5"
            opacity="0.65"
          />
        </svg>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-2 pb-2 text-[10px] text-slate-500">
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-600" />Observed readings</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 border-t border-dashed border-slate-500" />Period average</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm bg-sky-100" />Reference range</span>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700">
          <Activity aria-hidden="true" className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-semibold text-slate-900">
            {timeRange}-hour summary · {allInTarget ? 'within reference range' : 'outside reference range'} · latest simulated sample at {liveVitals.updatedAt}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            {metric.label} readings ranged from {formatValue(minimum, metric.precision)} to {formatValue(maximum, metric.precision)} {metric.unit}, averaging {formatValue(average, metric.precision)} {metric.unit}. The latest value is {delta > 0 ? 'up' : delta < 0 ? 'down' : 'unchanged'} by {formatValue(Math.abs(delta), metric.precision)} {metric.unit} versus the start of this selected period. This is a descriptive summary of simulated samples, not a medical assessment.
          </p>
        </div>
      </div>
    </section>
  )
}
