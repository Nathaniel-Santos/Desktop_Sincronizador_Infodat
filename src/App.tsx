const mysql = require('mysql2')

import styles from 'styles/app.module.scss'
import { IDadosEscola } from './types'

import { useState, useEffect, useRef } from 'react'
import { ipcRenderer } from 'electron'
import Modal from 'react-modal'

import TopBar from './components/TopBar/TopBar'
import LoginRightSide from './components/LoginRightSide'
import LoginLeftSide from './components/LoginLeftSide'

import GetStatusSchool from '@/services/GetStatusSchool';
import GetEscolaAuth from './services/GetEscolaAuth'
import { useConnectionStore, useMysqlConnectionStore } from './store/connection'
import { SaveCredentialsFile } from './functions/SaveCredentialsFile'


const App: React.FC = () => {
  const [userValue, setUserValue] = useState('')
  const [passValue, setPassValue] = useState('')
  const [modalIsOpen, setIsOpen] = useState<boolean>(false)
  const [connection, setConnection] = useState<any>(false)
  const [connectionEscolas, setConnectionEscolas] = useState<any>(false)
  const [status, setStatus] = useState<any>('')
  const [open, setOpen] = useState<boolean>(false)
  const [connFileCreate, setConnFileCreate] = useState(false)
  const [useSetConnection] = useConnectionStore((state) => [state.setConnection])
  const [mysqlConnection, setMysqlConnection] = useMysqlConnectionStore((state) => [state.mysqlConnection, state.setMysqlConnection])

  const linkRef = useRef<any>(null)
  let count = 0
  Modal.setAppElement('#root')

  useEffect(() => {
    //Criar arquivo de conexao
    ipcRenderer.send('create-conn-file')
    ipcRenderer.on('create-conn-file', (event, msg) => {
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
    if (connFileCreate && count === 0) {
      count++
      setConnectionEscolas(
        mysql.createPool({
          host: 'mysql247.umbler.com',
          user: 'escolas',
          password: '(J76E|bD6n',
          database: 'escolas',
          port: '41890',
        })
      )
    }
  }, [connFileCreate])


  useEffect(() => {
    if (connection !== false) {
      setMysqlConnection(connection)

      // console.log('connection: ', connection)
      GetStatusSchool(connection)
        .then((result) => {
          setStatus(result[0].Status)
          setTimeout(() => {
            setOpen(!open)
            linkRef?.current?.click()
          }, 2000)
        })
        .catch((error) => {
          openModal()
          console.log('Senha incorreta: ', error)
        })
    }
  }, [connection])

  function openModal() {
    setIsOpen(!modalIsOpen);
  }

  const saveConnection = (host: string, db_name: string, user: string, pass: string, port: string | number) => {

    if (host) {
      const connObj = { host: host, user: user, password: pass, database: db_name, port: port }
      sessionStorage.setItem('conn', JSON.stringify(connObj))
      const conn = mysql.createPool(
        {
          host: host,
          user: user,
          password: pass,
          database: db_name,
          port: port
        }
      )
      setConnection(conn)
      useSetConnection(conn)
      return 'connectado'
    } else {
      return 'erro'
    }
  }

  async function onAuth(e: any) {
    e.preventDefault()
    const escolaAuth = await GetEscolaAuth(connectionEscolas, userValue, passValue)

    if (escolaAuth) {
      setOpen(true)
      const { db_host, db_name, db_pass, db_port, db_user }: IDadosEscola = escolaAuth
      const conectado = saveConnection(db_host, db_name, db_user, db_pass, db_port)

      conectado === 'connectado' ? SaveCredentialsFile(db_host, db_name, db_user, db_pass, db_port, userValue, openModal) : null

    } else {
      setIsOpen(true)
    }
  }


  return (
    <div className={styles.app}>
      <TopBar />

      <header className={styles.appHeader}>
        <LoginLeftSide />

        <LoginRightSide
          modalIsOpen={modalIsOpen}
          open={open}
          setIsOpen={setIsOpen}
          onAuth={onAuth}
          userValue={userValue}
          setUserValue={setUserValue}
          passValue={passValue}
          setPassValue={setPassValue}
          setOpen={setOpen}
          linkRef={linkRef} />
      </header>

    </div>
  )
}

export default App