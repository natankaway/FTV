# ⚡ Quick Start - Setup Rápido do Sistema FTV

## 🎯 Objetivo

Colocar o sistema rodando em **15 minutos**.

---

## 📦 1. Pré-requisitos (5 min)

```bash
# Verificar instalação
node --version   # Precisa: v18+
npm --version    # Precisa: v9+
```

Se não tiver, instale: https://nodejs.org

---

## 🗄️ 2. Configurar Supabase (5 min)

### A. Criar conta e projeto

1. Acesse: https://supabase.com
2. Clique "Start your project"
3. Crie conta (use GitHub para ser mais rápido)
4. Click "New Project"
   - Nome: `gestao-ftv`
   - Password: [ANOTE ESSA SENHA!]
   - Region: South America (São Paulo)
5. Aguarde 2-3 minutos

### B. Executar script SQL

1. Menu lateral → **SQL Editor**
2. Click "New query"
3. Copie TODO o conteúdo de: `server/src/config/database-complete.sql`
4. Cole no editor
5. Click **Run** (ou F5)
6. Aguarde ~15 segundos

✅ Deve aparecer: "Success. No rows returned"

### C. Copiar credenciais

1. Menu lateral → **Settings** → **API**
2. Copie:
   - `Project URL`
   - `anon public` (chave pública)
   - `service_role secret` (chave SECRETA)

---

## ⚙️ 3. Configurar Backend (3 min)

```bash
# Na pasta do projeto
cd server
cp .env.example .env
```

Edite `server/.env`:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui

# Gere 2 chaves aleatórias diferentes:
JWT_SECRET=chave-secreta-1
JWT_REFRESH_SECRET=chave-secreta-2
```

Gerar chaves JWT:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32|%{Get-Random -Min 0 -Max 256}))
```

---

## 🚀 4. Instalar e Rodar (2 min)

### Terminal 1 - Backend:

```bash
cd server
npm install
npm run dev
```

Deve aparecer:
```
🏐 Servidor FTV Backend Rodando
Porta: 5000
```

### Terminal 2 - Frontend:

```bash
npm install
npm run dev
```

Deve aparecer:
```
Local: http://localhost:3000
```

---

## ✅ 5. Testar

1. Abra: http://localhost:3000

2. **Login com Admin:**
   ```
   Email: admin@ftv.com
   Senha: 123456
   ```

3. Explore o sistema!

---

## 👥 Usuários de Teste

| Perfil | Email | Senha | Acesso |
|--------|-------|-------|---------|
| 🔴 Admin | admin@ftv.com | 123456 | Total |
| 🟡 Gestor | gestor@ftv.com | 123456 | Gerencial |
| 🟢 Professor | professor@ftv.com | 123456 | Aulas/Treinos |
| 🔵 Aluno | aluno@ftv.com | 123456 | Pessoal |

---

## 🐛 Problemas?

### Backend não inicia

```bash
cd server
rm -rf node_modules
npm install
```

### Frontend não conecta

Verifique `.env` na raiz:
```env
VITE_API_URL=http://localhost:5000/api
```

### Supabase erro

1. Verifique se as 3 credenciais estão corretas
2. Teste a URL no navegador
3. Reexecute o script SQL

---

## 📚 Documentação Completa

- **Setup Detalhado:** `GUIA-SETUP-SUPABASE.md`
- **Backend API:** `server/README.md`
- **Frontend:** `README.md`

---

## 🎉 Pronto!

Sistema rodando em http://localhost:3000

**Próximos passos:**
1. Explore com os usuários de teste
2. Personalize unidades/planos
3. ⚠️ **Mude as senhas em produção!**

---

_Tempo estimado total: 15 minutos_
