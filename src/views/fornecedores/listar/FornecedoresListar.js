import React, { useEffect, useState } from 'react'
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
  CTabContent,
  CTabPane,
  CSpinner,
} from '@coreui/react'

const FornecedoresListar = () => {
  const [fornecedores, setFornecedores] = useState([]) // Estado para armazenar os fornecedores
  const [loading, setLoading] = useState(true) // Estado para gerenciar o carregamento

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const response = await fetch('https://api.cultivesmart.com.br/') // URL da API
        if (!response.ok) {
          throw new Error('Erro ao buscar fornecedores.')
        }
        const data = await response.json() // Converte a resposta em JSON
        setFornecedores(data) // Define os fornecedores no estado
      } catch (error) {
        console.error(error.message)
        alert('Não foi possível carregar os fornecedores.')
      } finally {
        setLoading(false) // Finaliza o carregamento
      }
    }

    fetchFornecedores()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Fornecedor</strong> <small>Listar</small>
          </CCardHeader>
          <CCardBody>
            <CTabContent className={`rounded-bottom`}>
              <CTabPane className="p-3 preview" visible>
                {loading ? (
                  <CSpinner color="primary" /> // Exibe um spinner enquanto carrega os dados
                ) : (
                  <CTable color="dark" striped>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Nome</CTableHeaderCell>
                        <CTableHeaderCell scope="col">CNPJ</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Data de Inclusão</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Telefone</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Ativo</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {fornecedores.map((fornecedor) => (
                        <CTableRow key={fornecedor.id}>
                          <CTableHeaderCell scope="row">{fornecedor.id}</CTableHeaderCell>
                          <CTableDataCell>{fornecedor.nome}</CTableDataCell>
                          <CTableDataCell>{fornecedor.cnpj}</CTableDataCell>
                          <CTableDataCell>{new Date(fornecedor.dataInclusao).toLocaleDateString()}</CTableDataCell>
                          <CTableDataCell>{fornecedor.telefone}</CTableDataCell>
                          <CTableDataCell>{fornecedor.email}</CTableDataCell>
                          <CTableDataCell>{fornecedor.ativo ? 'Sim' : 'Não'}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                )}
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default FornecedoresListar
