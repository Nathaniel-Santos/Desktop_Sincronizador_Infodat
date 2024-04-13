interface KeysProps {
  chave: string
}

interface ItemsProps {
  Curso: string,
  Disciplina: string,
  Turma: string,
  Avaliacao: string,
  Key: KeysProps[]
}

export default function FilterSelectedItems(Key, Curso, Disciplina, Turma, Avaliacao) {
  let chave = Key

  //Filtra curso
  chave = Curso !== ''
    ? chave.filter((item) => {
      const cursoChave = item.chave.slice(0, 3)
      return cursoChave === Curso
    })
    : chave

  //Filtra Turma
  chave = Disciplina !== ''
    ? chave.filter((item) => {
      const turmaChave = item.chave.slice(3, 4)
      return turmaChave === Turma
    })
    : chave

  //Filtra Disciplina
  chave = Disciplina !== ''
    ? chave.filter((item) => {
      const disciplinaChave = item.chave.slice(4, 7)
      return disciplinaChave === Disciplina
    })
    : chave

  //Filtra Avaliacao
  chave = Avaliacao !== ''
    ? chave.filter((item) => {
      const avaliacaoChave = item.chave.slice(7, 11)
      return avaliacaoChave === Avaliacao
    })
    : chave

  return chave
}
