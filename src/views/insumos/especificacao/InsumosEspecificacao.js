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
  const [dias_pilha, setDiasPilha] = useState('');
  const [dias_blackout, setDiasBlackout] = useState('');
  const [dias_colheita, setDiasColheita] = useState('');
  const [hidratacao, setHidratacao] = useState('');
  const [colocar_peso, setColocarPeso] = useState(false);
  const [estoque_minimo, setEstoqueMinimo] = useState('');
  const [activeTab, setActiveTab] = useState('todos'); // Estado para controlar a tab ativa
  const [filteredInsumos, setFilteredInsumos] = useState([]); // Novo estado para insumos filtrados
  const [insumoSelecionado, setInsumoSelecionado] = useState(null); // Novo estado para o insumo selecionado

  const handleSubmit = () => {

    if (!insumoSelecionado || !insumoSelecionado.id) {
      console.error('Insumo não selecionado ou ID ausente.');
      return; // Impede a execução do restante da função
  }
  
    const especificacaoData = {
      dias_pilha,
      dias_blackout,
      dias_colheita,
      hidratacao,
      colocar_peso,
      estoque_minimo,
      insumo_id: insumoSelecionado.id, // Supondo que você tenha o ID do insumo selecionado
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

  useEffect(() => {
    if (insumoSelecionado && insumoSelecionado.especificacoes && insumoSelecionado.especificacoes.length > 0) {
        const especificacao = insumoSelecionado.especificacoes[0];
        setDiasPilha(especificacao.dias_pilha);
        setDiasBlackout(especificacao.dias_blackout);
        setDiasColheita(especificacao.dias_colheita);
        setHidratacao(especificacao.hidratacao);
        setColocarPeso(especificacao.colocar_peso);
        setEstoqueMinimo(especificacao.estoque_minimo);
    } else {
        setDiasPilha('');
        setDiasBlackout('');
        setDiasColheita('');
        setHidratacao('');
        setColocarPeso(false);
        setEstoqueMinimo('');
    }
}, [insumoSelecionado]);


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

  const handleOpenModal = (insumo) => {

    if (insumo && insumo.id) {
        setInsumoSelecionado(insumo);
        setVisible(true);
        console.log("Insumo selecionado:", insumo); // Para debug
    } else {
        console.error('Insumo inválido passado para handleOpenModal:', insumo);
    }

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
                          <CCardText>{insumo.unidade_medida}</CCardText>
                          {insumo.categoria_id === 1 || insumo.categoria_id === 2 ? (
                              insumo.especificacoes && insumo.especificacoes.length > 0 ? (
                                  <CBadge color="warning">Especificação já definida</CBadge>
                              ) : (
                                  <CBadge color="danger">Especificação a definir</CBadge>
                              )
                          ) : null}
                        </CCardBody>
                        {
                            (insumo.categoria_id === 1 || insumo.categoria_id === 2) ?
                        <CCardFooter className="text-center">
                          
                            <CButton color="primary" onClick={() => handleOpenModal(insumo)}>
                              {insumo.especificacoes && insumo.especificacoes.length > 0 ? "Visualizar Especificação" : "Cadastrar Especificação"}
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
                                      value={dias_pilha}
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
                                      value={dias_blackout}
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
                                      value={dias_colheita}
                                      onChange={(e) => setDiasColheita(e.target.value)}
                                    />
                                  </CInputGroup>
                                </CCol>
                                <CCol md={6}>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText id="basic-addon3">Quantidade (g) por bandeija plantada</CInputGroupText>
                                    <CFormInput
                                      id="basic-url"
                                      type='number'
                                      aria-describedby="basic-addon3"
                                      value={dias_colheita}
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
                                    checked={colocar_peso}
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
                                      value={estoque_minimo}
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
                              {insumoSelecionado && <CButton color="primary" onClick={handleSubmit}>
                                  Salvar
                              </CButton>}
                          </CModalFooter>
                          </CModal>
                          
                        </CCardFooter>
                        :
                        <></>

                      }
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
                          {insumo.categoria_id === 1 || insumo.categoria_id === 2 ? (
                              insumo.especificacoes && insumo.especificacoes.length > 0 ? (
                                  <CBadge color="warning">Especificação já definida</CBadge>
                              ) : (
                                  <CBadge color="danger">Especificação a definir</CBadge>
                              )
                          ) : null}
                        </CCardBody>
                        <CCardFooter className="text-center">
                          <CButton color="primary" onClick={() => handleOpenModal(insumo)}>
                            {insumo.especificacoes && insumo.especificacoes.length > 0 ? "Visualizar Especificação" : "Cadastrar Especificação"}
                          </CButton>
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
                          {insumo.categoria_id === 1 || insumo.categoria_id === 2 ? (
                              insumo.especificacoes && insumo.especificacoes.length > 0 ? (
                                  <CBadge color="warning">Especificação já definida</CBadge>
                              ) : (
                                  <CBadge color="danger">Especificação a definir</CBadge>
                              )
                          ) : null}
                        </CCardBody>
                        <CCardFooter className="text-center">
                          <CButton color="primary" onClick={() => handleOpenModal(insumo)}>
                            Visualizar
                          </CButton>
                          
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