type returnType = {
  fieldCount: string|number,
  affectedRows: string|number,
  insertId: string|number,
  info: string|number,
  serverStatus: string|number,
  warningStatus: string|number
}

export async function DeleteWebTableData(connection: any, tableName: string) {

  const result = await connection.promise().query(`DELETE FROM ${tableName}`)
  const resultStr = JSON.stringify(result)
  const resultJson:returnType = JSON.parse(resultStr)[0]

  if (resultJson.affectedRows !== undefined){
    return {Status: 200, Msg: 'Delete successed', affectedRows: resultJson.affectedRows}
  } else {
    return {Status: 500, Msg: 'Error on delete operation', Return: resultJson}
  }
}
