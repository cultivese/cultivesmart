import React, { useState, useMemo, useEffect } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CContainer,
  CFormTextarea,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormCheck,
  CCardImage,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCardTitle,
  CCardText,
  CCardSubtitle,
} from '@coreui/react';

import CIcon from '@coreui/icons-react'


import {
  cilOptions
} from '@coreui/icons'

import { DocsExample } from 'src/components'
const EstoqueVisaoGeral = () => {
  const [estoquesInsumos, setEstoqueInsumos] = useState([]);  
  const [activeStep, setActiveStep] = useState(0);
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);  
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [unidadesMedida , setUnidadesMedida ] = useState([]);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroFornecedor, setFiltroFornecedor] = useState('');
  const [showAdditionalFieldsModal, setShowAdditionalFieldsModal] = useState(false); // Estado para controlar o modal
  const [insumoSelecionado, setInsumoSelecionado] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [modalMode, setModalMode] = useState('visualizar'); // Novo estado para controlar o modo do modal

  const [editedInsumo, setEditedInsumo] = useState({
    nome: '',
    fornecedor_id: null,
    categoria_id: null,
    variedade: '',
    descricao: '',
    unidade_medida: '',
    quantidade: '',
    desconto: '',
    imposto: '',
    preco: '',
  });

  const formatarPreco = (valor) => {
    if (!valor) return '';
    const valorNumerico = valor.replace(/[^\d]/g, '');
    const valorFormatado = (parseInt(valorNumerico) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    return valorFormatado;
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
        setEstoqueInsumos(data);
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


  const handleNext = (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newStepErrors = [...stepErrors];

    // Validation logic for each step
    if (activeStep === 0 && !filtroCategoria) {
        hasErrors = true;
    } else if (activeStep === 1 && !formData.fornecedor_id) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    } else if (activeStep === 2 &&
      filtroCategoria === "1" && (
          !formData.nome.trim() || !formData.variedade.trim() || !formData.descricao.trim() ||
          !formData.unidade_medida)
   ) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    } else if (activeStep === 2 &&
      filtroCategoria === 2 && (!formData.descricao ||  !formData.unidade_medida || !formData.estoque_minimo)
    ) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    }
    setStepErrors(newStepErrors);

    if (!hasErrors) {
        setActiveStep(prevStep => prevStep + 1);
    }
};

const handleAdditionalFieldsChange = (event) => {
  const { id, value } = event.target;
  setAdditionalFields(prevState => ({
    ...prevState,
    [id]: value,
  }));
};

const handleOpenAdditionalFieldsModal = (insumo, mode) => {
  setInsumoSelecionado(insumo);
  setEditedInsumo({
      nome: insumo.nome,
      categoria_id: insumo.categoria_id,
      fornecedor_id: insumo.fornecedor_id,
      variedade: insumo.variedade,
      descricao: insumo.descricao,
      unidade_medida: insumo.unidade_medida,
      quantidade: insumo.quantidade,
      desconto: insumo.desconto,
      imposto: insumo.imposto,
      preco: insumo.preco,
  });
  setModalMode(mode); // Define o modo do modal
  setShowAdditionalFieldsModal(true);
};


const handleCloseAdditionalFieldsModal = () => {
  setShowAdditionalFieldsModal(false);
};

