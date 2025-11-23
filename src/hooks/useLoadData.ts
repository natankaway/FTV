import { useEffect, useCallback, useRef } from 'react';
import { useAppState } from '@/contexts';
import {
  alunosService,
  professoresService,
  unidadesService,
  planosService,
  produtosService,
  presencasService,
  financeiroService,
  agendamentosService,
  treinosService,
  exerciciosService,
  torneiosService,
  aulasExperimentaisService,
  horariosService,
  gestoresService,
  configService
} from '@/services';

/**
 * Hook para carregar dados da API quando o usuário está autenticado
 */
export const useLoadData = () => {
  const {
    userLogado,
    setAlunos,
    setProfessores,
    setUnidades,
    setPlanos,
    setProdutos,
    setPresencas,
    setFinanceiro,
    setAgendamentos,
    setTreinos,
    setExercicios,
    setTorneios,
    setAulasExperimentais,
    setHorarios,
    setGestores,
    setConfigCT
  } = useAppState();

  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);

  const loadAllData = useCallback(async () => {
    if (!userLogado) {
      console.log('[useLoadData] Usuário não autenticado, pulando carregamento de dados');
      return;
    }

    // Evitar múltiplas chamadas simultâneas
    if (isLoadingRef.current) {
      console.log('[useLoadData] Já está carregando, pulando...');
      return;
    }

    // Carregar apenas uma vez por sessão
    if (hasLoadedRef.current) {
      console.log('[useLoadData] Dados já foram carregados nesta sessão');
      return;
    }

    isLoadingRef.current = true;

    try {
      console.log('[useLoadData] Iniciando carregamento de dados da API...');

      // Carregar dados em paralelo - Batch 1 (entidades principais)
      const [
        alunosData,
        professoresData,
        unidadesData,
        planosData,
        produtosData,
        presencasData,
        financeiroData
      ] = await Promise.allSettled([
        alunosService.getAll(),
        professoresService.getAll(),
        unidadesService.getAll(),
        planosService.getAll(),
        produtosService.getAll(),
        presencasService.getAll(),
        financeiroService.getAll()
      ]);

      // Batch 2 (entidades secundárias)
      const [
        agendamentosData,
        treinosData,
        exerciciosData,
        torneiosData,
        aulasExperimentaisData,
        horariosData,
        gestoresData,
        configData
      ] = await Promise.allSettled([
        agendamentosService.getAll(),
        treinosService.getAll(),
        exerciciosService.getAll(),
        torneiosService.getAll(),
        aulasExperimentaisService.getAll(),
        horariosService.getAll(),
        gestoresService.getAll(),
        configService.get()
      ]);

      // Atualizar estados com os dados carregados - Batch 1
      if (alunosData.status === 'fulfilled') {
        console.log(`[useLoadData] ✅ ${alunosData.value.length} alunos carregados`);
        setAlunos(alunosData.value);
      } else {
        console.error('[useLoadData] ❌ Erro ao carregar alunos:', alunosData.reason);
      }

      if (professoresData.status === 'fulfilled') {
        console.log(`[useLoadData] ✅ ${professoresData.value.length} professores carregados`);
        setProfessores(professoresData.value);
      } else {
        console.error('[useLoadData] ❌ Erro ao carregar professores:', professoresData.reason);
      }

      if (unidadesData.status === 'fulfilled') {
        console.log(`[useLoadData] ✅ ${unidadesData.value.length} unidades carregadas`);
        setUnidades(unidadesData.value);
      } else {
        console.error('[useLoadData] ❌ Erro ao carregar unidades:', unidadesData.reason);
      }

      if (planosData.status === 'fulfilled') {
        console.log(`[useLoadData] ✅ ${planosData.value.length} planos carregados`);
        setPlanos(planosData.value);
      } else {
        console.error('[useLoadData] ❌ Erro ao carregar planos:', planosData.reason);
      }

      if (produtosData.status === 'fulfilled') {
        console.log(`[useLoadData] ✅ ${produtosData.value.length} produtos carregados`);
        setProdutos(produtosData.value);
      } else {
        console.error('[useLoadData] ❌ Erro ao carregar produtos:', produtosData.reason);
      }

      if (presencasData.status === 'fulfilled') {
        console.log(`[useLoadData] ✅ ${presencasData.value.length} presenças carregadas`);
        setPresencas(presencasData.value);
      } else {
        console.error('[useLoadData] ❌ Erro ao carregar presenças:', presencasData.reason);
      }

      if (financeiroData.status === 'fulfilled') {
        console.log(`[useLoadData] ✅ ${financeiroData.value.length} transações financeiras carregadas`);
        setFinanceiro(financeiroData.value);
      } else {
        console.error('[useLoadData] ❌ Erro ao carregar dados financeiros:', financeiroData.reason);
      }

      // Atualizar estados com os dados carregados - Batch 2
      if (agendamentosData.status === 'fulfilled') {
        console.log(`[useLoadData] ✅ ${agendamentosData.value.length} agendamentos carregados`);
        setAgendamentos(agendamentosData.value);
      } else {
        console.error('[useLoadData] ❌ Erro ao carregar agendamentos:', agendamentosData.reason);
      }

      if (treinosData.status === 'fulfilled') {
        console.log(`[useLoadData] ✅ ${treinosData.value.length} treinos carregados`);
        setTreinos(treinosData.value);
      } else {
        console.error('[useLoadData] ❌ Erro ao carregar treinos:', treinosData.reason);
      }

      if (exerciciosData.status === 'fulfilled') {
        console.log(`[useLoadData] ✅ ${exerciciosData.value.length} exercícios carregados`);
        setExercicios(exerciciosData.value);
      } else {
        console.error('[useLoadData] ❌ Erro ao carregar exercícios:', exerciciosData.reason);
      }

      if (torneiosData.status === 'fulfilled') {
        console.log(`[useLoadData] ✅ ${torneiosData.value.length} torneios carregados`);
        setTorneios(torneiosData.value);
      } else {
        console.error('[useLoadData] ❌ Erro ao carregar torneios:', torneiosData.reason);
      }

      if (aulasExperimentaisData.status === 'fulfilled') {
        console.log(`[useLoadData] ✅ ${aulasExperimentaisData.value.length} aulas experimentais carregadas`);
        setAulasExperimentais(aulasExperimentaisData.value);
      } else {
        console.error('[useLoadData] ❌ Erro ao carregar aulas experimentais:', aulasExperimentaisData.reason);
      }

      if (horariosData.status === 'fulfilled') {
        console.log(`[useLoadData] ✅ ${horariosData.value.length} horários carregados`);
        setHorarios(horariosData.value);
      } else {
        console.error('[useLoadData] ❌ Erro ao carregar horários:', horariosData.reason);
      }

      if (gestoresData.status === 'fulfilled') {
        console.log(`[useLoadData] ✅ ${gestoresData.value.length} gestores carregados`);
        setGestores(gestoresData.value);
      } else {
        console.error('[useLoadData] ❌ Erro ao carregar gestores:', gestoresData.reason);
      }

      if (configData.status === 'fulfilled') {
        console.log('[useLoadData] ✅ Configuração do sistema carregada');
        setConfigCT(configData.value);
      } else {
        console.error('[useLoadData] ❌ Erro ao carregar configuração:', configData.reason);
      }

      console.log('[useLoadData] Carregamento concluído!');
      hasLoadedRef.current = true;
    } catch (error) {
      console.error('[useLoadData] Erro ao carregar dados:', error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [
    userLogado,
    setAlunos,
    setProfessores,
    setUnidades,
    setPlanos,
    setProdutos,
    setPresencas,
    setFinanceiro,
    setAgendamentos,
    setTreinos,
    setExercicios,
    setTorneios,
    setAulasExperimentais,
    setHorarios,
    setGestores,
    setConfigCT
  ]);

  // Carregar dados quando o usuário fizer login
  useEffect(() => {
    if (userLogado && !hasLoadedRef.current) {
      loadAllData();
    }
  }, [userLogado, loadAllData]);

  return { loadAllData };
};
