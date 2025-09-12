
import React, { useEffect, useState } from 'react'
import { CSmartTable } from '@coreui/react-pro'

const FornecedoresListar = () => {
  const [activePage, setActivePage] = useState(3)
  const [columnFilter, setColumnFilter] = useState({})
  const [columnSorter, setColumnSorter] = useState()
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [records, setRecords] = useState(0)

  const columns = [
    { key: 'id', _style: { minWidth: '130px' } },
    { key: 'nome', _style: { minWidth: '130px' } },
    { key: 'cnpj', _style: { minWidth: '130px' } },
    { key: 'telefone', _style: { minWidth: '130px' } },
    'email',
    { key: 'cidade', _style: { minWidth: '120px' } },
    { key: 'estado', label: 'UF' },
  ]

  useEffect(() => {
    const fetchData = async () => {

    try {
      setLoading(true)

      const response = await fetch(
        `https://backend.cultivesmart.com.br/api/fornecedores`, //?offset=${offset}&limit=${itemsPerPage}&${params}`,
      )

      const result = await response.json()

      setRecords(result.number_of_matching_records)
      setUsers(result.number_of_matching_records ? result.records : [])

    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([]) // Optionally show an error state
    } finally {
      setLoading(false)
    }
  }

  fetchData()
  }, [activePage, columnFilter, columnSorter, itemsPerPage])

  return (
    <CSmartTable
      columns={columns}
      items={users}
      columnFilter
      loading = {loading}
      columnSorter
      pagination
      itemsPerPage={5}
      tableProps={{
        hover: true,
      }}
    />
    ) 
}

export default FornecedoresListar
