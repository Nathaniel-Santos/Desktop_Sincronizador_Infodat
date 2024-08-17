import Modal from 'react-modal'
import styles from '../../assets/styles/DownloadGrades/DownloadGrades.module.scss'
import {ModalDownloadSucessProps} from './types'

export default function ModalDownloadGeneric({title, subtitle, modalIsOpen, closeModal}: ModalDownloadSucessProps) {
    return (
        <Modal
              closeTimeoutMS={200}
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              ariaHideApp={false}
              contentLabel="Example Modal"
              overlayClassName={styles.modalOverlay}
              className={`${styles.modalContent} ${modalIsOpen !== true ? styles.modalClosed : styles.modalOpened}`}
            >
              <h2>{title}</h2>
              <p>{subtitle}</p>
              <button onClick={closeModal}>Fechar</button>
            </Modal>
    )
}