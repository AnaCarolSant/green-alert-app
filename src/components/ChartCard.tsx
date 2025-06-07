import { StyleSheet, Dimensions } from "react-native"
import { Card, Title } from "react-native-paper"
import { LineChart } from "react-native-chart-kit"
import { theme } from "../theme/theme"
import type { ChartData } from "../types"

const screenWidth = Dimensions.get("window").width

interface ChartCardProps {
  title: string
  data: ChartData
  color?: string
}

export function ChartCard({ title, data, color = theme.colors.primary }: ChartCardProps): JSX.Element {
  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) =>
      `${color}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0")}`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: theme.borderRadius.md,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: color,
    },
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>
        <LineChart
          data={data}
          width={screenWidth - 64}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    margin: theme.spacing.sm,
    elevation: 2,
  },
  title: {
    marginBottom: theme.spacing.md,
    color: theme.colors.primary,
  },
  chart: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
})