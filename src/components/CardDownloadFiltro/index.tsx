import { motion } from 'framer-motion'
import styles from '../../assets/styles/DownloadGrades/DownloadGrades.module.scss'
import { Autocomplete, TextField } from '@mui/material'
import { CardDownloadFiltroProps } from './types'
import FilterSelectedItems from '@/functions/FilterSelectedItems';
import { CursosProps, DisciplinasProps, KeysProps, SelectProps } from '@/Pages/Types/DownloadGrades';
import { GetAllCursosTable } from '@/services/GetAllCursosTable';
import { GetKeysRecorded } from '@/services/GetKeysRecorded';
import { GetAllDisciplinasTable } from '@/services/GetAllDisciplinasTable';
import { useEffect } from 'react';



export default function CardDownloadFiltro({
    mysqlConnection,
    checked,
    checkedQua,
    disciplinasPermitidas,
    cursosPermitidos,
    valueKeys,
    disciplinas,
    setValueDisciplina,
    setValueTurma,
    setValueCurso,
    setDisciplinasPermitidas,
    valueDisciplina,
    valueTurma,
    valueAvaliacao,
    keys,
    setKeysFilter,
    setValueAvaliacao,
    disciplinasKeys,
    cursosKeys,
    setCursosPermitidos,
    setKeys,
    setCursosKeys,
    setDisciplinasKeys,
    setCursos,
    setTurmas,
    setDisciplinas,
    setOptionAllNotasSelect,
    setOptionAllNotasQuaSelect,
    setOptionSelectNotasConceito,
    setButtonDisabled,
    setConfigData

}: CardDownloadFiltroProps) {

    function filterCursosKeys(keys: KeysProps[]): [String] {
        const cursos = keys.map((item) => {
            const chave = item.chave
            const curso = chave?.slice(0, 3)
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

    function handleGetAllCursos() {
        const cursos = GetAllCursosTable(mysqlConnection)
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
        const disciplinasQuery = GetAllDisciplinasTable(mysqlConnection)
        disciplinasQuery
            .then((result) => {
                setDisciplinas(item => item = result)
            })
            .catch((e) => {
                console.log('Erro ao consultar disciplinas: ', e)
            })

        return disciplinasQuery
    }

    function processarDadosDisciplinas() {
        const disciplionasTable = handleGetAllDisciplinasTable()
        disciplionasTable.then((result) => {
            const permitidos = filterDisciplinas(result, disciplinasKeys)
            permitidos.push({ label: 'Todos', Codigo: '000' })
            setDisciplinasPermitidas(permitidos)
        })
    }

    function filterDisciplinasKeys(keys: KeysProps[]): [String] {
        const disciplinasKeys = keys.map((item) => {
            const chave = item.chave
            const disciplina = chave?.slice(4, 7)
            return disciplina
        })
        const disciplinasUnicas: any = [...new Set(disciplinasKeys)]
        return disciplinasUnicas
    }

    //FILTRAR TURMAS PERMITIDAS
    function filterTurmas(turmas: any, keys: any) {
        const turmasFiltro = keys.map((item) => {
            const turma = item.chave?.slice(3, 4)
            return turma
        })
        const turmasUnicas = [... new Set(turmasFiltro)]
    }

    //FILTRAR DISCIPLINAS PERMITIDAS
    function filterDisciplinas(disciplinas: DisciplinasProps[], keys: string[] | [String]) {
        const filtroDisciplinas = disciplinas.filter(item =>
            keys.includes(item.Codigo) ? item : !item
        )
        return filtroDisciplinas
    }

    function onChangeAvaliacao(event: any, value: string) {
        setValueAvaliacao(value)
        console.log('Avaliacao: ', value)
    }

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

    function handleGetKeysRecorded(): any {
        const chaves = GetKeysRecorded(mysqlConnection)
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
        if (mysqlConnection !== null && mysqlConnection !== undefined && mysqlConnection.length !== 0) {
            handleGetKeysRecorded()
        } else {
            console.log('Conexão ainda não foi estabelecida: ', mysqlConnection)
        }
    }, [mysqlConnection])

    useEffect(() => {
        if (cursosKeys.length !== 0) {
            processarDadosCursos()
            processarDadosDisciplinas()
        }
    }, [cursosKeys])


    return (
        <motion.div
            // style={{ display: 'none' }}
            layout
            className={`${checked || checkedQua ? styles.checkContainerDisabled : styles.checkContainerSelected} ${styles.autoCompleteContainer}`}>
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

            {
                checked === true || checkedQua === true ?
                    <></>
                    :
                    <>
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
                    </>
            }
        </motion.div>
    )
}