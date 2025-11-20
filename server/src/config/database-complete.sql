-- =====================================================
-- SCRIPT COMPLETO SUPABASE - SISTEMA GESTÃO FTV
-- Versão: 1.0
-- Autor: Sistema FTV
-- Data: 2025
-- =====================================================
--
-- IMPORTANTE: Execute este script completo no SQL Editor do Supabase
-- Tempo estimado de execução: 10-15 segundos
--
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- LIMPAR BANCO (OPCIONAL - USE APENAS EM DESENVOLVIMENTO)
-- =====================================================
-- Descomente as linhas abaixo se quiser limpar o banco antes de recriar

-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
-- GRANT ALL ON SCHEMA public TO postgres;
-- GRANT ALL ON SCHEMA public TO public;

-- =====================================================
-- TABELA: USUÁRIOS BASE
-- =====================================================

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  senha TEXT, -- Hash bcrypt da senha
  perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('admin', 'gestor', 'professor', 'aluno')),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil ON usuarios(perfil);
CREATE INDEX IF NOT EXISTS idx_usuarios_auth_user_id ON usuarios(auth_user_id);

COMMENT ON TABLE usuarios IS 'Tabela base de todos os usuários do sistema';

-- =====================================================
-- TABELA: UNIDADES (criar antes de alunos/professores)
-- =====================================================

CREATE TABLE IF NOT EXISTS unidades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  endereco TEXT,
  telefone VARCHAR(20),
  email VARCHAR(255),
  gestor_id UUID,
  ativa BOOLEAN DEFAULT true,
  horario_funcionamento_inicio TIME,
  horario_funcionamento_fim TIME,
  capacidade_maxima INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_unidades_ativa ON unidades(ativa);

-- =====================================================
-- TABELA: PLANOS
-- =====================================================

CREATE TABLE IF NOT EXISTS planos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  unidade_id UUID REFERENCES unidades(id),
  descricao TEXT,
  beneficios TEXT[],
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: ALUNOS
-- =====================================================

CREATE TABLE IF NOT EXISTS alunos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo_plano VARCHAR(20) NOT NULL CHECK (tipo_plano IN ('mensalidade', 'plataforma', 'experimental')),
  plano_id UUID REFERENCES planos(id),
  plataforma_parceira VARCHAR(255),
  unidade_id UUID REFERENCES unidades(id),
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'pendente', 'inativo')),
  vencimento DATE,
  nivel VARCHAR(20) DEFAULT 'iniciante' CHECK (nivel IN ('iniciante', 'intermediario', 'avancado')),
  data_matricula DATE DEFAULT CURRENT_DATE,
  objetivo TEXT,
  profile_image TEXT,
  nivel_atual VARCHAR(20) DEFAULT 'iniciante',
  data_nivel_atual DATE,
  proxima_avaliacao_nivel DATE,
  status_avaliacao_nivel VARCHAR(30) DEFAULT 'sem_avaliacao' CHECK (status_avaliacao_nivel IN ('sem_avaliacao', 'avaliacao_pendente', 'aprovado', 'reprovado')),
  observacoes_nivel TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alunos_usuario_id ON alunos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_alunos_unidade_id ON alunos(unidade_id);
CREATE INDEX IF NOT EXISTS idx_alunos_status ON alunos(status);

COMMENT ON TABLE alunos IS 'Dados específicos dos alunos';

-- =====================================================
-- TABELA: PROFESSORES
-- =====================================================

CREATE TABLE IF NOT EXISTS professores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo_pagamento VARCHAR(20) NOT NULL CHECK (tipo_pagamento IN ('fixo', 'horas-variaveis', 'hora-fixa')),
  valor_fixo DECIMAL(10, 2),
  valor_hora_fixa DECIMAL(10, 2),
  valor_uma_hora DECIMAL(10, 2),
  valor_duas_horas DECIMAL(10, 2),
  valor_tres_ou_mais_horas DECIMAL(10, 2),
  valor_aulao DECIMAL(10, 2),
  especialidades TEXT[],
  experiencia VARCHAR(10) CHECK (experiencia IN ('1-3', '3-5', '5-10', '10+')),
  unidade_principal_id UUID REFERENCES unidades(id),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS professor_unidades (
  professor_id UUID REFERENCES professores(id) ON DELETE CASCADE,
  unidade_id UUID REFERENCES unidades(id) ON DELETE CASCADE,
  PRIMARY KEY (professor_id, unidade_id)
);

