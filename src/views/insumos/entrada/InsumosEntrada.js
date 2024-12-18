import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormFeedback,
  CFormLabel,
  CFormSelect,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'

const CustomStyles = () => {
  const [validated, setValidated] = useState(false)
  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
  }
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={3}>
        <CFormLabel htmlFor="validationCustom04">Fornecedor</CFormLabel>
        <CFormSelect id="validationCustom04">
          <option disabled>Choose...</option>
          <option>Microverde</option>
          <option>Flor Comestível</option>
        </CFormSelect>
        <CFormFeedback invalid>Please provide a valid city.</CFormFeedback>
      </CCol>
      <CCol md={3}>
        <CFormLabel htmlFor="validationCustom04">Tipo Semente</CFormLabel>
        <CFormSelect id="validationCustom04">
          <option>Todos</option>
          <option>Microverde</option>
          <option>Flor Comestível</option>
        </CFormSelect>
        <CFormFeedback invalid>Please provide a valid city.</CFormFeedback>
      </CCol>
      <CCol md={3}>
        <CFormLabel htmlFor="validationCustom04">Semente</CFormLabel>
        <CFormSelect id="validationCustom04">
          <option disabled>Choose...</option>
          <option>Todos</option>
          <option>Beterraba</option>
          <option>Couve</option>
          <option>Repolho</option>
        </CFormSelect>
        <CFormFeedback invalid>Please provide a valid city.</CFormFeedback>
      </CCol>
      <CCol md={3}>
        <CFormLabel htmlFor="validationCustom04">Especificação</CFormLabel>
        <CFormSelect id="validationCustom04">
          <option disabled>Choose...</option>
          <option>...</option>
        </CFormSelect>
        <CFormFeedback invalid>Please provide a valid city.</CFormFeedback>
      </CCol>
      <CCol xs={12}>
        <CButton color="primary" type="submit">
          Listar
        </CButton>
      </CCol>
    </CForm>
    
    )
}

const Listagem = () => {
  const [validated, setValidated] = useState(false)
  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
  }
  return (
    <CTable color="dark" striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Nome</CTableHeaderCell>
                    <CTableHeaderCell scope="col">CNPJ</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Data de Inclusão</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Telefone</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Ativo</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell scope="row">1</CTableHeaderCell>
                    <CTableDataCell>Fornecedore 01</CTableDataCell>
                    <CTableDataCell>00.000.000/0000-00</CTableDataCell>
                    <CTableDataCell>18/12/2024</CTableDataCell>
                    <CTableDataCell>(79) 9 9999-9999</CTableDataCell>
                    <CTableDataCell>fulano@mail.com.br</CTableDataCell>
                    <CTableDataCell>Sim</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
    )
}

const InsumosEntrada = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Insumos</strong> <small>Cadastro</small>
          </CCardHeader>
          <CCardBody>
            <CTabContent className={`rounded-bottom`}>
              <CTabPane className="p-3 preview" visible>
                {CustomStyles()}
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>

      <CTabContent className={`rounded-bottom`}>
      <CTabPane className="p-3 preview" visible>
        {Listagem()}
      </CTabPane>
    </CTabContent>
    </CRow>
    
  )
}

export default InsumosEntrada