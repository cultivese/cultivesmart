import '@coreui/coreui-pro/dist/css/coreui.min.css';
import '@coreui/coreui/dist/css/coreui.min.css';
import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CListGroup,
  CListGroupItem,
  CButton,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilBan } from '@coreui/icons';
import { CDatePicker } from '@coreui/react-pro';

// Adiciona CSS para destacar segundas e sextas no calendário
import './CadastroLote.css';

// Função para buscar lotes reais da API
const fetchLotes = async () => {
  try {
    const response = await fetch('https://backend.cultivesmart.com.br/api/plantios');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar plantios:', error);
    return [];
  }
};

// Função para buscar insumos reais da API
const fetchInsumosEspecificacoes = async () => {
  try {
    const response = await fetch('https://backend.cultivesmart.com.br/api/insumos');
    const data = await response.json();
    return data.records || [];
  } catch (error) {
    console.error('Erro ao buscar especificações dos insumos:', error);
    return [];
  }
};

// Função para gerar tarefas agendadas para cada lote
const gerarTarefasPorLote = (lotes, insumos, dataHoje) => {
  const tarefas = [];
  lotes.forEach(lote => {
    const insumo = insumos.find(i => i.id === lote.insumoId);
    const espec = insumo && insumo.especificacoes && insumo.especificacoes[0];
    if (!espec) return;
    // Plantio: só aparece no dia do plantio
    if (
      lote.dataPlantio.getFullYear() === dataHoje.getFullYear() &&
      lote.dataPlantio.getMonth() === dataHoje.getMonth() &&
      lote.dataPlantio.getDate() === dataHoje.getDate()
    ) {
      tarefas.push({
        id: `plantio-${lote.id}`,
        description: `Plantio do lote ${lote.id} - ${lote.nome} (${lote.variedade})`,
        type: 'plantio',
        status: 'pending',
        loteId: lote.id,
        details: `Utilizar especificação: ${espec.gramas_para_plantio || ''}g por bandeja.`
      });
    }
    // Blackout: X dias após plantio
    if (espec.dias_blackout && espec.dias_blackout > 0) {
      const dataBlackout = new Date(lote.dataPlantio);
      dataBlackout.setDate(dataBlackout.getDate() + espec.dias_blackout);
      if (
        dataBlackout.getFullYear() === dataHoje.getFullYear() &&
        dataBlackout.getMonth() === dataHoje.getMonth() &&
        dataBlackout.getDate() === dataHoje.getDate()
      ) {
        tarefas.push({
          id: `blackout-${lote.id}`,
          description: `Iniciar blackout do lote ${lote.id} - ${lote.nome} (${lote.variedade})`,
          type: 'blackout',
          status: 'pending',
          loteId: lote.id,
          details: `Após ${espec.dias_blackout} dias do plantio.`
        });
      }
    }
    // Colheita: Y dias após plantio
    if (espec.dias_colheita && espec.dias_colheita > 0) {
      const dataColheita = new Date(lote.dataPlantio);
      dataColheita.setDate(dataColheita.getDate() + espec.dias_colheita);
      if (
        dataColheita.getFullYear() === dataHoje.getFullYear() &&
        dataColheita.getMonth() === dataHoje.getMonth() &&
        dataColheita.getDate() === dataHoje.getDate()
      ) {
        tarefas.push({
          id: `colheita-${lote.id}`,
          description: `Colheita do lote ${lote.id} - ${lote.nome} (${lote.variedade})`,
          type: 'colheita',
          status: 'pending',
          loteId: lote.id,
          details: `Após ${espec.dias_colheita} dias do plantio.`
        });
      }
    }
  });
  return tarefas;
};

