import "./css/dashboard.css"

import React, { useState } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CRow, CModal, CModalBody, CModalHeader, CButton } from "@coreui/react";

const WeeklyView = ({ activities, weekDates }) => {
  const [selectedActivity, setSelectedActivity] = useState(null); // Atividade selecionada para exibir no modal
  const [modalVisible, setModalVisible] = useState(false); // Controle do modal

  const daysOfWeek = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

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
      {/* Cabeçalho do Período */}
      <div className="week-period">
        Período: <span>{weekDates[0]}</span> - <span>{weekDates[6]}</span>
      </div>

      {/* Exibição dos Dias da Semana e Atividades */}
      <CRow>
        {weekDates.map((date, index) => (
          <CCol key={index} sm={12} md={6} lg={4}>
            <CCard>
              <CCardHeader>
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][index]} ({date})
              </CCardHeader>
              <CCardBody>
                {activities[index] ? (
                  activities[index].map((activity) => (
                    <span
                      key={activity.id}
                      className={`activity-label ${activity.type}`}
                      onClick={() => openModal(activity)}
                    >
                      {activity.type === "semeadura" && <i className="fas fa-seedling" style={{ marginRight: "0.5rem" }}></i>}
                      {activity.type === "irrigacao" && <i className="fas fa-water" style={{ marginRight: "0.5rem" }}></i>}
                      {activity.type === "colheita" && <i className="fas fa-leaf" style={{ marginRight: "0.5rem" }}></i>}
                      {activity.type === "limpeza" && <i className="fas fa-broom" style={{ marginRight: "0.5rem" }}></i>}
                      {activity.type}
                    </span>
                  ))
                ) : (
                  <div>Nenhuma atividade</div>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

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