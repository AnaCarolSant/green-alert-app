import AsyncStorage from "@react-native-async-storage/async-storage"

export interface Leitura {
  id: number
  sensorId: number
  valor: number
  unidade: string
  dataHora: string
}

export interface LeiturasResponse {
  content: Leitura[]
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  numberOfElements: number
  first: boolean
  empty: boolean
}

export async function fetchLeituras(): Promise<LeiturasResponse> {
  const token = await AsyncStorage.getItem("token")
  const response = await fetch("http://localhost:8080/leituras", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error("Erro ao buscar leituras")
  }
  return response.json()
}