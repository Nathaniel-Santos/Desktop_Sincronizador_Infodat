const mysql = require('mysql2')
import { join } from 'path'

import { useEffect, useState } from 'react'
const { ipcRenderer } = require('electron');

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Backdrop, Button, Checkbox } from '@mui/material';
import Modal from 'react-modal'
import styles from '../assets/styles/UpdateSite/UpdateSite.module.scss'

import TopBar from '@/components/TopBar/TopBar';
import CircularProgress from '@mui/material/CircularProgress';
import SideBar from '@/components/SideBar/SideBar';
import Search from '@mui/icons-material/Search';
import { GetTablesName } from '@/services/GetTablesName';
import { GetInternetMdbInfo } from '@/services/GetInternetMdbInfo';
import { UpdateWebDbTable } from '@/services/UpdateWebDbTable';
import { FilterTableToUpdate } from '@/functions/FilterTableToUpdate';
import { FindMdbwebTableName } from '@/functions/FindMdbTableName';
import { GetMdbTableData } from '@/services/GetMdbTableData';
import { GetMdbTableFields } from '@/services/GetMdbTableFields';
import { ShowWebTablesColumns } from '@/services/ShowWebTablesColumns';
import WifiIcon from '@mui/icons-material/Wifi';
import { motion } from 'framer-motion';
import { useMysqlConnectionStore } from '@/store/connection'
import { connMsgType, IdadosCheck } from './Types/UpdateSite';



