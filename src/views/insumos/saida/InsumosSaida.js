import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CBadge,
  CButton,
  CCardImage,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel
} from '@coreui/react'

const InsumosSaida = () => {
  const [validated, setValidated] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedInsumo, setSelectedInsumo] = useState(null)
  const [formData, setFormData] = useState({
    produto: '',
    quantidade: '',
    unidade: '',
    fornecedor: '',
    dataCompra: '',
    observacoes: '',
  })
  const [filters, setFilters] = useState({
    produto: '',
    status: '',
  })
  const insumos = [
    {
      id: 1,
      produto: 'Semente de Microverde',
      quantidade_disponivel: '300g',
      status: 'Disponível',
      imagem: './../../../src/assets/images/microverdes/product_default.png',
    },
    {
      id: 2,
      produto: 'Flor Comestível',
      status: 'Disponível',
      quantidade_disponivel: '230g',
      imagem: './../../../src/assets/images/microverdes/product_default.png',
    },
    {
      id: 3,
      produto: 'Substrato Orgânico',
      status: 'Baixo Estoque',
      quantidade_disponivel: '30g',
      imagem: './../../../src/assets/images/microverdes/product_default.png',
    },
  ]

  const handleOpenModal = (insumo) => {
    setSelectedInsumo(insumo)
    setModalVisible(true)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  // const handleSubmit = () => {
  //   console.log('Registro de Insumo:', { ...formData, produto: selectedInsumo?.produto })
  //   setModalVisible(false)
  // }

  const handleFilterChange = (event) => {
    const { name, value } = event.target
    setFilters({ ...filters, [name]: value })
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      console.log('Dados da entrada:', formData)
    }
    setValidated(true)
    setModalVisible(false)
  }

  return (
    <>
      <CForm className="needs-validation" noValidate validated={validated}>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Entrada de Insumos</strong> <small>Registro de Compra</small>
              </CCardHeader>
              <CCardBody>
                <CRow className="g-3 mb-3">
                  <CCol md={3}>
                    <CFormInput
                      type="text"
                      placeholder="Nome do Produto"
                      name="produto"
                      value={filters.produto}
                      onChange={handleFilterChange}
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormSelect
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <option value="">Selecione o Fornecedor</option>
                      <option value="ISLA">ISLA</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={2}>
                    <CFormSelect
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <option value="">Selecione o Status</option>
                      <option value="Disponível">Disponível</option>
                      <option value="Baixo Estoque">Baixo Estoque</option>
                      <option value="Indisponível">Indisponível</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={3} className="text-end">
                    <CButton color="success" onClick={() => setModalVisible(true)}>
                      Buscar
                    </CButton>
                  </CCol>
                </CRow>
                <CRow className="g-3">
                  {insumos.map((item) => (
                    <CCol md={4} key={item.id}>
                      <CCard className="mb-4">
                        <CCardImage orientation="top" src={item.imagem} alt={item.produto} style={{ width: '50%', margin: '0 auto' }} />
                        <CCardBody>
                          <h5 className="mb-3">{item.produto}</h5>
                          <p className="mb-2"><strong>Código:</strong> {item.id}</p>
                          <p className="mb-2"><strong>Quantidade Disponível:</strong> {item.quantidade_disponivel}</p>
                          <p className="mb-2"><strong>Status:</strong> <CBadge color="success">{item.status}</CBadge></p>
                          <CButton color="primary" onClick={() => handleOpenModal(item)}>Registrar Saída</CButton>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))}
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CForm>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Registrar Entrada - {selectedInsumo?.produto}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="quantidade">Quantidade</CFormLabel>
            <CFormInput type="number" id="quantidade" name="quantidade" value={formData.quantidade} onChange={handleInputChange} required />
            
            <CFormLabel htmlFor="dataCompra">Data da Saída</CFormLabel>
            <CFormInput type="date" id="dataCompra" name="dataCompra" value={formData.dataCompra} onChange={handleInputChange} required />

            <CFormLabel htmlFor="observacoes">Observações</CFormLabel>
            <CFormInput type="text" id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleInputChange} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancelar</CButton>
          <CButton color="primary" onClick={handleSubmit}>Registrar</CButton>
        </CModalFooter>
      </CModal>
      </>
  )
}

export default InsumosSaida