import React, { useState, useEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { motion, useReducedMotion } from 'framer-motion'
import type { LiveVitals } from '../../hooks/useSimulatedTelemetry'
import {
  Activity,
  ArrowLeft,
  HeartPulse,
  Rotate3d,
  ShieldAlert,
  Wind,
  RefreshCw,
  Thermometer,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Info,
  Search,
  Bell,
  Calendar,
  FileText,
  UserPlus,
  Heart,
  Crosshair,
  Sliders
} from 'lucide-react'

// --- Types & Data Definitions ---

type Severity = 'NOMINAL' | 'WATCH' | 'ELEVATED'
type DisplayMode = 'hologram' | 'wireframe' | 'xray'

interface TelemetryPoint {
  time: string
  val: number
}

interface RegionData {
  id: string
  name: string
  system: string
  position: [number, number, number]
  cameraTarget: [number, number, number]
  cameraPos: [number, number, number]
  severity: Severity
  score: number
  finding: string
  source: string
  time: string
  history: TelemetryPoint[]
  metrics: { label: string; value: string; status: 'good' | 'warn' | 'alert' }[]
}

const crewMembers = [
  { id: 'RIVERA', name: 'LT. M. RIVERA', role: 'Commander', status: 'WATCH', avatar: 'MR', dob: '15 Jul, 1992', sex: 'Male', doctor: 'Dr. K. Nielsen' },
  { id: 'NIELSEN', name: 'DR. K. NIELSEN', role: 'Medical Officer', status: 'NOMINAL', avatar: 'KN', dob: '04 Nov, 1988', sex: 'Female', doctor: 'Self-Monitored' },
  { id: 'OSEI', name: 'M. OSEI', role: 'Payload Specialist', status: 'ELEVATED', avatar: 'MO', dob: '22 Mar, 1995', sex: 'Male', doctor: 'Dr. K. Nielsen' },
]

const initialRegions: Record<string, RegionData[]> = {
  RIVERA: [
    {
      id: 'brain',
      name: 'Neurological System',
      system: 'Cerebral cortex & vestibular balance',
      position: [0, 2.75, 0],
      cameraTarget: [0, 2.75, 0],
      cameraPos: [0, 2.85, 2.0],
      severity: 'WATCH',
      score: 84,
      finding: 'Transient vestibular asymmetry recorded post-EVA rotation sequence.',
      source: 'Neural Telemetry Array · EEG-09',
      time: '24 APR · 09:14 UTC',
      history: [
        { time: '04:00', val: 98 },
        { time: '06:00', val: 95 },
        { time: '08:00', val: 82 },
        { time: '09:00', val: 84 },
      ],
      metrics: [
        { label: 'Cognitive Latency', value: '184 ms', status: 'good' },
        { label: 'Vestibular Drift', value: '+4.2°', status: 'warn' },
        { label: 'ICP Index', value: '11.8 mmHg', status: 'good' },
      ],
    },
    {
      id: 'heart',
      name: 'Cardiovascular',
      system: 'Myocardial contractility & cardiac output',
      position: [0.12, 1.65, 0.22],
      cameraTarget: [0.1, 1.65, 0],
      cameraPos: [0.1, 1.65, 1.6],
      severity: 'NOMINAL',
      score: 96,
      finding: 'Sinus rhythm consistent with baseline athletic profile. No arrhythmia.',
      source: 'Subdermal Sensor Ring · ECG-02',
      time: '24 APR · 09:12 UTC',
      history: [
        { time: '04:00', val: 70 },
        { time: '06:00', val: 68 },
        { time: '08:00', val: 74 },
        { time: '09:00', val: 72 },
      ],
      metrics: [
        { label: 'Resting HR', value: '72 BPM', status: 'good' },
        { label: 'Stroke Volume', value: '88 mL', status: 'good' },
        { label: 'Mean Arterial BP', value: '92 mmHg', status: 'good' },
      ],
    },
    {
      id: 'respiratory',
      name: 'Respiratory System',
      system: 'Pulmonary alveoli & oxygen saturation',
      position: [-0.22, 1.75, 0.18],
      cameraTarget: [-0.2, 1.75, 0],
      cameraPos: [-0.2, 1.75, 1.6],
      severity: 'NOMINAL',
      score: 98,
      finding: 'Optimal lung gas exchange. Microgravity oxygenation saturation nominal.',
      source: 'Pulse Oximetry Node · OXI-04',
      time: '24 APR · 09:11 UTC',
      history: [
        { time: '04:00', val: 99 },
        { time: '06:00', val: 99 },
        { time: '08:00', val: 98 },
        { time: '09:00', val: 99.2 },
      ],
      metrics: [
        { label: 'SpO₂ Saturation', value: '99.2%', status: 'good' },
        { label: 'Respiration Rate', value: '14 RPM', status: 'good' },
        { label: 'Tidal Volume', value: '520 mL', status: 'good' },
      ],
    },
    {
      id: 'musculoskeletal',
      name: 'Musculoskeletal',
      system: 'Deltoid, pectoral & shoulder group',
      position: [0.72, 1.7, 0.05],
      cameraTarget: [0.6, 1.7, 0],
      cameraPos: [1.0, 1.7, 1.8],
      severity: 'NOMINAL',
      score: 92,
      finding: 'Deltoid and biceps isometric force targets met during workout.',
      source: 'ARED Load Cell · KIN-88',
      time: '24 APR · 08:40 UTC',
      history: [
        { time: '04:00', val: 91 },
        { time: '06:00', val: 92 },
        { time: '08:00', val: 92 },
        { time: '09:00', val: 92 },
      ],
      metrics: [
        { label: 'Right Shoulder Torque', value: '42 Nm', status: 'good' },
        { label: 'Grip Strength', value: '54 kg', status: 'good' },
        { label: 'Bone Density Index', value: '1.02 T', status: 'good' },
      ],
    },
    {
      id: 'digestive',
      name: 'Gastrointestinal',
      system: 'Abdomen, fluid balance & metabolism',
      position: [0, 1.05, 0.22],
      cameraTarget: [0, 1.05, 0],
      cameraPos: [0, 1.05, 1.7],
      severity: 'WATCH',
      score: 76,
      finding: 'Hydration deficit detected (-450 mL below target). Fluid intake logged low.',
      source: 'Biomarker Hydration Monitor · HYD-01',
      time: '24 APR · 08:56 UTC',
      history: [
        { time: '04:00', val: 88 },
        { time: '06:00', val: 82 },
        { time: '08:00', val: 75 },
        { time: '09:00', val: 76 },
      ],
      metrics: [
        { label: 'Hydration Intake', value: '1.85 L', status: 'warn' },
        { label: 'Serum Osmolality', value: '298 mOsm', status: 'warn' },
        { label: 'Core Gut Temp', value: '37.1 °C', status: 'good' },
      ],
    },
    {
      id: 'spine',
      name: 'Spinal Column',
      system: 'Lumbar spine & intervertebral discs',
      position: [0, 1.35, -0.28],
      cameraTarget: [0, 1.35, 0],
      cameraPos: [0, 1.35, -1.9],
      severity: 'NOMINAL',
      score: 94,
      finding: 'Spinal expansion (+2.1cm) nominal for microgravity duration.',
      source: 'Postural Strain Mesh · STR-12',
      time: '24 APR · 08:40 UTC',
      history: [
        { time: '04:00', val: 95 },
        { time: '06:00', val: 94 },
        { time: '08:00', val: 94 },
        { time: '09:00', val: 94 },
      ],
      metrics: [
        { label: 'Lumbar Strain', value: 'Low (4%)', status: 'good' },
        { label: 'Spinal Lengthening', value: '+2.1 cm', status: 'good' },
        { label: 'Paravertebral Tone', value: 'Normal', status: 'good' },
      ],
    },
    {
      id: 'lower_limbs',
      name: 'Lower Extremities',
      system: 'Quadriceps, femoral artery & legs',
      position: [-0.3, -0.6, 0.1],
      cameraTarget: [0, -0.6, 0],
      cameraPos: [0, -0.6, 2.2],
      severity: 'NOMINAL',
      score: 91,
      finding: 'Venous return compression therapy operating effectively. Zero edema.',
      source: 'Vascular Doppler Patch · LEG-07',
      time: '24 APR · 08:40 UTC',
      history: [
        { time: '04:00', val: 90 },
        { time: '06:00', val: 91 },
        { time: '08:00', val: 91 },
        { time: '09:00', val: 91 },
      ],
      metrics: [
        { label: 'Femoral Flow Vmax', value: '62 cm/s', status: 'good' },
        { label: 'Soleus Calf Density', value: '98.5%', status: 'good' },
        { label: 'Knee Joint Fluid', value: 'Optimal', status: 'good' },
      ],
    },
    {
      id: 'sleep',
      name: 'Circadian & Recovery',
      system: 'Deep REM phase & melatonin cycle',
      position: [0, 0.45, 0],
      cameraTarget: [0, 0.45, 0],
      cameraPos: [0, 0.45, 1.8],
      severity: 'WATCH',
      score: 68,
      finding: 'REM sleep fraction reduced to 14% due to orbital sunrise acoustic spikes.',
      source: 'Polysomnography Array · SLEEP-03',
      time: '24 APR · 07:30 UTC',
      history: [
        { time: '04:00', val: 80 },
        { time: '06:00', val: 74 },
        { time: '08:00', val: 66 },
        { time: '09:00', val: 68 },
      ],
      metrics: [
        { label: 'Sleep Efficiency', value: '74.2%', status: 'warn' },
        { label: 'Deep REM Sleep', value: '52 min', status: 'warn' },
        { label: 'Cortisol Awakening', value: 'Slight Elevated', status: 'warn' },
      ],
    },
  ],
  NIELSEN: [
    {
      id: 'brain',
      name: 'Neurological System',
      system: 'Cerebral cortex & vestibular balance',
      position: [0, 2.75, 0],
      cameraTarget: [0, 2.75, 0],
      cameraPos: [0, 2.85, 2.0],
      severity: 'NOMINAL',
      score: 99,
      finding: 'Cognitive acuity top percentile. Zero vestibular adaptation syndrome.',
      source: 'Neural Telemetry Array · EEG-09',
      time: '24 APR · 09:14 UTC',
      history: [
        { time: '04:00', val: 99 },
        { time: '06:00', val: 99 },
        { time: '08:00', val: 99 },
        { time: '09:00', val: 100 },
      ],
      metrics: [
        { label: 'Cognitive Latency', value: '142 ms', status: 'good' },
        { label: 'Vestibular Drift', value: '+0.1°', status: 'good' },
        { label: 'ICP Index', value: '10.2 mmHg', status: 'good' },
      ],
    },
    {
      id: 'heart',
      name: 'Cardiovascular',
      system: 'Myocardial contractility & cardiac output',
      position: [0.12, 1.65, 0.22],
      cameraTarget: [0.1, 1.65, 0],
      cameraPos: [0.1, 1.65, 1.6],
      severity: 'NOMINAL',
      score: 98,
      finding: 'Optimal cardiac output. Baseline resting state stable.',
      source: 'Subdermal Sensor Ring · ECG-02',
      time: '24 APR · 09:12 UTC',
      history: [
        { time: '04:00', val: 97 },
        { time: '06:00', val: 98 },
        { time: '08:00', val: 98 },
        { time: '09:00', val: 98 },
      ],
      metrics: [
        { label: 'Resting HR', value: '64 BPM', status: 'good' },
        { label: 'Stroke Volume', value: '94 mL', status: 'good' },
        { label: 'Mean Arterial BP', value: '88 mmHg', status: 'good' },
      ],
    },
    {
      id: 'respiratory',
      name: 'Respiratory System',
      system: 'Pulmonary alveoli & oxygen saturation',
      position: [-0.22, 1.75, 0.18],
      cameraTarget: [-0.2, 1.75, 0],
      cameraPos: [-0.2, 1.75, 1.6],
      severity: 'NOMINAL',
      score: 97,
      finding: 'Respiration rate consistent at 12 RPM. High compliance.',
      source: 'Pulse Oximetry Node · OXI-04',
      time: '24 APR · 09:11 UTC',
      history: [
        { time: '04:00', val: 98 },
        { time: '06:00', val: 97 },
        { time: '08:00', val: 97 },
        { time: '09:00', val: 97 },
      ],
      metrics: [
        { label: 'SpO₂ Saturation', value: '99.8%', status: 'good' },
        { label: 'Respiration Rate', value: '12 RPM', status: 'good' },
        { label: 'Tidal Volume', value: '550 mL', status: 'good' },
      ],
    },
    {
      id: 'musculoskeletal',
      name: 'Musculoskeletal',
      system: 'Deltoid, pectoral & shoulder group',
      position: [0.72, 1.7, 0.05],
      cameraTarget: [0.6, 1.7, 0],
      cameraPos: [1.0, 1.7, 1.8],
      severity: 'NOMINAL',
      score: 95,
      finding: 'Skeletal mass index fully maintained via resistive exercise.',
      source: 'ARED Load Cell · KIN-88',
      time: '24 APR · 08:40 UTC',
      history: [
        { time: '04:00', val: 94 },
        { time: '06:00', val: 95 },
        { time: '08:00', val: 95 },
        { time: '09:00', val: 95 },
      ],
      metrics: [
        { label: 'Right Shoulder Torque', value: '45 Nm', status: 'good' },
        { label: 'Grip Strength', value: '58 kg', status: 'good' },
        { label: 'Bone Density Index', value: '1.05 T', status: 'good' },
      ],
    },
    {
      id: 'digestive',
      name: 'Gastrointestinal',
      system: 'Abdomen, fluid balance & metabolism',
      position: [0, 1.05, 0.22],
      cameraTarget: [0, 1.05, 0],
      cameraPos: [0, 1.05, 1.7],
      severity: 'NOMINAL',
      score: 95,
      finding: 'Hydration level balanced (+120 mL buffer). Metabolism nominal.',
      source: 'Biomarker Hydration Monitor · HYD-01',
      time: '24 APR · 08:56 UTC',
      history: [
        { time: '04:00', val: 94 },
        { time: '06:00', val: 95 },
        { time: '08:00', val: 95 },
        { time: '09:00', val: 95 },
      ],
      metrics: [
        { label: 'Hydration Intake', value: '2.45 L', status: 'good' },
        { label: 'Serum Osmolality', value: '286 mOsm', status: 'good' },
        { label: 'Core Gut Temp', value: '36.8 °C', status: 'good' },
      ],
    },
    {
      id: 'spine',
      name: 'Spinal Column',
      system: 'Lumbar spine & intervertebral discs',
      position: [0, 1.35, -0.28],
      cameraTarget: [0, 1.35, 0],
      cameraPos: [0, 1.35, -1.9],
      severity: 'NOMINAL',
      score: 96,
      finding: 'Spinal curvature within nominal microgravity envelope.',
      source: 'Postural Strain Mesh · STR-12',
      time: '24 APR · 08:40 UTC',
      history: [
        { time: '04:00', val: 96 },
        { time: '06:00', val: 96 },
        { time: '08:00', val: 96 },
        { time: '09:00', val: 96 },
      ],
      metrics: [
        { label: 'Lumbar Strain', value: 'Minimal (2%)', status: 'good' },
        { label: 'Spinal Lengthening', value: '+1.8 cm', status: 'good' },
        { label: 'Paravertebral Tone', value: 'Balanced', status: 'good' },
      ],
    },
    {
      id: 'lower_limbs',
      name: 'Lower Extremities',
      system: 'Quadriceps, femoral artery & legs',
      position: [-0.3, -0.6, 0.1],
      cameraTarget: [0, -0.6, 0],
      cameraPos: [0, -0.6, 2.2],
      severity: 'NOMINAL',
      score: 94,
      finding: 'Normal capillary refill and leg muscle tone.',
      source: 'Vascular Doppler Patch · LEG-07',
      time: '24 APR · 08:40 UTC',
      history: [
        { time: '04:00', val: 94 },
        { time: '06:00', val: 94 },
        { time: '08:00', val: 94 },
        { time: '09:00', val: 94 },
      ],
      metrics: [
        { label: 'Femoral Flow Vmax', value: '65 cm/s', status: 'good' },
        { label: 'Soleus Calf Density', value: '99.1%', status: 'good' },
        { label: 'Knee Joint Fluid', value: 'Optimal', status: 'good' },
      ],
    },
    {
      id: 'sleep',
      name: 'Circadian & Recovery',
      system: 'Deep REM phase & melatonin cycle',
      position: [0, 0.45, 0],
      cameraTarget: [0, 0.45, 0],
      cameraPos: [0, 0.45, 1.8],
      severity: 'NOMINAL',
      score: 92,
      finding: 'Deep sleep phase: 1h 45m achieved. High recovery score.',
      source: 'Polysomnography Array · SLEEP-03',
      time: '24 APR · 07:30 UTC',
      history: [
        { time: '04:00', val: 90 },
        { time: '06:00', val: 92 },
        { time: '08:00', val: 92 },
        { time: '09:00', val: 92 },
      ],
      metrics: [
        { label: 'Sleep Efficiency', value: '88.5%', status: 'good' },
        { label: 'Deep REM Sleep', value: '105 min', status: 'good' },
        { label: 'Cortisol Awakening', value: 'Baseline', status: 'good' },
      ],
    },
  ],
  OSEI: [
    {
      id: 'brain',
      name: 'Neurological System',
      system: 'Cerebral cortex & vestibular balance',
      position: [0, 2.75, 0],
      cameraTarget: [0, 2.75, 0],
      cameraPos: [0, 2.85, 2.0],
      severity: 'NOMINAL',
      score: 91,
      finding: 'Mild cognitive fatigue logged near end of 12h EVA shift.',
      source: 'Neural Telemetry Array · EEG-09',
      time: '24 APR · 09:14 UTC',
      history: [
        { time: '04:00', val: 95 },
        { time: '06:00', val: 93 },
        { time: '08:00', val: 90 },
        { time: '09:00', val: 91 },
      ],
      metrics: [
        { label: 'Cognitive Latency', value: '210 ms', status: 'good' },
        { label: 'Vestibular Drift', value: '+1.5°', status: 'good' },
        { label: 'ICP Index', value: '12.1 mmHg', status: 'good' },
      ],
    },
    {
      id: 'heart',
      name: 'Cardiovascular',
      system: 'Myocardial contractility & cardiac output',
      position: [0.12, 1.65, 0.22],
      cameraTarget: [0.1, 1.65, 0],
      cameraPos: [0.1, 1.65, 1.6],
      severity: 'WATCH',
      score: 79,
      finding: 'Elevated heart rate spike during joint manual torque test.',
      source: 'Subdermal Sensor Ring · ECG-02',
      time: '24 APR · 09:12 UTC',
      history: [
        { time: '04:00', val: 82 },
        { time: '06:00', val: 88 },
        { time: '08:00', val: 78 },
        { time: '09:00', val: 79 },
      ],
      metrics: [
        { label: 'Resting HR', value: '88 BPM', status: 'warn' },
        { label: 'Stroke Volume', value: '82 mL', status: 'good' },
        { label: 'Mean Arterial BP', value: '98 mmHg', status: 'warn' },
      ],
    },
    {
      id: 'respiratory',
      name: 'Respiratory System',
      system: 'Pulmonary alveoli & oxygen saturation',
      position: [-0.22, 1.75, 0.18],
      cameraTarget: [-0.2, 1.75, 0],
      cameraPos: [-0.2, 1.75, 1.6],
      severity: 'NOMINAL',
      score: 94,
      finding: 'Hypercapnia safety margin standard. CO2 scrubbers functioning.',
      source: 'Pulse Oximetry Node · OXI-04',
      time: '24 APR · 09:11 UTC',
      history: [
        { time: '04:00', val: 96 },
        { time: '06:00', val: 94 },
        { time: '08:00', val: 94 },
        { time: '09:00', val: 94 },
      ],
      metrics: [
        { label: 'SpO₂ Saturation', value: '98.5%', status: 'good' },
        { label: 'Respiration Rate', value: '18 RPM', status: 'good' },
        { label: 'Tidal Volume', value: '580 mL', status: 'good' },
      ],
    },
    {
      id: 'musculoskeletal',
      name: 'Musculoskeletal',
      system: 'Deltoid, pectoral & shoulder group',
      position: [0.72, 1.7, 0.05],
      cameraTarget: [0.6, 1.7, 0],
      cameraPos: [1.0, 1.7, 1.8],
      severity: 'ELEVATED',
      score: 54,
      finding: 'Acute right rotator cuff strain (Grade 1) post-heavy latch assembly.',
      source: 'ARED Load Cell & Strain Patch · KIN-88',
      time: '24 APR · 08:40 UTC',
      history: [
        { time: '04:00', val: 88 },
        { time: '06:00', val: 70 },
        { time: '08:00', val: 52 },
        { time: '09:00', val: 54 },
      ],
      metrics: [
        { label: 'Right Shoulder Torque', value: '24 Nm', status: 'alert' },
        { label: 'Supraspinatus Inflam', value: 'High', status: 'alert' },
        { label: 'Grip Strength', value: '38 kg', status: 'warn' },
      ],
    },
    {
      id: 'digestive',
      name: 'Gastrointestinal',
      system: 'Abdomen, fluid balance & metabolism',
      position: [0, 1.05, 0.22],
      cameraTarget: [0, 1.05, 0],
      cameraPos: [0, 1.05, 1.7],
      severity: 'NOMINAL',
      score: 90,
      finding: 'Digestive function nominal following meal pack 4.',
      source: 'Biomarker Hydration Monitor · HYD-01',
      time: '24 APR · 08:56 UTC',
      history: [
        { time: '04:00', val: 90 },
        { time: '06:00', val: 90 },
        { time: '08:00', val: 90 },
        { time: '09:00', val: 90 },
      ],
      metrics: [
        { label: 'Hydration Intake', value: '2.10 L', status: 'good' },
        { label: 'Serum Osmolality', value: '290 mOsm', status: 'good' },
        { label: 'Core Gut Temp', value: '36.9 °C', status: 'good' },
      ],
    },
    {
      id: 'spine',
      name: 'Spinal Column',
      system: 'Lumbar spine & intervertebral discs',
      position: [0, 1.35, -0.28],
      cameraTarget: [0, 1.35, 0],
      cameraPos: [0, 1.35, -1.9],
      severity: 'WATCH',
      score: 72,
      finding: 'L4-L5 localized lumbar tension noted during workload analysis.',
      source: 'Postural Strain Mesh · STR-12',
      time: '24 APR · 08:40 UTC',
      history: [
        { time: '04:00', val: 82 },
        { time: '06:00', val: 78 },
        { time: '08:00', val: 71 },
        { time: '09:00', val: 72 },
      ],
      metrics: [
        { label: 'Lumbar Strain', value: 'Moderate (18%)', status: 'warn' },
        { label: 'Spinal Lengthening', value: '+2.6 cm', status: 'good' },
        { label: 'Paravertebral Tone', value: 'Tight', status: 'warn' },
      ],
    },
    {
      id: 'lower_limbs',
      name: 'Lower Extremities',
      system: 'Quadriceps, femoral artery & legs',
      position: [-0.3, -0.6, 0.1],
      cameraTarget: [0, -0.6, 0],
      cameraPos: [0, -0.6, 2.2],
      severity: 'NOMINAL',
      score: 92,
      finding: 'Lower limbs showing zero fluid shifts or localized pain.',
      source: 'Vascular Doppler Patch · LEG-07',
      time: '24 APR · 08:40 UTC',
      history: [
        { time: '04:00', val: 92 },
        { time: '06:00', val: 92 },
        { time: '08:00', val: 92 },
        { time: '09:00', val: 92 },
      ],
      metrics: [
        { label: 'Femoral Flow Vmax', value: '60 cm/s', status: 'good' },
        { label: 'Soleus Calf Density', value: '97.8%', status: 'good' },
        { label: 'Knee Joint Fluid', value: 'Optimal', status: 'good' },
      ],
    },
    {
      id: 'sleep',
      name: 'Circadian & Recovery',
      system: 'Deep REM phase & melatonin cycle',
      position: [0, 0.45, 0],
      cameraTarget: [0, 0.45, 0],
      cameraPos: [0, 0.45, 1.8],
      severity: 'NOMINAL',
      score: 89,
      finding: 'Rest period recovery completed successfully.',
      source: 'Polysomnography Array · SLEEP-03',
      time: '24 APR · 07:30 UTC',
      history: [
        { time: '04:00', val: 86 },
        { time: '06:00', val: 89 },
        { time: '08:00', val: 89 },
        { time: '09:00', val: 89 },
      ],
      metrics: [
        { label: 'Sleep Efficiency', value: '82.0%', status: 'good' },
        { label: 'Deep REM Sleep', value: '88 min', status: 'good' },
        { label: 'Cortisol Awakening', value: 'Baseline', status: 'good' },
      ],
    },
  ],
}

const severityBadgeStyles: Record<Severity, string> = {
  NOMINAL: 'border-emerald-400/40 bg-emerald-400/15 text-emerald-300',
  WATCH: 'border-amber-400/40 bg-amber-400/15 text-amber-300',
  ELEVATED: 'border-rose-500/40 bg-rose-500/15 text-rose-300',
}

const severityHexColor: Record<Severity, string> = {
  NOMINAL: '#16a34a',
  WATCH: '#eab308',
  ELEVATED: '#dc2626',
}

// --- Procedural full-body skeletal model ---

function createOrganicHumanGroup(mode: DisplayMode) {
  const root = new THREE.Group()
  const boneMat = new THREE.MeshStandardMaterial({
    color: mode === 'xray' ? 0x62d7f0 : mode === 'wireframe' ? 0x36b8dc : 0xd8e7e1,
    wireframe: mode === 'wireframe',
    roughness: 0.38,
    metalness: 0.08,
    emissive: mode === 'xray' ? 0x10556a : 0x263e35,
    emissiveIntensity: mode === 'xray' ? 0.42 : 0.12,
    transparent: mode === 'xray',
    opacity: mode === 'xray' ? 0.82 : 1,
  })
  const jointMat = new THREE.MeshStandardMaterial({
    color: mode === 'xray' ? 0x4bc5e4 : 0xb9d3c8,
    wireframe: mode === 'wireframe',
    roughness: 0.42,
    metalness: 0.05,
    emissive: mode === 'xray' ? 0x0d4c61 : 0x193e31,
    emissiveIntensity: 0.16,
  })
  const socketMat = new THREE.MeshBasicMaterial({ color: mode === 'xray' ? 0x08718b : 0x426b5d })
  const organHeartMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    roughness: 0.4,
    emissive: 0x880022,
    emissiveIntensity: 0.45,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  })
  const organLungMat = new THREE.MeshStandardMaterial({
    color: 0x48bca5,
    roughness: 0.4,
    emissive: 0x145f4a,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
  })
  const up = new THREE.Vector3(0, 1, 0)

  const addJoint = (position: [number, number, number], radius: number) => {
    const joint = new THREE.Mesh(new THREE.SphereGeometry(radius, 14, 12), jointMat)
    joint.position.set(...position)
    root.add(joint)
    return joint
  }

  const addBone = (
    start: [number, number, number],
    end: [number, number, number],
    radius: number,
  ) => {
    const startPoint = new THREE.Vector3(...start)
    const endPoint = new THREE.Vector3(...end)
    const direction = new THREE.Vector3().subVectors(endPoint, startPoint)
    const length = direction.length()
    const bone = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.78, radius, length, 10, 1),
      boneMat,
    )
    bone.position.copy(startPoint).add(endPoint).multiplyScalar(0.5)
    bone.quaternion.setFromUnitVectors(up, direction.normalize())
    root.add(bone)
    addJoint(start, radius * 1.05)
    addJoint(end, radius * 0.92)
    return bone
  }

  const addCurve = (points: [number, number, number][], radius: number, material = boneMat) => {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)))
    root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 18, radius, 7, false), material))
  }

  const addSphere = (
    position: [number, number, number],
    scale: [number, number, number],
    material: THREE.Material = boneMat,
  ) => {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), material)
    sphere.position.set(...position)
    sphere.scale.set(...scale)
    root.add(sphere)
    return sphere
  }

  // Skull and jaw
  addSphere([0, 2.78, 0], [0.29, 0.37, 0.27])
  addCurve(
    [[-0.2, 2.62, 0.08], [-0.16, 2.48, 0.16], [0, 2.44, 0.18], [0.16, 2.48, 0.16], [0.2, 2.62, 0.08]],
    0.035,
  )
  addSphere([-0.105, 2.82, 0.245], [0.07, 0.09, 0.035], socketMat)
  addSphere([0.105, 2.82, 0.245], [0.07, 0.09, 0.035], socketMat)
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.15, 5), jointMat)
  nose.position.set(0, 2.66, 0.29)
  nose.rotation.x = Math.PI / 2
  root.add(nose)
  addBone([0, 2.42, 0], [0, 2.18, 0], 0.065)

  // Vertebral column and rib cage
  for (let index = 0; index < 24; index++) {
    const y = 2.2 - index * 0.078
    addSphere([0, y, -0.035], [0.07, 0.045, 0.065], jointMat)
    if (index > 2 && index < 19 && index % 2 === 0) {
      addBone([0, y, -0.06], [0, y - 0.015, -0.16], 0.025)
    }
  }
  addBone([0, 2.12, 0.015], [0, 1.42, 0.12], 0.045)
  for (let rib = 0; rib < 8; rib++) {
    const y = 2.08 - rib * 0.085
    const width = 0.23 + Math.sin((rib / 8) * Math.PI) * 0.26
    for (const sign of [-1, 1]) {
      addCurve([
        [0, y, -0.04],
        [sign * width * 0.55, y + 0.075, 0.03],
        [sign * width, y + 0.015, 0.12],
        [sign * width * 0.82, y - 0.1, 0.17],
        [sign * width * 0.46, y - 0.15, 0.18],
      ], 0.025)
    }
  }

  // Clavicles, shoulders, arms, wrists, palms and fingers
  for (const sign of [-1, 1]) {
    addBone([0, 2.14, 0.02], [sign * 0.48, 2.12, 0.02], 0.045)
    addBone([sign * 0.48, 2.12, 0], [sign * 0.62, 2.02, 0], 0.085)
    addBone([sign * 0.62, 2.02, 0], [sign * 0.73, 1.48, 0.015], 0.075)
    addSphere([sign * 0.73, 1.48, 0.015], [0.095, 0.095, 0.09], jointMat)
    addBone([sign * 0.73, 1.48, 0.015], [sign * 0.82, 0.88, 0.035], 0.05)
    addBone([sign * 0.79, 1.46, -0.035], [sign * 0.88, 0.89, -0.035], 0.038)
    addBone([sign * 0.82, 0.88, 0.035], [sign * 0.86, 0.72, 0.08], 0.04)
    addBone([sign * 0.86, 0.72, 0.08], [sign * 0.88, 0.51, 0.1], 0.07)
    for (let finger = 0; finger < 5; finger++) {
      const spread = (finger - 2) * 0.045
      const start: [number, number, number] = [sign * (0.88 + spread), 0.54, 0.11]
      const middle: [number, number, number] = [sign * (0.9 + spread * 1.35), 0.39, 0.13]
      const tip: [number, number, number] = [sign * (0.91 + spread * 1.7), 0.25 + (finger === 2 ? 0.015 : 0), 0.13]
      addBone(start, middle, 0.018)
      addBone(middle, tip, 0.014)
    }
  }

  // Pelvis and sacrum
  addSphere([0, 0.33, -0.015], [0.14, 0.2, 0.12], jointMat)
  addCurve(
    [[-0.4, 0.52, -0.015], [-0.49, 0.36, 0.03], [-0.4, 0.12, 0.1], [-0.2, 0.04, 0.14], [0, 0.12, 0.15], [0.2, 0.04, 0.14], [0.4, 0.12, 0.1], [0.49, 0.36, 0.03], [0.4, 0.52, -0.015]],
    0.055,
  )
  for (const sign of [-1, 1]) {
    addBone([sign * 0.38, 0.48, 0], [sign * 0.25, 0.12, 0.06], 0.06)
  }

  // Femurs, kneecaps, tibias, fibulas and complete feet
  for (const sign of [-1, 1]) {
    const hip: [number, number, number] = [sign * 0.25, 0.13, 0.03]
    const knee: [number, number, number] = [sign * 0.29, -0.88, 0.04]
    const ankle: [number, number, number] = [sign * 0.31, -1.82, 0.02]
    addBone(hip, knee, 0.105)
    addSphere([sign * 0.29, -0.88, 0.09], [0.12, 0.13, 0.075], jointMat)
    addBone(knee, ankle, 0.065)
    addBone([sign * 0.39, -0.9, 0], [sign * 0.36, -1.8, -0.01], 0.036)
    addBone(ankle, [sign * 0.31, -1.94, 0.22], 0.07)
    addBone([sign * 0.31, -1.94, 0.22], [sign * 0.31, -1.97, 0.38], 0.045)
    for (let toe = 0; toe < 5; toe++) {
      const offset = (toe - 2) * 0.045
      const toeBase: [number, number, number] = [sign * (0.31 + offset), -1.95, 0.27]
      const toeTip: [number, number, number] = [sign * (0.31 + offset * 1.5), -1.96, toe === 2 ? 0.48 : 0.42]
      addBone(toeBase, toeTip, 0.018)
    }
  }

  if (mode !== 'wireframe') {
    const heart = addSphere([0.1, 1.68, 0.075], [0.095, 0.14, 0.075], organHeartMat)
    heart.renderOrder = 1
    const lungLeft = addSphere([-0.2, 1.77, -0.005], [0.12, 0.28, 0.07], organLungMat)
    const lungRight = addSphere([0.2, 1.77, -0.005], [0.12, 0.28, 0.07], organLungMat)
    lungLeft.renderOrder = 1
    lungRight.renderOrder = 1
  }

  return root
}

