import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CInputGroup,
  CInputGroupText,
  CFormCheck,
} from '@coreui/react'

const InsumosCadastro = () => {
  const [validated, setValidated] = useState(false)
  const [selectedImage, setSelectedImage] = useState("./../../src/assets/images/microverdes/product_default.png") // Caminho para a imagem padrão

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
    event.preventDefault() // Evita o comportamento padrão do link
    document.getElementById('imageUpload').click() // Simula o clique no input de arquivo
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
                {/* Avatar quadrado com clique para upload */}
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
                          marginBottom: '10px',
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
                    <small>
                      <a href="#" onClick={handleImageClick}>
                        Alterar Imagem
                      </a>
                    </small>
                  </div>
                </CCol>
                <CCol md={9}>
                  <CRow>
                    <CCol md={6}>
                      <CFormLabel htmlFor="validationCustom04">Fornecedor</CFormLabel>
                      <CFormSelect id="validationCustom04">
                        <option disabled>Escolha um fornecedor</option>
                        <option>ISLA</option>
                        <option>TOPSEEDS</option>
                      </CFormSelect>
                    </CCol>
                      <CCol md={6}>
                        <CFormLabel htmlFor="validationCustom04">Tipo Semente</CFormLabel>
                        <CFormSelect id="validationCustom04">
                          <option disabled>Escolha...</option>
                          <option>Microverde</option>
                          <option>Flor Comestível</option>
                        </CFormSelect>
                      </CCol>                    
                    </CRow>
                    <CRow>
                    <CCol md={6}>
                      <CFormLabel htmlFor="validationCustom01">Descrição</CFormLabel>
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        defaultValue="Microverde"
                        required
                      />
                    </CCol>
                      <CCol md={6}>
                        <CFormLabel htmlFor="validationCustom01">Variedade</CFormLabel>
                        <CFormInput
                          type="text"
                          id="validationCustom01"
                          defaultValue="Microverde"
                          required
                        />
                      </CCol>
                      
                    <CCol md={4}>
                      <CFormLabel htmlFor="validationCustom05">Unidade de Medida</CFormLabel>
                      <CFormSelect id="validationCustom04">
                          <option disabled>Escolha...</option>
                          <option>Gramas</option>
                          <option>Unidades</option>
                          <option>Litro</option>
                        </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="validationCustom05">Estoque Mínimo</CFormLabel>
                      <CFormInput type="text" id="validationCustom05" required />
                    </CCol>
                    </CRow>
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
                <CInputGroupText id="basic-addon3">Dias em Pilha</CInputGroupText>
                <CFormInput id="basic-url" aria-describedby="basic-addon3" />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText id="basic-addon3">Blackout</CInputGroupText>
                <CFormInput id="basic-url" aria-describedby="basic-addon3" />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText id="basic-addon3">Dias até Colheita</CInputGroupText>
                <CFormInput id="basic-url" aria-describedby="basic-addon3" />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText as="label" htmlFor="inputGroupSelect01">
                  Hidratação
                </CInputGroupText>
                <CFormSelect id="inputGroupSelect01">
                  <option value="1">Irrigação</option>
                  <option value="2">Aspersão</option>
                </CFormSelect>
              </CInputGroup>
              <CFormCheck id="flexCheckDefault" label="Colocar peso" />
              <CFormCheck id="flexCheckDefault" label="Substrato (cobertura)" />
            </CCardBody>
          </CCard>
        </CCol>
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
