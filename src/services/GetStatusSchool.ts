interface ConfigType {
  id: number;
  Ano: number;
  Status: string;
}

export default async function GetStatusSchool(connection: any) {

  const resultado: [ConfigType[]] = await connection.promise().query(`SELECT * FROM Config`)
  console.log('StatusSchool: ', resultado)

  return resultado[0]
}
