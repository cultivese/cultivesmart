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
  const [diasPilha, setDiasPilha] = useState('');
  const [diasBlackout, setDiasBlackout] = useState('');
  const [diasColheita, setDiasColheita] = useState('');
  const [hidratacao, setHidratacao] = useState('');
  const [colocarPeso, setColocarPeso] = useState(false);
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [activeTab, setActiveTab] = useState('microverdes'); // Estado para controlar a tab ativa
  const [filteredInsumos, setFilteredInsumos] = useState([]); // Novo estado para insumos filtrados

  const handleSubmit = () => {
    const especificacaoData = {
      diasPilha,
      diasBlackout,
      diasColheita,
      hidratacao,
      colocarPeso,
      estoqueMinimo,
      insumoId: insumoSelecionado.id, // Supondo que você tenha o ID do insumo selecionado
    };

    fetch('https://backend.cultivesmart.com.br/api/especificacao_insumos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(especificacaoData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Especificação cadastrada com sucesso:', data);
        setVisible(false); // Fecha o modal após o envio
      })
      .catch((error) => {
        console.error('Erro ao cadastrar especificação:', error);
      });
  }

 useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/insumos')
    .then(response => response.json())
    .then(data => {
      setInsumos(data);
    })
    .catch(error => console.error('Erro ao buscar insumos:', error));

  }, []);

  const getFilteredInsumos = (tab) => {
    if (!insumos || !insumos.records) return [];

    if (tab === 'todos') {
      return insumos.records;
    } else if (tab === 'microverdes') {
      return insumos.records.filter((insumo) => insumo.categoria_id === 1);
    } else if (tab === 'flores_comestiveis') {
      return insumos.records.filter((insumo) => insumo.categoria_id === 2);
    }

    return [];
  };

  return (
    <CTabs activeItemKey={activeTab} onActiveItemChange={(newKey) => setActiveTab(newKey)}>
      <CTabList variant="tabs">
        <CTab itemKey="todos">Todos</CTab>
        <CTab itemKey="microverdes">Microverdes</CTab>
        <CTab itemKey="flores_comestiveis">Flores comestíveis</CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel className="p-3" itemKey="todos">
            <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 6 }}>
              {getFilteredInsumos('todos').map((insumo) => (
                <CCol style={{ width: '20rem' }} key={insumo.id}>
                  <CCard>
                        <CCardImage orientation="top" src={`data:image/png;base64,${insumo.logoPath}`} />
                        <CCardBody>
                          <CCardTitle>{insumo.nome}</CCardTitle>
                          <CCardSubtitle>{insumo.variedade}</CCardSubtitle>
                          <CCardText>
                            {insumo.unidade_medida
                            }
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
                            <CCol md={12}>
                            
                              <h5>Colheita</h5>
                              <CCol md={5}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText id="basic-addon3">Dias em pilha</CInputGroupText>
                                    <CFormInput
                                      id="basic-url"
                                      type='number'
                                      aria-describedby="basic-addon3"
                                      value={diasPilha}
                                      onChange={(e) => setDiasPilha(e.target.value)}
                                    />
                                  </CInputGroup>
                                </CCol>
                                <CCol md={6}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText id="basic-addon3">Dias em blackout</CInputGroupText>
                                    <CFormInput
                                      id="basic-url"
                                      type='number'
                                      aria-describedby="basic-addon3"
                                      value={diasBlackout}
                                      onChange={(e) => setDiasBlackout(e.target.value)}
                                    />
                                  </CInputGroup>
                                </CCol>
                                <CCol md={6}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText id="basic-addon3">Dias até acolheita</CInputGroupText>
                                    <CFormInput
                                      id="basic-url"
                                      type='number'
                                      aria-describedby="basic-addon3"
                                      value={diasColheita}
                                      onChange={(e) => setDiasColheita(e.target.value)}
                                    />
                                  </CInputGroup>
                                </CCol>
                                <CCol md={8}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText as="label" htmlFor="inputGroupSelect01">
                                      Hidratação
                                    </CInputGroupText>
                                    <CFormSelect
                                      id="inputGroupSelect01"
                                      value={hidratacao}
                                      onChange={(e) => setHidratacao(e.target.value)}
                                    >
                                      <option value="">Selecione...</option>
                                      <option value="Irrigação">Irrigação</option>
                                      <option value="Aspersão">Aspersão</option>
                                    </CFormSelect>
                                  </CInputGroup>
                                  <CFormSwitch
                                    label="Colocar peso"
                                    id="formSwitchCheckChecked"
                                    checked={colocarPeso}
                                    onChange={(e) => setColocarPeso(e.target.checked)}
                                  />

                                </CCol>
                                <hr />
                                <h5>Alerta</h5>
                                <CCol md={6}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText id="basic-addon3">Estoque Mínimo</CInputGroupText>
                                    <CFormInput
                                      id="basic-url"
                                      type='number'
                                      aria-describedby="basic-addon3"
                                      value={estoqueMinimo}
                                      onChange={(e) => setEstoqueMinimo(e.target.value)}
                                    />
                                  </CInputGroup>
                                </CCol>
                              </CCol>

                            </CModalBody>
                            <CModalFooter>
                              <CButton color="secondary" onClick={() => setVisible(false)}>
                                Cancelar
                              </CButton>
                              <CButton color="primary" onClick={handleSubmit}>
                                Salvar
                              </CButton>
                            </CModalFooter>
                          </CModal>
                          
                        </CCardFooter>
                    </CCard>
                </CCol>
              ))}
            </CRow>
          </CTabPanel>
          <CTabPanel className="p-3" itemKey="microverdes">
            <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 6 }}>
              {getFilteredInsumos('microverdes').map((insumo) => (
                  <CCol style={{ width: '20rem' }} key={insumo.id}>
                    <CCard>
                        <CCardImage orientation="top" src={`data:image/png;base64,${insumo.logoPath}`} />
                        <CCardBody>
                          <CCardTitle>{insumo.nome}</CCardTitle>
                          <CCardSubtitle>{insumo.variedade}</CCardSubtitle>
                          <CCardText>
                            {insumo.unidade_medida
                            }
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
                            <CCol md={12}>
                            
                              <h5>Colheita</h5>
                              <CCol md={5}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText id="basic-addon3">Dias em pilha</CInputGroupText>
                                    <CFormInput
                                      id="basic-url"
                                      type='number'
                                      aria-describedby="basic-addon3"
                                      value={diasPilha}
                                      onChange={(e) => setDiasPilha(e.target.value)}
                                    />
                                  </CInputGroup>
                                </CCol>
                                <CCol md={6}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText id="basic-addon3">Dias em blackout</CInputGroupText>
                                    <CFormInput
                                      id="basic-url"
                                      type='number'
                                      aria-describedby="basic-addon3"
                                      value={diasBlackout}
                                      onChange={(e) => setDiasBlackout(e.target.value)}
                                    />
                                  </CInputGroup>
                                </CCol>
                                <CCol md={6}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText id="basic-addon3">Dias até acolheita</CInputGroupText>
                                    <CFormInput
                                      id="basic-url"
                                      type='number'
                                      aria-describedby="basic-addon3"
                                      value={diasColheita}
                                      onChange={(e) => setDiasColheita(e.target.value)}
                                    />
                                  </CInputGroup>
                                </CCol>
                                <CCol md={8}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText as="label" htmlFor="inputGroupSelect01">
                                      Hidratação
                                    </CInputGroupText>
                                    <CFormSelect
                                      id="inputGroupSelect01"
                                      value={hidratacao}
                                      onChange={(e) => setHidratacao(e.target.value)}
                                    >
                                      <option value="">Selecione...</option>
                                      <option value="Irrigação">Irrigação</option>
                                      <option value="Aspersão">Aspersão</option>
                                    </CFormSelect>
                                  </CInputGroup>
                                  <CFormSwitch
                                    label="Colocar peso"
                                    id="formSwitchCheckChecked"
                                    checked={colocarPeso}
                                    onChange={(e) => setColocarPeso(e.target.checked)}
                                  />

                                </CCol>
                                <hr />
                                <h5>Alerta</h5>
                                <CCol md={6}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText id="basic-addon3">Estoque Mínimo</CInputGroupText>
                                    <CFormInput
                                      id="basic-url"
                                      type='number'
                                      aria-describedby="basic-addon3"
                                      value={estoqueMinimo}
                                      onChange={(e) => setEstoqueMinimo(e.target.value)}
                                    />
                                  </CInputGroup>
                                </CCol>
                              </CCol>

                            </CModalBody>
                            <CModalFooter>
                              <CButton color="secondary" onClick={() => setVisible(false)}>
                                Cancelar
                              </CButton>
                              <CButton color="primary" onClick={handleSubmit}>
                                Salvar
                              </CButton>
                            </CModalFooter>
                          </CModal>
                          
                        </CCardFooter>
                    </CCard>
                  </CCol>
                ))}              
            </CRow>
          </CTabPanel>
          <CTabPanel className="p-3" itemKey="flores_comestiveis">
          <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 6 }}>
            {getFilteredInsumos('flores_comestiveis').map((insumo) => (
                <CCol style={{ width: '20rem' }} key={insumo.id}>
                  <CCard>
                        <CCardImage orientation="top" src={`data:image/png;base64,${insumo.logoPath}`} />
                        <CCardBody>
                          <CCardTitle>{insumo.nome}</CCardTitle>
                          <CCardSubtitle>{insumo.variedade}</CCardSubtitle>
                          <CCardText>
                            {insumo.unidade_medida
                            }
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
                            <CCol md={12}>
                            
                              <h5>Colheita</h5>
                              <CCol md={5}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText id="basic-addon3">Dias em pilha</CInputGroupText>
                                    <CFormInput
                                      id="basic-url"
                                      type='number'
                                      aria-describedby="basic-addon3"
                                      value={diasPilha}
                                      onChange={(e) => setDiasPilha(e.target.value)}
                                    />
                                  </CInputGroup>
                                </CCol>
                                <CCol md={6}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText id="basic-addon3">Dias em blackout</CInputGroupText>
                                    <CFormInput
                                      id="basic-url"
                                      type='number'
                                      aria-describedby="basic-addon3"
                                      value={diasBlackout}
                                      onChange={(e) => setDiasBlackout(e.target.value)}
                                    />
                                  </CInputGroup>
                                </CCol>
                                <CCol md={6}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText id="basic-addon3">Dias até acolheita</CInputGroupText>
                                    <CFormInput
                                      id="basic-url"
                                      type='number'
                                      aria-describedby="basic-addon3"
                                      value={diasColheita}
                                      onChange={(e) => setDiasColheita(e.target.value)}
                                    />
                                  </CInputGroup>
                                </CCol>
                                <CCol md={8}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText as="label" htmlFor="inputGroupSelect01">
                                      Hidratação
                                    </CInputGroupText>
                                    <CFormSelect
                                      id="inputGroupSelect01"
                                      value={hidratacao}
                                      onChange={(e) => setHidratacao(e.target.value)}
                                    >
                                      <option value="">Selecione...</option>
                                      <option value="Irrigação">Irrigação</option>
                                      <option value="Aspersão">Aspersão</option>
                                    </CFormSelect>
                                  </CInputGroup>
                                  <CFormSwitch
                                    label="Colocar peso"
                                    id="formSwitchCheckChecked"
                                    checked={colocarPeso}
                                    onChange={(e) => setColocarPeso(e.target.checked)}
                                  />

                                </CCol>
                                <hr />
                                <h5>Alerta</h5>
                                <CCol md={6}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText id="basic-addon3">Estoque Mínimo</CInputGroupText>
                                    <CFormInput
                                      id="basic-url"
                                      type='number'
                                      aria-describedby="basic-addon3"
                                      value={estoqueMinimo}
                                      onChange={(e) => setEstoqueMinimo(e.target.value)}
                                    />
                                  </CInputGroup>
                                </CCol>
                              </CCol>

                            </CModalBody>
                            <CModalFooter>
                              <CButton color="secondary" onClick={() => setVisible(false)}>
                                Cancelar
                              </CButton>
                              <CButton color="primary" onClick={handleSubmit}>
                                Salvar
                              </CButton>
                            </CModalFooter>
                          </CModal>
                          
                        </CCardFooter>
                    </CCard>
                </CCol>
              ))}
            </CRow>
          </CTabPanel>
      </CTabContent>
    </CTabs>
  )
}

export default InsumosEspecificacao