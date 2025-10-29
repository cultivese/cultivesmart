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
import { cilCheckCircle, cilBan } from '@coreui/icons';

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
              <span style={{fontWeight: 'bold', fontSize: '1.2em'}}>Tarefas do Dia - {new Date().toLocaleDateString('pt-BR', {weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'})}</span>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <p style={{color: '#888'}}>Carregando tarefas...</p>
              ) : tasks.length === 0 ? (
                <div>
                  <p style={{color: '#888'}}>Nenhuma tarefa agendada para hoje.</p>
                  <button 
                    onClick={() => setDebug(!debug)}
                    style={{fontSize: '12px', color: '#007bff', background: 'none', border: 'none', cursor: 'pointer'}}
                  >
                    {debug ? 'Ocultar debug' : 'Mostrar debug'}
                  </button>
                  {debug && (
                    <div style={{marginTop: '10px', fontSize: '12px', color: '#666', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px'}}>
                      <p><strong>Data atual:</strong> {new Date().toISOString().split('T')[0]}</p>
                      <p><strong>APIs chamadas:</strong></p>
                      <ul>
                        <li>GET /api/tarefas</li>
                        <li>GET /api/plantios</li>
                      </ul>
                      <p>Verifique o console (F12) para mais detalhes.</p>
                    </div>
                  )}
                </div>
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
                        {task.status === 'pending' && (
                          <CButton
                            color="primary"
                            size="sm"
                            className="ms-3"
                            onClick={() => handleIniciarTarefa(task)}
                          >
                            {task.type === 'plantio' ? 'Realizar Plantio' : 'Concluir'}
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
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal para plantio */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Registrar Plantio</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {tarefaSelecionada && (
            <div>
              <h6 className="mb-3">{tarefaSelecionada.description}</h6>
              <CForm>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="gramasSementes">Gramas de sementes utilizadas *</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        type="number"
                        id="gramasSementes"
                        value={gramasSementes}
                        onChange={(e) => setGramasSementes(e.target.value)}
                        placeholder="Ex: 250"
                        min="0"
                        step="0.01"
                        required
                      />
                      <CInputGroupText>gramas</CInputGroupText>
                    </CInputGroup>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel htmlFor="observacoes">Observações (opcional)</CFormLabel>
                    <CFormInput
                      as="textarea"
                      id="observacoes"
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Adicione observações sobre o plantio..."
                      rows="3"
                    />
                  </CCol>
                </CRow>
              </CForm>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setModalVisible(false)}
            disabled={processando}
          >
            Cancelar
          </CButton>
          <CButton 
            color="success" 
            onClick={handleConcluirPlantio}
            disabled={processando}
          >
            {processando && <CSpinner as="span" size="sm" className="me-2" />}
            {processando ? 'Concluindo...' : 'Concluir Plantio'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default TarefaDiaria;