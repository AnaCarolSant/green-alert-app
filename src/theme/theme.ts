import { MD3LightTheme } from "react-native-paper"

export interface CustomTheme {
  colors: typeof MD3LightTheme.colors & {
    warning: string
    success: string
    info: string
  }
  spacing: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
  }
  borderRadius: {
    sm: number
    md: number
    lg: number
    xl: number
  }
}

export const theme: CustomTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#263923",
    primaryContainer: "#A5D6A7",
    secondary: "#4c6347",
    secondaryContainer: "#C8E6C9",
    tertiary: "#001000",
    tertiaryContainer: "#FFE0B2",
    error: "#D32F2F",
    errorContainer: "#FFCDD2",
    background: "#F5F5F5",
    surface: "#FFFFFF",
    surfaceVariant: "#E8F5E8",
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    onBackground: "#1C1B1F",
    onSurface: "#1C1B1F",
    onSurfaceVariant: "#49454F",
    outline: "#79747E",
    warning: "#FF9800",
    success: "#4CAF50",
    info: "#2196F3",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
}