import React, { useEffect, useState } from "react"
import { View, FlatList, Alert, StyleSheet, Text } from "react-native"
import { FAB, Portal, Dialog, Button, TextInput, SegmentedButtons, Paragraph } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import {
  fetchChamados,
  createChamado,
  updateChamado,
  deleteChamado,
  Chamado,
  ChamadoStatus,
  ChamadoTipo,
} from "../services/chamadosService"
import { theme } from "../theme/theme"


function getStatusColor(status: ChamadoStatus) {
  switch (status) {
    case "ABERTO":
      return "#FFD600"
    case "RESOLVIDO":
      return "#43A047"
    default:
      return "#BDBDBD"
  }
}
function getStatusBgColor(status: ChamadoStatus) {
  switch (status) {
    case "ABERTO":
      return "#FFF9C4"
    case "RESOLVIDO":
      return "#E8F5E9"
    default:
      return "#F5F5F5"
  }
}
function getTipoIcon(tipo: ChamadoTipo) {
  switch (tipo) {
    case "DRONES":
      return "drone"
    case "BOMBEIROS":
      return "fire-truck"
    case "POLICIA":
      return "police-badge"
    case "ESPECIALISTA":
      return "account-hard-hat"
    default:
      return "alert"
  }
}

export function ChamadosScreen(): JSX.Element {
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [dialogVisible, setDialogVisible] = useState(false)
  const [editChamado, setEditChamado] = useState<Chamado | null>(null)
  const [loading, setLoading] = useState(false)

  const loadChamados = async () => {
    try {
      const data = await fetchChamados()
      setChamados(data.content)
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os chamados.")
    }
  }

  useEffect(() => {
    loadChamados()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      if (editChamado?.id) {
        await updateChamado(editChamado.id, editChamado)
      } else if (editChamado) {
        await createChamado(editChamado)
      }
      setDialogVisible(false)
      setEditChamado(null)
      loadChamados()
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o chamado.")
    }
    setLoading(false)
  }

  const handleDelete = (id: number) => {
    if (typeof window !== "undefined" && window.confirm) {
      if (window.confirm("Tem certeza que deseja excluir?")) {
        confirmDelete(id)
      }
    } else {
      Alert.alert("Excluir chamado", "Tem certeza?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => confirmDelete(id),
        },
      ])
    }
  }

  const confirmDelete = async (id: number) => {
    try {
      await deleteChamado(id)
      await loadChamados()
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Não foi possível excluir o chamado.")
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chamados}
        keyExtractor={item => item.id?.toString() ?? ""}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: getStatusBgColor(item.status),
                borderLeftColor: getStatusColor(item.status),
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name={getTipoIcon(item.tipo)}
                size={26}
                color={getStatusColor(item.status)}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) + "33" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
            <Paragraph style={styles.cardDescription}>{item.descricao}</Paragraph>
            <View style={styles.cardInfoRow}>
              <MaterialCommunityIcons name="calendar" size={18} color="#757575" />
              <Text style={styles.cardInfoText}>{item.dataHoraAbertura}</Text>
            </View>
            {item.dataHoraFechamento && (
              <View style={styles.cardInfoRow}>
                <MaterialCommunityIcons name="calendar-check" size={18} color="#757575" />
                <Text style={styles.cardInfoText}>{item.dataHoraFechamento}</Text>
              </View>
            )}
            <View style={styles.cardInfoRow}>
              <MaterialCommunityIcons name="format-list-bulleted-type" size={18} color="#757575" />
              <Text style={styles.cardInfoText}>{item.tipo}</Text>
            </View>
            <View style={styles.cardActions}>
              <Button onPress={() => { setEditChamado(item); setDialogVisible(true) }}>
                Editar
              </Button>
              <Button onPress={() => handleDelete(item.id!)} textColor="#D32F2F">
                Excluir
              </Button>
            </View>
          </View>
        )}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>{editChamado?.id ? "Editar Chamado" : "Novo Chamado"}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Título"
              value={editChamado?.titulo ?? ""}
              onChangeText={text => setEditChamado(e => ({ ...e!, titulo: text }))}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Descrição"
              value={editChamado?.descricao ?? ""}
              onChangeText={text => setEditChamado(e => ({ ...e!, descricao: text }))}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Alerta ID"
              value={editChamado?.alertaId?.toString() ?? ""}
              keyboardType="numeric"
              onChangeText={text => setEditChamado(e => ({ ...e!, alertaId: Number(text) }))}
              style={{ marginBottom: 8 }}
            />
            <SegmentedButtons
              value={editChamado?.tipo ?? "DRONES"}
              onValueChange={tipo => setEditChamado(e => ({ ...e!, tipo: tipo as ChamadoTipo }))}
              buttons={[
                { value: "DRONES", label: "Drones" },
                { value: "ESPECIALISTA", label: "Especialista" },
                { value: "BOMBEIROS", label: "Bombeiros" },
                { value: "POLICIA", label: "Polícia" },
              ]}
              style={{ marginBottom: 8 }}
            />
            <SegmentedButtons
              value={editChamado?.status ?? "ABERTO"}
              onValueChange={status => setEditChamado(e => ({ ...e!, status: status as ChamadoStatus }))}
              buttons={[
                { value: "ABERTO", label: "Aberto" },
                { value: "RESOLVIDO", label: "Resolvido" },
              ]}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Data Abertura (ISO)"
              value={editChamado?.dataHoraAbertura ?? ""}
              onChangeText={text => setEditChamado(e => ({ ...e!, dataHoraAbertura: text }))}
              style={{ marginBottom: 8 }}
              placeholder="2025-06-07T10:00:00"
            />
            {editChamado?.status === "RESOLVIDO" && (
              <TextInput
                label="Data Fechamento (ISO)"
                value={editChamado?.dataHoraFechamento ?? ""}
                onChangeText={text => setEditChamado(e => ({ ...e!, dataHoraFechamento: text }))}
                style={{ marginBottom: 8 }}
                placeholder="2025-06-07T12:00:00"
              />
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
            <Button loading={loading} onPress={handleSave}>
              {editChamado?.id ? "Salvar" : "Criar"}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        color="#97b68d"
        onPress={() => {
          setEditChamado({
            alertaId: 1,
            titulo: "",
            descricao: "",
            status: "ABERTO",
            tipo: "DRONES",
            dataHoraAbertura: new Date().toISOString().slice(0, 19),
          })
          setDialogVisible(true)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  listContainer: { padding: 8, paddingBottom: 80 },
  card: {
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 2,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    borderLeftWidth: 6,
    borderLeftColor: "#FFD600",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    flex: 1,
    color: theme.colors.primary,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginLeft: 8,
    alignSelf: "flex-start",
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  cardDescription: {
    marginBottom: 8,
    color: "#333",
    fontSize: 15,
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  cardInfoText: {
    marginLeft: 6,
    color: "#555",
    fontSize: 14,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
})