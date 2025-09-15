import React, { useState, useMemo, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { AvisoCotacao } from 'src/components'
import {
  cilCaretTop,
  cilCaretBottom,
  cilCart,
  cilPrint,
  cilSave,
  cilWarning
} from '@coreui/icons'
import {
  CAlert,
  CAlertHeading,
  CButton,
  CCard,
  CSpinner,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCardHeader,
  CCol,
  CBadge,
  CContainer,
  CFormCheck,
  CCardImage,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCardTitle,
  CCardText,
  CCardSubtitle,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModal,
  CModalFooter
} from '@coreui/react';
import { DocsExample, EstoqueArea } from 'src/components'
import { OrcamentoArea } from '../../../components';
import CryptoJS from 'crypto-js'; // Importe a biblioteca crypto-js

const SimularCotacao = () => {
  
  const [insumos, setInsumos] = useState([]);  
  const [insumosCotacao, setInsumosCotacao] = useState([]);
  const [visible, setVisible] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [activeStep, setActiveStep] = useState(0);
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);  
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [unidadesMedida , setUnidadesMedida ] = useState([]);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroFornecedor, setFiltroFornecedor] = useState('');
  const [insumosSelecionadosModal, setInsumosSelecionadosModal] = useState([]);


  const [formData, setFormData] = useState({
    insumo_id: null,
    quantidade: 1,
  });

  const adicionarInsumoCotacao = (insumo) => {
    setInsumosCotacao((prevInsumosCotacao) => {
      const precoString = typeof insumo.preco === 'string' ? insumo.preco : '0';
      const precoNumerico = parseFloat(precoString.replace(/[^\d]/g, '') / 100) || 0;

      const impostoString = typeof insumo.imposto === 'string' ? insumo.imposto : '0';
      const impostoNumerico = parseFloat(impostoString.replace(/[^\d]/g, '') / 100) || 0;

      const descontoString = typeof insumo.desconto === 'string' ? insumo.desconto : '0';
      const descontoNumerico = parseFloat(descontoString.replace(/[^\d]/g, '') / 100) || 0;

      const novoInsumo = {
        ...insumo,
        preco: precoNumerico,
        quantidade_estoque: 1,
        imposto: impostoNumerico,
        desconto: descontoNumerico
      };
      const novoInsumosCotacao = [...prevInsumosCotacao, novoInsumo];
      return novoInsumosCotacao;
    });
  };

  const formatarPreco = (valor) => {
    if (typeof valor === 'number') {
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    }

    if (typeof valor === 'string') {
      // Tenta converter a string para um número
      const numero = parseFloat(valor.replace(',', '.')); // Substitui vírgula por ponto
  
      if (!isNaN(numero)) {
        return numero.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
      }
    }
    
    return 'R$ 0,01'; // Valor padrão se não for um número
};

  const getUnidadeMedidaDescricao = (id) => {
    const unidade = unidadesMedida && unidadesMedida.length > 0
    && unidadesMedida.find((u) => u.id === parseInt(id));
    return unidade ? unidade.sigla : '';
};

  useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/categorias')
      .then(response => response.json())
      .then(data => {
        setCategorias(data);
      })
      .catch(error => console.error('Erro ao buscar categorias:', error));
  }, []);

  useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/insumos')
      .then(response => response.json())
      .then(data => {
        setInsumos(data);
      })
      .catch(error => console.error('Erro ao buscar insumos:', error));
  }, []);

  useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/fornecedores')
      .then(response => response.json())
      .then(data => {
        setFornecedores(data);
      })
      .catch(error => console.error('Erro ao buscar fornecedores:', error));
  }, []);


  const limparFiltros = () => {
    setFiltroNome('');
    setFiltroFornecedor('');
    setFiltroCategoria(''); // Limpa o filtro de categoria
};

const handleConfirmarOrcamento = () => {
  setVisible(true);
};

