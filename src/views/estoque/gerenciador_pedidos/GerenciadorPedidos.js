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
  const [insumoValues, setInsumoValues] = useState({});
  const [notaFiscalValues, setNotaFiscalValues] = useState({}); // Novo estado para nota_fiscal
  const [insumoQuantidades, setInsumoQuantidades] = useState({}); // Estado para armazenar as quantidades dos insumos

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
              status: item.status,
              insumos: item.cotacao_insumos
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

  
  useEffect(() => {
    if (items.cotacao_insumos) {
        items.cotacao_insumos.forEach(async (insumo) => {
            const quantidade = await fetchInsumoQuantidade(insumo.id);
            setInsumoQuantidades(prevQuantidades => ({
                ...prevQuantidades,
                [insumo.id]: quantidade
            }));
        });
    }
  }, [items.cotacao_insumos]);


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
          status: item.status,
          insumos: item.cotacao_insumos
        };
      });
    };

      setDadosFiltrados(transformarDados);
  }, [filtro, items, loading, error]);

  const handleAprovar = async (item) => {
    const insumosAtualizados = item.insumos.map(insumo => {
      return {
        ...insumo,
        quantidade: insumoValues[`${item.codigo_cotacao}-${insumo.insumo_id}-quantidade`] || insumo.quantidade,
        preco: insumoValues[`${item.codigo_cotacao}-${insumo.insumo_id}-preco`] || insumo.preco_unitario,
        imposto: insumoValues[`${item.codigo_cotacao}-${insumo.insumo_id}-imposto`] || insumo.imposto,
        desconto: insumoValues[`${item.codigo_cotacao}-${insumo.insumo_id}-desconto`] || insumo.desconto,
      };
    });

    try {
      const response = await fetch(`https://backend.cultivesmart.com.br/api/cotacao/${item.codigo_cotacao}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          insumos: insumosAtualizados,
          nota_fiscal: notaFiscalValues[item.codigo_cotacao], // Inclui nota_fiscal no mesmo nível
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Cotação atualizada com sucesso:", data);
  
      // Atualize o estado local (items) com os novos dados, se necessário
      // Por exemplo, você pode buscar os dados atualizados da API novamente
  
    } catch (err) {
      console.error("Erro ao atualizar cotação:", err);
      // Trate o erro adequadamente (exibir mensagem de erro, etc.)
    }
  }

  const fetchInsumoQuantidade = async (insumoId) => {
    try {
        const response = await fetch(`https://backend.cultivesmart.com.br/api/insumos/${insumoId}`);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        return data.quantidade; // Assumindo que a resposta da API contém o campo 'quantidade'
    } catch (error) {
        console.error('Erro ao buscar quantidade do insumo:', error);
        return null; // Retorna null em caso de erro
    }
  };


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
              <CBadge color={getBadge(item.status.nome)}>{item.status.nome}</CBadge>
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
                          value={item.nota_fiscal}
                          onChange={(e) => setNotaFiscalValues({ ...notaFiscalValues, [item.codigo_cotacao]: e.target.value })}
                          disabled={item.status.id !== 1}
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
                              <CTableDataCell>{insumo.insumo.nome}</CTableDataCell>
                              <CTableDataCell>{insumo.insumo.variedade} - {insumo.insumo.quantidade}g</CTableDataCell>
                              <CTableDataCell>
                              <CFormInput
                                type="number"
                                value={insumoValues[`${item.codigo_cotacao}-${insumo.insumo_id}-quantidade`] || insumo.quantidade}
                                onChange={(e) => setInsumoValues({ ...insumoValues, [`${item.codigo_cotacao}-${insumo.insumo_id}-quantidade`]: e.target.value })}
                                id="exampleFormControlInput1"
                                aria-describedby="exampleFormControlInputHelpInline"
                                disabled={item.status.id !== 1}
                              />
                              </CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  type="text"
                                  value={insumoValues[`${item.codigo_cotacao}-${insumo.id}-preco`] || insumo.preco_unitario}
                                  onChange={(e) => setInsumoValues({ ...insumoValues, [`${item.codigo_cotacao}-${insumo.id}-preco`]: e.target.value })}
                                  id="exampleFormControlInput1"
                                  aria-describedby="exampleFormControlInputHelpInline"
                                  disabled={item.status.id !== 1}
                                />
                              </CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  type="text"
                                  value={insumoValues[`${item.codigo_cotacao}-${insumo.id}-imposto`] || insumo.imposto}
                                  onChange={(e) => setInsumoValues({ ...insumoValues, [`${item.codigo_cotacao}-${insumo.id}-imposto`]: e.target.value })}
                                  id="exampleFormControlInput1"
                                  aria-describedby="exampleFormControlInputHelpInline"
                                  disabled={item.status.id !== 1}
                                />
                              </CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  type="text"
                                  value={insumoValues[`${item.codigo_cotacao}-${insumo.id}-desconto`] || insumo.desconto}
                                  onChange={(e) => setInsumoValues({ ...insumoValues, [`${item.codigo_cotacao}-${insumo.id}-desconto`]: e.target.value })}
                                  id="exampleFormControlInput1"
                                  aria-describedby="exampleFormControlInputHelpInline"
                                  disabled={item.status.id !== 1}
                                />
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        }
                    
                      </CTableBody>
                    </CTable>
                  </CForm>
                  {item.status.id === 1 && (
                    <div>
                      <CButton size="sm" color="info" onClick={() => handleAprovar(item)}>
                        Aprovar
                      </CButton>
                      <CButton size="sm" color="danger" className="ms-1">
                        Cancelar
                      </CButton>
                    </div>
                  )}
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