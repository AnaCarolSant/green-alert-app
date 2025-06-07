"use client"

import { useState, useCallback, useEffect } from "react"
import { View, StyleSheet, FlatList, RefreshControl, Alert } from "react-native"
import { Searchbar, FAB, Portal, Dialog, Paragraph, Button } from "react-native-paper"
import { AlertCard } from "../components/AlertCard"
import { theme } from "../theme/theme"
import type { MainTabScreenProps } from "../types/navigation"
import { fetchAlertas, Alerta, updateAlertaStatus } from "../services/alertasService"
import { fetchSensores, Sensor } from "../services/sensoresService"

export function AlertsScreen({}: MainTabScreenProps<"Alertas">): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [selectedAlert, setSelectedAlert] = useState<Alerta | null>(null)
  const [dialogVisible, setDialogVisible] = useState<boolean>(false)
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [sensores, setSensores] = useState<Sensor[]>([])


  const loadData = useCallback(async () => {
    setRefreshing(true)
    try {
      const [alertasData, sensoresData] = await Promise.all([
        fetchAlertas(),
        fetchSensores(),
      ])
      setAlertas(alertasData)
      setSensores(sensoresData)
    } catch (error) {
      console.error(error)
    }
    setRefreshing(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])


  const getSensorInfo = (sensorId: number) =>
    sensores.find((s) => s.id === sensorId)

  const filteredAlertas = alertas.filter(
    (alerta) =>
      alerta.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (getSensorInfo(alerta.sensorId)?.nome ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (getSensorInfo(alerta.sensorId)?.localizacao ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  )

  const renderAlert = ({ item }: { item: Alerta }) => {
    const sensor = getSensorInfo(item.sensorId)
    return (
      <AlertCard
        alert={item}
        sensorNome={sensor?.nome}
        sensorLocalizacao={sensor?.localizacao}
        onPress={() => {
          setSelectedAlert(item)
          setDialogVisible(true)
        }}
      />
    )
  }

  const handleStatusChange = async () => {
    if (!selectedAlert) return
    const novoStatus = selectedAlert.status === "ATIVO" ? "RESOLVIDO" : "ATIVO"
    try {
      await updateAlertaStatus(selectedAlert, novoStatus)
      await loadData()
      setDialogVisible(false)
    } catch (e) {
      Alert.alert("Erro", "Não foi possível atualizar o status do alerta.")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Buscar alertas..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <FlatList
        data={filteredAlertas}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
        showsVerticalScrollIndicator={false}
      />

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={styles.dialog}
        >
          {selectedAlert && (
            <>
              <Dialog.Title style={styles.dialogTitle}>
                {getSensorInfo(selectedAlert.sensorId)?.nome ?? "Sensor"}
              </Dialog.Title>
              <Dialog.Content>
                <Paragraph style={styles.dialogDescription}>
                  {selectedAlert.descricao}
                  {"\n"}
                  Localização: {getSensorInfo(selectedAlert.sensorId)?.localizacao ?? "N/A"}
                  {"\n"}
                  Tipo: {selectedAlert.tipoAlerta}
                  {"\n"}
                  Status: {selectedAlert.status}
                  {"\n"}
                  Data: {new Date(selectedAlert.dataHora).toLocaleString("pt-BR")}
                </Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={handleStatusChange}>
                  {selectedAlert?.status === "ATIVO" ? "Marcar como Resolvido" : "Marcar como Ativo"}
                </Button>
                <Button onPress={() => setDialogVisible(false)}>Fechar</Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>

      <FAB icon="plus" style={styles.fab} onPress={() => {}} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: theme.colors.surfaceVariant,
  },
  listContainer: {
    padding: theme.spacing.sm,
    paddingBottom: 80,
  },
  fab: {
    position: "absolute",
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  dialog: {
    backgroundColor: theme.colors.surface,
  },
  dialogTitle: {
    color: theme.colors.primary,
  },
  dialogDescription: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.sm,
  },
})