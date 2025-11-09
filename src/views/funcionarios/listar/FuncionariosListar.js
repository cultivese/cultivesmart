import React, { useState, useEffect, useRef } from 'react'
import {
  CButton,
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
  CToast,
  CToastBody,
  CToastHeader,
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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { 
  cilPeople, 
  cilPlus, 
  cilPencil, 
  cilTrash, 
  cilSearch,
  cilUser,
  cilSettings,
  cilLockLocked,
  cilOptions
} from '@coreui/icons'
import '../Funcionarios.css'

const FuncionariosListar = () => {
  const [funcionarios, setFuncionarios] = useState([])
  const [filteredFuncionarios, setFilteredFuncionarios] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [funcionarioToDelete, setFuncionarioToDelete] = useState(null)
  const [cargos, setCargos] = useState([])
  const [roles, setRoles] = useState([])
  const navigate = useNavigate()
  const toaster = useRef()

  useEffect(() => {
    fetchFuncionarios()
    fetchCargos()
    fetchRoles()
  }, [])

  useEffect(() => {
    // Filtrar colaboradores baseado no termo de busca
    if (searchTerm.trim() === '') {
      setFilteredFuncionarios(funcionarios)
    } else {
      const filtered = funcionarios.filter(funcionario => {
        const cargoNome = getCargoNome(funcionario.cargo_id || funcionario.cargo)
        const roleNome = getRoleNome(funcionario.role_id || funcionario.role)
        
        return funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
               funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               cargoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
               roleNome.toLowerCase().includes(searchTerm.toLowerCase())
      })
      setFilteredFuncionarios(filtered)
    }
  }, [funcionarios, searchTerm, cargos, roles])

  const fetchCargos = async () => {
    try {
      const response = await fetch('https://backend.cultivesmart.com.br/api/cargos', {
        headers: {
          'Accept': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const cargosData = data.data || data.records || data || []
        setCargos(cargosData)
      }
    } catch (error) {
      console.error('Erro ao buscar cargos:', error)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await fetch('https://backend.cultivesmart.com.br/api/roles', {
        headers: {
          'Accept': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const rolesData = data.data || data.records || data || []
        setRoles(rolesData)
      }
    } catch (error) {
      console.error('Erro ao buscar roles:', error)
    }
  }

  const fetchFuncionarios = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('https://backend.cultivesmart.com.br/api/funcionarios', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        // Adaptar para diferentes estruturas de resposta da API
        const funcionariosData = data.data || data.records || data || []
        setFuncionarios(funcionariosData)
      } else {
        const errorData = await response.json()
        addToast('Erro', errorData.message || 'Erro ao carregar colaboradores', 'danger')
      }
    } catch (error) {
      console.error('Erro ao buscar colaboradores:', error)
      addToast('Erro', 'Erro de conexão com o servidor', 'danger')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://backend.cultivesmart.com.br/api/funcionarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const responseData = await response.json()
        // Remove da lista local
        setFuncionarios(prev => prev.filter(func => func.id !== id))
        addToast('Sucesso', responseData.message || 'Colaborador inativado com sucesso!', 'success')
      } else {
        const errorData = await response.json()
        addToast('Erro', errorData.message || 'Erro ao inativar colaborador', 'danger')
      }
    } catch (error) {
      console.error('Erro ao deletar colaborador:', error)
      addToast('Erro', 'Erro de conexão com o servidor', 'danger')
    } finally {
      setDeleteModal(false)
      setFuncionarioToDelete(null)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`https://backend.cultivesmart.com.br/api/funcionarios/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const responseData = await response.json()
        setFuncionarios(prev => 
          prev.map(func => 
            func.id === id ? { ...func, status: newStatus } : func
          )
        )
        addToast('Sucesso', responseData.message || `Status alterado para ${newStatus}`, 'success')
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
    setToast(
      <CToast autohide={true} delay={4000} color={color}>
        <CToastHeader closeButton>
          <CIcon icon={cilUser} className="rounded me-2" />
          <div className="fw-bold me-auto">{title}</div>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    )
  }

  const getCargoNome = (cargoId) => {
    const cargo = cargos.find(c => (c.id || c.codigo) == cargoId)
    return cargo ? (cargo.nome || cargo.descricao) : cargoId || '-'
  }

  const getRoleNome = (roleId) => {
    const role = roles.find(r => (r.id || r.codigo) == roleId)
    return role ? (role.nome || role.descricao) : roleId || '-'
  }

  const getBadgeColor = (role) => {
    // Buscar cor baseada no role atual ou usar padrão baseado no nome
    const roleData = roles.find(r => (r.id || r.codigo) == role)
    if (roleData && roleData.cor) {
      return roleData.cor
    }
    
    // Fallback para cores baseadas no nome/código
    const roleName = getRoleNome(role).toLowerCase()
    if (roleName.includes('super') || roleName.includes('administrador geral')) {
      return 'danger'
    } else if (roleName.includes('admin') || roleName.includes('administrador')) {
      return 'warning' 
    } else if (roleName.includes('operador') || roleName.includes('colaborador')) {
      return 'info'
    } else {
      return 'secondary'
    }
  }

  const getStatusBadgeColor = (status) => {
    return status === 'ativo' ? 'success' : 'secondary'
  }

  const formatRole = (role) => {
    switch (role) {
      case 'super-admin':
        return 'Super Admin'
      case 'admin':
        return 'Administrador'
      case 'operador':
        return 'Operador'
      default:
        return role
    }
  }

  const formatCPF = (cpf) => {
    if (!cpf) return ''
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (phone) => {
    if (!phone) return ''
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
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
                  <CIcon icon={cilPeople} className="me-2" size="lg" />
                  <strong>Lista de Colaboradores</strong>
                </div>
                <CButton
                  color="primary"
                  onClick={() => navigate('/funcionarios/cadastro')}
                >
                  <CIcon icon={cilPlus} className="me-2" />
                  Novo Colaborador
                </CButton>
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
                      placeholder="Pesquisar por nome, email, cargo ou nível de acesso..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={4} className="d-flex align-items-center">
                  <span className="text-muted">
                    {filteredFuncionarios.length} colaborador(es) encontrado(s)
                  </span>
                </CCol>
              </CRow>

              {isLoading ? (
                <div className="text-center py-4">
                  <CSpinner color="primary" />
                  <div className="mt-2">Carregando colaboradores...</div>
                </div>
              ) : filteredFuncionarios.length === 0 ? (
                <CAlert color="info">
                  {searchTerm ? 'Nenhum colaborador encontrado com os termos pesquisados.' : 'Nenhum colaborador cadastrado.'}
                </CAlert>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Nome</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>CPF</CTableHeaderCell>
                      <CTableHeaderCell>Telefone</CTableHeaderCell>
                      <CTableHeaderCell>Cargo</CTableHeaderCell>
                      <CTableHeaderCell>Nível de Acesso</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Ações</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredFuncionarios.map((funcionario) => (
                      <CTableRow key={funcionario.id}>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilUser} className="me-2 text-muted" />
                            <strong>{funcionario.nome}</strong>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>{funcionario.email}</CTableDataCell>
                        <CTableDataCell>{formatCPF(funcionario.cpf)}</CTableDataCell>
                        <CTableDataCell>{formatPhone(funcionario.telefone)}</CTableDataCell>
                        <CTableDataCell>{getCargoNome(funcionario.cargo_id || funcionario.cargo)}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getBadgeColor(funcionario.role_id || funcionario.role)}>
                            {getRoleNome(funcionario.role_id || funcionario.role)}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusBadgeColor(funcionario.status)}>
                            {funcionario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CDropdown>
                            <CDropdownToggle
                              color="light"
                              size="sm"
                              caret={false}
                            >
                              <CIcon icon={cilOptions} />
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem
                                onClick={() => navigate(`/funcionarios/editar/${funcionario.id}`)}
                              >
                                <CIcon icon={cilPencil} className="me-2" />
                                Editar
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => navigate(`/funcionarios/permissoes/${funcionario.id}`)}
                              >
                                <CIcon icon={cilSettings} className="me-2" />
                                Permissões
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => handleStatusChange(
                                  funcionario.id, 
                                  funcionario.status === 'ativo' ? 'inativo' : 'ativo'
                                )}
                              >
                                <CIcon icon={cilLockLocked} className="me-2" />
                                {funcionario.status === 'ativo' ? 'Desativar' : 'Ativar'}
                              </CDropdownItem>
                              <CDropdownItem
                                className="text-danger"
                                onClick={() => {
                                  setFuncionarioToDelete(funcionario)
                                  setDeleteModal(true)
                                }}
                              >
                                <CIcon icon={cilTrash} className="me-2" />
                                Excluir
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
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
          {funcionarioToDelete && (
            <div>
              <p>Tem certeza que deseja excluir o colaborador:</p>
              <strong>{funcionarioToDelete.nome}</strong>
              <p className="mt-2 text-muted">
                Esta ação não pode ser desfeita.
              </p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setDeleteModal(false)}
          >
            Cancelar
          </CButton>
          <CButton
            color="danger"
            onClick={() => handleDelete(funcionarioToDelete?.id)}
          >
            <CIcon icon={cilTrash} className="me-2" />
            Excluir
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default FuncionariosListar