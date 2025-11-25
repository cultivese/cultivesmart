import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CListGroup,
  CListGroupItem,
  CBadge,
  CFormInput,
  CFormLabel,
  CSpinner,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTabs,
  CTabList,
  CTab,
  CTabContent,
  CTabPanel,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilCheckCircle, 
  cilBan, 
  cilLeaf, 
  cilMoon, 
  cilBasket, 
  cilListNumbered,
  cilClock,
  cilCheck
} from '@coreui/icons';
import './CronogramaProducao.css';

// Funções para buscar dados da API
const fetchTarefas = async () => {
  try {
    const response = await fetch('https://backend.cultivesmart.com.br/api/tarefas');
    const data = await response.json();
    return data.records || data || [];
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return [];
  }
};

const fetchPlantios = async () => {
  try {
    const response = await fetch('https://backend.cultivesmart.com.br/api/plantios');
    const data = await response.json();
    return data.records || data || [];
  } catch (error) {
    console.error('Erro ao buscar plantios:', error);
    return [];
  }
};

// Função para filtrar tarefas do dia
const filtrarTarefasDoDia = (tarefas, plantios, dataHoje) => {
  // Usar formatação local segura em vez de toISOString que pode causar problemas de timezone
  const dataHojeStr = `${dataHoje.getFullYear()}-${String(dataHoje.getMonth() + 1).padStart(2, '0')}-${String(dataHoje.getDate()).padStart(2, '0')}`;
  
  const tarefasFiltradas = tarefas
    .filter(tarefa => {
      if (!tarefa.data_agendada) return false;
      const dataTarefa = tarefa.data_agendada.split('T')[0];
      return dataTarefa === dataHojeStr;
    })
    .map(tarefa => {
      // O plantio já vem aninhado na tarefa da API
      const plantio = tarefa.plantio;
      return {
        id: tarefa.id,
        description: tarefa.descricao || `${tarefa.tipo} - ${plantio?.nome || 'Plantio'}`,
        type: tarefa.tipo,
        status: tarefa.status || 'pending',
        plantioId: tarefa.plantio_id,
        plantio: plantio, // Incluir o plantio completo
        details: `${plantio?.nome || 'Plantio'} | Data: ${createLocalDate(tarefa.data_agendada).toLocaleDateString('pt-BR')} | Status: ${tarefa.status || 'pendente'}`
      };
    });
    
  return tarefasFiltradas;
};

const getEventColor = (type) => {
  switch (type) {
    case 'plantio': return '#2ecc40';
    case 'Retirar blackout': return '#222f3e';
    case 'colheita': return '#ff6b35'; // Laranja-avermelhado para diferir do vermelho de atraso
    case 'desempilhamento': return '#f7b731';
    default: return '#b2bec3';
  }
};

// Função para mapear tipos de tarefa para ícones
const getTarefaIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'plantio': return cilLeaf;
    case 'retirar blackout': 
    case 'retirar do blackout': return cilMoon;
    case 'colheita': return cilBasket;
    case 'desempilhamento': return cilListNumbered;
    default: return cilClock;
  }
};

// Função para mapear tipos de tarefa para cores
const getTarefaCor = (type) => {
  switch (type?.toLowerCase()) {
    case 'plantio': return 'success';
    case 'retirar blackout': 
    case 'retirar do blackout': return 'dark';
    case 'colheita': return 'warning';
    case 'desempilhamento': return 'info';
    default: return 'secondary';
  }
};

// Função para obter emoji de status
const getStatusEmoji = (status) => {
  switch (status) {
    case 'completed': return '✅';
    case 'pending': return '⏳';
    case 'overdue': return '⚠️';
    default: return '⏳';
  }
};

