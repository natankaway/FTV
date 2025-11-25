import React, { useState, useCallback, memo, useMemo, useEffect } from 'react';
import { useAppState, useNotifications } from '@/contexts';
import { Button } from '@/components/common';
import { TreinoForm } from './TreinoForm';
import { PranchetaTatica } from './PranchetaTatica';
import { Plus, Edit, Trash, BookOpen, Save, ArrowLeft, Loader2 } from 'lucide-react';
import type { Treino, TreinoFormData } from '@/types';
import type { PranchetaData, CanvasItemUnion } from '@/types/canvas';
import { treinosService } from '@/services';

// Estende o tipo Treino para garantir que ele possa ter dados da prancheta
type TreinoComPrancheta = Treino & { pranchetaData?: PranchetaData };

export const TreinosManager: React.FC = memo(() => {
  const { dadosMockados, setTreinos, userLogado, unidadeSelecionada } = useAppState();
  const { addNotification } = useNotifications();

  // Estado que controla o treino ativo para edição ou criação
  const [activeTreino, setActiveTreino] = useState<TreinoComPrancheta | null>(null);
  const [treinos, setTreinosState] = useState<TreinoComPrancheta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar treinos do Supabase
  useEffect(() => {
    const loadTreinos = async () => {
      if (!userLogado) return;

      setIsLoading(true);
      try {
        const params: any = {};
        if (userLogado.perfil !== 'admin') {
          params.professor_id = userLogado.id;
        }

        const data = await treinosService.getAll(params);
        setTreinosState(data as TreinoComPrancheta[]);
      } catch (error) {
        console.error('Erro ao carregar treinos:', error);
        addNotification({
          type: 'error',
          title: 'Erro ao carregar',
          message: 'Não foi possível carregar os treinos'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTreinos();
  }, [userLogado, addNotification]);

  // Filtra os treinos exibidos na lista
  const filteredTreinos = useMemo(() => {
    // Os treinos já vêm filtrados do backend baseado no perfil do usuário
    return treinos.sort((a, b) => new Date(b.data || 0).getTime() - new Date(a.data || 0).getTime());
  }, [treinos]);

  // Abre a tela para criar um novo treino
  const handleNewTreino = useCallback(() => {
    setActiveTreino({
      id: 0, // ID temporário
      nome: '',
      tipo: 'tecnico',
      nivel: 'iniciante',
      duracao: 60,
      objetivo: '',
      equipamentos: [],
      exercicios: [],
      professorId: userLogado?.id || 0,
      unidade: unidadeSelecionada || '',
      data: new Date().toISOString().split('T')[0],
      status: 'planejado',
      pranchetaData: { id: 'new', items: [], backgroundColor: '', createdAt: '', updatedAt: '', fieldDimensions: { width: 500, height: 700} }
    });
  }, [userLogado, unidadeSelecionada]);

  // Abre a tela de edição para um treino existente
  const handleSelectTreino = useCallback((treino: TreinoComPrancheta) => {
    setActiveTreino(treino);
  }, []);

  // Volta para a lista de treinos
  const handleCancel = useCallback(() => {
    setActiveTreino(null);
  }, []);

  // Atualiza o estado do treino ativo conforme o formulário é preenchido
  const handleTreinoFormChange = useCallback((formData: TreinoFormData) => {
    setActiveTreino(prev => prev ? { ...prev, ...formData } : null);
  }, []);

  // Atualiza o estado da prancheta do treino ativo
  const handlePranchetaChange = useCallback((newItems: CanvasItemUnion[]) => {
    setActiveTreino(prev => {
      if (!prev) return null;
      const pranchetaData = prev.pranchetaData || { id: String(prev.id) || 'new', items: [], backgroundColor: '', createdAt: '', updatedAt: '', fieldDimensions: { width: 500, height: 700} };
      return { ...prev, pranchetaData: { ...pranchetaData, items: newItems } };
    });
  }, []);

  // Salva o treino (cria um novo ou atualiza um existente)
  const handleSave = useCallback(async () => {
    if (!activeTreino || !activeTreino.nome) {
      addNotification({ type: 'error', title: 'Erro', message: 'O título do treino é obrigatório.' });
      return;
    }

    try {
      const treinoData = {
        nome: activeTreino.nome,
        tipo: activeTreino.tipo,
        nivel: activeTreino.nivel,
        duracao: activeTreino.duracao,
        objetivo: activeTreino.objetivo,
        equipamentos: activeTreino.equipamentos,
        exercicios: activeTreino.exercicios,
        professor_id: activeTreino.professorId,
        unidade_id: activeTreino.unidade,
        data: activeTreino.data,
        status: activeTreino.status,
        prancheta_data: activeTreino.pranchetaData
      };

      if (activeTreino.id && activeTreino.id !== 0) {
        // Atualiza um treino existente
        await treinosService.update(activeTreino.id, treinoData);
        setTreinosState(prev => prev.map(t => t.id === activeTreino.id ? activeTreino : t));
        addNotification({ type: 'success', title: 'Treino atualizado!' });
      } else {
        // Cria um novo treino
        const novoTreino = await treinosService.create(treinoData);
        setTreinosState(prev => [...prev, { ...novoTreino, pranchetaData: activeTreino.pranchetaData } as TreinoComPrancheta]);
        addNotification({ type: 'success', title: 'Treino criado com sucesso!' });
      }
      setActiveTreino(null); // Volta para a lista
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      addNotification({ type: 'error', title: 'Erro ao salvar', message: 'Não foi possível salvar o treino' });
    }
  }, [activeTreino, addNotification]);

  // Deleta um treino da lista
  const handleDelete = useCallback(async (treinoId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este treino?')) {
      try {
        await treinosService.delete(treinoId);
        setTreinosState(prev => prev.filter(t => t.id !== treinoId));
        addNotification({ type: 'success', title: 'Treino excluído' });
      } catch (error) {
        console.error('Erro ao excluir treino:', error);
        addNotification({ type: 'error', title: 'Erro ao excluir', message: 'Não foi possível excluir o treino' });
      }
    }
  }, [addNotification]);

  // ================= RENDERIZAÇÃO =================

  // RENDERIZA A TELA DE EDIÇÃO/CRIAÇÃO
  if (activeTreino) {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={handleCancel}>
                <ArrowLeft size={16} />
                Voltar para a Lista
              </Button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {activeTreino.id && activeTreino.id !== 0 ? `Editando: ${activeTreino.nome}` : 'Novo Treino'}
              </h1>
            </div>
            <Button onClick={handleSave} leftIcon={<Save size={16} />}>
              Salvar Treino
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TreinoForm
              treino={activeTreino}
              onSave={handleSave}
              onCancel={handleCancel}
              onDataChange={handleTreinoFormChange}
              isEmbedded={true}
            />
          </div>
          <div className="lg:col-span-2">
            <PranchetaTatica
              pranchetaItems={activeTreino.pranchetaData?.items || []}
              onPranchetaChange={handlePranchetaChange}
            />
          </div>
        </div>
      </div>
    );
  }

  // RENDERIZA ESTADO DE LOADING
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Carregando treinos...
          </h3>
        </div>
      </div>
    );
  }

  // RENDERIZA A TELA DE LISTA DE TREINOS
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <BookOpen size={24} />
            Biblioteca de Treinos
          </h1>
          <Button onClick={handleNewTreino} leftIcon={<Plus size={16} />}>
            Novo Treino
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTreinos.map(treino => (
          <div key={treino.id} className="bg-white dark:bg-gray-800 rounded-lg border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer" onClick={() => handleSelectTreino(treino)}>
                {treino.nome}
              </h3>
              <div className="flex gap-1">
                <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleSelectTreino(treino); }} title="Editar"><Edit size={14} /></Button>
                <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); handleDelete(treino.id); }} title="Excluir"><Trash size={14} /></Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{treino.objetivo}</p>
            <div className="flex justify-between items-center text-xs">
                <span>{treino.duracao} min • {treino.nivel}</span>
                {treino.pranchetaData && treino.pranchetaData.items.length > 0 && 
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Com Prancheta</span>
                }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

TreinosManager.displayName = 'TreinosManager';
