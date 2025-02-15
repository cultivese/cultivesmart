import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
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
} from '@coreui/react';
import { Stepper, Step } from 'react-form-stepper';
import microverdes_logo from './../../../assets/images/microverdes/beterraba.webp'
import flores_comestiveis from './../../../assets/images/microverdes/flores_comestiveis.webp'
import substrato from  './../../../assets/images/microverdes/substrato.webp'
import { DocsExample } from 'src/components'
const InsumosCadastro = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fornecedores, setFornecedores] = useState([]);
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);
  const [stepErrors, setStepErrors] = useState([false, false, false, false, false]); // Array to track errors for each step
  const [showAdditionalFieldsModal, setShowAdditionalFieldsModal] = useState(false); // Estado para controlar o modal
  const [additionalFields, setAdditionalFields] = useState({ // Estado para os campos adicionais
    quantidade_inicial: '',
    unidade_medida_conteudo: '',
    quantidade_consumida: '',
  });

  const stepLabels = [
    { title: "Categoria", subtitle: "Escolha a categoria" },
    { title: "Fornecedor", subtitle: "Defina o fornecedor" },
    { title: "Informações", subtitle: "Preencha as informações principais" },
    { title: "Resumo", subtitle: "Resumo dos dados preenchidos" },
  ];

  const [formData, setFormData] = useState({
    nome:'',
    category: '',
    fornecedor_id: '',
    variedade: '',
    descricao: '',
    unidade_medida: '',
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

  useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/fornecedores')
      .then(response => response.json())
      .then(data => {
        setFornecedores(data);
      })
      .catch(error => console.error('Erro ao buscar fornecedores:', error));
  }, []);

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
      selectedCategory === 2 && (!formData.descricao ||  !formData.unidade_medida || !formData.estoque_minimo)
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

