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

const InsumosListar = () => {
  const [insumos, setInsumos] = useState([]) // Estado para armazenar os insumos
  const [loading, setLoading] = useState(true) // Estado para gerenciar o carregamento

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const response = await fetch('https://backend.cultivesmart.com.br/api/insumos') // URL da API
        if (!response.ok) {
          throw new Error('Erro ao buscar insumos.')
        }
        const data = await response.json() // Converte a resposta em JSON
        setInsumos(data) // Define os insumos no estado
      } catch (error) {
        console.error(error.message)
        alert('Não foi possível carregar os insumos.')
      } finally {
        setLoading(false) // Finaliza o carregamento
      }
    }

    fetchInsumos()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Insumos</strong> <small>Listar</small>
          </CCardHeader>
          <CCardBody>
            <CTabContent className={`rounded-bottom`}>
              <CTabPane className="p-3 preview" visible>
                {loading ? (
                  <CSpinner color="primary" /> // Exibe um spinner enquanto carrega os dados
                ) : (
                  <CTable color="dark">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Nome</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Categoria</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Fornecedor</CTableHeaderCell>
                        {/* <CTableHeaderCell scope="col">Variedade</CTableHeaderCell> 
                         <CTableHeaderCell scope="col">Descrição</CTableHeaderCell> */}
                        <CTableHeaderCell scope="col">Quantidade</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Unidade de Medida</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Estoque Mínimo</CTableHeaderCell>
                        {/* <CTableHeaderCell scope="col">Dias de Pilha</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Dias Blackout</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Dias para Colheita</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Hidratação</CTableHeaderCell> 
                        <CTableHeaderCell scope="col">Peso</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Substrato</CTableHeaderCell>*/}
                        <CTableHeaderCell scope="col">Data de Inclusão</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {insumos.map((insumo) => (
                        <CTableRow key={insumo.id}>
                          <CTableHeaderCell scope="row">{insumo.id}</CTableHeaderCell>
                          <CTableDataCell>{insumo.nome}</CTableDataCell>
                          <CTableDataCell>{insumo.category}</CTableDataCell>
                          <CTableDataCell>{insumo.fornecedor.nome}</CTableDataCell>
                          {/* <CTableDataCell>{insumo.variedade}</CTableDataCell>
                          <CTableDataCell>{insumo.descricao}</CTableDataCell> */}
                          <CTableDataCell>{insumo.quantidade}</CTableDataCell>
                          <CTableDataCell>{insumo.unidade_medida}</CTableDataCell>
                          <CTableDataCell>{insumo.estoque_minimo}</CTableDataCell>
                          {/* <CTableDataCell>{insumo.dias_pilha}</CTableDataCell>
                          <CTableDataCell>{insumo.dias_blackout}</CTableDataCell>
                          <CTableDataCell>{insumo.dias_colheita}</CTableDataCell>
                          <CTableDataCell>{insumo.hidratacao}</CTableDataCell>
                          <CTableDataCell>{insumo.colocar_peso ? 'Sim' : 'Não'}</CTableDataCell>
                          <CTableDataCell>{insumo.substrato ? 'Sim' : 'Não'}</CTableDataCell> */}
                          <CTableDataCell>{new Date(insumo.created_at).toLocaleDateString()}</CTableDataCell>
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

export default InsumosListar
