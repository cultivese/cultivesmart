import React, { useState, useMemo, useEffect } from 'react';
import { AvisoCotacao } from 'src/components';
import {
  CButton,
  CCard,
  CCardBody,
  CTable,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
  CRow,
  CCardTitle,
  CCardText,
  CCardSubtitle,
  CCardImage,
  CForm,
} from '@coreui/react';
import { DocsExample, EstoqueArea } from 'src/components';
import { OrcamentoArea } from '../../components';

const CadastroSemeaduraBerta = () => {
  const [insumos, setInsumos] = useState([]);
  const [insumosCotacao, setInsumosCotacao] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroFornecedor, setFiltroFornecedor] = useState('');

  const adicionarInsumoCotacao = (insumo) => {
    setInsumosCotacao((prevInsumosCotacao) => {
      const precoString = typeof insumo.preco === 'string' ? insumo.preco : '0';
      const precoNumerico = parseFloat(precoString.replace(/[^\d]/g, '')) / 100 || 0;
      const impostoString = typeof insumo.imposto === 'string' ? insumo.imposto : '0';
      const impostoNumerico = parseFloat(impostoString.replace(/[^\d]/g, '')) / 100 || 0;
      const descontoString = typeof insumo.desconto === 'string' ? insumo.desconto : '0';
      const descontoNumerico = parseFloat(descontoString.replace(/[^\d]/g, '')) / 100 || 0;
      const novoInsumo = {
        ...insumo,
        preco: precoNumerico,
        quantidade_estoque: 1,
        imposto: impostoNumerico,
        desconto: descontoNumerico,
      };
      return [...prevInsumosCotacao, novoInsumo];
    });
  };

  const formatarPreco = (valor) => {
    if (typeof valor === 'number') {
      return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    if (typeof valor === 'string') {
      const numero = parseFloat(valor.replace(',', '.'));
      if (!isNaN(numero)) {
        return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      }
    }
    return 'R$ 0,01';
  };

  // Função para extrair valor numérico de string formatada em moeda
  const extrairNumero = (valorFormatado) => {
    if (typeof valorFormatado === 'number') return valorFormatado;
    if (!valorFormatado) return 0;
    // Remove R$, pontos e troca vírgula por ponto
    return parseFloat(valorFormatado.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.')) || 0;
  };

  useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/categorias')
      .then((response) => response.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error('Erro ao buscar categorias:', error));
  }, []);

  useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/estoque')
      .then((response) => response.json())
      .then((data) => setInsumos(data))
      .catch((error) => console.error('Erro ao buscar insumos:', error));
  }, []);

  useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/fornecedores')
      .then((response) => response.json())
      .then((data) => setFornecedores(data))
      .catch((error) => console.error('Erro ao buscar fornecedores:', error));
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('https://backend.cultivesmart.com.br/api/unidades-medida');
        setUnidadesMedida(await response.json());
      } catch (error) {
        console.error('Erro ao buscar unidades de medida:', error);
      }
    };
    loadData();
  }, []);

  const limparFiltros = () => {
    setFiltroNome('');
    setFiltroFornecedor('');
    setFiltroCategoria('');
  };

  const calcularTotal = () => {
    return insumosCotacao.reduce((total, insumo) => total + insumo.preco * (insumo.quantidade_estoque || 0), 0);
  };

  // Corrige o cálculo do total para somar todos os custos totais dos itens
  const calcularTotalOrcamento = () => {
    return items.reduce((total, item) => total + extrairNumero(item.preco_total), 0);
  };

  const calcularCustoPorBandeja = (insumo) => {
    const especificacao = insumo.especificacoes && insumo.especificacoes.length > 0 ? insumo.especificacoes[0] : null;
    const totalLiquido = insumo.total_liquido || insumo.preco_total_liquido || insumo.preco_total || insumo.preco || 0;
    const quantidadeTotal = (insumo.quantidade_total || (insumo.quantidade_sacos && insumo.quantidade && insumo.quantidade_sacos * insumo.quantidade) || insumo.quantidade || 1);
    const quantidadeBandeja = especificacao?.quantidade_bandeja || especificacao?.gramas_para_plantio || 0;
    const custoPorGrama = (parseFloat(totalLiquido) && parseFloat(quantidadeTotal)) ? parseFloat(totalLiquido) / parseFloat(quantidadeTotal) : 0;
    const custoPorBandeja = custoPorGrama * parseFloat(quantidadeBandeja);
    return isNaN(custoPorBandeja) ? 0 : custoPorBandeja;
  };

  const items = useMemo(() => {
    const fornecedoresLookup = fornecedores.records && fornecedores.records.reduce((acc, fornecedor) => {
      acc[fornecedor.id] = fornecedor;
      return acc;
    }, {});
    return insumosCotacao.map((insumo) => {
      const insumoCompleto = insumos.records && insumos.records.find(i => i.id === insumo.id);
      const custoPorBandeja = calcularCustoPorBandeja(insumoCompleto || insumo);
      const precoTotal = custoPorBandeja * (insumo.quantidade_estoque || 0);
      const fornecedor = fornecedoresLookup[insumo.fornecedor_id];
      return {
        fornecedor: fornecedor ? fornecedor.nome : 'Fornecedor não encontrado',
        nome: insumo.nome,
        variedade: insumo.variedade,
        quantidade_estoque: insumo.quantidade_estoque,
        preco: formatarPreco(custoPorBandeja),
        preco_total: formatarPreco(precoTotal),
        _cellProps: { nome: { scope: 'row' } },
      };
    });
  }, [insumosCotacao, fornecedores, insumos]);

  const incrementar = (insumo) => {
    setInsumosCotacao((prevInsumos) =>
      prevInsumos.map((item) =>
        item.id === insumo.id ? { ...item, quantidade_estoque: (item.quantidade_estoque || 0) + 1 } : item
      )
    );
  };

  const decrementar = (insumo) => {
    setInsumosCotacao((prevInsumos) =>
      prevInsumos.reduce((acc, item) => {
        if (item.id === insumo.id) {
          if ((item.quantidade_estoque || 0) > 1) {
            acc.push({ ...item, quantidade_estoque: item.quantidade_estoque - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  const columns = [
    { key: 'nome', label: 'Insumo' },
    { key: 'variedade', label: 'Variedade' },
    { key: 'quantidade_estoque', label: 'Qtd.' },
    { key: 'preco', label: 'Custo por Bandeja' },
    { key: 'preco_total', label: 'Custo Total' },
  ];

  return (
    <CContainer>
      <AvisoCotacao href="components/buttons/" />
      <CForm className="row g-3">
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Plantio - </strong>
              <small>Cadastro de Semeadura</small>
            </CCardHeader>
            <CCardBody>
              <DocsExample href="components/card/#background-and-color">
                <CRow className="align-items-center justify-content-center mb-4" xs={{ gutterY: 5 }}>
                  {categorias && categorias.records && categorias.records.map((categoria) => (
                    <CCol key={categoria.id} lg={2} md={3} sm={4} xs={6} style={{ marginBottom: 16 }}>
                      <div
                        onClick={() => setFiltroCategoria(categoria.id)}
                        style={{
                          width: 160,
                          height: 200,
                          border: filtroCategoria === categoria.id ? '2px solid #4f8cff' : '2px solid #e0e0e0',
                          borderRadius: 16,
                          boxShadow: '0 2px 8px #0001',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          background: '#fff',
                          transition: 'box-shadow 0.2s, border-color 0.2s',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.boxShadow = '0 4px 16px #0002';
                          e.currentTarget.style.borderColor = '#4f8cff';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.boxShadow = '0 2px 8px #0001';
                          e.currentTarget.style.borderColor = filtroCategoria === categoria.id ? '#4f8cff' : '#e0e0e0';
                        }}
                      >
                        <img src={`data:image/png;base64,${categoria.logoPath}`} alt={categoria.descricao} style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 16, transition: 'transform 0.2s' }} />
                        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16 }}>{categoria.descricao}</div>
                      </div>
                    </CCol>
                  ))}
                </CRow>
                <CRow className="align-items-center justify-content-center mb-4" xs={{ gutterY: 5 }}>
                  <CCol>
                    <CFormInput
                      type="text"
                      size="lg"
                      placeholder="Nome..."
                      aria-label="lg input example"
                      value={filtroNome}
                      onChange={(e) => setFiltroNome(e.target.value)}
                    />
                  </CCol>
                  <CCol>
                    <CFormSelect
                      size="lg"
                      aria-label="Large select example"
                      value={filtroFornecedor}
                      onChange={(e) => setFiltroFornecedor(e.target.value)}
                    >
                      <option>Escolha o fornecedor...</option>
                      {fornecedores &&
                        fornecedores.records &&
                        fornecedores.records.length > 0 &&
                        fornecedores.records.map((fornecedor) => (
                          <option key={fornecedor.id} value={fornecedor.id}>
                            {fornecedor.nome}
                          </option>
                        ))}
                    </CFormSelect>
                  </CCol>
                  <CCol>
                    <CButton color="secondary" onClick={limparFiltros}>Limpar filtros</CButton>
                  </CCol>
                </CRow>
              </DocsExample>
              <div style={{ marginTop: '1rem', marginBottom: '1rem' }}></div>
              <CRow>
                <EstoqueArea href="components/card/#background-and-color">
                  <CRow xs={{ gutterY: 3 }} className="align-items-center justify-content-between mb-4">
                    {insumos && insumos.records && insumos.records
                      .filter((estoque) => {
                        const nomeMatch = !filtroNome || estoque.insumo.nome.toLowerCase().includes(filtroNome.toLowerCase());
                        const fornecedorMatch = !filtroFornecedor || estoque.insumo.fornecedor_id === parseInt(filtroFornecedor);
                        const categoriaMatch = !filtroCategoria || estoque.insumo.categoria_id === parseInt(filtroCategoria);
                        return categoriaMatch && nomeMatch && fornecedorMatch;
                      })
                      .map((estoque) => {
                        const quantidadeTotalDisponivel = estoque.insumo.quantidade;
                        const quantidadePorSaco = estoque.insumo.quantidade;
                        const quantidadeTotalSacos = 5;
                        const capacidadeMaximaTotal = parseFloat(quantidadeTotalSacos) * parseFloat(quantidadePorSaco);
                        let percentualEmEstoque = 0;
                        if (capacidadeMaximaTotal > 0) {
                          percentualEmEstoque = (parseFloat(quantidadeTotalDisponivel) / capacidadeMaximaTotal) * 100;
                        }
                        const valorBarraProgresso = Math.round(percentualEmEstoque);
                        let corBarraProgresso = 'success';
                        if (valorBarraProgresso < 30) {
                          corBarraProgresso = 'danger';
                        } else if (valorBarraProgresso < 60) {
                          corBarraProgresso = 'warning';
                        }
                        return (
                          <CCard style={{ width: '26%', minWidth: 320, borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} key={estoque.insumo.id} className="mb-4">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: 16 }}>
                              <CCardImage src={`data:image/png;base64,${estoque.insumo.logoPath}`} style={{ width: 100, height: 120, objectFit: 'contain', marginRight: 16 }} />
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }}>
                                <CCardTitle style={{ fontSize: 22, fontWeight: 600, textAlign: 'left', marginBottom: 2 }}>{estoque.insumo.nome}</CCardTitle>
                                <CCardSubtitle style={{ fontSize: 15, fontWeight: 400, textAlign: 'left', marginBottom: 2 }}>{estoque.insumo.variedade}</CCardSubtitle>
                                <CCardText style={{ fontSize: 14, textAlign: 'left', marginBottom: 2, color: '#555' }}>{(() => {
                                  const fornecedorObj = fornecedores && fornecedores.records && fornecedores.records.find(f => f.id === estoque.insumo.fornecedor_id);
                                  return fornecedorObj ? fornecedorObj.nome : estoque.insumo.fornecedor_id;
                                })()}</CCardText>
                                <div style={{ fontSize: 15, color: '#4f8cff', margin: '4px 0 10px 0', fontWeight: 500 }}>
                                  Custo por bandeja: <b>{(() => {
                                    const custo = calcularCustoPorBandeja(estoque.insumo);
                                    return formatarPreco(custo);
                                  })()}</b>
                                </div>
                              </div>
                            </div>
                            <CCardBody style={{ paddingTop: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                                <div style={{ fontSize: 15, color: '#888' }}>Bandejas para plantio:</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <CButton size="sm" color="danger" style={{ minWidth: 32 }} onClick={() => decrementar(insumo)} disabled={!(insumosCotacao.find(item => item.id === estoque.insumo.id)?.quantidade_estoque > 0)}>-</CButton>
                                  <CFormInput
                                    type="number"
                                    value={insumosCotacao.find(item => item.id === estoque.insumo.id)?.quantidade_estoque || 0}
                                    min={0}
                                    style={{ width: 50, textAlign: 'center', fontWeight: 600 }}
                                    readOnly
                                  />
                                  <CButton size="sm" color="success" style={{ minWidth: 32 }} onClick={() => {
                                    if (insumosCotacao.some(item => item.id === estoque.insumo.id)) {
                                      incrementar(estoque.insumo);
                                    } else {
                                      adicionarInsumoCotacao(estoque.insumo);
                                    }
                                  }}>+</CButton>
                                </div>
                              </div>
                            </CCardBody>
                          </CCard>
                        );
                      })}
                  </CRow>
                </EstoqueArea>
                <OrcamentoArea href="components/card/#background-and-color">
                  <CCol xs={12} style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
                    <CCard>
                      <CCardBody>
                        <CCardTitle>Plantio</CCardTitle>
                        <CCardText>
                          Produtos selecionados:
                          <CTable columns={columns} items={items} style={{ padding: 0 }} />
                          <strong>Total:</strong> {formatarPreco(calcularTotalOrcamento())}
                        </CCardText>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </OrcamentoArea>
                <div style={{ marginTop: '1.5em', display: 'flex', justifyContent: 'flex-end' }}>
                  <CButton
                    color={insumosCotacao.length <= 0 ? 'default' : 'success'}
                    className="rounded-0"
                    disabled={insumosCotacao.length <= 0}
                  >
                    Gerar Cotação
                  </CButton>
                </div>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CForm>
    </CContainer>
  );
};

export default CadastroSemeaduraBerta;