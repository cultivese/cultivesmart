import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import axios from 'axios'

const FornecedoresCadastro = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
  })
  const [validated, setValidated] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {
      try {
        const response = await fetch('https://api.cultivesmart.com.br/', {
          method: 'POST', // Método HTTP
          headers: {
            'Content-Type': 'application/json', // Tipo de dado enviado
          },
          body: JSON.stringify(formData), // Converte os dados em JSON
        });

        alert('Fornecedor cadastrado com sucesso!')
        console.log(response.data)
      } catch (error) {
        console.error('Erro ao cadastrar o fornecedor:', error)
        alert('Erro ao cadastrar o fornecedor.')
      }
    }
    setValidated(true)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Fornecedor</strong> <small>Cadastro</small>
          </CCardHeader>
          <CCardBody>
            <CTabContent className={`rounded-bottom`}>
              <CTabPane className="p-3 preview" visible>
                <CForm
                  className="row g-3 needs-validation"
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit}
                >
                  <CCol md={4}>
                    <CFormLabel htmlFor="nome">Nome</CFormLabel>
                    <CFormInput
                      type="text"
                      id="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                    />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor="cnpj">CNPJ</CFormLabel>
                    <CFormInput
                      type="text"
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={handleChange}
                      required
                    />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor="endereco">Endereço</CFormLabel>
                    <CFormInput
                      type="text"
                      id="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      required
                    />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor="telefone">Telefone</CFormLabel>
                    <CFormInput
                      type="text"
                      id="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                    />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor="email">Email</CFormLabel>
                    <CFormInput
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                  </CCol>
                  <CCol xs={12}>
                    <CButton color="primary" type="submit">
                      Cadastrar
                    </CButton>
                  </CCol>
                </CForm>
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default FornecedoresCadastro
