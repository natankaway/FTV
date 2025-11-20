// Export all services
export { default as api } from './api';
export { authService } from './authService';
export { alunosService } from './alunosService';
export { professoresService } from './professoresService';
export { unidadesService } from './unidadesService';
export { planosService } from './planosService';
export { produtosService } from './produtosService';
export { presencasService } from './presencasService';
export { financeiroService } from './financeiroService';

// Re-export types
export type { LoginCredentials, LoginResponse } from './authService';
export type { CreateAlunoData, UpdateAlunoData, AlunoFilters } from './alunosService';
export type { CreateProfessorData, UpdateProfessorData } from './professoresService';
export type { CreateUnidadeData, UpdateUnidadeData } from './unidadesService';
export type { CreatePlanoData, UpdatePlanoData } from './planosService';
export type { CreateProdutoData, UpdateProdutoData } from './produtosService';
export type { CreatePresencaData, UpdatePresencaData } from './presencasService';
export type { CreateTransacaoData, UpdateTransacaoData, FinanceiroFilters } from './financeiroService';