CREATE INDEX IF NOT EXISTS idx_professores_usuario_id ON professores(usuario_id);

COMMENT ON TABLE professores IS 'Dados específicos dos professores';

-- =====================================================
-- TABELA: GESTORES
-- =====================================================

CREATE TABLE IF NOT EXISTS gestores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  cargo VARCHAR(100),
  permissoes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gestor_unidades (
  gestor_id UUID REFERENCES gestores(id) ON DELETE CASCADE,
  unidade_id UUID REFERENCES unidades(id) ON DELETE CASCADE,
  PRIMARY KEY (gestor_id, unidade_id)
);

-- Agora podemos adicionar a FK de gestor_id em unidades
ALTER TABLE unidades
ADD CONSTRAINT fk_unidades_gestor
FOREIGN KEY (gestor_id) REFERENCES gestores(id);

-- =====================================================
-- TABELA: SÓCIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS socios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unidade_id UUID REFERENCES unidades(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  percentual DECIMAL(5, 2) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: PRESENÇAS
-- =====================================================

CREATE TABLE IF NOT EXISTS presencas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  professor_id UUID REFERENCES professores(id),
  data DATE NOT NULL,
  hora TIME NOT NULL,
  unidade_id UUID REFERENCES unidades(id),
  tipo VARCHAR(20) CHECK (tipo IN ('treino', 'aula', 'individual')),
  status VARCHAR(20) DEFAULT 'presente' CHECK (status IN ('presente', 'falta')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_presencas_aluno_id ON presencas(aluno_id);
CREATE INDEX IF NOT EXISTS idx_presencas_data ON presencas(data);
CREATE INDEX IF NOT EXISTS idx_presencas_unidade_id ON presencas(unidade_id);
CREATE INDEX IF NOT EXISTS idx_presencas_aluno_data ON presencas(aluno_id, data DESC);

COMMENT ON TABLE presencas IS 'Registro de presenças dos alunos';

-- =====================================================
-- TABELA: LISTAS DE PRESENÇA
-- =====================================================

CREATE TABLE IF NOT EXISTS listas_presenca (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  unidade_id UUID REFERENCES unidades(id),
  tipo VARCHAR(20) CHECK (tipo IN ('aula-regular', 'aulao')),
  nivel_id UUID,
  capacidade INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'aberta' CHECK (status IN ('aberta', 'confirmada', 'finalizada')),
  horario_fixo_id UUID,
  aulao_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pre_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lista_presenca_id UUID REFERENCES listas_presenca(id) ON DELETE CASCADE,
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  horario_checkin TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelado BOOLEAN DEFAULT false,
  motivo_cancelamento TEXT,
  horario_cancelamento TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS presencas_confirmadas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lista_presenca_id UUID REFERENCES listas_presenca(id) ON DELETE CASCADE,
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  tipo VARCHAR(50) CHECK (tipo IN ('pre-checkin-confirmado', 'adicionado-pelo-professor')),
  status VARCHAR(20) CHECK (status IN ('presente', 'falta')),
  professor_id UUID REFERENCES professores(id),
  horario_confirmacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  observacoes TEXT
);

-- =====================================================
-- TABELA: FINANCEIRO
-- =====================================================

CREATE TABLE IF NOT EXISTS registros_financeiros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID REFERENCES alunos(id),
  professor_id UUID REFERENCES professores(id),
  valor DECIMAL(10, 2) NOT NULL,
  data DATE NOT NULL,
  vencimento DATE,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pago', 'pendente', 'vencido')),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  categoria VARCHAR(100),
  metodo VARCHAR(50),
  descricao TEXT,
  unidade_id UUID REFERENCES unidades(id),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_registros_financeiros_data ON registros_financeiros(data);
CREATE INDEX IF NOT EXISTS idx_registros_financeiros_tipo ON registros_financeiros(tipo);
CREATE INDEX IF NOT EXISTS idx_registros_financeiros_status ON registros_financeiros(status);
CREATE INDEX IF NOT EXISTS idx_registros_financeiros_aluno ON registros_financeiros(aluno_id);

COMMENT ON TABLE registros_financeiros IS 'Controle financeiro de receitas e despesas';

-- =====================================================
-- TABELA: PRODUTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS produtos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  preco_custo DECIMAL(10, 2),
  categoria VARCHAR(100),
  estoque INTEGER DEFAULT 0,
  estoque_minimo INTEGER DEFAULT 0,
  descricao TEXT,
  marca VARCHAR(100),
  fornecedor VARCHAR(255),
  codigo_barras VARCHAR(100),
  unidade_id UUID REFERENCES unidades(id),
  ativo BOOLEAN DEFAULT true,
  imagem TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);

-- =====================================================
-- TABELA: AGENDAMENTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID REFERENCES alunos(id),
  professor_id UUID REFERENCES professores(id) NOT NULL,
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  tipo VARCHAR(20) CHECK (tipo IN ('aula', 'treino', 'avaliacao', 'individual')),
  unidade_id UUID REFERENCES unidades(id),
  status VARCHAR(20) DEFAULT 'confirmado' CHECK (status IN ('confirmado', 'pendente', 'cancelado')),
  observacoes TEXT,
  recorrencia_tipo VARCHAR(20) CHECK (recorrencia_tipo IN ('nenhuma', 'semanal', 'quinzenal', 'mensal')),
  recorrencia_quantidade INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data);
