import React, { useState, useRef, useEffect } from 'react'
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
  CBadge,
  CButton,
  CToast,
  CToastBody,
  CToaster,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CSpinner,
  CAlert,
  CFormFeedback,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { 
  cilCreditCard, 
  cilPlus, 
  cilPencil, 
  cilTrash, 
  cilArrowLeft,
  cilSave,
  cilSearch
} from '@coreui/icons'
import '../Empresas.css'

const EmpresasPlanos = () => {
  const [planos, setPlanos] = useState([])
  const [filteredPlanos, setFilteredPlanos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valor_mensal: '',
    max_usuarios: '',
    max_lotes: '',
    recursos: '',
    status: 'ativo'
  })
  const [validated, setValidated] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [planoToDelete, setPlanoToDelete] = useState(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toaster = useRef()

  useEffect(() => {
    fetchPlanos()
  }, [])

  useEffect(() => {
    // Filtrar planos baseado no termo de busca
    if (searchTerm.trim() === '') {
      setFilteredPlanos(planos)
    } else {
      const filtered = planos.filter(plano =>
        plano.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plano.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPlanos(filtered)
    }
  }, [planos, searchTerm])

  const fetchPlanos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('https://backend.cultivesmart.com.br/api/planos', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const planosData = data.data || data.records || data || []
        setPlanos(planosData)
      } else {
        const errorData = await response.json()
        addToast('Erro', errorData.message || 'Erro ao carregar planos', 'danger')
      }
    } catch (error) {
      console.error('Erro ao buscar planos:', error)
      addToast('Erro', 'Erro de conexão com o servidor', 'danger')
    } finally {
      setIsLoading(false)
    }
  }

  const addToast = (title, message, color) => {
    const newToast = (
      <CToast
        autohide={true}
        delay={4000}
        color={color}
        className="text-white align-items-center"
      >
        <div className="d-flex">
          <CToastBody>
            <strong>{title}:</strong> {message}
          </CToastBody>
        </div>
      </CToast>
    )
    setToast(newToast)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const openModal = (plano = null) => {
    if (plano) {
      setIsEditMode(true)
      setFormData({
        id: plano.id,
        nome: plano.nome || '',
        descricao: plano.descricao || '',
        valor_mensal: plano.valor_mensal || '',
        max_usuarios: plano.max_usuarios || '',
        max_lotes: plano.max_lotes || '',
        recursos: plano.recursos || '',
        status: plano.status || 'ativo'
      })
    } else {
      setIsEditMode(false)
      setFormData({
        nome: '',
        descricao: '',
        valor_mensal: '',
        max_usuarios: '',
        max_lotes: '',
        recursos: '',
        status: 'ativo'
      })
    }
    setValidated(false)
    setShowModal(true)
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()

    if (form.checkValidity() === false) {
      setValidated(true)
      return
    }

    try {
      const url = isEditMode 
        ? `https://backend.cultivesmart.com.br/api/planos/${formData.id}`
        : 'https://backend.cultivesmart.com.br/api/planos'
      
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          descricao: formData.descricao,
          valor_mensal: parseFloat(formData.valor_mensal),
          max_usuarios: parseInt(formData.max_usuarios),
          max_lotes: parseInt(formData.max_lotes),
          recursos: formData.recursos,
          status: formData.status
        }),
      })

      if (response.ok) {
        const responseData = await response.json()
        const message = isEditMode ? 'Plano atualizado com sucesso!' : 'Plano criado com sucesso!'
        addToast('Sucesso', message, 'success')
        setShowModal(false)
        fetchPlanos() // Recarregar a lista
      } else {
        const errorData = await response.json()
        const errorMessage = isEditMode ? 'Erro ao atualizar plano' : 'Erro ao criar plano'
        
        if (response.status === 422) {
          const validationErrors = errorData.errors || {}
          const firstError = Object.values(validationErrors)[0]
          addToast('Erro de Validação', Array.isArray(firstError) ? firstError[0] : firstError, 'danger')
        } else {
          addToast('Erro', errorData.message || errorMessage, 'danger')
        }
      }
    } catch (error) {
      console.error('Erro ao salvar plano:', error)
      addToast('Erro', 'Erro de conexão com o servidor', 'danger')
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://backend.cultivesmart.com.br/api/planos/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const responseData = await response.json()
        setPlanos(prev => prev.filter(plano => plano.id !== id))
        addToast('Sucesso', responseData.message || 'Plano removido com sucesso!', 'success')
      } else {
        const errorData = await response.json()
        addToast('Erro', errorData.message || 'Erro ao remover plano', 'danger')
      }
    } catch (error) {
      console.error('Erro ao deletar plano:', error)
      addToast('Erro', 'Erro de conexão com o servidor', 'danger')
    } finally {
      setDeleteModal(false)
      setPlanoToDelete(null)
    }
  }

  const confirmDelete = (plano) => {
    setPlanoToDelete(plano)
    setDeleteModal(true)
  }

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'ativo':
        return 'success'
      case 'inativo':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return (
    <>
      <CToaster ref={toaster} push={toast} placement="top-end" />
      
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <CIcon icon={cilCreditCard} className="me-2" size="lg" />
                  <strong>Gerenciar Planos</strong>
                </div>
                <div className="d-flex gap-2">
                  {searchParams.get('empresa') && (
                    <CButton
                      color="secondary"
                      variant="outline"
                      onClick={() => navigate('/empresas/listar')}
                    >
                      <CIcon icon={cilArrowLeft} className="me-2" />
                      Voltar para Empresas
                    </CButton>
                  )}
                  <CButton
                    color="primary"
                    onClick={() => openModal()}
                  >
                    <CIcon icon={cilPlus} className="me-2" />
                    Novo Plano
                  </CButton>
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              {/* Barra de Pesquisa */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Pesquisar por nome do plano..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={6}>
                  <div className="text-muted small mt-2">
                    {filteredPlanos.length} plano(s) encontrado(s)
                  </div>
                </CCol>
              </CRow>

              {/* Tabela */}
              {isLoading ? (
                <div className="text-center py-4">
                  <CSpinner color="primary" />
                  <div className="mt-2">Carregando planos...</div>
                </div>
              ) : filteredPlanos.length === 0 ? (
                <CAlert color="info">
                  {searchTerm ? 'Nenhum plano encontrado com os termos pesquisados.' : 'Nenhum plano cadastrado.'}
                </CAlert>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Nome</CTableHeaderCell>
                      <CTableHeaderCell>Descrição</CTableHeaderCell>
                      <CTableHeaderCell>Valor Mensal</CTableHeaderCell>
                      <CTableHeaderCell>Limites</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Ações</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredPlanos.map((plano) => (
                      <CTableRow key={plano.id}>
                        <CTableDataCell>
                          <strong>{plano.nome}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="text-muted" style={{ maxWidth: '200px' }}>
                            {plano.descricao || 'Sem descrição'}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <strong>{formatCurrency(plano.valor_mensal)}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="small">
                            <div>Usuários: {plano.max_usuarios || 'Ilimitado'}</div>
                            <div>Lotes: {plano.max_lotes || 'Ilimitado'}</div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusBadgeColor(plano.status)}>
                            {plano.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            <CButton
                              color="info"
                              variant="outline"
                              size="sm"
                              onClick={() => openModal(plano)}
                              title="Editar"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton
                              color="danger"
                              variant="outline"
                              size="sm"
                              onClick={() => confirmDelete(plano)}
                              title="Excluir"
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal de Formulário */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>{isEditMode ? 'Editar Plano' : 'Novo Plano'}</CModalTitle>
        </CModalHeader>
        <CForm
          className="needs-validation"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <CModalBody>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="nome">Nome do Plano *</CFormLabel>
                <CFormInput
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: Plano Básico"
                  required
                />
                <CFormFeedback invalid>
                  Por favor, informe o nome do plano.
                </CFormFeedback>
              </CCol>

              <CCol md={6}>
                <CFormLabel htmlFor="valor_mensal">Valor Mensal (R$) *</CFormLabel>
                <CFormInput
                  type="number"
                  step="0.01"
                  id="valor_mensal"
                  name="valor_mensal"
                  value={formData.valor_mensal}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
                <CFormFeedback invalid>
                  Por favor, informe o valor mensal.
                </CFormFeedback>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol xs={12}>
                <CFormLabel htmlFor="descricao">Descrição</CFormLabel>
                <CFormTextarea
                  id="descricao"
                  name="descricao"
                  rows={3}
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva as características do plano..."
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="max_usuarios">Máximo de Usuários</CFormLabel>
                <CFormInput
                  type="number"
                  id="max_usuarios"
                  name="max_usuarios"
                  value={formData.max_usuarios}
                  onChange={handleInputChange}
                  placeholder="Deixe vazio para ilimitado"
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel htmlFor="max_lotes">Máximo de Lotes</CFormLabel>
                <CFormInput
                  type="number"
                  id="max_lotes"
                  name="max_lotes"
                  value={formData.max_lotes}
                  onChange={handleInputChange}
                  placeholder="Deixe vazio para ilimitado"
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol xs={12}>
                <CFormLabel htmlFor="recursos">Recursos Inclusos</CFormLabel>
                <CFormTextarea
                  id="recursos"
                  name="recursos"
                  rows={3}
                  value={formData.recursos}
                  onChange={handleInputChange}
                  placeholder="Liste os recursos inclusos no plano..."
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="status">Status *</CFormLabel>
                <CFormInput
                  as="select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </CFormInput>
                <CFormFeedback invalid>
                  Por favor, selecione um status.
                </CFormFeedback>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </CButton>
            <CButton color="success" type="submit">
              <CIcon icon={cilSave} className="me-2" />
              {isEditMode ? 'Atualizar' : 'Salvar'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* Modal de Confirmação de Exclusão */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Exclusão</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {planoToDelete && (
            <>
              <p>Tem certeza que deseja excluir o plano:</p>
              <strong>{planoToDelete.nome}</strong>
              <p className="mt-2 text-danger">
                <small>Esta ação não pode ser desfeita e pode afetar empresas que utilizam este plano.</small>
              </p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>
            Cancelar
          </CButton>
          <CButton 
            color="danger" 
            onClick={() => handleDelete(planoToDelete.id)}
          >
            Confirmar Exclusão
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default EmpresasPlanos