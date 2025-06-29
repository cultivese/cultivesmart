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
  CInputGroup, // Adicionado CInputGroup
  CInputGroupText, // Adicionado CInputGroupText
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilBan } from '@coreui/icons';

// Dados de tarefas de exemplo (em um cenário real, viriam de uma API)
const mockDailyTasks = [
  {
    id: 'task1',
    description: 'Plantio: 9 bandejas de beterraba (registrar retirada do insumo do estoque, retirar do estoque de substrato)',
    status: 'pending', // pending, active, completed, blocked
    dependencies: [], // Nenhuma dependência inicial
    role: 'operador',
    type: 'plantio', // Adicionado tipo para diferenciar as tarefas
    details: 'Verificar sementes de beterraba e substrato. Utilizar 9 bandejas.',
  },
  {
    id: 'task2',
    description: 'Plantio: 3 bandejas de Rúcula (registrar retirada do insumo do estoque, retirar do estoque de substrato)',
    status: 'blocked', // Começa bloqueada
    dependencies: ['task1'], // Depende da 'task1' ser concluída
    role: 'operador',
    type: 'plantio', // Adicionado tipo
    details: 'Verificar sementes de rúcula e substrato. Utilizar 3 bandejas.',
  }  
];

const TarefaDiaria = () => {
  const [tasks, setTasks] = useState(mockDailyTasks);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTaskForModal, setCurrentTaskForModal] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // console.log("Tasks ou activeTaskId mudou. Nenhuma ativação automática na inicialização.");
  }, [tasks, activeTaskId]);

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

  const handleModalSubmit = () => {
    if (!currentTaskForModal) return;

    if (currentTaskForModal.type === 'plantio') {
      const { quantidadeSementesTotal, quantidadeBandejasPlantio, sementesPorBandeja, substratoBase, substratoCobertura } = formData;

      // Adicionando uma verificação para valores vazios ou não numéricos, e depois para valores <= 0
      if (
        quantidadeSementesTotal === '' ||
        quantidadeBandejasPlantio === '' ||
        sementesPorBandeja === '' ||
        substratoBase === '' ||
        substratoCobertura === ''
      ) {
        alert('Por favor, preencha todos os campos obrigatórios para o plantio.');
        return;
      }

      if (
        parseFloat(quantidadeSementesTotal) <= 0 ||
        parseFloat(quantidadeBandejasPlantio) <= 0 ||
        parseFloat(sementesPorBandeja) <= 0 ||
        parseFloat(substratoBase) <= 0 ||
        parseFloat(substratoCobertura) <= 0
      ) {
        alert('As quantidades devem ser maiores que zero.');
        return;
      }
    }

    console.log(`Registrando dados para a tarefa ${currentTaskForModal.id}:`, formData);

    setActiveTaskId(currentTaskForModal.id);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === currentTaskForModal.id ? { ...task, status: 'active', registeredData: formData } : task,
      ),
    );

    setModalVisible(false);
    setCurrentTaskForModal(null);
    setFormData({});
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
            <CRow className="g-3"> {/* Usando CRow com gutter (g-3) para espaçamento */}
              <CCol md={6}> {/* Metade da largura para este campo */}
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
                  <CInputGroupText>g/un</CInputGroupText> {/* Unidade como sufixo */}
                </CInputGroup>
              </CCol>

              <CCol md={6}> {/* Metade da largura para este campo */}
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

            <div className="mb-3"> {/* Bandejas de plantio em largura total para o cálculo */}
              <CFormLabel htmlFor="quantidadeBandejasPlantio">Bandejas para plantio:</CFormLabel>
              <CInputGroup className="mb-2"> {/* mb-2 para reduzir espaçamento */}
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

            <CRow className="g-3"> {/* Agrupando os campos de substrato */}
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
                  <CInputGroupText>mS/cm</CInputGroupText> {/* Unidade comum para EC */}
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

  return (
    <CContainer>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              **Tarefas do Dia - Sexta, 14 de Junho de 2025**
            </CCardHeader>
            <CCardBody>
              {tasks.length === 0 ? (
                <p>Nenhuma tarefa agendada para hoje.</p>
              ) : (
                <CListGroup>
                  {tasks.map((task) => (
                    <CListGroupItem
                      key={task.id}
                      className={`d-flex justify-content-between align-items-center ${
                        task.status === 'completed' ? 'list-group-item-success' : ''
                      } ${task.status === 'active' ? 'list-group-item-info' : ''}`}
                    >
                      <div>
                        {getStatusIcon(task.status)}{' '}
                        **{task.description}**
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
                            onClick={() => handleStartTask(task.id)}
                          >
                            Iniciar
                          </CButton>
                        )}
                        {task.status === 'active' && activeTaskId === task.id && (
                          <CButton
                            color="success"
                            size="sm"
                            className="ms-3"
                            onClick={() => handleCompleteTask(task.id)}
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
          <CButton color="primary" onClick={handleModalSubmit}>
            Confirmar e Iniciar
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default TarefaDiaria;