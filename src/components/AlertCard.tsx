import { View, StyleSheet } from "react-native"
import { Card, Text, Chip } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import { theme } from "../theme/theme"
import type { Alerta } from "../services/alertasService"

type AlertCardProps = {
  alert: Alerta
  sensorNome?: string
  sensorLocalizacao?: string
  onPress: () => void
}

export function AlertCard({ alert, sensorNome, sensorLocalizacao, onPress }: AlertCardProps): JSX.Element {
  const getAlertIcon = (tipoAlerta: string): keyof typeof Ionicons.glyphMap => {
    switch (tipoAlerta) {
      case "TEMPERATURA_ALTA":
        return "thermometer"
      case "UMIDADE_ALTA":
        return "water"
      default:
        return "alert"
    }
  }


  const getStatusColor = (status: string): string => {
    return status === "ATIVO" ? theme.colors.error : theme.colors.success
  }

  return (
    <Card style={[styles.card, { borderLeftColor: getStatusColor(alert.status), borderLeftWidth: 4 }]} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name={getAlertIcon(alert.tipoAlerta)} size={20} color={getStatusColor(alert.status)} />
            <Text style={styles.title}>{sensorNome ?? "Sensor"}</Text>
          </View>
          <Chip
            mode="outlined"
            style={[styles.statusChip, { borderColor: getStatusColor(alert.status) }]}
            textStyle={{ color: getStatusColor(alert.status) }}
          >
            {alert.status === "ATIVO" ? "Ativo" : "Resolvido"}
          </Chip>
        </View>

        <Text style={styles.description}>{alert.descricao}</Text>

        <View style={styles.footer}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={14} color={theme.colors.onSurfaceVariant} />
            <Text style={styles.location}>{sensorLocalizacao ?? "N/A"}</Text>
          </View>
          <Text style={styles.time}>{new Date(alert.dataHora).toLocaleString("pt-BR")}</Text>
        </View>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  statusChip: {
    height: 28,
  },
  description: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  location: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginLeft: theme.spacing.xs,
  },
  time: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
})