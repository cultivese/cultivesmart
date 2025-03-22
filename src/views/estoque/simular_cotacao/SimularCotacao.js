import React, { useState, useMemo, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilChartPie,
  cilArrowRight,
  cilCaretTop,
  cilCaretBottom,
  cilCart,
  cilPrint,
  cilSave,
  cilDollar,
  cilWarning
} from '@coreui/icons'
import {
  CAlert,
  CAlertHeading,
  CButton,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CWidgetStatsF,  
  CLink,          
  CCardHeader,
  CListGroupItem,
  CListGroup,
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
  CCardFooter,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModal,
  CModalFooter
} from '@coreui/react';
import { DocsExample, EstoqueArea } from 'src/components'
import { OrcamentoArea } from '../../../components';
const SimularCotacao = () => {
  
  const [insumos, setInsumos] = useState([]);  
  const [insumosCotacao, setInsumosCotacao] = useState([]);
  const [visible, setVisible] = useState(false)

  const [activeStep, setActiveStep] = useState(0);
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);  
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [unidadesMedida , setUnidadesMedida ] = useState([]);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroFornecedor, setFiltroFornecedor] = useState('');
  const [insumosSelecionadosModal, setInsumosSelecionadosModal] = useState([]);
  const [insumosSelecionados, setInsumosSelecionados] = useState([]);

  const [editedInsumo, setEditedInsumo] = useState({
    nome: '',
    descricao: '',
    unidade_medida: '',
    quantidade: '',
    desconto: '',
    imposto: '',
    preco: '',
  });

  const [formData, setFormData] = useState({
    insumo_id: null,
    quantidade: 1,
  });

  const adicionarInsumoCotacao = (insumo) => {
    setInsumosCotacao((prevInsumosCotacao) => {
      const precoString = typeof insumo.preco === 'string' ? insumo.preco : '0';
      const precoNumerico = parseFloat(precoString.replace(/[^\d]/g, '') / 100) || 0;
      const novoInsumo = {
        ...insumo,
        preco: precoNumerico,
        quantidade_estoque: 1,
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
    return 'R$ 0,00'; // Valor padrão se não for um número
};

  const consultarInsumos = () => {
    fetch('https://backend.cultivesmart.com.br/api/insumos')
    .then(response => response.json())
    .then(data => {
      setInsumos(data);
    })
    .catch(error => console.error('Erro ao buscar insumos:', error));
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
  return insumosCotacao.map(insumo => {
    const precoTotal = insumo.preco * (insumo.quantidade_estoque || 0);

    return {
      nome: insumo.nome,
      quantidade_estoque: insumo.quantidade_estoque,
      preco: formatarPreco(insumo.preco),
      preco_total: formatarPreco(precoTotal),
      _cellProps: { nome: { scope: 'row' } },
    };
  });
}, [insumosCotacao]);

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
          key: 'nome',
          label: 'Insumo',
          _props: { scope: 'col' },
        },
        {
          key: 'quantidade_estoque',
          label: 'Qtd.',
          _props: { scope: 'col' },
        },
        {
          key: 'preco',
          label: 'Valor Unit.',
          _props: { scope: 'col' },
        },
        {
          key: 'preco_total',
          label: 'Valor Total',
          _props: { scope: 'col' },
        }
      ]
      

  return (
    <CContainer>
      <CRow>
      <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="danger"
            icon={<CIcon icon={cilChartPie} height={24} />}
            padding={false}
            title="Pedidos pendentes"
            value="2"
            footer={
              <CLink
                className="font-weight-bold font-xs text-body-secondary"
                href="/estoque/gerenciador_pedidos?filtro=pendente"
                rel="noopener norefferer"
              >
                Visualizar
                <CIcon icon={cilArrowRight} className="float-end" width={16} />
              </CLink>
            }
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="warning"
            icon={<CIcon icon={cilChartPie} height={24} />}
            padding={false}
            title="Insumos sem nota"
            value="10"
            footer={
              <CLink
                className="font-weight-bold font-xs text-body-secondary"
                href="https://coreui.io/"
                rel="noopener norefferer"
                target="_blank"
              >
                Visualizar
                <CIcon icon={cilArrowRight} className="float-end" width={16} />
              </CLink>
            }
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="warning"
            icon={<CIcon icon={cilChartPie} height={24} />}
            padding={false}
            title="Insumos sem impostos"
            value="5"
            footer={
              <CLink
                className="font-weight-bold font-xs text-body-secondary"
                href="https://coreui.io/"
                rel="noopener norefferer"
                target="_blank"
              >
                Visualizar
                <CIcon icon={cilArrowRight} className="float-end" width={16} />
              </CLink>
            }
          />
        </CCol>
      </CRow>
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

                    { unidadesMedida && unidadesMedida &&
                      categorias && categorias.records && categorias.records.map((categoria) => {
                          return (
                            <CCol
                              key={categoria.id}
                              color={ filtroCategoria === categoria.id ? 'success' : 'light'}
                              style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center',
                              
                          }}>
                                  

                              <CCol lg={4} onClick={() => { setFiltroCategoria(categoria.id); console.log('filtroCategoria:', categoria.id);  console.log('filtroCategoria:', filtroCategoria);}}>
                                <CCardImage width="fit" orientation="top" src={`data:image/png;base64,${categoria.logoPath}`} />
                              </CCol>
                              <CCol>
                                <CFormCheck
                                    type='radio'
                                    name="categoria"
                                    id={`flexCheckChecked${categoria.id}`}
                                    label={categoria.descricao}
                                    value={categoria.id}
                                    checked={filtroCategoria === categoria.id}
                                    onChange={(e) => {setFiltroCategoria(e.target.value);  console.log('filtroCategoria:', categoria.id); console.log('filtroCategoria:', filtroCategoria);}}
                                />
                              </CCol>
                            </CCol>
                          );
                        })}
                    </CRow>

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
                              fornecedores.records.map((fornecedor) => {
                                return (
                                  <option key={fornecedor.id} value={fornecedor.id}>
                                    {fornecedor.nome}
                                  </option>
                                )
                            })
                          }
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
                                    style={{width:'18rem'}}
                                    >
                                      <CCol>
                                       
                                        <CRow xs={12} md={12} className="justify-content-center">
                                            <CCardImage
                                              style={{ 
                                                maxWidth: '10rem',
                                                marginTop: '1rem',
                                                marginBottom: '1rem',
                                              }} src={`data:image/png;base64,${insumo.logoPath}`} />
                                        </CRow>

                                        <CRow>
                                          <CCardTitle>{insumo.nome}</CCardTitle>
                                        </CRow>
                                        
                                        <CRow style={{marginBottom:'0.5rem'}}>
                                          <CCol xs={8} md={8}>
                                            <CCardSubtitle>{insumo.variedade}</CCardSubtitle>
                                            
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
                                      </CCol>
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

                            <CTable columns={columns} items={items} />

                            <strong>Total:</strong> {formatarPreco(calcularTotal())}
                          </CCardText>                             
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </OrcamentoArea>

                  <div style={{marginTop: 1.5 + 'em', display: 'flex', justifyContent: 'flex-end'}}>
                    <CButton
                      color="success"
                      className="rounded-0"
                      onClick={() =>
                        handleConfirmarOrcamento()
                      }
                    >Salvar</CButton>
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
                  Orçamento <strong>#90-98792</strong>
                  <CButton className="me-1 float-end" size="sm" color="secondary" onClick={print}>
                    <CIcon icon={cilPrint} /> Imprimir
                  </CButton>
                  <CButton className="me-1 float-end" size="sm" color="info">
                    <CIcon icon={cilSave} /> Salvar
                  </CButton>
                </CCardHeader>
                <CCardBody>
                  <CRow className="mb-4">
                    <CCol sm={4}>
                      <h6 className="mb-3">Fornecedor:</h6>
                      <div>
                        <strong>ISLA.</strong>
                      </div>
                      <div>Avenida .....</div>
                      <div>São Paulo, SP 95014</div>
                      <div>Email: isla@isla.com.br</div>
                      <div>Telefone: 11 98801 2356</div>
                    </CCol>
                    <CCol sm={4}>
                     
                    </CCol>
                    <CCol sm={4}>
                      <h6 className="mb-3">Detalhes:</h6>
                      <div>
                        Orçamento <strong>#90-98792</strong>
                      </div>
                      <div>22/03/2025</div>
                      <div>Aracaju-SE</div>
                      <div>Cultive-se</div>
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
                        <CTableDataCell className="text-start">{insumo.variedade}</CTableDataCell>
                        <CTableDataCell className="text-center">{insumo.quantidade_estoque}</CTableDataCell>
                        <CTableDataCell className="text-end">{insumo.preco}</CTableDataCell>
                        <CTableDataCell className="text-end">$999,00</CTableDataCell>
                        </CTableRow>
                        })

                      }
{/*                       
                      <CTableRow>
                        <CTableDataCell className="text-center">2</CTableDataCell>
                        <CTableDataCell className="text-start">Custom Services</CTableDataCell>
                        <CTableDataCell className="text-start">
                          Installation and Customization (per hour)
                        </CTableDataCell>
                        <CTableDataCell className="text-center">20</CTableDataCell>
                        <CTableDataCell className="text-end">$150,00</CTableDataCell>
                        <CTableDataCell className="text-end">$3.000,00</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="text-center">3</CTableDataCell>
                        <CTableDataCell className="text-start">Hosting</CTableDataCell>
                        <CTableDataCell className="text-start">1 year subscription</CTableDataCell>
                        <CTableDataCell className="text-center">1</CTableDataCell>
                        <CTableDataCell className="text-end">$499,00</CTableDataCell>
                        <CTableDataCell className="text-end">$499,00</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="text-center">4</CTableDataCell>
                        <CTableDataCell className="text-start">Platinum Support</CTableDataCell>
                        <CTableDataCell className="text-start">1 year subscription 24/7</CTableDataCell>
                        <CTableDataCell className="text-center">1</CTableDataCell>
                        <CTableDataCell className="text-end">$3.999,00</CTableDataCell>
                        <CTableDataCell className="text-end">$3.999,00</CTableDataCell>
                      </CTableRow> */}
                    </CTableBody>
                  </CTable>
                  <CRow>
                    <CCol lg={4} sm={5}>

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
                            <CTableDataCell className="text-end">$8.497,00</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell className="text-start">
                              <strong>Discount (20%)</strong>
                            </CTableDataCell>
                            <CTableDataCell className="text-end">$1,699,40</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell className="text-start">
                              <strong>VAT (10%)</strong>
                            </CTableDataCell>
                            <CTableDataCell className="text-end">$679,76</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell className="text-start">
                              <strong>Total</strong>
                            </CTableDataCell>
                            <CTableDataCell className="text-end">
                              <strong>$7.477,36</strong>
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