import React, { useState, useRef, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
  CButton,
  CSpinner,
  CAlert,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CFormFeedback,
  CBadge,
} from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilBuilding, cilSave, cilArrowLeft, cilUser, cilCreditCard } from '@coreui/icons'
import '../Empresas.css'

const EmpresasCadastro = () => {
  const { id } = useParams()
  const [formData, setFormData] = useState({
    // Dados da empresa
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    inscricaoEstadual: '',
    telefone: '',
    email: '',
    site: '',
    
    // Endereço
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    
    // Plano contratado
    planoId: '',
    dataInicioContrato: '',
    dataFimContrato: '',
    valorMensal: '',
    observacoes: '',
    
    // Dados do administrador
    adminNome: '',
    adminEmail: '',
    adminTelefone: '',
    adminCpf: '',
    adminCargo: '',
    
    // Status
    status: 'ativo',
  })
  
  const [validated, setValidated] = useState(false)
  const [toast, setToast] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [planos, setPlanos] = useState([])
  const [isLoadingPlanos, setIsLoadingPlanos] = useState(false)
  const navigate = useNavigate()
  const toaster = useRef()

  // Carregar dados da empresa quando for edição
  useEffect(() => {
    if (id) {
      setIsEditMode(true)
      fetchEmpresa(id)
    }
  }, [id])

  // Carregar planos disponíveis
  useEffect(() => {
    fetchPlanos()
  }, [])

  const fetchPlanos = async () => {
    try {
      setIsLoadingPlanos(true)
      const response = await fetch('https://backend.cultivesmart.com.br/api/planos', {
        headers: {
          'Accept': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const planosData = data.data || data.records || data || []
        setPlanos(planosData)
      } else {
        console.error('Erro ao buscar planos:', response.status)
        addToast('Aviso', 'Não foi possível carregar a lista de planos', 'warning')
      }
    } catch (error) {
      console.error('Erro ao buscar planos:', error)
      addToast('Aviso', 'Erro ao carregar planos', 'warning')
    } finally {
      setIsLoadingPlanos(false)
    }
  }

  const fetchEmpresa = async (empresaId) => {
    try {
      setIsLoadingData(true)
      const response = await fetch(`https://backend.cultivesmart.com.br/api/empresas/${empresaId}`)
      
      if (response.ok) {
        const empresa = await response.json()
        setFormData({
          // Dados da empresa (pode vir estruturado ou flat)
          razaoSocial: empresa.empresa?.razao_social || empresa.razao_social || '',
          nomeFantasia: empresa.empresa?.nome_fantasia || empresa.nome_fantasia || '',
          cnpj: empresa.empresa?.cnpj || empresa.cnpj || '',
          inscricaoEstadual: empresa.empresa?.inscricao_estadual || empresa.inscricao_estadual || '',
          telefone: empresa.empresa?.telefone || empresa.telefone || '',
          email: empresa.empresa?.email || empresa.email || '',
          site: empresa.empresa?.site || empresa.site || '',
          status: empresa.empresa?.status || empresa.status || 'ativo',
          
          // Endereço (pode vir estruturado ou flat)
          cep: empresa.endereco?.cep || empresa.cep || '',
          endereco: empresa.endereco?.logradouro || empresa.endereco || '',
          numero: empresa.endereco?.numero || empresa.numero || '',
          complemento: empresa.endereco?.complemento || empresa.complemento || '',
          bairro: empresa.endereco?.bairro || empresa.bairro || '',
          cidade: empresa.endereco?.cidade || empresa.cidade || '',
          estado: empresa.endereco?.estado || empresa.estado || '',
          
          // Contrato (pode vir estruturado ou flat)
          planoId: empresa.contrato?.plano_id || empresa.plano_id || '',
          dataInicioContrato: empresa.contrato?.data_inicio || empresa.data_inicio_contrato || '',
          dataFimContrato: empresa.contrato?.data_fim || empresa.data_fim_contrato || '',
          valorMensal: empresa.contrato?.valor_mensal || empresa.valor_mensal || '',
          observacoes: empresa.contrato?.observacoes || empresa.observacoes || '',
          
          // Administrador (pode vir estruturado ou flat)
          adminNome: empresa.administrador?.nome || empresa.admin_nome || '',
          adminEmail: empresa.administrador?.email || empresa.admin_email || '',
          adminTelefone: empresa.administrador?.telefone || empresa.admin_telefone || '',
          adminCpf: empresa.administrador?.cpf || empresa.admin_cpf || '',
          adminCargo: empresa.administrador?.cargo || empresa.admin_cargo || '',
        })
      } else {
        addToast('Erro', 'Erro ao carregar dados da empresa', 'danger')
        navigate('/empresas/listar')
      }
    } catch (error) {
      console.error('Erro ao buscar empresa:', error)
      addToast('Erro', 'Erro de conexão com o servidor', 'danger')
    } finally {
      setIsLoadingData(false)
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

  const formatCNPJ = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18)
  }

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2')
      .substring(0, 14)
  }

  const formatPhone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15)
  }

  const formatCEP = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 9)
  }

  const handleCNPJChange = (e) => {
    const formatted = formatCNPJ(e.target.value)
    setFormData(prev => ({ ...prev, cnpj: formatted }))
  }

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value)
    setFormData(prev => ({ ...prev, adminCpf: formatted }))
  }

  const handlePhoneChange = (e) => {
    const { name } = e.target
    const formatted = formatPhone(e.target.value)
    setFormData(prev => ({ ...prev, [name]: formatted }))
  }

  const handleCEPChange = (e) => {
    const formatted = formatCEP(e.target.value)
    setFormData(prev => ({ ...prev, cep: formatted }))
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()

    if (form.checkValidity() === false) {
      setValidated(true)
      return
    }

    setIsLoading(true)
    
    try {
      const requestBody = {
        // Dados básicos da empresa
        empresa: {
          razao_social: formData.razaoSocial,
          nome_fantasia: formData.nomeFantasia,
          cnpj: formData.cnpj.replace(/\D/g, ''),
          inscricao_estadual: formData.inscricaoEstadual,
          telefone: formData.telefone.replace(/\D/g, ''),
          email: formData.email,
          site: formData.site,
          status: formData.status,
        },
        
        // Endereço da empresa
        endereco: {
          cep: formData.cep.replace(/\D/g, ''),
          logradouro: formData.endereco,
          numero: formData.numero,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado,
        },
        
        // Informações do plano contratado
        contrato: {
          plano_id: formData.planoId,
          data_inicio: formData.dataInicioContrato,
          data_fim: formData.dataFimContrato,
          valor_mensal: parseFloat(formData.valorMensal),
          observacoes: formData.observacoes,
        },
        
        // Dados do administrador da empresa
        administrador: {
          nome: formData.adminNome,
          email: formData.adminEmail,
          telefone: formData.adminTelefone.replace(/\D/g, ''),
          cpf: formData.adminCpf.replace(/\D/g, ''),
          cargo: formData.adminCargo,
        }
      }

      const url = isEditMode 
        ? `https://backend.cultivesmart.com.br/api/empresas/${id}`
        : 'https://backend.cultivesmart.com.br/api/empresas'
      
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
        const message = isEditMode ? 'Empresa atualizada com sucesso!' : 'Empresa cadastrada com sucesso!'
        addToast('Sucesso', message, 'success')
        
        // Limpar formulário se for cadastro
        if (!isEditMode) {
          setFormData({
            razaoSocial: '',
            nomeFantasia: '',
            cnpj: '',
            inscricaoEstadual: '',
            telefone: '',
            email: '',
            site: '',
            cep: '',
            endereco: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            planoId: '',
            dataInicioContrato: '',
            dataFimContrato: '',
            valorMensal: '',
            observacoes: '',
            adminNome: '',
            adminEmail: '',
            adminTelefone: '',
            adminCpf: '',
            adminCargo: '',
            status: 'ativo',
          })
          setValidated(false)
        }
        
        setTimeout(() => {
          navigate('/empresas/listar')
        }, 2000)
      } else {
        const errorData = await response.json()
        const errorMessage = isEditMode ? 'Erro ao atualizar empresa' : 'Erro ao cadastrar empresa'
        
        if (response.status === 422) {
          const validationErrors = errorData.errors || {}
          const firstError = Object.values(validationErrors)[0]
          addToast('Erro de Validação', Array.isArray(firstError) ? firstError[0] : firstError, 'danger')
        } else if (response.status === 409) {
          addToast('Erro', 'CNPJ já cadastrado no sistema', 'danger')
        } else {
          addToast('Erro', errorData.message || errorMessage, 'danger')
        }
      }
    } catch (error) {
      console.error('Erro ao salvar empresa:', error)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        addToast('Erro', 'Erro de conexão com o servidor. Verifique sua conexão.', 'danger')
      } else {
        addToast('Erro', 'Erro inesperado. Tente novamente.', 'danger')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CContainer fluid>
      <CToaster ref={toaster} push={toast} placement="top-end" />
      
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <CIcon icon={cilBuilding} className="me-2" size="lg" />
                  <strong>{isEditMode ? 'Editar Empresa' : 'Cadastro de Empresa'}</strong>
                </div>
                <CButton
                  color="secondary"
                  variant="outline"
                  onClick={() => navigate('/empresas/listar')}
                >
                  <CIcon icon={cilArrowLeft} className="me-2" />
                  Voltar
                </CButton>
              </div>
              {isLoadingData && (
                <div className="d-flex align-items-center mt-2">
                  <CSpinner size="sm" className="me-2" />
                  <div className="mt-2">Carregando dados da empresa...</div>
                </div>
              )}
              <div className="mt-2 text-muted">
                <small>
                  {isEditMode 
                    ? 'Altere os campos necessários e clique em salvar para atualizar os dados da empresa.'
                    : 'Preencha todos os campos obrigatórios para cadastrar uma nova empresa no sistema.'}
                </small>
              </div>
            </CCardHeader>
            <CCardBody>
              <CForm
                className="row g-3 needs-validation"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
              >
                {/* Seção: Dados da Empresa */}
                <CCol xs={12}>
                  <div className="form-section">
                    <h5 className="section-title">
                      <CIcon icon={cilBuilding} className="me-2" />
                      Dados da Empresa
                    </h5>
                    
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel htmlFor="razaoSocial" className="required-field">Razão Social</CFormLabel>
                        <CFormInput
                          type="text"
                          id="razaoSocial"
                          name="razaoSocial"
                          value={formData.razaoSocial}
                          onChange={handleInputChange}
                          placeholder="Ex: Agropecuária Silva Ltda."
                          required
                        />
                        <CFormFeedback invalid>
                          Por favor, informe a razão social.
                        </CFormFeedback>
                      </CCol>

                      <CCol md={6}>
                        <CFormLabel htmlFor="nomeFantasia">Nome Fantasia</CFormLabel>
                        <CFormInput
                          type="text"
                          id="nomeFantasia"
                          name="nomeFantasia"
                          value={formData.nomeFantasia}
                          onChange={handleInputChange}
                          placeholder="Ex: Fazenda Silva"
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={4}>
                        <CFormLabel htmlFor="cnpj" className="required-field">CNPJ</CFormLabel>
                        <CFormInput
                          type="text"
                          id="cnpj"
                          name="cnpj"
                          value={formData.cnpj}
                          onChange={handleCNPJChange}
                          placeholder="00.000.000/0000-00"
                          required
                        />
                        <CFormFeedback invalid>
                          Por favor, informe um CNPJ válido.
                        </CFormFeedback>
                      </CCol>

                      <CCol md={4}>
                        <CFormLabel htmlFor="inscricaoEstadual">Inscrição Estadual</CFormLabel>
                        <CFormInput
                          type="text"
                          id="inscricaoEstadual"
                          name="inscricaoEstadual"
                          value={formData.inscricaoEstadual}
                          onChange={handleInputChange}
                          placeholder="000.000.000.000"
                        />
                      </CCol>

                      <CCol md={4}>
                        <CFormLabel htmlFor="telefone" className="required-field">Telefone</CFormLabel>
                        <CFormInput
                          type="text"
                          id="telefone"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handlePhoneChange}
                          placeholder="(00) 00000-0000"
                          required
                        />
                        <CFormFeedback invalid>
                          Por favor, informe um telefone.
                        </CFormFeedback>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel htmlFor="email" className="required-field">E-mail</CFormLabel>
                        <CFormInput
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="contato@empresa.com.br"
                          required
                        />
                        <CFormFeedback invalid>
                          Por favor, informe um e-mail válido.
                        </CFormFeedback>
                      </CCol>

                      <CCol md={6}>
                        <CFormLabel htmlFor="site">Site</CFormLabel>
                        <CFormInput
                          type="url"
                          id="site"
                          name="site"
                          value={formData.site}
                          onChange={handleInputChange}
                          placeholder="https://www.empresa.com.br"
                        />
                      </CCol>
                    </CRow>
                  </div>
                </CCol>

                {/* Seção: Endereço */}
                <CCol xs={12}>
                  <div className="form-section">
                    <h5 className="section-title">Endereço</h5>
                    
                    <CRow className="mb-3">
                      <CCol md={3}>
                        <CFormLabel htmlFor="cep" className="required-field">CEP</CFormLabel>
                        <CFormInput
                          type="text"
                          id="cep"
                          name="cep"
                          value={formData.cep}
                          onChange={handleCEPChange}
                          placeholder="00000-000"
                          required
                        />
                        <CFormFeedback invalid>
                          Por favor, informe o CEP.
                        </CFormFeedback>
                      </CCol>

                      <CCol md={6}>
                        <CFormLabel htmlFor="endereco" className="required-field">Endereço</CFormLabel>
                        <CFormInput
                          type="text"
                          id="endereco"
                          name="endereco"
                          value={formData.endereco}
                          onChange={handleInputChange}
                          placeholder="Rua, Avenida, etc."
                          required
                        />
                        <CFormFeedback invalid>
                          Por favor, informe o endereço.
                        </CFormFeedback>
                      </CCol>

                      <CCol md={3}>
                        <CFormLabel htmlFor="numero">Número</CFormLabel>
                        <CFormInput
                          type="text"
                          id="numero"
                          name="numero"
                          value={formData.numero}
                          onChange={handleInputChange}
                          placeholder="123"
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={4}>
                        <CFormLabel htmlFor="complemento">Complemento</CFormLabel>
                        <CFormInput
                          type="text"
                          id="complemento"
                          name="complemento"
                          value={formData.complemento}
                          onChange={handleInputChange}
                          placeholder="Sala, Andar, etc."
                        />
                      </CCol>

                      <CCol md={4}>
                        <CFormLabel htmlFor="bairro" className="required-field">Bairro</CFormLabel>
                        <CFormInput
                          type="text"
                          id="bairro"
                          name="bairro"
                          value={formData.bairro}
                          onChange={handleInputChange}
                          placeholder="Nome do bairro"
                          required
                        />
                        <CFormFeedback invalid>
                          Por favor, informe o bairro.
                        </CFormFeedback>
                      </CCol>

                      <CCol md={4}>
                        <CFormLabel htmlFor="cidade" className="required-field">Cidade</CFormLabel>
                        <CFormInput
                          type="text"
                          id="cidade"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleInputChange}
                          placeholder="Nome da cidade"
                          required
                        />
                        <CFormFeedback invalid>
                          Por favor, informe a cidade.
                        </CFormFeedback>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel htmlFor="estado" className="required-field">Estado</CFormLabel>
                        <CFormSelect
                          id="estado"
                          name="estado"
                          value={formData.estado}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione o estado</option>
                          <option value="AC">Acre</option>
                          <option value="AL">Alagoas</option>
                          <option value="AP">Amapá</option>
                          <option value="AM">Amazonas</option>
                          <option value="BA">Bahia</option>
                          <option value="CE">Ceará</option>
                          <option value="DF">Distrito Federal</option>
                          <option value="ES">Espírito Santo</option>
                          <option value="GO">Goiás</option>
                          <option value="MA">Maranhão</option>
                          <option value="MT">Mato Grosso</option>
                          <option value="MS">Mato Grosso do Sul</option>
                          <option value="MG">Minas Gerais</option>
                          <option value="PA">Pará</option>
                          <option value="PB">Paraíba</option>
                          <option value="PR">Paraná</option>
                          <option value="PE">Pernambuco</option>
                          <option value="PI">Piauí</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="RN">Rio Grande do Norte</option>
                          <option value="RS">Rio Grande do Sul</option>
                          <option value="RO">Rondônia</option>
                          <option value="RR">Roraima</option>
                          <option value="SC">Santa Catarina</option>
                          <option value="SP">São Paulo</option>
                          <option value="SE">Sergipe</option>
                          <option value="TO">Tocantins</option>
                        </CFormSelect>
                        <CFormFeedback invalid>
                          Por favor, selecione o estado.
                        </CFormFeedback>
                      </CCol>
                    </CRow>
                  </div>
                </CCol>

                {/* Seção: Plano Contratado */}
                <CCol xs={12}>
                  <div className="form-section">
                    <h5 className="section-title">
                      <CIcon icon={cilCreditCard} className="me-2" />
                      Plano Contratado
                    </h5>
                    
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel htmlFor="planoId" className="required-field">Plano</CFormLabel>
                        <CFormSelect
                          id="planoId"
                          name="planoId"
                          value={formData.planoId}
                          onChange={handleInputChange}
                          required
                          disabled={isLoadingPlanos}
                        >
                          <option value="">
                            {isLoadingPlanos ? 'Carregando planos...' : 'Selecione um plano'}
                          </option>
                          {planos.map((plano) => (
                            <option key={plano.id} value={plano.id}>
                              {plano.nome} - R$ {plano.valor_mensal}
                            </option>
                          ))}
                        </CFormSelect>
                        <CFormFeedback invalid>
                          Por favor, selecione um plano.
                        </CFormFeedback>
                      </CCol>

                      <CCol md={6}>
                        <CFormLabel htmlFor="valorMensal" className="required-field">Valor Mensal (R$)</CFormLabel>
                        <CFormInput
                          type="number"
                          step="0.01"
                          id="valorMensal"
                          name="valorMensal"
                          value={formData.valorMensal}
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
                      <CCol md={6}>
                        <CFormLabel htmlFor="dataInicioContrato" className="required-field">Data Início do Contrato</CFormLabel>
                        <CFormInput
                          type="date"
                          id="dataInicioContrato"
                          name="dataInicioContrato"
                          value={formData.dataInicioContrato}
                          onChange={handleInputChange}
                          required
                        />
                        <CFormFeedback invalid>
                          Por favor, informe a data de início.
                        </CFormFeedback>
                      </CCol>

                      <CCol md={6}>
                        <CFormLabel htmlFor="dataFimContrato">Data Fim do Contrato</CFormLabel>
                        <CFormInput
                          type="date"
                          id="dataFimContrato"
                          name="dataFimContrato"
                          value={formData.dataFimContrato}
                          onChange={handleInputChange}
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol xs={12}>
                        <CFormLabel htmlFor="observacoes">Observações do Contrato</CFormLabel>
                        <CFormTextarea
                          id="observacoes"
                          name="observacoes"
                          rows={3}
                          value={formData.observacoes}
                          onChange={handleInputChange}
                          placeholder="Observações adicionais sobre o contrato..."
                        />
                      </CCol>
                    </CRow>
                  </div>
                </CCol>

                {/* Seção: Dados do Administrador */}
                <CCol xs={12}>
                  <div className="form-section admin-info">
                    <h5 className="section-title">
                      <CIcon icon={cilUser} className="me-2" />
                      Dados do Administrador da Empresa
                    </h5>
                    
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel htmlFor="adminNome" className="required-field">Nome Completo</CFormLabel>
                        <CFormInput
                          type="text"
                          id="adminNome"
                          name="adminNome"
                          value={formData.adminNome}
                          onChange={handleInputChange}
                          placeholder="Nome completo do administrador"
                          required
                        />
                        <CFormFeedback invalid>
                          Por favor, informe o nome do administrador.
                        </CFormFeedback>
                      </CCol>

                      <CCol md={6}>
                        <CFormLabel htmlFor="adminEmail" className="required-field">E-mail</CFormLabel>
                        <CFormInput
                          type="email"
                          id="adminEmail"
                          name="adminEmail"
                          value={formData.adminEmail}
                          onChange={handleInputChange}
                          placeholder="admin@empresa.com.br"
                          required
                        />
                        <CFormFeedback invalid>
                          Por favor, informe um e-mail válido.
                        </CFormFeedback>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={4}>
                        <CFormLabel htmlFor="adminTelefone" className="required-field">Telefone</CFormLabel>
                        <CFormInput
                          type="text"
                          id="adminTelefone"
                          name="adminTelefone"
                          value={formData.adminTelefone}
                          onChange={handlePhoneChange}
                          placeholder="(00) 00000-0000"
                          required
                        />
                        <CFormFeedback invalid>
                          Por favor, informe o telefone.
                        </CFormFeedback>
                      </CCol>

                      <CCol md={4}>
                        <CFormLabel htmlFor="adminCpf" className="required-field">CPF</CFormLabel>
                        <CFormInput
                          type="text"
                          id="adminCpf"
                          name="adminCpf"
                          value={formData.adminCpf}
                          onChange={handleCPFChange}
                          placeholder="000.000.000-00"
                          required
                        />
                        <CFormFeedback invalid>
                          Por favor, informe o CPF.
                        </CFormFeedback>
                      </CCol>

                      <CCol md={4}>
                        <CFormLabel htmlFor="adminCargo">Cargo</CFormLabel>
                        <CFormInput
                          type="text"
                          id="adminCargo"
                          name="adminCargo"
                          value={formData.adminCargo}
                          onChange={handleInputChange}
                          placeholder="Ex: Diretor, Proprietário"
                        />
                      </CCol>
                    </CRow>
                  </div>
                </CCol>

                {/* Seção: Status */}
                <CCol xs={12}>
                  <div className="form-section">
                    <h5 className="section-title">Status</h5>
                    
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel htmlFor="status" className="required-field">Status da Empresa</CFormLabel>
                        <CFormSelect
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="ativo">Ativo</option>
                          <option value="inativo">Inativo</option>
                          <option value="suspenso">Suspenso</option>
                        </CFormSelect>
                        <CFormFeedback invalid>
                          Por favor, selecione um status.
                        </CFormFeedback>
                      </CCol>
                    </CRow>
                  </div>
                </CCol>

                {/* Botões de Ação */}
                <CCol xs={12}>
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <CButton
                      color="secondary"
                      variant="outline"
                      onClick={() => navigate('/empresas/listar')}
                      disabled={isLoading}
                    >
                      Cancelar
                    </CButton>
                    <CButton
                      color="success"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading && <CSpinner size="sm" className="me-2" />}
                      <CIcon icon={cilSave} className="me-2" />
                      {isLoading ? 'Salvando...' : (isEditMode ? 'Atualizar Empresa' : 'Salvar Empresa')}
                    </CButton>
                  </div>
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default EmpresasCadastro