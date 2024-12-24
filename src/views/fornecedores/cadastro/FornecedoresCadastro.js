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
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const FornecedoresCadastro = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
  })
  const [validated, setValidated] = useState(false)
  const [toast, setToast] = useState(null) // Gerencia as notificações
  const navigate = useNavigate() // Para redirecionamento

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
        const response = await fetch('https://api.cultivesmart.com.br/fornecedores', {
          method: 'POST', // Método HTTP
          headers: {
            'Content-Type': 'application/json', // Tipo de dado enviado
          },
          body: JSON.stringify(formData), // Converte os dados em JSON
        })

        if (response.ok) {
          // Exibe notificação de sucesso
          setToast(
            <CToast autohide={true} visible={true} color="success">
              <CToastHeader closeButton>Sucesso</CToastHeader>
              <CToastBody>Fornecedor cadastrado com sucesso!</CToastBody>
            </CToast>
          )

          // Redireciona após 2 segundos
          setTimeout(() => {
            navigate('/fornecedores')
          }, 2000)
        } else {
          throw new Error('Erro ao cadastrar fornecedor.')
        }
      } catch (error) {
        // Exibe notificação de erro
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

  return (
    <>
      <CToaster push={toast} placement="top-end" /> {/* Exibe o toast */}
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
    </>
  )
}

export default FornecedoresCadastro
