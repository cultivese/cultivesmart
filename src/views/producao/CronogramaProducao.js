// src/views/producao/CronogramaProducao.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Estilos padrão do calendário
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CBadge,
} from '@coreui/react';
import './CronogramaProducao.css'; // Arquivo de estilos customizado

const CronogramaProducao = () => {
  const [value, onChange] = useState(new Date());

  // Função para determinar os eventos de um dia específico
  const getEventsForDate = (date) => {
    const day = date.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const events = [];

    // Lógica dos eventos baseada nos dias da semana
    if (day === 1 || day === 5) { // Segunda ou Sexta
      events.push({ type: 'plantio', label: 'Plantio' });
    }

    if (day === 3) { // Quarta
      events.push({ type: 'desempilhamento-beterraba', label: 'Desempilhamento' });
    }

    if (day === 5) { // Sexta
      events.push({ type: 'desempilhamento-repolho', label: 'Desempilhamento' });
    }

    // Você pode adicionar lógica para saída do blackout e colheita aqui
    // Exemplo: se houver dados de lotes, você poderia fazer uma busca por lote
    // Aqui, estamos usando uma lógica estática para a demonstração
    // if (day === 2) { // Exemplo: colheita nas terças
    //   events.push({ type: 'colheita', label: 'Colheita' });
    // }

    return events;
  };

  // Função para renderizar o conteúdo do tile (dia do calendário)
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const events = getEventsForDate(date);
      if (events.length > 0) {
        return (
          <div className="event-container">
            {events.map((event, index) => (
              <CBadge key={index} color={getBadgeColor(event.type)} className="event-badge">
                {event.label}
              </CBadge>
            ))}
          </div>
        );
      }
    }
    return null;
  };

  // Função para retornar a cor do badge com base no tipo de evento
  const getBadgeColor = (type) => {
    switch (type) {
      case 'plantio':
        return 'success';
      case 'desempilhamento-beterraba':
        return 'warning';
      case 'desempilhamento-repolho':
        return 'primary';
      case 'saida-blackout':
        return 'info';
      case 'colheita':
        return 'danger';
      default:
        return 'secondary';
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
                  <Calendar
                    onChange={onChange}
                    value={value}
                    tileContent={tileContent}
                    className="cultive-smart-calendar"
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