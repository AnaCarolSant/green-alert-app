import { View, StyleSheet } from "react-native"
import { ActivityIndicator, Text } from "react-native-paper"
import { theme } from "../theme/theme"

interface LoadingSpinnerProps {
  message?: string
}

export function LoadingSpinner({ message = "Carregando..." }: LoadingSpinnerProps): JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  message: {
    marginTop: theme.spacing.md,
    color: theme.colors.onSurfaceVariant,
  },
})