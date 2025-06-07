import AsyncStorage from "@react-native-async-storage/async-storage"

export interface Alerta {
  id: number
  descricao: string
  tipoAlerta: string
  status: string
  dataHora: string
  sensorId: number
}

export async function fetchAlertas(): Promise<Alerta[]> {
  const token = await AsyncStorage.getItem("token")
  const response = await fetch("http://localhost:8080/alertas", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) throw new Error("Erro ao buscar alertas")
  const data = await response.json()
  return data.content
}

export async function updateAlertaStatus(alerta: Alerta, novoStatus: string) {
  const token = await AsyncStorage.getItem("token")
  const response = await fetch(`http://localhost:8080/alertas/${alerta.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...alerta,
      status: novoStatus,
    }),
  })
  if (!response.ok) throw new Error("Erro ao atualizar status do alerta")
  return response.json()
}