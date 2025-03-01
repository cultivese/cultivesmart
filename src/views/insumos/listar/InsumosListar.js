import React, { useState, useRef, useEffect } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CAccordionHeader,
  CContainer,
  CFormCheck,
  CCardImage,
  CCardLink,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCardTitle,
  CCardText,
  CCardSubtitle,
} from '@coreui/react';
import { DocsExample } from 'src/components'
const InsumosCadastro = () => {
  const [insumos, setInsumos] = useState([]);  
  const [activeStep, setActiveStep] = useState(0);
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);  
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroFornecedor, setFiltroFornecedor] = useState('');
  const [showAdditionalFieldsModal, setShowAdditionalFieldsModal] = useState(false); // Estado para controlar o modal
  const hiddenFileInput = useRef(null);
  const [insumoSelecionado, setInsumoSelecionado] = useState(null);
  const handleSubstratoSelect = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedSubstratos(selectedOptions);
  };

  useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/categorias')
      .then(response => response.json())
      .then(data => {
        setCategorias(data);
      })
      .catch(error => console.error('Erro ao buscar categorias:', error));
  }, []);


   useEffect(() => {
      fetch('https://backend.cultivesmart.com.br/api/insumos')
      .then(response => response.json())
      .then(data => {
        setInsumos(data);
      })
      .catch(error => console.error('Erro ao buscar insumos:', error));
  
    }, []);

  useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/fornecedores')
      .then(response => response.json())
      .then(data => {
        setFornecedores(data);
      })
      .catch(error => console.error('Erro ao buscar fornecedores:', error));
  }, []);


  const limparFiltros = () => {
    setFiltroNome('');
    setFiltroFornecedor('');
    setFiltroCategoria(''); // Limpa o filtro de categoria
};


  const handleNext = (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newStepErrors = [...stepErrors];

    // Validation logic for each step
    if (activeStep === 0 && !filtroCategoria) {
        hasErrors = true;
    } else if (activeStep === 1 && !formData.fornecedor_id) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    } else if (activeStep === 2 &&
      filtroCategoria === "1" && (
          !formData.nome.trim() || !formData.variedade.trim() || !formData.descricao.trim() ||
          !formData.unidade_medida)
   ) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    } else if (activeStep === 2 &&
      filtroCategoria === 2 && (!formData.descricao ||  !formData.unidade_medida || !formData.estoque_minimo)
    ) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    }
    setStepErrors(newStepErrors);

    if (!hasErrors) {
        setActiveStep(prevStep => prevStep + 1);
    }
};

const handleAdditionalFieldsChange = (event) => {
  const { id, value } = event.target;
  setAdditionalFields(prevState => ({
    ...prevState,
    [id]: value,
  }));
};

const handleOpenAdditionalFieldsModal = (insumo) => {
  setInsumoSelecionado(insumo);
  setShowAdditionalFieldsModal(true);
};

const handleCloseAdditionalFieldsModal = () => {
  setShowAdditionalFieldsModal(false);
};

const handleSaveAdditionalFields = () => {
  // Atualiza o formData com os valores do modal
  setFormData(prevState => ({
    ...prevState,
    quantidade_inicial: additionalFields.quantidade_inicial,
    unidade_medida_conteudo: additionalFields.unidade_medida_conteudo,
    quantidade_consumida: additionalFields.quantidade_consumida,
  }));
  setShowAdditionalFieldsModal(false); // Fecha o modal
};

const handleCategorySelect = (category) => {
  setFiltroCategoria(category);  // Atualiza o estado da categoria selecionada
  setFormData(prevState => ({
    ...prevState,
    category: category  // Atualiza o valor da categoria no formData
  }));
};

const filtrarInsumos = () => {
  return insumos && insumos.records
      ? insumos.records.filter((insumo) => {
            const nomeMatch =
                !filtroNome ||
                insumo.nome.toLowerCase().includes(filtroNome.toLowerCase());
            const fornecedorMatch =
                !filtroFornecedor ||
                insumo.fornecedor_id === parseInt(filtroFornecedor);
                const categoriaMatch =
                !filtroCategoria ||
                insumo.categoria_id === parseInt(filtroCategoria);
            return nomeMatch && fornecedorMatch && categoriaMatch;
        })
      : [];
};

