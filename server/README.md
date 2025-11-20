# Backend - Sistema de Gestão FTV

Backend API RESTful para o Sistema de Gestão de Centro de Treinamento de Futevôlei.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Supabase** - Banco de dados PostgreSQL + Auth
- **JWT** - Autenticação com tokens
- **bcryptjs** - Hash de senhas
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - Logging de requisições
- **Rate Limiter** - Proteção contra ataques

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- npm ou yarn

## ⚙️ Configuração

### 1. Instalar dependências

```bash
cd server
npm install
```

### 2. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em **Settings > API** e copie:
   - Project URL
   - anon/public key
   - service_role key (⚠️ NUNCA exponha essa chave no frontend)

### 3. Criar banco de dados

1. No Supabase, vá em **SQL Editor**
2. Cole todo o conteúdo do arquivo `src/config/database.sql`
3. Execute o script (Run)

Isso criará:
- Todas as tabelas necessárias
- Índices para performance
- Triggers para `updated_at`
- Row Level Security (RLS) policies
- Dados iniciais (seed)

### 4. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` e preencha:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Colar valores do Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui

# Gerar chaves secretas fortes (use: openssl rand -base64 32)
JWT_SECRET=sua-chave-secreta-super-forte-aqui
JWT_REFRESH_SECRET=outra-chave-secreta-diferente-aqui
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_ROUNDS=12
```

⚠️ **IMPORTANTE**: Nunca comite o arquivo `.env` no Git!

## 🏃‍♂️ Executar

### Desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:5000`

### Produção

```bash
npm start
```

### Testes

```bash
npm test
```

## 📡 Endpoints da API

### Autenticação

```
POST   /api/auth/login         - Login do usuário
POST   /api/auth/refresh       - Renovar access token
POST   /api/auth/logout        - Logout
GET    /api/auth/verify        - Verificar token (protegido)
POST   /api/auth/register      - Registrar usuário (admin only)
```

### Alunos

```
GET    /api/alunos             - Listar alunos (com filtros)
GET    /api/alunos/:id         - Buscar aluno por ID
GET    /api/alunos/:id/stats   - Estatísticas do aluno
POST   /api/alunos             - Criar aluno (gestor/admin)
PUT    /api/alunos/:id         - Atualizar aluno (gestor/admin)
DELETE /api/alunos/:id         - Deletar aluno (admin)
```

### Exemplo de requisição

#### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ftv.com",
    "senha": "123456"
  }'
```

Resposta:
```json
{
  "message": "Login realizado com sucesso",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "usuario": {
    "id": "uuid",
    "nome": "Admin",
    "email": "admin@ftv.com",
    "perfil": "admin"
  }
}
```

#### Buscar alunos (com token)

```bash
curl -X GET http://localhost:5000/api/alunos \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) com refresh tokens.

### Fluxo de autenticação:

1. **Login**: Usuário envia email/senha → Recebe `accessToken` (15min) e `refreshToken` (7 dias)
2. **Requests**: Enviar `Authorization: Bearer {accessToken}` em todas as requisições protegidas
3. **Token expirado**: Quando `accessToken` expira, usar `/auth/refresh` com `refreshToken` para obter novos tokens
4. **Logout**: Chamar `/auth/logout` para revogar refresh token

### Hierarquia de permissões:

- **Admin**: Acesso total
- **Gestor**: Gerenciar suas unidades
- **Professor**: Ver alunos, registrar presenças, criar treinos
- **Aluno**: Ver apenas seus próprios dados

## 🗄️ Estrutura do Banco de Dados

Principais tabelas:

- `usuarios` - Base de todos os usuários
- `alunos` - Dados específicos dos alunos
- `professores` - Dados dos professores
- `gestores` - Dados dos gestores
- `unidades` - Unidades/filiais
- `planos` - Planos de pagamento
- `presencas` - Registro de presenças
- `treinos` - Treinos/aulas
- `torneios` - Torneios e chaveamentos
- `registros_financeiros` - Controle financeiro
- `refresh_tokens` - Tokens de refresh JWT

Ver `src/config/database.sql` para schema completo.

## 🛡️ Segurança

- ✅ Rate limiting (100 req/15min por IP)
- ✅ Helmet para headers HTTP seguros
- ✅ CORS configurado
- ✅ Senhas hasheadas com bcrypt (12 rounds)
- ✅ JWT com refresh tokens
- ✅ Validação de inputs
- ✅ SQL injection protection (Supabase/PostgreSQL)
- ✅ Row Level Security (RLS) no Supabase

## 📊 Monitoramento

Health check:
```bash
curl http://localhost:5000/health
```

Resposta:
```json
{
  "status": "OK",
  "timestamp": "2025-01-19T...",
  "uptime": 123.456,
  "environment": "development"
}
```

## 🐛 Debugging

Logs estão habilitados em desenvolvimento via Morgan.

Formato: `METHOD PATH STATUS RESPONSE_TIME`

Exemplo:
```
GET /api/alunos 200 45ms
POST /api/auth/login 401 12ms
```

## 🚀 Deploy

### Opções recomendadas:

1. **Render** (Grátis)
   - Conectar repositório GitHub
   - Configurar variáveis de ambiente
   - Deploy automático

2. **Railway** (Grátis com limites)
   - Similar ao Render
   - Bom para PostgreSQL também

3. **Heroku** (Pago)
   - Plataforma tradicional
   - Fácil integração

### Checklist antes do deploy:

- [ ] Variáveis de ambiente configuradas
- [ ] `NODE_ENV=production`
- [ ] Chaves JWT fortes geradas
- [ ] CORS configurado corretamente
- [ ] Banco de dados Supabase em produção
- [ ] Rate limits ajustados

## 📝 Próximos passos

APIs a serem implementadas:

- [ ] `/api/professores` - CRUD de professores
- [ ] `/api/presencas` - Controle de presenças
- [ ] `/api/treinos` - Gerenciar treinos
- [ ] `/api/torneios` - Sistema de torneios
- [ ] `/api/financeiro` - Controle financeiro
- [ ] `/api/produtos` - Gestão de produtos
- [ ] `/api/agendamentos` - Agendamentos
- [ ] `/api/relatorios` - Relatórios e analytics

## 📄 Licença

MIT
