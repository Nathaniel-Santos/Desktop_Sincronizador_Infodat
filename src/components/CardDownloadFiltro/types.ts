import { CursosProps,  DisciplinasProps, KeysProps, SelectProps } from "../../Pages/Types/DownloadGrades";

export type CardDownloadFiltroProps = {
    mysqlConnection?: any
    checked?: boolean
    checkedQua?: boolean
    onChangeCheck?: (e?: any) => void
    setValueAvaliacao?: React.Dispatch<React.SetStateAction<any>>
    disciplinasPermitidas?: DisciplinasProps[]
    cursosPermitidos?: CursosProps[]
    valueKeys?: string
    disciplinas?: DisciplinasProps[]
    setValueDisciplina?: React.Dispatch<React.SetStateAction<any>>
    setValueTurma?: React.Dispatch<React.SetStateAction<any>>
    setValueCurso?: React.Dispatch<React.SetStateAction<any>>
    valueCurso?: string
    setDisciplinasPermitidas?: React.Dispatch<React.SetStateAction<DisciplinasProps[]>>
    valueDisciplina?: string 
    valueTurma?: string
    valueAvaliacao?: string
    keys?: any[]
    setKeysFilter?: React.Dispatch<React.SetStateAction<any>>
    keysFilter?: string[]
    setKeys?: React.Dispatch<React.SetStateAction<any>>
    disciplinasKeys?: any
    cursosKeys?: string[]
    setCursosPermitidos?: React.Dispatch<React.SetStateAction<any>>
    setCursosKeys?: React.Dispatch<React.SetStateAction<any>>
    setDisciplinasKeys?: React.Dispatch<React.SetStateAction<any>>
    setCursos?: React.Dispatch<React.SetStateAction<any>>
    setTurmas?: React.Dispatch<React.SetStateAction<any>>
    setDisciplinas?: React.Dispatch<React.SetStateAction<any>>
    setOptionAllNotasSelect?: React.Dispatch<React.SetStateAction<any>>
    setOptionAllNotasQuaSelect?: React.Dispatch<React.SetStateAction<any>>
    setOptionSelectNotasConceito?: React.Dispatch<React.SetStateAction<any>>
    setButtonDisabled?: React.Dispatch<React.SetStateAction<any>>
    setConfigData?:React.Dispatch<React.SetStateAction<any>>
}