"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Alert } from "react-native"
import { Card, Title, Text, Button, List, Switch, Avatar } from "react-native-paper"
import { theme } from "../theme/theme"
import { fetchUsuarios, updateUsuario } from "../services/usuariosService"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { MainTabScreenProps } from "../types/navigation"
import { TextInput as PaperTextInput } from "react-native-paper"

export function ProfileScreen({ navigation }: MainTabScreenProps<"Perfil">): JSX.Element {
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoRefresh: true,
    soundAlerts: true,
  })
  const [editMode, setEditMode] = useState(false)
  const [editUser, setEditUser] = useState<any>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail") // Salve o email no login!
        const usuarios = await fetchUsuarios()
        // Busca o usuário logado pelo email salvo
        const usuarioLogado = usuarios.find((u: any) => u.email === email)
        setUser(usuarioLogado)
      } catch (e) {
        console.error(e)
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    if (user) setEditUser(user)
  }, [user])

  const handleLogout = (): void => {
    Alert.alert("Sair", "Tem certeza que deseja sair do aplicativo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => navigation.replace("Login"),
      },
    ])
  }

  type SettingKey = "notifications" | "darkMode" | "autoRefresh" | "soundAlerts"

  const toggleSetting = (setting: SettingKey): void => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [setting]: !prevSettings[setting],
    }))
  }

  const handleSave = async () => {
    try {
      await updateUsuario(editUser.idPessoa, {
        nome: editUser.nome,
        cpf: editUser.cpf,
        telefone: editUser.telefone,
        email: editUser.email,
        role: editUser.role,
        senha: editUser.senha, // ou senha nova, se for o caso
      })
      setUser(editUser)
      setEditMode(false)
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!")
    } catch (e) {
      Alert.alert("Erro", "Não foi possível atualizar o perfil.")
    }
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 32, textAlign: "center" }}>Carregando...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={
            user.nome
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
          }
          style={styles.avatar}
        />
        <Title style={styles.userName}>{user.nome}</Title>
        <Text style={styles.userRole}>{user.role}</Text>
      </View>

      <Card style={styles.profileCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Informações Pessoais</Title>
          <List.Item
            title="Nome"
            description={
              editMode ? (
                <PaperTextInput
                  value={editUser?.nome}
                  onChangeText={(text) => setEditUser({ ...editUser, nome: text })}
                  mode="outlined"
                  style={{
                    backgroundColor: theme.colors.surfaceVariant,
                    marginVertical: 4,
                    borderRadius: 8,
                  }}
                  outlineColor={theme.colors.primary}
                  activeOutlineColor={theme.colors.primary}
                  dense
                />
              ) : (
                user.nome
              )
            }
            left={(props) => <List.Icon {...props} icon="account" />}
          />
          <List.Item
            title="Email"
            description={
              editMode ? (
                <PaperTextInput
                  value={editUser?.email}
                  onChangeText={(text) => setEditUser({ ...editUser, email: text })}
                  mode="outlined"
                  style={{
                    backgroundColor: theme.colors.surfaceVariant,
                    marginVertical: 4,
                    borderRadius: 8,
                  }}
                  outlineColor={theme.colors.primary}
                  activeOutlineColor={theme.colors.primary}
                  dense
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                user.email
              )
            }
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          <List.Item
            title="CPF"
            description={user.cpf}
            left={(props) => <List.Icon {...props} icon="card-account-details" />}
          />
          <List.Item
            title="Telefone"
            description={user.telefone}
            left={(props) => <List.Icon {...props} icon="phone" />}
          />
          <List.Item
            title="Perfil"
            description={user.role}
            left={(props) => <List.Icon {...props} icon="account-badge" />}
          />
        </Card.Content>
      </Card>

      {editMode ? (
        <Button mode="contained" onPress={handleSave} style={{ margin: 16 }}>
          Salvar
        </Button>
      ) : (
        <Button mode="outlined" onPress={() => setEditMode(true)} style={{ margin: 16 }}>
          Editar Perfil
        </Button>
      )}

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        buttonColor={theme.colors.error}
        icon="logout"
      >
        Sair do Aplicativo
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  avatar: {
    backgroundColor: theme.colors.secondary,
    marginBottom: theme.spacing.md,
  },
  userName: {
    color: theme.colors.onPrimary,
    fontSize: 24,
    fontWeight: "bold",
  },
  userRole: {
    color: theme.colors.onPrimary,
    opacity: 0.9,
    fontSize: 16,
  },
  profileCard: {
    margin: theme.spacing.sm,
    elevation: 2,
  },
  settingsCard: {
    margin: theme.spacing.sm,
    elevation: 2,
  },
  sectionTitle: {
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  logoutButton: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
})