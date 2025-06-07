import AsyncStorage from "@react-native-async-storage/async-storage"

export interface Sensor {
  id: number
  nome: string
  tipo: string
  localizacao: string
  dataCriacao: string
}

export async function fetchSensores(): Promise<Sensor[]> {
  const token = await AsyncStorage.getItem("token")
  const response = await fetch("http://localhost:8080/sensores", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) throw new Error("Erro ao buscar sensores")
  return response.json()
}

export async function createSensor(dados: {
  nome: string
  tipo: string
  localizacao: string
  dataCriacao: string
}) {
  const token = await AsyncStorage.getItem("token")
  const response = await fetch("http://localhost:8080/sensores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  })
  if (!response.ok) throw new Error("Erro ao cadastrar sensor")
  return response.json()
}

