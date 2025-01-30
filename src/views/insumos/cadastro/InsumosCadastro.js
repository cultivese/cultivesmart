import React, { useState, useEffect } from 'react'
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
  CInputGroup,
  CInputGroupText,
  CFormCheck,
} from '@coreui/react'

import product_default from './../../../assets/images/microverdes/product_default.png'

const InsumosCadastro = () => {
  const [validated, setValidated] = useState(false)
  const [selectedImage, setSelectedImage] = useState(product_default)
  const [fornecedores, setFornecedores] = useState([])
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
  })

  // Buscar fornecedores na API
  useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/fornecedores')
      .then((response) => response.json())
      .then((data) => setFornecedores(data))
      .catch((error) => console.error('Erro ao buscar fornecedores:', error))
  }, [])

  const handleChange = (event) => {
    const { id, value, type, checked } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' 
        ? checked 
        : (id === 'fornecedor_id' || id === 'tipo_insumo' || id === 'estoque_minimo' || id === 'dias_pilha' || id === 'dias_blackout' || id === 'dias_colheita' ? Number(value) : value), // Converte para número se for fornecedor_id ou dias_colheita
    }));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.checkValidity()) {
      event.stopPropagation()
      setValidated(true)
      return
    }

    
    try {
      const response = await fetch('https://backend.cultivesmart.com.br/api/insumos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Insumo cadastrado com sucesso!')
        setFormData({
          tipo_insumo: 0,
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
        })
        setValidated(false)
      } else {
        alert('Erro ao cadastrar insumo!')
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error)
    }
  }


  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setSelectedImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = (event) => {
    event.preventDefault() 
    document.getElementById('imageUpload').click()
  }

  return (
    <CForm
      className="needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CRow>
        <CCol lg={8}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Insumo</strong> <small>Dados básicos</small>
            </CCardHeader>
            <CCardBody>
              <CRow className="g-3">
                <CCol md={3} className="text-center">
                  <div>
                    <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
                      <img
                        src={selectedImage}
                        alt="Pré-visualização"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </label>
                    <CFormInput
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </CCol>
                <CCol md={9}>
                  <CContainer>
                  <CRow>
                    <CCol md={5}>
                    <CFormLabel htmlFor="tipo_insumo">Tipo Insumo</CFormLabel>
                    <CFormSelect id="tipo_insumo" value={formData.tipo_insumo} onChange={handleChange} required>
                      <option value="" disabled>Escolha...</option>
                      <option value="1">Microverde</option>
                      <option value="2">Flor Comestível</option>
                      <option value="3">Substrato</option>
                      <option value="4">Embalagem</option>
                    </CFormSelect>
                    </CCol>
                    <CCol md={7}>
                    <CFormLabel htmlFor="fornecedor_id">Fornecedor</CFormLabel>
                        <CFormSelect id="fornecedor_id" value={formData.fornecedor_id} onChange={handleChange} required>
                          <option value="" disabled>Escolha um fornecedor</option>
                          {fornecedores.map((fornecedor) => (
                            <option key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={6}>
                        <CFormLabel htmlFor="descricao">Descrição</CFormLabel>
                        <CFormInput type="text" id="descricao" value={formData.descricao} onChange={handleChange} required />
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel htmlFor="complemento">Complemento</CFormLabel>
                        <CFormInput type="text" id="complemento" value={formData.complemento} onChange={handleChange} required />
                      </CCol>
                    <CCol md={4}>
                        <CFormLabel htmlFor="unidade_medida">Unidade de Medida</CFormLabel>
                        <CFormSelect id="unidade_medida" value={formData.unidade_medida} onChange={handleChange} required>
                          <option value="" disabled>Escolha...</option>
                          <option>Sacos</option>
                          <option>Gramas</option>
                          <option>Unidades</option>
                          <option>Litro</option>
                        </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                    <CFormLabel htmlFor="estoque_minimo">Estoque Mínimo</CFormLabel>
                    <CFormInput type="number" id="estoque_minimo" value={formData.estoque_minimo} onChange={handleChange} required />
                    </CCol>
                  </CRow>
                  </CContainer>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={4}>
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Especificação</strong> <small>Dados complementares</small>
            </CCardHeader>
            <CCardBody>
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12} className="text-center">
          <CButton color="primary" type="submit">
            Cadastrar
          </CButton>
        </CCol>
      </CRow>
    </CForm>
  )
}

export default InsumosCadastro
