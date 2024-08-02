const mysql = require('mysql2')

import styles from '../assets/styles/DownloadGrades/DownloadGrades.module.scss'
import { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'
const { ipcRenderer } = require('electron')

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Autocomplete, Backdrop, Button, Checkbox, TextField } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion'
import { Player } from '@lottiefiles/react-lottie-player'
import TopBar from '@/components/TopBar/TopBar';
import CircularProgress from '@mui/material/CircularProgress';
import SideBar from '@/components/SideBar/SideBar';

import { GetAllNotasExport } from '@/services/DownloadAllGrades';
import { GetAllConceitosExport } from '@/services/GetAllConceitosExport'
import { SelectedNotasExport } from '@/services/DownloadSelectedGrades';
import { GetKeysRecorded } from '@/services/GetKeysRecorded';
import { GetAllCursosTable } from '@/services/GetAllCursosTable';
import { GetAllDisciplinasTable } from '@/services/GetAllDisciplinasTable';
import FilterSelectedItems from '@/functions/FilterSelectedItems';

interface KeysProps {
  chave: string
}

interface CursosProps {
  label: string;
  Codigo: string;
}

interface DisciplinasProps {
  label: string,
  Codigo: string
}

interface SelectProps {
  label: string,
  Codigo: string
}

export default function DownloadGrades() {

  const [connection, setConnection] = useState<any>(null)

  const [open, setOpen] = useState<boolean>(false)
  const [modalIsOpen, setIsOpen] = useState<boolean>(false)
  const [checked, setChecked] = useState<boolean>(false)

  const [valueCurso, setValueCurso] = useState<string>('')
  const [valueTurma, setValueTurma] = useState<string>('')
  const [valueDisciplina, setValueDisciplina] = useState<string>('')
  const [valueAvaliacao, setValueAvaliacao] = useState<string>('')
  const [valueKeys, setValueKeys] = useState<string>('')

  const [keys, setKeys] = useState([])
  const [keysFilter, setKeysFilter] = useState([])
  const [cursosKeys, setCursosKeys] = useState<string[]>([])
  const [disciplinasKeys, setDisciplinasKeys] = useState<string[]>([])
  const [cursos, setCursos] = useState<CursosProps[]>([])
  const [turmas, setTurmas] = useState<string[]>([])
  const [disciplinas, setDisciplinas] = useState<DisciplinasProps[]>([])
  const [cursosPermitidos, setCursosPermitidos] = useState<CursosProps[]>([])
  const [disciplinasPermitidas, setDisciplinasPermitidas] = useState<DisciplinasProps[]>([])
  const [optionAllNotasSelect, setOptionAllNotasSelect] = useState<string>('1')
  const [optionSelectNotasConceito, setOptionSelectNotasConceito] = useState<string>('nota')
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
  const [configData, setConfigData] = useState<object | any>({})


  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  //INICIAR CONNEXÃO
  useEffect(() => {
    ipcRenderer.send('connection')

    ipcRenderer.on('connection', (event, msg) => {
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
  }, [])

  function handleClose() {
    setOpen(!open)
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  //FILTRAR CURSOS DENTRO DAS CHAVES
  function filterCursosKeys(keys: KeysProps[]): [String] {
    const cursos = keys.map((item) => {
      const chave = item.chave
      const curso = chave.slice(0, 3)
      return curso
    })
    const cursosUnicos: any = [...new Set(cursos)]
    return cursosUnicos
  }

  //FILTRAR CURSOS PERMITIDOS
  function filterCursos(cursos: CursosProps[], keys: string[]): CursosProps[] {
    const filtroCursos = cursos.filter(item =>
      keys.includes(item.Codigo) ? item : !item
    )
    return filtroCursos
  }

  function processarDadosCursos() {
    const cursosTable = handleGetAllCursos()
    cursosTable.then((result) => {
      const permitidos = filterCursos(result, cursosKeys)
      permitidos.push({ label: 'Todos', Codigo: '000' })
      setCursosPermitidos(permitidos)
    })
      .catch((e) => {
        console.log('Erro em cursosTable: ', e)
      })
  }

  //FILTRAR DISCIPLINAS DENTRO DAS CHAVES
  function filterDisciplinasKeys(keys: KeysProps[]): [String] {
    const disciplinasKeys = keys.map((item) => {
      const chave = item.chave
      const disciplina = chave.slice(4, 7)
      return disciplina
    })
    const disciplinasUnicas: any = [...new Set(disciplinasKeys)]
    return disciplinasUnicas
  }

  //FILTRAR DISCIPLINAS PERMITIDAS
  function filterDisciplinas(disciplinas: DisciplinasProps[], keys: string[] | [String]) {
    // console.log('FILTER DISC disciplinas', disciplinas)
    // console.log('FILTER DISC KEYS', keys)
    const filtroDisciplinas = disciplinas.filter(item =>
      keys.includes(item.Codigo) ? item : !item
    )
    return filtroDisciplinas
  }

  //PROCESSAR DADOS DISCIPLINAS E ARMAZENAR NA
  function processarDadosDisciplinas() {
    const disciplionasTable = handleGetAllDisciplinasTable()
    disciplionasTable.then((result) => {
      const permitidos = filterDisciplinas(result, disciplinasKeys)
      // console.log('ResultDadosDisciplina', result)
      permitidos.push({ label: 'Todos', Codigo: '000' })
      setDisciplinasPermitidas(permitidos)
    })
  }

  //FILTRAR TURMAS PERMITIDAS
  function filterTurmas(turmas: any, keys: any) {
    const turmasFiltro = keys.map((item) => {
      const turma = item.chave.slice(3, 4)
      return turma
    })
    const turmasUnicas = [... new Set(turmasFiltro)]
  }

  const onSuccessModal = () => {
    return <Modal
      closeTimeoutMS={200}
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      contentLabel="Example Modal"
      overlayClassName={styles.modalOverlay}
      className={`${styles.modalContent} ${modalIsOpen !== true ? styles.modalClosed : styles.modalOpened}`}
    >
      {/* <Player
        keepLastFrame
        autoplay
        style={
          {
            width: 120,
            height: 120,
            color: '#ffffff',
            marginBottom: '1em',
            marginTop: '0em',
            backgroundColor: 'rgba(255,255,255,1)',
            opacity: 1,
            borderRadius: '50%',
            transition: '0.5s',
            padding: '0.4em'
          }
        }
        src={'https://assets2.lottiefiles.com/packages/lf20_pqnfmone.json'}
      /> */}

      <h2>Download Finalizado</h2>
      <p>Para concluir a importação, deverá processar os arquivos baixados no módulo extras</p>
      <button onClick={closeModal}>Fechar</button>
    </Modal>
  }

  function onChangeCheck() {
    setChecked(!checked)
  }

  function selectFolder(defaultFilePath: string, msg: object | any, selectedItems: object | any) {
    const filePath = msg.downloadPath
    defaultFilePath = filePath

    ipcRenderer.send('file-request', { auth: true, page: 'DownloadGrades', defaultUrl: defaultFilePath });
    ipcRenderer.on('file', (event, file) => {

      console.log('FilePathSelected: ', file)
      setOpen(true)

      if (filePath !== file) {
        const dadosConfig = msg.data
        dadosConfig.DOWNLOADPATH = file
        dadosConfig['SAVE'] = true

        console.log('dadosConfigSave: ', dadosConfig)

        ipcRenderer.send('save-config-change', dadosConfig)
        // ipcRenderer.on('save-config-change', (event, msg) => {
        //   console.log('MsgSave-config: ', msg)
        // })
      }

      const fileDirectory = defaultFilePath !== '' ? defaultFilePath : file

      if (checked) {
        const conceitosResult = GetAllConceitosExport(connection, fileDirectory, optionAllNotasSelect)
        const queryResult = GetAllNotasExport(connection, fileDirectory, optionAllNotasSelect)
        connection.end()
        console.log('QueryResult: ', queryResult)
        console.log('ConceitosResult: ', conceitosResult)
      } else {
        SelectedNotasExport(connection, fileDirectory, selectedItems)
      }

      setOpen(false)

    });

    ipcRenderer.on('notification', (event, msg) => {
      setIsOpen(true)
      setOpen(false)
    })
  }

  const onHandleDownload = () => {
    console.log('HandleDownload')

    setButtonDisabled(true)

    if (checked) {
      // ipcRenderer.send('connection')
      // var connection: any
      let defaultFilePath: string

      // ipcRenderer.on('connection', (event, msg) => {
      //   connection = mysql.createPool({
      //     host: msg.Host,
      //     user: msg.User,
      //     password: msg.Pass,
      //     database: msg.Db,
      //     port: msg.Port
      //   })

      // })

      const selectedItems = {
        curso: valueCurso,
        turma: valueTurma,
        disciplina: valueDisciplina,
        avaliacao: valueAvaliacao
      }


      if (configData.downloadPath) {
        selectFolder(defaultFilePath, configData, selectedItems)

      } else {
        ipcRenderer.send('config', { authStatus: 'Waiting' })
        ipcRenderer.once('credentials', (event, msg) => {
          setConfigData(msg)
          selectFolder(defaultFilePath, msg, selectedItems)
        })
      }

    } else {
      const selectedFields = {
        curso: valueCurso,
        disciplina: valueDisciplina,
        avaliacao: valueAvaliacao,
        turma: valueTurma
      }

      console.log('SelectedFields: ', selectedFields)
    }
    setButtonDisabled(false)
    // connection.end()
  }

  const onHandleAllNotasOptions = ({ target }) => {
    console.log('EventOption: ', target.value)
    setOptionAllNotasSelect(target.value)
  }

  const onHandleOptionNotasConceito = ({ target }) => {
    setOptionSelectNotasConceito(target.value)
  }

  function handleGetAllCursos() {
    const cursos = GetAllCursosTable(connection)
    cursos
      .then((result) => {
        setCursos(item => item = result)
      })
      .catch((e) => {
        console.log('Erro chave: ', e)
      })
    return cursos
  }

  function handleGetAllDisciplinasTable() {
    const disciplinasQuery = GetAllDisciplinasTable(connection)
    disciplinasQuery
      .then((result) => {
        setDisciplinas(item => item = result)
      })
      .catch((e) => {
        console.log('Erro ao consultar disciplinas: ', e)
      })

    return disciplinasQuery
  }

  function handleGetKeysRecorded(): any {
    const chaves = GetKeysRecorded(connection)
    chaves
      .then((result) => {
        const chavesUnicasCursos: any = filterCursosKeys(result)
        const chavesUnicasDisciplinas: any = filterDisciplinasKeys(result)

        setKeys(result)
        setCursosKeys(item => item = chavesUnicasCursos)
        setDisciplinasKeys(item => item = chavesUnicasDisciplinas)
      })
      .catch((e) => {
        console.log('Erro chave: ', e)
      })

    return chaves
  }

  useEffect(() => {
    if (connection !== null) {
      handleGetKeysRecorded()
    } else {
      console.log('Conexão ainda não foi estabelecida: ', connection)
    }
  }, [connection])

  useEffect(() => {
    if (cursosKeys.length !== 0) {
      processarDadosCursos()
      processarDadosDisciplinas()
    }
  }, [cursosKeys])

  function onChangeCurso(event: any, value: SelectProps) {
    const resultFiltro = FilterSelectedItems(keys, value.Codigo, valueDisciplina, valueTurma, valueAvaliacao)

    const disciplinasKeysFilter = filterDisciplinasKeys(resultFiltro)
    const disciplinasFilter = filterDisciplinas(disciplinas, disciplinasKeysFilter)
    setDisciplinasPermitidas(disciplinasFilter)

    setKeysFilter(resultFiltro)
    setValueCurso(v => v = value.Codigo)
  }

  function onChangeDisciplina(event: any, value: SelectProps) {
    setValueDisciplina(v => v = value?.Codigo)
  }

  function onChangeTurma(event: any, value: string) {
    console.log('Value: ', value)
    setValueTurma(value)
  }

  function onChangeAvaliacao(event: any, value: string) {
    setValueAvaliacao(value)
    console.log('Avaliacao: ', value)
  }


  return (
    <ThemeProvider theme={darkTheme}>

      <div className={styles.app} >
        <TopBar />

        <div className={styles.appHeader}>
          <SideBar />

          <AnimatePresence>
            <motion.div layout className={styles.homeRightSide}>
              {/* <h2>BAIXAR NOTAS</h2> */}

              <motion.span
                key={"TodasAsNotasContainer"}
                animate={{height: 'auto'}}
                transition={{ duration: 0.5, ease: 'easeIn', bounce: false }}
                style={{ marginTop: '-1em' }}
                className={`${styles.checkContainer} ${checked ? styles.checkContainerSelected : ''}`}>
                <motion.div layout className={styles.todasAsNotasRow}>
                  <label>TODAS AS NOTAS</label>
                  <Checkbox checked={checked} onChange={onChangeCheck} />
                </motion.div>

                {
                  checked ?
                    <motion.div
                      initial={{opacity: 0}}
                      animate={{opacity: 1}}
                      transition={{ duration: 0.5, ease: 'easeIn', bounce: false }}
                    >
                      <select className={styles.selectTipoNotas} name="selectAllNotasOption" id="selectAllNotasOption" onChange={onHandleAllNotasOptions} value={optionAllNotasSelect}>
                        <option value={'1'}>1 - APENAS NÃO BAIXADAS </option>
                        <option value={'2'}>2 - TODAS</option>
                      </select>

                      {/* <label style={{fontSize: '12px', fontWeight: 'normal'}}>TIPO:</label>

                    <select className={styles.selectNotasConceito} name="selectAllNotasOption" id="selectAllNotasOption" onChange={onHandleOptionNotasConceito} value={optionSelectNotasConceito}>
                      <option value={'nota'}>NOTA</option>
                      <option value={'conceito'}>CONCEITO</option>
                    </select> */}
                    </motion.div>
                    :
                    <></>
                }
              </motion.span>

              <motion.div
                // style={{ display: 'none' }}
                layout
                className={`${styles.autoCompleteContainer} ${checked ? '' : styles.checkContainerSelected}`}>
                <label className={styles.filtrarLabel}>FILTRAR</label>

                {valueKeys}

                <Autocomplete
                  disablePortal
                  className={styles.autoComplete}
                  disabled={checked}
                  id="Curso"
                  options={cursosPermitidos}

                  onChange={onChangeCurso}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="CURSO" />}
                />

                <Autocomplete
                  disablePortal
                  disabled={checked}
                  className={styles.autoComplete}
                  id="Disciplina"
                  onChange={onChangeDisciplina}
                  options={disciplinasPermitidas}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="DISCIPLINA" />}
                />

                <Autocomplete
                  disablePortal
                  disabled={checked}
                  className={styles.autoComplete}
                  onChange={onChangeTurma}
                  id="Turma"
                  options={['A', 'B', 'C']}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="TURMA" />}
                />

                <Autocomplete
                  disablePortal
                  disabled={checked}
                  className={styles.autoComplete}
                  onChange={onChangeAvaliacao}
                  id="Avaliacao"
                  options={['1° AV', '2° AV', '3° AV', '4° AV']}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="AVALIAÇÃO" />}
                />
              </motion.div>

              {modalIsOpen ? onSuccessModal() : null}

              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
              >
                <CircularProgress color="inherit" />
              </Backdrop>

              <motion.span layout className={styles.buttonsContainer}>
                <div onClick={onHandleDownload}>
                  <Button variant="contained" >
                    Baixar
                  </Button>
                </div>
                <Link className={styles.linkRedirect} to="/Home" onClick={() => { }}>
                  <Button variant="outlined" disabled={buttonDisabled}>
                    Voltar
                  </Button>
                </Link>
              </motion.span>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </ThemeProvider>
  )
}
