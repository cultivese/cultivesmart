import React, { useState } from "react";
import { CCardText, CCard, CBadge, CCardBody, CCardHeader, CCol, CRow, CModal, CModalBody, CModalHeader, CButton } from "@coreui/react";
import { DocsExample } from 'src/components'


const WeeklyView = ({ activities, weekDates }) => {
  const [selectedActivity, setSelectedActivity] = useState(null); // Atividade selecionada para exibir no modal
  const [modalVisible, setModalVisible] = useState(false); // Controle do modal

  const openModal = (activity) => {
    setSelectedActivity(activity);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedActivity(null);
  };


  
  return (
    <div>
      <DocsExample href="components/card/#top-border">

      <CRow>
        {weekDates.map((date, index) => (
          <CCol key={index} sm={12} md={6} lg={3}>
            <CCard textColor='primary'
                      className={'mb-3 border-top-primary border-top-3'}>
              <CCardHeader>
                {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"][index]} ({date})
              </CCardHeader>
              <CCardBody>
              <CCardText>

                {activities[index] ? (
                  activities[index].map((activity, index) => (
                <CButton key={index} color={activity.color} className="me-2" onClick={() => openModal(activity)}> 
                     {activity.type} <CBadge color="secondary">{activity.lotes}</CBadge>
                </CButton>
                 ))) : (
                  <div>Nenhuma atividade</div>
                )}
              </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
      </DocsExample>

      {/* Modal para Detalhes da Atividade */}
      <CModal visible={modalVisible} onClose={closeModal}>
        <CModalHeader onClose={closeModal}>
          <strong>Detalhes da Atividade</strong>
        </CModalHeader>
        <CModalBody>
          {selectedActivity && (
            <div>
              <p>
                <strong>Tipo:</strong> {selectedActivity.type}
              </p>
              <p>
                <strong>Detalhes:</strong> {selectedActivity.details}
              </p>
            </div>
          )}
        </CModalBody>
      </CModal>
    </div>
  );
};

export default WeeklyView;