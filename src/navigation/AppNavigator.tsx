import { createStackNavigator } from "@react-navigation/stack"
import { LoginScreen } from "../screens/LoginScreen"
import { MainTabNavigator } from "../navigation/MainTabNavigator"
import { theme } from "../theme/theme"
import type { RootStackParamList } from "../types/navigation"

const Stack = createStackNavigator<RootStackParamList>()

export function AppNavigator(): JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}