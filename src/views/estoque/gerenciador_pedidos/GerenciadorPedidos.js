import React, { useState, useEffect } from 'react'
import { CAvatar, CBadge, CButton, CCollapse, CSmartTable } from '@coreui/react-pro'
import { useSearchParams, useNavigate } from "react-router-dom";
import {
CCardImage,
CSpinner,
CFormInput,
CForm,
CTable,
CTableHead,
CTableRow,
CTableHeaderCell,
CTableBody,
CTableDataCell, 
CCol,
CRow,
CFormLabel
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


const GerenciadorPlantios = () => {
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
  const [isProcessing, setIsProcessing] = useState(false)
  const [totalDescontoValues, setTotalDescontoValues] = useState({}); // Novo estado para o total de desconto da cotação
  const [valorTotalLiquidoValues, setValorTotalLiquidoValues] = useState({}); // Novo estado para Valor Total Líquido

  const columns = [
    { key: 'id', _style: { width: '10%' }, label: 'Id' },
    { key: 'nota_fiscal', _style: { width: '15%' }, label: 'Nota Fiscal'},
    { key: 'nome_fornecedor', _style: { width: '20%' }, label: 'Fornecedor'},
    { key: 'data_validade', _style: { width: '15%' }, label: 'Data Validade' },
    { key: 'total_bruto', _style: { width: '15%' }, label: 'Total Bruto' },
    { key: 'icms', _style: { width: '15%' }, label: 'ICMS' },
    { key: 'desconto', _style: { width: '15%' }, label: 'Total Desconto' },
    { key: 'total_liquido', _style: { width: '15%' }, label: 'Total Líquido' },
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

  // Função para calcular o Valor Total Líquido
  const calculateValorTotalLiquido = (quantidade, precoUnitario, imposto, desconto) => {
    const qty = parseFloat(quantidade || 0);
    const preco = parseFloat(precoUnitario || 0);
    const icms = parseFloat(imposto || 0); // Renomeado para imposto para corresponder ao campo
    const desc = parseFloat(desconto || 0);
    const total_bruto = qty * preco;
    return total_bruto + icms - desc;
  };

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
              id: item.id,
              nota_fiscal: item.nota_fiscal,
              data_validade: item.data_validade,
              total_bruto: item.total_bruto,
              icms: item.icms,
              desconto: item.desconto,
              total_liquido: item.total_liquido,
              nome_fornecedor: item.fornecedor.nome, // Alterado de 'nome' para 'nome_fornecedor' para corresponder à coluna
              logoPath: item.fornecedor.logo_base64,
              cnpj: item.fornecedor.cnpj,
              cep: item.fornecedor.cep,
              endereco: item.fornecedor.endereco,
              numero: item.fornecedor.numero,
              bairro: item.fornecedor.bairro,
              estado: item.fornecedor.estado,
              cidade: item.fornecedor.cidade,
              telefone: item.fornecedor.telefone,
              email: item.fornecedor.email,
              status: item.status,
              insumos: item.cotacao_insumos.map(insumo => ({
                ...insumo,
                // Inicializa o valor total líquido para cada insumo
                valor_total_liquido: calculateValorTotalLiquido(insumo.quantidade, insumo.preco_unitario, insumo.icms, insumo.desconto)
              }))
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
    // Este useEffect precisa ser ajustado. `items.cotacao_insumos` não existe, é `item.insumos` dentro do loop da tabela.
    // Se a intenção é buscar a quantidade de insumos, isso deve ser feito para cada insumo individualmente, ou os dados já devem vir na requisição principal.
    // Por enquanto, vou comentar essa parte, pois a API já deve retornar a quantidade.
    /*
    if (items.cotacao_insumos) {
        items.cotacao_insumos.forEach(async (insumo) => {
            const quantidade = await fetchInsumoQuantidade(insumo.id);
            setInsumoQuantidades(prevQuantidades => ({
                ...prevQuantidades,
                [insumo.id]: quantidade
            }));
        });
    }
    */
  }, [items]);


  const limparFiltro = () => {
    setSearchParams({ filtro: "todos" });
    navigate("?"); // Atualiza a URL sem recarregar a página
  };

  useEffect(() => {
    if (loading) return;
    if (error) return;

    // Esta função `transformarDados` é desnecessária aqui se os `items` já estão transformados no primeiro `useEffect`.
    // Vou remover a lógica de transformação, pois `setDadosFiltrados` provavelmente deve apenas filtrar os `items` existentes.
    const filteredItems = filtro === "todos" 
      ? items 
      : items.filter(item => item.status.nome.toLowerCase().includes(filtro.toLowerCase()));
    setDadosFiltrados(filteredItems);

  }, [filtro, items, loading, error]);

  const handleRejeitar = async (item) => {
    setIsProcessing(true); // Começa o processamento

    try{
      const response = await fetch(`https://backend.cultivesmart.com.br/api/cotacao/${item.id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Cotação atualizada com sucesso:", data);

    } catch (err) {
      console.error("Erro ao atualizar cotação:", err);
    } finally {
      setIsProcessing(false); // Finaliza o processamento
      window.location.reload(); // Recarrega a página após a operação
    }
  }

  const handleAprovar = async (item) => {
    const insumosAtualizados = item.insumos.map(insumo => {
      // Usar os valores do estado insumoValues se existirem, caso contrário, usar os valores originais do insumo
      const quantidade = parseFloat(insumoValues[`${item.id}-${insumo.insumo_id}-quantidade`] || insumo.quantidade);
      const preco_unitario = parseFloat(insumoValues[`${item.id}-${insumo.insumo_id}-preco`] || insumo.preco_unitario);
      const icms = parseFloat(insumoValues[`${item.id}-${insumo.insumo_id}-imposto`] || insumo.icms);
      const desconto = parseFloat(insumoValues[`${item.id}-${insumo.insumo_id}-desconto`] || insumo.desconto);

      return {
        ...insumo,
        quantidade: quantidade,
        preco_unitario: preco_unitario,
        icms: icms,
        desconto: desconto,
        // O valor_total_liquido não precisa ser enviado para a API se for um campo calculado no frontend,
        // mas se a API espera, você pode incluí-lo aqui.
        // Por segurança, a API deve fazer seu próprio cálculo para evitar inconsistências.
      };
    });

    try {
      setIsProcessing(true);

      const payload = JSON.stringify({
          nota_fiscal: notaFiscalValues[item.id],
          approved: true,
          insumos: insumosAtualizados,
        })

      const response = await fetch(`http://localhost:61773/api/cotacao/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Cotação atualizada com sucesso:", data);

    } catch (err) {
      console.error("Erro ao atualizar cotação:", err);
    } finally {
      setIsProcessing(false);
      window.location.reload();
    }
  }

  // Esta função não parece ser usada em nenhum lugar no código atual.
  // Se ela for necessária para buscar a quantidade de insumos, precisaria ser chamada dentro do loop para cada insumo.
  /*
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
  */

  const handleInputChange = (item, insumo, field, value) => {
    // 1. Atualiza o estado insumoValues para o campo específico
    setInsumoValues(prevValues => ({
      ...prevValues,
      [`${item.id}-${insumo.insumo_id}-${field}`]: value
    }));

    // 2. Obtém os valores atuais dos campos para o cálculo,
    //    priorizando o novo 'value' para o campo que está sendo alterado.
    const currentQuantidade = parseFloat(
      (field === 'quantidade' ? value : insumoValues[`${item.id}-${insumo.insumo_id}-quantidade`]) || insumo.quantidade
    );
    const currentPrecoUnitario = parseFloat(
      (field === 'preco' ? value : insumoValues[`${item.id}-${insumo.insumo_id}-preco`]) || insumo.preco_unitario
    );
    const currentImposto = parseFloat(
      (field === 'imposto' ? value : insumoValues[`${item.id}-${insumo.insumo_id}-imposto`]) || insumo.icms
    );
    const currentDesconto = parseFloat(
      (field === 'desconto' ? value : insumoValues[`${item.id}-${insumo.insumo_id}-desconto`]) || insumo.desconto
    );

    // 3. Calcula o novo valor total líquido com os valores atualizados
    const newValorTotalLiquido = calculateValorTotalLiquido(currentQuantidade, currentPrecoUnitario, currentImposto, currentDesconto);
    
    // 4. Atualiza o estado de valorTotalLiquidoValues
    setValorTotalLiquidoValues(prevValues => ({
      ...prevValues,
      [`${item.id}-${insumo.insumo_id}-valorTotalLiquido`]: newValorTotalLiquido
    }));
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
                    toggleDetails(item.id)
                  }}
                >
                  {details.includes(item.id) ? 'Fechar' : 'Visualizar'}
                </CButton>
              </td>
            )
          },
          details: (item) => {
            return (
              <CCollapse visible={details.includes(item.id)}>
              <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                
                {/* Seção de Dados do Fornecedor */}
                <h5 className="mb-3">Dados do Fornecedor</h5>
                <CRow className="mb-2">
                   <CCol md={3} className="d-flex align-items-center">
                    {/* Foto do Fornecedor */}
                    <CCardImage src={`data:image/png;base64,${item.logoPath}`} />
                  </CCol>
                  <CCol md={6}>
                    <CRow className="mb-2">
                      <strong>Fornecedor:</strong>
                      <p className="text-body-secondary mb-0">{item.nome_fornecedor}</p> {/* Alterado para nome_fornecedor */}
                    </CRow>
                    <CRow className="mb-2">
                      <strong>CNPJ:</strong>
                      <p className="text-body-secondary">{item.cnpj}</p>
                    </CRow>
                    <CRow className="mb-2">
                      <CCol md={6}>
                        <strong>Endereço:</strong>
                        <p className="text-body-secondary">{`${item.endereco}, ${item.numero}`}</p>
                      </CCol>
                      <CCol md={3}>
                        <strong>Bairro:</strong>
                        <p className="text-body-secondary">{item.bairro}</p>
                      </CCol>
                      <CCol md={3}>
                        <strong>CEP:</strong>
                        <p className="text-body-secondary">{item.cep}</p>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                    <CCol md={6}>
                      <strong>Cidade / UF:</strong>
                      <p className="text-body-secondary">{`${item.cidade} / ${item.estado}`}</p>
                    </CCol>
                    <CCol md={6}>
                      <strong>Contato:</strong>
                      <p className="text-body-secondary">{`${item.telefone} | ${item.email}`}</p>
                    </CCol>
                  </CRow>

                  </CCol>
                </CRow>
                
                  

                <hr className="my-4" />

                {/* Seção de Informações da Cotação */}
                <h5 className="mb-3">Informações da Cotação</h5>
                <CRow className="align-items-end">
                    <CCol md={4}>
                        <strong>Data de Validade:</strong>
                        <p className="text-body-secondary">{item.data_validade}</p>
                    </CCol>
                    <CCol md={4}>
                        <strong>Solicitado por:</strong>
                        <p className="text-body-secondary">{item.criado_por || 'Não informado'}</p>
                    </CCol>
                    <CCol md={4}>
                        <CFormLabel htmlFor={`notaFiscal-${item.id}`}><strong>Nota Fiscal:</strong></CFormLabel>
                        <CFormInput
                            type="text"
                            id={`notaFiscal-${item.id}`}
                            value={notaFiscalValues[item.id] || item.nota_fiscal || ''}
                            onChange={(e) => setNotaFiscalValues({ ...notaFiscalValues, [item.id]: e.target.value })}
                            disabled={item.status.id !== 1}
                        />
                    </CCol>
                </CRow>
                
                <hr className="my-4" />

                {/* Tabela de Insumos */}
                <h5 className="mb-3">Insumos</h5>
                <CForm className="row g-3">
                  <CTable>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col" style={{width:'5%'}}>#</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{width:'20%'}}>Descrição do Insumo</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{width:'5%'}}>Quantidade</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{width:'5%'}}>Valor Unitário</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{width:'5%'}}>ICMS</CTableHeaderCell> {/* Alterado de "Desconto (R$)" para "ICMS" */}
                        <CTableHeaderCell scope="col" style={{width:'5%'}}>Desconto (R$)</CTableHeaderCell> {/* Alterado de "ICMS" para "Desconto (R$)" */}
                        <CTableHeaderCell scope="col" style={{width:'6%'}}>Valor Total Liq.</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {
                        item.insumos && item.insumos.map((insumo, index) => (
                          <CTableRow key={index}>
                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                            <CTableDataCell>{insumo.insumo.nome} - {insumo.insumo.variedade}</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                type="number"
                                value={insumoValues[`${item.id}-${insumo.insumo_id}-quantidade`] !== undefined 
                                         ? insumoValues[`${item.id}-${insumo.insumo_id}-quantidade`] 
                                         : insumo.quantidade}
                                onChange={(e) => handleInputChange(item, insumo, 'quantidade', e.target.value)}
                                disabled={item.status.id !== 1}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                type="number" // Alterado para number
                                value={insumoValues[`${item.id}-${insumo.insumo_id}-preco`] !== undefined 
                                         ? insumoValues[`${item.id}-${insumo.insumo_id}-preco`] 
                                         : insumo.preco_unitario}
                                onChange={(e) => handleInputChange(item, insumo, 'preco', e.target.value)}
                                disabled={item.status.id !== 1}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                type="number" // Alterado para number
                                value={insumoValues[`${item.id}-${insumo.insumo_id}-imposto`] !== undefined 
                                         ? insumoValues[`${item.id}-${insumo.insumo_id}-imposto`] 
                                         : insumo.icms}
                                onChange={(e) => handleInputChange(item, insumo, 'imposto', e.target.value)}
                                disabled={item.status.id !== 1}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                type="number" // Alterado para number
                                value={insumoValues[`${item.id}-${insumo.insumo_id}-desconto`] !== undefined 
                                         ? insumoValues[`${item.id}-${insumo.insumo_id}-desconto`] 
                                         : insumo.desconto}
                                onChange={(e) => handleInputChange(item, insumo, 'desconto', e.target.value)}
                                disabled={item.status.id !== 1}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                type="text"
                                value={(valorTotalLiquidoValues[`${item.id}-${insumo.insumo_id}-valorTotalLiquido`] !== undefined
                                        ? valorTotalLiquidoValues[`${item.id}-${insumo.insumo_id}-valorTotalLiquido`]
                                        : insumo.valor_total_liquido
                                        ).toFixed(2)} 
                                readOnly // Torna o campo somente leitura
                                disabled={item.status.id !== 1}
                              />
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      }
                    </CTableBody>
                  </CTable>
                </CForm>
                
                {/* Botões de Ação */}
                {item.status.id === 1 && (
                  <div className="mt-4">
                    <CButton size="sm" color="info" onClick={() => handleAprovar(item)} disabled={isProcessing}>
                      { isProcessing ? <CSpinner as="span" className="me-2" size="sm" aria-hidden="true" /> : null  }
                      Aprovar
                    </CButton>
                    <CButton size="sm" color="danger" className="ms-1" onClick={() => handleRejeitar(item)} disabled={isProcessing}>
                      { isProcessing ? <CSpinner as="span" className="me-2" size="sm" aria-hidden="true" /> : null  }
                      Rejeitar
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

export default GerenciadorPlantios;