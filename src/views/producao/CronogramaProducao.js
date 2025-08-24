// src/views/producao/CronogramaProducao.js
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
  CBadge,
} from '@coreui/react';
import './CronogramaProducao.css';

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

const CronogramaProducao = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseTarefas = await fetch('https://backend.cultivesmart.com.br/api/tarefas');
        const tarefas = await responseTarefas.json();
        // Mapeia tarefas para eventos do FullCalendar
        const eventos = tarefas.map(tarefa => ({
          title: `${tarefa.tipo.charAt(0).toUpperCase() + tarefa.tipo.slice(1)} lote ${tarefa.lote_id}`,
          start: tarefa.data_agendada,
          color: getEventColor(tarefa.tipo),
        }));
        setEvents(eventos);
      } catch (error) {
        setEvents([]);
      }
    };
    fetchData();
  }, []);

  const getEventColor = (type) => {
    switch (type) {
      case 'plantio': return '#2ecc40';
      case 'blackout': return '#222f3e';
      case 'colheita': return '#e74c3c';
      case 'desempilhamento': return '#f7b731';
      default: return '#b2bec3';
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
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default CronogramaProducao;