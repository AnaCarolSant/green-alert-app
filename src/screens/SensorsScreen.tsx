"use client"

import { useState, useCallback, useEffect } from "react"
import { View, StyleSheet, FlatList, RefreshControl, type ListRenderItem, Alert, TextInput } from "react-native"
import { Card, Text, Chip, Searchbar, FAB, Button, SegmentedButtons } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import { theme } from "../theme/theme"
import type { MainTabScreenProps } from "../types/navigation"
import { SensorCard } from "../components/SensorCard"
import { fetchSensores, Sensor, createSensor} from "../services/sensoresService"
import { fetchLeituras, Leitura } from "../services/leiturasService"

export function SensorsScreen({}: MainTabScreenProps<"Sensores">): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [novoSensor, setNovoSensor] = useState({
    nome: "",
    tipo: "TEMPERATURA",
    localizacao: "",
    dataCriacao: new Date().toISOString().slice(0, 16), // formato ISO local
  })

  const [sensors, setSensors] = useState<Sensor[]>([])
  const [leituras, setLeituras] = useState<Leitura[]>([])
  const [filterType, setFilterType] = useState<"all" | "TEMPERATURA" | "UMIDADE">("all")

  const loadData = useCallback(async () => {
    setRefreshing(true)
    try {
      const [sensoresData, leiturasData] = await Promise.all([
        fetchSensores(),
        fetchLeituras(),
      ])
      setSensors(sensoresData)
      setLeituras(leiturasData.content)
    } catch (error) {
      console.error(error)
    }
    setRefreshing(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const onRefresh = useCallback(() => {
    loadData()
  }, [loadData])


  const filteredSensors = sensors.filter((sensor) => {
    const matchesSearch =
      sensor.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sensor.localizacao.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType =
      filterType === "all" || sensor.tipo === filterType
    return matchesSearch && matchesType
  })

  const renderSensor = ({ item }: { item: Sensor }) => {
    const ultimaLeitura = leituras
      .filter((l) => l.sensorId === item.id)
      .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())[0]

    return (
      <SensorCard
        title={item.nome}
        icon={getIcon(item.tipo)}
        type={getType(item.tipo)}
        onPress={() => {}}
      />
    )
  }

  function getIcon(tipo: string): keyof typeof Ionicons.glyphMap {
    switch (tipo) {
      case "TEMPERATURA":
        return "thermometer"
      case "UMIDADE":
        return "water"
      default:
        return "analytics"
    }
  }

  function getType(tipo: string): "temperature" | "humidity" {
    return tipo === "TEMPERATURA" ? "temperature" : "humidity"
  }

  // Função para cadastrar
  const handleCreateSensor = async () => {
    try {
      await createSensor(novoSensor)
      setModalVisible(false)
      setNovoSensor({
        nome: "",
        tipo: "TEMPERATURA",
        localizacao: "",
        dataCriacao: new Date().toISOString().slice(0, 16),
      })
      await loadData()
      Alert.alert("Sucesso", "Sensor cadastrado!")
    } catch (e) {
      Alert.alert("Erro", "Não foi possível cadastrar o sensor.")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Buscar sensores..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <SegmentedButtons
          value={filterType}
          onValueChange={setFilterType}
          buttons={[
            { value: "all", label: "Todos" },
            { value: "TEMPERATURA", label: "Temperatura" },
            { value: "UMIDADE", label: "Umidade" },
          ]}
          style={{ marginBottom: 8 }}
        />
      </View>

      <FlatList
        data={filteredSensors}
        renderItem={renderSensor}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />

      <FAB icon="plus" style={styles.fab} onPress={() => setModalVisible(true)} />

      {modalVisible && (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface,
              padding: 24,
              borderRadius: 16,
              width: "90%",
              elevation: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 16, color: theme.colors.primary }}>
              Novo Sensor
            </Text>
            <TextInput
              placeholder="Nome"
              value={novoSensor.nome}
              onChangeText={text => setNovoSensor({ ...novoSensor, nome: text })}
              style={{
                marginBottom: 12,
                backgroundColor: theme.colors.surfaceVariant,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
              placeholderTextColor={theme.colors.onSurfaceVariant}
            />
            <TextInput
              placeholder="Localização"
              value={novoSensor.localizacao}
              onChangeText={text => setNovoSensor({ ...novoSensor, localizacao: text })}
              style={{
                marginBottom: 12,
                backgroundColor: theme.colors.surfaceVariant,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
              placeholderTextColor={theme.colors.onSurfaceVariant}
            />
            <TextInput
              placeholder="Data de Criação"
              value={novoSensor.dataCriacao}
              onChangeText={text => setNovoSensor({ ...novoSensor, dataCriacao: text })}
              style={{
                marginBottom: 12,
                backgroundColor: theme.colors.surfaceVariant,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
              placeholderTextColor={theme.colors.onSurfaceVariant}
            />
            <SegmentedButtons
              value={novoSensor.tipo}
              onValueChange={tipo => setNovoSensor({ ...novoSensor, tipo })}
              buttons={[
                { value: "TEMPERATURA", label: "Temperatura" },
                { value: "UMIDADE", label: "Umidade" },
              ]}
              style={{ marginBottom: 16 }}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={{ marginRight: 8, borderRadius: 8 }}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleCreateSensor}
                style={{ borderRadius: 8 }}
              >
                Salvar
              </Button>
            </View>
          </View>
        </View>
      )}
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
    marginBottom: theme.spacing.md,
  },
  listContainer: {
    padding: theme.spacing.sm,
    paddingBottom: 80,
  },
  sensorCard: {
    marginBottom: theme.spacing.sm,
    elevation: 2,
  },
  sensorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  sensorTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sensorInfo: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  sensorName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sensorLocation: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.xs,
  },
  statusChip: {
    height: 28,
  },
  sensorDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  readingContainer: {
    flex: 1,
  },
  readingLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  readingValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  batteryText: {
    marginLeft: theme.spacing.xs,
    fontSize: 14,
    fontWeight: "500",
  },
  lastUpdate: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  fab: {
    position: "absolute",
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
})