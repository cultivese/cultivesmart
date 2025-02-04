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
  CCardImageOverlay,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CCardTitle,
  CCardText,
  CInputGroup,
  CInputGroupText,
  CFormCheck,
} from '@coreui/react';
import { Stepper, Step } from 'react-form-stepper';
import product_default from './../../../assets/images/microverdes/product_default.png'
import isla_fornecedor from './../../../assets/images/microverdes/fornecedores/isla.png'
import top_seed__fornecedor from './../../../assets/images/microverdes/fornecedores/top_seed.jpg'

import { DocsExample } from 'src/components'
const InsumosCadastro = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fornecedores, setFornecedores] = useState([]);
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);
  const [stepErrors, setStepErrors] = useState([false, false, false, false, false]); // Array to track errors for each step

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
    quantidade: '',
    unidade_medida: '',
    estoque_minimo: 0,
    dias_pilha: 0,
    dias_blackout: 0,
    dias_colheita: 0,
    hidratacao: '',
    colocar_peso: true,
    substrato: false
  });

  const categoryNames = {
    '1': 'Sementes - Microverde',
    '2': 'Flores Comestíveis',
    '3': 'Substrato',
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
          !formData.unidade_medida || formData.estoque_minimo <= 0 ||
          formData.dias_pilha <= 0 || formData.dias_blackout <= 0 || formData.dias_colheita <= 0 || !formData.hidratacao
      )
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

        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{stepLabels[activeStep].title} - </strong>
              <small>{stepLabels[activeStep].subtitle}</small>
            </CCardHeader>
            <CCardBody>
              
              {activeStep === 0 && (
                  <DocsExample href="components/card/#background-and-color">
                    <CRow xs={{ gutterY: 5 }} >
                      <CCol lg={4} key='1'>
                        <CCard color={ selectedCategory === '1' ? 'success' : 'light'} textColor={ selectedCategory === '1' ? 'white' : ''} className="h-100" onClick={() => handleCategorySelect('1')}>
                          <CCardHeader>Sementes</CCardHeader>
                          <CCardBody>
                            <CCardTitle>Microverde</CCardTitle>
                            <CCardText>
                              Rabanete, Amaranto, Acelga, Girassol, Salsa, Mostarda, Manjericão, Cebola, Cenoura
                            </CCardText>
                          </CCardBody>
                        </CCard>
                      </CCol>
                      <CCol lg={4} key='2'>
                        <CCard color={ selectedCategory === '2' ? 'success' : 'light'} textColor={ selectedCategory === '2' ? 'white' : ''} className="h-100" onClick={() => handleCategorySelect('2')}>
                          <CCardHeader>Sementes</CCardHeader>
                          <CCardBody>
                            <CCardTitle>Flores Comestíveis</CCardTitle>
                            <CCardText>
                              Amor-Perfeito Gigante Suico Purpura, Amor-Perfeito Gigante Suico Branco, Amor-Perfeito Gigante Suico Roxo
                            </CCardText>
                          </CCardBody>
                        </CCard>
                      </CCol>
                      <CCol lg={4} key='3'>
                        <CCard color={ selectedCategory === '3' ? 'success' : 'light'} textColor={ selectedCategory === '3' ? 'white' : ''} className="h-100" onClick={() => handleCategorySelect('3')}>
                          <CCardHeader>Substrato</CCardHeader>
                          <CCardBody>
                            <CCardTitle>Substrato</CCardTitle>
                            <CCardText>
                              Carolina Soil, Pó de Coco
                            </CCardText>
                          </CCardBody>
                        </CCard>
                      </CCol>
                    </CRow>
                  </DocsExample>
              )}

              {activeStep === 1 && (
                <DocsExample href="components/card/#background-and-color">
                  <CRow>
                      {fornecedores.map((fornecedor) => {
                        return (
                        <CCol lg={4} key='1'>
                          <CCard key={fornecedor.id} color={ selectedFornecedor === '1' ? 'success' : 'light'} textColor={ selectedFornecedor === '1' ? 'white' : ''} className="mb-3" onClick={() => handleFornecedorSelect ('1')}>
                            <CCardHeader>{fornecedor.nome}</CCardHeader>
                            <CCardImage src={isla_fornecedor} />
                          </CCard>
                        </CCol>);
                      })}
                    {/* <CCol lg={4} key='2'>
                      <CCard color={ selectedFornecedor === '2' ? 'success' : 'light'} textColor={ selectedFornecedor === '2' ? 'white' : ''} className="mb-3" onClick={() => handleFornecedorSelect ('2')}>
                      <CCardHeader>Top Seed</CCardHeader>
                        <CCardImage src={top_seed__fornecedor} />
                    </CCard>
                  </CCol> */}
                </CRow>
              </DocsExample>
              )}
            
              {activeStep === 2 && (
                selectedCategory === '1' && (
                  <CContainer>
                    <CRow>
                      <CCol md={5}>
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
                      <CCol md={4}>
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
                      <CCol md={4}>
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
                      <CCol md={2}>
                      <CFormSelect
                            id="unidade_medida"
                            floatingLabel="Unidade de Medida"
                            aria-label="Floating label select example"
                            value={formData.unidade_medida}
                            onChange={handleChange}
                            className={stepErrors[activeStep] && (!formData.unidade_medida) ? 'is-invalid' : ''}
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
                        {stepErrors[activeStep] && (!formData.estoque_minimo) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                      </CCol>
                    </CRow>
                      <CCol lg={4}>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>Dias em Pilha</CInputGroupText>
                          <CFormInput type="number" id="dias_pilha" value={formData.dias_pilha} onChange={handleChange} required />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>Dias em Blackout</CInputGroupText>
                          <CFormInput type="number" id="dias_blackout" value={formData.dias_blackout} onChange={handleChange} required />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>Dias até a Colheita</CInputGroupText>
                          <CFormInput type="number" id="dias_colheita" value={formData.dias_colheita} onChange={handleChange} required />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>Hidratação</CInputGroupText>
                          <CFormSelect id="hidratacao" value={formData.hidratacao} onChange={handleChange} required>
                            <option value="Irrigação">Irrigação</option>
                            <option value="Aspersão">Aspersão</option>
                          </CFormSelect>
                        </CInputGroup>
                        <CFormCheck label="Colocar peso" value={formData.colocar_peso}/>
                        <CFormCheck label="Substrato (cobertura)" value={formData.substrato}/>
                      </CCol>
                </CContainer>
                )

                ||
                selectedCategory === '2' && (
                  <CContainer>
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
                </CContainer>
                )
              )}

              {activeStep === 3 && (
                selectedCategory === '1' && (
                <div>
                  <h2 className="text-xl font-bold">Resumo</h2>
                  <p><strong>Categoria:</strong> {categoryNames[formData.category]}</p>
                  <p><strong>Fornecedor:</strong> {fornecedores[0].nome}</p>
                  <p><strong>Descrição:</strong> {formData.descricao}</p>
                  <p><strong>Unidade de Medida:</strong> {formData.unidade_medida}</p>
                  <p><strong>Estoque Mínimo:</strong> {formData.estoque_minimo}</p>
                  <p><strong>Dias Pilha:</strong> {formData.dias_pilha}</p>
                  <p><strong>Dias Blackoutr:</strong> {formData.dias_blackout}</p>
                  <p><strong>Dias Colheita:</strong> {formData.dias_colheita}</p>
                  <p><strong>Hidratação:</strong> {formData.hidratacao}</p>
                  <p><strong>Colocar Peso:</strong> {formData.colocar_peso ? "Sim" : "Não"}</p>
                  <p><strong>Substrato:</strong> {formData.substrato ? "Sim" : "Não"}</p>
                </div>
              )
            )
              }
              {activeStep === 3 && (
                selectedCategory === '2' && (
                <div>
                  <h2 className="text-xl font-bold">Resumo</h2>
                  <p><strong>Categoria:</strong> {categoryNames[formData.category]}</p>
                  <p><strong>Fornecedor:</strong> {fornecedores[0].nome}</p>
                  <p><strong>Dados Básicos:</strong> {formData.descricao}</p>
                  <p><strong>Unidade de Medida:</strong> {formData.unidade_medida}</p>
                  <p><strong>Estoque Mínimo:</strong> {formData.estoque_minimo}</p>
                </div>
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
            </CCardBody>
          </CCard>
        </CCol>
        
      </CForm>
    </CContainer>
  );
};

export default InsumosCadastro;