import React, { useState, useRef, useEffect } from 'react'
import InputMask from 'react-input-mask'
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CRow,
  CTabContent,
  CTabPane,
  CImage,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

import avatar8 from './../../../assets/images/microverdes/product_default.png'

const FornecedoresCadastro = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [categoriaInfo, setCategoriaInfo] = useState(null);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    bairro: '',
    numero: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: '',
    logo: null,
  })
  const [validated, setValidated] = useState(false)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()
  const hiddenFileInput = useRef(null);

  useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/categorias')
      .then(response => response.json())
      .then(data => {
        setCategorias(data.records || []);
      })
      .catch(error => console.error('Erro ao buscar categorias:', error));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('categoria', categoria);
        for (const key in formData) {
          formDataToSend.append(key, formData[key]);
        }

        const response = await fetch('https://backend.cultivesmart.com.br/api/fornecedores', {
          method: 'POST',
          body: formDataToSend
          
        })

        if (response.ok) {
          setToast(
            <CToast autohide={true} visible={true} color="success">
              <CToastHeader closeButton>Sucesso</CToastHeader>
              <CToastBody>Fornecedor cadastrado com sucesso!</CToastBody>
            </CToast>
          )
          setTimeout(() => {
            navigate('/fornecedores/listar')
          }, 2000)
        } else {
          throw new Error('Erro ao cadastrar fornecedor.')
        }
      } catch (error) {
        setToast(
          <CToast autohide={true} visible={true} color="danger">
            <CToastHeader closeButton>Erro</CToastHeader>
            <CToastBody>Não foi possível cadastrar o fornecedor.</CToastBody>
          </CToast>
        )
      }
    }
    setValidated(true)
  }

  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cep.length !== 8) {
      return; // CEP inválido, não faz nada
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`); // Use uma API pública de CEP

      if (!response.ok) {
        throw new Error('Erro ao buscar CEP.');
      }

      const data = await response.json();

      if (data.erro) {
        throw new Error('CEP não encontrado.');
      }

      setFormData((prevData) => ({
        ...prevData,
        endereco: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
      }));
    } catch (error) {
      setToast(
        <CToast autohide={true} visible={true} color="danger">
          <CToastHeader closeButton>Erro</CToastHeader>
          <CToastBody>{error.message}</CToastBody>
        </CToast>
      );
    }
  };

  return (
    <>
      {/* Cards de categoria */}
      {!categoria && (
        <>
          <h4 className="mb-4 text-center">Selecione a Categoria do Fornecedor</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
            {categorias.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setCategoria(cat.id);
                  setCategoriaInfo(cat);
                  setShowCategoriaModal(true);
                  setValidated(false);
                }}
                style={{
                  width: 160,
                  height: 200,
                  border: '2px solid #e0e0e0',
                  borderRadius: 16,
                  boxShadow: '0 2px 8px #0001',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: '#fff',
                  transition: 'box-shadow 0.2s, border-color 0.2s, background 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 16px #0002';
                  e.currentTarget.style.borderColor = '#4f8cff';
                  e.currentTarget.style.background = '#f4faff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 2px 8px #0001';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.background = '#fff';
                }}
              >
                <img src={`data:image/png;base64,${cat.logoPath}`} alt={cat.descricao} style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 16, transition: 'transform 0.2s' }} />
                <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16 }}>{cat.descricao}</div>
                <div style={{ position: 'absolute', top: 8, right: 8, opacity: 0, transition: 'opacity 0.2s', pointerEvents: 'none' }} className="hover-indicator">Clique para selecionar</div>
              </div>
            ))}
          </div>
          <style>{`
            div[style*='cursor: pointer']::after {
              content: '';
              display: block;
              position: absolute;
              inset: 0;
              border-radius: 16px;
              pointer-events: none;
              transition: box-shadow 0.2s;
            }
            div[style*='cursor: pointer']:hover::after {
              box-shadow: 0 0 0 4px #4f8cff33;
            }
            div[style*='cursor: pointer']:hover .hover-indicator {
              opacity: 1;
              color: #4f8cff;
              font-size: 13px;
              font-weight: 500;
              background: #eaf3ff;
              border-radius: 8px;
              padding: 2px 8px;
              top: 8px;
              right: 8px;
            }
            div[style*='cursor: pointer']:active {
              background: #eaf3ff;
              box-shadow: 0 2px 8px #4f8cff33;
            }
            div[style*='cursor: pointer']:focus {
              outline: 2px solid #4f8cff;
            }
          `}</style>
        </>
      )}

      {/* Modal informativo da categoria */}
      <CModal visible={showCategoriaModal} onClose={() => setShowCategoriaModal(false)}>
        <CModalHeader>
          <strong>{categoriaInfo?.descricao}</strong>
        </CModalHeader>
        <CModalBody>
          <div style={{ textAlign: 'center' }}>
            <img src={`data:image/png;base64,${categoriaInfo?.logoPath}`} alt={categoriaInfo?.descricao} style={{ width: 80, height: 80, marginBottom: 16 }} />
            <p><strong>Descrição:</strong> {categoriaInfo?.descricao}</p>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => setShowCategoriaModal(false)}>
            Prosseguir para cadastro
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Formulário de cadastro */}
      {categoria && !showCategoriaModal && (
        <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
          <CToaster push={toast} placement="top-end" />
          <CRow>
            <CCol md={7} xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Fornecedor</strong> <small>Dados Básicos</small>
                </CCardHeader>
                <CCardBody>
                  <CTabContent className={`rounded-bottom`}>
                    <CTabPane className="p-3 preview" visible>
                      <CRow className="g-0" xs={{gutterY: 3}}>
                        <CCol md={4}>
                          <CImage fluid  orientation="left" src={formData.logoUrl || avatar8}
                            onClick={handleImageClick}
                            style={{ cursor: 'pointer', maxHeight: '15em', width: '100%', objectFit: 'cover', height: '100%' }} />
                          <input
                            type="file"
                            ref={hiddenFileInput}
                            onChange={handleLogoChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                          />
                        </CCol>
                        <CCol md={{ span: 6, offset: 1 }}>
                          <CCol md={12} xs={12}>
                            <CFormInput
                              type="text"
                              id="nome"
                              floatingClassName="mb-3"
                              floatingLabel="Nome"
                              value={formData.nome}
                              onChange={handleChange} required
                            />
                            <CFormFeedback valid>Looks good!</CFormFeedback>
                          </CCol>
                          <CCol md={8} xs={12}>
                            <InputMask mask="99.999.999/9999-99" value={formData.cnpj} onChange={handleChange}>
                              {(inputProps) => 
                                <CFormInput {...inputProps}
                                  type="text"
                                  id="cnpj"
                                  floatingClassName="mb-3"
                                  floatingLabel="CNPJ"
                                  required
                                />
                              }
                            </InputMask>
                            <CFormFeedback valid>Looks good!</CFormFeedback>
                          </CCol>
                          <CCol md={7} xs={7}>
                            <InputMask mask="(99) 99999-9999" value={formData.telefone} onChange={handleChange}>
                              {(inputProps) =>  <CFormInput {...inputProps} 
                                  type="text"
                                  id="telefone"
                                  floatingClassName="mb-3"
                                  floatingLabel="Telefone"
                                  value={formData.telefone}
                                  onChange={handleChange} required
                                />}
                            </InputMask>
                            <CFormFeedback valid>Looks good!</CFormFeedback>
                          </CCol>
                          <CCol md={12} xs={12}>
                            <CFormInput 
                              type="email"
                              id="email"
                              floatingClassName="mb-3"
                              floatingLabel="Email"
                              value={formData.email}
                              onChange={handleChange} required
                            />
                            <CFormFeedback valid>Looks good!</CFormFeedback>
                          </CCol>
                        </CCol>
                      </CRow>
                    </CTabPane>
                  </CTabContent>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={5}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Fornecedor</strong> <small>Endereço</small>
                </CCardHeader>
                <CCardBody>
                  <CTabContent className={`rounded-bottom`}>
                    <CTabPane className="p-3 preview" visible>
                      <CRow md={12}>
                        <CCol md={4} xs={8}>
                          <InputMask
                            mask="99999-999"
                            value={formData.cep}
                            onChange={handleChange}
                            onBlur={handleCepBlur}
                          >
                            {(inputProps) => (
                              <CFormInput
                                {...inputProps}
                                type="text"
                                id="cep"
                                floatingClassName="mb-3"
                                floatingLabel="CEP"
                                value={formData.cep}
                                onChange={handleChange}
                                onBlur={handleCepBlur}
                                required
                              />
                            )}
                          </InputMask>
                          <CFormFeedback valid>Looks good!</CFormFeedback>
                        </CCol>
                        <CCol md={12} xs={12}>
                          <CFormInput
                            type="text"
                            id="endereco"
                            floatingClassName="mb-3"
                            floatingLabel="Endereço"
                            value={formData.endereco}
                            onChange={handleChange} required
                          />
                          <CFormFeedback valid>Looks good!</CFormFeedback>
                        </CCol>
                        <CCol md={8} xs={12}>
                          <CFormInput
                            type="text"
                            id="bairro"
                            floatingClassName="mb-3"
                            floatingLabel="Bairro"
                            value={formData.bairro}
                            onChange={handleChange} required
                          />
                          <CFormFeedback valid>Looks good!</CFormFeedback>
                        </CCol>
                        <CCol md={4} xs={6}>
                          <CFormInput
                            type="text"
                            id="numero"
                            floatingClassName="mb-3"
                            floatingLabel="Número"
                            value={formData.numero}
                            onChange={handleChange} required
                          />
                          <CFormFeedback valid>Looks good!</CFormFeedback>
                        </CCol>
                        <CCol md={4} xs={6}>
                          <CFormInput
                            type="text"
                            id="estado"
                            floatingClassName="mb-3"
                            floatingLabel="Estado"
                            value={formData.estado}
                            onChange={handleChange} required
                          />
                          <CFormFeedback valid>Looks good!</CFormFeedback>
                        </CCol>
                        <CCol md={8} xs={12}>
                          <CFormInput 
                            type="text"
                            id="cidade"
                            floatingClassName="mb-3"
                            floatingLabel="Cidade"
                            value={formData.cidade}
                            onChange={handleChange} required
                          />
                          <CFormFeedback valid>Looks good!</CFormFeedback>
                        </CCol>
                      </CRow>
                    </CTabPane>
                  </CTabContent>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow className="justify-content-end">
            <CCol xs={1}>
              <CButton color="secondary" type="button" onClick={() => setCategoria('')}>
                Cancelar
              </CButton>
            </CCol>
            <CCol xs={6}>
              <CButton color="primary" type="submit">
                Cadastrar
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      )}
    </>
  )
}

export default FornecedoresCadastro
