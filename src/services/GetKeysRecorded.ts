interface ChavesProps {
  chave: string
}

export async function GetKeysRecorded(connection: any) {

  const resultado: [ChavesProps[]] = await connection.promise().query(`SELECT DISTINCT chave FROM notas_app ORDER BY chave`)

  return resultado[0]
}
