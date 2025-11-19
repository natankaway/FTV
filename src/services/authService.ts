import api from './api';
import type { User } from '@/types';

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  usuario: User;
  dadosAdicionais?: any;
}

export interface RegisterData {
  nome: string;
  email: string;
  telefone?: string;
  senha: string;
  perfil: 'admin' | 'gestor' | 'professor' | 'aluno';
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);

    // Salvar tokens no localStorage
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.usuario));

    return data;
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar tokens mesmo se a requisição falhar
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const { data } = await api.post('/auth/refresh', { refreshToken });

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    return data.accessToken;
  }

  async verifyToken(): Promise<boolean> {
    try {
      await api.get('/auth/verify');
      return true;
    } catch {
      return false;
    }
  }

  async register(userData: RegisterData): Promise<User> {
    const { data } = await api.post('/auth/register', userData);
    return data.usuario;
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();
export default authService;