CREATE INDEX IF NOT EXISTS idx_agendamentos_professor_id ON agendamentos(professor_id);

-- =====================================================
-- TABELA: TREINOS
-- =====================================================

CREATE TABLE IF NOT EXISTS treinos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) CHECK (tipo IN ('tecnico', 'fisico', 'tatico', 'jogo')),
  nivel VARCHAR(20) CHECK (nivel IN ('iniciante', 'intermediario', 'avancado')),
  duracao INTEGER,
  objetivo TEXT,
  equipamentos TEXT[],
  observacoes TEXT,
  professor_id UUID REFERENCES professores(id),
  unidade_id UUID REFERENCES unidades(id),
  data DATE,
  status VARCHAR(20) CHECK (status IN ('planejado', 'em-andamento', 'concluido')),
  prancheta_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exercicios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  duracao INTEGER,
  descricao TEXT,
  categoria VARCHAR(50) CHECK (categoria IN ('aquecimento', 'tecnica', 'tatica', 'fisico', 'finalizacao')),
  equipamentos TEXT[],
  nivel VARCHAR(20) CHECK (nivel IN ('iniciante', 'intermediario', 'avancado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS treino_exercicios (
  treino_id UUID REFERENCES treinos(id) ON DELETE CASCADE,
  exercicio_id UUID REFERENCES exercicios(id),
  ordem INTEGER NOT NULL,
  PRIMARY KEY (treino_id, exercicio_id)
);

CREATE INDEX IF NOT EXISTS idx_treinos_professor ON treinos(professor_id);

-- =====================================================
-- TABELA: TORNEIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS torneios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  local VARCHAR(255),
  data_inicio DATE,
  data_fim DATE,
  status VARCHAR(20) DEFAULT 'Inscrições' CHECK (status IN ('Inscrições', 'Sorteio', 'Em andamento', 'Finalizado')),
  criado_por UUID REFERENCES usuarios(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  torneio_id UUID REFERENCES torneios(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  limite_duplas INTEGER,
  formato VARCHAR(20) CHECK (formato IN ('single', 'double')),
  best_of_sf INTEGER CHECK (best_of_sf IN (1, 3)),
  best_of_final INTEGER CHECK (best_of_final IN (1, 3)),
  chaveamento_status VARCHAR(20) DEFAULT 'nao-gerado',
  chaveamento_data JSONB
);

CREATE TABLE IF NOT EXISTS duplas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  nome VARCHAR(255),
  unidade_id UUID REFERENCES unidades(id),
  inscrito_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jogadores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dupla_id UUID REFERENCES duplas(id) ON DELETE CASCADE,
  tipo VARCHAR(20) CHECK (tipo IN ('aluno', 'convidado')),
  aluno_id UUID REFERENCES alunos(id),
  nome VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  fase VARCHAR(10),
  round INTEGER,
  dupla_a_id UUID REFERENCES duplas(id),
  dupla_b_id UUID REFERENCES duplas(id),
  horario TIMESTAMP WITH TIME ZONE,
  placar_a INTEGER,
  placar_b INTEGER,
  scores JSONB,
  vencedor_id UUID REFERENCES duplas(id),
  perdedor_id UUID REFERENCES duplas(id),
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'andamento', 'finalizado'))
);

