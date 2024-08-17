export interface ConnectionType {
    host: string
    user: string
    pass: string
    db: string
    port: string | number
    escola?: string,
}

export interface ISetConnection {
    connection: ConnectionType
    setConnection: (connection: ConnectionType) => void
}