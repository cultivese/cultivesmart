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
  CCardLink,
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
const InsumosCadastro = () => {
  const [insumos, setInsumos] = useState([]);  
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

const handleDeleteInsumoById = (id) => {
  fetch(`https://backend.cultivesmart.com.br/api/insumos/${id}`, {
    method: 'DELETE', // Adicione o método DELETE aqui
  })
    .then(response => {
      if (response.ok) {
        // A exclusão foi bem-sucedida
        console.log(`Insumo com ID ${id} excluído com sucesso.`);
        //removerInsumo(id);
        fetch('https://backend.cultivesmart.com.br/api/insumos')
          .then(response => response.json())
          .then(data => {
            setInsumos(data);
          })
          .catch(error => console.error('Erro ao buscar insumos:', error));
      } else {
        // A exclusão falhou
        console.error(`Erro ao excluir insumo com ID ${id}:`, response.status);
      }
    })
    .catch(error => console.error('Erro ao excluir insumo:', error));
};

const removerInsumo = (idParaRemover) => {
  setInsumos(insumos.filter(insumo => insumo.id !== idParaRemover));
};

const handleCloseAdditionalFieldsModal = () => {
  setShowAdditionalFieldsModal(false);
};

const handleSaveAdditionalFields = () => {

  if (!insumoSelecionado) {
    console.error('Nenhum insumo selecionado para atualizar.');
    return;
  }

  // // Atualiza o formData com os valores do modal
  // setFormData(prevState => ({
  //   ...prevState,
  //   quantidade_inicial: additionalFields.quantidade_inicial,
  //   unidade_medida_conteudo: additionalFields.unidade_medida_conteudo,
  //   quantidade_consumida: additionalFields.quantidade_consumida,
  // }));

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
      setInsumos(prevInsumos => {
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
                  <strong>Consulta - </strong>
                  <small>Catálogo de Produtos de Fornecedores</small>
                </CCardHeader>
                <CCardBody>
                  <DocsExample href="components/card/#background-and-color">
                    {/* Seleção de categoria por cards/quadrados */}
                    <CRow className="align-items-center justify-content-center mb-4" xs={{ gutterY: 5 }}>
                      {categorias && categorias.records && categorias.records.map((categoria) => (
                        <CCol key={categoria.id} lg={2} md={3} sm={4} xs={6} style={{ marginBottom: 16 }}>
                          <CCard
                            className={`categoria-card-insumos${filtroCategoria === categoria.id ? ' selected' : ''}`}
                            onClick={() => setFiltroCategoria(categoria.id)}
                            color="light"
                            textColor="dark"
                            style={{
                              cursor: 'pointer',
                              border: filtroCategoria === categoria.id ? '2px solid #4f8cff' : '2px solid #e0e0e0',
                              boxShadow: '0 2px 8px #0001',
                              borderRadius: 16,
                              transition: 'box-shadow 0.2s, border-color 0.2s',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: 150,
                              minWidth: 120,
                              textAlign: 'center',
                              background: '#fff',
                            }}
                          >
                            <CCardImage
                              orientation="top"
                              src={`data:image/png;base64,${categoria.logoPath}`}
                              style={{ width: 64, height: 64, objectFit: 'contain', margin: '16px auto' }}
                            />
                            <CCardBody style={{ padding: 8 }}>
                              <CCardTitle style={{ fontSize: 16, fontWeight: 600 }}>{categoria.descricao}</CCardTitle>
                            </CCardBody>
                          </CCard>
                        </CCol>
                      ))}
                    </CRow>
                    {/* Filtros de nome e fornecedor */}
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
                  <style>{`
                    .categoria-card-insumos {
                      background: #fff !important;
                      background-color: #fff !important;
                    }
                    .categoria-card-insumos.selected {
                      border-color: #4f8cff !important;
                    }
                  `}</style>
                  <DocsExample href="components/card/#background-and-color">
                    <CRow xs={{ gutterY: 3}} className="justify-content-between">
                        {
                          filtrarInsumos().map((insumo) => {
                            return (
                                <CCard style={{width: '32%'}}>
                                  <CRow>
                                    <CCol xs={3} md={4} style={{marginTop:20}}>
                                      <CCardImage src={`data:image/png;base64,${insumo.logoPath}`} />
                                    </CCol>
                                    <CCol xs={7} md={7}>
                                      <CCardBody>
                                        <CCardTitle>{insumo.nome}</CCardTitle>
                                        <CCardSubtitle>Variedade: {insumo.variedade}</CCardSubtitle>
                                        <CCardText>Fornecedor: {(() => {
                                          const fornecedor = fornecedores && fornecedores.records && fornecedores.records.length > 0
                                            ? fornecedores.records.find(f => f.id === insumo.fornecedor_id)
                                            : null;
                                          return fornecedor ? fornecedor.nome : insumo.fornecedor_id;
                                        })()}</CCardText>
                                        <CCardText>Preço: {formatarPreco(insumo.preco)}</CCardText>
                                        <CCardText>Quantidade: <small className="text-body-secondary">{insumo.quantidade}{getUnidadeMedidaDescricao(insumo.unidade_medida)} por und.</small></CCardText>
                                      </CCardBody>
                                    </CCol>
                                    <CCol xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 12 }}>
                                      <CButton size="sm" color="info" variant="outline" onClick={() => handleOpenAdditionalFieldsModal(insumo, 'visualizar')}>
                                        Visualizar
                                      </CButton>
                                      <CButton size="sm" color="warning" variant="outline" onClick={() => handleOpenAdditionalFieldsModal(insumo, 'editar')}>
                                        Atualizar
                                      </CButton>
                                      <CButton size="sm" color="danger" variant="outline" onClick={() => handleDeleteInsumoById(insumo.id)}>
                                        Excluir
                                      </CButton>
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

export default InsumosCadastro;