import { ipcRenderer } from "electron"

export function SaveCredentialsFile(
    host: string,
    db_name: string,
    user: string,
    pass: string,
    port: string | number,
    title: string,
    openModal: () => void ) {

    const msgSend = {
        Host: host,
        Db: db_name,
        User: user,
        Pass: pass,
        Port: port,
        Escola: title
    }

    const msgSendString = JSON.stringify(msgSend)

    ipcRenderer.send('saveConn', msgSendString)

    ipcRenderer.on('saveConn', (event, msg) => {
        const result = msg
        console.log('SaveConnReturn', result)

        if (result.statusCode === 200) {
            ipcRenderer.send('full-info-config-request', { authStatus: 'Waiting' })
            // ipcRenderer.send('notification', { title: 'INFODAT', body: 'Configuração salva com sucesso' })
        } else {
            openModal()
            alert('Não foi possível salvar as alterações')
            // window.location.reload()
        }
    })
}