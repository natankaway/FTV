import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Importar middleware
import { rateLimiterMiddleware } from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Importar rotas
import authRoutes from './routes/authRoutes.js';
import alunosRoutes from './routes/alunosRoutes.js';

// Configuração
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de segurança
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use(rateLimiterMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/alunos', alunosRoutes);

// Adicione mais rotas conforme necessário
// app.use('/api/professores', professoresRoutes);
// app.use('/api/presencas', presencasRoutes);
// app.use('/api/treinos', treinosRoutes);
// etc...

// Middleware de erro 404
app.use(notFound);

// Middleware global de erros
app.use(errorHandler);

// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║   🏐 Servidor FTV Backend Rodando    ║
║                                       ║
║   Porta: ${PORT}                        ║
║   Ambiente: ${process.env.NODE_ENV || 'development'}              ║
║   URL: http://localhost:${PORT}         ║
║                                       ║
║   Endpoints disponíveis:              ║
║   - GET  /health                      ║
║   - POST /api/auth/login              ║
║   - POST /api/auth/refresh            ║
║   - GET  /api/alunos                  ║
║                                       ║
╚═══════════════════════════════════════╝
    `);
  });
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

export default app;
