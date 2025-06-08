import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { DashboardScreen } from "../screens/DashboardScreen"
import { AlertsScreen } from "../screens/AlertsScreen"
import { SensorsScreen } from "../screens/SensorsScreen"
import { HistoryScreen } from "../screens/HistoryScreen"
import { ProfileScreen } from "../screens/ProfileScreen"
import { ChamadosScreen } from "../screens/ChamadosScreen"
import { theme } from "../theme/theme"
import type { MainTabParamList } from "../types/navigation"

const Tab = createBottomTabNavigator<MainTabParamList>()

export function MainTabNavigator(): JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Alertas") {
            iconName = focused ? "warning" : "warning-outline"
          } else if (route.name === "Sensores") {
            iconName = focused ? "hardware-chip" : "hardware-chip-outline"
          } else if (route.name === "Histórico") {
            iconName = focused ? "bar-chart" : "bar-chart-outline"
          } else if (route.name === "Chamados") {
            iconName = focused ? "list" : "list-outline"
          } else if (route.name === "Perfil") {
            iconName = focused ? "person" : "person-outline"
          } else {
            iconName = "help-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          paddingBottom: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Alertas" component={AlertsScreen} />
      <Tab.Screen name="Sensores" component={SensorsScreen} />
      <Tab.Screen name="Chamados" component={ChamadosScreen} />
      <Tab.Screen name="Histórico" component={HistoryScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  )
}