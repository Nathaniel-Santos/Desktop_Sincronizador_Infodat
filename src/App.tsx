const mysql = require('mysql2')

import styles from 'styles/app.module.scss'
import { ipcRenderer } from 'electron'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import { motion, AnimatePresence } from 'framer-motion'

import TopBar from './components/TopBar/TopBar'

import { Player } from '@lottiefiles/react-lottie-player'
import UserOutLine from '../src/public/User-outline.json'
import { Backdrop, CircularProgress } from '@mui/material'

import GetStatusSchool from '@/services/GetStatusSchool';



const App: React.FC = () => {
  const [userValue, setUserValue] = useState('')
  const [passValue, setPassValue] = useState('')
  const [modalIsOpen, setIsOpen] = useState(false)
  const [connection, setConnection] = useState<any>(false)
  const [status, setStatus] = useState<any>('')
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState<string>('')
  const [escolaStore, setEscolaStore] = useState('')
  const [connFileCreate, setConnFileCreate] = useState(false)
  const userRef = useRef<HTMLInputElement>(null)
  const passRef = useRef<HTMLInputElement>(null)
  const linkRef = useRef<any>(null)
  Modal.setAppElement('#root')

  useEffect(() => {
    //Criar arquivo de conexao
    ipcRenderer.send('create-conn-file')
    ipcRenderer.on('create-conn-file', (event, msg) => {
      // console.log('create-conn-return', msg)
      if (msg === 'created') {
        setConnFileCreate(true)
      }
    })

    //Criar arquivo de configuracao
    ipcRenderer.send('create-config-file')
    ipcRenderer.on('create-config-file', (event, msg) => {

    })
  }, [])

  useEffect(() => {
    if (connFileCreate) {
      ipcRenderer.send('connection')

      ipcRenderer.on('connection', (event, msg) => {
        console.log('MsgConn', msg)
        setConnection(
          mysql.createPool({
            host: msg.Host,
            user: msg.User,
            password: msg.Pass,
            database: msg.Db,
            port: msg.Port
          })
        )
      })
    }
  }, [connFileCreate])

  useEffect(() => {
    if (connection !== false) {
      GetStatusSchool(connection)
        .then((result) => {
          setStatus(result[0].Status)
        })
        .catch((error) => {
          console.log('STATUS-RESULT', error)
        })
    }
  }, [connection])

  function openModal() {
    setIsOpen(!modalIsOpen);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleClose() {
    setOpen(!open)
  }

  function onAuth(e) {
    e.preventDefault()
    console.log('STATUSAUTH', status)
    ipcRenderer.send('config', { authStatus: 'Waiting' })

    ipcRenderer.on('credentials', (event, msg) => {
      console.log('CREDENTIAL OK', msg)
      const msgData = msg
      setMsg(msgData)

      if (userValue === msgData.User && passValue === msgData.Pass) {
        if (userValue === 'Infodat' && passValue === '22201034') {
          closeModal()
          setOpen(!open)
          setTimeout(() => {
            setOpen(!open)
            linkRef?.current?.click()
          }, 2000)
        }

      } else {
        openModal()
        console.log('Senha incorreta')
      }
    })
  }

  ipcRenderer.on('credential_error', (event, msg) => {
    const msgData = JSON.stringify(msg)
    console.log('Credencial_error console', msg, `Type: ${typeof (msg)}`)
    setMsg(v => v = msg)

    closeModal()
    setOpen(!open)
    setTimeout(() => {
      setOpen(!open)
      // linkRef?.current?.click()
    }, 2000)
  })

  function onSelectUser() {
    userRef?.current?.focus()
  }

  function onSelectPass() {
    passRef?.current?.focus()
  }


  return (
    <div className={styles.app}>
      <TopBar />
      <header className={styles.appHeader}>
        <AnimatePresence>
          <motion.div
            layout
            className={styles.leftSide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeIn' }}
          >
            <motion.img src="../public/Logomarca.png"
              alt=""
              initial={{ opacity: 0, scale: 0.9, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'linear' }}
            />
            <motion.h1
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.8 }}
            >
              INFODAT
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, scale: 1, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeIn', delay: 2.3 }}
            >
              INTEGRAÇÃO NOTAS WEB
            </motion.p>
          </motion.div>
        </AnimatePresence>

        <div className={styles.rightSide}>
          <motion.div
            initial={{ opacity: 0, scale: 1, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
          >
            <Player
              src={UserOutLine}  // Arquivo JSON Lottie
              className="player"
              keepLastFrame      // Parar no final da animação
              autoplay           // Iniciar automaticamente
              id='userIconLottie'
              style={
                {
                  width: 100,
                  height: 100,
                  color: '#ffffff',
                  marginBottom: '2.5em',
                  marginTop: '-6em',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  opacity: 1,
                  borderRadius: '50%',
                  transition: '0.5s',
                  padding: '1em'
                }
              }
            />
          </motion.div>

          <motion.form>
            <motion.div className={styles.userContainer}
              initial={{ opacity: 0, scale: 1, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 1.2 }}
            >
              <label htmlFor="User" className={userValue !== '' ? styles.userClass : ''} onClick={onSelectUser}> USUÁRIO </label>
              <input type="text" ref={userRef} name="userInput" id="userInput" value={userValue} onChange={e => setUserValue(e.target.value)} />
            </motion.div>

            <motion.div className={styles.passContainer}
              initial={{ opacity: 0, scale: 1, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 1.4 }}
            >
              <label htmlFor="Password" className={passValue !== '' ? styles.passClass : ''} onClick={onSelectPass}> SENHA </label>
              <input type="password" ref={passRef} value={passValue} onChange={e => setPassValue(e.target.value)} name="passInput" id="passInput" />
            </motion.div>

            <motion.a
              className={styles.appLink}
              href="https://web.whatsapp.com/send?phone=5579998312572"
              target="_blank"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeIn', delay: 2.2 }}
            >
              Suporte Infodat
            </motion.a>

            <motion.button type='submit' onClick={onAuth}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeIn', delay: 1.4 }}
            >
              ENTRAR
            </motion.button>
          </motion.form>


          <Link ref={linkRef} to="/Home" />

          <Modal
            closeTimeoutMS={200}
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            onAfterClose={closeModal}
            contentLabel="Example Modal"
            overlayClassName={styles.modalOverlay}
            className={`${styles.modalContent} ${modalIsOpen !== true ? styles.modalClosed : styles.modalOpened}`}
          >
            <Player
              keepLastFrame={true}
              autoplay
              style={
                {
                  width: 60,
                  height: 60,
                  color: '#ffffff',
                  marginBottom: '1em',
                  marginTop: '0em',
                  backgroundColor: 'rgba(255,255,255,1)',
                  opacity: 1,
                  borderRadius: '50%',
                  transition: '0.5s',
                  padding: '0.4em',
                }
              }
              src="https://assets3.lottiefiles.com/private_files/lf30_jlibtszo.json"
            />

            <h2>NÃO FOI POSSÍVEL LOGAR</h2>
            <p>Favor verificar se o login e senha foram digitados corretamente</p>
            <button onClick={closeModal}>Fechar</button>
          </Modal>

          <Backdrop
            sx={{ color: '#61dafb', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

        </div>

      </header>

    </div>
  )
}

export default App
