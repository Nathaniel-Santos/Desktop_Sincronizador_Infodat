export function FindMdbwebTableName(webTableName: string){
  switch (webTableName) {
    case 'alunos':
      return 'Alunos'

    case 'funcionarios':
      return 'Funcionarios'

    case 'digitacao':
      return 'Digitacao'

    case 'cursos':
      return 'Cursos'

    case 'disciplinas':
      return 'Disciplinas'

    case 'turmas':
      return 'Turmas'

    case 'Desligados':
      return 'Desligados'

    case 'avaliacoes':
      return 'Avaliacoes'

    case 'Grades':
      return 'Grades'

    case 'GradesQua':
      return 'GradesQua'

    case 'Qualitativas':
      return 'Qualitativas'

    case 'NotasAuxLeg':
      return 'NotasAuxLeg'

    case 'empresa':
      return 'Empresa'

    case 'ocorrencias':
      return 'Ocorrencias'

    case 'pagamentos':
      return 'Pagamentos'

    case 'tiposLanc':
      return 'TiposLanc'

    case 'tiposocorr':
      return 'TiposOcorr'

    default:
      return null
  }

}
