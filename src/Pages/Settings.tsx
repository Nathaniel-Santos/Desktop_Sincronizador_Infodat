import { ipcRenderer } from 'electron'

import styles from '../assets/styles/Settings/settings.module.scss'
import { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Modal from 'react-modal'

import { Button, TextField } from '@mui/material';
import TopBar from '@/components/TopBar/TopBar';
import SideBar from '@/components/SideBar/SideBar';
import { Player } from '@lottiefiles/react-lottie-player'

export default function Settings() {

  Modal.setAppElement('#root')

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });


  return (
    <ThemeProvider theme={darkTheme}>

      <div className={styles.app} >
        <TopBar />

        <div className={styles.appHeader}>
          <SideBar />

          <div className={styles.homeRightSide}>
            <div className={styles.homeRightSideContentBox}>
              <h2>CONFIGURAÇÃO</h2>

            </div>

          </div>
        </div>

      </div>

    </ThemeProvider>
  )
}
