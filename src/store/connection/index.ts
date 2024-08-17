const mysql = require('mysql2')
import { create } from 'zustand'
import { ISetConnection } from './types'

interface IMysqlConnection {
    mysqlConnection: any,
    setMysqlConnection: (mysqlConnection: any) => any
    onRevalidateConnection: () => void
}

export const useConnectionStore = create<ISetConnection>((set) => ({
    connection: {
        host: '',
        user: '',
        pass: '',
        db: '',
        port: '',
        escola: ''
    },
    setConnection: (connection) => set({ connection }),
}))

export const useMysqlConnectionStore = create<IMysqlConnection>((set) => ({
    mysqlConnection: [],
    setMysqlConnection: (mysqlConnection) => set({ mysqlConnection }),
    onRevalidateConnection: () => {
        const conn = sessionStorage.getItem('conn')
        const connObj = JSON.parse(conn)
        const connPool = mysql.createPool(connObj)
        set({ mysqlConnection: connPool })
    },
}))