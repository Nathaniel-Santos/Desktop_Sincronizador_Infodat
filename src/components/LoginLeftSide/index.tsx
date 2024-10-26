import { motion, AnimatePresence } from 'framer-motion'
import styles from 'styles/app.module.scss'

export default function LoginLeftSide() {
    return (
        <AnimatePresence>
        <motion.div
            layout
            className={styles.leftSide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeIn' }}
          >
            <motion.img src="../public/Logomarca.png"
              alt=""
              initial={{ opacity: 0, scale: 0.9, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'linear' }}
            />
            <motion.h1
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.8 }}
            >
              INFODAT
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, scale: 1, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeIn', delay: 2.3 }}
            >
              <p>
                INTEGRAÇÃO NOTAS WEB
              </p>
            </motion.p>
            <p style={{ fontSize: 10, opacity: 0.4 }}>
              Versão 1.0.3
            </p>
          </motion.div>
        </AnimatePresence>
    );
}