import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CBadge,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CCardImage,
} from '@coreui/react'

import product_default from './../../../assets/images/microverdes/product_default.png'

const EstoqueVisaoGeral = () => {
  const [filters, setFilters] = useState({
    produto: '',
    status: '',
    dataInicio: '',
    dataFim: '',
  })

  const [estoqueData] = useState([
    {
      id: 1,
      produto: 'Semente de Microverde',
      quantidade: 1200,
      unidade: 'Gramas',
      estoqueMinimo: 500,
      status: 'Disponível',
      ultimaMovimentacao: '2025-01-14',
      imagem: product_default,
    },
    {
      id: 2,
      produto: 'Flor Comestível',
      quantidade: 300,
      unidade: 'Unidades',
      estoqueMinimo: 100,
      status: 'Disponível',
      ultimaMovimentacao: '2025-01-15',
      imagem: product_default,
    },
    {
      id: 3,
      produto: 'Substrato Orgânico',
      quantidade: 20,
      unidade: 'Litros',
      estoqueMinimo: 10,
      status: 'Baixo Estoque',
      ultimaMovimentacao: '2025-01-10',
      imagem: product_default,
    },
  ])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const filteredData = estoqueData.filter((item) => {
    const { produto, status, dataInicio, dataFim } = filters

    const produtoMatch = produto
      ? item.produto.toLowerCase().includes(produto.toLowerCase())
      : true

    const statusMatch = status ? item.status === status : true

    const dataInicioMatch = dataInicio
      ? new Date(item.ultimaMovimentacao) >= new Date(dataInicio)
      : true
    const dataFimMatch = dataFim
      ? new Date(item.ultimaMovimentacao) <= new Date(dataFim)
      : true

    return produtoMatch && statusMatch && dataInicioMatch && dataFimMatch
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Disponível':
        return 'success'
      case 'Baixo Estoque':
        return 'warning'
      case 'Indisponível':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Visão Geral do Estoque</strong> <small>Resumo Atual</small>
          </CCardHeader>
          <CCardBody>
            <CForm className="mb-4">
              <CRow className="g-3">
                <CCol md={4}>
                  <CFormInput
                    type="text"
                    placeholder="Buscar por Produto"
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
                    <option value="">Fornecedor</option>
                    <option value="Disponível">Disponível</option>
                    <option value="Baixo Estoque">Baixo Estoque</option>
                    <option value="Indisponível">Indisponível</option>
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <CFormSelect
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">Filtrar por Status</option>
                    <option value="Disponível">Disponível</option>
                    <option value="Baixo Estoque">Baixo Estoque</option>
                    <option value="Indisponível">Indisponível</option>
                  </CFormSelect>
                </CCol>
                <CCol md={1}>
                  <CButton type="button" color="primary">
                    Filtrar
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
            <CRow className="g-3">
              {filteredData.map((item) => (
                <CCol md={4} key={item.id}>
                  <CCard>
                    <CCardImage
                      orientation="top"
                      src={item.imagem}
                      alt={item.produto}
                      style={{ width: '50%', margin: '0 auto' }}
                    />
                    <CCardBody>
                      <h5 className="mb-3">{item.produto}</h5>
                      <p className="mb-2">
                        <strong>ID:</strong> {item.id}
                      </p>
                      <p className="mb-2">
                        <strong>Quantidade:</strong> {item.quantidade} {item.unidade}
                      </p>
                      <p className="mb-2">
                        <strong>Estoque Mínimo:</strong> {item.estoqueMinimo}
                      </p>
                      <p className="mb-2">
                        <strong>Status:</strong>{' '}
                        <CBadge color={getStatusBadge(item.status)}>
                          {item.status}
                        </CBadge>
                      </p>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EstoqueVisaoGeral



