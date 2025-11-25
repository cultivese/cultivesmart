import '@coreui/coreui-pro/dist/css/coreui.min.css';
import '@coreui/coreui/dist/css/coreui.min.css';
import React, { useState, useEffect } from 'react';

// Estilos personalizados para mobile
const mobileStyles = `
  @media (max-width: 767.98px) {
    .task-card-mobile {
      border-radius: 12px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .task-card-mobile:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
    }
    
    .modal-fullscreen-sm-down .modal-dialog {
      margin: 0;
      height: 100vh;
      max-height: none;
    }
    
    .modal-fullscreen-sm-down .modal-content {
      border: none;
      border-radius: 0;
      height: 100%;
    }
    
    .btn-lg {
      padding: 12px 24px;
      font-size: 1.1rem;
    }
  }
  
  @media (max-width: 575.98px) {
    .container {
      padding: 0.75rem;
    }
    
    .card {
      margin-bottom: 1rem;
    }
  }
`;

// Injetar estilos no head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = mobileStyles;
  document.head.appendChild(styleElement);
}
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CListGroup,
  CListGroupItem,
  CBadge,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilCheckCircle, 
  cilBan, 
  cilLeaf, 
  cilMoon, 
  cilBasket, 
  cilListNumbered, 
  cilClock 
} from '@coreui/icons';

// Função para buscar tarefas reais da API
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

// Função para buscar plantios reais da API
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

// Funções helper do cronograma
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

// Função para filtrar tarefas do dia
const filtrarTarefasDoDia = (tarefas, plantios, dataHoje) => {
  const dataHojeStr = dataHoje.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  
  console.log('Filtrando tarefas para a data:', dataHojeStr);
  console.log('Total de tarefas recebidas:', tarefas.length);
  
  const tarefasFiltradas = tarefas
    .filter(tarefa => {
      // Filtrar tarefas agendadas para hoje
      if (!tarefa.data_agendada) {
        console.log('Tarefa sem data_agendada:', tarefa);
        return false;
      }
      
      // Normalizar formato da data (pode vir como '2025-10-23' ou '2025-10-23T00:00:00')
      const dataTarefa = tarefa.data_agendada.split('T')[0];
      const isToday = dataTarefa === dataHojeStr;
      
      if (isToday) {
        console.log('Tarefa encontrada para hoje:', tarefa);
      }
      
      return isToday;
    })
    .map(tarefa => {
      // Buscar informações do plantio relacionado
      const plantio = plantios.find(p => p.id === tarefa.lote_id);
      
      return {
        id: tarefa.id,
        description: tarefa.descricao || `${tarefa.tipo} - ${plantio?.nome || 'Plantio'}`,
        type: tarefa.tipo,
        status: tarefa.status || 'pending',
        plantioId: tarefa.lote_id,
        details: `${plantio?.nome || 'Plantio'} | Data: ${new Date(tarefa.data_agendada).toLocaleDateString('pt-BR')} | Status: ${tarefa.status || 'pendente'}`
      };
    });
    
  console.log('Tarefas filtradas para hoje:', tarefasFiltradas);
  return tarefasFiltradas;
};