export default function UpdateSite() {

  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState(false)
  const [databasePath, setDatabasePath] = useState('')
  const [webTables, setWebTables] = useState([])
  const [mdbDatabase, setMdbDatabase] = useState<any>([])
  const [mdbFilePath, setMdbFilePath] = useState<string>('')
  const [webConnection, setWebConnection] = useState<any>()
  const [webDbName, setWebDbName] = useState<any>()
  const [configData, setConfigData] = useState<connMsgType>()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [dadosCheck, setDadosCheck] = useState<IdadosCheck[] | []>([])

  const [desligadosCheck, setDesligadosCheck] = useState({ web: 'Desligados', mdb: 'Desligados', checked: false })
  const [gradesCheck, setGradesCheck] = useState({ web: 'Grades', mdb: 'Grades', checked: false })
  const [gradesQuaCheck, setGradesQuaCheck] = useState({ web: 'GradesQua', mdb: 'GradesQua', checked: false })
  const [notasAuxLegCheck, setNotasAuxLegCheck] = useState({ web: 'NotasAuxLeg', mdb: 'NotasAuxLeg', checked: false })
  const [qualitativasCheck, setQualitativasCheck] = useState({ web: 'Qualitativas', mdb: 'Qualitativas', checked: false })
  const [alunosCheck, setAlunosCheck] = useState({ web: 'alunos', mdb: 'Alunos', checked: false })
  const [avaliacoesCheck, setAvaliacoesCheck] = useState({ web: 'avaliacoes', mdb: 'Avaliacoes', checked: false })
  const [cursosCheck, setCursosCheck] = useState({ web: 'cursos', mdb: 'Cursos', checked: false })
  const [digitacaoCheck, setDigitacaoCheck] = useState({ web: 'digitacao', mdb: 'Digitacao', checked: false })
  const [disciplinasCheck, setDisciplinasCheck] = useState({ web: 'disciplinas', mdb: 'Disciplinas', checked: false })
  const [empresaCheck, setEmpresaCheck] = useState({ web: 'empresa', mdb: 'Empresa', checked: false })
  const [funcionariosCheck, setFuncionariosCheck] = useState({ web: 'funcionarios', mdb: 'Funcionarios', checked: false })
  const [ocorrenciasCheck, setOcorrenciasCheck] = useState({ web: 'ocorrencias', mdb: 'Ocorrencias', checked: false })
  const [pagamentosCheck, setPagamentosCheck] = useState({ web: 'pagamentos', mdb: 'Pagamentos', checked: false })
  const [tiposocorrCheck, setTiposocorrCheck] = useState({ web: 'tiposocorr', mdb: 'TiposOcorr', checked: false })
  const [turmasCheck, setTurmasCheck] = useState({ web: 'turmas', mdb: 'Turmas', checked: false })
  const connection = useMysqlConnectionStore((state) => state.mysqlConnection)

  const [webIsConnected, setWebIsConnected] = useState(false)
  const [sending, setSending] = useState(false)
  const [iconWifiStyle, setIconWifiStyle] = useState(styles.wifiIcon)

  const mdbPwd = '22201034'

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const onTurmasCheckbox = () => {
    setTurmasCheck({ web: 'turmas', mdb: 'Turmas', checked: !turmasCheck.checked })
  }

  const onTiposocorrCheckbox = () => {
    setTiposocorrCheck({ web: 'tiposocorr', mdb: 'TiposOcorr', checked: !tiposocorrCheck.checked })
  }

  const onPagamentosCheckbox = () => {
    setPagamentosCheck({ web: 'pagamentos', mdb: 'Pagamentos', checked: !pagamentosCheck.checked })
  }

  const onOcorrenciasCheckbox = () => {
    setOcorrenciasCheck({ web: 'ocorrencias', mdb: 'Ocorrencias', checked: !ocorrenciasCheck.checked })
  }

  const onFuncionariosCheckbox = () => {
    setFuncionariosCheck({ web: 'funcionarios', mdb: 'Funcionarios', checked: !funcionariosCheck.checked })
  }

  const onEmpresaCheckbox = () => {
    setEmpresaCheck({ web: 'empresa', mdb: 'Empresa', checked: !empresaCheck.checked })
  }

  const onDisciplinasCheckbox = () => {
    setDisciplinasCheck({ web: 'disciplinas', mdb: 'Disciplinas', checked: !disciplinasCheck.checked })
  }

  const onDigitacaoCheckbox = () => {
    setDigitacaoCheck({ web: 'digitacao', mdb: 'Digitacao', checked: !digitacaoCheck.checked })
  }

  const onCursosCheckbox = () => {
    setCursosCheck({ web: 'cursos', mdb: 'Cursos', checked: !cursosCheck.checked })
  }

  const onAvaliacoesCheckbox = () => {
    setAvaliacoesCheck({ web: 'avaliacoes', mdb: 'Avaliacoes', checked: !avaliacoesCheck.checked })
  }

  const onAlunosCheckbox = () => {
    setAlunosCheck({ web: 'alunos', mdb: 'Alunos', checked: !alunosCheck.checked })
  }

  const onQualitativasCheckbox = () => {
    setQualitativasCheck({ web: 'Qualitativas', mdb: 'Qualitativas', checked: !qualitativasCheck.checked })
  }

  const onNotasAuxLegCheckbox = () => {
    setNotasAuxLegCheck({ web: 'NotasAuxLeg', mdb: 'NotasAuxLeg', checked: !notasAuxLegCheck.checked })
  }

  const onGradesQuaCheckbox = () => {
    setGradesQuaCheck({ web: 'GradesQua', mdb: 'GradesQua', checked: !gradesQuaCheck.checked })
  }

  const onGradesCheckbox = () => {
    setGradesCheck({ web: 'Grades', mdb: 'Grades', checked: !gradesCheck.checked })
  }

  const onDesligadosCheckbox = () => {
    setDesligadosCheck({ web: 'Desligados', mdb: 'Desligados', checked: !desligadosCheck.checked })
  }

  const handleClose = () => {
    setOpen(!open)
  }

  const onHandleConnectWebDb = () => {
    ipcRenderer.send('connection')
    
    ipcRenderer.on('connection', async (event, msg) => {      
      // console.log('CONNECTION: ', msg.Data)
      ipcRenderer.send('clearAndUpdateDatabase', { conn: msg.Data})
      setWebDbName(msg.Db)
      setWebConnection(connection)

      const tablesName = await GetTablesName(connection)
      if (tablesName.length > 0) {
        setWebIsConnected(true)
        setIconWifiStyle(styles.iconWifiOn)
      }

      const tablesAllowed = tablesName.filter(item => {
        const filter = FilterTableToUpdate(item)
        if (filter !== null) { return filter } else { return !item }
      })
      setWebTables(tablesAllowed)

      // connection.end()
      console.log('TablesName: ', tablesAllowed)
    })
  }

  const onHandlePesquisar = async () => {
    ipcRenderer.send('file-database-request', { auth: true, page: 'UpdateSite' });

    ipcRenderer.on('file-database', (event, file) => {
      setOpen(true)
      console.log('File: ', file)

      const dadosConfig = configData
      console.log('ConfigData: ', configData)
      dadosConfig.MDBPATH = file
      dadosConfig['SAVE'] = true
      setConfigData(dadosConfig)

      ipcRenderer.send('save-config-change', dadosConfig)
      ipcRenderer.on('save-config-change', (event, msg) => {
        console.log('MsgSave-config: ', msg)
      })

      setDatabasePath(file)

      const filePath = join(file, 'INTERNET.MDB')
      setMdbFilePath(filePath)

      const mdbDatabaseReturn = GetInternetMdbInfo(filePath, mdbPwd)
      console.log('mdbDatabaseReturn: ', mdbDatabaseReturn)
      setMdbDatabase(mdbDatabaseReturn)
      console.log('QualitativasTable: ', mdbDatabaseReturn)

      if (checked) {
        setOpen(false)
      } else {
        setOpen(false)
      }
    });

    ipcRenderer.on('notification', (event, msg) => {
      // console.log('Notificação efetuada com sucesso')
    })

  }

  function closeModal() {
    setIsOpen(false);
    connection.end()
    window.location.reload()
  }

  function showModal(dadosChecked?: any) {
    console.log('ShowModalDadosChecked: ', dadosChecked)

    return <Modal
      closeTimeoutMS={200}
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      onAfterClose={closeModal}
      contentLabel="Example Modal"
      overlayClassName={styles.modalOverlay}
      className={`${styles.modalContent} ${modalIsOpen !== true ? styles.modalClosed : styles.modalOpened}`}
    >

      <h3 style={{ textAlign: 'center', marginTop: '-5px' }}>Processo finalizado!</h3>
      {/* <p>Detalhes do envio:</p> */}

      <div style={{ maxHeight: '300px', minHeight: '150px', overflowY: 'scroll', marginBottom: '1em' }}>
        {
          <table className={styles.table} >
            <tr>
              <th>Tabela</th>
              <th>Status</th>
            </tr>
            {
              dadosChecked.map((item, key) => {
                return (
                  <tr key={key}>
                    <td >
                      {item.web}
                    </td>
                    <td style={{color: item.sent === true ? 'green' : 'red'}}>
                      {item.sent === true ? 'Enviado ✅' : 'Falha no envio ❌'}
                    </td>
                  </tr>

                )
              })
            }
          </table>
        }
      </div>
      <button onClick={closeModal}>Fechar</button>
    </Modal>
  }

  const onSubmit = async () => {
    setSending(true)
    setOpen(true)

    const dados = [desligadosCheck,
      gradesCheck,
      gradesQuaCheck,
      notasAuxLegCheck,
      qualitativasCheck,
      alunosCheck,
      avaliacoesCheck,
      cursosCheck,
      digitacaoCheck,
      disciplinasCheck,
      empresaCheck,
      funcionariosCheck,
      ocorrenciasCheck,
      pagamentosCheck,
      tiposocorrCheck,
      turmasCheck]

    const dadosChecked: any = dados.filter(item => item.checked)
    console.log('DadosChecked: ', dadosChecked)

    for (const item of dadosChecked) {
      const webColumns = await ShowWebTablesColumns(webConnection, item.web, webDbName)
      // console.log('webColumns: ', webColumns)

      const mdbDataResult: any = GetMdbTableData(mdbFilePath, mdbPwd, item.mdb, webColumns)
      // console.log('mdbResult: ', mdbDataResult)

      // const mdbTableFieldsResult = GetMdbTableFields(mdbFilePath, mdbPwd, item.mdb)
      const mdbTableDataValues = mdbDataResult.map(item => item = Object.values(item))

      // console.log('mdbTableValues:', mdbTableDataValues)
      const updateResult = await UpdateWebDbTable(webConnection, item.web, webColumns, mdbTableDataValues)

      if (updateResult.Status === 200) {
        item.sent = true
      } else {
        item.sent = false
      }
    }

    setDadosCheck(dadosChecked)
    setIsOpen(true)

    setOpen(false)
    setSending(false)
  }

  useEffect(() => {
    ipcRenderer.send('config')
    ipcRenderer.once('credentials', (event, msg) => {

      const dados: connMsgType = msg.data
      setConfigData(dados)
      setDatabasePath(dados.MDBPATH)
      console.log('msgCredentials: ', dados)
    })
  }, [])

  useEffect(() => {
    if (databasePath !== '') {
      const filePath = join(databasePath, 'INTERNET.MDB')
      setMdbFilePath(filePath)

      const mdbDatabaseReturn = GetInternetMdbInfo(filePath, mdbPwd)
      setMdbDatabase(mdbDatabaseReturn)
      // console.log('QualitativasTable: ', mdbDatabaseReturn)

      if (checked) {
        setOpen(false)
      } else {
        setOpen(false)
      }
    }
  }, [databasePath])

  useEffect(() => {
    if (webTables.length > 0) {
      console.log('webTables: ', webTables)
    }
  }, [webTables])

  return (
    <ThemeProvider theme={darkTheme}>

      <div className={styles.app} >
        <TopBar />

        <div className={styles.appHeader}>
          <SideBar />

          <div className={styles.homeRightSide}>
            {/* <h2>ATUALIZAR SITE WINDOW</h2> */}

            <div className={styles.pesquisarMdbUpsateSiteContainer}>
              <input type='text' value={databasePath} placeholder="Caminho internet.mdb" className={styles.pesquisarMdbUpsateSiteField} />
              <Button variant="outlined" className={styles.pesquisarMdbUpsateSiteButtonSearch} onClick={onHandlePesquisar}>
                <Search /> Pesquisar
              </Button>
            </div>

            {showModal(dadosCheck)}

            {
              webIsConnected ?
                <motion.div
                initial={{opacity: 0, y: -50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 1}}
                 className={styles.tableContainer}>
                  {/* ALUNOS */}
                  <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={alunosCheck.checked} onChange={onAlunosCheckbox} />
                    <div className={styles.tableName}> {alunosCheck.mdb} </div>
                  </div>
                  {/* DESLIGADOS */}
                  <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={desligadosCheck.checked} onChange={onDesligadosCheckbox} />
                    <div className={styles.tableName}> {desligadosCheck.mdb} </div>
                  </div>
                  {/* CURSOS */}
                  <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={cursosCheck.checked} onChange={onCursosCheckbox} />
                    <div className={styles.tableName}> {cursosCheck.mdb} </div>
                  </div>
                  {/* DISCIPLINAS */}
                  <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={disciplinasCheck.checked} onChange={onDisciplinasCheckbox} />
                    <div className={styles.tableName}> {disciplinasCheck.mdb} </div>
                  </div>
                  {/* TURMAS */}
                  <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={turmasCheck.checked} onChange={onTurmasCheckbox} />
                    <div className={styles.tableName}> {turmasCheck.mdb} </div>
                  </div>
                  {/* GRADES */}
                  <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={gradesCheck.checked} onChange={onGradesCheckbox} />
                    <div className={styles.tableName}> {gradesCheck.mdb} </div>
                  </div>
                  {/* GRADESQUA */}
                  <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={gradesQuaCheck.checked} onChange={onGradesQuaCheckbox} />
                    <div className={styles.tableName}> {gradesQuaCheck.mdb} </div>
                  </div>
                  {/* NOTASAUXLEG */}
                  <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={notasAuxLegCheck.checked} onChange={onNotasAuxLegCheckbox} />
                    <div className={styles.tableName}> {notasAuxLegCheck.mdb} </div>
                  </div>
                  {/* QUALITATIVAS */}
                  <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={qualitativasCheck.checked} onChange={onQualitativasCheckbox} />
                    <div className={styles.tableName}> {qualitativasCheck.mdb} </div>
                  </div>
                  {/* AVALIACOES */}
                  <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={avaliacoesCheck.checked} onChange={onAvaliacoesCheckbox} />
                    <div className={styles.tableName}> {avaliacoesCheck.mdb} </div>
                  </div>
                  {/* FUNCIONARIOS */}
                  <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={funcionariosCheck.checked} onChange={onFuncionariosCheckbox} />
                    <div className={styles.tableName}> {funcionariosCheck.mdb} </div>
                  </div>
                  {/* DIGITACAO */}
                  <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={digitacaoCheck.checked} onChange={onDigitacaoCheckbox} />
                    <div className={styles.tableName}> {digitacaoCheck.mdb} </div>
                  </div>
                  {/* EMPRESA */}
                  <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={empresaCheck.checked} onChange={onEmpresaCheckbox} />
                    <div className={styles.tableName}> {empresaCheck.mdb} </div>
                  </div>
                  {/* OCORRENCIAS */}
                  {/* <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={ocorrenciasCheck.checked} onChange={onOcorrenciasCheckbox} />
                    <div className={styles.tableName}> {ocorrenciasCheck.mdb} </div>
                  </div> */}
                  {/* PAGAMENTOS */}
                  <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={pagamentosCheck.checked} onChange={onPagamentosCheckbox} />
                    <div className={styles.tableName}> {pagamentosCheck.mdb} </div>
                  </div>
                  {/* TIPOSOCORR */}
                  {/* <div className={styles.tablesNameContainer}>
                    <Checkbox disabled={sending} className={styles.checkboxTableName} value={tiposocorrCheck.checked} onChange={onTiposocorrCheckbox} />
                    <div className={styles.tableName}> {tiposocorrCheck.mdb} </div>
                  </div> */}
                  {/* ... */}
                </motion.div>
                :
                <div className={styles.tableContainer}></div>
            }


            {/* LOADING EFFECT */}
            <span>
              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </span>

            <div className={styles.buttonsUpdateSiteContainer}>
              <div className={styles.connectarButtonContainer}>
                <Button variant="outlined" style={webIsConnected ? { borderColor: 'green', color: 'green', opacity: '0.5', transition: '1.5s ease-in' } : null} disabled={webIsConnected} onClick={onHandleConnectWebDb}>
                  {webIsConnected ? 'Conectado' : 'Conectar'}
                </Button>
                <WifiIcon className={iconWifiStyle} />
              </div>

              <Button disabled={sending} variant="contained" onClick={onSubmit}>
                Enviar
              </Button>
            </div>

          </div>
        </div>

      </div>

    </ThemeProvider>
  )
}
