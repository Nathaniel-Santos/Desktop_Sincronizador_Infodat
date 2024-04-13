export function FilterTableToUpdate(tableName: string) {
  switch (tableName) {
    case 'alunos':
      return tableName

    case 'funcionarios':
      return tableName

    case 'digitacao':
      return tableName

    case 'cursos':
      return tableName

    case 'disciplinas':
      return tableName

    case 'turmas':
      return tableName

    case 'Desligados':
      return tableName

    case 'avaliacoes':
      return tableName

    case 'Grades':
      return tableName

    case 'GradesQua':
      return tableName

    case 'Qualitativas':
      return tableName

    case 'NotasAuxLeg':
      return tableName

    case 'empresa':
      return tableName

    case 'ocorrencias':
      return tableName

    case 'pagamentos':
      return tableName

    case 'tiposLanc':
      return tableName

    case 'tiposocorr':
      return tableName

    default:
      return null
  }
}
