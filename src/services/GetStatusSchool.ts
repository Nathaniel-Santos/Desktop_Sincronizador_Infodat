interface ConfigType {
  id: number;
  Ano: number;
  Status: string;
}

export default async function GetStatusSchool(connection: any) {

  const resultado: [ConfigType[]] = await connection.promise().query(`SELECT * FROM Config`)

  return resultado[0]
}
