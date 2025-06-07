export interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
}

export interface Sensor {
  id: number
  name: string
  type: SensorType
  location: string
  status: SensorStatus
  lastReading: string
  lastUpdate: string
  battery: number
}

export interface Alert {
  id: number
  title: string
  description: string
  type: AlertType
  status: AlertStatus
  timestamp: string
  location: string
  sensor: string
}

export interface SensorData {
  temperature: number
  humidity: number
  airQuality: number
  co2: number
}

export interface ChartData {
  labels: string[]
  datasets: Array<{
    data: number[]
    color?: (opacity: number) => string
    strokeWidth?: number
  }>
}

export interface Statistics {
  max: number
  min: number
  avg: string
}

export interface Settings {
  notifications: boolean
  darkMode: boolean
  autoRefresh: boolean
  soundAlerts: boolean
}

export type SensorType = "temperature" | "humidity" | "co2" | "air_quality" | "multi"
export type SensorStatus = "active" | "inactive" | "maintenance"
export type AlertType = "critical" | "warning" | "info"
export type AlertStatus = "active" | "resolved"
export type MetricType = "temperature" | "humidity" | "co2" | "air_quality"
export type TimePeriod = "24h" | "7d" | "30d"