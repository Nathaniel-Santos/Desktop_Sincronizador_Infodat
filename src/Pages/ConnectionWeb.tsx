const mysql = require('mysql2')
import { ipcRenderer } from 'electron'

import styles from '../assets/styles/ConnectionWeb/ConnectionWeb.module.scss'
import { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Modal from 'react-modal'

import GetStatusSchool from '@/services/GetStatusSchool';
import { useMysqlConnectionStore } from '@/store/connection'

import { Button, TextField } from '@mui/material';
import TopBar from '@/components/TopBar/TopBar';
import SideBar from '@/components/SideBar/SideBar';
import { connMsgType } from './Types/ConnectionWeb'

export default function ConnectionWeb() {
  const [modalIsOpen, setIsOpen] = useState(false)
  const [escolaInput, setEscolaInput] = useState('')
  const [hostInput, setHostInput] = useState('')
  const [portInput, setPortInput] = useState('')
  const [userInput, setUserInput] = useState('')
  const [passInput, setPassInput] = useState('')
  const [dbInput, setDbInput] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [senhaMostrarDados, setSenhaMostrarDados] = useState('')
  const [typeFields, setTypeFields] = useState('password')
  const mysqlConnection = useMysqlConnectionStore((state) => state.mysqlConnection)

  Modal.setAppElement('#root')

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function onSave() {
    // const msgSend = `DBHOST=${hostInput}\nDBPORT=${portInput}\nDBUSER=${userInput}\nDBPASS=${passInput}\nDBNAME=${dbInput}\nESCOLA=${escolaInput}`
    const msgSend = {
      Host: hostInput,
      Port: portInput,
      User: userInput,
      Pass: passInput,
      Db: dbInput,
      Escola: escolaInput
    }

    const msgSendString = JSON.stringify(msgSend)

    ipcRenderer.send('saveConn', msgSendString)

    ipcRenderer.on('saveConn', (event, msg) => {
      const result = msg
      console.log('SaveConnReturn', result)

      if (result.statusCode === 200) {
        ipcRenderer.send('full-info-config-request', { authStatus: 'Waiting' })
        // ipcRenderer.send('notification', { title: 'INFODAT', body: 'Configuração salva com sucesso' })
        openModal()

      } else {
        alert('Não foi possível salvar as alterações')
        // window.location.reload()
      }
    })

  }

  function handleConnect() {
    const connection = mysql.createPool({
      host: hostInput,
      user: userInput,
      password: passInput,
      database: dbInput,
      port: portInput
    })

    GetStatusSchool(connection)
      .then((result) => {
        console.log('StatusResult: ', result)
        ipcRenderer.send('notification', { title: 'INFODAT', body: 'Conexão efetuada com sucesso' })
      })
      .catch((err) => {
        console.log('Error: ', err)
      })
  }

  function handleShowFields() {
    if (isVisible === true) {
      setSenhaMostrarDados('')
    }
    setIsVisible(!isVisible)
  }

  const onChangeSenhaMostrar = (event) => {
    const { value } = event.target
    setSenhaMostrarDados(value)
  }

  function handleMostrarSenhaConfirme() {
    if (senhaMostrarDados === 'dbi10p14') {
      setTypeFields('text')
      handleShowFields()

    } else {
      handleShowFields()
    }
  }

  //Iniciar dados de connexão
  useEffect(() => {
    ipcRenderer.send('connection')

    ipcRenderer.on('connection', (event, msg: connMsgType) => {
      setHostInput(msg.Host)
      setPortInput(msg.Port)
      setUserInput(msg.User)
      setPassInput(msg.Pass)
      setDbInput(msg.Db)
      setEscolaInput(msg.Escola)
    })
  }, [])


  return (
    <ThemeProvider theme={darkTheme}>

      <div className={styles.app} >
        <TopBar />

        <Modal //MENSAGEM DE SUCESSO AO SALVAR DADOS
          closeTimeoutMS={200}
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Dados salvo com sucesso"
          overlayClassName={styles.modalOverlay}
          className={`${styles.modalContent} ${modalIsOpen !== true ? styles.modalClosed : styles.modalOpened}`}
        >
          <h2>Alterações salvas com sucesso</h2>
          <p>Após retornar para páginas de sincronização favor atualizar a pagina para confirmar os novos dados</p>
          <button onClick={closeModal}>Fechar</button>
        </Modal>

        <Modal //MENSAGEM DE SUCESSO AO SALVAR DADOS
          closeTimeoutMS={200}
          isOpen={isVisible}
          onRequestClose={handleShowFields}
          contentLabel="Dados salvo com sucesso"
          overlayClassName={styles.modalOverlay}
          className={`${styles.modalContent} ${modalIsOpen !== true ? styles.modalClosed : styles.modalOpened}`}
        >
          <h2>AUTORIZAÇÃO</h2>
          <p>Caso não tenha acesso, favor entrar em contato com o suporte infodat</p>

          <p>
            <strong>
              Digite a senha
            </strong>
          </p>
          <input type="password" onChange={onChangeSenhaMostrar} name="inputAutorizarSenha" id={`${styles.inputAutorizarSenha}`} value={senhaMostrarDados} />

          <div id={`${styles.buttonAutorizarSenhaContainer}`}>
            <button id={`${styles.buttonConfirmarAutorizarSenha}`} onClick={handleMostrarSenhaConfirme}>Confirmar</button>
            <button id={`${styles.buttonCancelarAutorizarSenha}`} onClick={handleShowFields}>Cancelar</button>
          </div>
        </Modal>

        <div className={styles.appHeader}>
          <SideBar />

          <div className={styles.homeRightSide}>
            <div className={styles.homeRightSideContentBox}>
              <h2>DADOS DE CONEXÃO</h2>

              <div className={styles.formContainer}>
                <div className={styles.hostContainer}>
                  <TextField id="outlined-basic" spellCheck={false} onChange={v => setHostInput(v.target.value)} value={hostInput} className={styles.hostInput} label="Host" variant="outlined" type={typeFields} />
                  <TextField id="outlined-basic" spellCheck={false} onChange={v => setPortInput(v.target.value)} value={portInput} className={styles.portInput} label="Porta" variant="outlined" type={typeFields} />
                </div>

                <TextField id="outlined-basic" spellCheck={false} onChange={v => setUserInput(v.target.value)} value={userInput} className={styles.userInput} label="Usuário" variant="outlined" type={'text'} />
                <TextField id="outlined-basic" spellCheck={false} onChange={v => setPassInput(v.target.value)} value={passInput} className={styles.passInput} label="Senha" variant="outlined" type={typeFields} />
                <TextField id="outlined-basic" spellCheck={false} onChange={v => setDbInput(v.target.value)} value={dbInput} className={styles.dbInput} label="Database" variant="outlined" type={typeFields} />
                <TextField id="outlined-basic" spellCheck={false} onChange={v => setEscolaInput(v.target.value)} value={escolaInput} className={styles.dbInput} label="Escola" variant="outlined" />
              </div>

              <span>
                <div className={styles.SaveButtonContainer} onClick={onSave}>
                  <Button variant="contained">
                    Salvar
                  </Button>
                </div>

                <div className={styles.ConnectButtonContainer} onClick={handleConnect}>
                  <Button variant="outlined" >
                    Conectar
                  </Button>
                </div>

                <div className={styles.MostrarButtonContainer} onClick={handleShowFields}>
                  <Button variant="outlined" >
                    Mostrar
                  </Button>
                </div>
              </span>
            </div>

          </div>
        </div>

      </div>

    </ThemeProvider>
  )
}
