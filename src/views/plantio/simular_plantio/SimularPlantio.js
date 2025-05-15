import React, { useState, useMemo, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilCaretTop,
  cilCaretBottom,
  cilCart
} from '@coreui/icons'
import { CAvatar, CDatePicker, CBadge, CButton, CCollapse, CFormSelect, CRow, CSmartTable } from '@coreui/react-pro'
import { useSearchParams, useNavigate } from "react-router-dom";
import { Stepper, Step } from 'react-form-stepper';
import { EstoqueArea } from 'src/components'
import {
CForm,
CCard,
CCardHeader,
CCardBody,
CCardImage,
CCardTitle,
CCardSubtitle,
CCardText,
CCol
} from '@coreui/react';
import { DocsExample } from 'src/components'
const handleSubmit = async (event) => {
}

const stepLabels = [
  { title: "Cliente", subtitle: "Escolha o cliente" },
  { title: "Fornecedor", subtitle: "Defina o fornecedor" },
  { title: "Informações", subtitle: "Preencha as informações principais" },
  { title: "Resumo", subtitle: "Resumo dos dados preenchidos" },
];

const SimularPlantio = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const filtro = searchParams.get("filtro") || "todos"; // Default: "todos"
  const [details, setDetails] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insumoValues, setInsumoValues] = useState({});
  const [insumoQuantidades, setInsumoQuantidades] = useState({}); // Estado para armazenar as quantidades dos insumos


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

const [activeStep, setActiveStep] = useState(0);
const [clientes, setClientes] = useState([]); 
const [filtroCliente, setFiltroCliente] = useState('');
const [stepErrors, setStepErrors] = useState([false, false, false, false, false]); // Array to track errors for each step
const [insumos, setInsumos] = useState([]);  
const [unidadesMedida , setUnidadesMedida ] = useState([]);
const [insumosCotacao, setInsumosCotacao] = useState([]);

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

const handleNext = (e) => {
  e.preventDefault();

  let hasErrors = false;
  const newStepErrors = [...stepErrors];

  // Validation logic for each step
  if (activeStep === 0 && !filtroCliente) {
      hasErrors = true;
  } else if (activeStep === 1 && !formData.fornecedor_id) {
      hasErrors = true;
      newStepErrors[activeStep] = true;
  } else if (activeStep === 2 && (
        !formData.logo || !formData.nome.trim() || !formData.variedade.trim() || !formData.descricao.trim() ||
        !formData.unidade_medida || !formData.quantidade || !formData.preco)
 ) {
      hasErrors = true;
      newStepErrors[activeStep] = true;
  } else if (activeStep === 2 &&
    selectedCategory === 2 && (!formData.nome.trim() ||  !formData.variedade.trim() || !formData.descricao.trim())
  ) {
      hasErrors = true;
      newStepErrors[activeStep] = true;
  }
  setStepErrors(newStepErrors);

  if (!hasErrors) {
      setActiveStep(prevStep => prevStep + 1);
  }
};


const handleBack = (e) => {
  e.preventDefault();
  setActiveStep((prev) => Math.max(prev - 1, 0));
  // Clear errors for the current step when going back
  setStepErrors(prevErrors => {
      const newErrors = [...prevErrors];
      newErrors[activeStep] = false; // Clear errors for the current step
      return newErrors;
  });
};

useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/clientes')
      .then(response => response.json())
      .then(data => {
      setClientes(data);
      })
      .catch(error => console.error('Erro ao buscar clientes:', error));
  }, []);

useEffect(() => {
    fetch('https://backend.cultivesmart.com.br/api/insumos')
      .then(response => response.json())
      .then(data => {
        setInsumos(data);
      })
      .catch(error => console.error('Erro ao buscar insumos:', error));
  }, []);


const fetchedUnidadesMedida = useMemo(async () => {
      try {
          const response = await fetch('https://backend.cultivesmart.com.br/api/unidades-medida');
          return await response.json();
      } catch (error) {
          console.error('Erro ao buscar unidades de medida:', error);
          return null;
      }
    }, []);
  useEffect(() => {
    const loadData = async () => {
      setUnidadesMedida(await fetchedUnidadesMedida);
  };
  loadData();
  }, [fetchedUnidadesMedida]);

const getUnidadeMedidaDescricao = (id) => {
  const unidade = unidadesMedida && unidadesMedida.length > 0
  && unidadesMedida.find((u) => u.id === parseInt(id));
  return unidade ? unidade.sigla : '';
};


  return (
    <CCol>
      <h1>Planejamento de Produção</h1>

    <Stepper activeStep={activeStep}>
        <Step label="Cliente" onClick={() => setActiveStep(0)} />
        <Step label="Produtos" onClick={() => setActiveStep(1)} />
        <Step label="Informações" onClick={() => setActiveStep(2)} />
        <Step label="Resumo" onClick={() => setActiveStep(3)} />
      </Stepper>
      <CForm onSubmit={handleSubmit} className="row g-3">
          
          {activeStep === 0 && (
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>{stepLabels[activeStep].title} - </strong>
                  <small>{stepLabels[activeStep].subtitle}</small>
                </CCardHeader>
                <CCardBody>
                  <DocsExample href="components/card/#background-and-color">
                    <CRow xs={{ gutterY: 5 }} >

                    {clientes && clientes.records && clientes.records.map((cliente) => {
                          return (
                            <CFormSelect
                            size="lg"
                            aria-label="Large select example"
                            value={filtroCliente}
                            onChange={(e) => setFiltroCliente(e.target.value)}
                        >
                          <option>Escolha o cliente...</option>
                          {clientes &&
                              clientes.records &&
                              clientes.records.length > 0 &&
                              clientes.records.map((cliente) => {
                                return (
                                  <option key={cliente.id} value={cliente.id}>
                                    {cliente.nome}
                                  </option>
                                )
                            })
                          }
                        </CFormSelect>
                          );
                        })}
                    </CRow>
                  </DocsExample>
                </CCardBody>
              </CCard>
            </CCol>
          )}

          {activeStep === 1 && (
            <CCol xs={12}>
              <EstoqueArea href="components/card/#background-and-color">
                <CRow xs={{ gutterY: 3 }} className="align-items-center justify-content-between mb-4">
                    {insumos && insumos.records && insumos.records.map((insumo) => {

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
            </CCol>
          )}
            
          <CRow className="mt-4">
            {activeStep > 0 && (
              <CCol>
                <CButton color="secondary" onClick={handleBack}>Voltar</CButton>
              </CCol>
            )}
          {activeStep === 3 ? (
            <CCol>
            <CButton color="success" type="submit">Cadastrar</CButton>
          </CCol>
          ) : (
            <CCol>
              <CButton color="primary" onClick={(e) => handleNext(e)}>Próximo</CButton>
            </CCol>
          )}
        </CRow>
    </CForm>
  </CCol>
  )
};

export default SimularPlantio;