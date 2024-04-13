export async function GetTablesName(connection: any) {
  // console.log('Conn: ', connection)
  const query = 'SHOW tables'

  const result = await connection.promise().query(query)

  // console.log('Result: ', result[0])
  const tablesResult = result[0]?.map(item => item.Tables_in_nathandb)

  return tablesResult

}
