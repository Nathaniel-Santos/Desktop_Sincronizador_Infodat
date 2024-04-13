interface DisciplinasProps {
  label: string,
  Codigo: string
}

export async function GetAllDisciplinasTable(connection: any) {

  const resultado: [DisciplinasProps[]] = await connection.promise().query(`SELECT Disciplina as label, Codigo FROM disciplinas`)

  return resultado[0]
}
