import fs from 'fs'
import { ipcRenderer } from 'electron';

interface itemsType {
  curso: string,
  turma: string,
  disciplina: string,
  avaliacao: string
}


interface keysType {
  id: number,
  data_lanc: string,
  matricula: string,
  chave: string,
  auxiliar_01: null | number,
  auxiliar_02: null | number,
  auxiliar_03: null | number,
  auxiliar_04: null | number,
  auxiliar_05: null | number,
  auxiliar_06: null | number,
  auxiliar_07: null | number,
  auxiliar_08: null | number,
  auxiliar_09: null | number,
  auxiliar_10: null | number,
  nota: number,
  falta: null | number,
  etapa: null | number,
  baixado: number
}

export function SelectedNotasExport(connection: any, __dirname: string, items: itemsType) {
  let dados: any = []
  let resultado: any = []
  let QtdArquivos: any = 0
  const cursoSelect = items.curso
  const turmaSelect = items.turma
  const disciplinaSelect = items.disciplina
  const avaliacaoSelect = items.avaliacao

  //FORMATA NOTA E FALTAS PARA DECIMAL
  function Formatar(dados: any) {
    let dadosFormatados = ''

    for (const value of dados) {
      let valorDado = ''

      if (value.nota !== 10) {
        //console.log('Nota: ', value.nota, 'Lenght: ', value.nota.toLocaleString().length)
        if (value.nota.toLocaleString().length === 1) {
          valorDado = `${value.matricula} ${value.nota.toLocaleString()},0  \r\n`// 10
        } else {
          valorDado = `${value.matricula} ${value.nota.toLocaleString()}  \r\n`// 10
        }
      } else {
        valorDado = `${value.matricula}${value.nota.toLocaleString()},0  \r\n` // < 10
      }

      dadosFormatados = dadosFormatados + valorDado
    }
    return dadosFormatados
  }

  //VERIFICA SE EXISTE DIRETORIO
  if (!fs.existsSync(__dirname + `/Gerados`)) {
    //Efetua a criação do diretório
    fs.mkdirSync(__dirname + `/Gerados`)
  }

  //FILTRA CHAVES PARA AS OPÇÕES INFORMADAS PELO USUÁRIO
  function filterItems(dataKeys: [keysType]):object {
    const keysFiltered = dataKeys.filter((d, i) => {
      let curso = d.chave.slice(0, 3)
      let turma = d.chave.slice(3, 4)
      let disciplina = d.chave.slice(4, 7)
      let avaliacao = d.chave.slice(7, 11)

      return (
        (cursoSelect !== '' ? curso === cursoSelect : curso) &&
        (turmaSelect !== '' ? turma === turmaSelect : turma) &&
        (disciplinaSelect !== '' ? disciplina === disciplinaSelect : disciplina) &&
        (avaliacaoSelect !== '' ? avaliacao === avaliacaoSelect : avaliacao)
      )
    })

    return keysFiltered
  }

  async function GetNotas() {
    connection.query(`SELECT * FROM notas_app ORDER BY chave`,
      (err: { code: any }, result: any) => {
        if (err) {
          console.log(`Erro ao consultar notas `, 'CODE: ', err.code, err)
        } else {

          dados.push(result)
          dados = filterItems(dados)

          const chaves = [...new Set(dados[0].map((item: { chave: any }) => item.chave))]
          console.log('Chaves:', chaves)

          let key: any
          for (key of chaves) {
            const dadosFiltrados = dados[0].filter((item: { chave: unknown }) => item.chave === key)
            resultado = JSON.stringify(dadosFiltrados) // Tirar o textRow
            resultado = JSON.parse(resultado)
            const avaliacao = key.slice(7)
            const nomeArquivo = avaliacao + '0000' + key.slice(0, 7)
            let resultadoFormatado = Formatar(resultado)

            fs.writeFile(__dirname + `/Gerados/${nomeArquivo}`, resultadoFormatado, err => {
              if (err) {
                console.error('Erro ao tentar escrever arquivo: ', err)
                return
              }
              //ARQUIVO ESCRITO COM SUCESSO
              QtdArquivos += 1
              // console.log('Arquivo escrito com sucesso', nomeArquivo)
              console.log('QtdArquivos:', QtdArquivos, ' Chaves:', chaves.length)

              if (QtdArquivos === chaves.length) {
                ipcRenderer.send('notification', { title: 'Infodat', body: 'Download de notas finalizado' })
                var files = fs.readdirSync(__dirname + `/Gerados`);
                // console.log('Files: ', files)
              }
            })

          }

        }

      })
  }

  GetNotas()
}
