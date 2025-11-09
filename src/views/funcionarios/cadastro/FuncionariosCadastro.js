import React, { useState, useRef, useEffect } from 'react'
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
  CRow,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CFormSelect,
  CFormLabel,
  CAlert,
  CSpinner,
} from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilSave, cilArrowLeft, cilUser } from '@coreui/icons'
import '../Funcionarios.css'

const FuncionariosCadastro = () => {
  const { id } = useParams() // Para detectar se é edição
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    endereco: '',
    cargo: '',
    role: '',
    senha: '',
    confirmarSenha: '',
    status: 'ativo',
  })
  const [validated, setValidated] = useState(false)
  const [toast, setToast] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [cargos, setCargos] = useState([])
  const [roles, setRoles] = useState([])
  const [isLoadingCargos, setIsLoadingCargos] = useState(false)
  const [isLoadingRoles, setIsLoadingRoles] = useState(false)
  const navigate = useNavigate()
  const toaster = useRef()

  // Carregar dados do colaborador quando for edição
  useEffect(() => {
    if (id) {
      setIsEditMode(true)
      fetchFuncionario(id)
    }
  }, [id])

  // Carregar cargos e roles quando o componente montar
  useEffect(() => {
    fetchCargos()
    fetchRoles()
  }, [])

  const fetchCargos = async () => {
    try {
      setIsLoadingCargos(true)
      const response = await fetch('https://backend.cultivesmart.com.br/api/cargos', {
        headers: {
          'Accept': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        // Suporte para diferentes estruturas de resposta
        const cargosData = data.data || data.records || data || []
        setCargos(cargosData)
      } else {
        console.error('Erro ao buscar cargos:', response.status)
        addToast('Aviso', 'Não foi possível carregar a lista de cargos', 'warning')
      }
    } catch (error) {
      console.error('Erro ao buscar cargos:', error)
      addToast('Aviso', 'Erro ao carregar cargos', 'warning')
    } finally {
      setIsLoadingCargos(false)
    }
  }

  const fetchRoles = async () => {
    try {
      setIsLoadingRoles(true)
      const response = await fetch('https://backend.cultivesmart.com.br/api/roles', {
        headers: {
          'Accept': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        // Suporte para diferentes estruturas de resposta
        const rolesData = data.data || data.records || data || []
        setRoles(rolesData)
      } else {
        console.error('Erro ao buscar roles:', response.status)
        addToast('Aviso', 'Não foi possível carregar os níveis de acesso', 'warning')
      }
    } catch (error) {
      console.error('Erro ao buscar roles:', error)
      addToast('Aviso', 'Erro ao carregar níveis de acesso', 'warning')
    } finally {
      setIsLoadingRoles(false)
    }
  }

  const fetchFuncionario = async (funcionarioId) => {
    try {
      setIsLoadingData(true)
      const response = await fetch(`https://backend.cultivesmart.com.br/api/funcionarios/${funcionarioId}`)
      
      if (response.ok) {
        const funcionario = await response.json()
        setFormData({
          nome: funcionario.nome || '',
          email: funcionario.email || '',
          cpf: funcionario.cpf || '',
          telefone: funcionario.telefone || '',
          endereco: funcionario.endereco || '',
          cargo: funcionario.cargo_id || funcionario.cargo || '',
          role: funcionario.role_id || funcionario.role || '',
          senha: '', // Não carregar senha por segurança
          confirmarSenha: '',
          status: funcionario.status || 'ativo',
        })
      } else {
        addToast('Erro', 'Erro ao carregar dados do colaborador', 'danger')
        navigate('/funcionarios/listar')
      }
    } catch (error) {
      console.error('Erro ao buscar colaborador:', error)
      addToast('Erro', 'Erro de conexão com o servidor', 'danger')
      navigate('/funcionarios/listar')
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const errors = {}
    
    // Validação de nome
    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório'
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório'
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Email inválido'
    }
    
    // Validação de CPF (simplificada)
    if (!formData.cpf.trim()) {
      errors.cpf = 'CPF é obrigatório'
    }
    
    // Validação de senha (obrigatória apenas no cadastro)
    if (!isEditMode) {
      if (!formData.senha.trim()) {
        errors.senha = 'Senha é obrigatória'
      } else if (formData.senha.length < 6) {
        errors.senha = 'Senha deve ter pelo menos 6 caracteres'
      }
      
      // Validação de confirmação de senha
      if (formData.senha !== formData.confirmarSenha) {
        errors.confirmarSenha = 'Senhas não coincidem'
      }
    } else {
      // Na edição, só valida se foi informada uma nova senha
      if (formData.senha.trim() && formData.senha.length < 6) {
        errors.senha = 'Senha deve ter pelo menos 6 caracteres'
      }
      
      if (formData.senha.trim() && formData.senha !== formData.confirmarSenha) {
        errors.confirmarSenha = 'Senhas não coincidem'
      }
    }
    
    return errors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    
    const errors = validateForm()
    
    if (Object.keys(errors).length > 0) {
      setValidated(true)
      // Mostrar primeiro erro
      const firstError = Object.values(errors)[0]
      addToast('Erro de Validação', firstError, 'danger')
      return
    }

    setIsLoading(true)
    
    try {
      const requestBody = {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ''), // Remove formatação
        telefone: formData.telefone.replace(/\D/g, ''), // Remove formatação
        endereco: formData.endereco,
        cargo_id: formData.cargo,
        role_id: formData.role,
        status: formData.status,
      }

      // Se for edição e foi informada nova senha, incluir no body
      if (isEditMode && formData.senha.trim()) {
        requestBody.senha = formData.senha
      } else if (!isEditMode) {
        // Se for cadastro, sempre incluir senha
        requestBody.senha = formData.senha
      }

      const url = isEditMode 
        ? `https://backend.cultivesmart.com.br/api/funcionarios/${id}`
        : 'https://backend.cultivesmart.com.br/api/funcionarios'
      
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (response.ok) {
        const responseData = await response.json()
        const message = isEditMode ? 'Colaborador atualizado com sucesso!' : 'Colaborador cadastrado com sucesso!'
        addToast('Sucesso', message, 'success')
        
        // Limpar formulário se for cadastro
        if (!isEditMode) {
          setFormData({
            nome: '',
            email: '',
            cpf: '',
            telefone: '',
            endereco: '',
            cargo: '',
            role: '',
            senha: '',
            confirmarSenha: '',
            status: 'ativo',
          })
          setValidated(false)
        }
        
        setTimeout(() => {
          navigate('/funcionarios/listar')
        }, 2000)
      } else {
        const errorData = await response.json()
        const errorMessage = isEditMode ? 'Erro ao atualizar colaborador' : 'Erro ao cadastrar colaborador'
        
        // Tratar diferentes tipos de erro da API
        if (response.status === 422) {
          // Erro de validação
          const validationErrors = errorData.errors || {}
          const firstError = Object.values(validationErrors)[0]
          const errorMsg = Array.isArray(firstError) ? firstError[0] : firstError
          addToast('Erro de Validação', errorMsg || 'Dados inválidos', 'danger')
        } else if (response.status === 409) {
          // Conflito (email ou CPF já existe)
          addToast('Erro', errorData.message || 'Email ou CPF já cadastrado', 'danger')
        } else {
          addToast('Erro', errorData.message || errorMessage, 'danger')
        }
      }
    } catch (error) {
      console.error('Erro ao salvar colaborador:', error)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        addToast('Erro', 'Erro de conexão com o servidor. Verifique sua conexão.', 'danger')
      } else {
        addToast('Erro', 'Erro inesperado. Tente novamente.', 'danger')
      }
    } finally {
      setIsLoading(false)
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

  return (
    <>
      <CToaster ref={toaster} push={toast} placement="top-end" />
      
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex align-items-center">
                <CIcon icon={cilPeople} className="me-2" size="lg" />
                <strong>{isEditMode ? 'Editar Colaborador' : 'Cadastro de Colaborador'}</strong>
              </div>
            </CCardHeader>
            <CCardBody>
              {isLoadingData ? (
                <div className="text-center py-4">
                  <CSpinner color="primary" />
                  <div className="mt-2">Carregando dados do colaborador...</div>
                </div>
              ) : (
                <>
                  <CAlert color="info" className="mb-4">
                    <strong>Atenção:</strong> {isEditMode 
                      ? 'Altere os campos necessários e clique em salvar para atualizar os dados do colaborador.'
                      : 'Preencha todos os campos obrigatórios para cadastrar um novo colaborador no sistema.'
                    }
                  </CAlert>

              <CForm
                className="row g-3 needs-validation"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
              >
                {/* Informações Pessoais */}
                <CCol xs={12}>
                  <h5 className="border-bottom pb-2 mb-3">Informações Pessoais</h5>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="nome">Nome Completo *</CFormLabel>
                  <CFormInput
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Digite o nome completo"
                    required
                  />
                  <CFormFeedback invalid>
                    Por favor, informe o nome completo.
                  </CFormFeedback>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="email">Email *</CFormLabel>
                  <CFormInput
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="funcionario@empresa.com"
                    required
                  />
                  <CFormFeedback invalid>
                    Por favor, informe um email válido.
                  </CFormFeedback>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="cpf">CPF *</CFormLabel>
                  <InputMask
                    mask="999.999.999-99"
                    value={formData.cpf}
                    onChange={handleInputChange}
                  >
                    {(inputProps) => (
                      <CFormInput
                        {...inputProps}
                        type="text"
                        id="cpf"
                        name="cpf"
                        placeholder="000.000.000-00"
                        required
                      />
                    )}
                  </InputMask>
                  <CFormFeedback invalid>
                    Por favor, informe um CPF válido.
                  </CFormFeedback>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="telefone">Telefone</CFormLabel>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={formData.telefone}
                    onChange={handleInputChange}
                  >
                    {(inputProps) => (
                      <CFormInput
                        {...inputProps}
                        type="text"
                        id="telefone"
                        name="telefone"
                        placeholder="(00) 00000-0000"
                      />
                    )}
                  </InputMask>
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="endereco">Endereço</CFormLabel>
                  <CFormInput
                    type="text"
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    placeholder="Rua, número, bairro, cidade"
                  />
                </CCol>

                {/* Informações Profissionais */}
                <CCol xs={12}>
                  <h5 className="border-bottom pb-2 mb-3 mt-4">Informações Profissionais</h5>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="cargo">Cargo</CFormLabel>
                  <CFormSelect
                    id="cargo"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    disabled={isLoadingCargos}
                  >
                    <option value="">
                      {isLoadingCargos ? 'Carregando cargos...' : 'Selecione um cargo'}
                    </option>
                    {cargos.map((cargo) => (
                      <option key={cargo.id || cargo.codigo} value={cargo.codigo || cargo.id}>
                        {cargo.nome || cargo.descricao}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="role">Nível de Acesso *</CFormLabel>
                  <CFormSelect
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    disabled={isLoadingRoles}
                  >
                    <option value="">
                      {isLoadingRoles ? 'Carregando níveis...' : 'Selecione um nível de acesso'}
                    </option>
                    {roles.map((role) => (
                      <option key={role.id || role.codigo} value={role.codigo || role.id}>
                        {role.nome || role.descricao}
                      </option>
                    ))}
                  </CFormSelect>
                  <CFormFeedback invalid>
                    Por favor, selecione um nível de acesso.
                  </CFormFeedback>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="status">Status</CFormLabel>
                  <CFormSelect
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </CFormSelect>
                </CCol>

                {/* Informações de Acesso */}
                <CCol xs={12}>
                  <h5 className="border-bottom pb-2 mb-3 mt-4">Informações de Acesso</h5>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="senha">
                    {isEditMode ? 'Nova Senha (opcional)' : 'Senha *'}
                  </CFormLabel>
                  <CFormInput
                    type="password"
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    placeholder={isEditMode ? 'Deixe em branco para manter a atual' : 'Mínimo 6 caracteres'}
                    required={!isEditMode}
                  />
                  <CFormFeedback invalid>
                    Por favor, informe uma senha com pelo menos 6 caracteres.
                  </CFormFeedback>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="confirmarSenha">
                    {isEditMode ? 'Confirmar Nova Senha' : 'Confirmar Senha *'}
                  </CFormLabel>
                  <CFormInput
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleInputChange}
                    placeholder={isEditMode ? 'Confirme a nova senha' : 'Repita a senha'}
                    required={!isEditMode}
                  />
                  <CFormFeedback invalid>
                    As senhas não coincidem.
                  </CFormFeedback>
                </CCol>

                {/* Botões */}
                <CCol xs={12} className="mt-4">
                  <div className="d-flex gap-2">
                    <CButton
                      color="secondary"
                      onClick={() => navigate('/funcionarios/listar')}
                      disabled={isLoading}
                    >
                      <CIcon icon={cilArrowLeft} className="me-2" />
                      Voltar
                    </CButton>
                    <CButton
                      color="primary"
                      type="submit"
                      disabled={isLoading}
                    >
                      <CIcon icon={cilSave} className="me-2" />
                      {isLoading ? 'Salvando...' : (isEditMode ? 'Atualizar Colaborador' : 'Salvar Colaborador')}
                    </CButton>
                  </div>
                </CCol>
              </CForm>
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default FuncionariosCadastro