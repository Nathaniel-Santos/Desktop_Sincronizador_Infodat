var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  ProcessUpdateDbYearWithBackup: () => ProcessUpdateDbYearWithBackup
});
module.exports = __toCommonJS(stdin_exports);
var import_electron = require("electron");
var import_path = __toESM(require("path"));
var import_axios = __toESM(require("axios"));
const mysql = require("mysql2");
const mysqldump = require("mysqldump");
const fs = require("fs");
const db_schema_file_id = "1shnyMczHwT9yDW8V2OMT8Hfu_31AD1gd";
const GOOGLE_DRIVE_FILE_ID = db_schema_file_id;
const DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${GOOGLE_DRIVE_FILE_ID}`;
const downloadDbSchemaFileFromGoogleDrive = async (filePathGoogleDrive) => {
  try {
    console.log("\u{1F504} Baixando backup do Google Drive...");
    const backupDir = import_path.default.join(__dirname, "backups");
    if (!fs.existsSync(backupDir))
      fs.mkdirSync(backupDir);
    const filePath = filePathGoogleDrive;
    const response = await (0, import_axios.default)({
      method: "GET",
      url: DOWNLOAD_URL,
      responseType: "stream"
    });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log("\u2705 Backup baixado com sucesso!");
        resolve(filePath);
      });
      writer.on("error", (error) => {
        console.error("\u274C Erro ao baixar o backup:", error);
        reject(error);
      });
    });
  } catch (error) {
    console.error("\u274C Erro ao conectar com o Google Drive:", error);
  }
};
const saveFileRequest = async () => {
  const { filePath } = await import_electron.dialog.showSaveDialog({
    title: "Salvar Backup",
    defaultPath: "backup.sql",
    filters: [{ name: "SQL", extensions: ["sql"] }]
  });
  if (!filePath)
    return { success: false, message: "Opera\xE7\xE3o cancelada" };
  return filePath;
};
const saveGoogleDriveFileRequest = async () => {
  const { filePath } = await import_electron.dialog.showSaveDialog({
    title: "Salvar Arquivo do Google Drive",
    defaultPath: "db_schema.sql",
    filters: [{ name: "SQL", extensions: ["sql"] }]
  });
  if (!filePath)
    return { success: false, message: "Opera\xE7\xE3o cancelada" };
  return filePath;
};
const generateBackup = async (filePath, DB_CONFIG) => {
  try {
    await mysqldump({
      connection: DB_CONFIG,
      dumpToFile: filePath
    });
    console.log("Backup gerado com sucesso!");
    return { success: true, message: "Backup gerado com sucesso" };
  } catch (error) {
    console.log("Erro ao gerar backup:", error);
    return { success: false, message: "Erro ao gerar backup" };
  }
};
const getTables = async (connection) => {
  const [tables] = await connection.promise().query("SHOW TABLES");
  if (tables.length === 0) {
    console.log("Nenhuma tabela encontrada.");
    return { success: false, message: "Nenhuma tabela encontrada." };
  }
  return tables;
};
const deleteDatabaseData = async (connection, tables) => {
  try {
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
};
const deleteAllTables = async (connection) => {
  try {
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
};
const processClearDatabase = async (connection) => {
  try {
    const tables = await getTables(connection);
    await deleteDatabaseData(connection, tables);
    await deleteAllTables(connection);
    return { success: true, message: "Todas as tabelas foram apagadas e deletadas." };
  } catch (error) {
    console.error("Erro ao apagar dados e excluir tabelas:", error);
    return { success: false, message: "Erro ao apagar os dados e excluir tabelas." };
  }
};
const dbRestore = async (connection, tempFilePath, newYear) => {
  try {
    const sqlCommands = fs.readFileSync(tempFilePath, "utf8");
    const resultCreateTables = await connection.promise().query(sqlCommands);
    if (!resultCreateTables) {
      console.error("Erro ao restaurar o banco de dados: ", resultCreateTables);
      return { success: false, message: "Erro ao restaurar o banco de dados." };
    }
    await insertConfigRow(connection, newYear);
    return { success: true, message: "Banco de dados restaurado com sucesso!" };
  } catch (error) {
    console.error("Erro ao restaurar o banco de dados:", error);
    return { success: false, message: "Erro ao baixar e restaurar o banco de dados." };
  } finally {
    return { "success": true, "message": "Fim da restauracao!" };
  }
};
const getWebConfigSchool = async (connection) => {
  const [result] = await connection.promise().query(`SELECT Ano, Status FROM Config`);
  return result;
};
const insertConfigRow = async (connection, ano) => {
  const [result] = await connection.promise().query(`INSERT INTO Config (Ano, Status) VALUES (?, 'ativo')`, [ano]);
  return result;
};
const ProcessUpdateDbYearWithBackup = async (conn) => {
  const connection = await mysql.createConnection(conn);
  try {
    const webConfig = await getWebConfigSchool(connection);
    console.log("WebConfig: ", webConfig);
    const { Ano, Status } = webConfig[0];
    const newYear = Ano + 1;
    const filePath = await saveFileRequest();
    console.log("Backup saved in path: ", filePath);
    await generateBackup(filePath, conn);
    await processClearDatabase(connection);
    const pathGoogleDriveFile = await saveGoogleDriveFileRequest();
    const result = await downloadDbSchemaFileFromGoogleDrive(pathGoogleDriveFile);
    if (!result) {
      return { success: false, message: "Erro ao baixar o backup." };
    }
    await dbRestore(connection, pathGoogleDriveFile, newYear);
    connection.end();
    return { success: true, message: `Backup salvo e tabelas apagadas com sucesso em: ${filePath}` };
  } catch (error) {
    console.error("Erro ao gerar backup:", error);
    connection.end();
    return { success: false, message: "Erro ao gerar backup." };
  }
};
