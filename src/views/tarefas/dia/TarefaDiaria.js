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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilBan } from '@coreui/icons';

// Função para buscar plantios reais da API
const fetchPlantios = async () => {
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

// Função para gerar tarefas agendadas para cada plantio
const gerarTarefasPorPlantio = (plantios, insumos, dataHoje) => {
  const tarefas = [];
  plantios.forEach(plantio => {
    const insumo = insumos.find(i => i.id === plantio.insumo_id);
    const espec = insumo && insumo.especificacoes && insumo.especificacoes[0];
    if (!espec) return;
    const dataPlantio = plantio.data_plantio ? new Date(plantio.data_plantio) : null;
    // Plantio
    if (dataPlantio &&
      dataPlantio.getFullYear() === dataHoje.getFullYear() &&
      dataPlantio.getMonth() === dataHoje.getMonth() &&
      dataPlantio.getDate() === dataHoje.getDate()) {
      tarefas.push({
        id: `plantio-${plantio.id}`,
        description: `Plantio do plantio ${plantio.id} - ${plantio.nome} (${plantio.variedade})`,
        type: 'plantio',
        status: 'pending',
        plantioId: plantio.id,
        details: `Utilizar especificação: ${espec.gramas_para_plantio || ''}g por bandeja.`
      });
    }
    // Desempilhamento
    if (espec.dias_pilha && espec.dias_pilha > 0 && dataPlantio) {
      const dataDesempilhamento = new Date(dataPlantio);
      dataDesempilhamento.setDate(dataDesempilhamento.getDate() + espec.dias_pilha);
      if (dataDesempilhamento.getFullYear() === dataHoje.getFullYear() &&
        dataDesempilhamento.getMonth() === dataHoje.getMonth() &&
        dataDesempilhamento.getDate() === dataHoje.getDate()) {
        tarefas.push({
          id: `desempilhamento-${plantio.id}`,
          description: `Desempilhamento do plantio ${plantio.id} - ${plantio.nome} (${plantio.variedade})`,
          type: 'desempilhamento',
          status: 'pending',
          plantioId: plantio.id,
          details: `Após ${espec.dias_pilha} dias do plantio.`
        });
      }
    }
    // Blackout
    if (espec.dias_blackout && espec.dias_blackout > 0 && dataPlantio) {
      // Blackout simples
      const dataBlackout = new Date(dataPlantio);
      dataBlackout.setDate(dataBlackout.getDate() + espec.dias_blackout);
      if (dataBlackout.getFullYear() === dataHoje.getFullYear() &&
        dataBlackout.getMonth() === dataHoje.getMonth() &&
        dataBlackout.getDate() === dataHoje.getDate()) {
        tarefas.push({
          id: `blackout-${plantio.id}`,
          description: `Iniciar blackout do plantio ${plantio.id} - ${plantio.nome} (${plantio.variedade})`,
          type: 'blackout',
          status: 'pending',
          plantioId: plantio.id,
          details: `Após ${espec.dias_blackout} dias do plantio.`
        });
      }
      // Blackout após desempilhamento
      if (espec.dias_pilha) {
        const dataBlackout2 = new Date(dataPlantio);
        dataBlackout2.setDate(dataBlackout2.getDate() + espec.dias_pilha + espec.dias_blackout);
        if (dataBlackout2.getFullYear() === dataHoje.getFullYear() &&
          dataBlackout2.getMonth() === dataHoje.getMonth() &&
          dataBlackout2.getDate() === dataHoje.getDate()) {
          tarefas.push({
            id: `blackout2-${plantio.id}`,
            description: `Blackout após desempilhamento do plantio ${plantio.id} - ${plantio.nome} (${plantio.variedade})`,
            type: 'blackout',
            status: 'pending',
            plantioId: plantio.id,
            details: `Após desempilhamento + ${espec.dias_blackout} dias.`
          });
        }
      }
    }
    // Colheita
    if (espec.dias_colheita && espec.dias_colheita > 0 && dataPlantio) {
      // Colheita simples
      const dataColheita = new Date(dataPlantio);
      dataColheita.setDate(dataColheita.getDate() + espec.dias_colheita);
      if (dataColheita.getFullYear() === dataHoje.getFullYear() &&
        dataColheita.getMonth() === dataHoje.getMonth() &&
        dataColheita.getDate() === dataHoje.getDate()) {
        tarefas.push({
          id: `colheita-${plantio.id}`,
          description: `Colheita do plantio ${plantio.id} - ${plantio.nome} (${plantio.variedade})`,
          type: 'colheita',
          status: 'pending',
          plantioId: plantio.id,
          details: `Após ${espec.dias_colheita} dias do plantio.`
        });
      }
      // Colheita após desempilhamento + blackout + colheita
      if (espec.dias_pilha && espec.dias_blackout) {
        const dataColheita2 = new Date(dataPlantio);
        dataColheita2.setDate(dataColheita2.getDate() + espec.dias_pilha + espec.dias_blackout + espec.dias_colheita);
        if (dataColheita2.getFullYear() === dataHoje.getFullYear() &&
          dataColheita2.getMonth() === dataHoje.getMonth() &&
          dataColheita2.getDate() === dataHoje.getDate()) {
          tarefas.push({
            id: `colheita2-${plantio.id}`,
            description: `Colheita do plantio ${plantio.id} - ${plantio.nome} (${plantio.variedade})`,
            type: 'colheita',
            status: 'pending',
            plantioId: plantio.id,
            details: `Após desempilhamento + blackout + ${espec.dias_colheita} dias.`
          });
        }
      }
    }
  });
  return tarefas;
};

const TarefaDiaria = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const carregarTarefas = async () => {
      const plantios = await fetchPlantios(); // API ainda retorna lotes, mas tratamos como plantios
      const insumos = await fetchInsumosEspecificacoes();
      const hoje = new Date();
      const tarefasHoje = gerarTarefasPorPlantio(plantios, insumos, hoje);
      setTasks(tarefasHoje);
    };
    carregarTarefas();
  }, []);

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
                      </div>
                    </CListGroupItem>
                  ))}
                </CListGroup>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default TarefaDiaria;