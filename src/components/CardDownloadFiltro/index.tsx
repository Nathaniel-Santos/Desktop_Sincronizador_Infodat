import { motion } from 'framer-motion'
import styles from '../../assets/styles/DownloadGrades/DownloadGrades.module.scss'
import { Autocomplete, TextField } from '@mui/material'
import { CardDownloadFiltroProps } from './types'


export default function CardDownloadFiltro({
    checked,
    checkedQua,
    onChangeTurma,
    onChangeDisciplina,
    onChangeCurso,
    disciplinasPermitidas,
    cursosPermitidos,
    valueKeys,
    onChangeAvaliacao
}: CardDownloadFiltroProps) {
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