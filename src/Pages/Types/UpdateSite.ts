export type connMsgType = {
    USER?: string,
    PASS?: string,
    MDBPATH?: string,
    DOWNLOADPATH?: string
}

export type IdadosCheck = {
    "checked": boolean,
    "mdb": string,
    "sent": boolean,
    "web": string
}