const CadastroLote = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTaskForModal, setCurrentTaskForModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [novoLote, setNovoLote] = useState({ insumoId: '', nome: '', variedade: '', dataPlantio: '', gramasDesejadas: '' });
  const [insumosLista, setInsumosLista] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState({ loteId: '', tipo: '', descricao: '', dataAgendada: '', status: 'pending' });
  const [lotesLista, setLotesLista] = useState([]);
  const [modalTarefasVisible, setModalTarefasVisible] = useState(false);
  const [tarefasPreview, setTarefasPreview] = useState([]);
  // Adiciona o estado para recorrencia
  const [recorrencia, setRecorrencia] = useState('');

  useEffect(() => {
    const carregarTarefas = async () => {
      const lotes = await fetchLotes();
      const insumos = await fetchInsumosEspecificacoes();
      setInsumosLista(insumos);
      // Corrige dataPlantio para Date e insumoId
      const lotesComData = lotes.map(lote => ({
        ...lote,
        dataPlantio: lote.data_plantio ? new Date(lote.data_plantio) : (lote.dataPlantio ? new Date(lote.dataPlantio) : null),
        insumoId: lote.insumo_id || lote.insumoId
      }));
      const hoje = new Date();
      const tarefasHoje = gerarTarefasPorLote(lotesComData, insumos, hoje);
      setTasks(tarefasHoje);
    };
    carregarTarefas();
  }, []);

  useEffect(() => {
    const carregarLotes = async () => {
      const lotes = await fetchLotes();
      // Corrige dataPlantio para Date e insumoId
      const lotesComData = lotes.map(lote => ({
        ...lote,
        dataPlantio: lote.data_plantio ? new Date(lote.data_plantio) : (lote.dataPlantio ? new Date(lote.dataPlantio) : null),
        insumoId: lote.insumo_id || lote.insumoId
      }));
      setLotesLista(lotesComData);
    };
    carregarLotes();
  }, []);

  const handleNovoLoteChange = (e) => {
    const { name, value } = e.target;
    if (name === 'recorrencia') {
      setRecorrencia(value);
    } else {
      setNovoLote((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCadastrarLote = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    // Validação dos campos obrigatórios
    if (!novoLote.insumoId || !novoLote.nome || !novoLote.dataPlantio || !novoLote.gramasDesejadas || !recorrencia || parseFloat(novoLote.gramasDesejadas) <= 0) {
      alert('Preencha todos os campos obrigatórios, selecione uma recorrência e informe uma quantidade de gramas desejada maior que zero.');
      return;
    }

    // Lógica para recorrência
    let datasPlantio = [];
    const primeiraData = novoLote.dataPlantio instanceof Date ? novoLote.dataPlantio : new Date(novoLote.dataPlantio);
    let meses = 0;
    if (recorrencia === '1m') meses = 1;
    else if (recorrencia === '3m') meses = 3;
    else if (recorrencia === '6m') meses = 6;
    else if (recorrencia === '1y') meses = 12;

    if (meses > 0) {
      for (let i = 0; i <= meses * 4; i++) { // 4 semanas por mês
        const d = new Date(primeiraData);
        d.setDate(d.getDate() + i * 7);
        // Só adiciona se for segunda ou sexta
        if (d.getDay() === 1 || d.getDay() === 5) {
          datasPlantio.push(new Date(d));
        }
      }
    } else {
      datasPlantio = [primeiraData];
    }

    // Remove datas duplicadas e ordena
    datasPlantio = Array.from(new Set(datasPlantio.map(d => d.toISOString().slice(0,10)))).map(d => new Date(d)).sort((a,b) => a-b);

    for (const dataPlantio of datasPlantio) {
      // Busca especificação do insumo selecionado
      const insumo = insumosLista.find(i => i.id === parseInt(novoLote.insumoId));
      const espec = insumo && insumo.especificacoes && insumo.especificacoes[0];
      if (!espec) throw new Error('Especificação não encontrada para o insumo');

      // Calcula bandejas necessárias
      const gramasPorBandeja = espec.gramas_para_plantio || 0;
      const bandejasNecessarias = Math.ceil(parseFloat(novoLote.gramasDesejadas) / gramasPorBandeja);
      const sementesPorBandeja = espec.sementes_por_bandeja || 0;
      const totalSementes = bandejasNecessarias * sementesPorBandeja;

      // Cria o plantio
      const loteResponse = await fetch('https://backend.cultivesmart.com.br/api/plantios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insumo_id: novoLote.insumoId,
          nome: novoLote.nome,
          variedade: novoLote.variedade,
          data_plantio: formatDateLocal(dataPlantio),
          gramas_desejadas: novoLote.gramasDesejadas,
          bandejas_necessarias: bandejasNecessarias,
          sementes_necessarias: totalSementes,
        }),
      });
      if (!loteResponse.ok) throw new Error('Erro ao cadastrar plantio');
      const lote = await loteResponse.json();

      // Gera tarefas automáticas
      const tarefas = [];
      // Plantio
      tarefas.push({
        lote_id: lote.id,
        tipo: 'plantio',
        descricao: `Plantio de ${bandejasNecessarias} bandejas (${totalSementes} sementes)`,
        data_agendada: formatDateLocal(dataPlantio),
        status: 'pending',
      });
      // Desempilhamento
      if (espec.dias_pilha) {
        const dataDesempilhamento = new Date(dataPlantio);
        dataDesempilhamento.setDate(dataDesempilhamento.getDate() + espec.dias_pilha);
        tarefas.push({
          lote_id: lote.id,
          tipo: 'desempilhamento',
          descricao: `Desempilhar após ${espec.dias_pilha} dias em pilha`,
          data_agendada: formatDateLocal(dataDesempilhamento),
          status: 'pending',
        });
      }
      // Blackout
      if (espec.dias_blackout) {
        const dataBlackout = new Date(dataPlantio);
        dataBlackout.setDate(dataBlackout.getDate() + espec.dias_pilha + espec.dias_blackout);
        tarefas.push({
          lote_id: lote.id,
          tipo: 'blackout',
          descricao: `Blackout após desempilhamento por ${espec.dias_blackout} dias`,
          data_agendada: formatDateLocal(dataBlackout),
          status: 'pending',
        });
      }
      // Colheita
      if (espec.dias_colheita) {
        const dataColheita = new Date(dataPlantio);
        dataColheita.setDate(dataColheita.getDate() + espec.dias_pilha + espec.dias_blackout + espec.dias_colheita);
        tarefas.push({
          lote_id: lote.id,
          tipo: 'colheita',
          descricao: `Colheita após ${espec.dias_colheita} dias de blackout`,
          data_agendada: formatDateLocal(dataColheita),
          status: 'pending',
        });
      }
      // Registra tarefas na API
      for (const tarefa of tarefas) {
        await fetch('https://backend.cultivesmart.com.br/api/tarefas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tarefa),
        });
      }
    }

    setNovoLote({ insumoId: '', nome: '', variedade: '', dataPlantio: '', gramasDesejadas: '' });
    // Atualiza tarefas/lotes
    const lotes = await fetchLotes();
    const insumos = await fetchInsumosEspecificacoes();
    const hoje = new Date();
    const tarefasHoje = gerarTarefasPorLote(lotes, insumos, hoje);
    setTasks(tarefasHoje);
    alert('Plantios e tarefas cadastrados com sucesso!');
  };

  const handleNovaTarefaChange = (e) => {
    const { name, value } = e.target;
    setNovaTarefa((prev) => ({ ...prev, [name]: value }));
  };

  const handleCadastrarTarefa = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://backend.cultivesmart.com.br/api/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lote_id: novaTarefa.loteId,
          tipo: novaTarefa.tipo,
          descricao: novaTarefa.descricao,
          data_agendada: novaTarefa.dataAgendada,
          status: novaTarefa.status,
        }),
      });
      if (!response.ok) throw new Error('Erro ao cadastrar tarefa');
      setNovaTarefa({ loteId: '', tipo: '', descricao: '', dataAgendada: '', status: 'pending' });
      // Atualiza tarefas
      const lotes = await fetchLotes();
      const insumos = await fetchInsumosEspecificacoes();
      const hoje = new Date();
      const tarefasHoje = gerarTarefasPorLote(lotes, insumos, hoje);
      setTasks(tarefasHoje);
      alert('Tarefa cadastrada com sucesso!');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleStartTask = (taskId) => {
    const taskToStart = tasks.find((t) => t.id === taskId);

    if (taskToStart.status === 'pending' && !activeTaskId) {
      if (taskToStart.type === 'plantio' || taskToStart.type === 'colheita' || taskToStart.type === 'verificacao') {
        setCurrentTaskForModal(taskToStart);
        setFormData({});
        setModalVisible(true);
      } else {
        setActiveTaskId(taskId);
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? { ...task, status: 'active' } : task)),
        );
      }
    } else {
      alert('Por favor, finalize a tarefa atual antes de iniciar outra.');
    }
  };

  const handleCompleteTask = (taskId) => {
    if (activeTaskId !== taskId) {
      alert('Você só pode finalizar a tarefa que está em andamento.');
      return;

    }

    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: 'completed' } : task,
      );

      const completedTask = updatedTasks.find((t) => t.id === taskId);

      setActiveTaskId(null);

      let nextActiveTaskId = null;
      const tasksAfterUnlock = updatedTasks.map((task) => {
        if (task.status === 'blocked' && task.dependencies.includes(completedTask.id)) {
          const allDependenciesMet = task.dependencies.every(
            (depId) => updatedTasks.find((t) => t.id === depId)?.status === 'completed',
          );
          if (allDependenciesMet) {
            if (!nextActiveTaskId) {
              nextActiveTaskId = task.id;
            }
            return { ...task, status: 'pending' };
          }
        }
        return task;
      });

      if (nextActiveTaskId) {
        setActiveTaskId(nextActiveTaskId);
        return tasksAfterUnlock.map((task) =>
          task.id === nextActiveTaskId ? { ...task, status: 'active' } : task,
        );
      }
      return tasksAfterUnlock;
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name === 'quantidadeBandejasPlantio' ||
      name === 'quantidadeSementesTotal' ||
      name === 'sementesPorBandeja' ||
      name === 'substratoBase' ||
      name === 'substratoCobertura'
        ? value === ''
          ? ''
          : parseFloat(value)
        : value;

    setFormData((prev) => {
      const newFormData = { ...prev, [name]: parsedValue };

      if (currentTaskForModal?.type === 'plantio' && name === 'quantidadeBandejasPlantio') {
        const numBandejasPlantio = parsedValue || 0;

        let totalBandejasEstoque = 0;
        if (numBandejasPlantio > 0) {
          const MAX_BANDEJAS_POR_PILHA = 4;
          const numPilhasComCobertura = Math.ceil(numBandejasPlantio / MAX_BANDEJAS_POR_PILHA);
          totalBandejasEstoque = numBandejasPlantio + numPilhasComCobertura;
        }

        newFormData.bandejasRetiradas = totalBandejasEstoque;
      }

      return newFormData;
    });
  };

  const handleModalSubmit = async () => {
    if (!currentTaskForModal) return;

    if (currentTaskForModal.type === 'plantio') {
      // Pega apenas a quantidade de sementes para a retirada no estoque
      const { quantidadeSementesTotal, quantidadeBandejasPlantio, sementesPorBandeja } = formData;

      // Validação de dados (mantida, é essencial!)
      // A validação agora se concentra apenas nos campos relevantes para a tarefa
      // e na quantidade de sementes, que é o que será retirado.
      if (
        !quantidadeSementesTotal ||
        !quantidadeBandejasPlantio ||
        !sementesPorBandeja ||
        parseFloat(quantidadeSementesTotal) <= 0 ||
        parseFloat(quantidadeBandejasPlantio) <= 0 ||
        parseFloat(sementesPorBandeja) <= 0
      ) {
        alert('Por favor, preencha a quantidade de sementes, bandejas e sementes por bandeja com valores maiores que zero.');
        return;
      }
      
      // Mapeamento dinâmico do insumo com base na descrição da tarefa
      let sementeKey = '';
      if (currentTaskForModal.description.includes('beterraba')) {
        sementeKey = 'sementes_beterraba';
      } else if (currentTaskForModal.description.includes('Rúcula')) {
        sementeKey = 'sementes_rucula';
      } else {
        alert('Tipo de semente não reconhecido na descrição da tarefa. Impossível identificar o insumo no estoque.');
        return;
      }
      
      const sementeStockId = STOCK_IDS[sementeKey];

      // Verifica se o ID do estoque para a semente foi configurado
      if (!sementeStockId) {
        alert(`ID do estoque para ${sementeKey} não configurado. Por favor, verifique a constante STOCK_IDS.`);
        return;
      }

      // Prepara os dados para a única retirada: a de sementes.
      const sementeMovementData = {
        quantidade_retirada: quantidadeSementesTotal,
        motivo: `Retirada para plantio: ${currentTaskForModal.description.split(':')[1].trim()}`,
      };

      try {
        console.log(`Enviando requisição para dar baixa em sementes (Estoque ID: ${sementeStockId})...`);

        // A URL do seu endpoint. Ajuste o domínio conforme necessário.
        const apiUrl = `https://backend.cultivesmart.com.br/api/estoque/${sementeStockId}/withdraw`;
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(sementeMovementData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Falha ao dar baixa nas sementes: ${errorData.message || 'Erro desconhecido'}`);
        }
        
        const responseData = await response.json();
        console.log('Movimentação de sementes registrada com sucesso!', responseData);

        // Se a chamada de API for bem-sucedida, atualiza o estado local.
        setActiveTaskId(currentTaskForModal.id);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === currentTaskForModal.id ? { ...task, status: 'active', registeredData: formData } : task,
          ),
        );
        
        setModalVisible(false);
        setCurrentTaskForModal(null);
        setFormData({});
        
        alert('Movimentação de sementes registrada com sucesso! A tarefa pode ser iniciada.');

      } catch (error) {
        // Em caso de erro na requisição, exibe um alerta e não atualiza o estado.
        console.error('Erro ao registrar a movimentação de sementes:', error);
        alert(`Erro: ${error.message}. Não foi possível registrar a retirada de sementes.`);
      }
    }
  };

  const handlePreviewTarefas = (e) => {
    e.preventDefault();
    // Busca especificação do insumo selecionado
    const insumo = insumosLista.find(i => i.id === parseInt(novoLote.insumoId));
    const espec = insumo && insumo.especificacoes && insumo.especificacoes[0];
    if (!espec) {
      alert('Especificação não encontrada para o insumo');
      return;
    }
    // Calcula bandejas necessárias
    const gramasPorBandeja = espec.gramas_para_plantio || 0;
    const bandejasNecessarias = Math.ceil(parseFloat(novoLote.gramasDesejadas) / gramasPorBandeja);
    const sementesPorBandeja = espec.sementes_por_bandeja || 0;
    const totalSementes = bandejasNecessarias * sementesPorBandeja;
    const dataPlantio = new Date(novoLote.dataPlantio);
    const tarefas = [];
    tarefas.push({
      tipo: 'plantio',
      descricao: `Plantio de ${bandejasNecessarias} bandejas (${totalSementes} sementes)`,
      data: dataPlantio.toLocaleDateString('pt-BR'),
    });
    if (espec.dias_pilha) {
      const dataDesempilhamento = new Date(dataPlantio);
      dataDesempilhamento.setDate(dataDesempilhamento.getDate() + espec.dias_pilha);
      tarefas.push({
        tipo: 'desempilhamento',
        descricao: `Desempilhar após ${espec.dias_pilha} dias em pilha`,
        data: dataDesempilhamento.toLocaleDateString('pt-BR'),
      });
    }
    if (espec.dias_blackout) {
      const dataBlackout = new Date(dataPlantio);
      dataBlackout.setDate(dataBlackout.getDate() + espec.dias_pilha + espec.dias_blackout);
      tarefas.push({
        tipo: 'blackout',
        descricao: `Blackout após desempilhamento por ${espec.dias_blackout} dias`,
        data: dataBlackout.toLocaleDateString('pt-BR'),
      });
    }
    if (espec.dias_colheita) {
      const dataColheita = new Date(dataPlantio);
      dataColheita.setDate(dataColheita.getDate() + espec.dias_pilha + espec.dias_blackout + espec.dias_colheita);
      tarefas.push({
        tipo: 'colheita',
        descricao: `Colheita após ${espec.dias_colheita} dias de blackout`,
        data: dataColheita.toLocaleDateString('pt-BR'),
      });
    }
    setTarefasPreview(tarefas);
    setModalTarefasVisible(true);
  };

  const handleConfirmarCadastroLote = async () => {
    // ...código atual de cadastro de lote e tarefas...
    await handleCadastrarLote();
    setModalTarefasVisible(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <CBadge color="secondary">Pendente</CBadge>;
      case 'active':
        return <CBadge color="info">Em Andamento</CBadge>;
      case 'completed':
        return <CBadge color="success">Concluída</CBadge>;
      case 'blocked':
        return <CBadge color="warning">Bloqueada</CBadge>;
      default:
        return <CBadge color="light">Desconhecido</CBadge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <CIcon icon={cilCheckCircle} className="text-secondary" />;
      case 'active':
        return <CIcon icon={cilCheckCircle} className="text-info" />;
      case 'completed':
        return <CIcon icon={cilCheckCircle} className="text-success" />;
      case 'blocked':
        return <CIcon icon={cilBan} className="text-warning" />;
      default:
        return null;
    }
  };

  const renderModalContent = () => {
    if (!currentTaskForModal) return null;

    switch (currentTaskForModal.type) {
      case 'plantio':
        return (
          <CForm>
            <CRow className="g-3">
              <CCol md={6}>
                <CFormLabel htmlFor="quantidadeSementesTotal">Sementes (total):</CFormLabel>
                <CInputGroup className="mb-3">
                  <CFormInput
                    type="number"
                    id="quantidadeSementesTotal"
                    name="quantidadeSementesTotal"
                    value={formData.quantidadeSementesTotal || ''}
                    onChange={handleFormChange}
                    placeholder="Ex: 50"
                    required
                  />
                  <CInputGroupText>g/un</CInputGroupText>
                </CInputGroup>
              </CCol>

              <CCol md={6}>
                <CFormLabel htmlFor="sementesPorBandeja">Sementes por bandeja:</CFormLabel>
                <CInputGroup className="mb-3">
                  <CFormInput
                    type="number"
                    id="sementesPorBandeja"
                    name="sementesPorBandeja"
                    value={formData.sementesPorBandeja || ''}
                    onChange={handleFormChange}
                    placeholder="Ex: 100"
                    required
                  />
                  <CInputGroupText>un</CInputGroupText>
                </CInputGroup>
              </CCol>
            </CRow>

            <div className="mb-3">
              <CFormLabel htmlFor="quantidadeBandejasPlantio">Bandejas para plantio:</CFormLabel>
              <CInputGroup className="mb-2">
                <CFormInput
                  type="number"
                  id="quantidadeBandejasPlantio"
                  name="quantidadeBandejasPlantio"
                  value={formData.quantidadeBandejasPlantio || ''}
                  onChange={handleFormChange}
                  placeholder="Ex: 9"
                  required
                />
                <CInputGroupText>un</CInputGroupText>
              </CInputGroup>
              {formData.bandejasRetiradas > 0 && (
                <small className="text-muted d-block">
                  Total de bandejas a retirar do estoque (com cobertura):{' '}
                  <strong>{formData.bandejasRetiradas}</strong>
                </small>
              )}
            </div>

            <CRow className="g-3">
              <CCol md={6}>
                <CFormLabel htmlFor="substratoBase">Substrato (base):</CFormLabel>
                <CInputGroup className="mb-3">
                  <CFormInput
                    type="number"
                    step="0.01"
                    id="substratoBase"
                    name="substratoBase"
                    value={formData.substratoBase || ''}
                    onChange={handleFormChange}
                    placeholder="Ex: 5.0"
                    required
                  />
                  <CInputGroupText>litros</CInputGroupText>
                </CInputGroup>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="substratoCobertura">Substrato (cobertura):</CFormLabel>
                <CInputGroup className="mb-3">
                  <CFormInput
                    type="number"
                    step="0.01"
                    id="substratoCobertura"
                    name="substratoCobertura"
                    value={formData.substratoCobertura || ''}
                    onChange={handleFormChange}
                    placeholder="Ex: 2.0"
                    required
                  />
                  <CInputGroupText>litros</CInputGroupText>
                </CInputGroup>
              </CCol>
            </CRow>
          </CForm>
        );
      case 'colheita':
        return (
          <CForm>
            <CRow className="g-3">
              <CCol md={6}>
                <CFormLabel htmlFor="pesoColhido">Peso colhido:</CFormLabel>
                <CInputGroup className="mb-3">
                  <CFormInput
                    type="number"
                    id="pesoColhido"
                    name="pesoColhido"
                    value={formData.pesoColhido || ''}
                    onChange={handleFormChange}
                    placeholder="Ex: 2500"
                    required
                  />
                  <CInputGroupText>gramas</CInputGroupText>
                </CInputGroup>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="quantidadeBandejasColhidas">Bandejas colhidas:</CFormLabel>
                <CInputGroup className="mb-3">
                  <CFormInput
                    type="number"
                    id="quantidadeBandejasColhidas"
                    name="quantidadeBandejasColhidas"
                    value={formData.quantidadeBandejasColhidas || ''}
                    onChange={handleFormChange}
                    placeholder="Ex: 5"
                    required
                  />
                  <CInputGroupText>un</CInputGroupText>
                </CInputGroup>
              </CCol>
            </CRow>
          </CForm>
        );
      case 'verificacao':
        return (
          <CForm>
            <CRow className="g-3">
              <CCol md={6}>
                <CFormLabel htmlFor="phNivel">Nível de pH:</CFormLabel>
                <CInputGroup className="mb-3">
                  <CFormInput
                    type="number"
                    step="0.1"
                    id="phNivel"
                    name="phNivel"
                    value={formData.phNivel || ''}
                    onChange={handleFormChange}
                    placeholder="Ex: 6.2"
                    required
                  />
                  <CInputGroupText>pH</CInputGroupText>
                </CInputGroup>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="ecNivel">Nível de EC:</CFormLabel>
                <CInputGroup className="mb-3">
                  <CFormInput
                    type="number"
                    step="0.01"
                    id="ecNivel"
                    name="ecNivel"
                    value={formData.ecNivel || ''}
                    onChange={handleFormChange}
                    placeholder="Ex: 1.8"
                    required
                  />
                  <CInputGroupText>mS/cm</CInputGroupText>
                </CInputGroup>
              </CCol>
            </CRow>
            <div className="mb-3">
              <CFormLabel htmlFor="observacoes">Observações (opcional):</CFormLabel>
              <CFormInput
                as="textarea"
                id="observacoes"
                name="observacoes"
                value={formData.observacoes || ''}
                onChange={handleFormChange}
                rows="3"
                placeholder="Adicione qualquer observação relevante aqui..."
              />
            </div>
          </CForm>
        );
      default:
        return <p>Nenhum formulário específico para este tipo de tarefa.</p>;
    }
  };

  /**
 * Função mock para simular o registro de uma movimentação de estoque.
 * Em um cenário real, esta função faria uma chamada a uma API (ex: usando fetch ou axios).
 * @param {object} movementData - Os dados da movimentação a serem registrados.
 * @returns {Promise<object>} Uma promessa que resolve com a resposta da API ou rejeita em caso de erro.
 */
const registerPlantingMovement = (movementData) => {
  return new Promise((resolve, reject) => {
    console.log('Simulando chamada ao serviço de movimentos com os dados:', movementData);
    // Simula o tempo de resposta da API
    setTimeout(() => {
      // Aqui você pode adicionar lógica para simular falhas (ex: if (Math.random() > 0.9) { reject(...) })
      const mockApiResponse = {
        success: true,
        message: 'Movimentação de estoque de plantio registrada com sucesso.',
        data: movementData,
        timestamp: new Date().toISOString()
      };
      console.log('Serviço de movimentos respondeu com sucesso.');
      resolve(mockApiResponse);
    }, 1500); // 1.5 segundos de delay
  });
};

// ATENÇÃO: Você precisa preencher os IDs com os valores corretos do seu banco de dados.
// Mantive os outros IDs aqui para referência futura, mas o código usará apenas o da semente.
const STOCK_IDS = {
  sementes_beterraba: 1,
  sementes_rucula: 2,
};

function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

  return (
    <CContainer>
      <CRow>
        <CCol xs={12} className="mb-4">
          <CCard>
            <CCardHeader>Cadastro de Novo Lote</CCardHeader>
            <CCardBody>
              <form onSubmit={handlePreviewTarefas} className="row g-3">
                <CCol md={3}>
                  <CFormLabel>Insumo</CFormLabel>
                  <CFormSelect name="insumoId" value={novoLote.insumoId} onChange={handleNovoLoteChange} required>
                    <option value="">Selecione...</option>
                    {insumosLista.map((insumo) => (
                      <option key={insumo.id} value={insumo.id}>{insumo.nome} - {insumo.variedade}</option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormLabel>Nome do Lote</CFormLabel>
                  <CFormInput name="nome" value={novoLote.nome} onChange={handleNovoLoteChange} required />
                </CCol>
                <CCol md={3}>
                  <CFormLabel>Variedade</CFormLabel>
                  <CFormInput name="variedade" value={novoLote.variedade} onChange={handleNovoLoteChange} />
                </CCol>
                <CCol md={3}>
                  <CFormLabel>Data de Plantio</CFormLabel>
                  <CDatePicker
                    locale="pt-BR"
                    date={novoLote.dataPlantio || null}
                    calendarDate={novoLote.dataPlantio || undefined}
                    disabledDates={date => {
                      const day = date.getDay();
                      return !(day === 1 || day === 5);
                    }}
                    onDateChange={date => {
                      if (!date || (novoLote.dataPlantio && date.getTime() === novoLote.dataPlantio.getTime())) return;
                      handleNovoLoteChange({ target: { name: 'dataPlantio', value: date } });
                    }}
                    minDate={null}
                    maxDate={null}
                    id="coreuipro-datepicker-plantio"
                    required
                    placeholder="Selecione a data do plantio"
                    selectButtonText="Selecione a data do plantio"
                    customDayClass={date => {
                      const day = date.getDay();
                      if (day === 1 || day === 5) return 'cs-dia-destaque';
                      return '';
                    }}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel>Gramas Desejadas</CFormLabel>
                  <CFormInput type="number" name="gramasDesejadas" value={novoLote.gramasDesejadas} onChange={handleNovoLoteChange} required />
                </CCol>
                <CCol md={3}>
                  <CFormLabel>Recorrência</CFormLabel>
                  <CFormSelect name="recorrencia" value={recorrencia || ''} onChange={handleNovoLoteChange} required>
                    <option value="">Não repetir</option>
                    <option value="1m">1 mês</option>
                    <option value="3m">3 meses</option>
                    <option value="6m">6 meses</option>
                    <option value="1y">1 ano</option>
                  </CFormSelect>
                </CCol>
                <CCol md={12}>
                  <CButton type="submit" color="primary">Visualizar Tarefas</CButton>
                </CCol>
              </form>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} className="mb-4">
          {/* Formulário de cadastro manual de tarefa removido */}
        </CCol>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <span style={{fontWeight: 'bold', fontSize: '1.2em'}}>Tarefas do Dia - {new Date().toLocaleDateString('pt-BR', {weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'})}</span>
            </CCardHeader>
            <CCardBody>
              {tasks.length === 0 ? (
                <p style={{color: '#888'}}>Nenhuma tarefa agendada para hoje.</p>
              ) : (
                <CListGroup>
                  {tasks.map((task) => (
                    <CListGroupItem
                      key={task.id}
                      className={`d-flex justify-content-between align-items-center ${
                        task.status === 'completed' ? 'list-group-item-success' : ''
                      } ${task.status === 'active' ? 'list-group-item-info' : ''}`}
                      style={{fontSize: '1.05em'}}
                    >
                      <div>
                        {getStatusIcon(task.status)}{' '}
                        <span style={{fontWeight: 'bold'}}>{task.description}</span>
                        <br />
                        <small className="text-muted">{task.details}</small>
                      </div>
                      <div className="d-flex align-items-center">
                        {getStatusBadge(task.status)}
                        {task.status === 'pending' && !activeTaskId && (
                          <CButton
                            color="primary"
                            size="sm"
                            className="ms-3"
                            onClick={() => {
                              handleStartTask(task.id);
                              window.scrollTo({top: 0, behavior: 'smooth'});
                            }}
                          >
                            Iniciar
                          </CButton>
                        )}
                        {task.status === 'active' && activeTaskId === task.id && (
                          <CButton
                            color="success"
                            size="sm"
                            className="ms-3"
                            onClick={() => {
                              handleCompleteTask(task.id);
                              window.scrollTo({top: 0, behavior: 'smooth'});
                            }}
                          >
                            Concluir
                          </CButton>
                        )}
                        {task.status === 'blocked' && (
                          <CButton color="dark" size="sm" className="ms-3" disabled>
                            Bloqueada
                          </CButton>
                        )}
                      </div>
                    </CListGroupItem>
                  ))}
                </CListGroup>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal para coletar informações */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>{currentTaskForModal ? `Registrar dados para: ${currentTaskForModal.description}` : 'Registrar Dados'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {renderModalContent()}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={() => {
            handleModalSubmit();
            window.scrollTo({top: 0, behavior: 'smooth'});
          }}>
            Confirmar e Iniciar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para preview das tarefas */}
      <CModal visible={modalTarefasVisible} onClose={() => setModalTarefasVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirmação de Cadastro de Lote</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>As seguintes tarefas serão criadas para este lote:</p>
          <CListGroup>
            {tarefasPreview.map((t, idx) => (
              <CListGroupItem key={idx}>
                <strong>{t.tipo.toUpperCase()}</strong>: {t.descricao} <br />
                <span style={{color: '#888'}}>Data: {t.data}</span>
              </CListGroupItem>
            ))}
          </CListGroup>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalTarefasVisible(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleConfirmarCadastroLote}>
            Confirmar e Cadastrar Lote
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

function getNextValidDate() {
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    const day = nextDate.getDay();
    if (day === 1 || day === 5) {
      return nextDate.toISOString().slice(0, 10);
    }
  }
  return today.toISOString().slice(0, 10);
}

export default CadastroLote;