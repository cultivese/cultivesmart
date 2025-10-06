import React, { useEffect, useState } from 'react'
import { CSpinner, CAlert, CRow, CCol, CCard, CCardBody, CCardTitle, CCardSubtitle, CCardText, CButton } from '@coreui/react-pro'

const FornecedoresListar = () => {
  const [fornecedores, setFornecedores] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('https://backend.cultivesmart.com.br/api/fornecedores')
        const result = await response.json()
        setFornecedores(result.number_of_matching_records ? result.records : [])
      } catch (error) {
        setError('Erro ao buscar fornecedores.')
        setFornecedores([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div style={{padding: '1.5rem'}}>
      <h3 className="mb-4">Fornecedores</h3>
      {loading && <CSpinner />} 
      {error && <CAlert color="danger">{error}</CAlert>}
      {!loading && !error && fornecedores.length === 0 && (
        <CAlert color="info">Nenhum fornecedor cadastrado.</CAlert>
      )}
      <CRow className="g-4">
        {fornecedores.map((fornecedor) => (
          <CCol xs={12} sm={6} md={4} lg={3} key={fornecedor.id}>
            <CCard style={{borderRadius: 16, boxShadow: '0 2px 8px #0001', minHeight: 310, display: 'flex', flexDirection: 'column', height: '100%'}}>
              {/* Foto do fornecedor */}
              {fornecedor.logoPath ? (
                <img
                  src={`data:image/png;base64,${fornecedor.logoPath}`}
                  alt={fornecedor.nome}
                  style={{ width: '100%', height: 120, objectFit: 'contain', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: '#f8f9fa' }}
                />
              ) : (
                <div style={{ width: '100%', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                  <span style={{ fontSize: 48, color: '#bbb' }} className="cil-user" />
                </div>
              )}
              <CCardBody style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                <CCardTitle style={{fontWeight: 600, fontSize: 20, minHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal'}}>{fornecedor.nome}</CCardTitle>
                <CCardSubtitle className="mb-2 text-muted" style={{fontSize: 15}}>{fornecedor.cnpj}</CCardSubtitle>
                <CCardText style={{fontSize: 15, marginBottom: 6, flex: 1}}>
                  <strong>Telefone:</strong> {fornecedor.telefone || '-'}<br/>
                  <strong>Email:</strong> {fornecedor.email || '-'}<br/>
                  <strong>Cidade/UF:</strong> {fornecedor.cidade || '-'} / {fornecedor.estado || '-'}
                </CCardText>
                {/* Botão de ação futuro, ex: visualizar detalhes */}
                {/* <CButton color="primary" size="sm">Ver detalhes</CButton> */}
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </div>
  )
}

export default FornecedoresListar