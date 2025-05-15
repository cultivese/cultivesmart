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
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const ClientesCadastro = () => {
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

        const response = await fetch('https://backend.cultivesmart.com.br/api/clientes', {
          method: 'POST',
          body: formDataToSend          
        })

        if (response.ok) {
          setToast(
            <CToast autohide={true} visible={true} color="success">
              <CToastHeader closeButton>Sucesso</CToastHeader>
              <CToastBody>Cliente cadastrado com sucesso!</CToastBody>
            </CToast>
          )
          setTimeout(() => {
            navigate('/clientes/listar')
          }, 2000)
        } else {
          throw new Error('Erro ao cadastrar cliente.')
        }
      } catch (error) {
        setToast(
          <CToast autohide={true} visible={true} color="danger">
            <CToastHeader closeButton>Erro</CToastHeader>
            <CToastBody>Não foi possível cadastrar o cliente.</CToastBody>
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
            <CCardHeader>
              <strong>Cliente</strong> <small>Dados Básicos</small>
            </CCardHeader>
            <CCardBody>
              <CTabContent className={`rounded-bottom`}>
                <CTabPane className="p-3 preview" visible>
                  <CRow className="g-0" xs={{gutterY: 3}}>

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
                              value={formData.cnpj}
                              onChange={handleChange} required
                            />}
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
              <strong>Cliente</strong> <small>Endereço</small>
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
                                onBlur={handleCepBlur} // Adiciona o evento onBlur
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

export default ClientesCadastro
