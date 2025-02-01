const { app, BrowserWindow, shell, ipcMain, dialog, Notification, globalShortcut } = require('electron')
process.env.DIST_ELECTRON = join(__dirname, '../..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST_ELECTRON, '../public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';


const { writeFile, writeFileSync } = require('original-fs')
import { ProcessUpdateDbYearWithBackup } from '../utils/GenerateBackupAndDeleteDb';
import { release } from 'os'
import path, { join } from 'path'
const urlName = require('url')
const fs = require('fs')

const nomeArquivo = join(__dirname, '../../../electron/main/conn.ini')
const pathConfig = join(__dirname, '../../../electron/main/config.ini')

const filePathConn = join(app.getPath('userData'), '/conn.json')
const filePathConfig = join(app.getPath('userData'), '/config.json')

type connMsgType = {
  Host: string,
  User: string,
  Pass: string,
  Db: string,
  Port: string,
  Escola: string,
  downloadPath: string
}


// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
// const indexHtml = join(__dirname, '../../../dist/index.html')


async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    height: 700,
    width: 950,
    minHeight: 650,
    minWidth: 800,
    frame: false,
    icon: join(process.env.PUBLIC, 'Logomarca.png'),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })


  // win.removeMenu()

  if (app.isPackaged) {
    // win.loadFile(indexHtml)
    win.loadURL(urlName.format({
      pathname: indexHtml,
      protocol: 'file:',
      slashes: true
    }))
  } else {
    win.loadURL(url)
    
    win.webContents.openDevTools()
    // const indexHtml = join(process.env.DIST, 'index.html')
    // win.loadURL(indexHtml)
  }

  function showNotification(title, body) {
    const iconPath = join(process.env.PUBLIC, 'Logomarca.png')
    new Notification({ title: title, body: body, icon: iconPath }).show()
  }

  ipcMain.on('notification', (event, data) => {
    if (process.platform === 'win32') {
      const appName = app.name.toUpperCase()
      app.setAppUserModelId(appName);
    }
    // showNotification(data.title, data.body)
    event.sender.send('notification', { Msg: 'Notification fired' })

  })

  // CLOSE APP
  ipcMain.on('closeApp', () => {
    win.close()
  })

  // MAXIMIZE RESTORE APP
  ipcMain.on('maximizeRestoreApp', () => {
    if (win.isMaximized()) {
      win.restore()
    } else {
      win.maximize()
    }
  })

  // MINIMIZE APP
  ipcMain.on('minimizeApp', () => {
    win.minimize()
  })

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

ipcMain.on('config', async (event, msg) => {
  type connMsgType = {
    USER: string,
    PASS: string,
    MDBPATH: string,
    DOWNLOADPATH: string
  }

  fs.readFile(filePathConfig, 'utf8', (err: ErrorCallback, data: any) => {
    if (err) {
      event.sender.send('credential_error', err)

    } else {
      const fileData: connMsgType = JSON.parse(data)
      const user: string = fileData.USER
      const pass: string = fileData.PASS
      const mdbPath: string = fileData.MDBPATH
      const downloadPath: string = fileData.DOWNLOADPATH
      const authMsg = { User: user, Pass: pass, filePath: filePathConfig, data: fileData, downloadPath: downloadPath }

      event.sender.send('credentials', authMsg)
    }

  })
})

ipcMain.on('full-info-config-request', (event, msg) => {
  type responseType = {
    Db: string,
    Escola: string,
    Host: string,
    Pass: string,
    Port: string,
    User: string
  }

  fs.readFile(filePathConn, 'utf8', (err: ErrorCallback, data: any) => {
    if (err) {
      console.log('Erro ao tentar ler o arquivo', err)
      return

    } else {
      const fileData: responseType = JSON?.parse(data)

      const host = fileData?.Host
      const port = fileData?.Port
      const user = fileData?.User
      const pass = fileData?.Pass
      const db = fileData?.Db
      const escola = fileData?.Escola

      const connMsg = { Host: host, Port: port, User: user, Pass: pass, Db: db, Escola: escola, connMsg: fileData }
      event.sender.send('full-info-config-response', connMsg)
    }

  })
})

ipcMain.on('save-config-change', (event, msg) => {
  writeFile(filePathConfig, JSON.stringify(msg), (err) => {
    if (err) {
      event.sender.send('save-config-change', 'Erro create-config-file:', filePathConfig)

    } else {
      writeFileSync(filePathConfig, JSON.stringify(msg), 'utf-8')
      event.sender.send('save-config-change', 'Config.json criado com sucesso1')
    }
  })

})

