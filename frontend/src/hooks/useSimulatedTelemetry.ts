import { useEffect, useState } from 'react'

export interface LiveVitals {
  heartRate: number
  spo2: number
  temperature: number
  hydration: number
  activity: number
  neuralSync: number
  updatedAt: string
  history: LiveVitalsSample[]
}

export interface LiveVitalsSample {
  time: string
  heartRate: number
  spo2: number
  temperature: number
  hydration: number
  activity: number
  neuralSync: number
}

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function drift(value: number, amount: number, min: number, max: number) {
  const next = value + (Math.random() * 2 - 1) * amount
  return Math.min(max, Math.max(min, next))
}

export default function useSimulatedTelemetry() {
  const [vitals, setVitals] = useState<LiveVitals>({
    heartRate: 72,
    spo2: 99.2,
    temperature: 36.8,
    hydration: 91,
    activity: 64,
    neuralSync: 98,
    updatedAt: timestamp(),
    history: [],
  })

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setVitals((current) => {
        const next = {
          heartRate: Math.round(drift(current.heartRate, 2, 60, 100)),
          spo2: Number(drift(current.spo2, 0.2, 97, 100).toFixed(1)),
          temperature: Number(drift(current.temperature, 0.05, 36.4, 37.2).toFixed(1)),
          hydration: Math.round(drift(current.hydration, 0.5, 80, 96)),
          activity: Math.round(drift(current.activity, 4, 35, 90)),
          neuralSync: Math.round(drift(current.neuralSync, 1, 94, 100)),
          updatedAt: timestamp(),
        }
        const sample: LiveVitalsSample = {
          time: next.updatedAt,
          heartRate: next.heartRate,
          spo2: next.spo2,
          temperature: next.temperature,
          hydration: next.hydration,
          activity: next.activity,
          neuralSync: next.neuralSync,
        }

        return { ...next, history: [...current.history, sample].slice(-12) }
      })
    }, 2000)

    return () => window.clearInterval(intervalId)
  }, [])

  return vitals
}
