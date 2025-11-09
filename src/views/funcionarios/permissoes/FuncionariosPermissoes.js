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
  CFormSelect,
  CFormLabel,
  CAlert,
  CSpinner,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { 
  cilSettings, 
  cilUser, 
  cilArrowLeft, 
  cilSave,
  cilSearch,
  cilShieldAlt,
  cilPeople
} from '@coreui/icons'
import '../Funcionarios.css'

const FuncionariosPermissoes = () => {
  const { id } = useParams()
  const [funcionarios, setFuncionarios] = useState([])
  const [filteredFuncionarios, setFilteredFuncionarios] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFuncionario, setSelectedFuncionario] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [editModal, setEditModal] = useState(false)
  const [newRole, setNewRole] = useState('')
  const navigate = useNavigate()
  const toaster = useRef()

  useEffect(() => {
    fetchFuncionarios()
  }, [])

  useEffect(() => {
    // Se há um ID na URL, abrir modal para esse colaborador específico
    if (id && funcionarios.length > 0) {
      const funcionario = funcionarios.find(f => f.id.toString() === id)
      if (funcionario) {
        setSelectedFuncionario(funcionario)
        setNewRole(funcionario.role)
        setEditModal(true)
      }
    }
  }, [id, funcionarios])

  useEffect(() => {
    // Filtrar colaboradores baseado no termo de busca
    if (searchTerm.trim() === '') {
      setFilteredFuncionarios(funcionarios)
    } else {
      const filtered = funcionarios.filter(funcionario =>
        funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        funcionario.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredFuncionarios(filtered)
    }
  }, [funcionarios, searchTerm])

  const fetchFuncionarios = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('https://backend.cultivesmart.com.br/api/funcionarios')
      
      if (response.ok) {
        const data = await response.json()
        setFuncionarios(data.records || data || [])
      } else {
        addToast('Erro', 'Erro ao carregar colaboradores', 'danger')
      }
    } catch (error) {
      console.error('Erro ao buscar colaboradores:', error)
      addToast('Erro', 'Erro de conexão com o servidor', 'danger')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateRole = async () => {
    if (!selectedFuncionario || !newRole) return

    try {
      const response = await fetch(`https://backend.cultivesmart.com.br/api/funcionarios/${selectedFuncionario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        setFuncionarios(prev => 
          prev.map(func => 
            func.id === selectedFuncionario.id 
              ? { ...func, role: newRole }
              : func
          )
        )
        addToast('Sucesso', 'Permissões atualizadas com sucesso!', 'success')
        setEditModal(false)
        if (id) {
          navigate('/funcionarios/permissoes')
        }
      } else {
        addToast('Erro', 'Erro ao atualizar permissões', 'danger')
      }
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error)
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

  const getBadgeColor = (role) => {
    switch (role) {
      case 'super-admin':
        return 'danger'
      case 'admin':
        return 'warning'
      case 'operador':
        return 'info'
      default:
        return 'secondary'
    }
  }

  const formatRole = (role) => {
    switch (role) {
      case 'super-admin':
        return 'Super Administrador'
      case 'admin':
        return 'Administrador'
      case 'operador':
        return 'Operador'
      default:
        return role
    }
  }

  const getRoleDescription = (role) => {
    switch (role) {
      case 'super-admin':
        return 'Acesso completo ao sistema, incluindo gestão de colaboradores e configurações avançadas'
      case 'admin':
        return 'Acesso à gestão de plantios, estoque, fornecedores e relatórios'
      case 'operador':
        return 'Acesso às tarefas diárias e execução de atividades operacionais'
      default:
        return 'Sem descrição disponível'
    }
  }

  const openEditModal = (funcionario) => {
    setSelectedFuncionario(funcionario)
    setNewRole(funcionario.role)
    setEditModal(true)
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
                  <CIcon icon={cilShieldAlt} className="me-2" size="lg" />
                  <strong>Gerenciar Permissões</strong>
                </div>
                <CButton
                  color="secondary"
                  onClick={() => navigate('/funcionarios/listar')}
                >
                  <CIcon icon={cilArrowLeft} className="me-2" />
                  Voltar
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <CAlert color="info" className="mb-4">
                <strong>Níveis de Permissão:</strong>
                <ul className="mb-0 mt-2">
                  <li><strong>Super Administrador:</strong> Acesso completo, incluindo gestão de colaboradores</li>
                  <li><strong>Administrador:</strong> Gestão de produção, estoque e fornecedores</li>
                  <li><strong>Operador:</strong> Execução de tarefas diárias</li>
                </ul>
              </CAlert>

              {/* Barra de Pesquisa */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Pesquisar colaborador..."
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
                      <CTableHeaderCell>Colaborador</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Nível Atual</CTableHeaderCell>
                      <CTableHeaderCell>Descrição das Permissões</CTableHeaderCell>
                      <CTableHeaderCell>Ações</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredFuncionarios.map((funcionario) => (
                      <CTableRow key={funcionario.id}>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilUser} className="me-2 text-muted" />
                            <div>
                              <strong>{funcionario.nome}</strong>
                              {funcionario.cargo && (
                                <div className="small text-muted">{funcionario.cargo}</div>
                              )}
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>{funcionario.email}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getBadgeColor(funcionario.role)}>
                            {formatRole(funcionario.role)}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <small className="text-muted">
                            {getRoleDescription(funcionario.role)}
                          </small>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="primary"
                            size="sm"
                            onClick={() => openEditModal(funcionario)}
                          >
                            <CIcon icon={cilSettings} className="me-2" />
                            Alterar
                          </CButton>
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

      {/* Modal de Edição de Permissões */}
      <CModal visible={editModal} onClose={() => setEditModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Alterar Permissões</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedFuncionario && (
            <div>
              <div className="mb-4 p-3 bg-light rounded">
                <h6 className="mb-2">Colaborador Selecionado:</h6>
                <div className="d-flex align-items-center">
                  <CIcon icon={cilUser} className="me-2 text-muted" />
                  <div>
                    <strong>{selectedFuncionario.nome}</strong>
                    <div className="small text-muted">{selectedFuncionario.email}</div>
                  </div>
                </div>
              </div>

              <CRow>
                <CCol md={6}>
                  <CFormLabel htmlFor="currentRole">Permissão Atual:</CFormLabel>
                  <div className="mb-3">
                    <CBadge color={getBadgeColor(selectedFuncionario.role)} className="fs-6 px-3 py-2">
                      {formatRole(selectedFuncionario.role)}
                    </CBadge>
                  </div>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="newRole">Nova Permissão:</CFormLabel>
                  <CFormSelect
                    id="newRole"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="operador">Operador</option>
                    <option value="admin">Administrador</option>
                    <option value="super-admin">Super Administrador</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <div className="mt-4">
                <h6>Descrição da Nova Permissão:</h6>
                <div className="p-3 border rounded bg-light">
                  <CBadge color={getBadgeColor(newRole)} className="mb-2">
                    {formatRole(newRole)}
                  </CBadge>
                  <p className="mb-0 small">
                    {getRoleDescription(newRole)}
                  </p>
                </div>
              </div>

              {selectedFuncionario.role !== newRole && (
                <CAlert color="warning" className="mt-3">
                  <strong>Atenção:</strong> Alterar as permissões afetará imediatamente o acesso do colaborador ao sistema.
                </CAlert>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setEditModal(false)}
          >
            Cancelar
          </CButton>
          <CButton
            color="primary"
            onClick={handleUpdateRole}
            disabled={!selectedFuncionario || selectedFuncionario.role === newRole}
          >
            <CIcon icon={cilSave} className="me-2" />
            Salvar Alterações
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default FuncionariosPermissoes