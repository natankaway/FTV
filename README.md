# 🏐 Sistema de Gestão FTV

Sistema completo de gestão para Centros de Treinamento de Futevôlei, desenvolvido com React, TypeScript, Node.js e Supabase.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executar o Projeto](#executar-o-projeto)
- [Testes](#testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Deploy](#deploy)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🎯 Sobre o Projeto

Sistema completo para gerenciar centros de treinamento de futevôlei, incluindo:

- Gestão de alunos, professores e gestores
- Controle de presenças com pre-check-in
- Agendamento de aulas e treinos
- Sistema de torneios com chaveamento
- Controle financeiro completo
- Gestão de produtos e estoque
- Sistema de evolução e gamificação
- Avaliação de níveis
- Dashboards personalizados por perfil

## ✨ Funcionalidades

### Gestão de Pessoas
- ✅ Cadastro de alunos com múltiplos tipos de planos
- ✅ Gestão de professores com diferentes formas de pagamento
- ✅ Controle de gestores com permissões por unidade
- ✅ Sistema de perfis (Admin, Gestor, Professor, Aluno)

### Operacional
- ✅ Controle de presenças com sistema de pre-check-in
- ✅ Agendamentos com recorrência
- ✅ Aulas experimentais com funil de conversão
- ✅ Registro de horas dos professores
- ✅ Avaliação de nível dos alunos

### Treinamento
- ✅ Criação de treinos (técnico, tático, físico, jogo)
- ✅ Biblioteca de exercícios
- ✅ Prancheta tática com canvas interativo
- ✅ Sistema de torneios com chaveamento automático
- ✅ Gestão de planos e mensalidades

### Financeiro
- ✅ Controle de receitas e despesas
- ✅ Múltiplos métodos de pagamento
- ✅ Gestão de produtos com controle de estoque
- ✅ Sistema de carrinho de compras
- ✅ Metas financeiras

### Evolução
- ✅ Sistema de conquistas (achievements)
- ✅ Objetivos pessoais
- ✅ Auto-avaliações
- ✅ Estatísticas detalhadas
- ✅ Comparação com outros alunos

### Dashboards
- ✅ Dashboard Admin (visão completa)
- ✅ Dashboard Gestor (métricas por unidade)
- ✅ Dashboard Professor (turmas e alunos)
- ✅ Dashboard Aluno (progresso pessoal)

## 🚀 Tecnologias

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript 5** - Superset JavaScript com tipagem
- **Vite 5** - Build tool ultrarrápido
- **Tailwind CSS 3** - Framework CSS utilitário
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificações
- **Chart.js & Recharts** - Gráficos
- **Lucide React** - Ícones
- **Vitest** - Framework de testes

### Backend
- **Node.js 18+** - Runtime JavaScript
- **Express 4** - Framework web
- **Supabase** - BaaS (PostgreSQL + Auth)
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Helmet** - Segurança HTTP
- **Rate Limiter** - Proteção DDoS

### DevOps & Tools
- **ESLint** - Linter JavaScript/TypeScript
- **PostCSS** - Transformações CSS
- **Git** - Controle de versão

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) v18 ou superior
- [npm](https://www.npmjs.com/) v9 ou superior (vem com Node.js)
- [Git](https://git-scm.com/)
- Conta gratuita no [Supabase](https://supabase.com)

Verificar instalação:

```bash
node --version  # v18.0.0 ou superior
npm --version   # v9.0.0 ou superior
git --version   # qualquer versão recente
```

## 🔧 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/gestao-ftv.git
cd gestao-ftv
```

### 2. Instalar dependências do frontend

```bash
npm install
```

### 3. Instalar dependências do backend

```bash
cd server
npm install
cd ..
```

## ⚙️ Configuração

### 1. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em "New Project"
3. Preencha os dados do projeto
4. Aguarde a criação (2-3 minutos)

### 2. Criar banco de dados

1. No painel do Supabase, vá em **SQL Editor**
2. Abra o arquivo `server/src/config/database.sql` deste projeto
3. Copie **todo** o conteúdo
4. Cole no SQL Editor do Supabase
5. Clique em **Run** (ou F5)

Isso criará todas as tabelas, índices, triggers e dados iniciais.

### 3. Configurar variáveis de ambiente

#### Backend

```bash
cd server
cp .env.example .env
```

Edite `server/.env`:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Copie do Supabase > Settings > API
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

# Gere chaves fortes (use: openssl rand -base64 32)
JWT_SECRET=gere-uma-chave-secreta-forte-aqui
JWT_REFRESH_SECRET=gere-outra-chave-diferente-aqui
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_ROUNDS=12
```

#### Frontend

```bash
# Na raiz do projeto
cp .env.example .env
```

Edite `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃‍♂️ Executar o Projeto

### Desenvolvimento

Você precisa rodar **frontend** e **backend** simultaneamente.

#### Opção 1: Terminais separados (recomendado)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Servidor rodando em `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Aplicação rodando em `http://localhost:3000`

#### Opção 2: Usar concurrently (opcional)

Você pode instalar `concurrently` para rodar ambos em um terminal:

```bash
npm install -g concurrently

# Na raiz do projeto
concurrently "cd server && npm run dev" "npm run dev"
```

### Produção

**Build do frontend:**
```bash
npm run build
```

Arquivos em `dist/`

**Rodar backend:**
```bash
cd server
NODE_ENV=production npm start
```

### Primeiro acesso

Após configurar e rodar, acesse `http://localhost:3000`

**Usuários padrão criados pelo seed:**

```
Admin:
- Email: admin@ftv.com
- Senha: 123456

Gestor:
- Email: gestor@ftv.com
- Senha: 123456

Professor:
- Email: professor@ftv.com
- Senha: 123456

Aluno:
- Email: aluno@ftv.com
- Senha: 123456
```

⚠️ **IMPORTANTE**: Altere essas senhas em produção!

## 🧪 Testes

### Frontend

```bash
# Rodar testes
npm test

# Testes com UI interativa
npm run test:ui

# Testes com cobertura
npm run test:coverage
```

Meta de cobertura: **50%** mínimo

### Backend

```bash
cd server
npm test
```

### Linting

```bash
# Frontend
npm run lint

# TypeScript check
npm run type-check
```

## 📁 Estrutura do Projeto

```
gestao-ftv/
├── server/                    # Backend
│   ├── src/
│   │   ├── config/           # Configurações (Supabase, DB)
│   │   ├── controllers/      # Lógica de negócio
│   │   ├── middleware/       # Middlewares (auth, rate limit)
│   │   ├── routes/           # Rotas da API
│   │   ├── services/         # Serviços
│   │   └── index.js          # Entrada do servidor
│   ├── package.json
│   └── .env
│
├── src/                       # Frontend
│   ├── components/           # Componentes React
│   │   ├── alunos/
│   │   ├── professores/
│   │   ├── dashboard/
│   │   ├── common/           # Componentes reutilizáveis
│   │   └── ...
│   ├── contexts/             # Context API (estado global)
│   ├── hooks/                # Hooks customizados
│   ├── services/             # API services (axios)
│   ├── types/                # TypeScript types
│   ├── utils/                # Funções utilitárias
│   ├── tests/                # Testes
│   ├── App.tsx               # Componente raiz
│   ├── main.tsx              # Entrada da aplicação
│   └── index.css             # CSS global + Tailwind
│
├── public/                    # Assets estáticos
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── vitest.config.ts
└── README.md
```

## 🌐 Deploy

### Frontend (Vercel - Recomendado)

1. Crie conta no [Vercel](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variable: `VITE_API_URL=https://sua-api.com/api`
4. Deploy!

### Backend (Render - Recomendado)

1. Crie conta no [Render](https://render.com)
2. New Web Service → Conecte repositório
3. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Environment Variables: Adicione todas do `.env`
4. Deploy!

### Alternativas

- **Frontend**: Netlify, Cloudflare Pages
- **Backend**: Railway, Heroku, DigitalOcean

## 📊 Métricas do Projeto

- **Linhas de código**: ~10.000
- **Componentes React**: 100+
- **Tipos TypeScript**: 50+
- **APIs REST**: 15+ endpoints
- **Tabelas no banco**: 30+

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Ver arquivo `LICENSE` para mais detalhes.

## 🎯 Roadmap

- [ ] Implementar todas as APIs REST
- [ ] Migração completa de mock data para banco real
- [ ] Notificações em tempo real (WebSockets)
- [ ] PWA (Progressive Web App)
- [ ] Aplicativo mobile (React Native)
- [ ] Relatórios em PDF
- [ ] Integração com gateways de pagamento
- [ ] Sistema de notificações push
- [ ] Dashboard analytics avançado
- [ ] Multi-idiomas (i18n)

## 🙏 Agradecimentos

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Lucide Icons](https://lucide.dev/)

---

⭐ Se este projeto te ajudou, deixe uma estrela!

Feito com ❤️ e ☕