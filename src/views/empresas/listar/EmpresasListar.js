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
  CButtonGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CToast,
  CToastBody,
  CToaster,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CSpinner,
  CAlert,
  CFormSelect,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { 
  cilBuilding, 
  cilPlus, 
  cilPencil, 
  cilTrash, 
  cilSearch,
  cilOptions,
  cilSettings,
  cilCreditCard,
  cilUser
} from '@coreui/icons'
import '../Empresas.css'

const EmpresasListar = () => {
  const [empresas, setEmpresas] = useState([])
  const [filteredEmpresas, setFilteredEmpresas] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [planoFilter, setPlanoFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [empresaToDelete, setEmpresaToDelete] = useState(null)
  const [planos, setPlanos] = useState([])
  const navigate = useNavigate()
  const toaster = useRef()

  useEffect(() => {
    fetchEmpresas()
    fetchPlanos()
  }, [])

  useEffect(() => {
    // Filtrar empresas baseado nos critérios de busca
    let filtered = empresas

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(empresa =>
        empresa.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.cnpj.includes(searchTerm.toLowerCase()) ||
        empresa.admin_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(empresa => empresa.status === statusFilter)
    }

    if (planoFilter) {
      filtered = filtered.filter(empresa => empresa.plano_id == planoFilter)
    }

    setFilteredEmpresas(filtered)
  }, [empresas, searchTerm, statusFilter, planoFilter])

  const fetchPlanos = async () => {
    try {
      const response = await fetch('https://backend.cultivesmart.com.br/api/planos', {
        headers: {
          'Accept': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const planosData = data.data || data.records || data || []
        setPlanos(planosData)
      }
    } catch (error) {
      console.error('Erro ao buscar planos:', error)
    }
  }

  const fetchEmpresas = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('https://backend.cultivesmart.com.br/api/empresas', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const empresasData = data.data || data.records || data || []
        setEmpresas(empresasData)
      } else {
        const errorData = await response.json()
        addToast('Erro', errorData.message || 'Erro ao carregar empresas', 'danger')
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error)
      addToast('Erro', 'Erro de conexão com o servidor', 'danger')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://backend.cultivesmart.com.br/api/empresas/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const responseData = await response.json()
        setEmpresas(prev => prev.filter(empresa => empresa.id !== id))
        addToast('Sucesso', responseData.message || 'Empresa removida com sucesso!', 'success')
      } else {
        const errorData = await response.json()
        addToast('Erro', errorData.message || 'Erro ao remover empresa', 'danger')
      }
    } catch (error) {
      console.error('Erro ao deletar empresa:', error)
      addToast('Erro', 'Erro de conexão com o servidor', 'danger')
    } finally {
      setDeleteModal(false)
      setEmpresaToDelete(null)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`https://backend.cultivesmart.com.br/api/empresas/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const responseData = await response.json()
        setEmpresas(prev => 
          prev.map(empresa => 
            empresa.id === id ? { ...empresa, status: newStatus } : empresa
          )
        )
        addToast('Sucesso', responseData.message || 'Status alterado com sucesso!', 'success')
      } else {
        const errorData = await response.json()
        addToast('Erro', errorData.message || 'Erro ao alterar status', 'danger')
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      addToast('Erro', 'Erro de conexão com o servidor', 'danger')
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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'ativo':
        return 'success'
      case 'inativo':
        return 'danger'
      case 'suspenso':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'ativo':
        return 'Ativo'
      case 'inativo':
        return 'Inativo'
      case 'suspenso':
        return 'Suspenso'
      default:
        return status
    }
  }

  const getPlanName = (planoId) => {
    const plano = planos.find(p => p.id == planoId)
    return plano ? plano.nome : 'N/A'
  }

  const formatCNPJ = (cnpj) => {
    if (!cnpj) return ''
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  const formatPhone = (phone) => {
    if (!phone) return ''
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00'
    return new Intl.NumberFormatter('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const confirmDelete = (empresa) => {
    setEmpresaToDelete(empresa)
    setDeleteModal(true)
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
                  <CIcon icon={cilBuilding} className="me-2" size="lg" />
                  <strong>Lista de Empresas</strong>
                </div>
                <CButton
                  color="primary"
                  onClick={() => navigate('/empresas/cadastro')}
                >
                  <CIcon icon={cilPlus} className="me-2" />
                  Nova Empresa
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              {/* Estatísticas */}
              <div className="empresa-stats">
                <div className="stat-card">
                  <div className="stat-number">{empresas.length}</div>
                  <div className="stat-label">Total de Empresas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{empresas.filter(e => e.status === 'ativo').length}</div>
                  <div className="stat-label">Empresas Ativas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{empresas.filter(e => e.status === 'suspenso').length}</div>
                  <div className="stat-label">Empresas Suspensas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{empresas.filter(e => e.status === 'inativo').length}</div>
                  <div className="stat-label">Empresas Inativas</div>
                </div>
              </div>

              {/* Filtros e Pesquisa */}
              <CRow className="mb-3">
                <CCol md={4}>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Pesquisar por empresa, CNPJ, administrador..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={3}>
                  <CFormSelect
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Todos os status</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="suspenso">Suspenso</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormSelect
                    value={planoFilter}
                    onChange={(e) => setPlanoFilter(e.target.value)}
                  >
                    <option value="">Todos os planos</option>
                    {planos.map((plano) => (
                      <option key={plano.id} value={plano.id}>
                        {plano.nome}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <div className="text-muted small">
                    {filteredEmpresas.length} empresa(s) encontrada(s)
                  </div>
                </CCol>
              </CRow>

              {/* Tabela */}
              {isLoading ? (
                <div className="text-center py-4">
                  <CSpinner color="primary" />
                  <div className="mt-2">Carregando empresas...</div>
                </div>
              ) : filteredEmpresas.length === 0 ? (
                <CAlert color="info">
                  {searchTerm || statusFilter || planoFilter 
                    ? 'Nenhuma empresa encontrada com os critérios pesquisados.' 
                    : 'Nenhuma empresa cadastrada.'}
                </CAlert>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Empresa</CTableHeaderCell>
                      <CTableHeaderCell>CNPJ</CTableHeaderCell>
                      <CTableHeaderCell>Administrador</CTableHeaderCell>
                      <CTableHeaderCell>Plano</CTableHeaderCell>
                      <CTableHeaderCell>Valor Mensal</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Ações</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredEmpresas.map((empresa) => (
                      <CTableRow key={empresa.id}>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilBuilding} className="me-2 text-muted" />
                            <div>
                              <strong>{empresa.razao_social}</strong>
                              {empresa.nome_fantasia && (
                                <div className="text-muted small">{empresa.nome_fantasia}</div>
                              )}
                              <div className="text-muted small">{empresa.email}</div>
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>{formatCNPJ(empresa.cnpj)}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilUser} className="me-2 text-muted" />
                            <div>
                              <strong>{empresa.admin_nome}</strong>
                              <div className="text-muted small">{empresa.admin_email}</div>
                              {empresa.admin_telefone && (
                                <div className="text-muted small">{formatPhone(empresa.admin_telefone)}</div>
                              )}
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="info" className="plano-badge">
                            {getPlanName(empresa.plano_id)}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <strong>{formatCurrency(empresa.valor_mensal)}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusBadgeColor(empresa.status)}>
                            {getStatusText(empresa.status)}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButtonGroup size="sm">
                            <CButton
                              color="info"
                              variant="outline"
                              onClick={() => navigate(`/empresas/cadastro/${empresa.id}`)}
                              title="Editar"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            
                            <CDropdown variant="btn-group">
                              <CDropdownToggle 
                                color="secondary" 
                                variant="outline" 
                                size="sm"
                                title="Mais opções"
                              >
                                <CIcon icon={cilOptions} />
                              </CDropdownToggle>
                              <CDropdownMenu>
                                <CDropdownItem
                                  onClick={() => handleStatusChange(
                                    empresa.id, 
                                    empresa.status === 'ativo' ? 'suspenso' : 'ativo'
                                  )}
                                >
                                  <CIcon icon={cilSettings} className="me-2" />
                                  {empresa.status === 'ativo' ? 'Suspender' : 'Ativar'}
                                </CDropdownItem>
                                <CDropdownItem
                                  onClick={() => navigate(`/empresas/planos?empresa=${empresa.id}`)}
                                >
                                  <CIcon icon={cilCreditCard} className="me-2" />
                                  Gerenciar Plano
                                </CDropdownItem>
                                <CDropdownItem
                                  onClick={() => confirmDelete(empresa)}
                                  className="text-danger"
                                >
                                  <CIcon icon={cilTrash} className="me-2" />
                                  Excluir
                                </CDropdownItem>
                              </CDropdownMenu>
                            </CDropdown>
                          </CButtonGroup>
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

      {/* Modal de Confirmação de Exclusão */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Exclusão</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {empresaToDelete && (
            <>
              <p>Tem certeza que deseja excluir a empresa:</p>
              <strong>{empresaToDelete.razao_social}</strong>
              {empresaToDelete.nome_fantasia && (
                <span> ({empresaToDelete.nome_fantasia})</span>
              )}
              <p className="mt-2 text-danger">
                <small>Esta ação não pode ser desfeita.</small>
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
            onClick={() => handleDelete(empresaToDelete.id)}
          >
            Confirmar Exclusão
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default EmpresasListar