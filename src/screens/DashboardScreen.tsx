"use client"

import { useState, useCallback, useEffect } from "react"
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native"
import { Title, Paragraph, Text, Surface } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import { ChartCard } from "../components/ChartCard"
import { theme } from "../theme/theme"
import type { MainTabScreenProps } from "../types/navigation"
import type { SensorData, ChartData } from "../types"
import { fetchLeituras, Leitura } from "../services/leiturasService"
import { fetchAlertas, Alerta } from "../services/alertasService"

interface RecentAlert {
  id: number
  type: "warning" | "info"
  message: string
  time: string
}

export function DashboardScreen({}: MainTabScreenProps<"Dashboard">): JSX.Element {
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 24.5,
    humidity: 65,
    airQuality: 85,
    co2: 420,
  })
  const [leituras, setLeituras] = useState<Leitura[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])

  const chartData: ChartData = {
    labels: ["6h", "12h", "18h", "24h", "Agora"],
    datasets: [
      {
        data: [22, 24, 26, 25, 24.5],
        color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  }

  const loadLeituras = useCallback(async () => {
    try {
      const data = await fetchLeituras()
      setLeituras(data.content)
    } catch (error) {

      console.error(error)
    }
  }, [])

  const loadAlertas = useCallback(async () => {
    try {
      const data = await fetchAlertas()
      setAlertas(data)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    loadLeituras()
    loadAlertas()
  }, [loadLeituras, loadAlertas])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadLeituras()
    await loadAlertas()
    setRefreshing(false)
  }, [loadLeituras, loadAlertas])

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Paragraph style={styles.headerSubtitle}>Monitoramento em tempo real</Paragraph>
      </View>

      <ChartCard title="Temperatura (24h)" data={chartData} />

      <Surface style={styles.alertsContainer}>
        <Title style={styles.alertsTitle}>Alertas</Title>
        {alertas.map((alerta) => (
          <Surface key={alerta.id} style={styles.alertItem}>
            <View style={styles.alertContent}>
              <Ionicons
                name="warning"
                size={20}
                color={alerta.status === "ATIVO" ? "#FFA726" : "#1976D2"}
              />
              <Text style={styles.alertText}>{alerta.descricao}</Text>
              <Text style={styles.alertTime}>
                {new Date(alerta.dataHora).toLocaleString("pt-BR")}
              </Text>
            </View>
          </Surface>
        ))}
      </Surface>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    color: theme.colors.onPrimary,
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: theme.colors.onPrimary,
    opacity: 0.9,
  },
  sensorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: theme.spacing.sm,
    justifyContent: "space-between",
  },
  alertsContainer: {
    margin: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
  },
  alertsTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.primary,
  },
  alertItem: {
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    elevation: 1,
  },
  alertContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: "500",
  },
  alertTime: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.xs,
  },
})