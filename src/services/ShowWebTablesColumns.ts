export async function ShowWebTablesColumns(connection:any, tableName:any, webDbName: string) {
  // SELECT COLUMN_NAME
  // FROM INFORMATION_SCHEMA.COLUMNS
  // WHERE TABLE_SCHEMA = 'nathandb' AND TABLE_NAME = 'alunos';

  console.log(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ${webDbName} AND TABLE_NAME = ${tableName}`)

  const result = await connection.promise().query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${webDbName}' AND TABLE_NAME = '${tableName}'`)

  console.log('ResultColumns: ', result)
  const resultFilterFields = result[0].map(item => item.COLUMN_NAME)
  return resultFilterFields
}
