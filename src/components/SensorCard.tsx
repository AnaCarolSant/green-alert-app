import { Card, Text, Button } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import { theme } from "../theme/theme"

type SensorCardProps = {
  title: string
  icon: keyof typeof Ionicons.glyphMap
  type: "temperature" | "humidity"
  onPress?: () => void
  onDelete?: () => void
}

export function SensorCard({
  title,
  icon,
  type,
  onPress,

}: SensorCardProps): JSX.Element {
  return (
    <Card style={{ margin: 8 }} onPress={onPress}>
      <Card.Content style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name={icon} size={32} color={theme.colors.primary} style={{ marginRight: 16 }} />
        <Text style={{ fontSize: 18, fontWeight: "bold", flex: 1 }}>{title}</Text>
      </Card.Content>
    </Card>
  )
}