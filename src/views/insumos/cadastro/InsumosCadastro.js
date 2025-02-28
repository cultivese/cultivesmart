import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CImage,
  CInputGroup,
  CInputGroupText,
  CCardImage,
  CForm,
  CFormTextarea,
  CFormInput,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CRow,
  CCardTitle,
  CCardText,
  CConditionalPortal,
} from '@coreui/react';
import { Stepper, Step } from 'react-form-stepper';
import avatar8 from './../../../assets/images/microverdes/product_default.png'
import { DocsExample } from 'src/components'
const InsumosCadastro = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]); 
  const [unidadesMedida , setUnidadesMedida ] = useState([]);   
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);
  const [stepErrors, setStepErrors] = useState([false, false, false, false, false]); // Array to track errors for each step
  const [showAdditionalFieldsModal, setShowAdditionalFieldsModal] = useState(false); // Estado para controlar o modal
  const [additionalFields, setAdditionalFields] = useState({ // Estado para os campos adicionais
    quantidade_inicial: '',
    unidade_medida_conteudo: '',
    quantidade_consumida: '',
  });
  const hiddenFileInput = useRef(null);
  const stepLabels = [
    { title: "Categoria", subtitle: "Escolha a categoria" },
    { title: "Fornecedor", subtitle: "Defina o fornecedor" },
    { title: "Informações", subtitle: "Preencha as informações principais" },
    { title: "Resumo", subtitle: "Resumo dos dados preenchidos" },
  ];

  const [formData, setFormData] = useState({
    nome:'',
    categoria_id: '',
    fornecedor_id: '',
    variedade: '',
    descricao: '',
    unidade_medida: '',
    quantidade: 0,
    imposto: 0,
    desconto: 0,
    preco: 0,
    logo: null
  });

  const categoryNames = {
    '1': 'Sementes - Microverde',
    '2': 'Flores Comestíveis',
    '3': 'Substrato',
  };

  const handleSubstratoSelect = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedSubstratos(selectedOptions);
  };

    const fetchedCategorias = useMemo(async () => {
      try {
          const response = await fetch('https://backend.cultivesmart.com.br/api/categorias');
          return await response.json();
      } catch (error) {
          console.error('Erro ao buscar categorias:', error);
          return null;
      }
    }, []);

    const fetchedFornecedores = useMemo(async () => {
      try {
          const response = await fetch('https://backend.cultivesmart.com.br/api/fornecedores');
          return await response.json();
      } catch (error) {
          console.error('Erro ao buscar fornecedores:', error);
          return null;
      }
    }, []);

    const fetchedUnidadesMedida = useMemo(async () => {
      try {
          const response = await fetch('https://backend.cultivesmart.com.br/api/unidades-medida');
          return await response.json();
      } catch (error) {
          console.error('Erro ao buscar unidades de medida:', error);
          return null;
      }
   }, []);

  useEffect(() => {
      const loadData = async () => {
          setCategorias(await fetchedCategorias);
          setFornecedores(await fetchedFornecedores);
          setUnidadesMedida(await fetchedUnidadesMedida);
      };
      loadData();
  },[fetchedCategorias, fetchedFornecedores, fetchedUnidadesMedida]);

  const handleLogoChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFormData((prevData) => ({
          ...prevData,
          logo: file,
          logoUrl: URL.createObjectURL(file),
      }));
    }

  };

  const handleImageClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const { id, value, type, checked } = event.target;
    setFormData(prevState => ({
        ...prevState,
        [id]: type === 'checkbox' ? checked : value,
    }));

    if (event.target.name === 'define_especificacao') { // Assuming this is the id of your radio button group
      setShowSpecificationFields(value === '1'); // Show if value is '1' (Sim)
    }

    // Clear error for the current field when it's changed
    setStepErrors(prevErrors => {
        const newErrors = [...prevErrors];
        // Find the step the field belongs to and clear the error
        if (activeStep === 1 && id === 'fornecedor_id') newErrors[activeStep] = false;
        if (activeStep === 2 && ['descricao', 'unidade_medida', 'estoque_minimo'].includes(id)) newErrors[activeStep] = false;
        if (activeStep === 3 && ['dias_pilha', 'dias_blackout', 'dias_colheita', 'hidratacao'].includes(id)) newErrors[activeStep] = false;
        return newErrors;
    });
};

