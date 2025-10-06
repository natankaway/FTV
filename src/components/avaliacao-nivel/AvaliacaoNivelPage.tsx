// src/components/avaliacao-nivel/AvaliacaoNivelPage.tsx
// TELA PARA PROFESSORES E GESTORES AVALIAREM ALUNOS

import React, { useState } from 'react';
import { Star, Award, TrendingUp, Calendar, User, CheckCircle, XCircle, Edit2, Clock } from 'lucide-react';
import { Button } from '@/components/common';
import { useAppState } from '@/contexts';

export const AvaliacaoNivelPage: React.FC = () => {
  const { userLogado } = useAppState();
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pendentes' | 'avaliados'>('pendentes');

  // Mock data - em produção viria do backend
  const avaliacoes = {
    pendentes: [
      {
        id: 1,
        alunoId: 1,
        aluno: 'João Silva',
        nivelAtual: 'iniciante' as const,
        nivelSugerido: 'intermediario' as const,
        tempoNivelAtual: 2, // meses
        frequencia: 92,
        horasTreinadas: 45,
        ultimaAvaliacao: null,
        dataSugerida: '15/07/2025',
        unidade: 'Centro'
      },
      {
        id: 2,
        alunoId: 3,
        aluno: 'Carlos Lima',
        nivelAtual: 'intermediario' as const,
        nivelSugerido: 'avancado' as const,
        tempoNivelAtual: 6,
        frequencia: 88,
        horasTreinadas: 120,
        ultimaAvaliacao: '15/01/2024',
        dataSugerida: '20/07/2025',
        unidade: 'Centro'
      }
    ],
    avaliados: [
      {
        id: 3,
        alunoId: 2,
        aluno: 'Maria Santos',
        nivelAnterior: 'iniciante' as const,
        nivelNovo: 'intermediario' as const,
        aprovado: true,
        avaliadoPor: 'Carlos Mendes',
        dataAvaliacao: '01/06/2025',
        notaGeral: 8.5,
        observacoes: 'Excelente evolução técnica',
        unidade: 'Zona Sul'
      },
      {
        id: 4,
        alunoId: 4,
        aluno: 'Ana Costa',
        nivelAnterior: 'intermediario' as const,
        nivelNovo: 'intermediario' as const,
        aprovado: false,
        avaliadoPor: 'Lucas Ferreira',
        dataAvaliacao: '28/05/2025',
        notaGeral: 6.5,
        observacoes: 'Precisa melhorar posicionamento tático',
        unidade: 'Zona Norte'
      }
    ]
  };

  const getNivelStars = (nivel: string) => {
    const stars = { 'iniciante': 1, 'intermediario': 2, 'avancado': 3 };
    return stars[nivel as keyof typeof stars] || 1;
  };

  const getNivelColor = (nivel: string) => {
    const colors = {
      'iniciante': 'text-green-600 bg-green-100 dark:bg-green-900/30',
      'intermediario': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
      'avancado': 'text-red-600 bg-red-100 dark:bg-red-900/30'
    };
    return colors[nivel as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Award className="h-8 w-8" />
          Avaliação de Nível
        </h1>
        <p className="text-purple-100">Gerencie as avaliações e promoções de nível dos alunos</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-3">
        {(['pendentes', 'avaliados', 'todos'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltroStatus(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              filtroStatus === f
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {f} 
            {f === 'pendentes' && ` (${avaliacoes.pendentes.length})`}
            {f === 'avaliados' && ` (${avaliacoes.avaliados.length})`}
          </button>
        ))}
      </div>

      {/* Avaliações Pendentes */}
      {(filtroStatus === 'todos' || filtroStatus === 'pendentes') && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Avaliações Pendentes ({avaliacoes.pendentes.length})
          </h3>

          {avaliacoes.pendentes.map((avaliacao) => (
            <div
              key={avaliacao.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 border-orange-200 dark:border-orange-800"
            >
              {/* Header do Card */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {avaliacao.aluno}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {avaliacao.unidade}
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full font-medium">
                  Avaliação Sugerida: {avaliacao.dataSugerida}
                </span>
              </div>

              {/* Informações de Nível */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Nível Atual</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold capitalize px-3 py-1 rounded-lg ${getNivelColor(avaliacao.nivelAtual)}`}>
                      {avaliacao.nivelAtual}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: getNivelStars(avaliacao.nivelAtual) }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Há {avaliacao.tempoNivelAtual} meses neste nível
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Nível Sugerido</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className={`text-lg font-bold capitalize px-3 py-1 rounded-lg ${getNivelColor(avaliacao.nivelSugerido)}`}>
                      {avaliacao.nivelSugerido}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: getNivelStars(avaliacao.nivelSugerido) }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-800 dark:text-blue-300 mb-1">Frequência</p>
                  <p className="text-2xl font-bold text-blue-600">{avaliacao.frequencia}%</p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-xs text-purple-800 dark:text-purple-300 mb-1">Horas Treinadas</p>
                  <p className="text-2xl font-bold text-purple-600">{avaliacao.horasTreinadas}h</p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-800 dark:text-green-300 mb-1">Tempo no Nível</p>
                  <p className="text-2xl font-bold text-green-600">{avaliacao.tempoNivelAtual}m</p>
                </div>
              </div>

              {/* Última Avaliação */}
              {avaliacao.ultimaAvaliacao && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Última avaliação: {avaliacao.ultimaAvaliacao}
                </p>
              )}

              {/* Ações */}
              <div className="flex gap-2">
                <Button className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Iniciar Avaliação
                </Button>
                <Button variant="secondary" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Reagendar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Avaliações Realizadas */}
      {(filtroStatus === 'todos' || filtroStatus === 'avaliados') && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Avaliações Realizadas ({avaliacoes.avaliados.length})
          </h3>

          {avaliacoes.avaliados.map((avaliacao) => (
            <div
              key={avaliacao.id}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 ${
                avaliacao.aprovado 
                  ? 'border-green-200 dark:border-green-800' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-full ${
                    avaliacao.aprovado 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {avaliacao.aprovado ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {avaliacao.aluno}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {avaliacao.unidade} • Avaliado em {avaliacao.dataAvaliacao}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  avaliacao.aprovado 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {avaliacao.aprovado ? 'Aprovado' : 'Mantido no Nível'}
                </span>
              </div>

              {/* Mudança de Nível */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium capitalize px-2 py-1 rounded ${getNivelColor(avaliacao.nivelAnterior)}`}>
                    {avaliacao.nivelAnterior}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: getNivelStars(avaliacao.nivelAnterior) }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current text-yellow-500" />
                    ))}
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  {avaliacao.aprovado ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <span className="text-gray-400">→</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium capitalize px-2 py-1 rounded ${getNivelColor(avaliacao.nivelNovo)}`}>
                    {avaliacao.nivelNovo}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: getNivelStars(avaliacao.nivelNovo) }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current text-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Avaliador e Nota */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avaliado por</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {avaliacao.avaliadoPor}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Nota Geral</p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(avaliacao.notaGeral / 2)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {avaliacao.notaGeral.toFixed(1)}/10
                    </span>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {avaliacao.observacoes && (
                <div className={`rounded-lg p-3 border ${
                  avaliacao.aprovado
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                }`}>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Observações:</strong> {avaliacao.observacoes}
                  </p>
                </div>
              )}

              {/* Ação */}
              <div className="mt-4">
                <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                  <Edit2 className="h-4 w-4" />
                  Ver Detalhes da Avaliação
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Informações */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
          ℹ️ Critérios de Avaliação
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• <strong>Técnica:</strong> Domínio dos fundamentos (saque, manchete, toque, etc.)</li>
          <li>• <strong>Tática:</strong> Posicionamento, leitura de jogo, comunicação</li>
          <li>• <strong>Físico:</strong> Condicionamento, agilidade, resistência</li>
          <li>• <strong>Atitude:</strong> Comprometimento, pontualidade, trabalho em equipe</li>
          <li>• <strong>Frequência:</strong> Presença regular nas aulas (mínimo 75%)</li>
        </ul>
        <p className="text-sm text-blue-700 dark:text-blue-400 mt-3">
          <strong>Nota mínima para aprovação:</strong> 7.0/10 em média geral
        </p>
      </div>
    </div>
  );
};