const handleCategorySelect = (category) => {
  setSelectedCategory(category);  // Atualiza o estado da categoria selecionada
  setFormData(prevState => ({
    ...prevState,
    category: category  // Atualiza o valor da categoria no formData
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
      const response = await fetch('https://backend.cultivesmart.com.br/api/insumos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Insumo cadastrado com sucesso!');
        setFormData({
          selectedCategory: 0,
          category: '', fornecedor_id: '', descricao: '', unidade_medida: '',
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
                        <CCol lg={4} key='1'>
                          <CCard color={ selectedCategory === '1' ? 'success' : 'light'}
                                  textColor={ selectedCategory === '1' ? 'white' : ''}
                                  className="h-100"
                                  onClick={() => handleCategorySelect('1')}
                                  style={{cursor: 'pointer'}}>
                            <CCardImage orientation="top" src={microverdes_logo} />
                            <CCardBody>
                              <CCardTitle>Microverdes</CCardTitle>
                              <CCardText>
                                  <small>Rabanete, Amaranto, Acelga, Girassol, Salsa, Mostarda, Manjericão, Cebola, Cenoura</small>
                              </CCardText>
                            </CCardBody>
                          </CCard>

                        </CCol>
                        <CCol lg={4} key='2'>
                        <CCard color={ selectedCategory === '2' ? 'success' : 'light'}
                                  textColor={ selectedCategory === '2' ? 'white' : ''}
                                  className="h-100"
                                  onClick={() => handleCategorySelect('2')}
                                  style={{cursor: 'pointer'}}>
                            <CCardImage orientation="top" src={flores_comestiveis} />
                            <CCardBody>
                              <CCardTitle>Flores Comestíveis</CCardTitle>
                              <CCardText>
                                <small>Amor-Perfeito Gigante Suico Purpura, Amor-Perfeito Gigante Suico Branco, Amor-Perfeito Gigante Suico Roxo</small>
                              </CCardText>
                            </CCardBody>
                          </CCard>
                        </CCol>
                        <CCol lg={4} key='3'>
                        <CCard color={ selectedCategory === '3' ? 'success' : 'light'}
                                  textColor={ selectedCategory === '3' ? 'white' : ''}
                                  className="h-100"
                                  onClick={() => handleCategorySelect('3')}
                                  style={{cursor: 'pointer'}}>
                            <CCardImage orientation="top" src={substrato} />
                            <CCardBody>
                              <CCardTitle>Substratos</CCardTitle>
                              <CCardText>
                                <small>Carolina Soil, Pó de Coco</small>
                              </CCardText>
                            </CCardBody>
                          </CCard>
                        </CCol>
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
                                //src={`/storage/app/public/${fornecedor.logoPath}`} 
//                                onError={(e) => (e.target.src = isla_fornecedor)}
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
            selectedCategory === '1' && (
              <CRow>
                <CCol xs={12} md={12}>
                  <CCard className="mb-4" style={{cursor: 'pointer'}}>
                    <CCardHeader>
                      <strong>{stepLabels[2].title} - </strong>
                      <small>{stepLabels[2].subtitle}</small>
                    </CCardHeader>
                    <CCardBody>
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
                          style={{ minHeight: '200px' }} // Altura mínima
                          className={stepErrors[activeStep] && (!formData.descricao) ? 'is-invalid' : ''}
                          required
                        ></CFormTextarea>
                      </CCol>
                      <CCol md={4}>
                      <CFormSelect
                            id="unidade_medida"
                            floatingLabel="Unidade de Medida"
                            aria-label="Floating label select example"
                            value={formData.unidade_medida}
                            onChange={(e) => {
                              handleChange(e);
                              if (e.target.value === '1') { // Se for saco (unidade 1), abre o modal
                                handleOpenAdditionalFieldsModal();
                              }
                            }}
                            className={stepErrors[activeStep] && (!formData.unidade_medida) ? 'mb-3 is-invalid' : 'mb-3'}
                            required
                          >
                          <option value="" disabled>Escolha...</option>
                          <option value="1">Sacos</option>
                          <option value="2">Gramas</option>
                          <option value="3">Unidades</option>
                          <option value="4">Litro</option>
                        </CFormSelect>
                        {stepErrors[activeStep] && (!formData.unidade_medida) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                      </CCol>

                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              )
              ||
              selectedCategory === '2' && (
                <CCol xs={12}>
                  <CCard className="mb-4">
                    <CCardHeader>
                      <strong>{stepLabels[activeStep].title} - </strong>
                      <small>{stepLabels[activeStep].subtitle}</small>
                    </CCardHeader>
                    <CCardBody>
                      <CCol md={6}>
                        <CFormInput
                          type="text"
                          id="descricao"
                          floatingClassName="mb-3"
                          floatingLabel="Descricao"
                          value={formData.descricao}
                          onChange={handleChange}
                          className={stepErrors[activeStep] && (!formData.descricao) ? 'is-invalid' : ''}
                          required
                        />
                      </CCol>
                      <CCol md={2}>
                        <CFormInput
                          type="number"
                          id="quantidade"
                          floatingClassName="mb-3"
                          floatingLabel="Quantidade"
                          value={formData.quantidade}
                          onChange={handleChange} required
                          className={stepErrors[activeStep] && (!formData.quantidade) ? 'is-invalid' : ''}
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormSelect
                          id="unidade_medida"
                          floatingLabel="Unidade de Medida"
                          aria-label="Floating label select example"
                          value={formData.unidade_medida}
                          onChange={handleChange}
                          size="lg"
                          className={stepErrors[activeStep] && (!formData.unidade_medida) ? 'is-invalid' : ''}
                          required
                        >
                          <option value="" disabled>Escolha...</option>
                          <option value="sc">Sacos</option>
                          <option value="g">Gramas</option>
                          <option value="und">Unidades</option>
                          <option value="l">Litro</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={2}>
                      <CFormInput
                        type="number"
                        id="estoque_minimo"
                        floatingClassName="mb-3"
                        floatingLabel="Estoque Mínimo"
                        value={formData.estoque_minimo}
                        onChange={handleChange} required
                        className={stepErrors[activeStep] && (!formData.estoque_minimo) ? 'is-invalid' : ''}
                      />
                    </CCol>

                  </CCardBody>
                </CCard>
                </CCol>
              )
            )}

              {activeStep === 3 && (
                selectedCategory === '1' && (
                  <CCol xs={12}>
                  <CCard className="mb-4">
              <CCardHeader>
                <strong>{stepLabels[activeStep].title} - </strong>
                <small>{stepLabels[activeStep].subtitle}</small>
              </CCardHeader>
              <CCardBody>
                <div>
                  <h2 className="text-xl font-bold">Resumo</h2>
                  <p><strong>Categoria:</strong> {categoryNames[formData.category]}</p>
                  <p><strong>Fornecedor:</strong> {fornecedores.records[0].nome}</p>
                  <p><strong>Descrição:</strong> {formData.descricao}</p>
                  <p><strong>Unidade de Medida:</strong> {formData.unidade_medida}</p>
                </div>
                </CCardBody>
                </CCard>
              </CCol>
              )
            )
              }
              {activeStep === 3 && (
                selectedCategory === '2' && (
                  <CCol xs={12}>
                  <CCard className="mb-4">
              <CCardHeader>
                <strong>{stepLabels[activeStep].title} - </strong>
                <small>{stepLabels[activeStep].subtitle}</small>
              </CCardHeader>
              <CCardBody>
                <div>
                  <h2 className="text-xl font-bold">Resumo</h2>
                  <p><strong>Categoria:</strong> {categoryNames[formData.category]}</p>
                  <p><strong>Fornecedor:</strong> {fornecedores.records[0].nome}</p>
                  <p><strong>Dados Básicos:</strong> {formData.descricao}</p>
                  <p><strong>Unidade de Medida:</strong> {formData.unidade_medida}</p>
                  <p><strong>Estoque Mínimo:</strong> {formData.estoque_minimo}</p>
                </div>
                </CCardBody>
                </CCard>
                </CCol>
              )
            )
              }
              
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
            <option value="g">Gramas</option>
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