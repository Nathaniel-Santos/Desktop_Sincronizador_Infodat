import styles from '../../assets/styles/DownloadGrades/DownloadGrades.module.scss'
import { motion } from 'framer-motion'
import { Checkbox } from '@mui/material';
import {CardDownloadNotasProps} from './types'

export default function CardDownloadNotas({
    title = "TODAS AS NOTAS",
    checked,
    onChangeCheck,
    onHandleAllNotasOptions,
    optionAllNotasSelect }: CardDownloadNotasProps) {
    return (
        <motion.span
            key={"TodasAsNotasContainer"}
            animate={{ height: 'auto' }}
            transition={{ duration: 0.5, ease: 'easeIn', bounce: false }}
            style={{ marginTop: '-1em' }}
            className={`${checked ? styles.checkContainerSelected : ''} ${styles.checkContainer} `}>
            <motion.div layout className={styles.todasAsNotasRow}>
                <label>{title}</label>
                <Checkbox checked={checked} onChange={onChangeCheck} />
            </motion.div>


            {
                checked ?
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, ease: 'easeIn', bounce: false }}
                    >
                        <select className={styles.selectTipoNotas} name="selectAllNotasOption" id="selectAllNotasOption" onChange={onHandleAllNotasOptions} value={optionAllNotasSelect}>
                            <option value={'1'}>1 - APENAS NÃO BAIXADAS </option>
                            <option value={'2'}>2 - TODAS</option>
                        </select>

                    </motion.div>
                    :
                    <></>
            }
        </motion.span>
    )
}
