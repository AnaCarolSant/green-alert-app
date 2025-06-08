"use client"

import { useState } from "react"
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native"
import { TextInput, Button, Card, Title, Paragraph } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { theme } from "../theme/theme"
import type { RootStackScreenProps } from "../types/navigation"
import AsyncStorage from "@react-native-async-storage/async-storage"

export function LoginScreen({ navigation }: RootStackScreenProps<"Login">): JSX.Element {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://172.191.46.215:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Credenciais inválidas")
      }

      const data = await response.json()
      const token = data.token

      if (!token) {
        throw new Error("Token não recebido")
      }

      await AsyncStorage.setItem("token", token)
      await AsyncStorage.setItem("userEmail", email)
      navigation.replace("Main")
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={80} color={theme.colors.onPrimary} />
            <Title style={styles.logoText}>Green Alert</Title>
            <Paragraph style={styles.subtitle}>Monitoramento Ambiental Inteligente</Paragraph>
          </View>

          <Card style={styles.loginCard}>
            <Card.Content style={styles.cardContent}>
              <Title style={styles.loginTitle}>Entrar</Title>

              <TextInput
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>

            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: theme.spacing.md,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  logoText: {
    color: theme.colors.onPrimary,
    fontSize: 32,
    fontWeight: "bold",
    marginTop: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.onPrimary,
    textAlign: "center",
    opacity: 0.9,
    marginTop: theme.spacing.xs,
  },
  loginCard: {
    elevation: 8,
    borderRadius: theme.borderRadius.lg,
  },
  cardContent: {
    padding: theme.spacing.lg,
  },
  loginTitle: {
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  loginButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  buttonContent: {
    paddingVertical: theme.spacing.xs,
  },
  forgotButton: {
    alignSelf: "center",
  },
})