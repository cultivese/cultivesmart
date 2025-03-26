import React, { useState, useEffect } from 'react'
import { CAvatar, CBadge, CButton, CCollapse, CSmartTable } from '@coreui/react-pro'
import { useSearchParams, useNavigate } from "react-router-dom";
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
    case 'aprovado': {
      return 'success'
    }
    case 'pendente': {
      return 'warning'
    }
    case 'cancelado': {
      return 'danger'
    }
    default: {
      return 'primary'
    }
  }
}


const GerenciadorPedidos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const filtro = searchParams.get("filtro") || "todos"; // Default: "todos"
  const [dadosFiltrados, setDadosFiltrados] = useState([]);
  const [details, setDetails] = useState([])
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { key: 'codigo_cotacao', _style: { width: '15%' }, label: 'Código Cotação' },
    { key: 'nota_fiscal', _style: { width: '15%' }, label: 'Nota Fiscal'},
    { key: 'nome_fornecedor', _style: { width: '20%' }, label: 'Fornecedor'},
    { key: 'data_validade', _style: { width: '15%' }, label: 'Data Validade' },
    { key: 'total', _style: { width: '15%' }, label: 'Total Pedido' },
    { key: 'imposto', _style: { width: '15%' }, label: 'Total Imposto' },
    { key: 'desconto', _style: { width: '15%' }, label: 'Total Desconto' },
    { key: 'status', _style: { width: '20%' }, label: 'Status'},
    { key: 'show_details', label: '', _style: { width: '1%' }, filter: false, sorter: false },
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://backend.cultivesmart.com.br/api/cotacao');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const transformarDados = (records) => {
          return records.map(item => {
            return {
              codigo_cotacao: item.codigo_cotacao,
              nota_fiscal: item.nota_fiscal,
              data_validade: item.data_validade,
              total: item.total,
              imposto: item.imposto,
              desconto: item.desconto,
              nome_fornecedor: item.fornecedor.nome,
              status: item.status.nome,
              insumos: item.insumos
            };
          });
        };


        setItems(transformarDados(data.records)); // Executando a função e passando o resultado
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const limparFiltro = () => {
    setSearchParams({ filtro: "todos" });
    navigate("?"); // Atualiza a URL sem recarregar a página
  };

  useEffect(() => {
    if (loading) return;
    if (error) return;

    const transformarDados = (itens) => {
      return itens.map(item => {
        return {
          codigo_cotacao: item.codigo_cotacao,
          nota_fiscal: item.nota_fiscal,
          data_validade: item.data_validade,
          total: item.total,
          imposto: item.imposto,
          desconto: item.desconto,
          status: item.status.nome,
          insumos: item.insumos
        };
      });
    };

      setDadosFiltrados(transformarDados);
  }, [filtro, items, loading, error]);

  return (
      <CSmartTable
        cleaner
        onClean={() => limparFiltro()}
        clickableRows
        columns={columns}
        columnSorter
        items={items}
        itemsPerPageSelect
        itemsPerPage={5}
        pagination
        onTableFilterChange={(value) => {
          if (value === "") {
            limparFiltro();
          }
        }}
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
                    toggleDetails(item.codigo_cotacao)
                  }}
                >
                  {details.includes(item.codigo_cotacao) ? 'Fechar' : 'Visualizar'}
                </CButton>
              </td>
            )
          },
          details: (item) => {
            return (
              <CCollapse visible={details.includes(item.codigo_cotacao)}>
                <div className="p-3">
                <h4>{item.codigo_cotacao}</h4>
        <p className="text-body-secondary">Fornecedor: {item.fornecedor_id}</p>
        <p className="text-body-secondary">Data Validade: {item.data_validade}</p>
                  <p className="text-body-secondary">Solicitado por: {item.criado_por}</p>
                  <p className="text-body-secondary">Nota Fiscal: 
                    <CCol xs={4}>
                      <CFormInput
                        type="text"
                        id="exampleFormControlInput1"
                        aria-describedby="exampleFormControlInputHelpInline"
                      />
                    </CCol>
                  </p>
                  <p className="text-body-secondary">Insumos: {item.insumos.length}</p>

                  <CForm className="row g-3">
                    <CTable>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell scope="col" style={{width:'5%'}}>#</CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{width:'10%'}}>Insumo</CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{width:'30%'}}>Variedade</CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{width:'5%'}}>Quantidade</CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{width:'10%'}}>Preço</CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{width:'10%'}}>Imposto</CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{width:'10%'}}>Desconto</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {
                          item.insumos && item.insumos.map((insumo, index) => (
                            <CTableRow key={index}>
                              <CTableHeaderCell scope="row">1</CTableHeaderCell>
                              <CTableDataCell>{insumo.nome}</CTableDataCell>
                              <CTableDataCell>{insumo.variedade} - {insumo.quantidade}g</CTableDataCell>
                              <CTableDataCell>
                                  <CFormInput
                                    type="number"
                                    value={insumo.pivot.quantidade}
                                    id="exampleFormControlInput1"
                                    aria-describedby="exampleFormControlInputHelpInline"
                                  />
                              </CTableDataCell>
                              <CTableDataCell>
                                  <CFormInput
                                    type="text"
                                    value={insumo.preco}
                                    id="exampleFormControlInput1"
                                    aria-describedby="exampleFormControlInputHelpInline"
                                  />
                                </CTableDataCell>
                              <CTableDataCell>
                                  <CFormInput
                                    type="text"
                                    value={insumo.pivot.imposto}
                                    id="exampleFormControlInput1"
                                    aria-describedby="exampleFormControlInputHelpInline"
                                  />
                              </CTableDataCell>
                              <CTableDataCell>
                                  <CFormInput
                                    type="text"
                                    value={insumo.pivot.desconto}
                                    id="exampleFormControlInput1"
                                    aria-describedby="exampleFormControlInputHelpInline"
                                  />
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        }
                    
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
        tableFilterPlaceholder='buscar por...'
        tableFilterLabel='Filtro'
        tableFilterValue={filtro === 'todos' ? '' : filtro}
        itemsPerPageLabel='Pedidos por página'
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

export default GerenciadorPedidos;