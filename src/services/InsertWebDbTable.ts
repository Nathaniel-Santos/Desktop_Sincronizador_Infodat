
export async function InsertWebDbTable(connection: any, tableName: string, tableFields: string[], dados: string[]) {
  console.log('Dados insert: ', dados)

  let tableFieldsQUery = ''

  tableFields.map(item => {
    const fieldsLength = tableFields.length - 1
    const lastFields = tableFields[fieldsLength]
    tableFieldsQUery = item !== lastFields ? tableFieldsQUery + item + ',' : tableFieldsQUery + item
  })

  switch (tableName) {
    case 'alunos':
      tableFieldsQUery = 'Matricula,Curso,Turma,NumDiario,Nome,Endereco,Complemento,Bairro,Cidade,Estado,Cep,Fone,Celular,Sexo,Email,IR,Identidade,Nascimento,Naturalidade,Nacionalidade,SenhaInternet,PaiNome,PaiFone,PaiCelular,PaiEMail,MaeNome,MaeFone,MaeCelular,MaeEmail,ResponsavelNome,ResponsavelCPF,ResponsavelFone,ResponsavelCelular,ResponsavelEmail,Situacao'
      break
    case 'digitacao':
      tableFieldsQUery = 'CodFuncionario,CodDisciplina,CodCurso,Turma,Auxiliar'
      break

    case 'Grades':
      tableFieldsQUery = 'Curso,Disciplina,TipoAvaliacao'
      break

    case 'NotasAuxLeg':
      tableFieldsQUery = 'Chave,Leg01,Leg02,Leg03,Leg04,Leg05,Leg06,Leg07,Leg08,Leg09,Leg10'
      break
  }

  console.log('tableFieldsQuery2: ', tableFieldsQUery)
  console.log(`INSERT INTO ${tableName}(${tableFieldsQUery}) VALUES ?`)

  const result = await connection.promise().query(`INSERT INTO ${tableName}(${tableFieldsQUery}) VALUES ?`,
    [dados])
    .then((result: any) => {
      return { Status: 200, Msg: `Success ${tableName}`, Return: result }
    })
    .catch((error: any) => {
      console.log('Error: ', error)
      return { Status: 500, Msg: `Error trying to insert data into ${tableName}`, Return: error }
    })

  return result
}
