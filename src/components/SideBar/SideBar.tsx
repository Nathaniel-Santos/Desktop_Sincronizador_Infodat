import {useState, useEffect} from 'react'
import styles from './SideBar.module.scss'
import { SideBarData } from './SideBarData'
import ExitToApp from '@mui/icons-material/ExitToApp';
import { Link, Redirect } from 'react-router-dom';
import { ipcRenderer } from 'electron';

interface CredentialType {
  User: string;
  Pass: string;
  Host: string;
  Port: string;
  Db: string;
  Escola: string;
}

export default function SideBar() {
  const path = window.location.pathname
  const [version, setVersion] = useState('1.0.2')
  const [nomeEscola, setNomeEscola] = useState('')

  function onGetInfo() {
    ipcRenderer.send('full-info-config-request', { authStatus: 'Waiting' })
  }

  ipcRenderer.on('full-info-config-response', (event, msg: CredentialType) => {
    console.log('fileDataFullInfo', msg)
    setNomeEscola(msg.Escola)
  })

  useEffect( () => {
    onGetInfo()
  }, [])

  return (
    <div className={styles.SideBar}>
      <div className={styles.SideBarListContainer}>
        <header>
          <img src="../public/Logomarca.png" width="50" alt='LogoMarca' />
          <div className={styles.Escola}> {nomeEscola} </div>
          <div className={styles.Cargo}> ADMINISTRATIVO </div>
          <hr />
        </header>
        <ul className={styles.SideBarList}>
          {
            SideBarData.map((val, key) => {
              return (
                val.active === 'Active' ?
                  <Link
                  className={styles.row}
                  key={`li_${key}`}
                  to={val.link}
                  >
                    <li
                      key={key}
                      className={styles.row}
                      id={path === val.link ? "active" : ""}
                      onClick={() =>
                      // <Redirect to={val.link}/>
                      {console.log(val.link)}
                    }>
                      <div id="icon" className={styles.icon}>{val.icon}</div>
                      <div id="title" className={styles.title}>{val.title}</div>
                    </li>
                  </Link >
                  :
                  <></>
              )
            })
          }
        </ul>
      </div>

      <div className={styles.SairButtonSideBarAdmin}>
        <Link className={styles.SairButtonSideBarAdmin} to="/">
          <button  >
            <ExitToApp className={styles.SideBarExitIcon} />
            SAIR
          </button>
        </Link>
      </div >
      <div className={styles.VersionApp}>
          {version}
      </div>
    </div>
  )
}
