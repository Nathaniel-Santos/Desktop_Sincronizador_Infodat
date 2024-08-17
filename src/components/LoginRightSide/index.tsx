import { motion } from 'framer-motion'
import styles from 'styles/app.module.scss'
import UserOutLine from '../../public/User-outline.json'
import { Player } from '@lottiefiles/react-lottie-player'
import { useRef, useState } from 'react'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'
import { Backdrop, CircularProgress } from '@mui/material'
import {LoginRightSideProps} from './types'


export default function LoginRightSide({ onAuth,
    userValue,
    setUserValue,
    passValue,
    setPassValue,
    modalIsOpen,
    setIsOpen,
    open,
    setOpen,
    linkRef }: LoginRightSideProps) {

    const userRef = useRef<HTMLInputElement>(null)
    const passRef = useRef<HTMLInputElement>(null)
    Modal.setAppElement('#root')

    function onSelectUser() {
        userRef?.current?.focus()
    }

    function onSelectPass() {
        passRef?.current?.focus()
    }

    function openModal() {
        setIsOpen(!modalIsOpen);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function handleCloseBackdrop() {
        setOpen(!open)
    }

    return (
        <div className={styles.rightSide}>
            <motion.div
                initial={{ opacity: 0, scale: 1, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
            >
                <Player
                    src={UserOutLine}  // Arquivo JSON Lottie
                    className="player"
                    keepLastFrame      // Parar no final da animação
                    autoplay           // Iniciar automaticamente
                    id='userIconLottie'
                    style={
                        {
                            width: 100,
                            height: 100,
                            color: '#ffffff',
                            marginBottom: '2.5em',
                            marginTop: '-6em',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            opacity: 1,
                            borderRadius: '50%',
                            transition: '0.5s',
                            padding: '1em'
                        }
                    }
                />
            </motion.div>

            <motion.form>
                <motion.div className={styles.userContainer}
                    initial={{ opacity: 0, scale: 1, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 1.2 }}
                >
                    <label htmlFor="User" className={userValue !== '' ? styles.userClass : ''} onClick={onSelectUser}> USUÁRIO </label>
                    <input type="text" ref={userRef} name="userInput" id="userInput" value={userValue} onChange={e => setUserValue(e.target.value)} />
                </motion.div>

                <motion.div className={styles.passContainer}
                    initial={{ opacity: 0, scale: 1, y: -30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 1.4 }}
                >
                    <label htmlFor="Password" className={passValue !== '' ? styles.passClass : ''} onClick={onSelectPass}> SENHA </label>
                    <input type="password" ref={passRef} value={passValue} onChange={e => setPassValue(e.target.value)} name="passInput" id="passInput" />
                </motion.div>

                <motion.a
                    className={styles.appLink}
                    href="https://web.whatsapp.com/send?phone=5579998312572"
                    target="_blank"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, ease: 'easeIn', delay: 2.2 }}
                >
                    Suporte Infodat
                </motion.a>

                <motion.button type='submit' onClick={onAuth}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeIn', delay: 1.4 }}
                >
                    ENTRAR
                </motion.button>
            </motion.form>


            <Link ref={linkRef} to="/Home" />

            <Modal
                closeTimeoutMS={200}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                onAfterClose={closeModal}
                contentLabel="Example Modal"
                overlayClassName={styles.modalOverlay}
                className={`${styles.modalContent} ${modalIsOpen !== true ? styles.modalClosed : styles.modalOpened}`}
            >
                <Player
                    keepLastFrame={true}
                    autoplay
                    style={
                        {
                            width: 60,
                            height: 60,
                            color: '#ffffff',
                            marginBottom: '1em',
                            marginTop: '0em',
                            backgroundColor: 'rgba(255,255,255,1)',
                            opacity: 1,
                            borderRadius: '50%',
                            transition: '0.5s',
                            padding: '0.4em',
                        }
                    }
                    src="https://assets3.lottiefiles.com/private_files/lf30_jlibtszo.json"
                />

                <h2>NÃO FOI POSSÍVEL LOGAR</h2>
                <p>Favor verificar se o login e senha foram digitados corretamente</p>
                <button onClick={closeModal}>Fechar</button>
            </Modal>

            <Backdrop
                sx={{ color: '#61dafb', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleCloseBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

        </div>
    )
}