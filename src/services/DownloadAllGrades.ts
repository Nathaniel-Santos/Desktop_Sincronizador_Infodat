import fs from 'fs'
const { ipcRenderer } = require('electron')

export async function GetAllNotasExport(connection: any, __dirname: string, tipoDownload: string) {
  let dados: any = []
  let resultado: any = []
  let QtdArquivos: any = 0

  function FormatarCasaDecimal(nota) {
    // console.log('Nota Validar', nota)
    const notaValidar = JSON.stringify(nota)
    let notaSemDecimal: any = notaValidar.split('.')[0]

    const decimais = notaValidar.split('.')[1]
    // console.log('Decimais: ', decimais)

    if (decimais !== undefined) {
      if (decimais.length === 2) {
        let primeiroDecimal: any = parseInt(decimais.slice(0, 1))
        let segundoDecimal: any = parseInt(decimais.slice(1))

        if (primeiroDecimal === 9) {
          notaSemDecimal = parseInt(notaSemDecimal) + 1
          // console.log('NOTA SEM DECIMAL ', notaSemDecimal, ' ------------------------------')
          primeiroDecimal = ''
          segundoDecimal = ''

        } else {
          if (segundoDecimal >= 5) {
            primeiroDecimal = primeiroDecimal + 1
            segundoDecimal = ''

          } else {
            segundoDecimal = ''
          }
        }


        const notaResultado = parseFloat(`${notaSemDecimal}.${primeiroDecimal}${segundoDecimal}`)
        // console.log('Nota Bruta: ', nota, ' Nota Formatada: ', notaResultado)

        return notaResultado

      } else {

        // console.log('NotaSemResultado', nota)
        return nota
      }

    } else {
      return nota
    }
  }

  function Formatar(dados) {
    let dadosFormatados = ''


    for (const value of dados) {
      let valorDado = ''

      // console.log('valueDado: ', value)

      const notaArredondada = FormatarCasaDecimal(value.nota)
      // console.log('notaArredondada: ', notaArredondada)

      if (notaArredondada !== 10) {
        //console.log('Nota: ', notaArredondada, 'Lenght: ', notaArredondada.toLocaleString().length)
        if (notaArredondada.toLocaleString().length === 1) {
          if (value.falta === null || value.falta === 0) { //Sem faltas
            valorDado = `${value.matricula} ${notaArredondada.toLocaleString()},0  \r\n`// 10
          } else if (value.falta.toLocaleString().length === 1) { //Faltas com 1 digito (Abaixo de 10)
            valorDado = `${value.matricula} ${notaArredondada.toLocaleString()},0 ${value.falta.toLocaleString()} \r\n`// 10
          } else { // Faltas com 2 digitos (A partir de 10)
            valorDado = `${value.matricula} ${notaArredondada.toLocaleString()},0${value.falta.toLocaleString()} \r\n`// 10
          }
        } else {
          // valorDado = `${value.matricula} ${notaArredondada.toLocaleString()}  \r\n`// 10
          if (value.falta === null || value.falta === 0) { //Sem faltas
            valorDado = `${value.matricula} ${notaArredondada.toLocaleString()}  \r\n`// 10
          } else if (value.falta.toLocaleString().length === 1) { //Faltas com 1 digito (Abaixo de 10)
            valorDado = `${value.matricula} ${notaArredondada.toLocaleString()} ${value.falta.toLocaleString()} \r\n`// 10
          } else { // Faltas com 2 digitos (A partir de 10)
            valorDado = `${value.matricula} ${notaArredondada.toLocaleString()}${value.falta.toLocaleString()} \r\n`// 10
          }
        }
      } else {
        // valorDado = `${value.matricula}${notaArredondada.toLocaleString()},0  \r\n` // < 10
        if (value.falta === null || value.falta === 0) { //Sem faltas
          valorDado = `${value.matricula}${notaArredondada.toLocaleString()},0  \r\n`// 10
        } else if (value.falta.toLocaleString().length === 1) { //Faltas com 1 digito (Abaixo de 10)
          valorDado = `${value.matricula}${notaArredondada.toLocaleString()},0 ${value.falta.toLocaleString()} \r\n`// 10
        } else { // Faltas com 2 digitos (A partir de 10)
          valorDado = `${value.matricula} ${notaArredondada.toLocaleString()},0${value.falta.toLocaleString()} \r\n`// 10
        }
      }

      // console.log('ValorDado: ', valorDado.replace('.', ','))

      dadosFormatados = dadosFormatados + valorDado.replace('.', ',')
    }
    return dadosFormatados
  }

  //VERIFICA SE EXISTE DIRETORIO
  if (!fs.existsSync(__dirname + `/Gerados`)) {
    //Efetua a criação do diretório
    fs.mkdirSync(__dirname + `/Gerados`)
  }

  function updateBaixados() {
    const resultUpdate = connection.promise().query(`UPDATE notas_app SET baixado = 1 WHERE nota IS NOT NULL`)
      .then((result: any) => {
        console.log('Não foi possível atualizar o status de notas')
      })
      .catch((err: any) => {
        console.log('Status notas atualizado com sucesso')
      })

    return resultUpdate
  }

  function GetNotas(tipoDownload: string) {
    const condicional: string = tipoDownload
    let query = ''

    // console.log('Condicional: ', condicional)

    switch (condicional) {
      case '1':         //Baixar as notas que ainda não foram baixadas
        query = `SELECT * FROM notas_app WHERE nota IS NOT NULL AND baixado = '0' ORDER BY chave`
        break

      case '2':         //Baixar todas as notas
        query = `SELECT * FROM notas_app WHERE nota IS NOT NULL ORDER BY chave`
        break

      case '3':         //Putaria
        query = `SELECT * FROM notas_app WHERE data_lanc = '2023-04-04' AND baixado = '1' ORDER BY chave`
        break
    }

    console.log('Query: ', query)

    connection.query(query,
      (err, result) => {
        if (err) {
          console.log(`Erro ao consultar notas `, 'CODE: ', err.code, err)
          return err
        } else {
          dados.push(result)
          // console.log('Result: ', result)
          // res.send(dados)
          const chaves: any = [...new Set(dados[0].map(item => item.chave))]


          // console.log('Chaves: ', chaves)

          if (chaves.length === 0) {
            ipcRenderer.send('notification', { title: 'Infodat', body: 'Não foi possível encontrar notas.' })
            return result
          }

          for (const key of chaves) {
            const dadosFiltrados = dados[0].filter(item => item.chave === key)
            resultado = JSON.stringify(dadosFiltrados) // Tirar o textRow
            resultado = JSON.parse(resultado)
            const avaliacao = key.slice(7)
            const nomeArquivo = avaliacao + '0000' + key.slice(0, 7)
            let resultadoFormatado = Formatar(resultado)

            // console.log('ResultadoFormatado: ', resultadoFormatado)

            fs.writeFile(__dirname + `/Gerados/${nomeArquivo}`, resultadoFormatado, err => {
              if (err) {
                console.error('Erro ao tentar escrever arquivo: ', err)
                return
              }
              //ARQUIVO ESCRITO COM SUCESSO
              QtdArquivos += 1
              // console.log('Arquivo escrito com sucesso', nomeArquivo)

              if (QtdArquivos === chaves.length) {
                ipcRenderer.send('notification', { title: 'Infodat', body: 'Download de notas finalizado' })
                var files = fs.readdirSync(__dirname + `/Gerados`);
                // console.log('Files: ', files)
              }
            })

          }
          // console.log(QtdArquivos, ' ', chaves.length)

          console.log('------------------- FEITO -----------------------')
          const resultadoUpdate = updateBaixados()
          console.log('ResultadoUpdate: ', resultadoUpdate)


        }

      })
  }
  const resultadoNotas = GetNotas(tipoDownload)
  return resultadoNotas
}
