-- =====================================================
-- SCHEMA DO BANCO DE DADOS - GESTÃO FTV
-- Supabase PostgreSQL
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELAS DE USUÁRIOS
-- =====================================================

-- Tabela base de usuários (herda do Supabase Auth)
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('admin', 'gestor', 'professor', 'aluno')),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_perfil ON usuarios(perfil);
CREATE INDEX idx_usuarios_auth_user_id ON usuarios(auth_user_id);

-- =====================================================
-- ALUNOS
-- =====================================================

CREATE TABLE alunos (
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

CREATE INDEX idx_alunos_usuario_id ON alunos(usuario_id);
CREATE INDEX idx_alunos_unidade_id ON alunos(unidade_id);
CREATE INDEX idx_alunos_status ON alunos(status);

-- =====================================================
-- PROFESSORES
-- =====================================================

CREATE TABLE professores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo_pagamento VARCHAR(20) NOT NULL CHECK (tipo_pagamento IN ('fixo', 'horas-variaveis', 'hora-fixa')),
  valor_fixo DECIMAL(10, 2),
  valor_hora_fixa DECIMAL(10, 2),
  valor_uma_hora DECIMAL(10, 2),
  valor_duas_horas DECIMAL(10, 2),
  valor_tres_ou_mais_horas DECIMAL(10, 2),
  valor_aulao DECIMAL(10, 2),
  especialidades TEXT[], -- Array de especialidades
  experiencia VARCHAR(10) CHECK (experiencia IN ('1-3', '3-5', '5-10', '10+')),
  unidade_principal_id UUID REFERENCES unidades(id),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relação professor-unidades (muitos para muitos)
CREATE TABLE professor_unidades (
  professor_id UUID REFERENCES professores(id) ON DELETE CASCADE,
  unidade_id UUID REFERENCES unidades(id) ON DELETE CASCADE,
  PRIMARY KEY (professor_id, unidade_id)
);

CREATE INDEX idx_professores_usuario_id ON professores(usuario_id);

-- =====================================================
-- GESTORES
-- =====================================================

CREATE TABLE gestores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  cargo VARCHAR(100),
  permissoes TEXT[], -- Array de permissões
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relação gestor-unidades
CREATE TABLE gestor_unidades (
  gestor_id UUID REFERENCES gestores(id) ON DELETE CASCADE,
  unidade_id UUID REFERENCES unidades(id) ON DELETE CASCADE,
  PRIMARY KEY (gestor_id, unidade_id)
);

-- =====================================================
-- UNIDADES
-- =====================================================

CREATE TABLE unidades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  endereco TEXT,
  telefone VARCHAR(20),
  email VARCHAR(255),
  gestor_id UUID REFERENCES gestores(id),
  ativa BOOLEAN DEFAULT true,
  horario_funcionamento_inicio TIME,
  horario_funcionamento_fim TIME,
  capacidade_maxima INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sócios por unidade
CREATE TABLE socios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unidade_id UUID REFERENCES unidades(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  percentual DECIMAL(5, 2) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_unidades_ativa ON unidades(ativa);

-- =====================================================
-- PLANOS
-- =====================================================

CREATE TABLE planos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  unidade_id UUID REFERENCES unidades(id),
  descricao TEXT,
  beneficios TEXT[], -- Array de benefícios
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PRESENÇAS
-- =====================================================

CREATE TABLE presencas (
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

CREATE INDEX idx_presencas_aluno_id ON presencas(aluno_id);
CREATE INDEX idx_presencas_data ON presencas(data);
CREATE INDEX idx_presencas_unidade_id ON presencas(unidade_id);

-- =====================================================
-- LISTAS DE PRESENÇA
-- =====================================================

CREATE TABLE listas_presenca (
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

-- Pre-checkins
CREATE TABLE pre_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lista_presenca_id UUID REFERENCES listas_presenca(id) ON DELETE CASCADE,
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  horario_checkin TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelado BOOLEAN DEFAULT false,
  motivo_cancelamento TEXT,
  horario_cancelamento TIMESTAMP WITH TIME ZONE
);

-- Presenças confirmadas
CREATE TABLE presencas_confirmadas (
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
-- FINANCEIRO
-- =====================================================

CREATE TABLE registros_financeiros (
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

CREATE INDEX idx_registros_financeiros_data ON registros_financeiros(data);
CREATE INDEX idx_registros_financeiros_tipo ON registros_financeiros(tipo);
CREATE INDEX idx_registros_financeiros_status ON registros_financeiros(status);

-- =====================================================
-- PRODUTOS
-- =====================================================

CREATE TABLE produtos (
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

CREATE INDEX idx_produtos_categoria ON produtos(categoria);
CREATE INDEX idx_produtos_ativo ON produtos(ativo);

-- =====================================================
-- AGENDAMENTOS
-- =====================================================

CREATE TABLE agendamentos (
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

CREATE INDEX idx_agendamentos_data ON agendamentos(data);
CREATE INDEX idx_agendamentos_professor_id ON agendamentos(professor_id);

-- =====================================================
-- TREINOS
-- =====================================================

CREATE TABLE treinos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) CHECK (tipo IN ('tecnico', 'fisico', 'tatico', 'jogo')),
  nivel VARCHAR(20) CHECK (nivel IN ('iniciante', 'intermediario', 'avancado')),
  duracao INTEGER, -- em minutos
  objetivo TEXT,
  equipamentos TEXT[],
  observacoes TEXT,
  professor_id UUID REFERENCES professores(id),
  unidade_id UUID REFERENCES unidades(id),
  data DATE,
  status VARCHAR(20) CHECK (status IN ('planejado', 'em-andamento', 'concluido')),
  prancheta_data JSONB, -- Dados da prancheta tática
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercícios do treino
CREATE TABLE exercicios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  duracao INTEGER,
  descricao TEXT,
  categoria VARCHAR(50) CHECK (categoria IN ('aquecimento', 'tecnica', 'tatica', 'fisico', 'finalizacao')),
  equipamentos TEXT[],
  nivel VARCHAR(20) CHECK (nivel IN ('iniciante', 'intermediario', 'avancado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relação treino-exercícios
CREATE TABLE treino_exercicios (
  treino_id UUID REFERENCES treinos(id) ON DELETE CASCADE,
  exercicio_id UUID REFERENCES exercicios(id),
  ordem INTEGER NOT NULL,
  PRIMARY KEY (treino_id, exercicio_id)
);

-- =====================================================
-- TORNEIOS
-- =====================================================

CREATE TABLE torneios (
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

-- Categorias do torneio
CREATE TABLE categorias (
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

-- Duplas inscritas
CREATE TABLE duplas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  nome VARCHAR(255),
  unidade_id UUID REFERENCES unidades(id),
  inscrito_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jogadores da dupla
CREATE TABLE jogadores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dupla_id UUID REFERENCES duplas(id) ON DELETE CASCADE,
  tipo VARCHAR(20) CHECK (tipo IN ('aluno', 'convidado')),
  aluno_id UUID REFERENCES alunos(id),
  nome VARCHAR(255) NOT NULL
);

-- Partidas do torneio
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  fase VARCHAR(10),
  round INTEGER,
  dupla_a_id UUID REFERENCES duplas(id),
  dupla_b_id UUID REFERENCES duplas(id),
  horario TIMESTAMP WITH TIME ZONE,
  placar_a INTEGER,
  placar_b INTEGER,
  scores JSONB, -- Array de sets
  vencedor_id UUID REFERENCES duplas(id),
  perdedor_id UUID REFERENCES duplas(id),
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'andamento', 'finalizado'))
);

-- =====================================================
-- AULAS EXPERIMENTAIS
-- =====================================================

CREATE TABLE aulas_experimentais (
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

-- Histórico de mudanças de status
CREATE TABLE aulas_experimentais_historico (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aula_experimental_id UUID REFERENCES aulas_experimentais(id) ON DELETE CASCADE,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status_anterior VARCHAR(30),
  status_novo VARCHAR(30),
  observacao TEXT,
  usuario_responsavel UUID REFERENCES usuarios(id)
);

-- =====================================================
-- REGISTRO DE HORAS PROFESSORES
-- =====================================================

CREATE TABLE registros_horas_professores (
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

CREATE INDEX idx_registros_horas_data ON registros_horas_professores(data);
CREATE INDEX idx_registros_horas_professor ON registros_horas_professores(professor_id);

-- =====================================================
-- AVALIAÇÕES DE NÍVEL
-- =====================================================

CREATE TABLE avaliacoes_nivel (
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

CREATE INDEX idx_avaliacoes_aluno ON avaliacoes_nivel(aluno_id);
CREATE INDEX idx_avaliacoes_data ON avaliacoes_nivel(data_avaliacao);

-- =====================================================
-- EVOLUÇÃO DO ALUNO
-- =====================================================

-- Conquistas
CREATE TABLE conquistas (
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

-- Objetivos pessoais
CREATE TABLE objetivos_pessoais (
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

-- Auto-avaliações
CREATE TABLE auto_avaliacoes (
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

-- Estatísticas dos alunos (view materializada para performance)
CREATE MATERIALIZED VIEW estatisticas_alunos AS
SELECT
  a.id as aluno_id,
  a.nivel_atual,
  a.status_avaliacao_nivel,
  a.proxima_avaliacao_nivel,
  COUNT(p.id) FILTER (WHERE p.data >= CURRENT_DATE - INTERVAL '30 days') as presencas_mes,
  COUNT(p.id) FILTER (WHERE p.data >= CURRENT_DATE - INTERVAL '365 days') as presencas_ano,
  COUNT(p.id) as total_presencas
FROM alunos a
LEFT JOIN presencas p ON p.aluno_id = a.id
GROUP BY a.id;

CREATE UNIQUE INDEX idx_estatisticas_alunos_id ON estatisticas_alunos(aluno_id);

-- =====================================================
-- CONFIGURAÇÕES DO CT
-- =====================================================

CREATE TABLE config_ct (
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

-- Níveis de aula
CREATE TABLE niveis_aula (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  cor VARCHAR(7), -- hex color
  ativo BOOLEAN DEFAULT true
);

-- Horários fixos
CREATE TABLE horarios_fixos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unidade_id UUID REFERENCES unidades(id),
  dia_semana VARCHAR(20) CHECK (dia_semana IN ('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo')),
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  capacidade INTEGER,
  nivel_id UUID REFERENCES niveis_aula(id),
  ativo BOOLEAN DEFAULT true
);

-- Aulões configurados
CREATE TABLE auloes_config (
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
-- REFRESH TOKENS (para JWT)
-- =====================================================

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_refresh_tokens_usuario ON refresh_tokens(usuario_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

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

-- Aplicar trigger em todas as tabelas com updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alunos_updated_at BEFORE UPDATE ON alunos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professores_updated_at BEFORE UPDATE ON professores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gestores_updated_at BEFORE UPDATE ON gestores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_unidades_updated_at BEFORE UPDATE ON unidades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_planos_updated_at BEFORE UPDATE ON planos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON produtos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_registros_financeiros_updated_at BEFORE UPDATE ON registros_financeiros FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Políticas de Segurança
-- =====================================================

-- Habilitar RLS em tabelas principais
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE gestores ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários (exemplo)
-- Admin pode ver tudo
CREATE POLICY admin_all ON usuarios FOR ALL USING (
  EXISTS (
    SELECT 1 FROM usuarios u
    WHERE u.auth_user_id = auth.uid()
    AND u.perfil = 'admin'
  )
);

-- Usuário pode ver seus próprios dados
CREATE POLICY user_own_data ON usuarios FOR SELECT USING (
  auth_user_id = auth.uid()
);

-- =====================================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_presencas_aluno_data ON presencas(aluno_id, data DESC);
CREATE INDEX idx_registros_financeiros_aluno ON registros_financeiros(aluno_id);
CREATE INDEX idx_treinos_professor ON treinos(professor_id);
CREATE INDEX idx_torneios_status ON torneios(status);

-- =====================================================
-- DADOS INICIAIS (SEED)
-- =====================================================

-- Inserir configuração padrão do CT
INSERT INTO config_ct (nome_ct, permite_checkin_sem_limite, lembrete_automatico, horario_lembrete_minutos)
VALUES ('Centro de Treinamento FTV', false, true, 60);

-- Inserir níveis de aula padrão
INSERT INTO niveis_aula (nome, descricao, cor, ativo) VALUES
  ('Iniciante', 'Nível para alunos iniciantes', '#10B981', true),
  ('Intermediário', 'Nível para alunos intermediários', '#F59E0B', true),
  ('Avançado', 'Nível para alunos avançados', '#EF4444', true);

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================

COMMENT ON TABLE usuarios IS 'Tabela base de todos os usuários do sistema';
COMMENT ON TABLE alunos IS 'Dados específicos dos alunos';
COMMENT ON TABLE professores IS 'Dados específicos dos professores';
COMMENT ON TABLE presencas IS 'Registro de presenças dos alunos';
COMMENT ON TABLE registros_financeiros IS 'Controle financeiro de receitas e despesas';
COMMENT ON TABLE refresh_tokens IS 'Tokens de refresh para autenticação JWT';
