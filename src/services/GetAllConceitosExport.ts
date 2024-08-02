import fs from 'fs'
const { ipcRenderer } = require('electron')

export async function GetAllConceitosExport(connection: any, __dirname: string, tipoDownload: string = '1') {
    let dados: any = []
    let resultado: any = []
    let QtdArquivos: any = 0

    function FormatarConceito(dados) {
        let dadosFormatados = ''
        for (const value of dados) {
            let valorConceito = ''
            let valorFalta = ''

            if (value.conceito.length > 0) {
                valorConceito = String(value.conceito).replaceAll(' ', '').padStart(4) //String com 4 casas
            }
            if (value.falta !== null && value.falta !== '') {
                valorFalta = String(value.falta).padStart(2)
            }

            const linhaAluno = value.matricula + valorConceito + valorFalta + ' \r\n'
            dadosFormatados = dadosFormatados + linhaAluno
        }
        return dadosFormatados
    }

    //VERIFICA SE EXISTE DIRETORIO
    if (!fs.existsSync(__dirname + `/Gerados`)) {
        //Efetua a criação do diretório
        fs.mkdirSync(__dirname + `/Gerados`)
    }

    function updateBaixados() {
        connection.query(`UPDATE conceitos_app SET baixado = 1 WHERE conceito IS NOT NULL`,
            (err, result) => {
                if (err) {
                    console.log('Não foi possivel atualizar o campo baixados em conceitos_app')
                    ipcRenderer.send('notification', { title: 'Infodat', body: 'Não foi possivel atualizar conceitos.' })
                } else {
                    console.log('Campo atualizado com sucesso')
                }
            })
    }

    const condicional: string = tipoDownload
    let query = ''

    switch (condicional) {
        case '1':          //Baixar apenas as notas não baixadas
            query = `SELECT * FROM conceitos_app WHERE conceito IS NOT NULL AND baixado = '0' ORDER BY chave`
            break
        case '2':          //Baixar todas as notas
            query = `SELECT * FROM conceitos_app WHERE conceito IS NOT NULL ORDER BY chave`
            break
        case '3':         //Putaria 
            query = `SELECT * FROM conceitos_app WHERE data_lanc = '2023-04-04' AND baixado = '1' ORDER BY chave`
            break
    }

    async function GetConceitos() {
        connection.query(`SELECT * FROM conceitos_app WHERE conceito IS NOT NULL ORDER BY chave`,
            async (err, result) => {
                if (err) {
                    console.log(`Erro ao consultar notas `, 'CODE: ', err.code, err)

                } else {
                    dados.push(result)
                    // res.send(dados)
                    const chaves: any = [...new Set(dados[0].map(item => item.chave))]

                    for (const key of chaves) {
                        const dadosFiltrados = dados[0].filter(item => item.chave === key)
                        resultado = JSON.stringify(dadosFiltrados) // Tirar o textRow 
                        resultado = JSON.parse(resultado)
                        const avaliacao = key?.slice(7)
                        const nomeArquivo = avaliacao + '0000' + key.slice(0, 7)
                        let resultadoFormatado = FormatarConceito(resultado)

                        fs.writeFile(__dirname + `/Gerados/${nomeArquivo}`, resultadoFormatado, err => {
                            if (err) {
                                console.error('Erro ao tentar escrever arquivo: ', err)
                                return
                            }
                            //ARQUIVO ESCRITO COM SUCESSO
                            QtdArquivos += 1
                            console.log('Arquivo escrito com sucesso', nomeArquivo)
                        })

                    }
                    console.log(QtdArquivos, ' ', chaves.length)

                    console.log('------------------- FEITO -----------------------')
                    updateBaixados()

                    if (QtdArquivos === chaves.length) {
                        var files = fs.readdirSync(__dirname + `/Gerados`);
                        console.log('Files: ', files)
                    }

                }
                // res.status(200).send(result)
            })
    }
    GetConceitos()
}