const handleChange1 = (event) => {
  const { value } = event.target;
  setShowSpecificationFields(value === '1'); // Atualiza o estado com base no valor do rádio
};

  const handleNext = (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newStepErrors = [...stepErrors];

    // Validation logic for each step
    if (activeStep === 0 && !selectedCategory) {
        hasErrors = true;
    } else if (activeStep === 1 && !formData.fornecedor_id) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    } else if (activeStep === 2 &&
      selectedCategory === "1" && (
          !formData.nome.trim() || !formData.variedade.trim() || !formData.descricao.trim() ||
          !formData.unidade_medida)
   ) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    } else if (activeStep === 2 &&
      selectedCategory === 2 && (!formData.nome.trim() ||  !formData.variedade.trim() || !formData.descricao.trim())
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

const handleOpenAdditionalFieldsModal = () => {
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

const handleCategorySelect = (categoria_id) => {
  setSelectedCategory(categoria_id);  // Atualiza o estado da categoria selecionada
  setFormData(prevState => ({
    ...prevState,
    categoria_id: categoria_id  // Atualiza o valor da categoria no formData
  }));
};

const handleFornecedorSelect = (id) => {
  setFormData(prevState => ({
      ...prevState,
      fornecedor_id: id
  }));
  setSelectedFornecedor(id);
};

const handleBack = (e) => {
  e.preventDefault();
  setActiveStep((prev) => Math.max(prev - 1, 0));
  // Clear errors for the current step when going back
  setStepErrors(prevErrors => {
      const newErrors = [...prevErrors];
      newErrors[activeStep] = false; // Clear errors for the current step
      return newErrors;
  });
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formDataToSend = new FormData(); // Use FormData para enviar arquivos
        
      for (const key in formData) {
        formDataToSend.append(key, formData[key]); // Append all data to FormData
      }
      
      const response = await fetch('https://backend.cultivesmart.com.br/api/insumos', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Insumo cadastrado com sucesso!');
        setFormData({
          selectedCategory: 0,
          categoria_id: '', fornecedor_id: '', descricao: '', unidade_medida: '',
          estoque_minimo: 0, dias_pilha: 0, dias_blackout: 0, dias_colheita: 0, hidratacao: '',
          colocar_peso: true, substrato: false
        });
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
      <Stepper activeStep={activeStep}>
        <Step label="Categoria" onClick={() => setActiveStep(0)} />
        <Step label="Fornecedor" onClick={() => setActiveStep(1)} />
        <Step label="Informações" onClick={() => setActiveStep(2)} />
        <Step label="Resumo" onClick={() => setActiveStep(3)} />
      </Stepper>
      <CForm onSubmit={handleSubmit} className="row g-3">
          
          {activeStep === 0 && (
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>{stepLabels[activeStep].title} - </strong>
                  <small>{stepLabels[activeStep].subtitle}</small>
                </CCardHeader>
                <CCardBody>
                  <DocsExample href="components/card/#background-and-color">
                    <CRow xs={{ gutterY: 5 }} >

                    {categorias && categorias.records && categorias.records.map((categoria) => {
                          return (
                            <CCol lg={4} key={categoria.id}>
                              <CCard color={ selectedCategory === categoria.id ? 'success' : 'light'}
                                      textColor={ selectedCategory === categoria.id ? 'white' : ''}
                                      className="h-100"
                                      onClick={() => handleCategorySelect(categoria.id)}
                                      style={{cursor: 'pointer'}}>
                                <CCardImage orientation="top" src={`data:image/png;base64,${categoria.logoPath}`} />
                                <CCardBody>
                                  <CCardTitle>{categoria.descricao}</CCardTitle>
                                  <CCardText>
                                      <small>{categoria.comentarios}</small>
                                  </CCardText>
                                </CCardBody>
                              </CCard>
                            </CCol>
                          );
                        })}
                    </CRow>
                  </DocsExample>
                </CCardBody>
              </CCard>
            </CCol>
          )}

          {activeStep === 1 && (
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>{stepLabels[activeStep].title} - </strong>
                  <small>{stepLabels[activeStep].subtitle}</small>
                </CCardHeader>
                <CCardBody>
                  <DocsExample href="components/card/#background-and-color">
                    <CRow>
                        {fornecedores.records.map((fornecedor) => {
                          return (
                          <CCol lg={4} key={fornecedor.id}>
                            <CCard key={fornecedor.id}
                              color={ selectedFornecedor === fornecedor.id ? 'success' : 'light'}
                              textColor={ selectedFornecedor === fornecedor.id ? 'white' : ''}
                              className="mb-3"
                              onClick={() => handleFornecedorSelect (fornecedor.id)}
                              style={{cursor: 'pointer'}}>
                              <CCardHeader>{fornecedor.nome}</CCardHeader>
                              <CCardImage
                                src={`data:image/png;base64,${fornecedor.logoPath}`}
                                style={{cursor: 'pointer', maxHeight: '20em', width: '100%', height: '100%', objectFit: 'cover'}}
                                onError={(e) => console.error('Erro ao carregar imagem:', e.target.src, e)}

                              />
                            </CCard>
                          </CCol>);
                        })}
                    </CRow>
                  </DocsExample>
                </CCardBody>
              </CCard>
            </CCol>
          )}
            
          {activeStep === 2 && (
              <CRow>
                <CCol xs={8} md={8}>
                  <CCard className="mb-4" style={{cursor: 'pointer'}}>
                    <CCardHeader>
                      <strong>{stepLabels[2].title} - </strong>
                      <small>{stepLabels[2].subtitle}</small>
                    </CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol md={3}>
                          <CImage fluid  orientation="left" src={formData.logoUrl || avatar8}
                            onClick={handleImageClick}
                            style={{ cursor: 'pointer', maxHeight: '13em', width: '100%', objectFit: 'cover',
                              height: '100%' }} />
                            <input
                            type="file"
                            ref={hiddenFileInput}
                            onChange={handleLogoChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                          />
                        </CCol>
                        <CCol md={9}>
                          <CRow>
                            <CCol md={7}>
                              <CFormInput
                                    type="text"
                                    id="nome"
                                    floatingClassName="mb-3"
                                    floatingLabel="Nome"
                                    value={formData.nome}
                                    onChange={handleChange} required
                                    className={stepErrors[activeStep] && (!formData.nome) ? 'is-invalid' : ''}
                                  />
                            </CCol>
                          
                            <CCol md={5}>
                              <CFormInput
                                    type="text"
                                    id="variedade"
                                    floatingClassName="mb-3"
                                    floatingLabel="Variedade"
                                    value={formData.variedade}
                                    onChange={handleChange}
                                    required
                                    className={stepErrors[activeStep] && (!formData.variedade) ? 'is-invalid' : ''}
                                  />
                            </CCol>
                          
                          
                          
                          <CCol md={12}  xs={{ gutterY: 5}}>
                            <CFormTextarea
                              id="descricao"
                              value={formData.descricao}
                              floatingLabel="Descricao" 
                              floatingClassName="mb-3"                         
                              onChange={handleChange}
                              style={{ minHeight: '130px' }} // Altura mínima
                              className={stepErrors[activeStep] && (!formData.descricao) ? 'is-invalid' : ''}
                              required
                            ></CFormTextarea>
                          </CCol>
                        </CRow>
                      </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol xs={4} md={4}>
                  <CCard className="mb-4" style={{cursor: 'pointer'}}>
                      <CCardHeader>
                        <strong>Informações - </strong>
                        <small>Detalhes</small>
                      </CCardHeader>
                      <CCardBody>
                        <CRow>

                          <CCol xs={6}>
                            <CFormInput
                                type="numeric"
                                id="quantidade"
                                floatingClassName="mb-3"
                                floatingLabel="Quantidade"
                                value={formData.quantidade}
                                onChange={handleChange}
                                required
                                className={stepErrors[activeStep] && (!formData.variedade) ? 'is-invalid' : ''}
                              />
                          </CCol>

                          <CCol xs={6}>
                            <CFormSelect
                                  id="unidade_medida"
                                  floatingLabel="Unidade de Medida"
                                  aria-label="Floating label select example"
                                  value={formData.unidade_medida}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  className={stepErrors[activeStep] && (!formData.unidade_medida) ? 'mb-3 is-invalid' : 'mb-3'}
                                  required
                                >
                                  <option value="" disabled>Escolha...</option>
                                  {
                                    unidadesMedida && unidadesMedida.map((unidadeMedida) => {
                                      return (
                                        <option key={unidadeMedida.id} value={unidadeMedida.id}>{unidadeMedida.descricao}</option>
                                      )
                                  }
                                )}
                              </CFormSelect>
                              {stepErrors[activeStep] && (!formData.unidade_medida) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                          </CCol>
                          
                          <CCol xs={6}>
                            <CInputGroup className="mb-3">
                              <CFormInput
                                type="numeric"
                                id="imposto"
                                floatingLabel="Imposto"
                                value={formData.imposto}
                                onChange={handleChange}
                                required
                                className={stepErrors[activeStep] && (!formData.variedade) ? 'is-invalid' : ''}
                              />
                              <CInputGroupText id="basic-addon1">%</CInputGroupText>
                            </CInputGroup>
                          </CCol>

                          <CCol xs={6}>
                            <CInputGroup className="mb-3">
                              <CFormInput
                                type="numeric"
                                id="desconto"
                                floatingLabel="Desconto"
                                value={formData.desconto}
                                onChange={handleChange}
                                required
                                className={stepErrors[activeStep] && (!formData.variedade) ? 'is-invalid' : ''}
                              />
                              <CInputGroupText id="basic-addon1">%</CInputGroupText>
                            </CInputGroup>
                          </CCol>
                         
                          <CCol xs={6}>
                            <CInputGroup className="mb-3">
                              <CInputGroupText id="basic-addon1">R$</CInputGroupText>
                                <CFormInput
                                  type="numeric"
                                  id="preco"
                                  floatingLabel="Preço"
                                  value={formData.preco}
                                  onChange={handleChange}
                                  required
                                  className={stepErrors[activeStep] && (!formData.variedade) ? 'is-invalid' : ''}
                                />
                            </CInputGroup>
                          </CCol>
                        </CRow>
                      </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
          )}

          {activeStep === 3 && (
              <CCol xs={12}>
                <CCard className="mb-4">
                  <CCardHeader>
                    <strong>{stepLabels[activeStep].title} - </strong>
                    <small>{stepLabels[activeStep].subtitle}</small>
                  </CCardHeader>
                  <CCardBody>
                    <div>
                      <h2 className="text-xl font-bold">Resumo</h2>
                      <p><strong>Categoria:</strong> {categoryNames[formData.categoria_id]}</p>
                      <p><strong>Fornecedor:</strong> {fornecedores.records[0].nome}</p>
                      <p><strong>Nome:</strong> {formData.nome}</p>
                      <p><strong>Variedade:</strong> {formData.variedade}</p>
                      <p><strong>Descrição:</strong> {formData.descricao}</p>
                      <p><strong>Quantidade:</strong> {formData.quantidade}</p>
                      <p><strong>Desconto:</strong> {formData.desconto}%</p>
                      <p><strong>Imposto:</strong> {formData.imposto}%</p>
                      <p><strong>Preço:</strong> R$ {formData.preco}</p>
                      {/* <p><strong>Unidade de Medida:</strong> {unidadesMedida.find(unidade => unidade.id === Number(formData.unidade_medida)).descricao}</p> */}
                      {/* <p><strong>Quantidade:</strong> {formData.quantidade_inicial} {unidadesMedida.find(unidade => unidade.id === Number(formData.unidade_medida_conteudo)).sigla}</p> */}

                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
          )}
          
          <CRow className="mt-4">
            {activeStep > 0 && (
              <CCol>
                <CButton color="secondary" onClick={handleBack}>Voltar</CButton>
              </CCol>
            )}
            {activeStep === 3 ? (
              <CCol>
              <CButton color="success" type="submit">Cadastrar</CButton>
            </CCol>
            ) : (
              <CCol>
                <CButton color="primary" onClick={(e) => handleNext(e)}>Próximo</CButton>
              </CCol>
            )}
          </CRow>
        
      </CForm>
      {/* Modal para campos adicionais */}
      <CModal alignment="center" visible={showAdditionalFieldsModal} onClose={handleCloseAdditionalFieldsModal}>
        <CModalHeader closeButton>
          <strong>Informações de medida do Insumo</strong>
        </CModalHeader>
        <CModalBody>
          <CRow lg={4}>
          <CFormInput
            type="number"
            id="quantidade_inicial"
            floatingClassName="mb-3"
            floatingLabel="Quantidade"
            value={additionalFields.quantidade_inicial}
            onChange={handleAdditionalFieldsChange}
          />
          <CFormSelect
            id="unidade_medida_conteudo"
            floatingLabel="Unidade de Medida"
            value={additionalFields.unidade_medida_conteudo}
            onChange={handleAdditionalFieldsChange}
          >
            {
              unidadesMedida.map((unidadeMedida) => { return (
                <option key={unidadeMedida.id} value={unidadeMedida.id}>{unidadeMedida.descricao}</option>
              )
              })
            }
            <option value="kg">Kilogramas</option>
          </CFormSelect>
          </CRow>
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