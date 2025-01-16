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
} from '@coreui/react'

const InsumosSaida = () => {
  const [validated, setValidated] = useState(false)
  const [formData, setFormData] = useState({
    produto: '',
    quantidade: '',
    unidade: '',
    finalidade: '',
    dataSaida: '',
    observacoes: '',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      console.log('Dados da saída:', formData)
      // Aqui você pode adicionar a lógica para enviar os dados ao backend
    }
    setValidated(true)
  }

  return (
    <CForm
      className="needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CRow>
        <CCol lg={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Saída de Insumos</strong> <small>Registro de Uso</small>
            </CCardHeader>
            <CCardBody>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="produto">Produto</CFormLabel>
                  <CFormSelect
                    id="produto"
                    name="produto"
                    value={formData.produto}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um produto</option>
                    <option value="Microverde">Microverde</option>
                    <option value="Flor Comestível">Flor Comestível</option>
                    <option value="Substrato">Substrato</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="quantidade">Quantidade</CFormLabel>
                  <CFormInput
                    type="number"
                    id="quantidade"
                    name="quantidade"
                    value={formData.quantidade}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="unidade">Unidade de Medida</CFormLabel>
                  <CFormSelect
                    id="unidade"
                    name="unidade"
                    value={formData.unidade}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Gramas">Gramas</option>
                    <option value="Unidades">Unidades</option>
                    <option value="Litro">Litro</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="finalidade">Finalidade</CFormLabel>
                  <CFormSelect
                    id="finalidade"
                    name="finalidade"
                    value={formData.finalidade}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Escolha a finalidade</option>
                    <option value="Plantio">Plantio</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Outro">Outro</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="dataSaida">Data da Saída</CFormLabel>
                  <CFormInput
                    type="date"
                    id="dataSaida"
                    name="dataSaida"
                    value={formData.dataSaida}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="observacoes">Observações</CFormLabel>
                  <CFormInput
                    type="text"
                    id="observacoes"
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} className="text-center">
          <CButton color="primary" type="submit">
            Registrar Saída
          </CButton>
        </CCol>
      </CRow>
    </CForm>
  )
}

export default InsumosSaida
