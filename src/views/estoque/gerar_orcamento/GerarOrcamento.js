import React, { useState, useMemo, useEffect } from 'react';
import CIcon from '@coreui/icons-react'
import {
  cilOptions
} from '@coreui/icons'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CDropdown,
  CDropdownMenu,
  CDropdownToggle,
  CDropdownItem,
  CModalFooter,
  CContainer,
  CFormCheck,
  CCardImage,
  CCardLink,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCardTitle,
  CCardText,
  CCardSubtitle,
} from '@coreui/react';
import { EstoqueArea, OrcamentoArea  } from 'src/components'
const GerarOrcamento = () => {
  const [estoque, setEstoque] = useState([]);  
  const [insumos, setInsumos] = useState([]);  
  const [unidadesMedida , setUnidadesMedida ] = useState([]);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroFornecedor, setFiltroFornecedor] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [showAdditionalFieldsModal, setShowAdditionalFieldsModal] = useState(false); // Estado para controlar o modal
  const [showIncluirInsumoModal, setShowIncluirInsumoModal] = useState(false); // Estado para controlar o modal
  const [insumoSelecionado, setInsumoSelecionado] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [insumosSelecionados, setInsumosSelecionados] = useState([]);
  const [selectedInsumosModal, setSelectedInsumosModal] = useState([]);
  const [checkedInsumos, setCheckedInsumos] = useState([]);


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
      fetch('https://backend.cultivesmart.com.br/api/estoque')
      .then(response => response.json())
      .then(data => {
        setInsumos(data);
      })
      .catch(error => console.error('Erro ao buscar o estoque:', error));
  
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
    
    const handleOpenIncluirInsumoModal = () => {
      consultarInsumos()
      setShowIncluirInsumoModal(true);
    }

    const handleOpenAdditionalFieldsModal = (insumo) => {
      setInsumoSelecionado(insumo);
      setShowAdditionalFieldsModal(true);
    };

    const handleCloseAdditionalFieldsModal = () => {
      setShowAdditionalFieldsModal(false);
    };
    
    const handleCloseIncluirInsumoModal = () => {
      setShowIncluirInsumoModal(false);
      setCheckedInsumos([]);
    };

    const handleSaveAdditionalFields = () => {
      const novosInsumosSelecionados = insumos.records
        .filter((insumo) => checkedInsumos.includes(insumo.id))
        .filter(
          (insumo) => !insumosSelecionados.some((i) => i.id === insumo.id)
        ); // Filtra para não adicionar duplicados
    
      setInsumosSelecionados([...insumosSelecionados, ...novosInsumosSelecionados]);
      setShowIncluirInsumoModal(false);
      setCheckedInsumos([]); // Limpa os checkboxes
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
  return estoque && estoque.records
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
            return nomeMatch && fornecedorMatch && categoriaMatch;
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

const toggleInsumoSelecionado = (insumo) => {
  if (insumosSelecionados.some((i) => i.id === insumo.id)) {
    setInsumosSelecionados(insumosSelecionados.filter((i) => i.id !== insumo.id));
  } else {
    setInsumosSelecionados([...insumosSelecionados, insumo]);
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

  useEffect(() => {
          const loadData = async () => {
              setUnidadesMedida(await fetchedUnidadesMedida);
          };
          loadData();
      },[fetchedUnidadesMedida]);

  return (
    <CContainer>
      
      <CForm onSubmit={handleSubmit} className="row g-3">
          
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Estoque - </strong>
                  <small>Gerar orçamento</small>
                </CCardHeader>
                <CCardBody>
                  <div style={{marginTop: 1.5 + 'em', marginBottom: 1.5 + 'em', display: 'flex', justifyContent: 'flex-end'}}>
                    <CButton
                      color="warning"
                      className="rounded-0"
                      onClick={() =>
                        handleOpenIncluirInsumoModal()
                      }
                    >Incluir Insumo</CButton>
                  </div>
                  
                  <CRow>
                    <EstoqueArea href="components/card/#background-and-color">
                      <CRow xs={{ gutterY: 5 }} className="align-items-center justify-content-center mb-4">
                        <CCol xs={8}>
                          {filtrarInsumos().map((insumo) => {
                          const isSelecionado = insumosSelecionados.some((i) => i.id === insumo.id);

                            return (
                                    <CCard
                                    key={insumo.id}
                                    style={{ width: '45%', cursor: 'pointer', backgroundColor: isSelecionado ? '#e0f7fa' : 'white' }}
                                    onClick={() => toggleInsumoSelecionado(insumo)}>
                                      <CRow>
                                        <CCol xs={6} md={3} style={{marginTop:10, marginBottom:10}}>
                                          <CCardImage style={{ maxWidth: '150px' }} src={`data:image/png;base64,${insumo.logoPath}`} />
                                        </CCol>
                                        <CCol xs={4} md={6}>
                                          <CCardBody>
                                            <CCardTitle>{insumo.nome}</CCardTitle>
                                            <CCardSubtitle>{insumo.quantidade} {getUnidadeMedidaDescricao(insumo.unidade_medida)}</CCardSubtitle>
                                            <CCardText>
                                              3  und
                                            <div>
                                            - fechados: 3
                                            </div>
                                            </CCardText>
                                          </CCardBody>
                                        </CCol>
                                        <CCol xs={4} md={3}>
                                        <CCardLink style={{ float: 'right' }} href="#" onClick={() =>
                                                handleOpenAdditionalFieldsModal(insumo)
                                            }>+ adicionar</CCardLink>
                                        </CCol>
                                      </CRow>
                                    </CCard>
                              )
                            })
                          }
                        </CCol>
                        
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
                            <ul>
                              {insumosSelecionados.map((insumo) => (
                                <li key={insumo.id}>
                                  {insumo.nome} - {insumo.quantidade} {getUnidadeMedidaDescricao(insumo.unidade_medida)} - {insumo.preco}
                                </li>
                              ))}
                            </ul>
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
                    >Gerar</CButton>
                  </div>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
            
        
      </CForm>

      <CModal
        alignment="center"
        visible={showAdditionalFieldsModal}
        onClose={handleCloseAdditionalFieldsModal}
    >
        <CModalHeader closeButton>
            <strong>Registrar insumo ao estoque</strong>
        </CModalHeader>
        <CModalBody>
          {insumoSelecionado && (
              <div>
                  <CFormInput
                      label="Nota Fiscal"
                      readOnly={editingField !== 'nome'}
                      onFocus={() => setEditingField('nome')}
                      onChange={(e) =>
                          setEditedInsumo({ ...editedInsumo, nome: e.target.value })
                      }
                  />
                  <CFormInput
                      label="Quantidade"
                      readOnly={editingField !== 'nome'}
                      onFocus={() => setEditingField('nome')}
                      onChange={(e) =>
                          setEditedInsumo({ ...editedInsumo, nome: e.target.value })
                      }
                  />
              </div>
          )}
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={handleCloseAdditionalFieldsModal}>
                Fechar
            </CButton>
            <CButton color="primary" onClick={handleSaveAdditionalFields}>
                Salvar
            </CButton>
        </CModalFooter>
      </CModal> 

      <CModal
        alignment="center"
        size="xl"
        visible={showIncluirInsumoModal}
        onClose={handleCloseIncluirInsumoModal}
    >
        <CModalHeader closeButton>
            <strong>Incluir insumo ao estoque</strong>
        </CModalHeader>
        <CModalBody>
          <CRow className="align-items-center justify-content-center">
          {
            insumos && insumos.records && insumos.records.length > 0 &&  insumos.records.map((insumo) => {
              return (
                <CCard key={insumo.id} className="m-2"  style={{ width: '30%' }}>
                    <CRow>
                      <CCol xs={3} md={4} style={{marginTop:20}}>
                        <CCardImage src={`data:image/png;base64,${insumo.logoPath}`} />
                      </CCol>
                      <CCol xs={7} md={7}>
                        <CCardBody>
                          <CCardTitle>{insumo.nome}</CCardTitle>
                          <CCardSubtitle>{insumo.variedade}</CCardSubtitle>
                          <CCardText>
                            {formatarPreco(insumo.preco)}
                          </CCardText>
                          <CCardText>
                            <small className="text-body-secondary">{insumo.quantidade} {getUnidadeMedidaDescricao(insumo.unidade_medida)} por und.</small>
                          </CCardText>
                        </CCardBody>
                      </CCol>
                      <CCol xs={1} md={1} >
                      <CFormCheck
                        id={`checkbox-${insumo.id}`}
                        checked={checkedInsumos.includes(insumo.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCheckedInsumos([...checkedInsumos, insumo.id]);
                          } else {
                            setCheckedInsumos(checkedInsumos.filter((id) => id !== insumo.id));
                          }
                        }}
                      />
                      </CCol>
                    </CRow>
                  </CCard>
                )
              })
            }
          </CRow>
          
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" className="rounded-0" onClick={handleCloseAdditionalFieldsModal}>
                Fechar
            </CButton>
            <CButton color="success" className="rounded-0" onClick={handleSaveAdditionalFields}>
                Confirmar
            </CButton>
        </CModalFooter>
      </CModal> 
     
    </CContainer>

    
  );
};

export default GerarOrcamento;