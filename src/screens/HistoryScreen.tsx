"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Card, Title, Text, SegmentedButtons } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import { ChartCard } from "../components/ChartCard"
import { theme } from "../theme/theme"
import type { MainTabScreenProps } from "../types/navigation"
import type { TimePeriod, MetricType, ChartData, Statistics } from "../types"
import { fetchLeituras, Leitura } from "../services/leiturasService"

export function HistoryScreen({}: MainTabScreenProps<"Histórico">): JSX.Element {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("24h")
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("temperature")
  const [leituras, setLeituras] = useState<Leitura[]>([])

  useEffect(() => {
    const loadLeituras = async () => {
      try {
        const data = await fetchLeituras()
        setLeituras(data.content)
      } catch (error) {
        console.error(error)
      }
    }
    loadLeituras()
  }, [selectedMetric, selectedPeriod])

  console.log("leituras recebidas:", leituras)

  const getChartData = (): ChartData => {

    const metricKey =
      selectedMetric === "temperature"
        ? "CELSIUS"
        : "PORCENTAGEM"

    const filtered = leituras.filter((l) => l.unidade.toUpperCase() === metricKey)


    const data = filtered.slice(-6).map((l) => l.valor)
    const labels = filtered.slice(-6).map((l) =>
      new Date(l.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    )

    return {
      labels,
      datasets: [{ data }],
    }
  }

  const getMetricInfo = () => {
    switch (selectedMetric) {
      case "temperature":
        return { unit: "°C", icon: "thermometer" as const, color: theme.colors.error }
      case "humidity":
        return { unit: "%", icon: "water" as const, color: theme.colors.info }
      default:
        return { unit: "", icon: "radio" as const, color: theme.colors.primary }
    }
  }

  const getStatistics = (): Statistics => {
    const data = getChartData().datasets[0].data
    if (!data.length) return { max: 0, min: 0, avg: "0.0" }
    const max = Math.max(...data)
    const min = Math.min(...data)
    const avg = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1)
    return { max, min, avg }
  }

  const stats = getStatistics()
  const metricInfo = getMetricInfo()

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.controlCard}>
        <Card.Content>
          <Text style={styles.controlLabel}>Período:</Text>
          <SegmentedButtons
            value={selectedPeriod}
            onValueChange={(value) => setSelectedPeriod(value as TimePeriod)}
            buttons={[
              { value: "24h", label: "24h" },
              { value: "7d", label: "7 dias" },
              { value: "30d", label: "30 dias" },
            ]}
            style={styles.segmentedButtons}
          />

          <Text style={[styles.controlLabel, { marginTop: theme.spacing.md }]}>Métrica:</Text>
          <SegmentedButtons
            value={selectedMetric}
            onValueChange={(value) => setSelectedMetric(value as MetricType)}
            buttons={[
              { value: "temperature", label: "Temp." },
              { value: "humidity", label: "Umidade" },
            ]}
            style={styles.segmentedButtons}
          />
        </Card.Content>
      </Card>

      <Card style={styles.statsCard}>
        <Card.Content>
          <View style={styles.statsHeader}>
            <Ionicons name={metricInfo.icon} size={24} color={metricInfo.color} />
            <Title style={styles.statsTitle}>
              {selectedMetric === "temperature"
                ? "Temperatura"
                : "Umidade"}
            </Title>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Máximo</Text>
              <Text style={[styles.statValue, { color: theme.colors.error }]}>
                {stats.max}
                {metricInfo.unit}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Média</Text>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {stats.avg}
                {metricInfo.unit}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Mínimo</Text>
              <Text style={[styles.statValue, { color: theme.colors.success }]}>
                {stats.min}
                {metricInfo.unit}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <ChartCard
        title={`Gráfico - ${
          selectedPeriod === "24h" ? "Últimas 24 horas" : selectedPeriod === "7d" ? "Últimos 7 dias" : "Últimos 30 dias"
        }`}
        data={getChartData()}
        color={metricInfo.color}
      />
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
  controlCard: {
    margin: theme.spacing.sm,
    elevation: 2,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: theme.spacing.sm,
    color: theme.colors.primary,
  },
  segmentedButtons: {
    backgroundColor: theme.colors.surface,
  },
  statsCard: {
    margin: theme.spacing.sm,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  statsTitle: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.primary,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
})