const handleSaveAdditionalFields = () => {

  if (!insumoSelecionado) {
    console.error('Nenhum insumo selecionado para atualizar.');
    return;
  }

  const { id } = insumoSelecionado;

  fetch(`https://backend.cultivesmart.com.br/api/insumos/${id}`, {
    method: 'PUT', // Adicione o método DELETE aqui
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editedInsumo),
  })
  .then(response => {
    if (response.ok) {
      console.log(`Insumo com ID ${id} atualizado com sucesso.`);

      // Atualiza o estado insumos com os dados atualizados
      setEstoqueInsumos(prevInsumos => {
        const updatedInsumos = prevInsumos.records.map(insumo => {
          if (insumo.id === id) {
            return { ...insumo, ...editedInsumo }; // Atualiza o insumo com os dados editados
          }
          return insumo;
        });
        return { ...prevInsumos, records: updatedInsumos };
      });
    } else {
      console.error(`Erro ao atualizar o insumo com ID ${id}:`, response.status);
    }
  })
  .catch(error => console.error('Erro ao atualizar insumo:', error));


  setShowAdditionalFieldsModal(false); // Fecha o modal
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
  return estoquesInsumos && estoquesInsumos
      ? estoquesInsumos.filter((insumo) => {
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
                  <strong>Insumos - </strong>
                  <small>Consulta de Insumos</small>
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

                  <DocsExample href="components/card/#background-and-color">
                    <CRow xs={{ gutterY: 3}} className="justify-content-between">
                        {
                          estoquesInsumos.map((estoqueInsumo) => {
                            return (
                                <CCard style={{width: '32%'}}>
                                  <CRow>
                                    <CCol xs={3} md={4} style={{marginTop:20}}>
                                      <CCardImage src={`data:image/png;base64,${estoqueInsumo.insumo.logoPath}`} />
                                    </CCol>
                                    <CCol xs={7} md={7}>
                                      <CCardBody>
                                        <CCardTitle>{estoqueInsumo.insumo.nome}</CCardTitle>
                                        <CCardSubtitle>{estoqueInsumo.insumo.variedade}</CCardSubtitle>
                                        <CCardText>
                                          {formatarPreco(estoqueInsumo.preco)}
                                        </CCardText>
                                        <CCardText>
                                          <small className="text-body-secondary">Estoque atual: {estoqueInsumo.quantidade}</small>
                                        </CCardText>
                                      </CCardBody>
                                    </CCol>
                                    <CCol xs={1} md={1} >
                                        <CDropdown alignment="end">
                                          <CDropdownToggle color="transparent" caret={false} className="p-0">
                                            <CIcon icon={cilOptions} />
                                          </CDropdownToggle>
                                          <CDropdownMenu>
                                            <CDropdownItem
                                                onClick={() => handleOpenAdditionalFieldsModal(estoqueInsumo, 'visualizar')}>
                                            Visualizar</CDropdownItem>
                                            <CDropdownItem
                                                onClick={() => handleOpenAdditionalFieldsModal(estoqueInsumo, 'editar')}>
                                            Atualizar Dados</CDropdownItem>
                                            <CDropdownItem
                                                onClick={() => handleDeleteInsumoById(estoqueInsumo.id)}>
                                            Excluir</CDropdownItem>
                                          </CDropdownMenu>
                                        </CDropdown>
                                    </CCol>
                                  </CRow>
                                </CCard>
                            )
                          })
                        }
                    </CRow>
                  </DocsExample>
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
          <strong>{modalMode === 'visualizar' ? 'Informações do cadastro do insumo' : 'Editar cadastro do insumo'}</strong>
        </CModalHeader>
        <CModalBody>
          {insumoSelecionado && (
              <CRow>
                <CCol xs={6} md={6}>
                  <CFormInput
                    label="Nome"
                    value={editedInsumo.nome}
                    disabled={modalMode === 'visualizar'}
                    onFocus={() => setEditingField('nome')}
                    onChange={(e) =>
                      setEditedInsumo({ ...editedInsumo, nome: e.target.value })
                  }/>
                </CCol>
                <CCol xs={6} md={6}>
                  <CFormInput
                    label="Variedade"
                    value={editedInsumo.variedade}
                    disabled={modalMode === 'visualizar'}
                    onFocus={() => setEditingField('variedade')}
                    onChange={(e) =>
                      setEditedInsumo({ ...editedInsumo, variedade: e.target.value })
                  }/>
                </CCol>
                <CCol xs={12} md={12}>
                  <CFormTextarea label="Descrição"
                    value={editedInsumo.descricao}
                    style={{ minHeight: '200px' }}
                    maxLength={255}
                    disabled={modalMode === 'visualizar'}
                    onFocus={() => setEditingField('descricao')}
                    onChange={(e) =>
                      setEditedInsumo({ ...editedInsumo, descricao: e.target.value })
                  }
                    ></CFormTextarea>
                </CCol>
                <CCol xs={5} md={5}>
                  <CFormSelect
                      label="Unidade de Medida"
                      id="unidade_medida"
                      aria-label="Floating label select example"
                      value={editedInsumo.unidade_medida}
                      title=''
                      disabled={modalMode === 'visualizar'}
                      onFocus={() => setEditingField('unidade_medida')}
                      onChange={(e) =>
                        setEditedInsumo({ ...editedInsumo, unidade_medida: e.target.value })
                      }
                    >
                      {
                        unidadesMedida && unidadesMedida.map((unidadeMedida) => {
                          return (
                            <option key={unidadeMedida.id} value={unidadeMedida.id}>{unidadeMedida.descricao}</option>
                          )
                      }
                    )}
                  </CFormSelect>
                </CCol>
                <CCol xs={3} md={3}>
                  <CFormInput label="Quantidade"
                  value={editedInsumo.quantidade} disabled={modalMode === 'visualizar'}
                  onFocus={() => setEditingField('quantidade')}
                  onChange={(e) =>
                    setEditedInsumo({ ...editedInsumo, quantidade: e.target.value })
                  }
                />
                 </CCol>
                 <CCol xs={4} md={4}>
                  <CFormInput
                    label="Preço"
                    value={editedInsumo.preco}
                    onFocus={() => setEditingField('preco')}
                    onChange={(e) =>
                      setEditedInsumo({ ...editedInsumo, preco: e.target.value })
                    }
                    disabled={modalMode === 'visualizar'}/>
                </CCol>
              </CRow>
          )}
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={handleCloseAdditionalFieldsModal}>
                Fechar
            </CButton>
            {modalMode === 'editar' && ( // Botão de salvar visível apenas no modo de edição
            <CButton color="primary" onClick={handleSaveAdditionalFields}>
              Salvar
            </CButton>
          )}
        </CModalFooter>
    </CModal>
     
    </CContainer>

    
  );
};

export default EstoqueVisaoGeral;