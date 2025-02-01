var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  default: () => stdin_default
});
module.exports = __toCommonJS(stdin_exports);
const DbQueryString = `
CREATE TABLE alunos (
  Matricula varchar(8) NOT NULL,
  Curso varchar(3) DEFAULT NULL,
  Turma varchar(1) DEFAULT NULL,
  NumDiario varchar(2) DEFAULT NULL,
  Nome varchar(80) DEFAULT NULL,
  Endereco varchar(80) DEFAULT NULL,
  Complemento varchar(60) DEFAULT NULL,
  Bairro varchar(50) DEFAULT NULL,
  Cidade varchar(50) DEFAULT NULL,
  Estado varchar(2) DEFAULT NULL,
  Cep varchar(8) DEFAULT NULL,
  Fone varchar(15) DEFAULT NULL,
  Celular varchar(15) DEFAULT NULL,
  Sexo varchar(9) DEFAULT NULL,
  Email varchar(80) DEFAULT NULL,
  Rematricula date DEFAULT NULL,
  IR varchar(50) DEFAULT NULL,
  Identidade varchar(20) DEFAULT NULL,
  Nascimento varchar(10) DEFAULT NULL,
  Naturalidade varchar(40) DEFAULT NULL,
  Nacionalidade varchar(11) DEFAULT NULL,
  SenhaInternet varchar(12) DEFAULT NULL,
  PaiNome varchar(80) DEFAULT NULL,
  PaiFone varchar(15) DEFAULT NULL,
  PaiCelular varchar(15) DEFAULT NULL,
  PaiCpf varchar(11) NOT NULL,
  PaiEmail varchar(80) DEFAULT NULL,
  MaeNome varchar(80) DEFAULT NULL,
  MaeFone varchar(15) DEFAULT NULL,
  MaeCelular varchar(15) DEFAULT NULL,
  MaeCpf varchar(11) NOT NULL,
  MaeEmail varchar(80) DEFAULT NULL,
  ResponsavelNome varchar(80) DEFAULT NULL,
  ResponsavelEndereco varchar(80) DEFAULT NULL,
  ResponsavelComplemento varchar(60) DEFAULT NULL,
  ResponsavelBairro varchar(50) DEFAULT NULL,
  ResponsavelCidade varchar(40) DEFAULT NULL,
  ResponsavelEstado varchar(2) DEFAULT NULL,
  ResponsavelCep varchar(8) DEFAULT NULL,
  ResponsavelCPF varchar(14) DEFAULT NULL,
  ResponsavelFone varchar(15) DEFAULT NULL,
  ResponsavelCelular varchar(15) DEFAULT NULL,
  ResponsavelEmail varchar(80) DEFAULT NULL,
  Situacao varchar(30) DEFAULT NULL
);
CREATE TABLE AlunosOptativas (
  id int(11) NOT NULL,
  Matricula varchar(8) NOT NULL,
  Disciplina varchar(3) NOT NULL
);
CREATE TABLE avaliacoes (
  Sistema varchar(2) NOT NULL,
  Codigo varchar(4) NOT NULL,
  Avaliacao varchar(40) DEFAULT NULL,
  Abreviatura varchar(5) DEFAULT NULL,
  Ordem tinyint(3) UNSIGNED DEFAULT '0',
  Digitar tinyint(1) DEFAULT NULL,
  Entrega datetime DEFAULT NULL
);
CREATE TABLE bloqueio_app (
  id int(11) NOT NULL,
  inicio date NOT NULL,
  fim date NOT NULL,
  curso varchar(3) NOT NULL,
  usuario varchar(3) NOT NULL
);
CREATE TABLE bnccCod_app (
  id int(11) NOT NULL,
  codigo varchar(10) NOT NULL,
  descricao varchar(100) NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE canais_chat (
  id int(3) UNSIGNED ZEROFILL NOT NULL,
  nome char(50) NOT NULL,
  usuarios_permitidos varchar(255) DEFAULT NULL,
  desativado tinyint(1) NOT NULL DEFAULT '0'
);
CREATE TABLE comunicado_app (
  id_noticia int(11) NOT NULL,
  matricula varchar(8) NOT NULL,
  cpf_responsavel varchar(14) NOT NULL,
  permitido tinyint(1) NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE conceitos_app (
  id int(11) NOT NULL,
  data_lanc datetime DEFAULT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NOT NULL,
  matricula varchar(8) NOT NULL,
  chave char(21) NOT NULL,
  auxiliar_01 float DEFAULT NULL,
  auxiliar_02 float DEFAULT NULL,
  auxiliar_03 float DEFAULT NULL,
  auxiliar_04 float DEFAULT NULL,
  auxiliar_05 float DEFAULT NULL,
  auxiliar_06 float DEFAULT NULL,
  auxiliar_07 float DEFAULT NULL,
  auxiliar_08 float DEFAULT NULL,
  auxiliar_09 float DEFAULT NULL,
  auxiliar_10 float DEFAULT NULL,
  nota varchar(2) DEFAULT NULL,
  conceito varchar(4) NOT NULL,
  falta int(3) DEFAULT NULL,
  etapa int(11) DEFAULT NULL,
  baixado tinyint(1) NOT NULL
);
CREATE TABLE Config (
  id int(11) NOT NULL,
  Ano int(11) NOT NULL,
  Status varchar(8) NOT NULL,
  Nota_Conceito tinyint(1) NOT NULL,
  ExcluirDados tinyint(1) NOT NULL,
  decimais_nota int(11) NOT NULL,
  bloqueio_notas tinyint(1) NOT NULL,
  bloqueio_diario tinyint(1) NOT NULL,
  bloqueio_diario_dias int(3) NOT NULL
);


CREATE TABLE conteudoProg_app (
  id int(11) NOT NULL,
  curso varchar(3) NOT NULL,
  disciplina varchar(3) NOT NULL,
  conteudo varchar(100) NOT NULL,
  bncc varchar(20) NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE conteudo_app (
  id int(11) NOT NULL,
  data date DEFAULT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  curso_id varchar(3) DEFAULT NULL,
  disciplina_id varchar(3) DEFAULT NULL,
  turma_id varchar(3) DEFAULT NULL,
  descricao varchar(255) DEFAULT NULL,
  atividade_aula mediumtext,
  atividade_casa mediumtext,
  aulas int(1) NOT NULL,
  etapa int(11) DEFAULT NULL,
  bloqueado tinyint(1) NOT NULL,
  codProfessor varchar(4) NOT NULL
);
CREATE TABLE controle_app (
  id int(11) NOT NULL COMMENT '* Tabela de uso APP
',
  etapa varchar(4) DEFAULT NULL,
  curso_id varchar(3) DEFAULT NULL,
  disciplina_id varchar(3) DEFAULT NULL,
  turma_id varchar(3) DEFAULT NULL,
  descricao varchar(255) DEFAULT NULL,
  inicio date NOT NULL,
  termino date NOT NULL
);
CREATE TABLE controle_noticias (
  matricula varchar(8) NOT NULL,
  id_noticia int(11) NOT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  aluno tinyint(1) NOT NULL,
  filiacao tinyint(1) NOT NULL,
  respFinanceiro tinyint(1) NOT NULL,
  respPedagogico tinyint(1) NOT NULL,
  lidoAluno tinyint(1) NOT NULL,
  lidoRespFin tinyint(1) NOT NULL,
  lidoRespPedi tinyint(1) NOT NULL,
  lidoFil tinyint(1) NOT NULL
);
CREATE TABLE cursos (
  Codigo varchar(3) NOT NULL,
  Curso varchar(40) DEFAULT NULL,
  NotaBaixa varchar(3) DEFAULT NULL,
  Sistema varchar(2) DEFAULT NULL,
  TipoDados varchar(1) DEFAULT NULL,
  Anuidade float NOT NULL
);
CREATE TABLE Desligados (
  Matricula varchar(8) NOT NULL,
  Data date NOT NULL,
  Sequencia int(11) NOT NULL,
  Nome varchar(80) NOT NULL,
  Curso varchar(3) NOT NULL,
  Turma varchar(1) NOT NULL,
  Tipo varchar(1) NOT NULL,
  Motivo varchar(1) NOT NULL,
  Destino varchar(60) NOT NULL
);
CREATE TABLE diario_app (
  id int(11) NOT NULL,
  matricula varchar(8) DEFAULT NULL,
  disciplina_id varchar(3) DEFAULT NULL,
  data date DEFAULT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  etapa int(11) DEFAULT NULL,
  faltas int(11) NOT NULL,
  codProfessor varchar(4) NOT NULL
);
CREATE TABLE digitacao (
  Codigo int(11) NOT NULL,
  CodFuncionario varchar(4) DEFAULT NULL,
  CodDisciplina varchar(3) DEFAULT NULL,
  CodCurso varchar(3) DEFAULT NULL,
  Turma varchar(1) DEFAULT NULL,
  Auxiliar varchar(10) DEFAULT NULL,
  Lanca tinyint(1) NOT NULL
);
CREATE TABLE disciplinas (
  Codigo varchar(3) NOT NULL,
  Disciplina varchar(40) DEFAULT NULL,
  Apelido varchar(20) DEFAULT NULL
);
CREATE TABLE empresa (
  Nome varchar(50) NOT NULL,
  Endereco varchar(50) DEFAULT NULL,
  Bairro varchar(20) DEFAULT NULL,
  Cidade varchar(30) DEFAULT NULL,
  Estado varchar(2) DEFAULT NULL,
  CEP varchar(9) DEFAULT NULL,
  CGC varchar(18) DEFAULT NULL,
  Telefones varchar(50) DEFAULT NULL,
  EIautorizacao varchar(50) DEFAULT NULL,
  EIreconhecimento varchar(50) DEFAULT NULL,
  EFautorizacao varchar(50) DEFAULT NULL,
  EFreconhecimento varchar(50) DEFAULT NULL,
  EMautorizacao varchar(50) DEFAULT NULL,
  EMreconhecimento varchar(50) DEFAULT NULL,
  Cursos varchar(100) DEFAULT NULL,
  PastaFTP varchar(8) DEFAULT NULL
)


CREATE TABLE funcionarios (
  Codigo varchar(4) NOT NULL,
  Funcionario varchar(60) DEFAULT NULL,
  Apelido varchar(20) DEFAULT NULL,
  Digita mediumtext,
  Polivalente tinyint(1) DEFAULT NULL
)


CREATE TABLE Grades (
  id int(11) NOT NULL,
  Curso varchar(5) DEFAULT NULL,
  Disciplina varchar(10) DEFAULT NULL,
  TipoAvaliacao varchar(13) DEFAULT NULL
)


CREATE TABLE GradesQua (
  Curso varchar(3) NOT NULL,
  Codigo varchar(3) NOT NULL,
  Nivel tinyint(4) NOT NULL,
  Grupo tinyint(4) NOT NULL,
  SubGrupo tinyint(4) NOT NULL
)


CREATE TABLE instancias_chat (
  chat_id varchar(36) NOT NULL,
  canal_id int(4) NOT NULL DEFAULT '0',
  matricula varchar(8) NOT NULL,
  responsavel tinyint(1) NOT NULL,
  responsavel_id varchar(11) NOT NULL DEFAULT '',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atendente_id int(11) DEFAULT NULL,
  finalizado varchar(19) DEFAULT '0',
  iniciado varchar(19) DEFAULT '0',
  status varchar(13) NOT NULL DEFAULT 'Novo'
)


CREATE TABLE Mensagens (
  Registro int(11) NOT NULL,
  Usuario varchar(80) NOT NULL,
  Tipo varchar(20) NOT NULL,
  Sumario varchar(100) NOT NULL,
  Resposta varchar(20) NOT NULL,
  Destinatario varchar(15) NOT NULL,
  Mensagem text NOT NULL
)


CREATE TABLE mensagens_chat (
  id int(11) NOT NULL,
  chat_id varchar(36) NOT NULL,
  data datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  responsavel_id varchar(11) NOT NULL DEFAULT '',
  atendente_id int(11) NOT NULL DEFAULT '0',
  tipo_remetente varchar(11) NOT NULL,
  mensagem text NOT NULL,
  lida_responsavel tinyint(1) NOT NULL DEFAULT '0',
  lida_atendente_id int(11) NOT NULL DEFAULT '0'
)


CREATE TABLE mensagens_chat_copy (
  id int(11) NOT NULL,
  chat_id varchar(36) NOT NULL,
  data datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  remetente varchar(250) NOT NULL,
  mensagem text
)


CREATE TABLE NotasAuxLeg (
  id int(11) NOT NULL,
  Chave varchar(11) DEFAULT NULL,
  Leg01 varchar(4) DEFAULT NULL,
  Leg02 varchar(4) DEFAULT NULL,
  Leg03 varchar(4) DEFAULT NULL,
  Leg04 varchar(4) DEFAULT NULL,
  Leg05 varchar(4) DEFAULT NULL,
  Leg06 varchar(4) DEFAULT NULL,
  Leg07 varchar(4) DEFAULT NULL,
  Leg08 varchar(10) DEFAULT NULL,
  Leg09 varchar(10) DEFAULT NULL,
  Leg10 varchar(10) DEFAULT NULL
)


CREATE TABLE NotasQua (
  Matricula varchar(8) NOT NULL,
  Codigo varchar(3) NOT NULL,
  Ordem int(11) NOT NULL,
  Nota01 varchar(4) NOT NULL,
  Nota02 varchar(4) NOT NULL,
  Nota03 varchar(4) NOT NULL,
  Nota04 varchar(4) NOT NULL,
  Nota05 varchar(4) NOT NULL,
  Nota06 varchar(4) NOT NULL,
  Nota07 varchar(4) NOT NULL,
  Nota08 varchar(4) NOT NULL
)


CREATE TABLE notas_app (
  id int(11) NOT NULL,
  data_lanc datetime DEFAULT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  matricula varchar(8) NOT NULL,
  chave char(21) NOT NULL,
  auxiliar_01 float DEFAULT NULL,
  auxiliar_02 float DEFAULT NULL,
  auxiliar_03 float DEFAULT NULL,
  auxiliar_04 float DEFAULT NULL,
  auxiliar_05 float DEFAULT NULL,
  auxiliar_06 float DEFAULT NULL,
  auxiliar_07 float DEFAULT NULL,
  auxiliar_08 float DEFAULT NULL,
  auxiliar_09 float DEFAULT NULL,
  auxiliar_10 float DEFAULT NULL,
  nota float DEFAULT NULL,
  conceito varchar(4) NOT NULL,
  falta int(3) DEFAULT NULL,
  etapa int(11) DEFAULT NULL,
  baixado tinyint(1) NOT NULL
)


CREATE TABLE noticias (
  id_noticias int(11) NOT NULL,
  titulo varchar(50) NOT NULL,
  resumo tinytext NOT NULL,
  texto text NOT NULL,
  created_by varchar(3) NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  tipo varchar(2) NOT NULL,
  thumb json NOT NULL,
  comunicado tinyint(1) NOT NULL
)


CREATE TABLE observacao (
  chave varchar(21) NOT NULL,
  matricula varchar(8) NOT NULL,
  observacao text NOT NULL
)


CREATE TABLE observacoes_app (
  data_lanc datetime DEFAULT CURRENT_TIMESTAMP,
  update_at datetime DEFAULT NULL,
  chave varchar(21) NOT NULL,
  matricula varchar(8) NOT NULL,
  observacao text NOT NULL,
  baixado tinyint(1) DEFAULT NULL
)


CREATE TABLE ocorrencias (
  Matricula varchar(8) NOT NULL,
  Data datetime NOT NULL,
  Numero int(11) NOT NULL,
  Descricao varchar(60) DEFAULT NULL,
  Tipo varchar(1) DEFAULT NULL
)


CREATE TABLE pagamentos (
  Chave varchar(15) NOT NULL,
  Matricula varchar(8) DEFAULT NULL,
  Parcela tinyint(3) UNSIGNED DEFAULT '0',
  tipo varchar(10) NOT NULL,
  Descricao varchar(65) DEFAULT NULL,
  Vencimento datetime DEFAULT NULL,
  Valor float DEFAULT '0',
  Desconto float DEFAULT '0',
  Acrescimo float DEFAULT '0',
  ValorPago float DEFAULT '0',
  DataPagto datetime DEFAULT NULL,
  Titulo varchar(25) DEFAULT NULL,
  TipoLanc varchar(1) DEFAULT NULL,
  Bacen varchar(5) DEFAULT NULL,
  CodBarras varchar(70) DEFAULT NULL,
  Quitado tinyint(1) DEFAULT NULL,
  desligado tinyint(1) NOT NULL
)


CREATE TABLE Qualitativas (
  Codigo varchar(3) NOT NULL,
  Descricao varchar(100) NOT NULL,
  Destaque tinyint(1) NOT NULL,
  Dados tinyint(1) NOT NULL
)


CREATE TABLE qualitativas_app (
  id int(11) NOT NULL,
  data_lanc datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at datetime NOT NULL,
  matricula varchar(8) NOT NULL,
  chave varchar(21) NOT NULL,
  disciplina varchar(10) NOT NULL,
  nota float DEFAULT NULL,
  conceito varchar(4) NOT NULL,
  falta int(3) DEFAULT NULL,
  etapa int(11) DEFAULT NULL,
  baixado tinyint(4) DEFAULT NULL
)


CREATE TABLE responsaveis (
  id int(11) NOT NULL,
  nome varchar(80) NOT NULL,
  cpf varchar(11) NOT NULL,
  fone varchar(15) NOT NULL,
  celular varchar(15) NOT NULL,
  email varchar(80) NOT NULL,
  matricula varchar(8) NOT NULL,
  filiacao tinyint(1) NOT NULL,
  genero varchar(1) NOT NULL,
  respFinanceiro tinyint(1) NOT NULL,
  respPedagogico tinyint(1) NOT NULL,
  senha varchar(20) NOT NULL
)


CREATE TABLE solicitacoes_app (
  id int(11) NOT NULL,
  matricula varchar(8) NOT NULL,
  responsavel_cpf varchar(11) NOT NULL,
  tipo int(3) NOT NULL,
  solicitacao varchar(300) NOT NULL,
  resposta varchar(300) DEFAULT NULL,
  tag int(3) DEFAULT '1',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP
)


CREATE TABLE solicitatag_app (
  id int(3) NOT NULL,
  tag varchar(20) NOT NULL,
  cor varchar(7) NOT NULL
)


CREATE TABLE solicitatipo_app (
  id int(3) NOT NULL,
  descricao varchar(50) NOT NULL
)


CREATE TABLE tiposlanc (
  Codigo varchar(1) NOT NULL,
  Tipo varchar(20) DEFAULT NULL
)


CREATE TABLE tiposocorr (
  Codigo varchar(1) NOT NULL,
  Tipo varchar(20) DEFAULT NULL
)


CREATE TABLE turmas (
  Curso varchar(3) NOT NULL,
  Turma varchar(1) NOT NULL,
  Turno varchar(8) DEFAULT NULL
)


CREATE TABLE Usuarios (
  Id int(11) NOT NULL,
  Nome varchar(225) NOT NULL,
  Senha varchar(25) NOT NULL,
  Admin tinyint(1) DEFAULT NULL,
  Status varchar(10) NOT NULL,
  Cursos varchar(255) NOT NULL
)


ALTER TABLE alunos
  ADD PRIMARY KEY (Matricula),
  ADD KEY Identidade (Identidade);

ALTER TABLE AlunosOptativas
  ADD PRIMARY KEY (id);

ALTER TABLE avaliacoes
  ADD PRIMARY KEY (Sistema,Codigo),
  ADD KEY Avaliacao (Avaliacao);

ALTER TABLE bloqueio_app
  ADD PRIMARY KEY (id);

ALTER TABLE bnccCod_app
  ADD PRIMARY KEY (id);

ALTER TABLE canais_chat
  ADD PRIMARY KEY (id) USING BTREE;

ALTER TABLE comunicado_app
  ADD PRIMARY KEY (id_noticia,matricula);

ALTER TABLE conceitos_app
  ADD PRIMARY KEY (matricula,chave),
  ADD KEY new_index (id,matricula,chave) USING BTREE;

ALTER TABLE Config
  ADD PRIMARY KEY (id);

ALTER TABLE conteudoProg_app
  ADD PRIMARY KEY (id);

ALTER TABLE conteudo_app
  ADD PRIMARY KEY (id);

ALTER TABLE controle_app
  ADD PRIMARY KEY (id);

ALTER TABLE controle_noticias
  ADD PRIMARY KEY (matricula,id_noticia);

ALTER TABLE cursos
  ADD PRIMARY KEY (Codigo),
  ADD KEY Curso (Curso);

ALTER TABLE Desligados
  ADD PRIMARY KEY (Sequencia);

ALTER TABLE diario_app
  ADD PRIMARY KEY (id);

ALTER TABLE digitacao
  ADD PRIMARY KEY (Codigo);

ALTER TABLE disciplinas
  ADD PRIMARY KEY (Codigo);

ALTER TABLE empresa
  ADD PRIMARY KEY (Nome);

ALTER TABLE funcionarios
  ADD PRIMARY KEY (Codigo);

ALTER TABLE Grades
  ADD PRIMARY KEY (id);

ALTER TABLE GradesQua
  ADD PRIMARY KEY (Curso,Codigo);

ALTER TABLE instancias_chat
  ADD PRIMARY KEY (chat_id);

ALTER TABLE Mensagens
  ADD PRIMARY KEY (Registro);

ALTER TABLE mensagens_chat
  ADD PRIMARY KEY (id);

ALTER TABLE mensagens_chat_copy
  ADD PRIMARY KEY (id) USING BTREE;

ALTER TABLE NotasAuxLeg
  ADD PRIMARY KEY (id);

ALTER TABLE NotasQua
  ADD PRIMARY KEY (Matricula,Codigo);

ALTER TABLE notas_app
  ADD PRIMARY KEY (matricula,chave),
  ADD UNIQUE KEY id (id) USING BTREE;

ALTER TABLE noticias
  ADD PRIMARY KEY (id_noticias);

ALTER TABLE observacao
  ADD PRIMARY KEY (chave,matricula);

ALTER TABLE observacoes_app
  ADD PRIMARY KEY (chave,matricula);

ALTER TABLE ocorrencias
  ADD PRIMARY KEY (Matricula,Data,Numero);

ALTER TABLE pagamentos
  ADD PRIMARY KEY (Chave);

ALTER TABLE Qualitativas
  ADD PRIMARY KEY (Codigo);

ALTER TABLE qualitativas_app
  ADD PRIMARY KEY (matricula,chave,disciplina),
  ADD UNIQUE KEY id (id);

ALTER TABLE responsaveis
  ADD PRIMARY KEY (id),
  ADD KEY id (id,cpf,matricula) USING BTREE;


ALTER TABLE solicitacoes_app
  ADD PRIMARY KEY (id);

ALTER TABLE solicitatag_app
  ADD PRIMARY KEY (id);

ALTER TABLE solicitatipo_app
  ADD PRIMARY KEY (id);

ALTER TABLE tiposlanc
  ADD PRIMARY KEY (Codigo);

ALTER TABLE tiposocorr
  ADD PRIMARY KEY (Codigo);

ALTER TABLE turmas
  ADD PRIMARY KEY (Curso,Turma);

ALTER TABLE Usuarios
  ADD PRIMARY KEY (Id);

ALTER TABLE AlunosOptativas
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE bloqueio_app
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE bnccCod_app
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE canais_chat
  MODIFY id int(3) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT;

ALTER TABLE conceitos_app
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE Config
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE conteudoProg_app
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE conteudo_app
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE controle_app
  MODIFY id int(11) NOT NULL AUTO_INCREMENT COMMENT '* Tabela de uso APP
';

ALTER TABLE diario_app
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE digitacao
  MODIFY Codigo int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE Grades
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE mensagens_chat
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE mensagens_chat_copy
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE NotasAuxLeg
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE notas_app
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE noticias
  MODIFY id_noticias int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE ocorrencias
  MODIFY Numero int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE qualitativas_app
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE responsaveis
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE solicitacoes_app
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE solicitatag_app
  MODIFY id int(3) NOT NULL AUTO_INCREMENT;

ALTER TABLE solicitatipo_app
  MODIFY id int(3) NOT NULL AUTO_INCREMENT;

ALTER TABLE Usuarios
  MODIFY Id int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
`;
var stdin_default = DbQueryString;