const TarefaDiaria = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [gramasSementes, setGramasSementes] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    const carregarTarefas = async () => {
      setLoading(true);
      try {
        const [tarefas, plantios] = await Promise.all([
          fetchTarefas(),
          fetchPlantios()
        ]);
        
        console.log('Tarefas carregadas:', tarefas);
        console.log('Plantios carregados:', plantios);
        
        const hoje = new Date();
        const tarefasHoje = filtrarTarefasDoDia(tarefas, plantios, hoje);
        
        console.log('Tarefas do dia:', tarefasHoje);
        setTasks(tarefasHoje);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    carregarTarefas();
  }, []);

  const handleIniciarTarefa = (tarefa) => {
    if (tarefa.type === 'plantio') {
      setTarefaSelecionada(tarefa);
      setModalVisible(true);
    } else {
      // Para outros tipos de tarefa, marcar como concluída diretamente
      concluirTarefa(tarefa.id, {});
    }
  };

  const handleConcluirPlantio = async () => {
    if (!gramasSementes || parseFloat(gramasSementes) <= 0) {
      alert('Por favor, informe a quantidade de gramas de sementes utilizada.');
      return;
    }

    setProcessando(true);
    try {
      await concluirTarefa(tarefaSelecionada.id, {
        gramas_sementes_utilizadas: parseFloat(gramasSementes),
        observacoes: observacoes.trim() || 'Plantio realizado com sucesso'
      });
      
      // Fechar modal e limpar dados
      setModalVisible(false);
      setTarefaSelecionada(null);
      setGramasSementes('');
      setObservacoes('');
      
      // Recarregar tarefas
      const [tarefas, plantios] = await Promise.all([
        fetchTarefas(),
        fetchPlantios()
      ]);
      const hoje = new Date();
      const tarefasHoje = filtrarTarefasDoDia(tarefas, plantios, hoje);
      setTasks(tarefasHoje);
      
    } catch (error) {
      console.error('Erro ao concluir tarefa:', error);
      alert('Erro ao concluir tarefa: ' + error.message);
    } finally {
      setProcessando(false);
    }
  };

  const concluirTarefa = async (tarefaId, dadosAdicionais = {}) => {
    try {
      const response = await fetch(`https://backend.cultivesmart.com.br/api/tarefas/${tarefaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          data_conclusao: new Date().toISOString().split('T')[0],
          ...dadosAdicionais
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar tarefa');
      }

      console.log('Tarefa concluída com sucesso');
    } catch (error) {
      throw error;
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
    <CContainer>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5 style={{fontWeight: 'bold', fontSize: '1.2em'}}>
                Tarefas do Dia - {new Date().toLocaleDateString('pt-BR', {weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'})}
              </h5>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <div className="text-center py-5">
                  <CSpinner color="primary" className="mb-3" />
                  <h6 className="text-muted">Carregando suas tarefas...</h6>
                  <small className="text-muted">Buscando tarefas agendadas para hoje</small>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-5">
                  {/* Ícone e mensagem para estado vazio */}
                  <div className="mb-4">
                    <div className="display-1 mb-3">📅</div>
                    <h5 className="text-muted mb-2">Nenhuma tarefa para hoje</h5>
                    <p className="text-muted mb-0">
                      Que ótimo! Você não tem tarefas pendentes para hoje.
                    </p>
                  </div>
                  
                  {/* Debug toggle mais elegante */}
                  <div className="mt-4">
                    <CButton
                      color="link"
                      size="sm"
                      onClick={() => setDebug(!debug)}
                      className="text-decoration-none"
                    >
                      🔍 {debug ? 'Ocultar informações técnicas' : 'Mostrar informações técnicas'}
                    </CButton>
                    
                    {debug && (
                      <div className="mt-3 p-3 bg-light rounded text-start">
                        <h6 className="mb-2">🛠️ Informações Técnicas</h6>
                        <div className="small text-muted">
                          <p className="mb-1"><strong>Data atual:</strong> {new Date().toISOString().split('T')[0]}</p>
                          <p className="mb-2"><strong>APIs consultadas:</strong></p>
                          <ul className="mb-2 ps-3">
                            <li>GET /api/tarefas</li>
                            <li>GET /api/plantios</li>
                          </ul>
                          <p className="mb-0">
                            💡 <em>Abra o console do navegador (F12) para ver logs detalhados.</em>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                {/* Layout para Desktop - Igual ao cronograma */}
                <div className="d-none d-lg-block">
                  <CListGroup>
                    {tasks.map((task) => (
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
                              onClick={() => handleIniciarTarefa(task)}
                            >
                              Executar Plantio
                            </CButton>
                          )}
                          {(task.type === 'Retirar blackout' || task.type === 'retirar blackout' || task.type?.toLowerCase().includes('blackout')) && task.status === 'pending' && (
                            <CButton 
                              color="dark" 
                              size="sm" 
                              className="ms-2"
                              onClick={() => handleIniciarTarefa(task)}
                            >
                              Retirar Blackout
                            </CButton>
                          )}
                          {task.type === 'desempilhamento' && task.status === 'pending' && (
                            <CButton 
                              color="info" 
                              size="sm" 
                              className="ms-2"
                              onClick={() => handleIniciarTarefa(task)}
                            >
                              Desempilhar
                            </CButton>
                          )}
                          {task.type === 'colheita' && task.status === 'pending' && (
                            <CButton 
                              color="warning" 
                              size="sm" 
                              className="ms-2"
                              onClick={() => handleIniciarTarefa(task)}
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
                    ))}
                  </CListGroup>
                </div>

                {/* Layout para Mobile e Tablet */}
                <div className="d-lg-none">
                  <CRow className="g-3">
                    {tasks.map((task) => (
                      <CCol xs={12} key={task.id}>
                        <CCard 
                          className={`h-100 task-card-mobile ${
                            task.status === 'completed' ? 'border-success' : 
                            task.status === 'active' ? 'border-info' : 'border-secondary'
                          }`}
                          style={{ borderWidth: '2px' }}
                        >
                          <CCardBody className="p-3">
                            {/* Header do Card Mobile */}
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div className="d-flex align-items-center">
                                <CIcon 
                                  icon={getTarefaIcon(task.type)} 
                                  className={`text-${getTarefaCor(task.type)}`} 
                                />
                                <span className="ms-2 text-muted small">
                                  {task.type?.charAt(0).toUpperCase() + task.type?.slice(1)}
                                </span>
                              </div>
                              {getStatusBadge(task.status)}
                            </div>
                            
                            {/* Título da Tarefa */}
                            <h6 className="fw-bold mb-2 text-break">
                              {task.description}
                            </h6>
                            
                            {/* Detalhes em formato de chips/tags */}
                            <div className="mb-3">
                              {task.details.split(' | ').map((detail, index) => (
                                <small key={index} className="d-block text-muted mb-1">
                                  {detail}
                                </small>
                              ))}
                            </div>
                            
                            {/* Ações */}
                            <div className="d-grid gap-2">
                              {task.status === 'pending' && (
                                <>
                                  {task.type === 'plantio' && (
                                    <CButton
                                      color="success"
                                      size="sm"
                                      onClick={() => handleIniciarTarefa(task)}
                                      className="fw-semibold"
                                    >
                                      <CIcon icon={getTarefaIcon(task.type)} className="me-2" />
                                      Executar Plantio
                                    </CButton>
                                  )}
                                  {(task.type === 'Retirar blackout' || task.type === 'retirar blackout' || task.type?.toLowerCase().includes('blackout')) && (
                                    <CButton
                                      color="dark"
                                      size="sm"
                                      onClick={() => handleIniciarTarefa(task)}
                                      className="fw-semibold"
                                    >
                                      <CIcon icon={getTarefaIcon(task.type)} className="me-2" />
                                      Retirar Blackout
                                    </CButton>
                                  )}
                                  {task.type === 'desempilhamento' && (
                                    <CButton
                                      color="info"
                                      size="sm"
                                      onClick={() => handleIniciarTarefa(task)}
                                      className="fw-semibold"
                                    >
                                      <CIcon icon={getTarefaIcon(task.type)} className="me-2" />
                                      Desempilhar
                                    </CButton>
                                  )}
                                  {task.type === 'colheita' && (
                                    <CButton
                                      color="warning"
                                      size="sm"
                                      onClick={() => handleIniciarTarefa(task)}
                                      className="fw-semibold"
                                    >
                                      <CIcon icon={getTarefaIcon(task.type)} className="me-2" />
                                      Realizar Colheita
                                    </CButton>
                                  )}
                                  {!['plantio', 'retirar blackout', 'desempilhamento', 'colheita'].includes(task.type?.toLowerCase()) && (
                                    <CButton
                                      color="primary"
                                      size="sm"
                                      onClick={() => handleIniciarTarefa(task)}
                                      className="fw-semibold"
                                    >
                                      <CIcon icon={getTarefaIcon(task.type)} className="me-2" />
                                      Concluir Tarefa
                                    </CButton>
                                  )}
                                </>
                              )}
                              {task.status === 'active' && (
                                <CButton
                                  color="info"
                                  size="sm"
                                  variant="outline"
                                  disabled
                                >
                                  Em Andamento...
                                </CButton>
                              )}
                              {task.status === 'completed' && (
                                <div className="text-center py-2">
                                  <CIcon icon={cilCheckCircle} className="text-success me-2" size="lg" />
                                  <span className="text-success fw-semibold">Tarefa Concluída</span>
                                </div>
                              )}
                            </div>
                          </CCardBody>
                        </CCard>
                      </CCol>
                    ))}
                  </CRow>
                </div>
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal para plantio - Responsivo */}
      <CModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        size="lg"
        className="modal-fullscreen-sm-down"
      >
        <CModalHeader className="border-bottom">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilCheckCircle} className="me-2 text-success" />
            Registrar Plantio
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4">
          {tarefaSelecionada && (
            <div>
              {/* Informações da Tarefa */}
              <div className="bg-light rounded p-3 mb-4">
                <h6 className="text-primary mb-2">📋 Tarefa Selecionada</h6>
                <p className="mb-0 fw-semibold">{tarefaSelecionada.description}</p>
                <small className="text-muted">
                  {tarefaSelecionada.details}
                </small>
              </div>
              
              <CForm>
                {/* Campo de Gramas - Full width em mobile */}
                <div className="mb-4">
                  <CFormLabel htmlFor="gramasSementes" className="fw-semibold">
                    🌱 Gramas de sementes utilizadas *
                  </CFormLabel>
                  <CInputGroup size="lg">
                    <CFormInput
                      type="number"
                      id="gramasSementes"
                      value={gramasSementes}
                      onChange={(e) => setGramasSementes(e.target.value)}
                      placeholder="Ex: 250"
                      min="0"
                      step="0.01"
                      required
                      className="text-center fw-bold"
                      style={{ fontSize: '1.1em' }}
                    />
                    <CInputGroupText className="fw-semibold">gramas</CInputGroupText>
                  </CInputGroup>
                  <small className="text-muted mt-1 d-block">
                    💡 Informe a quantidade exata utilizada no plantio
                  </small>
                </div>
                
                {/* Campo de Observações */}
                <div className="mb-3">
                  <CFormLabel htmlFor="observacoes" className="fw-semibold">
                    📝 Observações (opcional)
                  </CFormLabel>
                  <CFormInput
                    as="textarea"
                    id="observacoes"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Adicione observações sobre o plantio: condições climáticas, qualidade das sementes, etc..."
                    rows="4"
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </CForm>
            </div>
          )}
        </CModalBody>
        
        {/* Footer com botões responsivos */}
        <CModalFooter className="border-top p-3">
          <div className="d-flex flex-column flex-md-row gap-2 w-100">
            <CButton 
              color="secondary" 
              onClick={() => setModalVisible(false)}
              disabled={processando}
              className="flex-fill order-2 order-md-1"
              variant="outline"
            >
              Cancelar
            </CButton>
            <CButton 
              color="success" 
              onClick={handleConcluirPlantio}
              disabled={processando}
              className="flex-fill order-1 order-md-2"
              size="lg"
            >
              {processando && <CSpinner as="span" size="sm" className="me-2" />}
              <CIcon icon={cilCheckCircle} className="me-2" />
              {processando ? 'Concluindo Plantio...' : 'Concluir Plantio'}
            </CButton>
          </div>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default TarefaDiaria;