const handlerSalvarCotacao = () => {

  const dataAtual = new Date();  
  const fornecedorId = insumosCotacao.length > 0 ? insumosCotacao[0].fornecedor_id : null;

  const imposto = 0; // Substitua pelo valor correto do imposto, se disponível
  const desconto = 0; // Substitua pelo valor correto do desconto, se disponível

  const insumosFormatados = insumosCotacao.map(insumo => ({
      insumo_id: insumo.id,
      quantidade: insumo.quantidade_estoque,
      preco_unitario: insumo.preco,
      imposto: insumo.imposto,
      desconto: insumo.desconto,
  }));

  const bodyJson = JSON.stringify({
      fornecedor_id: fornecedorId,
      insumos: insumosFormatados,
  });

  console.log(bodyJson);

  setIsProcessing(true);
  fetch('https://backend.cultivesmart.com.br/api/cotacao', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: bodyJson,
})
.then(response => {
    if (!response.ok) {
        throw new Error('Erro ao salvar cotação');
    }
    return response.json();
})
.then(data => {
    console.log('Cotação salva com sucesso:', data);
    setIsProcessing(false)
    setVisible(false);
    window.location.href = '/estoque/gerenciador_pedidos'; 
})
.catch(error => {
    console.error('Erro ao salvar cotação:', error);
    setIsProcessing(false)
    setVisible(false);
});
}

const gerarHashUnicoParaLista = () => {
  const insumosString = JSON.stringify(insumosCotacao);
  const hash = CryptoJS.SHA256(insumosString); // Use CryptoJS.SHA256
  const hashHex = hash.toString(CryptoJS.enc.Hex);
  return hashHex.substring(0, 5); // Hash com 5 caracteres
};

