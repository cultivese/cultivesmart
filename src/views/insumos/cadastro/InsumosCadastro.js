import React, { useState } from 'react'
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

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
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
                      <CFormLabel htmlFor="tipoSemente">Tipo Insumo</CFormLabel>
                      <CFormSelect id="tipoSemente">
                        <option disabled>Escolha...</option>
                        <option>Microverde</option>
                        <option>Flor Comestível</option>
                        <option>Substrato</option>
                        <option>Embalagem</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={7}>
                      <CFormLabel htmlFor="fornecedor">Fornecedor</CFormLabel>
                      <CFormSelect id="fornecedor">
                        <option disabled>Escolha um fornecedor</option>
                        <option>ISLA</option>
                        <option>TOPSEEDS</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={6}>
                      <CFormLabel htmlFor="descricao">Descrição</CFormLabel>
                      <CFormInput type="text" id="descricao" required />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="variedade">Complemento</CFormLabel>
                      <CFormInput type="text" id="variedade" required />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="unidadeMedida">Unidade de Medida</CFormLabel>
                      <CFormSelect id="unidadeMedida">
                        <option disabled>Escolha...</option>
                        <option>Sacos</option>
                        <option>Gramas</option>
                        <option>Unidades</option>
                        <option>Litro</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="estoqueMinimo">Estoque Mínimo</CFormLabel>
                      <CFormInput type="text" id="estoqueMinimo" required />
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
                <CFormInput />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>Dias em Blackout</CInputGroupText>
                <CFormInput />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>Dias até a Colheita</CInputGroupText>
                <CFormInput />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>Hidratação</CInputGroupText>
                <CFormSelect>
                  <option value="1">Irrigação</option>
                  <option value="2">Aspersão</option>
                </CFormSelect>
              </CInputGroup>
              <CFormCheck label="Colocar peso" />
              <CFormCheck label="Substrato (cobertura)" />
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