CREATE INDEX IF NOT EXISTS idx_torneios_status ON torneios(status);

-- =====================================================
-- TABELA: AULAS EXPERIMENTAIS
-- =====================================================

CREATE TABLE IF NOT EXISTS aulas_experimentais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID REFERENCES alunos(id),
  telefone VARCHAR(20),
  email VARCHAR(255),
  data_agendamento TIMESTAMP WITH TIME ZONE,
  status VARCHAR(30) DEFAULT 'agendada' CHECK (status IN ('agendada', 'realizada', 'nao-compareceu', 'convertido', 'inativo')),
  professor_id UUID REFERENCES professores(id),
  unidade_id UUID REFERENCES unidades(id),
  observacoes TEXT,
  data_realizacao TIMESTAMP WITH TIME ZONE,
  data_conversao TIMESTAMP WITH TIME ZONE,
  plano_convertido JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aulas_experimentais_historico (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aula_experimental_id UUID REFERENCES aulas_experimentais(id) ON DELETE CASCADE,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status_anterior VARCHAR(30),
  status_novo VARCHAR(30),
  observacao TEXT,
  usuario_responsavel UUID REFERENCES usuarios(id)
);

-- =====================================================
-- TABELA: REGISTRO DE HORAS PROFESSORES
-- =====================================================

CREATE TABLE IF NOT EXISTS registros_horas_professores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data DATE NOT NULL,
  professor_id UUID REFERENCES professores(id) ON DELETE CASCADE,
  unidade_id UUID REFERENCES unidades(id),
  horas_trabalhadas DECIMAL(5, 2) NOT NULL,
  tipo_atividade VARCHAR(30) CHECK (tipo_atividade IN ('aula-regular', 'aulao', 'administrativo', 'substituicao')),
  observacoes TEXT,
  registrado_por UUID REFERENCES usuarios(id),
  registrado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  editado_por UUID REFERENCES usuarios(id),
  editado_em TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_registros_horas_data ON registros_horas_professores(data);
CREATE INDEX IF NOT EXISTS idx_registros_horas_professor ON registros_horas_professores(professor_id);

-- =====================================================
-- TABELA: AVALIAÇÕES DE NÍVEL
-- =====================================================

CREATE TABLE IF NOT EXISTS avaliacoes_nivel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  nivel_anterior VARCHAR(20),
  nivel_novo VARCHAR(20),
  aprovado BOOLEAN NOT NULL,
  avaliado_por_id UUID REFERENCES usuarios(id),
  perfil_avaliador VARCHAR(20),
  data_avaliacao DATE NOT NULL,
  criterio_tecnica INTEGER CHECK (criterio_tecnica BETWEEN 0 AND 10),
  criterio_tatica INTEGER CHECK (criterio_tatica BETWEEN 0 AND 10),
  criterio_fisico INTEGER CHECK (criterio_fisico BETWEEN 0 AND 10),
  criterio_atitude INTEGER CHECK (criterio_atitude BETWEEN 0 AND 10),
  criterio_frequencia INTEGER CHECK (criterio_frequencia BETWEEN 0 AND 10),
  pontos_fracos TEXT[],
  pontos_fortes TEXT[],
  recomendacoes TEXT,
  observacoes TEXT,
  proxima_avaliacao_sugerida DATE,
  unidade_id UUID REFERENCES unidades(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_aluno ON avaliacoes_nivel(aluno_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_data ON avaliacoes_nivel(data_avaliacao);

-- =====================================================
-- TABELA: EVOLUÇÃO DO ALUNO
-- =====================================================

CREATE TABLE IF NOT EXISTS conquistas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  icone VARCHAR(50),
  tipo VARCHAR(30),
  criterio_meta INTEGER,
  criterio_progresso INTEGER,
  desbloqueada_em TIMESTAMP WITH TIME ZONE,
  vezes INTEGER DEFAULT 1,
  dificuldade VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS objetivos_pessoais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(30),
  meta INTEGER,
  progresso INTEGER DEFAULT 0,
  unidade VARCHAR(50),
  prazo DATE,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'concluido', 'cancelado')),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  concluido_em TIMESTAMP WITH TIME ZONE,
  observacoes TEXT
);