const handleBack = (e) => {
  e.preventDefault();
  setActiveStep((prev) => Math.max(prev - 1, 0));
  
  setStepErrors(prevErrors => {
      const newErrors = [...prevErrors];
      newErrors[activeStep] = false; 
      return newErrors;
  });
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      
      const response = await fetch('https://backend.cultivesmart.com.br/api/insumos', {
        method: 'GET',
      });

      if (response.ok) {
        setActiveStep(0);
      } else {
        alert('Erro ao cadastrar insumo!');
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }
  };

  return (
    <CContainer>
      
      <CForm onSubmit={handleSubmit} className="row g-3">
          
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Insumos - </strong>
                  <small>Consulta de Insumos</small>
                </CCardHeader>
                <CCardBody>
                  <DocsExample href="components/card/#background-and-color">
                    <CRow className="align-items-center justify-content-center mb-4" xs={{ gutterY: 5 }} >

                    {categorias && categorias.records && categorias.records.map((categoria) => {
                          return (
                            <CCol
                              key={categoria.id}
                              color={ filtroCategoria === categoria.id ? 'success' : 'light'}
                              style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center',
                              
                          }}>
                                  

                              <CCol lg={4} onClick={() => handleCategorySelect(categoria.id)}>
                                <CCardImage width="fit" orientation="top" src={`data:image/png;base64,${categoria.logoPath}`} />
                              </CCol>
                              <CCol>
                                <CFormCheck
                                    type='radio'
                                    name="categoria"
                                    id={`flexCheckChecked${categoria.id}`}
                                    label={categoria.descricao}
                                    value={categoria.id}
                                    checked={filtroCategoria === categoria.id.toString()}
                                    onChange={(e) => setFiltroCategoria(e.target.value)}
                                />
                              </CCol>
                            </CCol>
                          );
                        })}
                    </CRow>

                    <CRow className="align-items-center justify-content-center mb-4" xs={{ gutterY: 5 }} >
                      <CCol>
                        <CFormInput
                            type="text"
                            size="lg"
                            placeholder="Nome..."
                            aria-label="lg input example"
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                        />
                      </CCol>
                      <CCol>
                        <CFormSelect
                            size="lg"
                            aria-label="Large select example"
                            value={filtroFornecedor}
                            onChange={(e) => setFiltroFornecedor(e.target.value)}
                        >
                          <option>Escolha o fornecedor...</option>
                          {fornecedores &&
                              fornecedores.records &&
                              fornecedores.records.length > 0 &&
                              fornecedores.records.map((fornecedor) => {
                                return (
                                  <option key={fornecedor.id} value={fornecedor.id}>
                                    {fornecedor.nome}
                                  </option>
                                )
                            })
                          }
                        </CFormSelect>
                      </CCol>
                      <CCol>
                        <CButton color="secondary" onClick={limparFiltros}>Limpar filtros</CButton>
                      </CCol>
                    </CRow>
                  </DocsExample>

                  <DocsExample href="components/card/#background-and-color">
                    <CRow xs={{ gutterY: 5 }} className="justify-content-around">
                    {filtrarInsumos().map((insumo) => {
                        return (
                                <CCard style={{width: '45%'}}>
                                  <CRow>
                                    <CCol xs={6} md={3} style={{marginTop:10, marginBottom:10}}>
                                      <CCardImage style={{ maxWidth: '150px' }} src={`data:image/png;base64,${insumo.logoPath}`} />
                                    </CCol>
                                    <CCol xs={4} md={9}>
                                      <CCardBody>
                                        <CCardTitle>{insumo.nome}</CCardTitle>
                                        <CCardSubtitle>{insumo.unidade_medida}</CCardSubtitle>
                                        <CCardText>
                                          R$ {insumo.preco}
                                        </CCardText>
                                        <CCardLink style={{ float: 'right' }} href="#" onClick={() =>
                                            handleOpenAdditionalFieldsModal(insumo)
                                        }>Ver mais detalhes</CCardLink>
                                      </CCardBody>
                                    </CCol>
                                  </CRow>
                                </CCard>
                        )
                      })
                    }
                     
                    </CRow>
                  </DocsExample>
                </CCardBody>
              </CCard>
            </CCol>
            
        
      </CForm>

      <CModal
        alignment="center"
        visible={showAdditionalFieldsModal}
        onClose={handleCloseAdditionalFieldsModal}
    >
        <CModalHeader closeButton>
            <strong>Informações de medida do Insumo</strong>
        </CModalHeader>
        <CModalBody>
          {insumoSelecionado && (
              <div>
                  <p><strong>Nome:</strong> {insumoSelecionado.nome}</p>
                  <p><strong>Descrição:</strong> {insumoSelecionado.descricao}</p>
                  <p><strong>Unidade de Medida:</strong> {insumoSelecionado.unidade_medida}</p>
                  <p><strong>Quantidade:</strong> {insumoSelecionado.quantidade}</p>
                  <p><strong>Desconto:</strong>% {insumoSelecionado.desconto}</p>
                  <p><strong>Imposto:</strong>% {insumoSelecionado.imposto}</p>
                  <p><strong>Preço:</strong> R$ {insumoSelecionado.preco}</p>
                  {/* Adicione outros campos que você deseja exibir */}
              </div>
          )}
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={handleCloseAdditionalFieldsModal}>
                Fechar
            </CButton>
            <CButton color="primary" onClick={handleSaveAdditionalFields}>
                Salvar
            </CButton>
        </CModalFooter>
    </CModal>
     
    </CContainer>

    
  );
};

export default InsumosCadastro;