ipcMain.on('create-config-file', (event, msg) => {
  const fileConfigData = { USER: 'Infodat', PASS: '22201034', MDBPATH: '', DOWNLOADPATH: '' }
  // console.log('MSG-INDEX-CONFIG: ', msg)
  if (fs.existsSync(filePathConfig) && msg?.SAVE !== true) {
    event.sender.send('create-config-file', 'Config.json criado com sucesso1')
    return

  } else {
    if (msg?.SAVE === true) {
      writeFile(filePathConfig, JSON.stringify(msg), (err) => {
        if (err) {
          event.sender.send('create-config-file', 'Erro create-config-file:', filePathConfig)

        } else {
          writeFileSync(filePathConfig, JSON.stringify(msg), 'utf-8')
          event.sender.send('create-config-file', 'Config.json criado com sucesso2')
        }
      })

    } else {
      writeFile(filePathConfig, JSON.stringify(fileConfigData), (err) => {
        if (err) {
          event.sender.send('create-config-file', 'Erro create-config-file:', filePathConfig)

        } else {
          writeFileSync(filePathConfig, JSON.stringify(fileConfigData), 'utf-8')
          event.sender.send('create-config-file', 'Config.json criado com sucesso3')
        }
      })
    }

  }
})

ipcMain.on('create-conn-file', (event, msg) => {
  const fileConfigConn = {
    Host: 'mysql745.umbler.com',
    User: 'nathandb',
    Pass: '.G3.UYK[y7fP',
    Db: 'nathandb',
    Port: '41890',
    Escola: 'Infodat'
  }

  if (fs.existsSync(filePathConn)) {
    event.sender.send('create-conn-file', 'created')
    return
  } else {
    writeFile(filePathConn, JSON.stringify(fileConfigConn), (err) => {
      if (err) {
        event.sender.send('create-conn-file', 'Erro create-conn:', filePathConn)
      } else {
        event.sender.send('create-conn-file', 'created')
      }
    })
  }
})

ipcMain.on('connection', (event, msg) => {
  fs.readFile(filePathConn, 'utf8', (err: ErrorCallback, data: any) => {
    if (err) {
      console.log('Erro ao tentar ler o arquivo', err)
      return

    } else {
      const fileData: connMsgType = JSON.parse(data)
      const host = fileData.Host
      const port = fileData.Port
      const user = fileData.User
      const pass = fileData.Pass
      const db = fileData.Db
      const escola = fileData.Escola

      const connMsg = { Host: host, Port: port, User: user, Pass: pass, Db: db, Escola: escola, Data: fileData }
      event.sender.send('connection', connMsg)
    }

  })
})

ipcMain.on('clearAndUpdateDatabase', async (event, msg) => {
  console.log('CONN: ', msg.conn)
  const connection = msg.conn
  const dbConfig = {
    host: connection.Host,
    port: connection.Port,
    user: connection.User,
    password: connection.Pass,
    database: connection.Db,
    multipleStatements: true
  }
  await ProcessUpdateDbYearWithBackup(dbConfig)
})

ipcMain.on('saveConn', (event, msg: any) => {
  const msgData: any = msg

  fs.writeFile(filePathConn, msgData, (err: ErrorCallback, data: any) => {
    if (err) {
      console.log('Erro ao tentar ler o arquivo', err)
      return
    }
    event.sender.send('saveConn', { Msg: 'Saved successfully', statusCode: 200, data: msg, msg: msgData })
  })
})

ipcMain.on('file-database-request', (event, msg) => {
  const msgData: any = msg

  if (msgData.auth) {
    dialog.showOpenDialog({
      title: 'DIRETORIO DO ARQUIVO INTERNET.MDB',
      defaultPath: join(__dirname),
      buttonLabel: 'SALVAR',
      // Specifying the File Selector Property
      properties: ['openDirectory']
    }).then(file => {
      // Stating whether dialog operation was
      // cancelled or not.
      if (!file.canceled && file.filePaths.length !== 0) {
        const filepath = file.filePaths[0].toString();
        event.reply('file-database', filepath);
      }
    }).catch(err => {
      event.sender.send('notification', { Msg: 'Diretório Inexistente' })
    });
  }
})

ipcMain.on('file-request', (event, msg) => {
  const msgData: any = msg
  let getFilePath = ''
  let getFileData: connMsgType

  fs.readFile(filePathConfig, 'utf8', (err: ErrorCallback, data: any) => {
    if (err) {
      event.sender.send('credential_error', err)

    } else {
      const fileData: connMsgType = JSON.parse(data)
      getFilePath = fileData.downloadPath
      getFileData = fileData

      // const user: string = fileData.FILE_PATH_DOWNLOAD
      // const authMsg = { User: user, Pass: pass, filePath: filePathConfig, data: fileData }

      // event.sender.send('credentials', authMsg)
    }

  })

  BrowserWindow.getAllWindows()

  if (msgData.auth) {
    dialog.showOpenDialog({
      title: 'PASTA PARA SALVAR AS NOTAS',
      defaultPath: msg.defaultUrl ? msg.defaultUrl : join(__dirname),
      buttonLabel: 'SALVAR',
      // Specifying the File Selector Property
      properties: ['openDirectory']
    }).then(file => {
      // Stating whether dialog operation was cancelled or not.

      if (!file.canceled && file.filePaths.length !== 0) {
        const filepath = file.filePaths[0].toString();
        event.reply('file', filepath);
      }

      BrowserWindow.getAllWindows()

    }).catch(err => {
      console.log('Erro: ', err)
      event.sender.send('notification', { Msg: 'Diretório Inexistente' })
    });

  }
})

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  sessionStorage.clear()
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  console.log('allWindowBase: ', allWindows)
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

process.on('uncaughtException', function (err) {
  console.log('Erro UncaughtException: ', err)
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})
