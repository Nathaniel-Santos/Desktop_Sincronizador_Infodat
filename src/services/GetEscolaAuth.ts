export default async function GetEscolaAuth(connection: any, user: string, pass: string) {
    const query = 'SELECT db_host, db_name, db_user, db_pass, db_port FROM escola_app WHERE nome = ? AND conn_pass = ?'
    const [result, _] = await connection.promise().query(query, [user, pass])

    console.log('ResultColumns: ', result)

    return result[0]
}