// Função para criar data local sem conversão de timezone
const createLocalDate = (dateString) => {
  if (!dateString) return new Date();
  const datePart = dateString.split('T')[0]; // Remove horário se existir
  const [year, month, day] = datePart.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Função para formatar data sem problemas de fuso horário
const formatDateFromString = (dateString) => {
  const date = createLocalDate(dateString);
  
  const monthNames = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  
  const dayNames = [
    'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 
    'quinta-feira', 'sexta-feira', 'sábado'
  ];
  
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const dayOfWeek = date.getDay();
  
  return `${dayNames[dayOfWeek]}, ${day.toString().padStart(2, '0')} de ${monthNames[month]} de ${year}`;
};

// Função para formatar data de plantio (sem problemas de timezone)
const formatPlantioDate = (dateString) => {
  if (!dateString) return 'Data não informada';
  const date = createLocalDate(dateString);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const CronogramaProducao = () => {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [plantiosDaData, setPlantiosDaData] = useState([]);
  const [tarefasDoDia, setTarefasDoDia] = useState([]);
  const [loadingTarefas, setLoadingTarefas] = useState(true);
  const [plantios, setPlantios] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [debugInfo, setDebugInfo] = useState('');
  const [activeTab, setActiveTab] = useState(0); // Estado para controlar a aba ativa
  
  // Estados para o modal de plantio
  const [plantioModalVisible, setPlantioModalVisible] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [bandejasUtilizadas, setBandejasUtilizadas] = useState('');
  const [gramasUtilizadas, setGramasUtilizadas] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados para o modal de blackout
  const [blackoutModalVisible, setBlackoutModalVisible] = useState(false);
  const [tarefaBlackout, setTarefaBlackout] = useState(null);
  
  // Estados para o modal de desempilhamento
  const [desempilhamentoModalVisible, setDesempilhamentoModalVisible] = useState(false);
  const [tarefaDesempilhamento, setTarefaDesempilhamento] = useState(null);
  
  // Estados para o modal de colheita
  const [colheitaModalVisible, setColheitaModalVisible] = useState(false);
  const [tarefaColheita, setTarefaColheita] = useState(null);
  const [totalColhido, setTotalColhido] = useState('');
  const [unidadeColheita, setUnidadeColheita] = useState('kg');
  const [observacoesColheita, setObservacoesColheita] = useState('');

  // Função para recarregar dados do calendário
  const recarregarDados = async () => {
    try {
      // Buscar tarefas e plantios atualizados
      const [tarefasData, plantiosData] = await Promise.all([
        fetchTarefas(),
        fetchPlantios()
      ]);

      // Armazenar dados nos estados
      setTarefas(tarefasData);
      setPlantios(plantiosData);

      // Processar eventos do calendário - agrupar por tipo e data
      const grouped = {};
      tarefasData.forEach(tarefa => {
        const key = `${tarefa.tipo}_${tarefa.data_agendada}`;
        if (!grouped[key]) {
          grouped[key] = {
            tipo: tarefa.tipo,
            data_agendada: tarefa.data_agendada,
            lotes: [],
            tarefas: []
          };
        }
        grouped[key].lotes.push(tarefa.plantio_id);
        grouped[key].tarefas.push(tarefa);
      });

      const eventos = Object.values(grouped).map(grupo => {
        // Verificar se existem tarefas pendentes ou em atraso para esta data/tipo
        const tarefasGrupo = grupo.tarefas;
        
        const tarefasPendentes = tarefasGrupo.filter(t => t.status === 'pending');
        const tarefasConcluidas = tarefasGrupo.filter(t => t.status === 'completed');
        const dataEvento = createLocalDate(grupo.data_agendada);
        const hoje = new Date();
        const isOverdue = dataEvento < hoje && tarefasPendentes.length > 0;
        
        // Criar título com ícones e status
        const statusIcon = tarefasConcluidas.length === tarefasGrupo.length ? '✅' : 
                         isOverdue ? '⚠️' : 
                         tarefasPendentes.length > 0 ? '⏳' : '✅';
        
        return {
          title: `${statusIcon} ${grupo.tipo} (${grupo.lotes.length})`,
          start: grupo.data_agendada,
          color: isOverdue ? '#e74c3c' : 
                 tarefasConcluidas.length === tarefasGrupo.length ? '#27ae60' : 
                 getEventColor(grupo.tipo),
          textColor: '#ffffff',
          borderColor: isOverdue ? '#c0392b' : 
                      tarefasConcluidas.length === tarefasGrupo.length ? '#229954' : 
                      getEventColor(grupo.tipo),
          extendedProps: {
            tipo: grupo.tipo,
            lotes: grupo.lotes,
            data: grupo.data_agendada,
            tarefasPendentes: tarefasPendentes.length,
            tarefasConcluidas: tarefasConcluidas.length,
            totalTarefas: tarefasGrupo.length,
            isOverdue: isOverdue,
            tarefas: tarefasGrupo
          },
        };
      });

      setEvents(eventos);

      // Processar tarefas do dia atual
      const hoje = new Date();
      const tarefasHoje = filtrarTarefasDoDia(tarefasData, plantiosData, hoje);
      setTarefasDoDia(tarefasHoje);

    } catch (error) {
      console.error('Erro ao recarregar dados:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingTarefas(true);
        
        // Buscar tarefas e plantios
        const [tarefasData, plantiosData] = await Promise.all([
          fetchTarefas(),
          fetchPlantios()
        ]);

        // Armazenar dados nos estados
        setTarefas(tarefasData);
        setPlantios(plantiosData);

        // Processar eventos do calendário - agrupar por tipo e data
        const grouped = {};
        tarefasData.forEach(tarefa => {
          const key = `${tarefa.tipo}_${tarefa.data_agendada}`;
          if (!grouped[key]) {
            grouped[key] = {
              tipo: tarefa.tipo,
              data_agendada: tarefa.data_agendada,
              lotes: [],
              tarefas: []
            };
          }
          grouped[key].lotes.push(tarefa.plantio_id);
          grouped[key].tarefas.push(tarefa);
        });

        const eventos = Object.values(grouped).map(grupo => {
          // Verificar se existem tarefas pendentes ou em atraso para esta data/tipo
          const tarefasGrupo = grupo.tarefas;
          
          const tarefasPendentes = tarefasGrupo.filter(t => t.status === 'pending');
          const tarefasConcluidas = tarefasGrupo.filter(t => t.status === 'completed');
          const dataEvento = createLocalDate(grupo.data_agendada);
          const hoje = new Date();
          const isOverdue = dataEvento < hoje && tarefasPendentes.length > 0;
          
          // Criar título com ícones e status
          const statusIcon = tarefasConcluidas.length === tarefasGrupo.length ? '✅' : 
                           isOverdue ? '⚠️' : 
                           tarefasPendentes.length > 0 ? '⏳' : '✅';
          
          return {
            title: `${statusIcon} ${grupo.tipo} (${grupo.lotes.length})`,
            start: grupo.data_agendada,
            color: isOverdue ? '#e74c3c' : 
                   tarefasConcluidas.length === tarefasGrupo.length ? '#27ae60' : 
                   getEventColor(grupo.tipo),
            textColor: '#ffffff',
            borderColor: isOverdue ? '#c0392b' : 
                        tarefasConcluidas.length === tarefasGrupo.length ? '#229954' : 
                        getEventColor(grupo.tipo),
            extendedProps: {
              tipo: grupo.tipo,
              lotes: grupo.lotes,
              data: grupo.data_agendada,
              tarefasPendentes: tarefasPendentes.length,
              tarefasConcluidas: tarefasConcluidas.length,
              totalTarefas: tarefasGrupo.length,
              isOverdue: isOverdue,
              tarefas: tarefasGrupo
            },
          };
        });

        setEvents(eventos);
        
        // Processar tarefas do dia atual
        const hoje = new Date();
        const tarefasHoje = filtrarTarefasDoDia(tarefasData, plantiosData, hoje);
        setTarefasDoDia(tarefasHoje);
        
        // Definir informações de debug
        const dataAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
        setDebugInfo(`Quantidade de tarefas para hoje: ${tarefasHoje.length}`);
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setEvents([]);
        setTarefasDoDia([]);
      } finally {
        setLoadingTarefas(false);
      }
    };
    fetchData();
  }, []);

  // Calcular gramas automaticamente quando bandejas ou especificação mudarem
  useEffect(() => {
    if (tarefaSelecionada?.especificacao && bandejasUtilizadas) {
      const quantidadeBandeja = tarefaSelecionada.especificacao.quantidade_bandeja || 0;
      const gramasCalculadas = (parseFloat(bandejasUtilizadas) || 0) * quantidadeBandeja;
      setGramasUtilizadas(gramasCalculadas.toString());
    } else if (!bandejasUtilizadas) {
      setGramasUtilizadas('');
    }
  }, [bandejasUtilizadas, tarefaSelecionada]);

  // Handler para abrir o modal ao clicar no evento
  const handleEventClick = (info) => {
    console.log('Event clicked:', info.event.extendedProps);
    console.log('Lote ID do evento:', info.event.extendedProps.plantio_id);
    setSelectedEvent(info.event.extendedProps);
    setSelectedDate(info.event.extendedProps.data);
    buscarPlantiosDaData(info.event.extendedProps.data);
    setModalVisible(true);
  };

  // Handler para clicar em uma data (célula do calendário)
  const handleDateClick = (info) => {
    const dataSelecionada = info.dateStr; // Já vem no formato YYYY-MM-DD
    setSelectedDate(dataSelecionada);
    setSelectedEvent(null); // Limpar evento selecionado
    buscarPlantiosDaData(dataSelecionada);
    setModalVisible(true);
  };

  // Função para buscar plantios de uma data específica
  const buscarPlantiosDaData = (data) => {
    const dataFormatada = data.split('T')[0]; // Garantir formato YYYY-MM-DD
    
    // Buscar plantios criados nesta data
    const plantiosDaData = plantios.filter(plantio => {
      if (!plantio.data_plantio) return false;
      const dataPlantio = plantio.data_plantio.split('T')[0];
      return dataPlantio === dataFormatada;
    });

    // Buscar tarefas desta data para todos os plantios
    const tarefasDaData = tarefas.filter(tarefa => {
      if (!tarefa.data_agendada) return false;
      const dataTarefa = tarefa.data_agendada.split('T')[0];
      return dataTarefa === dataFormatada;
    });

    // Se não houver plantios na data, buscar por tarefas que acontecem nesta data
    if (plantiosDaData.length === 0 && tarefasDaData.length > 0) {
      const loteIds = [...new Set(tarefasDaData.map(t => t.plantio_id))];
      const plantiosComTarefas = plantios.filter(p => loteIds.includes(p.id));
      
      const plantiosDetalhados = plantiosComTarefas.map(plantio => {
        const tarefasDoPlantio = tarefas.filter(tarefa => tarefa.plantio_id === plantio.id);
        const tarefaColheita = tarefasDoPlantio.find(t => t.tipo === 'colheita');
        
        return {
          ...plantio,
          dataColheita: tarefaColheita ? tarefaColheita.data_agendada : null,
          tarefasHoje: tarefasDaData.filter(t => t.plantio_id === plantio.id),
          todasTarefas: tarefasDoPlantio
        };
      });
      
      setPlantiosDaData(plantiosDetalhados);
      return;
    }

    // Combinar informações para plantios da data
    const plantiosDetalhados = plantiosDaData.map(plantio => {
      const tarefasDoPlantio = tarefas.filter(tarefa => tarefa.plantio_id === plantio.id);
      const tarefaColheita = tarefasDoPlantio.find(t => t.tipo === 'colheita');
      
      return {
        ...plantio,
        dataColheita: tarefaColheita ? tarefaColheita.data_agendada : null,
        tarefasHoje: tarefasDaData.filter(t => t.plantio_id === plantio.id),
        todasTarefas: tarefasDoPlantio
      };
    });

    setPlantiosDaData(plantiosDetalhados);
  };

  // Função para abrir modal de plantio
  const handlePlantioClick = async (task) => {
    setTarefaSelecionada(task);
    
    // As especificações já vêm na tarefa através do plantio.insumo.especificacoes
    const especificacao = task.plantio?.insumo?.especificacoes?.[0] || null;
    
    if (especificacao) {
      setTarefaSelecionada({
        ...task,
        especificacao
      });
    }
    
    setBandejasUtilizadas(task.plantio?.bandejas_necessarias?.toString() || '');
    
    // Calcular gramas iniciais
    if (especificacao && task.plantio?.bandejas_necessarias) {
      const gramasIniciais = task.plantio.bandejas_necessarias * (especificacao.quantidade_bandeja || 0);
      setGramasUtilizadas(gramasIniciais.toString());
    } else {
      setGramasUtilizadas('');
    }
    
    setPlantioModalVisible(true);
  };

  // Função para abrir modal de confirmação de blackout
  const handleBlackoutClick = (task) => {
    setTarefaBlackout(task);
    setBlackoutModalVisible(true);
  };

  // Função para confirmar retirada do blackout
  const handleConfirmarBlackout = async () => {
    try {
      setIsProcessing(true);

      const response = await fetch(`https://backend.cultivesmart.com.br/api/tarefas/${tarefaBlackout.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          fase: 'pronto_para_colheita'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar tarefa');
      }

      // Atualizar o estado local
      setTarefasDoDia(prevTarefas =>
        prevTarefas.map(tarefa =>
          tarefa.id === tarefaBlackout.id
            ? { ...tarefa, status: 'completed' }
            : tarefa
        )
      );

      // Recarregar dados do calendário para atualizar os eventos
      await recarregarDados();

      setBlackoutModalVisible(false);
      alert('Blackout retirado com sucesso! Fase atualizada.');

    } catch (error) {
      console.error('Erro ao confirmar retirada do blackout:', error);
      alert('Erro ao confirmar retirada do blackout: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Função para abrir modal de confirmação de desempilhamento
  const handleDesempilhamentoClick = (task) => {
    setTarefaDesempilhamento(task);
    setDesempilhamentoModalVisible(true);
  };

  // Função para confirmar desempilhamento
  const handleConfirmarDesempilhamento = async () => {
    try {
      setIsProcessing(true);

      const response = await fetch(`https://backend.cultivesmart.com.br/api/tarefas/${tarefaDesempilhamento.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          fase: 'blackout'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar tarefa');
      }

      // Atualizar o estado local
      setTarefasDoDia(prevTarefas =>
        prevTarefas.map(tarefa =>
          tarefa.id === tarefaDesempilhamento.id
            ? { ...tarefa, status: 'completed' }
            : tarefa
        )
      );

      // Recarregar dados do calendário para atualizar os eventos
      await recarregarDados();

      setDesempilhamentoModalVisible(false);
      alert('Desempilhamento realizado com sucesso! Fase atualizada.');

    } catch (error) {
      console.error('Erro ao confirmar desempilhamento:', error);
      alert('Erro ao confirmar desempilhamento: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Função para abrir modal de confirmação de colheita
  const handleColheitaClick = (task) => {
    // Se a tarefa não tem plantio completo, buscar pelos dados disponíveis
    if (!task.plantio && task.plantio_id) {
      const plantioCompleto = plantios.find(p => p.id === task.plantio_id);
      const tarefaCompleta = {
        ...task,
        plantio: plantioCompleto,
        description: task.description || `Colheita - Lote ${task.plantio_id}`,
        plantio_id: task.plantio_id
      };
      setTarefaColheita(tarefaCompleta);
    } else {
      setTarefaColheita(task);
    }
    
    setTotalColhido('');
    setUnidadeColheita('kg');
    setObservacoesColheita('');
    setColheitaModalVisible(true);
  };

  // Função para confirmar colheita
  const handleConfirmarColheita = async () => {
    if (!totalColhido || parseFloat(totalColhido) <= 0) {
      alert('Por favor, informe uma quantidade válida para o total colhido.');
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Atualizar a tarefa de colheita
      const tarefaResponse = await fetch(`https://backend.cultivesmart.com.br/api/tarefas/${tarefaColheita.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          fase: 'concluido',
          total_colhido: parseFloat(totalColhido),
          unidade_colheita: unidadeColheita,
          observacoes_colheita: observacoesColheita.trim() || 'Colheita realizada com sucesso'
        }),
      });

      if (!tarefaResponse.ok) {
        throw new Error('Erro ao atualizar tarefa de colheita');
      }

      // 2. Atualizar o plantio com o total colhido
      const plantioId = tarefaColheita.plantio_id || tarefaColheita.plantio?.id;
      if (plantioId) {
        const plantioResponse = await fetch(`https://backend.cultivesmart.com.br/api/plantios/${plantioId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            total_colhido: parseFloat(totalColhido),
            unidade_colheita: unidadeColheita,
            data_colheita: new Date().toISOString().split('T')[0], // Data atual no formato YYYY-MM-DD
            observacoes_colheita: observacoesColheita.trim() || 'Colheita realizada com sucesso',
            status: 'concluido' // Marcar plantio como concluído
          }),
        });

        if (!plantioResponse.ok) {
          console.warn('Erro ao atualizar plantio:', await plantioResponse.text());
          // Não vamos interromper o processo se falhar a atualização do plantio
          // pois a tarefa já foi atualizada com sucesso
        }
      }

      // Atualizar o estado local
      setTarefasDoDia(prevTarefas =>
        prevTarefas.map(tarefa =>
          tarefa.id === tarefaColheita.id
            ? { ...tarefa, status: 'completed' }
            : tarefa
        )
      );

      // Recarregar dados do calendário para atualizar os eventos
      await recarregarDados();

      setColheitaModalVisible(false);
      alert(`Colheita registrada com sucesso! Total colhido: ${totalColhido}${unidadeColheita}`);

    } catch (error) {
      console.error('Erro ao confirmar colheita:', error);
      alert('Erro ao confirmar colheita: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Função para calcular gramas utilizadas
  const calcularGramasUtilizadas = (bandejas, quantidadeBandeja) => {
    const numBandejas = parseFloat(bandejas) || 0;
    const gramasPorBandeja = parseFloat(quantidadeBandeja) || 0;
    return numBandejas * gramasPorBandeja;
  };

  // Função para confirmar plantio
  const handleConfirmarPlantio = async () => {
    if (!bandejasUtilizadas || parseFloat(bandejasUtilizadas) <= 0) {
      alert('Por favor, informe uma quantidade válida de bandejas utilizadas.');
      return;
    }

    setIsProcessing(true);

    try {
      // Usar o valor editável das gramas em vez do calculado
      const gramasParaEnviar = parseFloat(gramasUtilizadas) || 0;
      
      // 1. Atualizar o status da tarefa para concluída
      const response = await fetch(`https://backend.cultivesmart.com.br/api/tarefas/${tarefaSelecionada.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          bandejas_utilizadas: parseFloat(bandejasUtilizadas),
          gramas_utilizadas: gramasParaEnviar,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar tarefa');
      }

      if (gramasParaEnviar > 0 && tarefaSelecionada.plantio?.insumo?.id) {
      try {

        const estoqueResponse = await fetch(`https://backend.cultivesmart.com.br/api/estoque/${tarefaSelecionada.plantio?.insumo?.id}/withdraw`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            quantidade_retirada: gramasParaEnviar,
            motivo: `Plantio executado - Lote #${tarefaSelecionada.plantio_id || tarefaSelecionada.plantioId}`,
          }),
        });

        if (!estoqueResponse.ok) {
          const errorData = await estoqueResponse.text();
          console.warn('Erro ao fazer retirada do estoque:', errorData);
          // Não vamos interromper o processo se falhar a retirada do estoque
          // pois a tarefa já foi atualizada com sucesso
          alert(`Plantio confirmado! Porém houve um problema na retirada do estoque: ${errorData}`);
        } else {
          console.log('Retirada do estoque realizada com sucesso');
        }
      } catch (estoqueError) {
        console.warn('Erro ao fazer retirada do estoque:', estoqueError);
        // Não interromper o processo principal
      }
    } else {
      console.warn('Não foi possível fazer retirada do estoque: gramas utilizadas ou ID do insumo não disponível');
    }

      // Atualizar o estado local
      setTarefasDoDia(prevTarefas =>
        prevTarefas.map(tarefa =>
          tarefa.id === tarefaSelecionada.id
            ? { ...tarefa, status: 'completed' }
            : tarefa
        )
      );

      // Recarregar dados do calendário para atualizar os eventos
      await recarregarDados();

      setPlantioModalVisible(false);
      alert(`Plantio confirmado! Utilizadas ${bandejasUtilizadas} bandejas (${gramasParaEnviar}g)`);

    } catch (error) {
      console.error('Erro ao confirmar plantio:', error);
      alert('Erro ao confirmar plantio: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
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

  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h4>Cronograma de Produção</h4>
            </CCardHeader>
            <CCardBody>
              <CRow className="justify-content-center">
                <CCol md={12} lg={12}>
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale="pt-br"
                    events={events}
                    height={600}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                    eventContent={(eventInfo) => {
                      const { extendedProps } = eventInfo.event;
                      const isCompleted = extendedProps.tarefasConcluidas === extendedProps.totalTarefas;
                      const isOverdue = extendedProps.isOverdue;
                      
                      return (
                        <div 
                          className={`fc-event-content ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            padding: '2px 4px',
                            borderRadius: '3px',
                            backgroundColor: isOverdue ? '#e74c3c' : 
                                           isCompleted ? '#27ae60' : 
                                           getEventColor(extendedProps.tipo),
                          }}
                        >
                          <span style={{ marginRight: '4px', fontSize: '12px' }}>
                            {extendedProps.tipo === 'plantio' ? '🌱' :
                             extendedProps.tipo === 'Retirar blackout' ? '🌙' :
                             extendedProps.tipo === 'colheita' ? '🧺' :
                             extendedProps.tipo === 'desempilhamento' ? '📋' : '⏰'}
                          </span>
                          <span style={{ flexGrow: 1 }}>
                            {extendedProps.tipo} ({extendedProps.lotes?.length || 0})
                          </span>
                          <span style={{ marginLeft: '4px', fontSize: '10px' }}>
                            {isCompleted ? '✅' : 
                             isOverdue ? '⚠️' : 
                             extendedProps.tarefasPendentes > 0 ? '⏳' : '✅'}
                          </span>
                        </div>
                      );
                    }}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Seção de Tarefas do Dia */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5 style={{fontWeight: 'bold', fontSize: '1.2em'}}>
                Tarefas do Dia - {new Date().toLocaleDateString('pt-BR', {weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'})}
              </h5>
              {debugInfo && (
                <small className="text-muted d-block mt-1">
                  {debugInfo}
                </small>
              )}
            </CCardHeader>
            <CCardBody>
              {loadingTarefas ? (
                <p style={{color: '#888'}}>Carregando tarefas...</p>
              ) : tarefasDoDia.length === 0 ? (
                <p style={{color: '#888'}}>Nenhuma tarefa agendada para hoje.</p>
              ) : (
                <CListGroup>
                  {tarefasDoDia.map((task) => {
                    // Debug: verificar o tipo da tarefa
                    console.log('Task type:', task.type, 'Status:', task.status, 'ID:', task.id);
                    return (
                    <CListGroupItem
                      key={task.id}
                      className={`d-flex justify-content-between align-items-center ${
                        task.status === 'completed' ? 'list-group-item-success' : ''
                      } ${task.status === 'active' ? 'list-group-item-info' : ''}`}
                      style={{fontSize: '1.05em'}}
                    >
                      <div className="d-flex align-items-start">
                        <div className="me-3">
                          <CIcon 
                            icon={getTarefaIcon(task.type)} 
                            className={`text-${getTarefaCor(task.type)}`} 
                            size="lg"
                          />
                        </div>
                        <div>
                          <div className="d-flex align-items-center mb-1">
                            <span style={{fontWeight: 'bold', fontSize: '1.1em'}}>
                              {task.type?.charAt(0).toUpperCase() + task.type?.slice(1)}
                            </span>
                            <span style={{ marginLeft: '8px', fontSize: '14px' }}>
                              {task.status === 'completed' ? '✅' : 
                               task.status === 'pending' ? '⏳' : '🔄'}
                            </span>
                          </div>
                          <div style={{fontWeight: '500', color: '#495057'}}>
                            {task.description}
                          </div>
                          <small className="text-muted">{task.details}</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        {getStatusBadge(task.status)}
                        {task.type === 'plantio' && task.status === 'pending' && (
                          <CButton 
                            color="success" 
                            size="sm" 
                            className="ms-2"
                            onClick={() => handlePlantioClick(task)}
                          >
                            Executar Plantio
                          </CButton>
                        )}
                        {(task.type === 'Retirar blackout' || task.type === 'retirar blackout' || task.type?.toLowerCase().includes('blackout')) && task.status === 'pending' && (
                          <CButton 
                            color="dark" 
                            size="sm" 
                            className="ms-2"
                            onClick={() => handleBlackoutClick(task)}
                          >
                            Retirar Blackout
                          </CButton>
                        )}
                        {task.type === 'desempilhamento' && task.status === 'pending' && (
                          <CButton 
                            color="info" 
                            size="sm" 
                            className="ms-2"
                            onClick={() => handleDesempilhamentoClick(task)}
                          >
                            Desempilhar
                          </CButton>
                        )}
                        {task.type === 'colheita' && task.status === 'pending' && (
                          <CButton 
                            color="warning" 
                            size="sm" 
                            className="ms-2"
                            onClick={() => handleColheitaClick(task)}
                          >
                            Realizar Colheita
                          </CButton>
                        )}
                        {task.status === 'completed' && (
                          <span className="ms-3 text-success" style={{fontSize: '0.9em'}}>
                            ✓ Concluída
                          </span>
                        )}
                      </div>
                    </CListGroupItem>
                    );
                  })}
                </CListGroup>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="xl">
        <CModalHeader closeButton>
          <h4 className="modal-title">
            {selectedEvent 
              ? `${selectedEvent.tipo.charAt(0).toUpperCase() + selectedEvent.tipo.slice(1)} - ${formatDateFromString(selectedDate)}`
              : `Lotes e Plantios - ${selectedDate ? formatDateFromString(selectedDate) : ''}`
            }
          </h4>
        </CModalHeader>
        <CModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {selectedEvent ? (
            // Exibir cronograma de tarefas similar ao modal de simulação
            <div className="event-details">

              {/* Cronograma de Tarefas */}
              <div className="mb-4">
                <CCard>
                  <CCardHeader>
                    <h6 className="mb-0 d-flex align-items-center">
                      <CIcon icon={getTarefaIcon(selectedEvent.tipo)} className={`text-${getTarefaCor(selectedEvent.tipo)} me-2`} />
                      Cronograma de Tarefas - {selectedEvent.tipo.charAt(0).toUpperCase() + selectedEvent.tipo.slice(1)}
                    </h6>
                  </CCardHeader>
                  <CCardBody>
                    <div className="mb-3">
                      <small className="text-muted">
                        Detalhes das tarefas agendadas para esta data ({selectedEvent.lotes?.length || 0} lotes)
                      </small>
                    </div>
                    
                    {/* Sistema de Abas por Lote */}
                    {(() => {
                      // Agrupar tarefas por lote
                      const lotesTarefas = {};
                      selectedEvent.lotes.forEach(loteId => {
                        const tarefasDoLote = tarefas.filter(tarefa => 
                          tarefa.plantio_id === loteId
                        ).sort((a, b) => {
                          const dataCompare = createLocalDate(a.data_agendada) - createLocalDate(b.data_agendada);
                          if (dataCompare !== 0) return dataCompare;
                          const tipoOrder = { 'plantio': 1, 'desempilhamento': 2, 'Retirar blackout': 3, 'colheita': 4 };
                          return (tipoOrder[a.tipo] || 5) - (tipoOrder[b.tipo] || 5);
                        });
                        
                        if (tarefasDoLote.length > 0) {
                          const plantio = plantios.find(p => p.id === loteId);
                          lotesTarefas[loteId] = {
                            plantio,
                            tarefas: tarefasDoLote
                          };
                        }
                      });

                      const lotesIds = Object.keys(lotesTarefas);
                      
                      if (lotesIds.length === 0) {
                        return (
                          <div className="text-center py-4">
                            <p className="text-muted">Nenhuma tarefa encontrada para os lotes deste evento.</p>
                          </div>
                        );
                      }

                      return (
                        <CTabs activeItemKey={activeTab} onActiveItemChange={setActiveTab}>
                          <CTabList variant="tabs">
                            {lotesIds.map((loteId, index) => {
                              const { plantio, tarefas: tarefasLote } = lotesTarefas[loteId];
                              const tarefasPendentes = tarefasLote.filter(t => t.status === 'pending').length;
                              const tarefasConcluidas = tarefasLote.filter(t => t.status === 'completed').length;
                              const tarefasAtrasadas = tarefasLote.filter(t => 
                                t.status === 'pending' && createLocalDate(t.data_agendada) < new Date()
                              ).length;
                              
                              return (
                                <CTab key={index} itemKey={index}>
                                  <div className="d-flex align-items-center">
                                    <strong>Lote #{loteId}</strong>
                                    {plantio?.variedade && (
                                      <span className="ms-2 text-muted small">- {plantio.variedade}</span>
                                    )}
                                    <CBadge 
                                      color={tarefasAtrasadas > 0 ? 'danger' : tarefasPendentes > 0 ? 'warning' : 'success'} 
                                      className="ms-2"
                                    >
                                      {tarefasConcluidas}/{tarefasLote.length}
                                    </CBadge>
                                  </div>
                                </CTab>
                              );
                            })}
                          </CTabList>
                          
                          <CTabContent>
                            {lotesIds.map((loteId, index) => {
                              const { plantio, tarefas: tarefasLote } = lotesTarefas[loteId];
                              
                              return (
                                <CTabPanel key={index} itemKey={index} className="py-3">
                                  {/* Informações do Lote */}
                                  <div className="mb-4 p-3 bg-light rounded">
                                    <CRow>
                                      <CCol md={6}>
                                        <h6 className="text-primary mb-2">
                                          <CIcon icon={getTarefaIcon('plantio')} className="me-2" />
                                          Informações do Lote #{loteId}
                                        </h6>
                                        <div className="mb-2">
                                          <strong className="text-muted small">VARIEDADE:</strong>
                                          <div>{plantio?.variedade || 'Não especificado'}</div>
                                        </div>
                                        <div className="mb-2">
                                          <strong className="text-muted small">DATA DO PLANTIO:</strong>
                                          <div>{plantio?.data_plantio ? formatPlantioDate(plantio.data_plantio) : 'Não informado'}</div>
                                        </div>
                                      </CCol>
                                      <CCol md={6}>
                                        <div className="mb-2">
                                          <strong className="text-muted small">BANDEJAS:</strong>
                                          <div>{plantio?.bandejas_necessarias || 'N/A'} bandejas</div>
                                        </div>
                                        <div className="mb-2">
                                          <strong className="text-muted small">STATUS:</strong>
                                          <div>
                                            <CBadge color={plantio?.status === 'ativo' ? 'success' : 'secondary'}>
                                              {plantio?.status?.toUpperCase() || 'N/A'}
                                            </CBadge>
                                          </div>
                                        </div>
                                      </CCol>
                                    </CRow>
                                  </div>

                                  {/* Tabela de Tarefas do Lote */}
                                  <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                      <thead>
                                        <tr>
                                          <th>Tipo de Tarefa</th>
                                          <th>Data Agendada</th>
                                          <th>Status</th>
                                          <th>Ações</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {tarefasLote.map((tarefa, tarefaIndex) => {
                                          const isOverdue = createLocalDate(tarefa.data_agendada) < new Date() && tarefa.status === 'pending';
                                          const isOriginalTask = tarefa.tipo === selectedEvent.tipo && tarefa.data_agendada === selectedEvent.data;
                                          
                                          return (
                                            <tr key={tarefaIndex} className={`${tarefa.status === 'completed' ? 'table-success' : isOverdue ? 'table-warning' : ''} ${isOriginalTask ? 'table-info' : ''}`}>
                                              <td>
                                                <div className="d-flex align-items-center">
                                                  <CIcon 
                                                    icon={getTarefaIcon(tarefa.tipo)} 
                                                    className={`text-${getTarefaCor(tarefa.tipo)} me-2`} 
                                                  />
                                                  <span className="fw-semibold">
                                                    {tarefa.tipo.charAt(0).toUpperCase() + tarefa.tipo.slice(1)}
                                                  </span>
                                                  {isOriginalTask && (
                                                    <span className="ms-2 badge bg-primary">Evento Original</span>
                                                  )}
                                                </div>
                                              </td>
                                              <td>
                                                <div className={`fw-semibold ${isOverdue ? 'text-warning' : createLocalDate(tarefa.data_agendada).toDateString() === new Date().toDateString() ? 'text-primary' : 'text-muted'}`}>
                                                  {formatPlantioDate(tarefa.data_agendada)}
                                                  {createLocalDate(tarefa.data_agendada).toDateString() === new Date().toDateString() && (
                                                    <small className="ms-2 badge bg-primary">Hoje</small>
                                                  )}
                                                  {isOverdue && (
                                                    <small className="ms-2 badge bg-warning">Atrasada</small>
                                                  )}
                                                </div>
                                              </td>
                                              <td>
                                                <div className="d-flex align-items-center">
                                                  <span className="me-2">
                                                    {tarefa.status === 'completed' ? '✅' : 
                                                     isOverdue ? '⚠️' : 
                                                     tarefa.status === 'pending' ? '⏳' : '🔄'}
                                                  </span>
                                                  {getStatusBadge(tarefa.status)}
                                                </div>
                                              </td>
                                              <td>
                                                {tarefa.status === 'pending' && (
                                                  <>
                                                    {tarefa.tipo === 'plantio' && (
                                                      <CButton 
                                                        color="success" 
                                                        size="sm"
                                                        onClick={() => {
                                                          const tarefaCompleta = {
                                                            ...tarefa,
                                                            description: `Plantio do lote ${tarefa.plantio_id}`,
                                                            details: `Lote ${tarefa.plantio_id} - ${plantio?.variedade || 'Variedade não especificada'}`,
                                                            plantio: plantio
                                                          };
                                                          handlePlantioClick(tarefaCompleta);
                                                        }}
                                                      >
                                                        <CIcon icon={getTarefaIcon('plantio')} className="me-1" size="sm" />
                                                        Executar
                                                      </CButton>
                                                    )}
                                                    {(tarefa.tipo === 'Retirar blackout' || tarefa.tipo === 'retirar blackout' || tarefa.tipo?.toLowerCase().includes('blackout')) && (
                                                      <CButton 
                                                        color="dark" 
                                                        size="sm"
                                                        onClick={() => {
                                                          const tarefaCompleta = {
                                                            ...tarefa,
                                                            description: `Retirar blackout - Lote ${tarefa.plantio_id}`,
                                                            plantio: plantio
                                                          };
                                                          handleBlackoutClick(tarefaCompleta);
                                                        }}
                                                      >
                                                        <CIcon icon={getTarefaIcon('Retirar blackout')} className="me-1" size="sm" />
                                                        Retirar
                                                      </CButton>
                                                    )}
                                                    {tarefa.tipo === 'desempilhamento' && (
                                                      <CButton 
                                                        color="info" 
                                                        size="sm"
                                                        onClick={() => {
                                                          const tarefaCompleta = {
                                                            ...tarefa,
                                                            description: `Desempilhamento - Lote ${tarefa.plantio_id}`,
                                                            plantio: plantio
                                                          };
                                                          handleDesempilhamentoClick(tarefaCompleta);
                                                        }}
                                                      >
                                                        <CIcon icon={getTarefaIcon('desempilhamento')} className="me-1" size="sm" />
                                                        Desempilhar
                                                      </CButton>
                                                    )}
                                                    {(tarefa.tipo === 'colheita') && (
                                                      <CButton 
                                                        color="warning" 
                                                        size="sm"
                                                        onClick={() => {
                                                          const tarefaCompleta = {
                                                            ...tarefa,
                                                            description: `Colheita - Lote ${tarefa.plantio_id}`,
                                                            plantio: plantio
                                                          };
                                                          handleColheitaClick(tarefaCompleta);
                                                        }}
                                                      >
                                                        <CIcon icon={getTarefaIcon('colheita')} className="me-1" size="sm" />
                                                        Colher
                                                      </CButton>
                                                    )}
                                                  </>
                                                )}
                                                {tarefa.status === 'completed' && (
                                                  <CBadge color="success" className="d-flex align-items-center">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="me-1">
                                                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                                    </svg>
                                                    Concluída
                                                  </CBadge>
                                                )}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* Resumo Estatístico do Lote */}
                                  <div className="mt-3 p-3 bg-light rounded">
                                    <h6 className="mb-2">Resumo do Lote #{loteId}:</h6>
                                    {(() => {
                                      const totalTarefas = tarefasLote.length;
                                      const tarefasConcluidas = tarefasLote.filter(t => t.status === 'completed').length;
                                      const tarefasPendentes = tarefasLote.filter(t => t.status === 'pending').length;
                                      const tarefasAtrasadas = tarefasLote.filter(t => 
                                        t.status === 'pending' && createLocalDate(t.data_agendada) < new Date()
                                      ).length;

                                      return (
                                        <CRow>
                                          <CCol md={3} className="text-center">
                                            <div className="stat-item">
                                              <div className="stat-number text-primary fw-bold fs-5">
                                                {totalTarefas}
                                              </div>
                                              <div className="stat-label text-muted small">TOTAL</div>
                                            </div>
                                          </CCol>
                                          <CCol md={3} className="text-center">
                                            <div className="stat-item">
                                              <div className="stat-number text-success fw-bold fs-5">
                                                {tarefasConcluidas}
                                              </div>
                                              <div className="stat-label text-muted small">CONCLUÍDAS</div>
                                            </div>
                                          </CCol>
                                          <CCol md={3} className="text-center">
                                            <div className="stat-item">
                                              <div className="stat-number text-warning fw-bold fs-5">
                                                {tarefasPendentes}
                                              </div>
                                              <div className="stat-label text-muted small">PENDENTES</div>
                                            </div>
                                          </CCol>
                                          <CCol md={3} className="text-center">
                                            <div className="stat-item">
                                              <div className="stat-number text-danger fw-bold fs-5">
                                                {tarefasAtrasadas}
                                              </div>
                                              <div className="stat-label text-muted small">EM ATRASO</div>
                                            </div>
                                          </CCol>
                                        </CRow>
                                      );
                                    })()}
                                  </div>
                                </CTabPanel>
                              );
                            })}
                          </CTabContent>
                        </CTabs>
                      );
                    })()}
                  </CCardBody>
                </CCard>
              </div>
            </div>
          ) : (
            // Exibir plantios da data selecionada com detalhes completos
            <div className="plantios-container">
              {plantiosDaData.length === 0 ? (
                <div className="empty-state text-center py-5">
                  <div className="mb-3">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto text-muted">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h5 className="text-muted">Nenhum lote encontrado</h5>
                  <p className="text-muted mb-0">Não há plantios ou tarefas agendadas para esta data.</p>
                </div>
              ) : (
                <div className="lotes-grid">
                  {plantiosDaData.map((plantio, index) => (
                    <div key={plantio.id} className="lote-section mb-4">
                      {/* Header da Seção do Lote */}
                      <div className="lote-header d-flex align-items-center justify-content-between p-3 bg-success text-white rounded-top">
                        <div className="d-flex align-items-center">
                          <div className="lote-icon me-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                              <path d="M2 17L12 22L22 17"/>
                              <path d="M2 12L12 17L22 12"/>
                            </svg>
                          </div>
                          <div>
                            <h5 className="mb-0">Lote #{plantio.id}</h5>
                            <small className="opacity-75">{plantio.nome || plantio.descricao || `Plantio ${plantio.id}`}</small>
                          </div>
                        </div>
                        <CBadge 
                          color={plantio.status === 'ativo' ? 'light' : 
                                 plantio.status === 'concluido' ? 'primary' : 'secondary'}
                          className="fs-6 px-3 py-2"
                        >
                          {plantio.status?.toUpperCase() || 'N/A'}
                        </CBadge>
                      </div>

                      {/* Conteúdo da Seção do Lote */}
                      <div className="lote-body border border-success border-top-0 rounded-bottom">
                        
                        {/* Seção de Insumos e Notas Fiscais */}
                        <div className="insumos-section p-3 border-bottom bg-light">
                          <h6 className="text-primary mb-3 d-flex align-items-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                              <path d="M9 11H7V9H9V11ZM13 11H11V9H13V11ZM17 11H15V9H17V11ZM19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z"/>
                            </svg>
                            Insumos e Origem
                          </h6>
                          
                          {plantio.insumos && plantio.insumos.length > 0 ? (
                            <div className="insumos-grid">
                              {plantio.insumos.map((insumo, idx) => (
                                <div key={idx} className="insumo-card border rounded p-3 mb-3 bg-white">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="insumo-info">
                                        <h6 className="text-success mb-2 d-flex align-items-center">
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                                          </svg>
                                          {insumo.nome || 'Insumo não identificado'}
                                        </h6>
                                        <div className="insumo-details">
                                          <div className="mb-2">
                                            <strong className="text-muted small">VARIEDADE:</strong>
                                            <div>{insumo.variedade || plantio.variedade || 'Não especificado'}</div>
                                          </div>
                                          <div className="mb-2">
                                            <strong className="text-muted small">QUANTIDADE NECESSÁRIA:</strong>
                                            <div className="text-primary fw-bold">
                                              {insumo.quantidade_necessaria || (plantio.bandejas_necessarias * (insumo.gramas_por_bandeja || 0))}g
                                              {insumo.gramas_por_bandeja && (
                                                <small className="text-muted ms-2">
                                                  ({plantio.bandejas_necessarias || 0} bandejas × {insumo.gramas_por_bandeja}g)
                                                </small>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="nota-fiscal-info">
                                        <h6 className="text-warning mb-2 d-flex align-items-center">
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                          </svg>
                                          Nota Fiscal
                                        </h6>
                                        <div className="nf-details">
                                          <div className="mb-1">
                                            <strong className="text-muted small">NÚMERO:</strong>
                                            <div>{insumo.nota_fiscal?.numero || 'Não informado'}</div>
                                          </div>
                                          <div className="mb-1">
                                            <strong className="text-muted small">FORNECEDOR:</strong>
                                            <div>{insumo.nota_fiscal?.fornecedor || insumo.fornecedor || 'Não informado'}</div>
                                          </div>
                                          <div className="mb-1">
                                            <strong className="text-muted small">DATA DE ENTRADA:</strong>
                                            <div>{insumo.nota_fiscal?.data_entrada ? 
                                              formatPlantioDate(insumo.nota_fiscal.data_entrada) : 'Não informado'}</div>
                                          </div>
                                          <div className="mb-1">
                                            <strong className="text-muted small">ESTOQUE DISPONÍVEL:</strong>
                                            <div className={`fw-bold ${(insumo.estoque_disponivel || 0) >= (insumo.quantidade_necessaria || 0) ? 'text-success' : 'text-danger'}`}>
                                              {insumo.estoque_disponivel || 0}g
                                              {insumo.quantidade_necessaria && (
                                                <small className="ms-2">
                                                  ({(insumo.estoque_disponivel || 0) >= (insumo.quantidade_necessaria || 0) ? '✓' : '⚠'} 
                                                  {(insumo.estoque_disponivel || 0) >= (insumo.quantidade_necessaria || 0) ? ' Suficiente' : ' Insuficiente'})
                                                </small>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="alert alert-warning">
                              <strong>Atenção:</strong> Não foram encontrados insumos cadastrados para este lote.
                            </div>
                          )}
                        </div>

                        {/* Informações Principais do Plantio */}
                        <div className="info-section p-3 border-bottom">
                          <h6 className="text-info mb-3 d-flex align-items-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                            </svg>
                            Detalhes do Plantio
                          </h6>
                          <CRow>
                            <CCol md={4} className="mb-3">
                              <div className="info-item">
                                <div className="info-icon text-success mb-2">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M8 2V6H16V2" stroke="currentColor" strokeWidth="2"/>
                                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
                                  </svg>
                                </div>
                                <div className="info-label text-muted small fw-bold">DATA DO PLANTIO</div>
                                <div className="info-value fw-semibold">
                                  {formatPlantioDate(plantio.data_plantio)}
                                </div>
                              </div>
                            </CCol>

                            <CCol md={4} className="mb-3">
                              <div className="info-item">
                                <div className="info-icon text-warning mb-2">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L22 7L12 12L2 7L12 2Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/>
                                  </svg>
                                </div>
                                <div className="info-label text-muted small fw-bold">DATA DE COLHEITA</div>
                                <div className="info-value fw-semibold">
                                  {plantio.dataColheita ? 
                                    formatPlantioDate(plantio.dataColheita)
                                    : <span className="text-muted">Não agendada</span>
                                  }
                                </div>
                              </div>
                            </CCol>

                            <CCol md={4} className="mb-3">
                              <div className="info-item">
                                <div className="info-icon text-info mb-2">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2"/>
                                  </svg>
                                </div>
                                <div className="info-label text-muted small fw-bold">QUANTIDADE</div>
                                <div className="info-value fw-semibold">
                                  {plantio.quantidade || plantio.bandejas_necessarias || 'N/A'} bandejas
                                </div>
                              </div>
                            </CCol>
                          </CRow>
                        </div>

                        {/* Resumo de Quantidades */}
                        <div className="resumo-section p-3 border-bottom bg-info bg-opacity-10">
                          <h6 className="text-info mb-3 d-flex align-items-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,4.89 20.1,3 19,3M19,5V19H5V5H19Z"/>
                            </svg>
                            Resumo de Consumo
                          </h6>
                          <CRow>
                            <CCol md={4} className="text-center">
                              <div className="resumo-item">
                                <div className="resumo-number text-primary fw-bold fs-4">
                                  {plantio.bandejas_necessarias || 0}
                                </div>
                                <div className="resumo-label text-muted small">BANDEJAS PLANEJADAS</div>
                              </div>
                            </CCol>
                            <CCol md={4} className="text-center">
                              <div className="resumo-item">
                                <div className="resumo-number text-success fw-bold fs-4">
                                  {plantio.insumos?.reduce((total, insumo) => 
                                    total + (insumo.quantidade_necessaria || 0), 0) || 0}g
                                </div>
                                <div className="resumo-label text-muted small">TOTAL DE GRAMAS</div>
                              </div>
                            </CCol>
                            <CCol md={4} className="text-center">
                              <div className="resumo-item">
                                <div className="resumo-number text-warning fw-bold fs-4">
                                  {plantio.insumos?.length || 0}
                                </div>
                                <div className="resumo-label text-muted small">TIPOS DE INSUMOS</div>
                              </div>
                            </CCol>
                          </CRow>
                        </div>

                        {/* Tarefas de Hoje */}
                        {plantio.tarefasHoje && plantio.tarefasHoje.length > 0 && (
                          <div className="tarefas-hoje-section p-3 bg-primary bg-opacity-10 border-top">
                            <h6 className="text-primary mb-3 d-flex align-items-center">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.5 10.84L4.84 5.17L7.5 2.5L6 1L0 7V9H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9H21ZM5 19V9H19V19H5Z"/>
                              </svg>
                              Tarefas Agendadas para Hoje
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                              {plantio.tarefasHoje.map((tarefa) => (
                                <CBadge 
                                  key={tarefa.id} 
                                  color={getTarefaCor(tarefa.tipo)}
                                  className="px-3 py-2 fs-6 d-flex align-items-center"
                                >
                                  <CIcon 
                                    icon={getTarefaIcon(tarefa.tipo)} 
                                    className="me-2" 
                                    size="sm"
                                  />
                                  {tarefa.tipo.toUpperCase()}
                                  {tarefa.status === 'completed' && (
                                    <span className="ms-2">✅</span>
                                  )}
                                  {tarefa.status === 'pending' && (
                                    <span className="ms-2">⏳</span>
                                  )}
                                </CBadge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Timeline de Tarefas */}
                        {plantio.todasTarefas && plantio.todasTarefas.length > 0 && (
                          <div className="timeline-section p-3 border-top">
                            <h6 className="text-muted mb-3 d-flex align-items-center">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                <path d="M9 11H7V9H9V11ZM13 11H11V9H13V11ZM17 11H15V9H17V11ZM19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z"/>
                              </svg>
                              Cronograma Completo
                            </h6>
                            <div className="timeline">
                              {plantio.todasTarefas
                                .sort((a, b) => createLocalDate(a.data_agendada) - createLocalDate(b.data_agendada))
                                .map((tarefa, idx) => (
                                  <div key={tarefa.id} className="timeline-item d-flex align-items-center py-2">
                                    <div className={`timeline-dot me-3 rounded-circle bg-${
                                      tarefa.tipo === 'plantio' ? 'success' : 
                                      tarefa.tipo === 'colheita' ? 'warning' : 
                                      tarefa.tipo === 'Retirar blackout' ? 'dark' :
                                      tarefa.tipo === 'desempilhamento' ? 'info' : 'secondary'
                                    }`} style={{ width: '8px', height: '8px' }}></div>
                                    <div className="flex-grow-1 d-flex justify-content-between align-items-center">
                                      <span className="fw-semibold text-capitalize">{tarefa.tipo}</span>
                                      <small className="text-muted">
                                        {formatPlantioDate(tarefa.data_agendada)}
                                      </small>
                                    </div>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter className="border-top">
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Fechar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de Plantio */}
      <CModal visible={plantioModalVisible} onClose={() => setPlantioModalVisible(false)} size="lg">
        <CModalHeader closeButton>
          <h4 className="modal-title">Executar Plantio</h4>
        </CModalHeader>
        <CModalBody>
          {tarefaSelecionada && (
            <div>
              <div className="mb-3">
                <h5>{tarefaSelecionada.description}</h5>
                <p className="text-muted">{tarefaSelecionada.details}</p>
              </div>

              {tarefaSelecionada.especificacao && (
                <div className="mb-4 p-3 bg-light rounded">
                  <h6 className="mb-3">Especificações do Insumo:</h6>
                  <div className="row">
                    <div className="col-md-4">
                      <strong>Insumo:</strong>
                      <div>{tarefaSelecionada.plantio?.insumo?.nome} {tarefaSelecionada.plantio?.variedade}</div>
                    </div>
                    <div className="col-md-4">
                      <strong>Gramas por bandeja:</strong>
                      <div>{tarefaSelecionada.especificacao.quantidade_bandeja || 'Não especificado'}g</div>
                    </div>
                    <div className="col-md-4">
                      <strong>Bandejas planejadas:</strong>
                      <div>{tarefaSelecionada.plantio?.bandejas_necessarias || 'N/A'} bandejas</div>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-md-12">
                      <strong>Total de gramas planejado:</strong>
                      <div className="text-primary">
                        {(tarefaSelecionada.plantio?.bandejas_necessarias || 0) * (tarefaSelecionada.especificacao.quantidade_bandeja || 0)}g
                        <small className="text-muted ms-2">
                          ({tarefaSelecionada.plantio?.bandejas_necessarias || 0} bandejas × {tarefaSelecionada.especificacao.quantidade_bandeja || 0}g)
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col-md-6">
                  <CFormLabel htmlFor="bandejasUtilizadas">Bandejas Utilizadas *</CFormLabel>
                  <CFormInput
                    type="number"
                    id="bandejasUtilizadas"
                    value={bandejasUtilizadas}
                    onChange={(e) => setBandejasUtilizadas(e.target.value)}
                    placeholder="Digite a quantidade de bandejas"
                    min="0"
                    step="1"
                  />
                  <small className="text-muted">
                    Planejado: {tarefaSelecionada.plantio?.bandejas_necessarias || 'N/A'} bandejas
                    {parseFloat(bandejasUtilizadas) > (tarefaSelecionada.plantio?.bandejas_necessarias || 0) && (
                      <span className="text-warning ms-2">⚠ Acima do planejado</span>
                    )}
                  </small>
                </div>
                <div className="col-md-6">
                  <CFormLabel htmlFor="gramasUtilizadas">Total de Gramas</CFormLabel>
                  <CFormInput
                    type="number"
                    id="gramasUtilizadas"
                    value={gramasUtilizadas}
                    onChange={(e) => setGramasUtilizadas(e.target.value)}
                    placeholder="Gramas utilizadas"
                    min="0"
                    step="0.1"
                  />
                  <small className="text-muted">
                    Calculado automaticamente: {parseFloat(bandejasUtilizadas) || 0} bandejas × {
                      tarefaSelecionada.especificacao?.quantidade_bandeja || 0
                    }g = {(parseFloat(bandejasUtilizadas) || 0) * (tarefaSelecionada.especificacao?.quantidade_bandeja || 0)}g
                  </small>
                </div>
              </div>

              {/* Resumo Dinâmico */}
              {bandejasUtilizadas && tarefaSelecionada.especificacao && (
                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="mb-3">Resumo da Execução:</h6>
                  <div className="row">
                    <div className="col-md-4">
                      <strong>Bandejas:</strong>
                      <div className={parseFloat(bandejasUtilizadas) === (tarefaSelecionada.plantio?.bandejas_necessarias || 0) ? 'text-success' : 
                                     parseFloat(bandejasUtilizadas) > (tarefaSelecionada.plantio?.bandejas_necessarias || 0) ? 'text-warning' : 'text-info'}>
                        {bandejasUtilizadas} / {tarefaSelecionada.plantio?.bandejas_necessarias || 0} planejadas
                      </div>
                    </div>
                    <div className="col-md-4">
                      <strong>Gramas utilizadas:</strong>
                      <div className="text-primary">
                        {gramasUtilizadas}g
                        {parseFloat(gramasUtilizadas) !== ((parseFloat(bandejasUtilizadas) || 0) * (tarefaSelecionada.especificacao?.quantidade_bandeja || 0)) && (
                          <small className="text-warning ms-2">(Editado manualmente)</small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <strong>Diferença do planejado:</strong>
                      <div className={
                        (parseFloat(gramasUtilizadas) || 0) - 
                        ((tarefaSelecionada.plantio?.bandejas_necessarias || 0) * (tarefaSelecionada.especificacao?.quantidade_bandeja || 0)) === 0 
                        ? 'text-success' : 'text-warning'
                      }>
                        {(parseFloat(gramasUtilizadas) || 0) - 
                         ((tarefaSelecionada.plantio?.bandejas_necessarias || 0) * (tarefaSelecionada.especificacao?.quantidade_bandeja || 0)) > 0 ? '+' : ''}
                        {(parseFloat(gramasUtilizadas) || 0) - 
                         ((tarefaSelecionada.plantio?.bandejas_necessarias || 0) * (tarefaSelecionada.especificacao?.quantidade_bandeja || 0))}g
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!tarefaSelecionada.especificacao && (
                <div className="alert alert-warning mt-3">
                  <strong>Atenção:</strong> Não foi possível carregar as especificações deste insumo. 
                  Verifique se o insumo possui especificações cadastradas.
                </div>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setPlantioModalVisible(false)}
            disabled={isProcessing}
          >
            Cancelar
          </CButton>
          <CButton 
            color="success" 
            onClick={handleConfirmarPlantio}
            disabled={isProcessing || !bandejasUtilizadas || !tarefaSelecionada?.especificacao}
          >
            {isProcessing && <CSpinner size="sm" className="me-2" />}
            {isProcessing ? 'Processando...' : 'Confirmar Plantio'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de Confirmação de Blackout */}
      <CModal visible={blackoutModalVisible} onClose={() => setBlackoutModalVisible(false)}>
        <CModalHeader closeButton>
          <h4 className="modal-title">Confirmar Retirada do Blackout</h4>
        </CModalHeader>
        <CModalBody>
          {tarefaBlackout && (
            <div>
              <div className="text-center mb-4">
                <div className="mb-3">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto text-dark">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h5 className="text-dark mb-2">Retirar Blackout</h5>
                <p className="text-muted mb-3">
                  Confirma que deseja retirar o blackout das bandejas do plantio?
                </p>
              </div>

              <div className="info-card p-3 bg-light rounded">
                <h6 className="text-primary mb-2">Detalhes da Tarefa:</h6>
                <div className="row">
                  <div className="col-md-6">
                    <strong className="text-muted small">PLANTIO:</strong>
                    <div>{tarefaBlackout.description || `Lote #${tarefaBlackout.plantio_id}`}</div>
                  </div>
                  <div className="col-md-6">
                    <strong className="text-muted small">DATA AGENDADA:</strong>
                    <div>{tarefaBlackout.data_agendada ? 
                      createLocalDate(tarefaBlackout.data_agendada).toLocaleDateString('pt-BR') : 'Hoje'}</div>
                  </div>
                </div>
                {tarefaBlackout.plantio?.variedade && (
                  <div className="mt-2">
                    <strong className="text-muted small">VARIEDADE:</strong>
                    <div>{tarefaBlackout.plantio.variedade}</div>
                  </div>
                )}
                {tarefaBlackout.plantio?.bandejas_necessarias && (
                  <div className="mt-2">
                    <strong className="text-muted small">QUANTIDADE DE BANDEJAS:</strong>
                    <div>{tarefaBlackout.plantio.bandejas_necessarias} bandejas</div>
                  </div>
                )}
              </div>

              <div className="alert alert-info mt-3">
                <strong>Atenção:</strong> Esta ação marcará a tarefa como concluída e as bandejas passarão da fase de blackout para a fase de luz.
              </div>

              <div className="alert alert-warning mt-2">
                <strong>Importante:</strong> Certifique-se de que o tempo de blackout foi respeitado antes de confirmar esta ação.
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setBlackoutModalVisible(false)}
            disabled={isProcessing}
          >
            Cancelar
          </CButton>
          <CButton 
            color="dark" 
            onClick={handleConfirmarBlackout}
            disabled={isProcessing}
          >
            {isProcessing && <CSpinner size="sm" className="me-2" />}
            {isProcessing ? 'Processando...' : 'Confirmar Retirada'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de Confirmação de Desempilhamento */}
      <CModal visible={desempilhamentoModalVisible} onClose={() => setDesempilhamentoModalVisible(false)}>
        <CModalHeader closeButton>
          <h4 className="modal-title">Confirmar Desempilhamento</h4>
        </CModalHeader>
        <CModalBody>
          {tarefaDesempilhamento && (
            <div>
              <div className="text-center mb-4">
                <div className="mb-3">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto text-info">
                    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h5 className="text-info mb-2">Desempilhar Bandejas</h5>
                <p className="text-muted mb-3">
                  Confirma que deseja desempilhar as bandejas do plantio?
                </p>
              </div>

              <div className="info-card p-3 bg-light rounded">
                <h6 className="text-primary mb-2">Detalhes da Tarefa:</h6>
                <div className="row">
                  <div className="col-md-6">
                    <strong className="text-muted small">PLANTIO:</strong>
                    <div>{tarefaDesempilhamento.description || `Lote #${tarefaDesempilhamento.plantio_id}`}</div>
                  </div>
                  <div className="col-md-6">
                    <strong className="text-muted small">DATA AGENDADA:</strong>
                    <div>{tarefaDesempilhamento.data_agendada ? 
                      createLocalDate(tarefaDesempilhamento.data_agendada).toLocaleDateString('pt-BR') : 'Hoje'}</div>
                  </div>
                </div>
                {tarefaDesempilhamento.plantio?.variedade && (
                  <div className="mt-2">
                    <strong className="text-muted small">VARIEDADE:</strong>
                    <div>{tarefaDesempilhamento.plantio.variedade}</div>
                  </div>
                )}
                {tarefaDesempilhamento.plantio?.bandejas_necessarias && (
                  <div className="mt-2">
                    <strong className="text-muted small">QUANTIDADE DE BANDEJAS:</strong>
                    <div>{tarefaDesempilhamento.plantio.bandejas_necessarias} bandejas</div>
                  </div>
                )}
              </div>

              <div className="alert alert-info mt-3">
                <strong>Atenção:</strong> Esta ação marcará a tarefa como concluída e as bandejas passarão da fase de desempilhamento para a fase de blackout.
              </div>

              <div className="alert alert-warning mt-2">
                <strong>Importante:</strong> Certifique-se de que o tempo de empilhamento foi respeitado antes de confirmar esta ação.
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setDesempilhamentoModalVisible(false)}
            disabled={isProcessing}
          >
            Cancelar
          </CButton>
          <CButton 
            color="info" 
            onClick={handleConfirmarDesempilhamento}
            disabled={isProcessing}
          >
            {isProcessing && <CSpinner size="sm" className="me-2" />}
            {isProcessing ? 'Processando...' : 'Confirmar Desempilhamento'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de Confirmação de Colheita */}
      <CModal visible={colheitaModalVisible} onClose={() => setColheitaModalVisible(false)} size="lg">
        <CModalHeader closeButton>
          <h4 className="modal-title">Registrar Colheita</h4>
        </CModalHeader>
        <CModalBody>
          {tarefaColheita && (
            <div>
              <div className="text-center mb-4">
                <div className="mb-3">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto text-warning">
                    <path d="M21 8l-3-3-6 6-6-6-3 3 6 6-6 6 3 3 6-6 6 6 3-3-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="2" fill="currentColor"/>
                  </svg>
                </div>
                <h5 className="text-warning mb-2">Realizar Colheita</h5>
                <p className="text-muted mb-3">
                  Registre o total colhido deste plantio
                </p>
              </div>

              <div className="info-card p-3 bg-light rounded mb-4">
                <h6 className="text-primary mb-2">Detalhes da Colheita:</h6>
                <div className="row">
                  <div className="col-md-6">
                    <strong className="text-muted small">LOTE:</strong>
                    <div>
                      Lote #{tarefaColheita.plantio_id || tarefaColheita.plantio_id || tarefaColheita.plantioId}
                      {tarefaColheita.plantio?.nome && (
                        <div className="small text-muted">{tarefaColheita.plantio.nome}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <strong className="text-muted small">DATA AGENDADA:</strong>
                    <div>{tarefaColheita.data_agendada ? 
                      createLocalDate(tarefaColheita.data_agendada).toLocaleDateString('pt-BR') : 'Hoje'}</div>
                  </div>
                </div>
                
                <div className="row mt-2">
                  {tarefaColheita.plantio?.variedade && (
                    <div className="col-md-4">
                      <strong className="text-muted small">VARIEDADE:</strong>
                      <div>{tarefaColheita.plantio.variedade}</div>
                    </div>
                  )}
                  {(tarefaColheita.plantio?.bandejas_necessarias || tarefaColheita.plantio?.quantidade) && (
                    <div className="col-md-4">
                      <strong className="text-muted small">QUANTIDADE DE BANDEJAS:</strong>
                      <div>{tarefaColheita.plantio?.bandejas_necessarias || tarefaColheita.plantio?.quantidade || 'N/A'} bandejas</div>
                    </div>
                  )}
                  {tarefaColheita.plantio?.data_plantio && (
                    <div className="col-md-4">
                      <strong className="text-muted small">DATA DO PLANTIO:</strong>
                      <div>{formatPlantioDate(tarefaColheita.plantio.data_plantio)}</div>
                    </div>
                  )}
                </div>

                {/* Informações adicionais do insumo, se disponível */}
                {tarefaColheita.plantio?.insumo && (
                  <div className="row mt-3 pt-3 border-top">
                    <div className="col-md-12">
                      <strong className="text-muted small">INSUMO:</strong>
                      <div>
                        {tarefaColheita.plantio.insumo.nome}
                        {tarefaColheita.plantio.insumo.marca && (
                          <span className="text-muted ms-2">({tarefaColheita.plantio.insumo.marca})</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Formulário de colheita */}
              <div className="row">
                <div className="col-md-8">
                  <CFormLabel htmlFor="totalColhido">Total Colhido *</CFormLabel>
                  <CFormInput
                    type="number"
                    id="totalColhido"
                    value={totalColhido}
                    onChange={(e) => setTotalColhido(e.target.value)}
                    placeholder="Digite a quantidade total colhida"
                    min="0"
                    step="0.1"
                  />
                  <small className="text-muted">
                    Informe a quantidade total colhida deste plantio
                  </small>
                </div>
                <div className="col-md-4">
                  <CFormLabel htmlFor="unidadeColheita">Unidade</CFormLabel>
                  <select 
                    className="form-select" 
                    id="unidadeColheita"
                    value={unidadeColheita} 
                    onChange={(e) => setUnidadeColheita(e.target.value)}
                  >
                    <option value="kg">Kg (Quilogramas)</option>
                    <option value="g">g (Gramas)</option>
                    <option value="t">t (Toneladas)</option>
                    <option value="un">un (Unidades)</option>
                    <option value="cx">cx (Caixas)</option>
                    <option value="sc">sc (Sacas)</option>
                  </select>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-12">
                  <CFormLabel htmlFor="observacoesColheita">Observações</CFormLabel>
                  <textarea 
                    className="form-control" 
                    id="observacoesColheita"
                    value={observacoesColheita}
                    onChange={(e) => setObservacoesColheita(e.target.value)}
                    placeholder="Digite observações sobre a colheita (opcional)"
                    rows="3"
                  />
                  <small className="text-muted">
                    Informações adicionais sobre a qualidade, condições da colheita, etc.
                  </small>
                </div>
              </div>

              {/* Resumo dinâmico */}
              {totalColhido && (
                <div className="mt-4 p-3 bg-success bg-opacity-10 rounded">
                  <h6 className="text-success mb-3">Resumo da Colheita:</h6>
                  <div className="row">
                    <div className="col-md-4">
                      <strong>Total Colhido:</strong>
                      <div className="text-success fs-5 fw-bold">
                        {totalColhido} {unidadeColheita}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <strong>Bandejas Utilizadas:</strong>
                      <div className="text-primary">
                        {tarefaColheita.plantio?.bandejas_necessarias || 'N/A'} bandejas
                      </div>
                    </div>
                    <div className="col-md-4">
                      <strong>Rendimento por Bandeja:</strong>
                      <div className="text-info">
                        {tarefaColheita.plantio?.bandejas_necessarias ? 
                          (parseFloat(totalColhido) / tarefaColheita.plantio.bandejas_necessarias).toFixed(2) 
                          : 'N/A'} {unidadeColheita}/bandeja
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="alert alert-info mt-3">
                <strong>Atenção:</strong> Esta ação marcará a tarefa como concluída e finalizará o ciclo do plantio.
              </div>

              <div className="alert alert-success mt-2">
                <strong>Importante:</strong> Após confirmar, o plantio será marcado como concluído e as informações de colheita serão registradas no sistema.
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setColheitaModalVisible(false)}
            disabled={isProcessing}
          >
            Cancelar
          </CButton>
          <CButton 
            color="warning" 
            onClick={handleConfirmarColheita}
            disabled={isProcessing || !totalColhido}
          >
            {isProcessing && <CSpinner size="sm" className="me-2" />}
            {isProcessing ? 'Processando...' : 'Confirmar Colheita'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default CronogramaProducao;