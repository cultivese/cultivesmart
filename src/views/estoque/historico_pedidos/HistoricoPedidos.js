import React, { useState } from 'react'
import { CAvatar, CBadge, CButton, CCollapse, CSmartTable } from '@coreui/react-pro'

import {
  
CFormInput,
CForm,
CTable,
CTableHead,
CTableRow,
CTableHeaderCell,
CTableBody,
CTableDataCell, 
CCol
} from '@coreui/react';


const getBadge = (status) => {
  switch (status) {
    case 'Aprovado': {
      return 'success'
    }
    case 'Pendente': {
      return 'warning'
    }
    case 'Cancelado': {
      return 'danger'
    }
    default: {
      return 'primary'
    }
  }
}


const SmartTableExample = () => {

  const [details, setDetails] = useState([])
  const columns = [
    {
      key: 'nota_fiscal',
      _style: { width: '15%' },
    },
    {
      key: 'fornecedor',
      _style: { width: '20%' },
    },
    {
      key: 'data_criacao',
      _style: { width: '15%' },
      sorter: (item1, item2) => {
        const a = new Date(item1.registered)
        const b = new Date(item2.registered)
        return a > b ? 1 : b > a ? -1 : 0
      },
    },
    {
      key: 'total_pedido',
      _style: { width: '15%' },
    },
    {
      key: 'total_imposto',
      _style: { width: '15%' },
    },
    {
      key: 'total_desconto',
      _style: { width: '15%' },
    },
    'status',
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
  ]
  const items = [
    {
      nota_fiscal: '123456789',
      criado_por: 'Victor Bomfim Nunes',
      data_criacao: '21/03/2025',
      fornecedor: 'Isla',
      total_pedido: 'R$ 100,50',
      total_imposto: 'R$ 13,75',
      total_desconto: 'R$ 0,00',
      status: 'Aprovado',
    },
    {
      nota_fiscal: null,
      criado_por: 'Victor Bomfim Nunes',
      data_criacao: '21/02/2025',
      fornecedor: 'Isla',
      total_pedido: 'R$ 289,13',
      total_imposto: 'R$ 80,25',
      total_desconto: 'R$ 5,00',
      status: 'Cancelado',
    },
    {
      nota_fiscal: null,
      criado_por: 'Felipe Hermínio',
      data_criacao: '21/01/2025',
      fornecedor: 'Top Seeds',
      total_pedido: 'R$ 509,99',
      total_imposto: 'R$ 8,57',
      total_desconto: 'R$ 2,10',
      status: 'Pendente',
    },
  ]

  const toggleDetails = (id) => {
    const position = details.indexOf(id)
    let newDetails = [...details]
    if (position === -1) {
      newDetails = [...details, id]
    } else {
      newDetails.splice(position, 1)
    }
    setDetails(newDetails)
  }


  return (
    <CSmartTable
      cleaner
      clickableRows
      columns={columns}
      columnSorter
      items={items}
      itemsPerPageSelect
      itemsPerPage={5}
      pagination
      onFilteredItemsChange={(items) => {
        console.log('onFilteredItemsChange')
        console.table(items)
      }}
      onSelectedItemsChange={(items) => {
        console.log('onSelectedItemsChange')
        console.table(items)
      }}
      scopedColumns={{
        registered: (item) => {
          const date = new Date(item.registered)
          const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
          return <td>{date.toLocaleDateString('en-US', options)}</td>
        },
        status: (item) => (
          <td>
            <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
          </td>
        ),
        show_details: (item) => {
          return (
            <td className="py-2">
              <CButton
                color="primary"
                variant="outline"
                shape="square"
                size="sm"
                onClick={() => {
                  toggleDetails(item.nota_fiscal)
                }}
              >
                {details.includes(item.nota_fiscal) ? 'Fechar' : 'Visualizar'}
              </CButton>
            </td>
          )
        },
        details: (item) => {
          return (
            <CCollapse visible={details.includes(item.nota_fiscal)}>
              <div className="p-3">
                <h4>{item.name}</h4>
                <p className="text-body-secondary">Solicitado por: {item.criado_por}</p>
                <p className="text-body-secondary">Criado em: {item.data_criacao}</p>
                
                <p className="text-body-secondary">Insumos: {item.registered}</p>

                <CForm className="row g-3">
                  <CTable>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Insumo</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Quantidade</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Preço</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Imposto</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Desconto</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow>
                        <CTableHeaderCell scope="row">1</CTableHeaderCell>
                        <CTableDataCell>Beterraba Roxa - 100g</CTableDataCell>
                        <CTableDataCell>5</CTableDataCell>
                        <CTableDataCell>57,00</CTableDataCell>
                        <CTableDataCell>
                          <CCol xs={4}>
                            <CFormInput
                              type="text"
                              id="exampleFormControlInput1"
                              aria-describedby="exampleFormControlInputHelpInline"
                            />
                          </CCol>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CCol xs={4}>
                            <CFormInput
                              type="text"
                              id="exampleFormControlInput1"
                              aria-describedby="exampleFormControlInputHelpInline"
                            />
                          </CCol>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell scope="row">2</CTableHeaderCell>
                        <CTableDataCell>Beterraba Amarela - 100g</CTableDataCell>
                        <CTableDataCell>2</CTableDataCell>
                        <CTableDataCell>57,00</CTableDataCell>
                        <CTableDataCell>
                          <CCol xs={4}>
                            <CFormInput
                              type="text"
                              id="exampleFormControlInput1"
                              aria-describedby="exampleFormControlInputHelpInline"
                            />
                          </CCol>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CCol xs={4}>
                            <CFormInput
                              type="text"
                              id="exampleFormControlInput1"
                              aria-describedby="exampleFormControlInputHelpInline"
                            />
                          </CCol>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell scope="row">3</CTableHeaderCell>
                        <CTableDataCell>Couve Flor - 500g</CTableDataCell>
                        <CTableDataCell>1</CTableDataCell>
                        <CTableDataCell>57,00</CTableDataCell>
                        <CTableDataCell>
                          <CCol xs={4}>
                            <CFormInput
                              type="text"
                              id="exampleFormControlInput1"
                              aria-describedby="exampleFormControlInputHelpInline"
                            />
                          </CCol>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CCol xs={4}>
                            <CFormInput
                              type="text"
                              id="exampleFormControlInput1"
                              aria-describedby="exampleFormControlInputHelpInline"
                            />
                          </CCol>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CForm>
                <CButton size="sm" color="info">
                  Aprovar
                </CButton>
                <CButton size="sm" color="danger" className="ms-1">
                  Cancelar
                </CButton>
              </div>
            </CCollapse>
          )
        },
      }}
      selectable
      sorterValue={{ column: 'nota_fiscal', state: 'desc' }}
      tableFilter
      tableProps={{
        className: 'add-this-custom-class',
        responsive: true,
        striped: true,
        hover: true,
      }}
      tableBodyProps={{
        className: 'align-middle',
      }}
    />
  )
};

export default SmartTableExample;