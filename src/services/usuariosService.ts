import AsyncStorage from "@react-native-async-storage/async-storage"

export async function fetchUsuarios() {
  const token = await AsyncStorage.getItem("token")
  const response = await fetch("http://localhost:8080/usuarios", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) throw new Error("Erro ao buscar usuários")
  const data = await response.json()
  return data.content // retorna o array de usuários
}

export async function updateUsuario(idPessoa: number, dados: any) {
  const token = await AsyncStorage.getItem("token")
  const response = await fetch(`http://localhost:8080/usuarios/${idPessoa}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  })
  if (!response.ok) throw new Error("Erro ao atualizar usuário")
  return response.json()
}