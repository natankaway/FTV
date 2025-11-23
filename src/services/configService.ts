import api from './api';
import type { ConfigSistema } from '@/types';

export interface UpdateConfigData {
  nome_sistema?: string;
  logo_url?: string;
  cor_primaria?: string;
  cor_secundaria?: string;
  timezone?: string;
  moeda?: string;
  formato_data?: string;
  email_suporte?: string;
  telefone_suporte?: string;
  endereco?: string;
  [key: string]: any;
}

class ConfigService {
  async get(): Promise<ConfigSistema> {
    const { data } = await api.get('/config');
    return data.config;
  }

  async update(configData: UpdateConfigData): Promise<ConfigSistema> {
    const { data } = await api.put('/config', configData);
    return data.config;
  }
}

export const configService = new ConfigService();
export default configService;
