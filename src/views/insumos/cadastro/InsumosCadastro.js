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
  const [stepErrors, setStepErrors] = useState([false, false, false, false, false]); // Array to track errors for each step

  const stepLabels = [
    { title: "Categoria", subtitle: "Escolha a categoria" },
    { title: "Fornecedor", subtitle: "Defina o fornecedor" },
    { title: "Informações", subtitle: "Preencha as informações principais" },
    { title: "Resumo", subtitle: "Resumo dos dados preenchidos" },
  ];

  const [formData, setFormData] = useState({
    nome:'',
    tipo_insumo: '',
    fornecedor_id: '',
    variedade: '',
    descricao: '',
    unidade_medida: '',
    estoque_minimo: 0,
    dias_pilha: 0,
    dias_blackout: 0,
    dias_colheita: 0,
    hidratacao: '',
    colocar_peso: true,
    substrato: false
  });


  useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/fornecedores')
      .then(response => response.json())
      .then(data => setFornecedores(data))
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
    } else if (activeStep === 1 && !fornecedores) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    } else if (activeStep === 2 && (!formData.descricao || !formData.unidade_medida || !formData.estoque_minimo)) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    } else if (activeStep === 3 && (!formData.dias_pilha || !formData.dias_blackout || !formData.dias_colheita || !formData.hidratacao)) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    }

    setStepErrors(newStepErrors);

    if (!hasErrors) {
        setActiveStep(prevStep => prevStep + 1);
    }
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
          tipo_insumo: '', fornecedor_id: '', descricao: '', unidade_medida: '',
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
      <CForm onSubmit={handleSubmit}>

        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{stepLabels[activeStep].title} - </strong>
              <small>{stepLabels[activeStep].subtitle}</small>
            </CCardHeader>
            <CCardBody>
            
            {activeStep === 0 && (
                <DocsExample href="components/card/#background-and-color">
                  <CRow>
                    <CCol lg={4} key='1'>
                      <CCard color={ selectedCategory === '1' ? 'success' : 'light'} textColor={ selectedCategory === '1' ? 'white' : ''} className="h-100" onClick={() => setSelectedCategory('1')}>
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
                      <CCard color={ selectedCategory === '2' ? 'success' : 'light'} textColor={ selectedCategory === '2' ? 'white' : ''} className="h-100" onClick={() => setSelectedCategory('2')}>
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
                      <CCard color={ selectedCategory === '3' ? 'success' : 'light'} textColor={ selectedCategory === '3' ? 'white' : ''} className="h-100" onClick={() => setSelectedCategory('3')}>
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
                  <CCol lg={4} key='1'>
                    <CCard color={ fornecedores === '1' ? 'success' : 'light'} textColor={ fornecedores === '1' ? 'white' : ''} className="mb-3" onClick={() => setFornecedores('1')}>
                    <CCardHeader>ISLA Sementes</CCardHeader>
                      <CCardImage src={isla_fornecedor} />
                  </CCard>
                </CCol>
                <CCol lg={4} key='2'>
                    <CCard color={ fornecedores === '2' ? 'success' : 'light'} textColor={ fornecedores === '2' ? 'white' : ''} className="mb-3" onClick={() => setFornecedores('2')}>
                    <CCardHeader>Top Seed</CCardHeader>
                      <CCardImage src={top_seed__fornecedor} />
                  </CCard>
                </CCol>
              </CRow>
            </DocsExample>
            )}
            {activeStep === 2 && (
              selectedCategory === '1' && (
                <CContainer>
                  <CRow>
                    <CCol lg={8}>
                      <CRow>
                        <CCol lg={8}>
                          <CFormLabel htmlFor="nome">Nome</CFormLabel>
                          <CFormInput type="text" id="nome" value={formData.nome} onChange={handleChange} required 
                            className={stepErrors[activeStep] && (!formData.nome) ? 'is-invalid' : ''} />
                          {stepErrors[activeStep] && (!formData.nome) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                        </CCol>
                        <CCol>
                          <CFormLabel htmlFor="variedade">Variedade</CFormLabel>
                          <CFormInput type="text" id="variedade" value={formData.variedade} onChange={handleChange} required 
                            className={stepErrors[activeStep] && (!formData.variedade) ? 'is-invalid' : ''} />
                          {stepErrors[activeStep] && (!formData.variedade) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol lg={5}>
                          <CFormLabel htmlFor="descricao">Descrição</CFormLabel>
                          <CFormInput type="text" id="descricao" value={formData.descricao} onChange={handleChange} required 
                            className={stepErrors[activeStep] && (!formData.descricao) ? 'is-invalid' : ''} />
                          {stepErrors[activeStep] && (!formData.descricao) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                        </CCol>
                        <CCol lg={3}>
                          <CFormLabel htmlFor="unidade_medida">Unidade de Medida</CFormLabel>
                          <CFormSelect id="unidade_medida" value={formData.unidade_medida} onChange={handleChange} required
                            className={stepErrors[activeStep] && (!formData.unidade_medida) ? 'is-invalid' : ''} >
                            <option value="" disabled>Escolha...</option>
                            <option>Sacos</option>
                            <option>Gramas</option>
                            <option>Unidades</option>
                            <option>Litro</option>
                          </CFormSelect>
                          {stepErrors[activeStep] && (!formData.unidade_medida) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol lg={4}>
                          <CFormLabel htmlFor="estoque_minimo">Estoque Mínimo</CFormLabel>
                          <CFormInput type="number" id="estoque_minimo" value={formData.estoque_minimo} onChange={handleChange} required
                          className={stepErrors[activeStep] && (!formData.estoque_minimo) ? 'is-invalid' : ''}
                          />
                          {stepErrors[activeStep] && (!formData.estoque_minimo) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                        </CCol>
                      </CRow>
                    </CCol>
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
                  </CRow>
               </CContainer>
              )
              ||
              selectedCategory === '2' && (
                <CContainer>
                  <CRow>
                    <CCol xs={6}>
                      <CFormLabel htmlFor="descricao">Descrição</CFormLabel>
                      <CFormInput type="text" id="descricao" value={formData.descricao} onChange={handleChange} required 
                        className={stepErrors[activeStep] && (!formData.descricao) ? 'is-invalid' : ''} />
                      {stepErrors[activeStep] && (!formData.descricao) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                    </CCol>
                    <CCol xs={4}>
                      <CFormLabel htmlFor="unidade_medida">Unidade de Medida</CFormLabel>
                      <CFormSelect id="unidade_medida" value={formData.unidade_medida} onChange={handleChange} required
                        className={stepErrors[activeStep] && (!formData.unidade_medida) ? 'is-invalid' : ''} >
                        <option value="" disabled>Escolha...</option>
                        <option>Sacos</option>
                        <option>Gramas</option>
                        <option>Unidades</option>
                        <option>Litro</option>
                      </CFormSelect>
                      {stepErrors[activeStep] && (!formData.unidade_medida) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                    </CCol>
                    <CCol md={2}>
                      <CFormLabel htmlFor="estoque_minimo">Estoque Mínimo</CFormLabel>
                      <CFormInput type="number" id="estoque_minimo" value={formData.estoque_minimo} onChange={handleChange} required
                      className={stepErrors[activeStep] && (!formData.estoque_minimo) ? 'is-invalid' : ''}
                      />
                      {stepErrors[activeStep] && (!formData.estoque_minimo) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                    </CCol>
                  </CRow>
               </CContainer>
              )
            )}
            {activeStep === 3 && (
            <div>
            <h2 className="text-xl font-bold">Resumo</h2>
            <p><strong>Categoria:</strong> {formData.tipo_insumo}</p>
            <p><strong>Fornecedor:</strong> {formData.fornecedor_id}</p>
            <p><strong>Dados Básicos:</strong> {formData.descricao}</p>
            <p><strong>Unidade de Medida:</strong> {formData.unidade_medida}</p>
            <p><strong>Estoque Mínimo:</strong> {formData.estoque_minimo}</p>
            <p><strong>Dias Pilha:</strong> {formData.dias_pilha}</p>
            <p><strong>Dias Blackoutr:</strong> {formData.dias_blackout}</p>
            <p><strong>Dias Colheita:</strong> {formData.dias_colheita}</p>
            <p><strong>Hidratação:</strong> {formData.hidratacao}</p>
            <p><strong>Colocar Peso:</strong> {formData.colocar_peso}</p>
            <p><strong>Substrato:</strong> {formData.substrato}</p>

            </div>
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
            </CCardBody>
          </CCard>
        </CCol>
        
      </CForm>
    </CContainer>
  );
};

export default InsumosCadastro;