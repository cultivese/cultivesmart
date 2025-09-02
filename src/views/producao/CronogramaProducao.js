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
} from '@coreui/react';
import './CronogramaProducao.css';

const getEventColor = (type) => {
  switch (type) {
    case 'plantio': return '#2ecc40';
    case 'blackout': return '#222f3e';
    case 'colheita': return '#e74c3c';
    case 'desempilhamento': return '#f7b731';
    default: return '#b2bec3';
  }
};

const CronogramaProducao = () => {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseTarefas = await fetch('https://backend.cultivesmart.com.br/api/tarefas');
        const tarefas = await responseTarefas.json();

        // Agrupa tarefas por tipo e data
        const grouped = {};
        tarefas.forEach(tarefa => {
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

        // Cria eventos agrupados
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
      } catch (error) {
        setEvents([]);
      }
    };
    fetchData();
  }, []);

  // Handler para abrir o modal ao clicar no evento
  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps);
    setModalVisible(true);
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
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <strong>
            {selectedEvent ? selectedEvent.tipo.charAt(0).toUpperCase() + selectedEvent.tipo.slice(1) : ''}
          </strong>
        </CModalHeader>
        <CModalBody>
          {selectedEvent && (
            <>
              <p><strong>Data:</strong> {selectedEvent.data}</p>
              <p><strong>Lotes:</strong> {selectedEvent.lotes.join(', ')}</p>
              <p><strong>Quantidade de lotes:</strong> {selectedEvent.lotes.length}</p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Fechar
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default CronogramaProducao;