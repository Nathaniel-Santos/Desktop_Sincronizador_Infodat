import React, { useState } from 'react'
import styles from './TopBar.module.scss'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import Minimize from '@mui/icons-material/Remove';
import CropSquare from '@mui/icons-material/CropSquare';
import { ipcRenderer } from 'electron';
// import winRestore from '../../../public/win-restore.svg'
import winRestore from '../../../src/public/win-restore.svg'


export default function TopBar() {
  const [winOpen, setWinOpen] = useState(false)

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  function onClose() {
    ipcRenderer.send('closeApp')
  }

  function onMinimize() {
    ipcRenderer.send('minimizeApp')
  }

  function onMaximizeRestore() {
    setWinOpen(!winOpen)
    ipcRenderer.send('maximizeRestoreApp')
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <>
        <div className={styles.topBarContainer}>
          <div className={styles.topBarDragRegion}>
            SINCRONIZADOR
          </div>

          <div className={styles.topBarCommandsContainer}>

            <div className={styles.topBarIconContainer}>
              <Minimize fontSize="small" sx={{ color: 'white' }} className={styles.topBarIcon} onClick={onMinimize} />
            </div>
            <div className={styles.topBarIconContainer}>
              {winOpen ?
              <img src={winRestore} alt="" className={styles.topBarIcon} onClick={onMaximizeRestore}  />
              :
                <CropSquare fontSize="small" color='action' className={styles.topBarIcon} onClick={onMaximizeRestore} />
              }
            </div>
            <div className={styles.topBarIconContainer}>
              <CloseIcon fontSize="small" color='action' className={styles.topBarIcon} onClick={onClose} />
            </div>
          </div>


        </div>
      </>
    </ThemeProvider>

  )
}