// --- Interactive 3D Canvas Component ---

function SkeletonCanvas({
  displayMode,
  selectedRegionId,
  regions,
  onSelectRegion,
  activeRegionDetails,
  onDismissRegionDetails,
  viewAngle,
}: {
  displayMode: DisplayMode
  selectedRegionId: string
  regions: RegionData[]
  onSelectRegion: (id: string) => void
  activeRegionDetails: RegionData | null
  onDismissRegionDetails: () => void
  viewAngle: 'front' | 'back'
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const modelGroupRef = useRef<THREE.Group | null>(null)
  const hotspotsGroupRef = useRef<THREE.Group | null>(null)

  const targetCamPos = useRef(new THREE.Vector3(0, 0.55, 7.2))
  const targetCamLookAt = useRef(new THREE.Vector3(0, 0.55, 0))
  const currentCamLookAt = useRef(new THREE.Vector3(0, 0.55, 0))

  const isDragging = useRef(false)
  const previousMouse = useRef({ x: 0, y: 0 })
  const rotationVel = useRef({ x: 0, y: 0 })
  const modelRotation = useRef({ x: 0, y: 0 })

  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null)
  const [rendererError, setRendererError] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (viewAngle === 'back') {
      modelRotation.current.y = Math.PI
    } else {
      modelRotation.current.y = 0
    }
  }, [viewAngle])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let scene: THREE.Scene | null = null
    let renderer: THREE.WebGLRenderer | null = null
    let animationFrameId = 0
    let ringMesh: THREE.Mesh | null = null
    let disposed = false
    const clock = new THREE.Clock()

    const cleanup = () => {
      disposed = true
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      renderer?.domElement.removeEventListener('webglcontextlost', handleContextLost)
      renderer?.domElement.remove()
      if (scene) {
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
            object.geometry.dispose()
            const materials = Array.isArray(object.material) ? object.material : [object.material]
            materials.forEach((material) => material.dispose())
          }
        })
        scene.clear()
      }
      renderer?.dispose()
      renderer = null
      rendererRef.current = null
      sceneRef.current = null
      cameraRef.current = null
      modelGroupRef.current = null
      hotspotsGroupRef.current = null
    }

    const handleContextLost = (event: Event) => {
      event.preventDefault()
      cancelAnimationFrame(animationFrameId)
      renderer?.domElement.remove()
      setRendererError('The browser lost its WebGL graphics context. Use the body-system list below or reload the page to retry the 3D view.')
    }

    const handleResize = () => {
      if (!containerRef.current || !renderer || !cameraRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      if (width === 0 || height === 0) return
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    try {
      const width = Math.max(container.clientWidth, 1)
      const height = Math.max(container.clientHeight, 1)

      scene = new THREE.Scene()
      sceneRef.current = scene

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
      camera.position.set(0, 0.55, 7.2)
      cameraRef.current = camera

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.2
      rendererRef.current = renderer
      renderer.domElement.addEventListener('webglcontextlost', handleContextLost)
      container.appendChild(renderer.domElement)

      const ambientLight = new THREE.AmbientLight(0xf3fff7, 2.1)
      scene.add(ambientLight)

      const keyLight = new THREE.DirectionalLight(0xffffff, 3.1)
      keyLight.position.set(4, 5, 4)
      scene.add(keyLight)

      const fillLight = new THREE.DirectionalLight(0x9de7c2, 1.6)
      fillLight.position.set(-4, -2, -3)
      scene.add(fillLight)

      const gridHelper = new THREE.GridHelper(8, 24, 0xc3d4ca, 0xe7eee9)
      gridHelper.position.y = -2.05
      scene.add(gridHelper)

      const ringGeo = new THREE.RingGeometry(1.2, 1.35, 32)
      ringGeo.rotateX(-Math.PI / 2)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc6d4cc,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.72,
      })
      ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.position.y = -2.04
      scene.add(ringMesh)

      const hotspotsGroup = new THREE.Group()
      hotspotsGroupRef.current = hotspotsGroup
      scene.add(hotspotsGroup)

      const animate = () => {
        if (disposed || !renderer || !scene) return
        animationFrameId = requestAnimationFrame(animate)
        const time = clock.getElapsedTime()

        if (!isDragging.current && modelGroupRef.current) {
          rotationVel.current.x *= 0.92
          rotationVel.current.y *= 0.92

          modelRotation.current.y += rotationVel.current.x
          modelRotation.current.x += rotationVel.current.y
          if (!reduceMotion && Math.abs(rotationVel.current.x) < 0.00002) {
            modelRotation.current.y += 0.000015
          }

          modelRotation.current.x = THREE.MathUtils.clamp(
            modelRotation.current.x,
            -Math.PI / 4,
            Math.PI / 4
          )

          modelGroupRef.current.rotation.y = modelRotation.current.y
          modelGroupRef.current.rotation.x = modelRotation.current.x

          if (hotspotsGroupRef.current) {
            hotspotsGroupRef.current.rotation.y = modelRotation.current.y
            hotspotsGroupRef.current.rotation.x = modelRotation.current.x
          }
        }

        if (ringMesh) ringMesh.rotation.z = time * 0.2

        if (cameraRef.current) {
          cameraRef.current.position.lerp(targetCamPos.current, 0.06)
          currentCamLookAt.current.lerp(targetCamLookAt.current, 0.06)
          cameraRef.current.lookAt(currentCamLookAt.current)
        }

        if (hotspotsGroupRef.current) {
          hotspotsGroupRef.current.children.forEach((child) => {
            if (child instanceof THREE.Group) {
              const outerRing = child.children[2] as THREE.Mesh
              if (outerRing) {
                const scale = 1 + Math.sin(time * 3.2) * 0.12
                outerRing.scale.set(scale, scale, scale)
              }
            }
          })
        }

        try {
          renderer.render(scene, camera)
        } catch {
          cancelAnimationFrame(animationFrameId)
          renderer.domElement.remove()
          setRendererError('The 3D renderer stopped unexpectedly. The body-system list below is still available.')
        }
      }

      window.addEventListener('resize', handleResize)
      animate()
    } catch (error) {
      cleanup()
      const errorMessage =
        error instanceof Error
          ? `3D body rendering is unavailable (${error.message}). The body-system list below is still available.`
          : '3D body rendering is unavailable. The body-system list below is still available.'
      queueMicrotask(() => setRendererError(errorMessage))
    }

    return cleanup
  }, [displayMode, reduceMotion])

  useEffect(() => {
    if (!sceneRef.current) return
    if (modelGroupRef.current) {
      sceneRef.current.remove(modelGroupRef.current)
      modelGroupRef.current.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => material.dispose())
        }
      })
    }
    const newOrganic = createOrganicHumanGroup(displayMode)
    newOrganic.position.set(0, 0, 0)
    newOrganic.rotation.y = modelRotation.current.y
    newOrganic.rotation.x = modelRotation.current.x
    modelGroupRef.current = newOrganic
    sceneRef.current.add(newOrganic)
  }, [displayMode])

  useEffect(() => {
    if (!hotspotsGroupRef.current) return
    const group = hotspotsGroupRef.current
    while (group.children.length > 0) {
      group.remove(group.children[0])
    }

    regions.forEach((region) => {
      const hGroup = new THREE.Group()
      hGroup.position.set(...region.position)
      hGroup.userData = { regionId: region.id }

      const hexColor = severityHexColor[region.severity]
      const isSelected = region.id === selectedRegionId

      const sphereGeo = new THREE.SphereGeometry(isSelected ? 0.105 : 0.08, 20, 16)
      const sphereMat = new THREE.MeshBasicMaterial({
        color: hexColor,
      })
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
      hGroup.add(sphereMesh)

      const glowMesh = new THREE.Mesh(
        new THREE.SphereGeometry(isSelected ? 0.19 : 0.15, 16, 12),
        new THREE.MeshBasicMaterial({
          color: hexColor,
          transparent: true,
          opacity: isSelected ? 0.24 : 0.15,
          depthWrite: false,
        }),
      )
      hGroup.add(glowMesh)

      const haloGeo = new THREE.RingGeometry(0.13, 0.18, 24)
      const haloMat = new THREE.MeshBasicMaterial({
        color: hexColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 1 : 0.65,
        depthWrite: false,
      })
      const haloMesh = new THREE.Mesh(haloGeo, haloMat)
      hGroup.add(haloMesh)

      group.add(hGroup)
    })
  }, [regions, selectedRegionId])

  useEffect(() => {
    if (selectedRegionId === 'ALL') {
      targetCamPos.current.set(0, 0.55, 7.2)
      targetCamLookAt.current.set(0, 0.55, 0)
    } else {
      const region = regions.find((r) => r.id === selectedRegionId)
      if (region) {
        targetCamPos.current.set(...region.cameraPos)
        targetCamLookAt.current.set(...region.cameraTarget)
      }
    }
  }, [selectedRegionId, regions])

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    previousMouse.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current && containerRef.current && cameraRef.current && hotspotsGroupRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current)
      const intersects = raycaster.intersectObjects(hotspotsGroupRef.current.children, true)

      if (intersects.length > 0) {
        let parent = intersects[0].object.parent
        while (parent && !parent.userData.regionId) {
          parent = parent.parent
        }
        if (parent && parent.userData.regionId) {
          setHoveredRegionId(parent.userData.regionId)
          containerRef.current.style.cursor = 'pointer'
        }
      } else {
        setHoveredRegionId(null)
        containerRef.current.style.cursor = 'grab'
      }
      return
    }

    if (!isDragging.current || !modelGroupRef.current) return

    const deltaX = e.clientX - previousMouse.current.x
    const deltaY = e.clientY - previousMouse.current.y

    rotationVel.current = {
      x: deltaX * 0.006,
      y: deltaY * 0.006,
    }

    modelRotation.current.y += rotationVel.current.x
    modelRotation.current.x += rotationVel.current.y

    modelRotation.current.x = THREE.MathUtils.clamp(
      modelRotation.current.x,
      -Math.PI / 4,
      Math.PI / 4
    )

    modelGroupRef.current.rotation.y = modelRotation.current.y
    modelGroupRef.current.rotation.x = modelRotation.current.x

    if (hotspotsGroupRef.current) {
      hotspotsGroupRef.current.rotation.y = modelRotation.current.y
      hotspotsGroupRef.current.rotation.x = modelRotation.current.x
    }

    previousMouse.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    isDragging.current = false
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab'
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !cameraRef.current || !hotspotsGroupRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current)
    const intersects = raycaster.intersectObjects(hotspotsGroupRef.current.children, true)

    if (intersects.length > 0) {
      let parent = intersects[0].object.parent
      while (parent && !parent.userData.regionId) {
        parent = parent.parent
      }
      if (parent && parent.userData.regionId) {
        onSelectRegion(parent.userData.regionId)
      }
    }
  }

  const hoveredRegionObj = useMemo(
    () => regions.find((r) => r.id === hoveredRegionId),
    [hoveredRegionId, regions]
  )

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      className="relative h-full min-h-[420px] w-full cursor-grab overflow-hidden select-none"
    >
      {rendererError && (
        <div className="absolute inset-0 z-10 flex flex-col gap-4 overflow-auto rounded-2xl border border-sky-200 bg-sky-50 p-4 sm:p-6">
          <div role="alert" aria-live="polite" className="rounded-xl border border-sky-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900">3D body view unavailable</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{rendererError}</p>
            <p className="mt-2 text-xs font-medium text-sky-800">Select a body system below to continue viewing its details.</p>
          </div>
          <div role="group" aria-label="Select a body system" className="grid gap-2 sm:grid-cols-2">
            {regions.map((region) => (
              <button
                key={region.id}
                type="button"
                aria-pressed={selectedRegionId === region.id}
                onClick={() => onSelectRegion(region.id)}
                className="flex items-center justify-between gap-3 rounded-xl border border-sky-200 bg-white px-3 py-2.5 text-left transition hover:border-sky-400 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-slate-900">{region.name}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-slate-500">{region.system}</span>
                </span>
                <span
                  className="shrink-0 rounded-full px-2 py-1 text-[9px] font-bold"
                  style={{
                    color: severityHexColor[region.severity],
                    backgroundColor: `${severityHexColor[region.severity]}18`,
                  }}
                >
                  {region.severity}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      {hoveredRegionObj && (
        <div className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-2.5 rounded-2xl border border-sky-500/30 bg-[#040d16]/90 px-3.5 py-2 shadow-lg backdrop-blur-md">
          <span
            className="h-3 w-3 rounded-full ring-4 ring-white/10"
            style={{ backgroundColor: severityHexColor[hoveredRegionObj.severity] }}
          />
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-sky-400">{hoveredRegionObj.severity}</p>
            <p className="text-xs font-semibold text-white">{hoveredRegionObj.name}</p>
          </div>
        </div>
      )}

      {activeRegionDetails && (
        <aside
          role="dialog"
          aria-label={`${activeRegionDetails.name} details`}
          className="absolute right-3 top-3 z-30 max-h-[calc(100%-5rem)] w-[min(18rem,calc(100%-1.5rem))] overflow-y-auto rounded-2xl border border-sky-100 bg-white/95 p-4 text-slate-800 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2.5">
              <span
                className="mt-1 h-3 w-3 shrink-0 rounded-full ring-4"
                style={{
                  backgroundColor: severityHexColor[activeRegionDetails.severity],
                  boxShadow: `0 0 0 4px ${severityHexColor[activeRegionDetails.severity]}22`,
                }}
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{activeRegionDetails.name}</h3>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{activeRegionDetails.system}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onDismissRegionDetails}
              aria-label="Close body region details"
              className="shrink-0 rounded-lg px-2 py-1 text-slate-500 transition hover:bg-sky-50 hover:text-slate-900"
            >
              ×
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between border-y border-sky-50 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Health status</span>
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{
                color: severityHexColor[activeRegionDetails.severity],
                backgroundColor: `${severityHexColor[activeRegionDetails.severity]}18`,
              }}
            >
              {activeRegionDetails.severity}
            </span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-700">{activeRegionDetails.finding}</p>

          <div className="mt-3 space-y-2">
            {activeRegionDetails.metrics.map((metric) => (
              <div key={metric.label} className="flex items-center justify-between gap-3 rounded-xl bg-sky-50/80 px-3 py-2">
                <span className="text-[10px] text-slate-600">{metric.label}</span>
                <span className="shrink-0 text-[11px] font-semibold text-slate-900">{metric.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 text-[9px] text-slate-500">
            <span className="truncate">{activeRegionDetails.source}</span>
            <span className="shrink-0">{activeRegionDetails.time}</span>
          </div>
          <p className="mt-2 text-[9px] leading-relaxed text-slate-400">Simulated monitoring data; clinician review is required for medical decisions.</p>
        </aside>
      )}

      <div className="pointer-events-none absolute bottom-3 left-3 z-20 flex items-center gap-2 rounded-full border border-sky-500/30 bg-[#040d16]/80 px-3.5 py-1.5 text-[11px] font-mono text-sky-300 shadow-lg backdrop-blur-md">
        <Rotate3d className="h-3.5 w-3.5 text-sky-400" />
        <span>Drag to rotate · Select a marker to review</span>
      </div>
      <div className="pointer-events-none absolute bottom-12 left-3 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-sky-100 bg-white/95 px-3 py-2 text-[9px] font-semibold text-slate-600 shadow-md backdrop-blur">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-600" />Nominal</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-500" />Watch</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-600" />Elevated</span>
      </div>
    </div>
  )
}

// --- Micro Telemetry Trend Line Chart Component ---

function TelemetrySparkline({ data, color }: { data: TelemetryPoint[]; color: string }) {
  if (!data || data.length === 0) return null
  const minVal = Math.min(...data.map((d) => d.val)) - 5
  const maxVal = Math.max(...data.map((d) => d.val)) + 5
  const range = maxVal - minVal || 1

  const width = 220
  const height = 48

  const pointsStr = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((d.val - minVal) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
        <span className="text-slate-300">Simulated live trend · 2-second updates</span>
        <span className="font-semibold text-sky-300 bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded-full">
          {data[data.length - 1].val.toFixed(1)} latest
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-12 overflow-visible">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon points={`0,${height} ${pointsStr} ${width},${height}`} fill={`url(#grad-${color})`} />
        <polyline fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" points={pointsStr} />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * width
          const y = height - ((d.val - minVal) / range) * height
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3.2"
              fill={color}
              stroke="#040d16"
              strokeWidth="1.5"
            />
          )
        })}
      </svg>
      <div className="flex justify-between font-mono text-[10px] text-slate-500 mt-1.5">
        {data.map((d, i) => (
          <span key={i}>{d.time}</span>
        ))}
      </div>
    </div>
  )
}

function LiveMiniChart({ values, color }: { values: number[]; color: string }) {
  const series = values.length > 1 ? values.slice(-12) : Array.from({ length: 4 }, () => values[0] ?? 0)
  const min = Math.min(...series)
  const max = Math.max(...series)
  const range = max - min || 1
  const points = series
    .map((value, index) => {
      const x = (index / Math.max(series.length - 1, 1)) * 120
      const y = 28 - ((value - min) / range) * 22
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox="0 0 120 32" role="img" aria-label="Simulated live sensor trend" className="mt-4 h-8 w-full overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <circle cx="120" cy={28 - ((series[series.length - 1] - min) / range) * 22} r="2.5" fill={color} />
    </svg>
  )
}

// --- Main Application Component ---

export default function FullBodyDiagnostics({ onBack, liveVitals }: { onBack?: () => void; liveVitals: LiveVitals }) {
  const [selectedCrew, setSelectedCrew] = useState('RIVERA')
  const [selectedRegionId, setSelectedRegionId] = useState<string>('brain')
  const [detailRegionId, setDetailRegionId] = useState<string | null>(null)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('hologram')
  const [viewAngle, setViewAngle] = useState<'front' | 'back'>('front')
  const reduceMotion = useReducedMotion()

  const regions = useMemo(
    () => initialRegions[selectedCrew] || initialRegions['RIVERA'],
    [selectedCrew],
  )

  const selectedRegion = useMemo(() => {
    return (
      regions.find((r) => r.id === selectedRegionId) ||
      regions[0]
    )
  }, [regions, selectedRegionId])

  const liveRegion = useMemo(() => {
    const streamValue =
      selectedRegion.id === 'brain' ? liveVitals.neuralSync
        : selectedRegion.id === 'heart' ? liveVitals.heartRate
          : selectedRegion.id === 'respiratory' ? liveVitals.spo2
            : selectedRegion.id === 'digestive' ? liveVitals.hydration
              : liveVitals.activity
    const liveHistory = liveVitals.history.map((sample) => ({
      time: sample.time,
      val:
        selectedRegion.id === 'brain' ? sample.neuralSync
          : selectedRegion.id === 'heart' ? sample.heartRate
            : selectedRegion.id === 'respiratory' ? sample.spo2
              : selectedRegion.id === 'digestive' ? sample.hydration
                : sample.activity,
    }))
    const fallbackHistory = liveHistory.length
      ? []
      : [{ time: liveVitals.updatedAt, val: streamValue }]
    const stream = liveHistory.length ? liveHistory : fallbackHistory
    const history = [
      ...selectedRegion.history.slice(0, Math.max(0, 12 - stream.length)),
      ...stream,
    ].slice(-12)

    const metrics = selectedRegion.metrics.map((metric) => {
      if (metric.label.toLowerCase().includes('heart rate') || metric.label.toLowerCase() === 'resting hr') {
        return { ...metric, value: `${liveVitals.heartRate} BPM` }
      }
      if (metric.label.toLowerCase().includes('spo₂') || metric.label.toLowerCase().includes('spo2') || metric.label.toLowerCase().includes('oxygen saturation')) {
        return { ...metric, value: `${liveVitals.spo2.toFixed(1)}%` }
      }
      if (metric.label.toLowerCase().includes('hydration intake')) {
        return { ...metric, value: `${(2.2 * liveVitals.hydration / 100).toFixed(2)} L` }
      }
      return metric
    })

    return { ...selectedRegion, history, metrics, time: `LIVE · ${liveVitals.updatedAt}` }
  }, [liveVitals, selectedRegion])

  const crewOverallScore = useMemo(() => {
    const total = regions.reduce((acc, r) => acc + r.score, 0)
    return Math.round(total / regions.length)
  }, [regions])

  const currentCrewObj = useMemo(
    () => crewMembers.find((c) => c.id === selectedCrew) || crewMembers[0],
    [selectedCrew]
  )

  const selectRegion = (regionId: string) => {
    setSelectedRegionId(regionId)
    setDetailRegionId(regionId === 'ALL' ? null : regionId)
  }

  const activeRegionDetails = regions.find((region) => region.id === detailRegionId) ?? null

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4 }}
      className="astra-diagnostics-light min-h-screen w-full bg-[#dfe7e7] text-slate-800 font-sans flex flex-col antialiased relative overflow-hidden"
    >
      
      {/* Astronomy Space Background Atmosphere: Stars & Distant Planets/Nebula Glow */}
      <div className="diagnostics-atmosphere absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full bg-blue-700/10 blur-[150px]" />
        <div className="absolute top-1/3 left-1/2 w-72 h-72 rounded-full bg-indigo-600/10 blur-[100px]" />
        
        {/* Subtle Starfield Dot Pattern */}
      </div>

      {/* Top Clinical Navigation & Search Bar */}
      <header className="diagnostics-toolbar sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3.5 sm:px-6 lg:px-8 shadow-sm">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white font-bold shadow-sm">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-wider text-white">ASTRA // COSMOS</span>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-sky-950/40 border border-sky-500/30 px-3.5 py-1.5 text-xs font-medium text-sky-300 shadow-sm hover:bg-sky-500/20 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-sky-400" />
              <span>Mission Overview</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2.5 rounded-full bg-[#081b2d] px-4 py-2 w-72 lg:w-80 border border-sky-500/30 shadow-inner">
            <Search className="h-4 w-4 text-sky-400" />
            <input
              type="text"
              placeholder="Search celestial telemetry..."
              className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 rounded-full bg-[#081b2d] p-1 border border-sky-500/30 shadow-sm">
              {crewMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => {
                    setSelectedCrew(member.id)
                    setSelectedRegionId(initialRegions[member.id][0].id)
                    setDetailRegionId(null)
                  }}
                  className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    selectedCrew === member.id
                      ? 'bg-sky-100 text-sky-800 border border-sky-300 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                      selectedCrew === member.id
                        ? 'bg-sky-400 text-black'
                        : 'bg-slate-800 text-sky-300'
                    }`}
                  >
                    {member.avatar}
                  </span>
                  <span className="hidden xl:inline">{member.name}</span>
                </button>
              ))}
            </div>

            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-[#081b2d] border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 transition">
              <Bell className="h-4 w-4" />
            </button>
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-[#081b2d] border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 transition">
              <UserPlus className="h-4 w-4" />
            </button>
            <div className="hidden lg:flex items-center gap-2 rounded-full bg-[#081b2d] border border-sky-500/30 px-3.5 py-2 text-xs font-mono text-sky-300">
              <Calendar className="h-3.5 w-3.5 text-sky-400" />
              <span>ORBIT DAY 117</span>
            </div>
            <button
              onClick={() => selectRegion('ALL')}
              className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-sky-700 active:scale-95"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Reset Scan</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main 3-Column Bento Workspace */}
      <main className="diagnostics-workspace mx-auto my-5 flex-1 w-[calc(100%-2rem)] max-w-[1440px] rounded-[30px] border border-white/80 bg-[#f3f8fa] px-4 py-5 sm:px-6 lg:px-7 grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10 shadow-[0_20px_70px_rgba(54,75,71,0.12)]">
        
        {/* Left Column */}
        <section className="lg:col-span-3 flex flex-col gap-5">
          <div className="dashboard-nav-card rounded-3xl p-4">
            <div className="mb-4 flex items-center gap-2.5 px-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <Activity className="h-4 w-4" />
              </span>
              <span className="font-semibold tracking-tight text-slate-900">ASTRA Health</span>
            </div>
            <nav aria-label="Diagnostics page navigation" className="space-y-1">
              <button
                type="button"
                onClick={onBack}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-slate-600 transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4 text-slate-400" />
                <span>Mission Overview</span>
              </button>
              <a
                href="#diagnostics-index"
                className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-900 ring-1 ring-emerald-100"
              >
                <HeartPulse className="h-4 w-4 text-emerald-700" />
                <span>Patient Insights</span>
              </a>
              <a
                href="#anatomy-map"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-slate-600 transition hover:bg-slate-50"
              >
                <Activity className="h-4 w-4 text-slate-400" />
                <span>Body Systems</span>
              </a>
              <a
                href="#telemetry-card"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-slate-600 transition hover:bg-slate-50"
              >
                <Zap className="h-4 w-4 text-slate-400" />
                <span>Health Telemetry</span>
              </a>
            </nav>
          </div>

          <div className="rounded-3xl bg-[#081b2d]/80 p-5 shadow-xl border border-sky-500/20 backdrop-blur-md flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-sky-500/20">
              <div>
                <p className="text-[11px] font-mono text-sky-400 uppercase tracking-wider">01 / Systems Index</p>
                <h2 className="text-base font-bold text-white">Anatomical Regions</h2>
              </div>
              <span className="rounded-full bg-sky-950/80 border border-sky-500/30 px-2.5 py-0.5 font-mono text-[11px] text-sky-300">
                {regions.length}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[430px] pr-1">
              {regions.map((region) => {
                const isSelected = selectedRegionId === region.id
                return (
                  <button
                    key={region.id}
                    onClick={() => selectRegion(region.id)}
                    className={`group flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-left transition-all border ${
                      isSelected
                        ? 'border-sky-200 bg-sky-50 text-sky-800 font-semibold shadow-sm'
                        : 'border-transparent text-slate-300 hover:bg-sky-950/30 hover:border-sky-500/20'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className={`text-xs truncate ${isSelected ? 'font-bold text-sky-200' : 'font-medium text-slate-200'}`}>
                        {region.name}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-400">{region.system}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${
                          severityBadgeStyles[region.severity]
                        }`}
                      >
                        {region.severity}
                      </span>
                      <ChevronRight
                        className={`h-3.5 w-3.5 transition-transform ${
                          isSelected ? 'translate-x-0.5 text-sky-400' : 'text-slate-500 group-hover:translate-x-0.5'
                        }`}
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-auto rounded-3xl bg-sky-50 p-5 border border-sky-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-white">AI Health Update</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-400/20 text-sky-300">
                <ShieldAlert className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-3 text-xs font-mono text-sky-300 uppercase tracking-wider">Clinical Attention</p>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              {selectedCrew === 'RIVERA' && 'Hydration balance and vestibular adaptation require clinician review.'}
              {selectedCrew === 'NIELSEN' && 'All biometrics nominal. Standard telemetry monitoring active.'}
              {selectedCrew === 'OSEI' && 'Right shoulder rotator cuff strain requires ergonomic recovery.'}
            </p>
            <button
              onClick={() => selectRegion('ALL')}
              className="mt-4 w-full rounded-full bg-sky-600 py-2.5 text-xs font-bold text-white transition hover:bg-sky-700 shadow-sm"
            >
              Recalibrate Scan
            </button>
          </div>
        </section>

        {/* Center Column */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          <div id="anatomy-map" className="flex-1 rounded-3xl bg-[#081b2d]/80 p-6 shadow-2xl border border-sky-500/20 relative flex flex-col min-h-[540px] backdrop-blur-md">
            
            <div className="z-20 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-sky-400">
                  <span>CREW</span>
                  <span>‹</span>
                  <span className="text-white font-bold">{currentCrewObj.name}</span>
                </div>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-white leading-tight">
                  Patient&apos;s<br />Insights
                </h1>

                <div className="mt-6 space-y-4 font-mono">
                  <div>
                    <p className="text-xl font-bold text-sky-300">{selectedRegion.score}%</p>
                    <p className="text-xs text-slate-400">Region Index</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">
                      {liveRegion.metrics[0]?.value.split(' ')[0] || '98.6'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {liveRegion.metrics[0]?.label || 'Primary Metric'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center rounded-full bg-sky-950/80 p-1 border border-sky-500/30">
                  {(['hologram', 'wireframe', 'xray'] as DisplayMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setDisplayMode(mode)}
                      className={`rounded-full px-3 py-1 font-mono text-[11px] font-medium capitalize transition-all ${
                        displayMode === mode
                          ? 'bg-sky-400 text-black font-bold shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode === 'xray' ? 'X-Ray' : mode}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center rounded-full bg-sky-950/80 p-1 border border-sky-500/30 font-mono">
                    <button
                      onClick={() => setViewAngle('front')}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                        viewAngle === 'front'
                          ? 'bg-sky-400 text-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      FRONT
                    </button>
                    <button
                      onClick={() => setViewAngle('back')}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                        viewAngle === 'back'
                          ? 'bg-sky-400 text-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      BACK
                    </button>
                  </div>

                  <button
                    onClick={() => selectRegion('ALL')}
                    title="Reset Camera View"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative flex-1 w-full -mt-12">
              <SkeletonCanvas
                displayMode={displayMode}
                selectedRegionId={selectedRegionId}
                regions={regions}
                onSelectRegion={selectRegion}
                activeRegionDetails={activeRegionDetails}
                onDismissRegionDetails={() => setDetailRegionId(null)}
                viewAngle={viewAngle}
              />

              <div className="absolute right-0 bottom-4 z-20 flex flex-col gap-2">
                <button
                  onClick={() => selectRegion('heart')}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#081b2d] border border-sky-500/30 text-sky-300 shadow-lg hover:text-white hover:border-sky-400 transition"
                  title="Focus Cardiovascular"
                >
                  <Heart className="h-4 w-4" />
                </button>
                <button
                  onClick={() => selectRegion('brain')}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#081b2d] border border-sky-500/30 text-sky-300 shadow-lg hover:text-white hover:border-sky-400 transition"
                  title="Focus Neurological"
                >
                  <Crosshair className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDisplayMode(displayMode === 'xray' ? 'hologram' : 'xray')}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#081b2d] border border-sky-500/30 text-sky-300 shadow-lg hover:text-white hover:border-sky-400 transition"
                  title="Toggle X-Ray"
                >
                  <Sliders className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[#081b2d]/80 p-5 shadow-xl border border-sky-500/25 backdrop-blur-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-mono text-sky-400 uppercase tracking-wider">ASTRA Orbital Telemetry</p>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Biometric Health Index
                </h3>
              </div>
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-semibold"
                style={{
                  color: severityHexColor[liveRegion.severity],
                  backgroundColor: `${severityHexColor[liveRegion.severity]}18`,
                  borderColor: `${severityHexColor[liveRegion.severity]}55`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 animate-pulse rounded-full"
                  style={{ backgroundColor: severityHexColor[liveRegion.severity] }}
                />
                {liveRegion.severity}
              </span>
            </div>

            <div className="mt-4 space-y-3 font-mono">
              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>Mission Baseline Target</span>
                  <span>85 pts</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-900 overflow-hidden border border-sky-500/20">
                  <div className="h-full rounded-full bg-sky-900" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Current Composite Score</span>
                  <span className="font-bold text-emerald-400">{crewOverallScore} pts</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-900 overflow-hidden border border-sky-500/20">
                  <div
                    className="h-full rounded-full bg-sky-600 transition-all duration-500"
                    style={{ width: `${crewOverallScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          <div id="diagnostics-index" className="rounded-3xl bg-[#081b2d]/80 p-4 shadow-xl border border-sky-500/20 backdrop-blur-md flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-lg font-mono font-bold text-white shadow-sm">
              {currentCrewObj.avatar}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-1 text-xs font-mono">
              <div>
                <span className="block text-[10px] text-slate-400">Name</span>
                <strong className="font-bold text-white">{currentCrewObj.name}</strong>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">Medical Officer</span>
                <strong className="font-bold text-white">{currentCrewObj.doctor}</strong>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">Date of birth</span>
                <span className="font-semibold text-slate-300">{currentCrewObj.dob}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">Role / Sex</span>
                <span className="font-semibold text-slate-300">{currentCrewObj.sex} · {currentCrewObj.role}</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] font-mono uppercase tracking-wider text-sky-300">
            Simulated sensor stream · updated {liveVitals.updatedAt} · no wearable connected
          </p>

          <div className="grid grid-cols-2 gap-3.5 font-mono">
            <div className="rounded-3xl bg-[#081b2d]/80 p-4 shadow-xl border border-sky-500/20 backdrop-blur-md flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] text-slate-400">Heart Rate</span>
                  <p className="text-xl font-bold text-white mt-0.5">{liveVitals.heartRate} BPM</p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
                  <HeartPulse className="h-4 w-4" />
                </span>
              </div>
              <LiveMiniChart values={liveVitals.history.map((sample) => sample.heartRate)} color="#0284c7" />
            </div>

            <div className="rounded-3xl bg-[#081b2d]/80 p-4 shadow-xl border border-sky-500/20 backdrop-blur-md flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] text-slate-400">Blood Oxygen</span>
                  <p className="text-xl font-bold text-white mt-0.5">{liveVitals.spo2.toFixed(1)}%</p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400">
                  <Wind className="h-4 w-4" />
                </span>
              </div>
              <LiveMiniChart values={liveVitals.history.map((sample) => sample.spo2)} color="#0284c7" />
            </div>

            <div className="rounded-3xl bg-[#081b2d]/80 p-4 shadow-xl border border-sky-500/20 backdrop-blur-md flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] text-slate-400">Core Temp</span>
                  <p className="text-xl font-bold text-white mt-0.5">{liveVitals.temperature.toFixed(1)} °C</p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                  <Thermometer className="h-4 w-4" />
                </span>
              </div>
              <LiveMiniChart values={liveVitals.history.map((sample) => sample.temperature)} color="#0284c7" />
            </div>

            <div className="rounded-3xl bg-[#081b2d]/80 p-4 shadow-xl border border-sky-500/20 backdrop-blur-md flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] text-slate-400">Neural Sync</span>
                  <p className="text-xl font-bold text-white mt-0.5">{liveVitals.neuralSync}%</p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  <Zap className="h-4 w-4" />
                </span>
              </div>
              <LiveMiniChart values={liveVitals.history.map((sample) => sample.neuralSync)} color="#0284c7" />
            </div>
          </div>

          <div id="telemetry-card" className="rounded-3xl bg-[#081b2d]/80 p-4 shadow-xl border border-sky-500/20 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 font-mono">
              <h3 className="text-xs font-bold text-white">{liveRegion.name} Telemetry</h3>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                  severityBadgeStyles[liveRegion.severity]
                }`}
              >
                {liveRegion.severity}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono">
              {liveRegion.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-sky-950/40 border border-sky-500/20 p-2.5 flex flex-col justify-between"
                >
                  <span className="text-[10px] text-slate-400 leading-tight">{m.label}</span>
                  <p className="mt-1.5 text-sm font-bold text-white">{m.value}</p>
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] font-medium">
                    {m.status === 'good' && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                    {m.status === 'warn' && <AlertTriangle className="h-3 w-3 text-amber-400" />}
                    {m.status === 'alert' && <ShieldAlert className="h-3 w-3 text-rose-500" />}
                    <span
                      className={
                        m.status === 'good'
                          ? 'text-emerald-400'
                          : m.status === 'warn'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }
                    >
                      {m.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-[#081b2d]/80 p-5 shadow-xl border border-sky-500/20 backdrop-blur-md flex-1 flex flex-col justify-between">
            <TelemetrySparkline
              data={liveRegion.history}
              color={severityHexColor[liveRegion.severity]}
            />

            <div className="mt-4 pt-3.5 border-t border-sky-500/20 font-mono">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span className="flex items-center gap-1 font-semibold text-sky-300">
                  <Info className="h-3.5 w-3.5" />
                  Clinical Telemetry Finding
                </span>
                <span>{liveRegion.time}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                &ldquo;{liveRegion.finding}&rdquo;
              </p>
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                <span>{liveRegion.source}</span>
                <span className="font-semibold text-sky-400">Simulated · not connected to sensors</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  )
}