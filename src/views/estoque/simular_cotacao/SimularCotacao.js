import React, { useState, useMemo, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilChartPie,
  cilArrowRight,
  cilCaretTop,
  cilCaretBottom,
  cilCart
} from '@coreui/icons'
import {
  CButton,
  CCard,
  CCardBody,
  CTable,
  CWidgetStatsF,  
  CLink,          
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
  CCardFooter,
} from '@coreui/react';
import { DocsExample, EstoqueArea } from 'src/components'
import { OrcamentoArea } from '../../../components';
const SimularCotacao = () => {
  const [estoque, setEstoque] = useState([]);  
  const [insumos, setInsumos] = useState([]);  
  const [insumosCotacao, setInsumosCotacao] = useState([]);

  const insumosComQuantidade = insumos && insumos.records && insumos.records.map((insumo) => ({
    ...insumo,
    quantidade_estoque: insumo.quantidade_estoque || 1, // Inicializa com 0 se não existir
  }));
  

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
    console.log(insumo);
    setInsumosCotacao((prevInsumosCotacao) => {
      const novoInsumo = {
        ...insumo,
        quantidade_estoque: 1, // Ou qualquer valor inicial que você desejar
      };
      const novoInsumosCotacao = [...prevInsumosCotacao, novoInsumo];
      return novoInsumosCotacao;
    });
  };

  const formatarPreco = (valor) => {
    if (!valor) return '';
    const valorNumerico = valor.replace(/[^\d]/g, '');
    const valorFormatado = (parseInt(valorNumerico) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    return valorFormatado;
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




const handleCategorySelect = (category) => {
  setFiltroCategoria(category);  // Atualiza o estado da categoria selecionada
  setFormData(prevState => ({
    ...prevState,
    category: category  // Atualiza o valor da categoria no formData
  }));
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
  return insumosSelecionados.reduce((total, insumo) => {
    return total + parseFloat(insumo.preco || 0);
  }, 0);
};

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
          key: 'quantidade',
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
      const items = [
        {
          insumo: 'Beterraba',
          quantidade: 1,
          preco_unitario: 'R$ 10,00',
          preco_total: 'R$ 10,00',
          _cellProps: { insumo: { scope: 'row' } },
        },
        {
          insumo: 'Beterraba',
          quantidade: 2,
          preco_unitario: 'R$ 50,00',
          preco_total: 'R$ 100,00',
          _cellProps: { insumo: { scope: 'row' } },
        },
        {
          insumo: 'Beterraba',
          quantidade: 3,
          preco_unitario: 'R$ 60,00',
          preco_total: 'R$ 180,00',
          _cellProps: { insumo: { scope: 'row' } },
        },
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

                            <CTable columns={columns} items={insumosSelecionados} />
                            {/* <ul>
                              {insumosSelecionados.map((insumo) => (
                                <li key={insumo.id}>
                                  {insumo.nome} - {insumo.quantidade} {getUnidadeMedidaDescricao(insumo.unidade_medida)} - {insumo.preco}
                                </li>
                              ))}
                            </ul> */}
                            <strong>Total:</strong> {calcularTotal()}
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
                        handleOpenIncluirInsumoModal()
                      }
                    >Salvar</CButton>
                  </div>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
            
        
      </CForm>

    </CContainer>

    
  );
};

export default SimularCotacao;