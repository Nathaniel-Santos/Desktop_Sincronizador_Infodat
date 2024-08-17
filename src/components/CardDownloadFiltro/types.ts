import { CursosProps } from "../../Pages/Types/DownloadGrades";
import { DisciplinasProps } from "../../Pages/Types/DownloadGrades";

export type CardDownloadFiltroProps = {
    checked: boolean
    checkedQua: boolean
    onChangeCheck: (e: any) => void
    onChangeCurso: (e: any, value: any) => void
    onChangeTurma: (e: any, value: any) => void
    onChangeDisciplina: (e: any, value: any) => void
    onChangeAvaliacao: (e: any, value: any) => void
    disciplinasPermitidas: DisciplinasProps[]
    cursosPermitidos: CursosProps[]
    valueKeys: string
}