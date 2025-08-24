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

// Função para buscar lotes reais da API
const fetchLotes = async () => {
  try {
    const response = await fetch('https://backend.cultivesmart.com.br/api/lotes');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar lotes:', error);
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

const TarefaDiaria = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const carregarTarefas = async () => {
      const lotes = await fetchLotes();
      const insumos = await fetchInsumosEspecificacoes();
      const hoje = new Date();
      const tarefasHoje = gerarTarefasPorLote(lotes, insumos, hoje);
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