CREATE TABLE IF NOT EXISTS auto_avaliacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  treino_id UUID REFERENCES treinos(id),
  professor_id UUID REFERENCES professores(id),
  data DATE NOT NULL,
  nota INTEGER CHECK (nota BETWEEN 1 AND 5),
  observacoes TEXT,
  pontos_fracos TEXT[],
  pontos_fortes TEXT[],
  foco TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: CONFIGURAÇÕES DO CT
-- =====================================================

CREATE TABLE IF NOT EXISTS config_ct (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_ct VARCHAR(255) NOT NULL,
  email_contato VARCHAR(255),
  telefone_contato VARCHAR(20),
  horario_funcionamento_inicio TIME,
  horario_funcionamento_fim TIME,
  logo_url TEXT,
  permite_checkin_sem_limite BOOLEAN DEFAULT false,
  lembrete_automatico BOOLEAN DEFAULT true,
  horario_lembrete_minutos INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS niveis_aula (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  cor VARCHAR(7),
  ativo BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS horarios_fixos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unidade_id UUID REFERENCES unidades(id),
  dia_semana VARCHAR(20) CHECK (dia_semana IN ('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo')),
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  capacidade INTEGER,
  nivel_id UUID REFERENCES niveis_aula(id),
  ativo BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS auloes_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  unidade_id UUID REFERENCES unidades(id),
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  capacidade INTEGER,
  nivel_id UUID REFERENCES niveis_aula(id),
  valor_especial DECIMAL(10, 2),
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  tipo VARCHAR(30) CHECK (tipo IN ('fixo-recorrente', 'extra-pontual')),
  dia_semana VARCHAR(20),
  data_inicio DATE,
  data_fim DATE,
  data_especifica DATE,
  permite_reposicao BOOLEAN DEFAULT true,
  observacoes TEXT
);

-- =====================================================
-- TABELA: REFRESH TOKENS (JWT)
-- =====================================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_usuario ON refresh_tokens(usuario_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);

COMMENT ON TABLE refresh_tokens IS 'Tokens de refresh para autenticação JWT';

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas relevantes
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name
        FROM information_schema.columns
        WHERE column_name = 'updated_at'
        AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON %I', t, t);
        EXECUTE format('CREATE TRIGGER update_%I_updated_at
                       BEFORE UPDATE ON %I
                       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
    END LOOP;
END;
$$;

-- =====================================================
-- DADOS SEED - CONFIGURAÇÃO INICIAL
-- =====================================================

-- Configuração padrão do CT
INSERT INTO config_ct (nome_ct, email_contato, telefone_contato, permite_checkin_sem_limite, lembrete_automatico, horario_lembrete_minutos)
VALUES ('Centro de Treinamento FTV', 'contato@ftv.com', '(11) 98765-4321', false, true, 60)
ON CONFLICT DO NOTHING;

-- Níveis de aula
INSERT INTO niveis_aula (nome, descricao, cor, ativo) VALUES
  ('Iniciante', 'Nível para alunos iniciantes', '#10B981', true),
  ('Intermediário', 'Nível para alunos intermediários', '#F59E0B', true),
  ('Avançado', 'Nível para alunos avançados', '#EF4444', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- DADOS SEED - UNIDADES
-- =====================================================

INSERT INTO unidades (nome, endereco, telefone, email, ativa, horario_funcionamento_inicio, horario_funcionamento_fim, capacidade_maxima)
VALUES
  ('Unidade Centro', 'Av. Paulista, 1000 - São Paulo/SP', '(11) 3000-1000', 'centro@ftv.com', true, '06:00', '22:00', 50),
  ('Unidade Zona Sul', 'Av. Ibirapuera, 2000 - São Paulo/SP', '(11) 3000-2000', 'zonasul@ftv.com', true, '06:00', '22:00', 40),
  ('Unidade Zona Norte', 'Av. Tucuruvi, 3000 - São Paulo/SP', '(11) 3000-3000', 'zonanorte@ftv.com', true, '06:00', '22:00', 35)
ON CONFLICT DO NOTHING;

-- =====================================================
-- DADOS SEED - USUÁRIOS DE TESTE
-- =====================================================
-- Senha padrão para todos: 123456
-- Hash bcrypt: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkgK7Zu

-- Admin
INSERT INTO usuarios (nome, email, telefone, senha, perfil, ativo)
VALUES ('Administrador FTV', 'admin@ftv.com', '(11) 99000-0001', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkgK7Zu', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Gestor
INSERT INTO usuarios (nome, email, telefone, senha, perfil, ativo)
VALUES ('Carlos Gestor', 'gestor@ftv.com', '(11) 99000-0002', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkgK7Zu', 'gestor', true)
ON CONFLICT (email) DO NOTHING;

-- Professor
INSERT INTO usuarios (nome, email, telefone, senha, perfil, ativo)
VALUES ('João Professor', 'professor@ftv.com', '(11) 99000-0003', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkgK7Zu', 'professor', true)
ON CONFLICT (email) DO NOTHING;

-- Aluno
INSERT INTO usuarios (nome, email, telefone, senha, perfil, ativo)
VALUES ('Maria Aluna', 'aluno@ftv.com', '(11) 99000-0004', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkgK7Zu', 'aluno', true)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- DADOS SEED - PLANOS
-- =====================================================

DO $$
DECLARE
  unidade_centro_id UUID;
BEGIN
  SELECT id INTO unidade_centro_id FROM unidades WHERE nome = 'Unidade Centro' LIMIT 1;

  INSERT INTO planos (nome, preco, unidade_id, descricao, beneficios, ativo)
  VALUES
    ('Mensal Básico', 150.00, unidade_centro_id, 'Plano mensal básico', ARRAY['Acesso às aulas regulares', 'Armário individual'], true),
    ('Mensal Premium', 250.00, unidade_centro_id, 'Plano mensal premium', ARRAY['Acesso às aulas regulares', 'Acesso aos aulões', 'Armário individual', 'Desconto em produtos'], true),
    ('Trimestral', 400.00, unidade_centro_id, 'Plano trimestral', ARRAY['Acesso às aulas regulares', 'Acesso aos aulões', 'Armário individual', '10% desconto'], true)
  ON CONFLICT DO NOTHING;
END $$;

-- =====================================================
-- DADOS SEED - GESTORES, PROFESSORES E ALUNOS
-- =====================================================

DO $$
DECLARE
  user_gestor_id UUID;
  user_professor_id UUID;
  user_aluno_id UUID;
  unidade_centro_id UUID;
  plano_mensal_id UUID;
BEGIN
  -- Buscar IDs
  SELECT id INTO user_gestor_id FROM usuarios WHERE email = 'gestor@ftv.com' LIMIT 1;
  SELECT id INTO user_professor_id FROM usuarios WHERE email = 'professor@ftv.com' LIMIT 1;
  SELECT id INTO user_aluno_id FROM usuarios WHERE email = 'aluno@ftv.com' LIMIT 1;
  SELECT id INTO unidade_centro_id FROM unidades WHERE nome = 'Unidade Centro' LIMIT 1;
  SELECT id INTO plano_mensal_id FROM planos WHERE nome = 'Mensal Básico' LIMIT 1;

  -- Criar Gestor
  INSERT INTO gestores (usuario_id, cargo, permissoes)
  VALUES (user_gestor_id, 'Gerente Geral', ARRAY['gerenciar_alunos', 'gerenciar_professores', 'visualizar_relatorios'])
  ON CONFLICT DO NOTHING;

  -- Associar gestor à unidade
  INSERT INTO gestor_unidades (gestor_id, unidade_id)
  SELECT g.id, unidade_centro_id
  FROM gestores g
  WHERE g.usuario_id = user_gestor_id
  ON CONFLICT DO NOTHING;

  -- Criar Professor
  INSERT INTO professores (usuario_id, tipo_pagamento, valor_hora_fixa, especialidades, experiencia, unidade_principal_id)
  VALUES (user_professor_id, 'hora-fixa', 50.00, ARRAY['Técnica', 'Tática'], '3-5', unidade_centro_id)
  ON CONFLICT DO NOTHING;

  -- Associar professor à unidade
  INSERT INTO professor_unidades (professor_id, unidade_id)
  SELECT p.id, unidade_centro_id
  FROM professores p
  WHERE p.usuario_id = user_professor_id
  ON CONFLICT DO NOTHING;

  -- Criar Aluno
  INSERT INTO alunos (usuario_id, tipo_plano, plano_id, unidade_id, status, vencimento, nivel, data_matricula, objetivo)
  VALUES (user_aluno_id, 'mensalidade', plano_mensal_id, unidade_centro_id, 'ativo', CURRENT_DATE + INTERVAL '30 days', 'iniciante', CURRENT_DATE, 'Melhorar condicionamento físico')
  ON CONFLICT DO NOTHING;
END $$;

-- =====================================================
-- DADOS SEED - PRODUTOS
-- =====================================================

DO $$
DECLARE
  unidade_centro_id UUID;
BEGIN
  SELECT id INTO unidade_centro_id FROM unidades WHERE nome = 'Unidade Centro' LIMIT 1;

  INSERT INTO produtos (nome, preco, preco_custo, categoria, estoque, estoque_minimo, descricao, marca, unidade_id, ativo)
  VALUES
    ('Camisa FTV Oficial', 89.90, 45.00, 'Vestuário', 50, 10, 'Camisa oficial do centro de treinamento', 'FTV Sports', unidade_centro_id, true),
    ('Bola Profissional', 120.00, 65.00, 'Equipamentos', 20, 5, 'Bola profissional de futevôlei', 'Penalty', unidade_centro_id, true),
    ('Squeeze 1L', 25.00, 12.00, 'Acessórios', 100, 20, 'Squeeze para hidratação', 'FTV', unidade_centro_id, true),
    ('Meia Esportiva', 35.00, 18.00, 'Vestuário', 80, 15, 'Meia esportiva antiderrapante', 'Nike', unidade_centro_id, true)
  ON CONFLICT DO NOTHING;
END $$;

-- =====================================================
-- DADOS SEED - EXERCÍCIOS
-- =====================================================

INSERT INTO exercicios (nome, duracao, descricao, categoria, equipamentos, nivel)
VALUES
  ('Aquecimento Articular', 10, 'Aquecimento com foco em articulações', 'aquecimento', ARRAY['Nenhum'], 'iniciante'),
  ('Toque de Manchete', 15, 'Prática de manchete em duplas', 'tecnica', ARRAY['Bola'], 'iniciante'),
  ('Posicionamento em Quadra', 20, 'Trabalho de posicionamento tático', 'tatica', ARRAY['Cones'], 'intermediario'),
  ('Circuito Funcional', 30, 'Treino físico em circuito', 'fisico', ARRAY['Cones', 'Corda', 'Medicine Ball'], 'avancado'),
  ('Jogo Recreativo', 25, 'Jogo recreativo para finalização', 'finalizacao', ARRAY['Bola', 'Rede'], 'iniciante')
ON CONFLICT DO NOTHING;

-- =====================================================
-- MENSAGEM DE SUCESSO
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '
  ============================================================
  ✅ BANCO DE DADOS CRIADO COM SUCESSO!
  ============================================================

  📊 Estatísticas:
  - Tabelas criadas: 30+
  - Índices criados: 20+
  - Triggers: Automáticos para updated_at
  - Dados seed inseridos

  👥 Usuários de teste criados:

  🔴 Admin:
     Email: admin@ftv.com
     Senha: 123456

  🟡 Gestor:
     Email: gestor@ftv.com
     Senha: 123456

  🟢 Professor:
     Email: professor@ftv.com
     Senha: 123456

  🔵 Aluno:
     Email: aluno@ftv.com
     Senha: 123456

  📍 Unidades criadas:
  - Unidade Centro
  - Unidade Zona Sul
  - Unidade Zona Norte

  💰 Planos criados:
  - Mensal Básico (R$ 150)
  - Mensal Premium (R$ 250)
  - Trimestral (R$ 400)

  🛍️ Produtos de exemplo:
  - 4 produtos cadastrados

  🏃 Exercícios de exemplo:
  - 5 exercícios cadastrados

  ⚠️ PRÓXIMOS PASSOS:
  1. Configure as variáveis de ambiente no backend
  2. Teste o login com os usuários acima
  3. ⚠️ IMPORTANTE: Altere as senhas em produção!

  ============================================================
  ';
END $$;
