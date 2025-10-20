// src/components/evolucao/ProgressoGeralTab.tsx
import React from 'react';
import { Star, TrendingUp, Calendar, Award, Clock, AlertCircle } from 'lucide-react';
import { useAppState } from '@/contexts';

export const ProgressoGeralTab: React.FC = () => {
  const { userLogado } = useAppState();

  // Mock data - em produção viria do backend baseado no userLogado.id
 const progresso = {
    nivelAtual: 'intermediario' as const,
    statusAvaliacao: 'aprovado' as const, // 'sem_avaliacao' | 'avaliacao_pendente' | 'aprovado' | 'reprovado'
    proximaAvaliacao: '15/08/2025',
    ultimaAvaliacao: {
      data: '01/03/2024',
      avaliadoPor: 'Prof. Carlos Mendes',
      notaGeral: 8.5,
      observacoes: 'Excelente evolução técnica. Continue assim!'
    },
    tempoNivelAtual: 4, // meses
    inicioNivelAtual: '01/03/2024',
    historicoNiveis: [
      { 
        nivel: 'iniciante', 
        inicio: '15/01/2024', 
        fim: '01/03/2024', 
        duracaoMeses: 1.5,
        avaliadoPor: 'Prof. Lucas Ferreira',
        dataAvaliacao: '01/03/2024'
      },
      { 
        nivel: 'intermediario', 
        inicio: '01/03/2024', 
        fim: null, 
        duracaoMeses: 4,
        avaliadoPor: 'Prof. Carlos Mendes',
        dataAvaliacao: '01/03/2024'
      }
    ]
  };

  const getNivelStars = (nivel: string) => {
    const stars = {
      'iniciante': 1,
      'intermediario': 2,
      'avancado': 3
    };
    return stars[nivel as keyof typeof stars] || 1;
  };

  const getNivelColor = (nivel: string) => {
    const colors = {
      'iniciante': 'text-green-600',
      'intermediario': 'text-yellow-600',
      'avancado': 'text-red-600'
    };
    return colors[nivel as keyof typeof colors] || 'text-gray-600';
  };

  const getStatusAvaliacaoCard = () => {
    switch (progresso.statusAvaliacao) {
      case 'sem_avaliacao':
        return {
          color: 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600',
          icon: <Clock className="h-6 w-6 text-gray-600" />,
          titulo: 'Sem Avaliação Agendada',
          descricao: 'Seu professor ainda não agendou uma avaliação de nível.',
          acao: null
        };
      case 'avaliacao_pendente':
        return {
          color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700',
          icon: <AlertCircle className="h-6 w-6 text-yellow-600" />,
          titulo: 'Avaliação Agendada',
          descricao: `Você tem uma avaliação marcada para ${progresso.proximaAvaliacao}`,
          acao: 'Prepare-se revisando os fundamentos do seu nível!'
        };
      case 'aprovado':
        return {
          color: 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700',
          icon: <Award className="h-6 w-6 text-green-600" />,
          titulo: 'Última Avaliação: Aprovado',
          descricao: `Avaliado em ${progresso.ultimaAvaliacao.data} por ${progresso.ultimaAvaliacao.avaliadoPor}`,
          acao: progresso.proximaAvaliacao ? `Próxima avaliação sugerida: ${progresso.proximaAvaliacao}` : null
        };
      case 'reprovado':
        return {
          color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700',
          icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
          titulo: 'Continue Treinando',
          descricao: 'Você ainda precisa aprimorar algumas habilidades para avançar de nível.',
          acao: 'Foque nos pontos de melhoria indicados pelo seu professor.'
        };
    }
  };

  const statusCard = getStatusAvaliacaoCard();

  return (
    <div className="space-y-6">
      {/* Progresso Geral */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          Progresso Geral
        </h2>

        {/* Nível Atual */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nível Atual</p>
              <div className="flex items-center gap-2">
                <h3 className={`text-2xl font-bold capitalize ${getNivelColor(progresso.nivelAtual)}`}>
                  {progresso.nivelAtual}
                </h3>
                <div className="flex gap-1">
                  {Array.from({ length: getNivelStars(progresso.nivelAtual) }).map((_, i) => (
                    <Star key={i} className={`h-6 w-6 fill-current ${getNivelColor(progresso.nivelAtual)}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Tempo neste nível</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {progresso.tempoNivelAtual} meses
              </p>
              <p className="text-xs text-gray-500">Desde: {progresso.inicioNivelAtual}</p>
            </div>
          </div>

          {/* Card de Status de Avaliação */}
          <div className={`rounded-lg p-4 border-2 ${statusCard.color}`}>
            <div className="flex items-start gap-3">
              {statusCard.icon}
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  {statusCard.titulo}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {statusCard.descricao}
                </p>
                {statusCard.acao && (
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    💡 {statusCard.acao}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Última Avaliação Detalhada */}
        {progresso.statusAvaliacao === 'aprovado' && progresso.ultimaAvaliacao && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Última Avaliação</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avaliado por:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {progresso.ultimaAvaliacao.avaliadoPor}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Data:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {progresso.ultimaAvaliacao.data}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Nota Geral:</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(progresso.ultimaAvaliacao.notaGeral / 2)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-green-600">
                    {progresso.ultimaAvaliacao.notaGeral.toFixed(1)}/10
                  </span>
                </div>
              </div>
              
              {progresso.ultimaAvaliacao.observacoes && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    <strong>Observações:</strong> {progresso.ultimaAvaliacao.observacoes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Linha do Tempo de Níveis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Histórico de Níveis</h3>
          </div>

          <div className="space-y-4">
            {progresso.historicoNiveis.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                {/* Indicador Visual */}
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    !item.fim 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <div className="flex gap-0.5">
                      {Array.from({ length: getNivelStars(item.nivel) }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 fill-current ${
                            !item.fim ? 'text-white' : 'text-gray-500'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  {index < progresso.historicoNiveis.length - 1 && (
                    <div className="w-0.5 h-16 bg-gray-200 dark:bg-gray-700 my-1" />
                  )}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-bold capitalize ${
                      !item.fim ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {item.nivel}
                      {!item.fim && (
                        <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                          Atual
                        </span>
                      )}
                    </h4>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Período:</strong> {item.inicio}
                      {item.fim && ` → ${item.fim}`} ({item.duracaoMeses} meses)
                    </p>
                    {item.avaliadoPor && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <strong>Avaliado por:</strong> {item.avaliadoPor}
                      </p>
                    )}
                    {item.dataAvaliacao && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <strong>Data da avaliação:</strong> {item.dataAvaliacao}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dicas para Preparação de Avaliação */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
          💡 Como se Preparar para a Avaliação de Nível
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Mantenha frequência de 80%+ nas aulas</li>
          <li>• Pratique os fundamentos técnicos do seu nível</li>
          <li>• Participe de pelo menos 1 torneio para ganhar experiência</li>
          <li>• Converse com seu professor sobre seus pontos de melhoria</li>
          <li>• Revise as técnicas e táticas específicas do próximo nível</li>
        </ul>
      </div>
    </div>
  );
};