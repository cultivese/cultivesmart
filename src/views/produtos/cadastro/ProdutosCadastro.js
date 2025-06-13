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
  CFormSelect,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

import avatar8 from './../../../assets/images/microverdes/product_default.png'

const ProdutosCadastro = () => {
  const [formData, setFormData] = useState({
    nome: '',
    embalagem: '',
    preco: '',
    logo: null,
    logoUrl: '',
    insumos: [],
  })
  const [validated, setValidated] = useState(false)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()
  const hiddenFileInput = useRef(null);

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  };

  const handleAddInsumo = () => {
    setFormData((prev) => ({
      ...prev,
      insumos: [...prev.insumos, { nome: '', quantidade: '' }],
    }));
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
        const formDataToSend = new FormData(); // Use FormData para enviar arquivos
        
        for (const key in formData) {
          formDataToSend.append(key, formData[key]); // Append all data to FormData
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
    <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
      <CToaster push={toast} placement="top-end" />
      <CRow>
        <CCol md={7} xs={12}>
          <CCard className="mb-4">
            <CCardHeader>Dados do Produto</CCardHeader>
            <CCardBody>
              <CTabContent className={`rounded-bottom`}>
                <CTabPane className="p-3 preview" visible>
                  <CRow className="g-0" xs={{gutterY: 3}}>
                    <CCol md={4}>
                      
                      <CImage fluid  orientation="left" src={formData.logoUrl || avatar8}
                        onClick={handleImageClick}
                        style={{ cursor: 'pointer', maxHeight: '15em', width: '100%', objectFit: 'cover',
                          height: '100%' }} />
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
                          floatingLabel="Nome"
                          className="mb-3"
                          value={formData.nome}
                          onChange={handleChange}
                          required
                        />
                        <CFormFeedback valid>Looks good!</CFormFeedback>
                      </CCol>
                      <CCol md={6} xs={6}>
                        <CFormSelect
                          id="embalagem"
                          floatingLabel="Embalagem"
                          className="mb-3"
                          value={formData.embalagem}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecione</option>
                          <option value="30g">30g</option>
                          <option value="40g">40g</option>
                          <option value="50g">50g</option>
                        </CFormSelect>
                        <CFormFeedback valid>Looks good!</CFormFeedback>
                      </CCol>
                      <CCol md={5} xs={5}>
                        <CFormInput
                          type="number"
                          id="preco"
                          floatingLabel="Preço"
                          className="mb-3"
                          value={formData.preco}
                          onChange={handleChange}
                          required
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
              <strong>Produto</strong> <small>Composição</small>
            </CCardHeader>
            <CCardBody>
              {formData.insumos.map((insumo, index) => (
                  <CRow key={index} className="mb-2">
                    <CCol md={7}>
                      <CFormInput
                        type="text"
                        placeholder="Nome do insumo"
                        value={insumo.nome}
                        onChange={(e) => handleInsumoChange(index, 'nome', e.target.value)}
                        required
                      />
                    </CCol>
                    <CCol md={5}>
                      <CFormInput
                        type="number"
                        placeholder="Quantidade (g)"
                        value={insumo.quantidade}
                        onChange={(e) => handleInsumoChange(index, 'quantidade', e.target.value)}
                        required
                      />
                    </CCol>
                  </CRow>
                ))}
                <CButton type="button" color="success" onClick={handleAddInsumo}>
                  + Adicionar Insumo
                </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="justify-content-end">
        <CCol xs={1}>
          <CButton color="secondary" type="reset">
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
    </>
  )
}

export default ProdutosCadastro