const formatarDataParaYYYYMMDD = (data) => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}${mes}${dia}`; // Remove os traços
};

const gerarCodigoOrcamento = (insumos, data) => {
  if (!insumos || insumos.length === 0) {
    return null; // Retorna null se a lista de insumos estiver vazia ou for nula
  }

  const hashInsumos = gerarHashUnicoParaLista();
  const dataFormatada = formatarDataParaYYYYMMDD(data);

  return `${insumos[0].fornecedor_id}${dataFormatada}${hashInsumos}`;
}

const fetchedUnidadesMedida = useMemo(async () => {
      try {
          const response = await fetch('https://backend.cultivesmart.com.br/api/unidades-medida');
          return await response.json();
      } catch (error) {
          console.error('Erro ao buscar unidades de medida:', error);
          return null;
      }
   }, []);

const filtrarInsumos = () => {
  return insumos && insumos.records
      ? insumos.records.filter((insumo) => {
            const nomeMatch =
                !filtroNome ||
                insumo.nome.toLowerCase().includes(filtroNome.toLowerCase());
            const fornecedorMatch =
                !filtroFornecedor ||
                insumo.fornecedor_id === parseInt(filtroFornecedor);
                const categoriaMatch =
                !filtroCategoria ||
                insumo.categoria_id === parseInt(filtroCategoria);
            return insumos.records && categoriaMatch && nomeMatch && fornecedorMatch;
        })
      : [];
};

const handleBack = (e) => {
  e.preventDefault();
  setActiveStep((prev) => Math.max(prev - 1, 0));
  
  setStepErrors(prevErrors => {
      const newErrors = [...prevErrors];
      newErrors[activeStep] = false; 
      return newErrors;
  });
};

const toggleInsumoSelecionadoModal = (insumo) => {
  if (insumosSelecionadosModal.some((i) => i.id === insumo.id)) {
    setInsumosSelecionadosModal(insumosSelecionadosModal.filter((i) => i.id !== insumo.id));
  } else {
    setInsumosSelecionadosModal([...insumosSelecionadosModal, insumo]);
  }
};

const calcularTotal = () => {
  return insumosCotacao.reduce((total, insumo) => {

    return total + insumo.preco * (insumo.quantidade_estoque || 0);
  }, 0);
};

const items = useMemo(() => {
  // Criar o objeto de pesquisa para fornecedores fora do map()
  const fornecedoresLookup = fornecedores.records && fornecedores.records.reduce((acc, fornecedor) => {
      acc[fornecedor.id] = fornecedor;
      return acc;
  }, {});

  return insumosCotacao.map(insumo => {
      const precoTotal = insumo.preco * (insumo.quantidade_estoque || 0);
      const fornecedor = fornecedoresLookup[insumo.fornecedor_id]; // Acessar o fornecedor pelo id

      return {
          fornecedor: fornecedor ? fornecedor.nome : 'Fornecedor não encontrado', // Usar o nome do fornecedor ou uma mensagem de erro
          nome: insumo.nome,
          variedade: insumo.variedade,
          quantidade_estoque: insumo.quantidade_estoque,
          preco: formatarPreco(insumo.preco),
          preco_total: formatarPreco(precoTotal),
          _cellProps: { nome: { scope: 'row' } },
      };
  });
}, [insumosCotacao, fornecedores]);// Adicionar 'fornecedores' como dependência

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      
      const response = await fetch('https://backend.cultivesmart.com.br/api/insumos', {
        method: 'GET',
      });

      if (response.ok) {
        setActiveStep(0);
      } else {
        alert('Erro ao cadastrar insumo!');
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }
  };

  const incrementar = (insumo) => {
    setInsumosCotacao(prevInsumos => {
      return prevInsumos.map(item => {
        if (item.id === insumo.id) {
          return { ...item, quantidade_estoque: (item.quantidade_estoque || 0) + 1 };
        }
        return item; // Retorna o item original se não houver alteração
      });
    });
  };

  const decrementar = (insumo) => {
    setInsumosCotacao(prevInsumos => {
      return prevInsumos.reduce((acc, item) => {
        if (item.id === insumo.id) {
          if ((item.quantidade_estoque || 0) > 1) {
            acc.push({ ...item, quantidade_estoque: item.quantidade_estoque - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
    });
  };

  useEffect(() => {
          const loadData = async () => {
              setUnidadesMedida(await fetchedUnidadesMedida);
          };
          loadData();
      },[fetchedUnidadesMedida]);

      const columns = [
        {
          key: 'fornecedor',
          label: 'Fornecedor',
        },
        {
          key: 'nome',
          label: 'Insumo',
        },
        {
          key: 'variedade',
          label: 'Variedade',
        },
        {
          key: 'quantidade_estoque',
          label: 'Qtd.',
        },
        {
          key: 'preco',
          label: 'Valor Unit.',
        },
        {
          key: 'preco_total',
          label: 'Valor Total',
        }
      ]
      

    const fornecedor = useMemo(() => {
      if (insumosCotacao.length > 0 && fornecedores.records) {
          const fornecedor = fornecedores.records.find(f => f.id === insumosCotacao[0].fornecedor_id);
          return fornecedor ? fornecedor : 'Fornecedor não encontrado';
      }
      return 'asdas';
  }, [insumosCotacao, fornecedores]);
  
  return (
    <CContainer>
      <AvisoCotacao href="components/buttons/" />
      <CForm onSubmit={handleSubmit} className="row g-3">
          
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Insumos - </strong>
                  <small>Simular Pedido</small>
                </CCardHeader>
                <CCardBody>
                  <DocsExample href="components/card/#background-and-color">
                    <CRow className="align-items-center justify-content-center mb-4" xs={{ gutterY: 5 }} >
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
                    {/* Filtros de nome e fornecedor permanecem abaixo */}
                    <CRow className="align-items-center justify-content-center mb-4" xs={{ gutterY: 5 }} >
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
                  <div style={{marginTop: '1rem', marginBottom:'1rem' }}></div>
                  <CRow>
                    <EstoqueArea href="components/card/#background-and-color">
                      <CRow xs={{ gutterY: 3 }} className="align-items-center justify-content-between mb-4">
                          {filtrarInsumos().map((insumo) => {

                            return (
                                    <CCard
                                    key={insumo.id}
                                    style={{width:'90%'}}
                                    >
                                       <CRow>
                                        <CCol xs={3} md={4} style={{display:'flex', alignContent:'center'}}>
                                        <CCardImage
                                        
                                              style={{ 
                                                height: '130px',
                                                width: '100px',
                                                objectFit: 'fill',
                                                display: 'flex',
                                                margin: '0 auto',
                                              }} src={`data:image/png;base64,${insumo.logoPath}`} />
                                        </CCol>
                                        <CCol xs={9} md={8}>
                                          <CCardBody>
                                            <CCardTitle>{insumo.nome}</CCardTitle>
                                            <CCardSubtitle>{insumo.variedade}</CCardSubtitle>
                                            
                                            <CRow style={{marginBottom:'0.5rem'}}>
                                              <CCol xs={8} md={8}>
                                                <CCardText>
                                                  <small className="text-body-secondary">{insumo.quantidade}{getUnidadeMedidaDescricao(insumo.unidade_medida)} por und.</small>
                                                </CCardText>
                                                <CCardText style={{color:'green', fontWeight:'bold'}}>
                                                  {formatarPreco(insumo.preco)}
                                                </CCardText>
                                              </CCol>

                                            

                                            {insumosCotacao.some(item => item.id === insumo.id) ? (
                                            <CCol
                                              xs={4}
                                              md={4}
                                              style={{display:'flex',
                                              justifyContent:'end'}}>

                                              <div style={{
                                                width:'1.5rem',
                                                backgroundColor: '#212631',
                                                borderTopLeftRadius: '100px',
                                                borderTopRightRadius: '100px',
                                                borderBottomLeftRadius: '100px',
                                                borderBottomRightRadius: '100px',
                                                marginTop: '0.5rem',
                                                marginBottom: '0.5rem',
                                                display:'flex',
                                                flexDirection:'column',
                                                alignItems:'center',
                                                justifyContent:'center'
                                              }}>
                                                <CIcon
                                                  icon={cilCaretTop}
                                                  size="sl"
                                                  style={{
                                                    cursor: 'pointer',
                                                    '--ci-primary-color': 'white'
                                                  }}
                                                  onClick={() => incrementar(insumo)} />
                                              
                                                <CRow style={{color:'white'}}>
                                                {insumosCotacao.find(item => item.id === insumo.id)?.quantidade_estoque || 0}
                                                </CRow>
                                                
                                                <CIcon
                                                  icon={cilCaretBottom}
                                                  size="sl"
                                                  style={{
                                                    cursor: 'pointer',
                                                    '--ci-primary-color': 'white'
                                                  }}
                                                  onClick={() => decrementar(insumo)}
                                                  />   
                                                </div>

                                              
                                            </CCol>
                                            ) : (
                                            <CCol xs={4} md={4} className='align-self-end'>
                                              <div style={{
                                                display:'flex',
                                                alignContent:'center',
                                                alignItems:'center',
                                                flexDirection:'column',
                                                justifyContent:'space-around'
                                              }}>
                                              <CBadge
                                                color="dark"
                                                shape="rounded-pill"
                                                style={{cursor:'pointer'}}
                                                onClick={() => adicionarInsumoCotacao(insumo)}
                                              >
                                              <CIcon icon={cilCart} /> Adicionar</CBadge>
                                              </div>

                                            </CCol>                                              
                                            
                                            )}
                                            </CRow>

                                          </CCardBody>
                                        </CCol>
                                      </CRow>
                                      
                                  </CCard>
                              )
                            })
                          }
                        
                      </CRow>
                    </EstoqueArea>

                    <OrcamentoArea href="components/card/#background-and-color">
                      <CCol
                        xs={12}
                        style={{
                          position: 'sticky',
                          top: '20px', // Ajuste este valor conforme necessário
                          height: 'fit-content', // Garante que a coluna não se estenda indefinidamente
                        }}
                      >
                      {/* Conteúdo da coluna flutuante */}
                      <CCard>
                        <CCardBody>
                          <CCardTitle>Orçamento</CCardTitle>
                          <CCardText>
                            Insumos selecionados:

                            <CTable columns={columns} items={items} style={{padding:0}} />

                            <strong>Total:</strong> {formatarPreco(calcularTotal())}
                          </CCardText>                             
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </OrcamentoArea>

                  <div style={{marginTop: 1.5 + 'em', display: 'flex', justifyContent: 'flex-end'}}>
                    <CButton
                      color={insumosCotacao.length <= 0 ? "default" : "success"}
                      className="rounded-0"
                      disabled = {insumosCotacao.length <= 0}
                      onClick={() =>
                        handleConfirmarOrcamento()
                      }
                    >Gerar Cotação</CButton>
                  </div>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>

          <CModal
            alignment="center"
            size="xl"
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="VerticallyCenteredExample"
          >
            <CModalHeader>
              <CModalTitle id="VerticallyCenteredExample">Simular Cotação</CModalTitle>
            </CModalHeader>
            <CModalBody>            
              <CCard>
                <CCardHeader>
                  Orçamento <strong>#{gerarCodigoOrcamento(insumosCotacao, new Date())}</strong>
                  <CButton className="me-1 float-end" size="sm" color="secondary" onClick={print}>
                    <CIcon icon={cilPrint} /> Imprimir
                  </CButton>
                  <CButton className="me-1 float-end" size="sm" color="info" onClick={handlerSalvarCotacao}>
                    { isProcessing ? <CSpinner as="span" className="me-2" size="sm" aria-hidden="true" /> : null  }
                    <CIcon icon={cilSave} /> Salvar
                  </CButton>
                </CCardHeader>
                <CCardBody>
                  <CRow className="mb-4">
                    <CCol sm={4}>
                      <h6 className="mb-3">Fornecedor:</h6>
                      <div>
                        <strong>{fornecedor.nome}</strong>
                      </div>
                      <div>{fornecedor.endereco}</div>
                      <div>{fornecedor.cidade}, {fornecedor.estado} {fornecedor.numero}</div>
                      <div>Email: {fornecedor.email}</div>
                      <div>Telefone: {fornecedor.telefone}</div>
                    </CCol>
                    <CCol sm={4}>
                     
                    </CCol>
                    <CCol sm={4}>
                      <h6 className="mb-3">Detalhes:</h6>
                      <div>Cultive-se</div>
                      <div>{new Date().toLocaleDateString('pt-BR')}</div>
                      <div>Aracaju-SE</div>
                      <div>
                        <strong>Telefone: 79 99999 7777</strong>
                      </div>
                    </CCol>
                  </CRow>
                  <CTable striped>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell className="text-center">#</CTableHeaderCell>
                        <CTableHeaderCell>Insumo</CTableHeaderCell>
                        <CTableHeaderCell>Variedade</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Quantidade</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Custo Unitário</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Total</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>

                      {
                        insumosCotacao.map((insumo) => {
                        return <CTableRow>
                        <CTableDataCell className="text-center">{insumo.id}</CTableDataCell>
                        <CTableDataCell className="text-start">{insumo.nome}</CTableDataCell>
                        <CTableDataCell className="text-start">{insumo.variedade} <small>{insumo.quantidade}{getUnidadeMedidaDescricao(insumo.unidade_medida)}</small></CTableDataCell>
                        <CTableDataCell className="text-center">{insumo.quantidade_estoque}</CTableDataCell>
                        <CTableDataCell className="text-end">{formatarPreco(insumo.preco)}</CTableDataCell>
                        <CTableDataCell className="text-end">{formatarPreco(insumo.quantidade_estoque * insumo.preco)}</CTableDataCell>
                        </CTableRow>
                        })
                      }
                    </CTableBody>
                  </CTable>
                  <CRow>
                    <CCol lg={6} sm={5}>

                    <CAlert color="warning">
                      <CRow className="align-items-center">
                        <CCol xs={2}>
                          <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
                        </CCol>
                        <CCol xs={10}>
                          <CAlertHeading as="h4">Aviso!</CAlertHeading>
                        </CCol>
                      </CRow>

                      <p>
                        Antes de aprovar a cotação e prosseguir com o pedido junto ao fornecedor,
                        é fundamental que você verifique os seguintes pontos de cada insumo do orçamento:.
                      </p>
                      <hr />
                      <p className="mb-0">
                        <ul>
                          <li>Custo unitário</li>
                          <li>Imposto</li>
                          <li>Descontoo</li>
                        </ul>
                      </p>
                    </CAlert>
      
                    </CCol>
                    <CCol lg={4} sm={5} className="ms-auto">
                      <CTable>
                        <CTableBody>
                          <CTableRow>
                            <CTableDataCell className="text-start">
                              <strong>Subtotal</strong>
                            </CTableDataCell>
                            <CTableDataCell className="text-end">{formatarPreco(calcularTotal())}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell className="text-start">
                              <strong>Imposto</strong>
                            </CTableDataCell>
                            <CTableDataCell className="text-end">R$ 0,00</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell className="text-start">
                              <strong>Desconto</strong>
                            </CTableDataCell>
                            <CTableDataCell className="text-end">R$ 0,00</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell className="text-start">
                              <strong>Total</strong>
                            </CTableDataCell>
                            <CTableDataCell className="text-end">
                              <strong>{formatarPreco(calcularTotal())}</strong>
                            </CTableDataCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CModalBody>
            <CModalFooter>
              
          </CModalFooter>
        </CModal>


        
            
        
      </CForm>

    </CContainer>

    
  );
};

export default SimularCotacao;