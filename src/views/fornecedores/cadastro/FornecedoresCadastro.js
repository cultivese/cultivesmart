import React, { useState } from 'react'
import InputMask from 'react-input-mask'
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
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

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
        const response = await fetch('https://backend.cultivesmart.com.br/api/fornecedores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
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

  return (
    <>
      <CToaster push={toast} placement="top-end" />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Fornecedor</strong> <small>Cadastro</small>
            </CCardHeader>
            <CCardBody>
              <CTabContent className={`rounded-bottom`}>
                <CTabPane className="p-3 preview" visible>
                  <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
                    <CCol md={4}>
                      <CFormLabel htmlFor="nome">Nome</CFormLabel>
                      <CFormInput type="text" id="nome" value={formData.nome} onChange={handleChange} required />
                      <CFormFeedback valid>Looks good!</CFormFeedback>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="cnpj">CNPJ</CFormLabel>
                      <InputMask mask="99.999.999/9999-99" value={formData.cnpj} onChange={handleChange}>
                        {(inputProps) => <CFormInput {...inputProps} type="text" id="cnpj" required />}
                      </InputMask>
                      <CFormFeedback valid>Looks good!</CFormFeedback>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="endereco">Endereço</CFormLabel>
                      <CFormInput type="text" id="endereco" value={formData.endereco} onChange={handleChange} required />
                      <CFormFeedback valid>Looks good!</CFormFeedback>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="telefone">Telefone</CFormLabel>
                      <InputMask mask="(99) 99999-9999" value={formData.telefone} onChange={handleChange}>
                        {(inputProps) => <CFormInput {...inputProps} type="text" id="telefone" required />}
                      </InputMask>
                      <CFormFeedback valid>Looks good!</CFormFeedback>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="email">Email</CFormLabel>
                      <CFormInput type="email" id="email" value={formData.email} onChange={handleChange} required />
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
