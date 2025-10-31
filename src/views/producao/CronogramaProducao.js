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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilBan } from '@coreui/icons';
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
  const dataHojeStr = dataHoje.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  
  return tarefas
    .filter(tarefa => {
      if (!tarefa.data_agendada) return false;
      const dataTarefa = tarefa.data_agendada.split('T')[0];
      return dataTarefa === dataHojeStr;
    })
    .map(tarefa => {
      const plantio = plantios.find(p => p.id === tarefa.lote_id);
      return {
        id: tarefa.id,
        description: tarefa.descricao || `${tarefa.tipo} - ${plantio?.nome || 'Plantio'}`,
        type: tarefa.tipo,
        status: tarefa.status || 'pending',
        plantioId: tarefa.lote_id,
        details: `${plantio?.nome || 'Plantio'} | Data: ${createLocalDate(tarefa.data_agendada).toLocaleDateString('pt-BR')} | Status: ${tarefa.status || 'pendente'}`
      };
    });
};

const getEventColor = (type) => {
  switch (type) {
    case 'plantio': return '#2ecc40';
    case 'blackout': return '#222f3e';
    case 'colheita': return '#e74c3c';
    case 'desempilhamento': return '#f7b731';
    default: return '#b2bec3';
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

        // Processar eventos do calendário
        const grouped = {};
        tarefasData.forEach(tarefa => {
          const key = `${tarefa.tipo}_${tarefa.data_agendada}`;
          if (!grouped[key]) {
            grouped[key] = {
              tipo: tarefa.tipo,
              data_agendada: tarefa.data_agendada,
              lotes: [],
            };
          }
          grouped[key].lotes.push(tarefa.lote_id);
        });

        const eventos = Object.values(grouped).map(grupo => ({
          title: `${grupo.tipo.charAt(0).toUpperCase() + grupo.tipo.slice(1, 10)} (${grupo.lotes.length})`,
          start: grupo.data_agendada,
          color: getEventColor(grupo.tipo),
          extendedProps: {
            tipo: grupo.tipo,
            lotes: grupo.lotes,
            data: grupo.data_agendada,
          },
        }));

        setEvents(eventos);
        
        // Processar tarefas do dia atual
        const hoje = new Date();
        const tarefasHoje = filtrarTarefasDoDia(tarefasData, plantiosData, hoje);
        setTarefasDoDia(tarefasHoje);
        
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

  // Handler para abrir o modal ao clicar no evento
  const handleEventClick = (info) => {
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
      const loteIds = [...new Set(tarefasDaData.map(t => t.lote_id))];
      const plantiosComTarefas = plantios.filter(p => loteIds.includes(p.id));
      
      const plantiosDetalhados = plantiosComTarefas.map(plantio => {
        const tarefasDoPlantio = tarefas.filter(tarefa => tarefa.lote_id === plantio.id);
        const tarefaColheita = tarefasDoPlantio.find(t => t.tipo === 'colheita');
        
        return {
          ...plantio,
          dataColheita: tarefaColheita ? tarefaColheita.data_agendada : null,
          tarefasHoje: tarefasDaData.filter(t => t.lote_id === plantio.id),
          todasTarefas: tarefasDoPlantio
        };
      });
      
      setPlantiosDaData(plantiosDetalhados);
      return;
    }

    // Combinar informações para plantios da data
    const plantiosDetalhados = plantiosDaData.map(plantio => {
      const tarefasDoPlantio = tarefas.filter(tarefa => tarefa.lote_id === plantio.id);
      const tarefaColheita = tarefasDoPlantio.find(t => t.tipo === 'colheita');
      
      return {
        ...plantio,
        dataColheita: tarefaColheita ? tarefaColheita.data_agendada : null,
        tarefasHoje: tarefasDaData.filter(t => t.lote_id === plantio.id),
        todasTarefas: tarefasDoPlantio
      };
    });

    setPlantiosDaData(plantiosDetalhados);
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
                <CCol md={10} lg={8}>
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale="pt-br"
                    events={events}
                    height={600}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
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
            </CCardHeader>
            <CCardBody>
              {loadingTarefas ? (
                <p style={{color: '#888'}}>Carregando tarefas...</p>
              ) : tarefasDoDia.length === 0 ? (
                <p style={{color: '#888'}}>Nenhuma tarefa agendada para hoje.</p>
              ) : (
                <CListGroup>
                  {tarefasDoDia.map((task) => (
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
                        {task.status === 'completed' && (
                          <span className="ms-3 text-success" style={{fontSize: '0.9em'}}>
                            ✓ Concluída
                          </span>
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
            // Exibir informações do evento clicado
            <div className="event-details">
              <CRow>
                <CCol md={6}>
                  <div className="info-card p-3 bg-light rounded">
                    <h6 className="text-primary mb-2">📅 Detalhes do Evento</h6>
                    <p className="mb-1"><strong>Data:</strong> {createLocalDate(selectedEvent.data).toLocaleDateString('pt-BR')}</p>
                    <p className="mb-1"><strong>Tipo:</strong> {selectedEvent.tipo}</p>
                    <p className="mb-0"><strong>Quantidade:</strong> {selectedEvent.lotes.length} lotes</p>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="info-card p-3 bg-light rounded">
                    <h6 className="text-success mb-2">📦 Lotes Envolvidos</h6>
                    <p className="mb-0">{selectedEvent.lotes.join(', ')}</p>
                  </div>
                </CCol>
              </CRow>
            </div>
          ) : (
            // Exibir plantios da data selecionada
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
                        {/* Informações Principais */}
                        <div className="info-section p-3 border-bottom">
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
                                  {plantio.quantidade || plantio.bandejas || 'N/A'} bandejas
                                </div>
                              </div>
                            </CCol>
                          </CRow>
                        </div>

                        {/* Detalhes Adicionais */}
                        <div className="details-section p-3">
                          <CRow>
                            {plantio.variedade && (
                              <CCol md={6} className="mb-2">
                                <strong className="text-muted small">VARIEDADE:</strong>
                                <div>{plantio.variedade}</div>
                              </CCol>
                            )}
                            {plantio.area_plantio && (
                              <CCol md={6} className="mb-2">
                                <strong className="text-muted small">ÁREA:</strong>
                                <div>{plantio.area_plantio}</div>
                              </CCol>
                            )}
                            {plantio.observacoes && (
                              <CCol xs={12} className="mb-2">
                                <strong className="text-muted small">OBSERVAÇÕES:</strong>
                                <div className="text-muted">{plantio.observacoes}</div>
                              </CCol>
                            )}
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
                                  color={tarefa.tipo === 'plantio' ? 'success' : 
                                         tarefa.tipo === 'colheita' ? 'danger' : 
                                         tarefa.tipo === 'blackout' ? 'dark' :
                                         tarefa.tipo === 'desempilhamento' ? 'warning' : 'info'}
                                  className="px-3 py-2 fs-6"
                                >
                                  {tarefa.tipo.toUpperCase()}
                                  {tarefa.descricao && ` - ${tarefa.descricao}`}
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
                                      tarefa.tipo === 'colheita' ? 'danger' : 
                                      tarefa.tipo === 'blackout' ? 'dark' :
                                      tarefa.tipo === 'desempilhamento' ? 'warning' : 'info'
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
    </CContainer>
  );
};

export default CronogramaProducao;