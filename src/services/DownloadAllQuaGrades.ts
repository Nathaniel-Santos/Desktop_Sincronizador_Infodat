import fs from 'fs'

type baixadosType = '1' | '2' | '3'
type tipoDownloadType = '1' | '2' | '3'

interface IParams {
    cursoSelect: string | number
    turmaSelect: string | number
    avaliacaoSelect: string | number
    baixadosSelect: baixadosType
    __dirname: string,
    connection: any
}

export async function DownloadAllQuaGrades({
    cursoSelect,
    turmaSelect,
    avaliacaoSelect,
    baixadosSelect,
    __dirname,
    connection }: IParams) {
    console.log('connection: ', connection)

    // SELECIONAR CURSO, TURMA, AVALIACAO, BAIXADOS(sim ou nao)
    // const curso = '003'
    // const turma = 'A'
    const curso = cursoSelect
    const turma = turmaSelect
    const avaliacao = avaliacaoSelect
    const baixados: baixadosType = baixadosSelect // 1 = Apenas baixados | 0 = Todos

    let QtdArquivos = 0

    //VERIFICA SE EXISTE DIRETORIO
    if (!fs.existsSync(__dirname + `/GeradosQua`)) {
        //Efetua a criação do diretório
        fs.mkdirSync(__dirname + `/GeradosQua`)
    }
    

    async function updateBaixadosObservacao(chave: string) {
        const queryUpdate = `UPDATE observacoes_app SET baixado = 1 WHERE chave = ?`
        const [result, _] = await connection.promise().query(queryUpdate, [chave])
        return result
    }

    async function updatedBaixadosQualitativas(chave: string) {
        const queryUpdate = `UPDATE qualitativas_app SET baixado = 1 WHERE chave = ?`
        const [result, _] = await connection.promise().query(queryUpdate, [chave])
        return result
    }

    async function GetObservacoes() {
        const query = 'SELECT * FROM observacoes_app'
        const [rows, _] = await connection.promise().query(query)
        const rowsStr = JSON.stringify(rows)
        return JSON.parse(rowsStr)
    }

    async function GetNotas() {
        let query

        console.log('baixados: ', baixados)
        if (baixados === '1') {
            query = `SELECT * FROM qualitativas_app WHERE conceito IS NULL AND baixado = '0' ORDER BY disciplina`

        } else if (baixados === '2') {
            query = `SELECT * FROM qualitativas_app WHERE conceito IS NOT NULL ORDER BY chave`

        } else {
            const curso = cursoSelect !== 'todos' ? cursoSelect : '%'
            const turma = turmaSelect !== 'todos' ? turmaSelect : '%'
            const avaliacao = avaliacaoSelect !== 'todos' ? avaliacaoSelect : '%'

            const chaveQuery = avaliacao + '1111' + curso + turma

            query = `SELECT * FROM qualitativas_app WHERE chave LIKE '${chaveQuery}' ORDER BY disciplina`
        }

        console.log('query: ', query)

        connection.query(query,
            async (err: any, result: any) => {
                if (err) {
                    console.log(`Erro ao consultar qualitativas `, 'CODE: ', err.code, err)

                } else {
                    const resultado: any = JSON.stringify(result)
                    const resultadoJson: any = JSON.parse(resultado)

                    console.log('Result: ', resultadoJson)
                    const matriculasUnicas: string[] | any = [...new Set(resultadoJson?.map(item => item?.matricula))]
                    const chavesUnicas: string[] | any = [...new Set(resultadoJson.map(item => item.chave))]

                    const observacoes = await GetObservacoes()

                    if (curso !== 'todos') {
                        const chave = avaliacao + '1111' + curso + turma

                        for (const matricula of matriculasUnicas) {
                            const conceitosAluno = resultadoJson.filter(item => item.matricula === matricula && item.chave === chave)
                            const strMatricula = matricula
                            let complemento = ''

                            if (conceitosAluno.length > 0) {
                                //Concatena conceitos em linha de cada aluno
                                for (const itemConceito of conceitosAluno) {
                                    const conceito = ("    " + itemConceito?.conceito)?.slice(-4) // Força 4 caracteres adicionando espaço em branco a esquerda
                                    complemento = complemento + itemConceito.disciplina + conceito
                                }

                                const observacaoChave = observacoes.filter(item => item.chave === chave && item.matricula === matricula)[0]
                                const observacaoDado = observacaoChave.observacao !== undefined ? observacaoChave.observacao : ''
                                const strFinal = strMatricula + complemento + '$' + observacaoDado + '\r\n'

                                const nomeArquivo = avaliacao + '0000' + curso + turma

                                fs.writeFileSync(__dirname + `/GeradosQua/${nomeArquivo}`, strFinal)
                                //ARQUIVO ESCRITO COM SUCESSO
                                QtdArquivos += 1

                                const updatedObs = await updateBaixadosObservacao(chave)
                                console.log('updatedObs: ', updatedObs)
                                const updatedQua = await updatedBaixadosQualitativas(chave)
                                console.log('updatedQua: ', updatedQua)
                            }
                        }
                    } else {
                        for (const chaveUnica of chavesUnicas) {
                            const cursoChave = chaveUnica?.slice(8, 11)
                            const turma = chaveUnica?.slice(11)
                            const chave = avaliacao + '1111' + cursoChave + turma

                            for (const matricula of matriculasUnicas) {
                                const conceitosAluno = resultadoJson?.filter(item => item.matricula === matricula && item.chave === chave)
                                const strMatricula = matricula
                                let complemento = ''

                                if (conceitosAluno.length > 0) {

                                    for (const itemConceito of conceitosAluno) {
                                        const conceito = ("    " + itemConceito.conceito)?.slice(-4) // Força 4 caracteres adicionando espaço em branco a esquerda
                                        complemento = complemento + itemConceito.disciplina + conceito
                                    }

                                    const observacaoChave = observacoes.filter(item => item.chave === chave && item.matricula === matricula)[0]
                                    const observacaoDado = observacaoChave?.observacao !== undefined ? observacaoChave?.observacao : ''
                                    const strFinal = strMatricula + complemento + '$' + observacaoDado + '\r\n'

                                    const nomeArquivo = avaliacao + '0000' + cursoChave + turma

                                    fs.appendFileSync(__dirname + `/GeradosQua/${nomeArquivo}`, strFinal, {
                                        encoding: 'ascii'
                                    })
                                    //ARQUIVO ESCRITO COM SUCESSO
                                    QtdArquivos += 1


                                    const updatedObs = await updateBaixadosObservacao(chave)
                                    const updatedQua = await updatedBaixadosQualitativas(chave)
                                }
                            }
                        }
                    }

                    return { Status: 200, Msg: 'Dados escritos e atualizados com sucesso' }
                }
            })
    }
    await GetNotas()
}