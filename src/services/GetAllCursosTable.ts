interface FiltroCursos {
  label:  string;
  Codigo: string;
}

export async function GetAllCursosTable(connection: any): Promise<FiltroCursos[]> {

  const resultado = await connection.promise().query(`SELECT Curso as label, Codigo FROM cursos`)
    .then((result: FiltroCursos[]) => {
      let dados = JSON.stringify(result)
      dados = JSON.parse(dados)

      return dados
    })

    .catch((err: any) => {
      console.log(`Erro ao consultar cursos `, 'CODE: ', err.code, err)
      return console.log(`Erro ao consultar cursos `, 'CODE: ', err.code, err)
    })

  return resultado[0]
}
