import { readFileSync } from "fs";
import { Buffer } from "buffer";
import MDBReader from "mdb-reader";


export function GetMdbTableData(mdbFilePath: string, password: string, tableName: string, webTableFields: [string]) {

  const buffer = readFileSync(mdbFilePath);
  const reader = new MDBReader(Buffer.from(buffer), { password: password });


  const table = reader.getTable(tableName)
  let mdbColumnsTable: any = table.getColumns()
  mdbColumnsTable = mdbColumnsTable.map(item => item.name)

  console.log('mdbTableFieldsFilter1: ', mdbColumnsTable)

  for (const mdbValue of mdbColumnsTable) {
    let mdbValueLower = mdbValue.toLowerCase()

    const find = webTableFields.filter(item => {
      let itemStr = item
      itemStr = itemStr.toLowerCase()
      return itemStr === mdbValueLower
    })

    if (find.length === 0) {
      mdbColumnsTable = mdbColumnsTable.filter(item => item !== mdbValue)
    }
  }

  switch (tableName) {
    case 'Digitacao':
      mdbColumnsTable = ['Funcionario', 'Disciplina', 'Curso', 'Turma', 'Complemento']
      break

    case 'Grades':
      mdbColumnsTable = ['Curso', 'Disciplina', 'TipoAvaliacao']
      break

    case 'NotasAuxLeg':
      mdbColumnsTable = ['Chave','Leg01','Leg02','Leg03','Leg04','Leg05','Leg06','Leg07','Leg08','Leg09','Leg10']
      break
  }

  console.log('mdbTableFieldsFilter2: ', mdbColumnsTable)
  // const tableTurmaData = table.getData({columns: ['Turma']})
  // const tableMatriculaData = table.getData({columns: ['Matricula']})

  const tableData = table.getData({ columns: mdbColumnsTable })
  console.log('tableData: ', tableData)

  return tableData
}
