import styles from '../assets/styles/DownloadGrades/DownloadGrades.module.scss'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
const { ipcRenderer } = require('electron')

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Backdrop, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion'

import TopBar from '@/components/TopBar/TopBar';
import CircularProgress from '@mui/material/CircularProgress';
import SideBar from '@/components/SideBar/SideBar';
import ModalDownloadSucess from '@/components/ModalDownloadSucess'
import CardDownloadNotas from '@/components/CardDownloadNotas';
import CardDownloadFiltro from '@/components/CardDownloadFiltro';

import { GetAllNotasExport } from '@/services/DownloadAllGrades';
import { GetAllConceitosExport } from '@/services/GetAllConceitosExport'
import { SelectedNotasExport } from '@/services/DownloadSelectedGrades';
import { DownloadAllQuaGrades } from '@/services/DownloadAllQuaGrades';

import { useMysqlConnectionStore } from '@/store/connection'
import { CursosProps, DisciplinasProps } from './Types/DownloadGrades';


export default function DownloadGrades() {
  const [mysqlConnection] = useMysqlConnectionStore((state) => [state.mysqlConnection])

  const [open, setOpen] = useState<boolean>(false)
  const [modalIsOpen, setIsOpen] = useState<boolean>(false)
  const [checked, setChecked] = useState<boolean>(false)
  const [checkedQua, setCheckedQua] = useState<boolean>(false)

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
  const [optionAllNotasQuaSelect, setOptionAllNotasQuaSelect] = useState<'1' | '2' | '3'>('1')
  const [optionSelectNotasConceito, setOptionSelectNotasConceito] = useState<string>('nota')
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
  const [configData, setConfigData] = useState<object | any>({})


  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  function handleClose() {
    setOpen(!open)
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    window.location.reload()
  }  

  function onChangeCheck() {
    setChecked(!checked)
  }

  function onChangeCheckQua() {
    setCheckedQua(!checkedQua)
  }

  const downloadGrades = async (fileDirectory: string, selectedItems: object | any) => {
    if (checked) {
      const conceitosResult = await GetAllConceitosExport(mysqlConnection, fileDirectory, optionAllNotasSelect)
      const queryResult = await GetAllNotasExport(mysqlConnection, fileDirectory, optionAllNotasSelect)
      console.log('QueryResult: ', queryResult)
      console.log('ConceitosResult: ', conceitosResult)
    } 

    console.log('checkedQua: ', checkedQua)
    if (checkedQua) {
      console.log('checkedQua1: ', checkedQua)
      await DownloadAllQuaGrades({
        cursoSelect: 'todos',
        turmaSelect: '%',
        avaliacaoSelect: 'N400',
        __dirname: fileDirectory,
        baixadosSelect: optionAllNotasQuaSelect,
        connection: mysqlConnection
      })
    }

    if(!checked && !checkedQua) {
      SelectedNotasExport(mysqlConnection, fileDirectory, selectedItems)
    }

    setIsOpen(true)
    setOpen(false)
  }

  function selectFolder(defaultFilePath: string, msg: object | any, selectedItems: object | any) {
    const filePath = msg.downloadPath
    defaultFilePath = filePath

    let fileDirectory = ''


    ipcRenderer.send('file-request', { auth: true, page: 'DownloadGrades', defaultUrl: defaultFilePath });
    const result = ipcRenderer.once('file', (event, file) => {

      console.log('FilePathSelected: ', file)
      setOpen(true)

      if (filePath !== file) {
        const dadosConfig = msg.data
        dadosConfig.DOWNLOADPATH = file
        dadosConfig['SAVE'] = true

        console.log('dadosConfigSave: ', dadosConfig)
        ipcRenderer.send('save-config-change', dadosConfig)
      }

      fileDirectory = defaultFilePath !== '' ? defaultFilePath : file
      console.log('FileDirectory: ', fileDirectory)
      downloadGrades(fileDirectory, selectedItems)

      // ipcRenderer.on('notification', (event, msg) => {
      //   setIsOpen(true)
      //   setOpen(false)
      // })
    })
  }


  const onHandleDownload = async () => {
    setButtonDisabled(true)

    if (checked || checkedQua) {
      let defaultFilePath: string

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
    console.log('EventOptionGrades: ', target.value)
    setOptionAllNotasSelect(target.value)
  }

  const onHandleAllNotasQuaOptions = ({ target }) => {
    console.log('EventOptionQua: ', target.value)
    setOptionAllNotasQuaSelect(target.value)
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

              <motion.div>
                <CardDownloadNotas
                  checked={checked}
                  title="TODAS AS NOTAS"
                  onChangeCheck={onChangeCheck}
                  onHandleAllNotasOptions={onHandleAllNotasOptions}
                  optionAllNotasSelect={optionAllNotasSelect} />

                <CardDownloadNotas
                  checked={checkedQua}
                  title="N. QUALITATIVAS"
                  onChangeCheck={onChangeCheckQua}
                  onHandleAllNotasOptions={onHandleAllNotasQuaOptions}
                  optionAllNotasSelect={optionAllNotasQuaSelect} />
              </motion.div>



              <CardDownloadFiltro
                checked={checked}
                checkedQua={checkedQua}
                cursosPermitidos={cursosPermitidos}
                disciplinasPermitidas={disciplinasPermitidas}
                setValueAvaliacao={setValueAvaliacao}
                onChangeCheck={onChangeCheck}
                valueKeys={valueKeys}
                cursosKeys={cursosKeys}
                disciplinasKeys={disciplinasKeys}
                valueDisciplina={valueDisciplina}
                valueTurma={valueTurma}
                valueAvaliacao={valueAvaliacao}
                valueCurso={valueCurso}
                keys={keys}
                keysFilter={keysFilter}
                setDisciplinasPermitidas={setDisciplinasPermitidas}
                setKeysFilter={setKeysFilter}
                setKeys={setKeys}
                setDisciplinasKeys={setDisciplinasKeys}
                setCursosKeys={setCursosKeys}
                setDisciplinas={setDisciplinas}
                setTurmas={setTurmas}
                setCursos={setCursos}
              />

              {modalIsOpen ? <ModalDownloadSucess closeModal={closeModal} modalIsOpen={modalIsOpen} /> : null}

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
