import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
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

const FornecedoresListar = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Fornecedor</strong> <small>Listar</small>
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
    </CRow>
  )
}

export default FornecedoresListar