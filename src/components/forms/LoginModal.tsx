import React, { useState, useCallback, memo } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme, useAppState, useNotifications } from '@/contexts';
import { Input, Button } from '@/components/common';
import { authService } from '@/services/authService';
import type { User } from '@/types';

interface LoginData {
  email: string;
  senha: string;
}

interface LoginErrors {
  email?: string;
  senha?: string;
}

export const LoginModal: React.FC = memo(() => {
  const { isDarkMode } = useTheme();
  const { setUserLogado, dadosMockados } = useAppState();
  const { addNotification } = useNotifications();
  
  const [loginData, setLoginData] = useState<LoginData>({ email: '', senha: '' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = useCallback((): boolean => {
    const newErrors: LoginErrors = {};
    
    if (!loginData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!loginData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [loginData]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { email, senha } = loginData;

      // Chamar API real
      const response = await authService.login({ email, senha });

      // Criar objeto User a partir da resposta
      const user: User = {
        id: response.usuario.id,
        nome: response.usuario.nome,
        email: response.usuario.email,
        perfil: response.usuario.perfil,
        unidade: response.dadosAdicionais?.unidade_id,
        unidades: response.dadosAdicionais?.unidades
      };

      setUserLogado(user);

      addNotification({
        type: 'success',
        title: 'Login realizado',
        message: `Bem-vindo, ${user.nome}!`
      });
    } catch (error: any) {
      console.error('Erro no login:', error);

      const errorMessage = error.response?.data?.message || error.message || 'Credenciais inválidas';

      setErrors({ email: errorMessage });
      addNotification({
        type: 'error',
        title: 'Erro no login',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, [validateForm, loginData, setUserLogado, addNotification]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }, [handleLogin]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({ ...prev, email: e.target.value }));
  }, []);

  const handleSenhaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({ ...prev, senha: e.target.value }));
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
      } rounded-xl p-8 w-full max-w-md`}>
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Sistema de Gestão FTV
          </h2>
          <p className={`${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          } mt-2`}>
            Faça login para continuar
          </p>
        </div>
        
        <div className="space-y-4" onKeyPress={handleKeyPress}>
          <Input
            label="Email"
            type="email"
            value={loginData.email}
            onChange={handleEmailChange}
            error={errors.email}
            required
            autoComplete="email"
            aria-describedby="email-help"
          />
          
          <div className="relative">
            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={loginData.senha}
              onChange={handleSenhaChange}
              error={errors.senha}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <Button
            onClick={handleLogin}
            loading={loading}
            className="w-full"
            aria-describedby="login-help"
          >
            Entrar
          </Button>
        </div>
        
        <div className={`mt-6 p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <p className={`text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-600'
          }`}>
            Dados para teste:
          </p>
          <div className="space-y-1 text-xs">
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-500'}>
              <strong>Admin:</strong> admin@ftv.com / 123456
            </p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-500'}>
              <strong>Professor:</strong> professor@ftv.com / 123456
            </p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-500'}>
              <strong>Aluno:</strong> aluno@ftv.com / 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});