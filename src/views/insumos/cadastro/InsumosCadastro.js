import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
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
import { DocsExample } from 'src/components'
const InsumosCadastro = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fornecedores, setFornecedores] = useState([]);
  const [stepErrors, setStepErrors] = useState([false, false, false, false, false]); // Array to track errors for each step
  const [formData, setFormData] = useState({
    tipo_insumo: '',
    fornecedor_id: '',
    descricao: '',
    complemento: '',
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
        if (activeStep === 2 && ['descricao', 'complemento', 'unidade_medida', 'estoque_minimo'].includes(id)) newErrors[activeStep] = false;
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
    } else if (activeStep === 2 && (!formData.descricao || !formData.complemento || !formData.unidade_medida || !formData.estoque_minimo)) {
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
          tipo_insumo: '', fornecedor_id: '', descricao: '', complemento: '', unidade_medida: '',
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
        <Step label="Categoria" />
        <Step label="Fornecedor" />
        <Step label="Dados Básicos" />
        <Step label="Dados Complementares" />
        <Step label="Resumo" />
      </Stepper>
      <CForm onSubmit={handleSubmit}>

        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Insumos</strong> <small>Cadastro</small>
            </CCardHeader>
            <CCardBody>
            
            {activeStep === 0 && (
                <DocsExample href="components/card/#background-and-color">
                  <CRow>
                    <CCol lg={4} key='1'>
                      <CCard color={ selectedCategory === '1' ? 'success' : 'light'} textColor={ selectedCategory === '1' ? 'white' : ''} className="mb-3" onClick={() => setSelectedCategory('1')}>
                        <CCardHeader>Sementes</CCardHeader>
                        <CCardBody>
                          <CCardTitle>Microverde</CCardTitle>
                          <CCardText>
                            Beterraba, rabanete
                          </CCardText>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol lg={4} key='2'>
                      <CCard color={ selectedCategory === '2' ? 'success' : 'light'} textColor={ selectedCategory === '2' ? 'white' : ''} className="mb-3" onClick={() => setSelectedCategory('2')}>
                        <CCardHeader>Sementes</CCardHeader>
                        <CCardBody>
                          <CCardTitle>Flores Comestíveis</CCardTitle>
                          <CCardText>
                            Beterraba, rabanete
                          </CCardText>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol lg={4} key='3'>
                    <CCard color={ selectedCategory === '3' ? 'success' : 'light'} textColor={ selectedCategory === '3' ? 'white' : ''} className="mb-3" onClick={() => setSelectedCategory('3')}>
                        <CCardHeader>Substrato</CCardHeader>
                        <CCardBody>
                          <CCardTitle>Flores Comestíveis</CCardTitle>
                          <CCardText>
                            Beterraba, rabanete
                          </CCardText>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                </DocsExample>
            )}
            {activeStep === 1 && (
              <CCol md={6}>
                <CFormSelect id="fornecedor_id" value={formData.fornecedor_id} onChange={handleChange} required
                className={stepErrors[activeStep] ? 'is-invalid' : ''}>
                  <option value="">Escolha um fornecedor</option>
                  {fornecedores.map(fornecedor => (
                    <option key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</option>
                  ))}
                </CFormSelect>
                {stepErrors[activeStep] && <div className="invalid-feedback">Este campo é obrigatório.</div>} {/* Error message */}
              </CCol>
            )}
            {activeStep === 2 && (
              <CRow>
                 <CCol md={6}>
                     <CFormLabel htmlFor="descricao">Descrição</CFormLabel>
                     <CFormInput type="text" id="descricao" value={formData.descricao} onChange={handleChange} required 
                     className={stepErrors[activeStep] && (!formData.descricao) ? 'is-invalid' : ''}
                     />
                     {stepErrors[activeStep] && (!formData.descricao) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                   </CCol>
                   <CCol md={6}>
                     <CFormLabel htmlFor="complemento">Complemento</CFormLabel>
                     <CFormInput type="text" id="complemento" value={formData.complemento} onChange={handleChange} required
                     className={stepErrors[activeStep] && (!formData.complemento) ? 'is-invalid' : ''}
                     />
                     {stepErrors[activeStep] && (!formData.complemento) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                   </CCol>
                 <CCol md={4}>
                     <CFormLabel htmlFor="unidade_medida">Unidade de Medida</CFormLabel>
                     <CFormSelect id="unidade_medida" value={formData.unidade_medida} onChange={handleChange} required
                     className={stepErrors[activeStep] && (!formData.unidade_medida) ? 'is-invalid' : ''}
                            >
                       <option value="" disabled>Escolha...</option>
                       <option>Sacos</option>
                       <option>Gramas</option>
                       <option>Unidades</option>
                       <option>Litro</option>
                     </CFormSelect>
                     {stepErrors[activeStep] && (!formData.unidade_medida) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                 </CCol>
                 <CCol md={4}>
                 <CFormLabel htmlFor="estoque_minimo">Estoque Mínimo</CFormLabel>
                 <CFormInput type="number" id="estoque_minimo" value={formData.estoque_minimo} onChange={handleChange} required
                 className={stepErrors[activeStep] && (!formData.estoque_minimo) ? 'is-invalid' : ''}
                 />
                 {stepErrors[activeStep] && (!formData.estoque_minimo) && <div className="invalid-feedback">Este campo é obrigatório.</div>}
                 </CCol>
               </CRow>

            )}
            {activeStep === 3 && (
            <CCol>
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
            )}
            {activeStep === 4 && (
            <div>
            <h2 className="text-xl font-bold">Resumo</h2>
            <p><strong>Categoria:</strong> {formData.tipo_insumo}</p>
            <p><strong>Fornecedor:</strong> {formData.fornecedor_id}</p>
            <p><strong>Dados Básicos:</strong> {formData.descricao}</p>
            <p><strong>Dados Complementares:</strong> {formData.complemento}</p>
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
              {activeStep === 4 ? (
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







// import React, { useState, useEffect } from 'react'
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CCardTitle,
//   CContainer,
//   CForm,
//   CCardText,
//   CFormInput,
//   CFormLabel,
//   CFormSelect,
//   CRow,
//   CInputGroup,
//   CInputGroupText,
//   CFormCheck,
// } from '@coreui/react'
// import { DocsExample } from 'src/components'
// import product_default from './../../../assets/images/microverdes/product_default.png'
// import { Stepper, Step } from 'react-form-stepper';

// const InsumosCadastro = () => {
//   const [validated, setValidated] = useState(false)
//   const [selectedImage, setSelectedImage] = useState(product_default)
//   const [fornecedores, setFornecedores] = useState([])
//   const [formData, setFormData] = useState({
//     tipo_insumo: '',
//     fornecedor_id: '',
//     descricao: '',
//     complemento: '',
//     unidade_medida: '',
//     estoque_minimo: 0,
//     dias_pilha: 0,
//     dias_blackout: 0,
//     dias_colheita: 0,
//     hidratacao: '',
//     colocar_peso: true,
//     substrato: false
//   })

//   // Buscar fornecedores na API
//   useEffect(() => {
//     fetch('https://backend.cultivesmart.com.br/api/fornecedores')
//       .then((response) => response.json())
//       .then((data) => setFornecedores(data))
//       .catch((error) => console.error('Erro ao buscar fornecedores:', error))
//   }, [])

//   const handleChange = (event) => {
//     const { id, value, type, checked } = event.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [id]: type === 'checkbox' 
//         ? checked 
//         : (id === 'fornecedor_id' || id === 'tipo_insumo' || id === 'estoque_minimo' || id === 'dias_pilha' || id === 'dias_blackout' || id === 'dias_colheita' ? Number(value) : value), // Converte para número se for fornecedor_id ou dias_colheita
//     }));
//   };
  
//   const handleSubmit = async (event) => {
//     event.preventDefault()
//     const form = event.currentTarget

//     if (!form.checkValidity()) {
//       event.stopPropagation()
//       setValidated(true)
//       return
//     }

    
//     try {
//       const response = await fetch('https://backend.cultivesmart.com.br/api/insumos', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       })

//       if (response.ok) {
//         alert('Insumo cadastrado com sucesso!')
//         setFormData({
//           tipo_insumo: 0,
//           fornecedor_id: '',
//           descricao: '',
//           complemento: '',
//           unidade_medida: '',
//           estoque_minimo: 0,
//           dias_pilha: 0,
//           dias_blackout: 0,
//           dias_colheita: 0,
//           hidratacao: '',
//           colocar_peso: true,
//           substrato: false
//         })
//         setValidated(false)
//       } else {
//         alert('Erro ao cadastrar insumo!')
//       }
//     } catch (error) {
//       console.error('Erro ao enviar dados:', error)
//     }
//   }


//   const handleImageChange = (event) => {
//     const file = event.target.files[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onload = () => setSelectedImage(reader.result)
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleImageClick = (event) => {
//     event.preventDefault() 
//     document.getElementById('imageUpload').click()
//   }

//   return (

// <>
// {/* <Stepper
//   steps={[{ label: 'Categoria' }, { label: 'Fornecedor' }, { label: 'Dados básicos' }, { label: 'Dados complementares' }]}
//   activeStep={2}
// /> */}

// <Stepper activeStep={1}>
//   <Step label="Children Step 1" />
//   <Step label="Children Step 2" />
//   <Step label="Children Step 3" />
// </Stepper>


//             <DocsExample href="components/card/#background-and-color">
//             <CRow>
//               <CCol lg={4} key='1'>
//                 <CCard color='light' className="mb-3">
//                   <CCardHeader>Sementes</CCardHeader>
//                   <CCardBody>
//                     <CCardTitle>Microverde</CCardTitle>
//                     <CCardText>
//                       Beterraba, rabanete
//                     </CCardText>
//                   </CCardBody>
//                 </CCard>
//               </CCol>
//               <CCol lg={4} key='2'>
//               <CCard color='light' className="mb-3">
//                   <CCardHeader>Sementes</CCardHeader>
//                   <CCardBody>
//                     <CCardTitle>Flores Comestíveis</CCardTitle>
//                     <CCardText>
//                       Beterraba, rabanete
//                     </CCardText>
//                   </CCardBody>
//                 </CCard>
//               </CCol>
//               <CCol lg={4} key='3'>
//                 <CCard color='light' className="mb-3">
//                   <CCardHeader>Substrato</CCardHeader>
//                   <CCardBody>
//                     <CCardTitle>Flores Comestíveis</CCardTitle>
//                     <CCardText>
//                       Beterraba, rabanete
//                     </CCardText>
//                   </CCardBody>
//                 </CCard>
//               </CCol>
//             </CRow>
//             </DocsExample>
//           </>
//     // <CForm
//     //   className="needs-validation"
//     //   noValidate
//     //   validated={validated}
//     //   onSubmit={handleSubmit}
//     // >
//     //   <CRow>
//     //     <CCol lg={8}>
//     //       <CCard className="mb-4">
//     //         <CCardHeader>
//     //           <strong>Insumo</strong> <small>Dados básicos</small>
//     //         </CCardHeader>
//     //         <CCardBody>
//     //           <CRow className="g-3">
//     //             <CCol md={3} className="text-center">
//     //               <div>
//     //                 <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
//     //                   <img
//     //                     src={selectedImage}
//     //                     alt="Pré-visualização"
//     //                     style={{
//     //                       width: '100%',
//     //                       height: '100%',
//     //                       objectFit: 'cover',
//     //                     }}
//     //                   />
//     //                 </label>
//     //                 <CFormInput
//     //                   type="file"
//     //                   id="imageUpload"
//     //                   accept="image/*"
//     //                   onChange={handleImageChange}
//     //                   style={{ display: 'none' }}
//     //                 />
//     //               </div>
//     //             </CCol>
//     //             <CCol md={9}>
//     //               <CContainer>
//     //               <CRow>
//     //                 <CCol md={5}>
//     //                 <CFormLabel htmlFor="tipo_insumo">Tipo Insumo</CFormLabel>
//     //                 <CFormSelect id="tipo_insumo" value={formData.tipo_insumo} onChange={handleChange} required>
//     //                   <option value="" disabled>Escolha...</option>
//     //                   <option value="1">Microverde</option>
//     //                   <option value="2">Flor Comestível</option>
//     //                   <option value="3">Substrato</option>
//     //                   <option value="4">Embalagem</option>
//     //                 </CFormSelect>
//     //                 </CCol>
//     //                 <CCol md={7}>
//     //                 <CFormLabel htmlFor="fornecedor_id">Fornecedor</CFormLabel>
//     //                     <CFormSelect id="fornecedor_id" value={formData.fornecedor_id} onChange={handleChange} required>
//     //                       <option value="" disabled>Escolha um fornecedor</option>
//     //                       {fornecedores.map((fornecedor) => (
//     //                         <option key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</option>
//     //                       ))}
//     //                     </CFormSelect>
//     //                   </CCol>
//     //               </CRow>
//     //               <CRow>
//     //                 <CCol md={6}>
//     //                     <CFormLabel htmlFor="descricao">Descrição</CFormLabel>
//     //                     <CFormInput type="text" id="descricao" value={formData.descricao} onChange={handleChange} required />
//     //                   </CCol>
//     //                   <CCol md={6}>
//     //                     <CFormLabel htmlFor="complemento">Complemento</CFormLabel>
//     //                     <CFormInput type="text" id="complemento" value={formData.complemento} onChange={handleChange} required />
//     //                   </CCol>
//     //                 <CCol md={4}>
//     //                     <CFormLabel htmlFor="unidade_medida">Unidade de Medida</CFormLabel>
//     //                     <CFormSelect id="unidade_medida" value={formData.unidade_medida} onChange={handleChange} required>
//     //                       <option value="" disabled>Escolha...</option>
//     //                       <option>Sacos</option>
//     //                       <option>Gramas</option>
//     //                       <option>Unidades</option>
//     //                       <option>Litro</option>
//     //                     </CFormSelect>
//     //                 </CCol>
//     //                 <CCol md={4}>
//     //                 <CFormLabel htmlFor="estoque_minimo">Estoque Mínimo</CFormLabel>
//     //                 <CFormInput type="number" id="estoque_minimo" value={formData.estoque_minimo} onChange={handleChange} required />
//     //                 </CCol>
//     //               </CRow>
//     //               </CContainer>
//     //             </CCol>
//     //           </CRow>
//     //         </CCardBody>
//     //       </CCard>
//     //     </CCol>
//     //     <CCol lg={4}>
//     //       <CCard className="mb-3">
//     //         <CCardHeader>
//     //           <strong>Especificação</strong> <small>Dados complementares</small>
//     //         </CCardHeader>
//     //         <CCardBody>
//     //           <CInputGroup className="mb-3">
//     //             <CInputGroupText>Dias em Pilha</CInputGroupText>
//     //             <CFormInput type="number" id="dias_pilha" value={formData.dias_pilha} onChange={handleChange} required />
//     //           </CInputGroup>
//     //           <CInputGroup className="mb-3">
//     //             <CInputGroupText>Dias em Blackout</CInputGroupText>
//     //             <CFormInput type="number" id="dias_blackout" value={formData.dias_blackout} onChange={handleChange} required />
//     //           </CInputGroup>
//     //           <CInputGroup className="mb-3">
//     //             <CInputGroupText>Dias até a Colheita</CInputGroupText>
//     //             <CFormInput type="number" id="dias_colheita" value={formData.dias_colheita} onChange={handleChange} required />
//     //           </CInputGroup>
//     //           <CInputGroup className="mb-3">
//     //             <CInputGroupText>Hidratação</CInputGroupText>
//     //             <CFormSelect id="hidratacao" value={formData.hidratacao} onChange={handleChange} required>
//     //               <option value="Irrigação">Irrigação</option>
//     //               <option value="Aspersão">Aspersão</option>
//     //             </CFormSelect>
//     //           </CInputGroup>
//     //           <CFormCheck label="Colocar peso" value={formData.colocar_peso}/>
//     //           <CFormCheck label="Substrato (cobertura)" value={formData.substrato}/>
//     //         </CCardBody>
//     //       </CCard>
//     //     </CCol>
//     //   </CRow>
//     //   <CRow>
//     //     <CCol xs={12} className="text-center">
//     //       <CButton color="primary" type="submit">
//     //         Cadastrar
//     //       </CButton>
//     //     </CCol>
//     //   </CRow>
//     // </CForm>
//   )
// }

// export default InsumosCadastro
