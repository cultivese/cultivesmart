import React, { useState, useEffect } from 'react';
import { CRating } from '@coreui/react-pro'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardImage,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CCol,
  CFormSelect,
  CFormSwitch,
  CInputGroupText,
  CFormInput,
  CRow,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CInputGroup
} from '@coreui/react'

import { cilStar } from '@coreui/icons';



const InsumosEspecificacao = () => {
  
  const [insumos, setInsumos] = useState([]);  
  const [visible, setVisible] = useState(false)


 useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/insumos')
    .then(response => response.json())
    .then(data => {
      setInsumos(data);
    })
    .catch(error => console.error('Erro ao buscar insumos:', error));

  }, []);

  return (
    <CTabs activeItemKey="microverdes">
      <CTabList variant="tabs">
        <CTab itemKey="todos">Todos</CTab>
        <CTab itemKey="microverdes">Microverdes</CTab>
        <CTab itemKey="flores_comestiveis">Flores comestíveis</CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel className="p-3" itemKey="microverdes">
          <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 6 }}>
            {
              insumos && insumos.records && insumos.records.length > 0 ? (
                insumos.records.map((insumo) => (                
                  <CCol style={{ width: '20rem' }} key={insumo.id}>
                    <CCard>
                      <CCardImage orientation="top" src={`data:image/png;base64,${insumo.logoPath}`} />
                      <CCardBody>
                        <CCardTitle>{insumo.nome}</CCardTitle>
                        <CCardSubtitle>{insumo.variedade}</CCardSubtitle>
                        <CRating readOnly value={3} />
                        <CCardText>
                          {insumo.descricao}
                        </CCardText>
                        <CBadge color="warning">Especificação já definida</CBadge>
                      </CCardBody>
                      <CCardFooter className="text-center">
                        <CButton color="primary" onClick={() => setVisible(!visible)}>
                          Visualizar
                        </CButton>
                        <CModal
                          alignment="center"
                          visible={visible}
                          onClose={() => setVisible(false)}
                          aria-labelledby="VerticallyCenteredExample"
                        >
                          <CModalHeader>
                            <CModalTitle id="VerticallyCenteredExample">Especificação</CModalTitle>
                          </CModalHeader>
                          <CModalBody>
                          <CCol md={8}>
                          
                            <h5>Colheita</h5>
                            <CCol md={8}>
                                <CInputGroup className="mb-3">
                                  <CInputGroupText id="basic-addon3">Dias em pilha</CInputGroupText>
                                  <CFormInput id="basic-url" aria-describedby="basic-addon3" />
                                </CInputGroup>
                              </CCol>
                              <CCol md={8}>
                                <CInputGroup className="mb-3">
                                  <CInputGroupText id="basic-addon3">Dias em blackout</CInputGroupText>
                                  <CFormInput id="basic-url" aria-describedby="basic-addon3" />
                                </CInputGroup>
                              </CCol>
                              <CCol md={8}>
                                <CInputGroup className="mb-3">
                                  <CInputGroupText id="basic-addon3">Dias até acolheita</CInputGroupText>
                                  <CFormInput id="basic-url" aria-describedby="basic-addon3" />
                                </CInputGroup>
                              </CCol>
                              <CCol md={8}>
                                <CInputGroup className="mb-3">
                                  <CInputGroupText as="label" htmlFor="inputGroupSelect01">
                                    Hidratação
                                  </CInputGroupText>
                                  <CFormSelect id="inputGroupSelect01">
                                    <option>Selecione...</option>
                                    <option value="1">Irrigação</option>
                                    <option value="2">Aspersão</option>
                                  </CFormSelect>
                                </CInputGroup>
                                <CFormSwitch label="Colocar peso" id="formSwitchCheckChecked" defaultChecked/>

                              </CCol>
                              <hr />
                              <h5>Alerta</h5>
                                <CInputGroup className="mb-3">
                                  <CInputGroupText id="basic-addon3">Estoque Mínimo</CInputGroupText>
                                  <CFormInput id="basic-url" aria-describedby="basic-addon3" />
                                </CInputGroup>
                              </CCol>

                          </CModalBody>
                          <CModalFooter>
                            <CButton color="secondary" onClick={() => setVisible(false)}>
                              Cancelar
                            </CButton>
                            <CButton color="primary">Salvar</CButton>
                          </CModalFooter>
                        </CModal>
                        
                      </CCardFooter>
                    </CCard>
                  </CCol>
                ))
              ) : (
                <p>Não existem insumos a serem exibidos.</p>
              )}
          </CRow>
        </CTabPanel>
        <CTabPanel className="p-3" itemKey="flores_comestiveis">
          Profile tab content
        </CTabPanel>
      </CTabContent>
    </CTabs>
  )
}

export default InsumosEspecificacao