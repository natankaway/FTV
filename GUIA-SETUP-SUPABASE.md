# 🚀 GUIA COMPLETO: Configuração do Supabase

## 📋 Índice

1. [Criar Conta no Supabase](#1-criar-conta-no-supabase)
2. [Criar Novo Projeto](#2-criar-novo-projeto)
3. [Executar Script SQL](#3-executar-script-sql)
4. [Verificar Instalação](#4-verificar-instalação)
5. [Copiar Credenciais](#5-copiar-credenciais)
6. [Configurar Backend](#6-configurar-backend)
7. [Testar Conexão](#7-testar-conexão)
8. [Usuários de Teste](#8-usuários-de-teste)
9. [Solução de Problemas](#9-solução-de-problemas)

---

## 1. Criar Conta no Supabase

### Passo 1.1: Acessar o Site

1. Abra seu navegador
2. Acesse: **https://supabase.com**
3. Clique no botão **"Start your project"** ou **"Sign Up"**

### Passo 1.2: Criar Conta

Você pode criar conta usando:

**Opção A: GitHub (Recomendado)**
- Clique em **"Continue with GitHub"**
- Autorize o Supabase a acessar sua conta GitHub
- Pronto! Conta criada.

**Opção B: Email**
- Digite seu email
- Crie uma senha forte
- Confirme o email (verifique sua caixa de entrada)

✅ **Conta criada com sucesso!**

---

## 2. Criar Novo Projeto

### Passo 2.1: Criar Projeto

1. Na tela inicial do Supabase, clique em **"New Project"** ou **"+ Novo Projeto"**

2. Preencha os dados:

   ```
   📝 Nome do Projeto: gestao-ftv
   🔐 Database Password: [Crie uma senha FORTE e SALVE ela!]
   🌍 Region: South America (São Paulo)
   💰 Plan: Free (Grátis)
   ```

   ⚠️ **IMPORTANTE:**
   - **Anote a senha do banco** em um local seguro
   - Você NÃO consegue recuperar essa senha depois
   - Use um gerenciador de senhas (LastPass, 1Password, Bitwarden)

3. Clique em **"Create new project"**

4. **Aguarde 2-3 minutos** enquanto o Supabase provisiona seu banco de dados

   Você verá uma tela com uma barra de progresso:
   ```
   Setting up your project...
   - Provisioning database
   - Setting up auth
   - Preparing storage
   ```

✅ **Projeto criado! Aguarde até aparecer o Dashboard.**

---

## 3. Executar Script SQL

### Passo 3.1: Abrir o SQL Editor

1. No menu lateral esquerdo, clique em **"SQL Editor"** (ícone 📝)

   Se não encontrar, procure por:
   - **Database** → **SQL Editor**
   - Ou use o atalho: **Ctrl/Cmd + K** e digite "SQL"

2. Você verá uma tela parecida com:

   ```
   + New Query
   Quick start
   User Management
   ```

### Passo 3.2: Copiar o Script SQL

1. Abra o arquivo do projeto:
   ```
   server/src/config/database-complete.sql
   ```

2. **Copie TODO o conteúdo** (Ctrl/Cmd + A, depois Ctrl/Cmd + C)

   O arquivo tem aproximadamente **1.000 linhas** e começa assim:
   ```sql
   -- =====================================================
   -- SCRIPT COMPLETO SUPABASE - SISTEMA GESTÃO FTV
   -- =====================================================
   ```

### Passo 3.3: Colar no SQL Editor

1. No SQL Editor do Supabase, clique em **"+ New query"**

2. **Cole TODO o script** no editor (Ctrl/Cmd + V)

3. Verifique se colou corretamente:
   - Deve ter ~1.000 linhas
   - Começa com comentários e `CREATE EXTENSION`
   - Termina com mensagem de sucesso

### Passo 3.4: Executar o Script

1. Clique no botão **"Run"** (ou pressione **F5**)

2. **Aguarde 10-15 segundos** - O script está:
   - Criando 30+ tabelas
   - Criando índices
   - Criando triggers
   - Inserindo dados de teste

3. **Você verá uma das duas mensagens:**

   **✅ SUCESSO:**
   ```
   Success. No rows returned
   ```

   ou mensagens de NOTICE (normal):
   ```
   NOTICE: ✅ BANCO DE DADOS CRIADO COM SUCESSO!
   ...
   ```

   **❌ ERRO:**
   Se aparecer erro vermelho, veja a seção [Solução de Problemas](#9-solução-de-problemas)

✅ **Script executado com sucesso!**

---

## 4. Verificar Instalação

### Passo 4.1: Ver Tabelas Criadas

1. No menu lateral, clique em **"Table Editor"** (ícone 🗂️)

2. Você deve ver a lista de tabelas criadas:

   ```
   ✓ usuarios
   ✓ alunos
   ✓ professores
   ✓ gestores
   ✓ unidades
   ✓ planos
   ✓ presencas
   ✓ produtos
   ✓ treinos
   ✓ torneios
   ... e muitas outras (30+ tabelas)
   ```

### Passo 4.2: Verificar Dados de Teste

1. Clique na tabela **`usuarios`**

2. Você deve ver **4 usuários**:

   | nome | email | perfil |
   |------|-------|--------|
   | Administrador FTV | admin@ftv.com | admin |
   | Carlos Gestor | gestor@ftv.com | gestor |
   | João Professor | professor@ftv.com | professor |
   | Maria Aluna | aluno@ftv.com | aluno |

3. Verifique a tabela **`unidades`** → Deve ter 3 unidades

4. Verifique a tabela **`planos`** → Deve ter 3 planos

5. Verifique a tabela **`produtos`** → Deve ter 4 produtos

✅ **Tudo certo! Dados inseridos com sucesso.**

---

## 5. Copiar Credenciais

### Passo 5.1: Acessar Configurações

1. No menu lateral, clique em **"Settings"** (⚙️ Configurações)

2. Depois clique em **"API"**

### Passo 5.2: Copiar as 3 Chaves

Você verá uma tela com várias informações. Copie:

#### 5.2.1: Project URL

```
URL: https://seu-projeto.supabase.co
```

Copie este link. Exemplo:
```
https://abcdefghijklmnop.supabase.co
```

#### 5.2.2: anon / public key

```
anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Clique no ícone de copiar** 📋 ao lado

Esta chave é PÚBLICA (pode usar no frontend)

#### 5.2.3: service_role key (SECRET)

⚠️ **ATENÇÃO: Esta chave é SECRETA!**

Role a página até encontrar:
```
service_role secret
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Clique no ícone de copiar** 📋

⚠️ **NUNCA exponha essa chave!**
- Não commite no Git
- Não compartilhe
- Use apenas no backend

### Passo 5.3: Salvar as Credenciais

Crie um arquivo temporário e salve:

```
PROJETO: gestao-ftv
URL: https://seu-projeto.supabase.co
ANON KEY: eyJhbGci...
SERVICE ROLE KEY: eyJhbGci...
DATABASE PASSWORD: [sua senha]
```

✅ **Credenciais copiadas!**

---

## 6. Configurar Backend

### Passo 6.1: Abrir o Arquivo .env

1. Navegue até a pasta:
   ```
   cd server
   ```

2. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```

3. Abra o arquivo `.env` no seu editor

### Passo 6.2: Colar as Credenciais

Edite o arquivo `.env` e cole as credenciais do Supabase:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# COLE AQUI AS CREDENCIAIS DO SUPABASE
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Gere chaves secretas fortes (veja abaixo como gerar)
JWT_SECRET=sua-chave-secreta-jwt-aqui
JWT_REFRESH_SECRET=sua-chave-secreta-refresh-aqui
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_ROUNDS=12
```

### Passo 6.3: Gerar Chaves JWT Secretas

**No terminal (Linux/Mac):**
```bash
openssl rand -base64 32
```

Execute 2 vezes para gerar 2 chaves diferentes.

**No Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Online (se não tiver openssl):**
- Acesse: https://www.browserling.com/tools/random-string
- Generate random string de 32 caracteres
- Use apenas letras e números

**Exemplo de .env final:**

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk4NzU0MjAsImV4cCI6MjAwNTQ1MTQyMH0.abc123
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4OTg3NTQyMCwiZXhwIjoyMDA1NDUxNDIwfQ.xyz789

JWT_SECRET=Kj8N3mP9qR2sT5uV7wX0yZ1aB4cD6eF8g
JWT_REFRESH_SECRET=Q9R2sT5uV7wX0yZ1aB4cD6eF8gH3jK5m
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_ROUNDS=12
```

✅ **Backend configurado!**

---

## 7. Testar Conexão

### Passo 7.1: Instalar Dependências

Na pasta `server/`:

```bash
npm install
```

Aguarde a instalação de todos os pacotes.

### Passo 7.2: Iniciar o Servidor

```bash
npm run dev
```

Você deve ver:

```
╔═══════════════════════════════════════╗
║   🏐 Servidor FTV Backend Rodando    ║
║                                       ║
║   Porta: 5000                         ║
║   Ambiente: development               ║
║   URL: http://localhost:5000          ║
║                                       ║
║   Endpoints disponíveis:              ║
║   - GET  /health                      ║
║   - POST /api/auth/login              ║
║   - POST /api/auth/refresh            ║
║   - GET  /api/alunos                  ║
║                                       ║
╚═══════════════════════════════════════╝
```

### Passo 7.3: Testar Health Check

Em outro terminal ou no navegador:

```bash
curl http://localhost:5000/health
```

ou abra no navegador:
```
http://localhost:5000/health
```

Resposta esperada:
```json
{
  "status": "OK",
  "timestamp": "2025-01-19T...",
  "uptime": 5.234,
  "environment": "development"
}
```

✅ **Servidor funcionando!**

### Passo 7.4: Testar Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ftv.com",
    "senha": "123456"
  }'
```

Resposta esperada:
```json
{
  "message": "Login realizado com sucesso",
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "usuario": {
    "id": "uuid-aqui",
    "nome": "Administrador FTV",
    "email": "admin@ftv.com",
    "perfil": "admin"
  }
}
```

✅ **Login funcionando! Tudo certo!**

---

## 8. Usuários de Teste

Os seguintes usuários foram criados automaticamente:

### 🔴 Administrador

```
Email: admin@ftv.com
Senha: 123456
Perfil: admin
Acesso: TOTAL (todas as funcionalidades)
```

### 🟡 Gestor

```
Email: gestor@ftv.com
Senha: 123456
Perfil: gestor
Acesso: Gerenciar unidades, alunos, professores, financeiro
Unidades: Unidade Centro
```

### 🟢 Professor

```
Email: professor@ftv.com
Senha: 123456
Perfil: professor
Acesso: Visualizar alunos, registrar presenças, criar treinos
Unidade: Unidade Centro
Tipo Pagamento: Hora fixa (R$ 50/hora)
```

### 🔵 Aluno

```
Email: aluno@ftv.com
Senha: 123456
Perfil: aluno
Acesso: Ver próprios dados, financeiro, evolução, torneios
Unidade: Unidade Centro
Plano: Mensal Básico (R$ 150)
Vencimento: Daqui 30 dias
```

⚠️ **IMPORTANTE:**
- Esses usuários são para TESTE apenas
- Use senha `123456` para todos
- **MUDE AS SENHAS EM PRODUÇÃO!**

---

## 9. Solução de Problemas

### ❌ Erro: "permission denied for schema public"

**Solução:**

1. Vá em SQL Editor
2. Execute:
```sql
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

---

### ❌ Erro: "relation already exists"

**Causa:** Você já executou o script antes.

**Solução A - Recriar tudo (PERDE DADOS):**

1. No SQL Editor, execute:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

2. Execute o script `database-complete.sql` novamente

**Solução B - Não fazer nada:**

Se as tabelas já existem, está tudo certo!

---

### ❌ Erro: "connect ECONNREFUSED"

**Causa:** URL do Supabase errada ou servidor offline

**Solução:**

1. Verifique se copiou a URL correta
2. Teste a URL no navegador - deve abrir o painel do Supabase
3. Verifique se o projeto está ativo no Supabase

---

### ❌ Erro: "Invalid API key"

**Causa:** Chave ANON ou SERVICE_ROLE errada

**Solução:**

1. Vá em Supabase → Settings → API
2. Copie as chaves novamente
3. Cole no arquivo `.env`
4. Reinicie o servidor

---

### ❌ Erro: "password authentication failed"

**Causa:** Senha do banco incorreta

**Solução:**

O sistema usa JWT, não a senha do banco diretamente. Verifique se:
- As chaves JWT estão configuradas
- O SERVICE_ROLE_KEY está correto

---

### ❌ Erro: "Cannot find module"

**Causa:** Dependências não instaladas

**Solução:**

```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ Frontend não conecta

**Causa:** CORS ou URL da API errada

**Solução:**

1. Verifique o arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=http://localhost:5000/api
```

2. Certifique-se de que o backend está rodando
3. Teste: `curl http://localhost:5000/health`

---

## 📞 Precisa de Ajuda?

1. Verifique os logs do servidor para erros
2. Teste cada endpoint individualmente
3. Verifique se o Supabase está online
4. Certifique-se de que as credenciais estão corretas

---

## ✅ Checklist Final

Antes de continuar, certifique-se:

- [ ] Conta Supabase criada
- [ ] Projeto criado e ativo
- [ ] Script SQL executado sem erros
- [ ] 30+ tabelas visíveis no Table Editor
- [ ] 4 usuários de teste na tabela `usuarios`
- [ ] 3 unidades na tabela `unidades`
- [ ] Credenciais copiadas (URL, ANON, SERVICE_ROLE)
- [ ] Arquivo `.env` configurado no backend
- [ ] Chaves JWT geradas e configuradas
- [ ] `npm install` executado
- [ ] Servidor rodando sem erros
- [ ] `/health` retorna OK
- [ ] Login funciona com admin@ftv.com

---

## 🎉 Parabéns!

Seu banco de dados Supabase está configurado e funcionando!

**Próximos passos:**

1. Teste o login no frontend
2. Explore o sistema com os usuários de teste
3. Personalize unidades e planos
4. **Mude as senhas em produção!**

---

**Feito com ❤️ para o Sistema FTV**

_Última atualização: Janeiro 2025_
