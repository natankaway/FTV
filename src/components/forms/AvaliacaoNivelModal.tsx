// src/components/forms/AvaliacaoNivelModal.tsx
import React, { useState } from 'react';
import { X, Star, TrendingUp, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/components/common';
import { useNotifications } from '@/contexts';

interface AvaliacaoNivelModalProps {
  isOpen: boolean;
  onClose: () => void;
  aluno: {
    id: number;
    nome: string;
    nivelAtual: 'iniciante' | 'intermediario' | 'avancado';
    unidade: string;
  };
  onSave: (avaliacao: any) => void;
}

export const AvaliacaoNivelModal: React.FC<AvaliacaoNivelModalProps> = ({
  isOpen,
  onClose,
  aluno,
  onSave
}) => {
  const { addNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    nivelNovo: aluno.nivelAtual,
    criterios: {
      tecnica: 5,
      tatica: 5,
      fisico: 5,
      atitude: 5,
      frequencia: 5
    },
    pontosFortes: '',
    pontosFracos: '',
    recomendacoes: '',
    observacoes: '',
    proximaAvaliacaoSugerida: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const niveis = [
    { value: 'iniciante', label: 'Iniciante', stars: 1, color: 'text-green-600' },
    { value: 'intermediario', label: 'Intermediário', stars: 2, color: 'text-yellow-600' },
    { value: 'avancado', label: 'Avançado', stars: 3, color: 'text-red-600' }
  ];

  const calcularNotaGeral = () => {
    const { tecnica, tatica, fisico, atitude, frequencia } = formData.criterios;
    return ((tecnica + tatica + fisico + atitude + frequencia) / 5).toFixed(1);
  };

  const isAprovado = () => {
    const indiceAtual = niveis.findIndex(n => n.value === aluno.nivelAtual);
    const indiceNovo = niveis.findIndex(n => n.value === formData.nivelNovo);
    return indiceNovo > indiceAtual;
  };

  const handleCriterioChange = (criterio: string, valor: number) => {
    setFormData({
      ...formData,
      criterios: {
        ...formData.criterios,
        [criterio]: valor
      }
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.pontosFortes.trim()) {
      newErrors.pontosFortes = 'Informe ao menos um ponto forte';
    }
    
    if (!formData.recomendacoes.trim()) {
      newErrors.recomendacoes = 'Adicione recomendações para o aluno';
    }

    const notaGeral = parseFloat(calcularNotaGeral());
    if (isAprovado() && notaGeral < 7.0) {
      newErrors.geral = 'Nota mínima de 7.0 necessária para promoção de nível';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const avaliacao = {
      alunoId: aluno.id,
      aluno: aluno.nome,
      nivelAnterior: aluno.nivelAtual,
      nivelNovo: formData.nivelNovo,
      aprovado: isAprovado(),
      criteriosAvaliados: formData.criterios,
      notaGeral: parseFloat(calcularNotaGeral()),
      pontosFortes: formData.pontosFortes.split('\n').filter(p => p.trim()),
      pontosFracos: formData.pontosFracos.split('\n').filter(p => p.trim()),
      recomendacoes: formData.recomendacoes,
      observacoes: formData.observacoes,
      proximaAvaliacaoSugerida: formData.proximaAvaliacaoSugerida,
      dataAvaliacao: new Date().toISOString(),
      unidade: aluno.unidade
    };

    onSave(avaliacao);
    addNotification({
      type: 'success',
      title: 'Avaliação registrada',
      message: `${aluno.nome} foi ${isAprovado() ? 'promovido' : 'mantido no nível'} com sucesso!`
    });
    onClose();
  };

  const CriterioSlider = ({ nome, label, valor }: { nome: string; label: string; valor: number }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{valor}</span>
          <span className="text-sm text-gray-500">/10</span>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        value={valor}
        onChange={(e) => handleCriterioChange(nome, parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        style={{
          background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${valor * 10}%, #E5E7EB ${valor * 10}%, #E5E7EB 100%)`
        }}
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Insuficiente</span>
        <span>Excelente</span>
      </div>
    </div>
  );

  const notaGeral = parseFloat(calcularNotaGeral());
  const aprovado = isAprovado();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-xl">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold">Avaliação de Nível</h2>
              <p className="text-purple-100">Aluno: {aluno.nome}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Seleção de Nível */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Nível a ser Atribuído
            </label>
            <div className="grid grid-cols-3 gap-4">
              {niveis.map((nivel) => (
                <button
                  key={nivel.value}
                  onClick={() => setFormData({ ...formData, nivelNovo: nivel.value as any })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.nivelNovo === nivel.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}
                >
                  <p className={`font-bold mb-2 capitalize ${nivel.color}`}>{nivel.label}</p>
                  <div className="flex justify-center gap-1">
                    {Array.from({ length: nivel.stars }).map((_, i) => (
                      <Star key={i} className={`h-5 w-5 fill-current ${nivel.color}`} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
            {aluno.nivelAtual !== formData.nivelNovo && (
              <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
                aprovado 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
              }`}>
                <TrendingUp className="h-5 w-5" />
                <p className="text-sm font-medium">
                  {aprovado ? 'Promoção de nível' : 'Manutenção de nível'}
                </p>
              </div>
            )}
          </div>

          {/* Critérios de Avaliação */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Critérios de Avaliação
            </h3>
            <div className="space-y-4">
              <CriterioSlider nome="tecnica" label="Técnica" valor={formData.criterios.tecnica} />
              <CriterioSlider nome="tatica" label="Tática" valor={formData.criterios.tatica} />
              <CriterioSlider nome="fisico" label="Físico" valor={formData.criterios.fisico} />
              <CriterioSlider nome="atitude" label="Atitude" valor={formData.criterios.atitude} />
              <CriterioSlider nome="frequencia" label="Frequência" valor={formData.criterios.frequencia} />
            </div>

            {/* Nota Geral */}
            <div className={`mt-6 p-4 rounded-xl border-2 ${
              notaGeral >= 7 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                : notaGeral >= 5
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                : 'bg-red-50 dark:bg-red-900/20 border-red-500'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white">Nota Geral</span>
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${
                          i < Math.round(notaGeral / 2)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-3xl font-bold ${
                    notaGeral >= 7 ? 'text-green-600' : notaGeral >= 5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {notaGeral}
                  </span>
                  <span className="text-gray-500">/10</span>
                </div>
              </div>
            </div>

            {errors.geral && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-800 dark:text-red-300">{errors.geral}</p>
              </div>
            )}
          </div>

          {/* Pontos Fortes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pontos Fortes *
            </label>
            <textarea
              value={formData.pontosFortes}
              onChange={(e) => setFormData({ ...formData, pontosFortes: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                errors.pontosFortes ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              rows={3}
              placeholder="Liste os pontos fortes (um por linha)"
            />
            {errors.pontosFortes && (
              <p className="mt-1 text-sm text-red-600">{errors.pontosFortes}</p>
            )}
          </div>

          {/* Pontos Fracos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pontos a Melhorar
            </label>
            <textarea
              value={formData.pontosFracos}
              onChange={(e) => setFormData({ ...formData, pontosFracos: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Liste os pontos que precisam melhorar (um por linha)"
            />
          </div>

          {/* Recomendações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recomendações *
            </label>
            <textarea
              value={formData.recomendacoes}
              onChange={(e) => setFormData({ ...formData, recomendacoes: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                errors.recomendacoes ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              rows={3}
              placeholder="O que o aluno deve focar para continuar evoluindo?"
            />
            {errors.recomendacoes && (
              <p className="mt-1 text-sm text-red-600">{errors.recomendacoes}</p>
            )}
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observações Gerais
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              rows={2}
              placeholder="Comentários adicionais (opcional)"
            />
          </div>

          {/* Próxima Avaliação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sugerir Data para Próxima Avaliação
            </label>
            <Input
              type="date"
              value={formData.proximaAvaliacaoSugerida}
              onChange={(e) => setFormData({ ...formData, proximaAvaliacaoSugerida: e.target.value })}
            />
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Registrar Avaliação
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};