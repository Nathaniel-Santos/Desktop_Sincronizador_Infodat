import React from 'react'
import { withRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import styles from '../assets/styles/Home/home.module.scss'
import TopBar from '@/components/TopBar/TopBar';
import SideBar from '@/components/SideBar/SideBar';


const Home: React.FC = () => {

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

            <div className={styles.homeLogomarcaContainer}>
              <img src="../public/LogomarcaDarker.png" alt="" className={styles.homeLogoMarca} />
              <h1>INFODAT</h1>
              <h3>PROCESSAMENTO DE DADOS</h3>
            </div>

            <div className={styles.homeContentContainer}>
              {/* <h1>TELA PRINCIPAL</h1> */}
            </div>

          </div>
        </div>

      </div>

    </ThemeProvider>
  )
}

export default withRouter(Home)
