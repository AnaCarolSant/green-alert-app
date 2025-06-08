import AsyncStorage from "@react-native-async-storage/async-storage"

export type ChamadoStatus = "ABERTO" | "RESOLVIDO"
export type ChamadoTipo = "DRONES" | "ESPECIALISTA" | "BOMBEIROS" | "POLICIA"

export interface Chamado {
  id?: number
  alertaId: number
  titulo: string
  descricao: string
  status: ChamadoStatus
  tipo: ChamadoTipo
  dataHoraAbertura: string
  dataHoraFechamento?: string
}

const API_URL = "http://172.191.46.215:8080/chamados"

async function getAuthHeaders() {
  const token = await AsyncStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export async function fetchChamados(page = 0, size = 10): Promise<{ content: Chamado[] }> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_URL}?page=${page}&size=${size}`, { headers })
  if (!res.ok) throw new Error("Erro ao buscar chamados")
  return res.json()
}

export async function fetchChamadoById(id: number): Promise<Chamado> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_URL}/${id}`, { headers })
  if (!res.ok) throw new Error("Chamado não encontrado")
  return res.json()
}

export async function createChamado(chamado: Omit<Chamado, "id">): Promise<Chamado> {
  const headers = await getAuthHeaders()
  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(chamado),
  })
  if (!res.ok) throw new Error("Erro ao criar chamado")
  return res.json()
}

export async function updateChamado(id: number, chamado: Chamado): Promise<Chamado> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(chamado),
  })
  if (!res.ok) throw new Error("Erro ao atualizar chamado")
  return res.json()
}

export async function deleteChamado(id: number): Promise<void> {

  const headers = await getAuthHeaders()
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers })
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error("Erro ao deletar chamado")
  }
}