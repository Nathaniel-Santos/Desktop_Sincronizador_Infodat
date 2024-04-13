var import_os = require("os");
var import_path = require("path");
const { app, BrowserWindow, shell, ipcMain, dialog, Notification, globalShortcut } = require("electron");
process.env.DIST_ELECTRON = (0, import_path.join)(__dirname, "../..");
process.env.DIST = (0, import_path.join)(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = app.isPackaged ? process.env.DIST : (0, import_path.join)(process.env.DIST_ELECTRON, "../public");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const { writeFile, writeFileSync } = require("original-fs");
const urlName = require("url");
const fs = require("fs");
const nomeArquivo = (0, import_path.join)(__dirname, "../../../electron/main/conn.ini");
const pathConfig = (0, import_path.join)(__dirname, "../../../electron/main/config.ini");
const filePathConn = (0, import_path.join)(app.getPath("userData"), "/conn.json");
const filePathConfig = (0, import_path.join)(app.getPath("userData"), "/config.json");
if ((0, import_os.release)().startsWith("6.1"))
  app.disableHardwareAcceleration();
if (process.platform === "win32")
  app.setAppUserModelId(app.getName());
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
let win = null;
const preload = (0, import_path.join)(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = (0, import_path.join)(process.env.DIST, "index.html");
async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    height: 700,
    width: 950,
    minHeight: 650,
    minWidth: 800,
    frame: false,
    icon: (0, import_path.join)(process.env.PUBLIC, "Logomarca.png"),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (app.isPackaged) {
    win.loadURL(urlName.format({
      pathname: indexHtml,
      protocol: "file:",
      slashes: true
    }));
  } else {
    win.loadURL(url);
    win.webContents.openDevTools();
  }
  function showNotification(title, body) {
    const iconPath = (0, import_path.join)(process.env.PUBLIC, "Logomarca.png");
    new Notification({ title, body, icon: iconPath }).show();
  }
  ipcMain.on("notification", (event, data) => {
    if (process.platform === "win32") {
      const appName = app.name.toUpperCase();
      app.setAppUserModelId(appName);
    }
    showNotification(data.title, data.body);
    event.sender.send("notification", { Msg: "Notification fired" });
  });
  ipcMain.on("closeApp", () => {
    win.close();
  });
  ipcMain.on("maximizeRestoreApp", () => {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  });
  ipcMain.on("minimizeApp", () => {
    win.minimize();
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", new Date().toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url: url2 }) => {
    if (url2.startsWith("https:"))
      shell.openExternal(url2);
    return { action: "deny" };
  });
}
ipcMain.on("config", async (event, msg) => {
  fs.readFile(filePathConfig, "utf8", (err, data) => {
    if (err) {
      event.sender.send("credential_error", err);
    } else {
      const fileData = JSON.parse(data);
      const user = fileData.USER;
      const pass = fileData.PASS;
      const mdbPath = fileData.MDBPATH;
      const downloadPath = fileData.DOWNLOADPATH;
      const authMsg = { User: user, Pass: pass, filePath: filePathConfig, data: fileData, downloadPath };
      event.sender.send("credentials", authMsg);
    }
  });
});
ipcMain.on("full-info-config-request", (event, msg) => {
  fs.readFile(filePathConn, "utf8", (err, data) => {
    if (err) {
      console.log("Erro ao tentar ler o arquivo", err);
      return;
    } else {
      const fileData = JSON == null ? void 0 : JSON.parse(data);
      const host = fileData == null ? void 0 : fileData.Host;
      const port = fileData == null ? void 0 : fileData.Port;
      const user = fileData == null ? void 0 : fileData.User;
      const pass = fileData == null ? void 0 : fileData.Pass;
      const db = fileData == null ? void 0 : fileData.Db;
      const escola = fileData == null ? void 0 : fileData.Escola;
      const connMsg = { Host: host, Port: port, User: user, Pass: pass, Db: db, Escola: escola, connMsg: fileData };
      event.sender.send("full-info-config-response", connMsg);
    }
  });
});
ipcMain.on("save-config-change", (event, msg) => {
  writeFile(filePathConfig, JSON.stringify(msg), (err) => {
    if (err) {
      event.sender.send("save-config-change", "Erro create-config-file:", filePathConfig);
    } else {
      writeFileSync(filePathConfig, JSON.stringify(msg), "utf-8");
      event.sender.send("save-config-change", "Config.json criado com sucesso1");
    }
  });
});
ipcMain.on("create-config-file", (event, msg) => {
  const fileConfigData = { USER: "Infodat", PASS: "22201034", MDBPATH: "", DOWNLOADPATH: "" };
  if (fs.existsSync(filePathConfig) && (msg == null ? void 0 : msg.SAVE) !== true) {
    event.sender.send("create-config-file", "Config.json criado com sucesso1");
    return;
  } else {
    if ((msg == null ? void 0 : msg.SAVE) === true) {
      writeFile(filePathConfig, JSON.stringify(msg), (err) => {
        if (err) {
          event.sender.send("create-config-file", "Erro create-config-file:", filePathConfig);
        } else {
          writeFileSync(filePathConfig, JSON.stringify(msg), "utf-8");
          event.sender.send("create-config-file", "Config.json criado com sucesso2");
        }
      });
    } else {
      writeFile(filePathConfig, JSON.stringify(fileConfigData), (err) => {
        if (err) {
          event.sender.send("create-config-file", "Erro create-config-file:", filePathConfig);
        } else {
          writeFileSync(filePathConfig, JSON.stringify(fileConfigData), "utf-8");
          event.sender.send("create-config-file", "Config.json criado com sucesso3");
        }
      });
    }
  }
});
ipcMain.on("create-conn-file", (event, msg) => {
  const fileConfigConn = {
    Host: "mysql745.umbler.com",
    User: "nathandb",
    Pass: ".G3.UYK[y7fP",
    Db: "nathandb",
    Port: "41890",
    Escola: "Infodat"
  };
  if (fs.existsSync(filePathConn)) {
    event.sender.send("create-conn-file", "created");
    return;
  } else {
    writeFile(filePathConn, JSON.stringify(fileConfigConn), (err) => {
      if (err) {
        event.sender.send("create-conn-file", "Erro create-conn:", filePathConn);
      } else {
        event.sender.send("create-conn-file", "created");
      }
    });
  }
});
ipcMain.on("connection", (event, msg) => {
  fs.readFile(filePathConn, "utf8", (err, data) => {
    if (err) {
      console.log("Erro ao tentar ler o arquivo", err);
      return;
    } else {
      const fileData = JSON.parse(data);
      const host = fileData.Host;
      const port = fileData.Port;
      const user = fileData.User;
      const pass = fileData.Pass;
      const db = fileData.Db;
      const escola = fileData.Escola;
      const connMsg = { Host: host, Port: port, User: user, Pass: pass, Db: db, Escola: escola, Data: fileData };
      event.sender.send("connection", connMsg);
    }
  });
});
ipcMain.on("saveConn", (event, msg) => {
  const msgData = msg;
  fs.writeFile(filePathConn, msgData, (err, data) => {
    if (err) {
      console.log("Erro ao tentar ler o arquivo", err);
      return;
    }
    event.sender.send("saveConn", { Msg: "Saved successfully", statusCode: 200, data: msg, msg: msgData });
  });
});
ipcMain.on("file-database-request", (event, msg) => {
  const msgData = msg;
  if (msgData.auth) {
    dialog.showOpenDialog({
      title: "DIRETORIO DO ARQUIVO INTERNET.MDB",
      defaultPath: (0, import_path.join)(__dirname),
      buttonLabel: "SALVAR",
      properties: ["openDirectory"]
    }).then((file) => {
      if (!file.canceled && file.filePaths.length !== 0) {
        const filepath = file.filePaths[0].toString();
        event.reply("file-database", filepath);
      }
    }).catch((err) => {
      event.sender.send("notification", { Msg: "Diret\xF3rio Inexistente" });
    });
  }
});
ipcMain.on("file-request", (event, msg) => {
  console.log("File-Request fired");
  const msgData = msg;
  let getFilePath = "";
  let getFileData;
  fs.readFile(filePathConfig, "utf8", (err, data) => {
    if (err) {
      event.sender.send("credential_error", err);
    } else {
      const fileData = JSON.parse(data);
      console.log("FILE_DATA: ", fileData);
      getFilePath = fileData.downloadPath;
      getFileData = fileData;
      console.log("getFileData: ", getFileData);
    }
  });
  console.log("msgData: ", msgData);
  const allWindows = BrowserWindow.getAllWindows();
  console.log("AllWindows: ", allWindows);
  if (msgData.auth) {
    dialog.showOpenDialog({
      title: "PASTA PARA SALVAR AS NOTAS",
      defaultPath: msg.defaultUrl ? msg.defaultUrl : (0, import_path.join)(__dirname),
      buttonLabel: "SALVAR",
      properties: ["openDirectory"]
    }).then((file) => {
      console.log("filePath: ", file);
      if (!file.canceled && file.filePaths.length !== 0) {
        const filepath = file.filePaths[0].toString();
        event.reply("file", filepath);
      }
      const allWindows2 = BrowserWindow.getAllWindows();
      console.log("Allwindows2: ", allWindows2);
    }).catch((err) => {
      console.log("Erro: ", err);
      event.sender.send("notification", { Msg: "Diret\xF3rio Inexistente" });
    });
  }
});
app.whenReady().then(() => {
  createWindow();
});
app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin")
    app.quit();
});
app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized())
      win.restore();
    win.focus();
  }
});
app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  console.log("allWindowBase: ", allWindows);
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
app.on("error", (err) => {
  console.log("Error: ", err);
});
process.on("uncaughtException", function(err) {
  console.log("Erro UncaughtException: ", err);
  console.error(new Date().toUTCString() + " uncaughtException:", err.message);
  console.error(err.stack);
  process.exit(1);
});
