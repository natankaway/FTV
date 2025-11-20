import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatPhone,
  validateEmail,
  validatePhone,
} from '@/utils';

describe('Formatters Utils', () => {
  describe('formatCurrency', () => {
    it('deve formatar números em moeda brasileira', () => {
      expect(formatCurrency(100)).toBe('R$ 100,00');
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
      expect(formatCurrency(0)).toBe('R$ 0,00');
    });

    it('deve lidar com números negativos', () => {
      expect(formatCurrency(-50)).toBe('-R$ 50,00');
    });
  });

  describe('formatPhone', () => {
    it('deve formatar telefone com 10 dígitos', () => {
      expect(formatPhone('1234567890')).toBe('(12) 3456-7890');
    });

    it('deve formatar telefone com 11 dígitos', () => {
      expect(formatPhone('12345678901')).toBe('(12) 34567-8901');
    });

    it('deve remover caracteres não numéricos', () => {
      expect(formatPhone('(12) 34567-8901')).toBe('(12) 34567-8901');
    });
  });

  describe('validateEmail', () => {
    it('deve validar emails corretos', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('deve rejeitar emails incorretos', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('deve validar telefones com 10 ou 11 dígitos', () => {
      expect(validatePhone('1234567890')).toBe(true);
      expect(validatePhone('12345678901')).toBe(true);
    });

    it('deve rejeitar telefones inválidos', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('123456789012')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });

    it('deve aceitar telefones formatados', () => {
      expect(validatePhone('(12) 3456-7890')).toBe(true);
      expect(validatePhone('(12) 34567-8901')).toBe(true);
    });
  });
});
