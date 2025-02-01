const mysqldump = require('mysqldump')
const path = require("path");

type TdbConfig = {
    host: string,
    user: string,
    password: string,
    database: string
}

export const dumpDatabase = async (dbConfig: TdbConfig) => {
    const DB_CONFIG = {
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
    };

    try {
        const filePath = path.join(__dirname, "backup.sql");
        // Gerar o dump do banco de dados
        await mysqldump({
            connection: DB_CONFIG,
            dumpToFile: filePath,
        });

        return { status: 200, msg: 'Backup gerado com sucesso' }

    } catch (error) {
        return { status: 500, msg: 'Erro ao gerar backup' }
    }
}