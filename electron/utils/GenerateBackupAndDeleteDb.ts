import { dialog } from "electron";
import path from "path";
import axios from "axios";
const mysql = require("mysql2");
const mysqldump = require("mysqldump");
const fs = require("fs");
import DbQueryString from "./dbQueryString";


// const DB_CONFIG = {
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "diario",
// }

// const link = "https://drive.google.com/file/d/1shnyMczHwT9yDW8V2OMT8Hfu_31AD1gd/view?usp=drive_link"
const db_schema_file_id = "1shnyMczHwT9yDW8V2OMT8Hfu_31AD1gd"
const GOOGLE_DRIVE_FILE_ID = db_schema_file_id; // 🔹 Substitua pelo ID do arquivo SQL
const DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${GOOGLE_DRIVE_FILE_ID}`;

const downloadDbSchemaFileFromGoogleDrive = async (filePathGoogleDrive: string) => {
    try {
        console.log("🔄 Baixando backup do Google Drive...");

        // Pasta onde o backup será salvo
        const backupDir = path.join(__dirname, "backups");
        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

        // Caminho do arquivo
        // const filePath = path.join(backupDir, "db_schema.sql");
        //filePath
        const filePath = filePathGoogleDrive

        // Faz o download do arquivo SQL
        const response = await axios({
            method: "GET",
            url: DOWNLOAD_URL,
            responseType: "stream",
        });

        // Salva o arquivo localmente
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", () => {
                console.log("✅ Backup baixado com sucesso!");
                resolve(filePath);
            });

            writer.on("error", (error) => {
                console.error("❌ Erro ao baixar o backup:", error);
                reject(error);
            });
        });
    } catch (error) {
        console.error("❌ Erro ao conectar com o Google Drive:", error);
    }
};

const saveFileRequest = async () => {
    const { filePath } = await dialog.showSaveDialog({
        title: "Salvar Backup",
        defaultPath: "backup.sql",
        filters: [{ name: "SQL", extensions: ["sql"] }],
    });

    if (!filePath) return { success: false, message: "Operação cancelada" };
    return filePath
}

const saveGoogleDriveFileRequest = async () => {
    const { filePath } = await dialog.showSaveDialog({
        title: "Salvar Arquivo do Google Drive",
        defaultPath: "db_schema.sql",
        filters: [{ name: "SQL", extensions: ["sql"] }],
    });

    if (!filePath) return { success: false, message: "Operação cancelada" };
    return filePath
}

const generateBackup = async (filePath: string, DB_CONFIG: any) => {
    try {
        await mysqldump({
            connection: DB_CONFIG,
            dumpToFile: filePath,
        })
        console.log("Backup gerado com sucesso!");
        return { success: true, message: "Backup gerado com sucesso" }

    } catch (error) {
        console.log("Erro ao gerar backup:", error);
        return { success: false, message: "Erro ao gerar backup" }
    }
}

const getTables = async (connection: any) => {
    const [tables] = await connection.promise().query("SHOW TABLES");
    if (tables.length === 0) {
        console.log("Nenhuma tabela encontrada.");
        return { success: false, message: "Nenhuma tabela encontrada." };
    }
    return tables;
}

const deleteDatabaseData = async (connection: any, tables: any) => {
    try {
        // Apagar os dados de todas as tabelas
        for (const table of tables) {
            const tableName = Object.values(table)[0];
            await connection.promise().query(`TRUNCATE TABLE \`${tableName}\``);
            console.log(`Dados apagados da tabela: ${tableName}`);
        }
        return { success: true, message: "Todas as tabelas foram apagadas." };

    } catch (error) {
        console.error("Erro ao apagar dados:", error);
        return { success: false, message: "Erro ao apagar os dados." };

    }
}

const deleteAllTables = async (connection: any) => {
    try {
        // Excluir todas as tabelas
        const tables = await getTables(connection);
        for (const table of tables) {
            const tableName = Object.values(table)[0];
            await connection.promise().query(`DROP TABLE \`${tableName}\``);
            console.log(`Tabela deletada: ${tableName}`);
        }
        return { success: true, message: "Todas as tabelas foram apagadas e deletadas." };

    } catch (error) {
        console.error("Erro ao excluir tabelas:", error);
        return { success: false, message: "Erro ao apagar os dados e excluir tabelas." };
    }
}

const processClearDatabase = async (connection: any) => {
    try {
        const tables = await getTables(connection);
        await deleteDatabaseData(connection, tables)
        await deleteAllTables(connection)

        return { success: true, message: "Todas as tabelas foram apagadas e deletadas." };

    } catch (error) {
        console.error("Erro ao apagar dados e excluir tabelas:", error);
        return { success: false, message: "Erro ao apagar os dados e excluir tabelas." };

    }
}

const dbRestore = async (connection: any, tempFilePath: string, newYear: number) => {
    //db_schema.sql
    try {
        // Ler o conteúdo do arquivo SQL
        const sqlCommands = fs.readFileSync(tempFilePath, "utf8");
        // console.log('SQLCommands RESULT: ', sqlCommands)

        // Executar os comandos SQL no banco de dados
        const resultCreateTables = await connection.promise().query(sqlCommands);

        if(!resultCreateTables) {
            console.error("Erro ao restaurar o banco de dados: ", resultCreateTables);
            return { success: false, message: "Erro ao restaurar o banco de dados." };
        }

        await insertConfigRow(connection, newYear)
        return { success: true, message: "Banco de dados restaurado com sucesso!" };
        


    } catch (error) {
        console.error("Erro ao restaurar o banco de dados:", error);
        return { success: false, message: "Erro ao baixar e restaurar o banco de dados." };
    } finally {
        return { "success": true, "message": "Fim da restauracao!" }
    }
}

const getWebConfigSchool = async (connection: any) => {
    const [result] = await connection.promise().query(`SELECT Ano, Status FROM Config`)
    return result
}

const insertConfigRow = async (connection: any, ano: number) => {
    const [result] = await connection.promise().query(`INSERT INTO Config (Ano, Status) VALUES (?, 'ativo')`, [ano])
    return result
}

type TConnection = {
    host: string,
    port: number,
    user: string,
    password: string,
    database: string
}


export const ProcessUpdateDbYearWithBackup = async (conn: TConnection) => {
    const connection = await mysql.createConnection(conn);
    // const tempFilePath = path.join(__dirname, "db_schema.sql");

    try {
        // Pegar o ano atual da escola e incrementar
        const webConfig = await getWebConfigSchool(connection)
        console.log('WebConfig: ', webConfig)
        const { Ano, Status } = webConfig[0]
        const newYear = Ano + 1

        // Solicitar o caminho para salvar o backup
        const filePath = await saveFileRequest() as string
        console.log('Backup saved in path: ', filePath)
        // Criar backup do banco de dados
        await generateBackup(filePath, conn);
        // Após o backup, apagar os dados e excluir as tabelas
        await processClearDatabase(connection);

        const pathGoogleDriveFile = await saveGoogleDriveFileRequest() as string
        const result = await downloadDbSchemaFileFromGoogleDrive(pathGoogleDriveFile);
        if (!result) {
            return { success: false, message: "Erro ao baixar o backup." };
        }

        await dbRestore(connection, pathGoogleDriveFile, newYear);

        connection.end();
        return { success: true, message: `Backup salvo e tabelas apagadas com sucesso em: ${filePath}` };
    }
    catch (error) {
        console.error("Erro ao gerar backup:", error);
        connection.end();
        return { success: false, message: "Erro ao gerar backup." };
    }
}