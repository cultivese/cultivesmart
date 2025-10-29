import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import { AvisoGerenciarEstoque } from 'src/components'
import {
  CButton,
  CCard,
  CBadge,
  CCardBody,
  CInputGroup,
  CInputGroupText,
  CImage,
  CSpinner,
  CCardHeader,
  CTableDataCell,
  CCol,
  CAlert,
  CAlertHeading,
  CTabs,
  CTabList,
  CTab,
  CTabContent,
  CTabPanel,
  CFormLabel,
  CFormSwitch,
  CProgress,
  CProgressBar,
  CTableHead,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
  COffcanvasBody,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CContainer,
  CTableHeaderCell,
  CTableBody,
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
  CSmartTable,
  CModalTitle
} from '@coreui/react-pro';

import CIcon from '@coreui/icons-react'

import {
  cilPrint,
  cilSave,
  cilWarning,
  cilOptions
} from '@coreui/icons'

import { DocsExample } from 'src/components'
const EstoqueVisaoGeral = () => {
  const API_BASE_URL = 'https://backend.cultivesmart.com.br/api'; 
  const [estoquesInsumos, setEstoqueInsumos] = useState([]);  
  const [activeStep, setActiveStep] = useState(0);
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);  
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [unidadesMedida , setUnidadesMedida ] = useState([]);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroFornecedor, setFiltroFornecedor] = useState('');
  const [showAdditionalFieldsModal, setShowAdditionalFieldsModal] = useState(false); // Estado para controlar o modal
  const [showImportPhotosModal, setShowImportPhotosModal] = useState(false); // Estado para controlar o modal
  const [showRetiradaEstoqueModal, setShowRetiradaEstoqueModal] = useState(false); // Estado para controlar o modal
  const [showDetailsModal, setShowDetailsModal] = useState(false); // Estado para controlar o modal
  const [insumoSelecionado, setInsumoSelecionado] = useState(null);
  const [visible, setVisible] = useState(false)
  const [modalMode, setModalMode] = useState('visualizar'); // Novo estado para controlar o modo do modal
  const [insumoDetail, setInsumoDetail] = useState('');
  const [quantidadeRetirada, setQuantidadeRetirada] = useState('');
  const [movimentacoesEstoque, setMovimentacoesEstoque] = useState([]);
  const [isFetchingMovements, setIsFetchingMovements] = useState(false);
  const [motivoRetirada, setMotivoRetirada] = useState('');
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
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState(null); // Para mensagens de sucesso/erro
  const [selectedInsumoId, setSelectedInsumoId] = useState(null); // <-- Adicione esta linha
  const [messageType, setMessageType] = useState(''); // 'success' ou 'danger'
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
  setModalMode(mode);
  const initialEditedInsumo = {
      nome: insumo.insumo.nome,
      categoria_id: insumo.insumo.categoria_id,
      fornecedor_id: insumo.insumo.fornecedor_id,
      variedade: insumo.insumo.variedade,
      descricao: insumo.insumo.descricao,
      unidade_medida: insumo.insumo.unidade_medida,
      quantidade: insumo.quantidade,
      desconto: insumo.desconto,
      imposto: insumo.imposto,
      preco: insumo.preco,
      // Campos de especificação - ajuste os nomes conforme a estrutura da sua tabela 'insumo_especificacoes'
      dias_pilha: insumo.insumo.especificacoes?.[0]?.dias_pilha || '',
      dias_blackout: insumo.insumo.especificacoes?.[0]?.dias_blackout || '',
      dias_colheita: insumo.insumo.especificacoes?.[0]?.dias_colheita || '', // Ajuste o nome do campo se necessário
      gramas_para_plantio: insumo.insumo.especificacoes?.[0]?.gramas_para_plantio || '',     // Ajuste o nome do campo se necessário
      quantidade_bandeja: insumo.insumo.especificacoes?.[0]?.quantidade_bandeja || '', // Ajuste o nome
      hidratacao: insumo.insumo.especificacoes?.[0]?.hidratacao || '',
      colocar_peso: Boolean(insumo.insumo.especificacoes?.[0]?.colocar_peso) || false,
      cobertura_substrato: Boolean(insumo.insumo.especificacoes?.[0]?.cobertura_substrato) || false,
  };
  setEditedInsumo(initialEditedInsumo);
  setShowAdditionalFieldsModal(true);
};

const handleRetiradaEstoqueModal = (insumo) =>
{
    setSelectedInsumoId(insumo.id);
    setShowRetiradaEstoqueModal(true);
}

const handleOpenImportPhotosModal = (insumo) => {
    setShowImportPhotosModal(true);
}

const handleOpenDetailsModal = async  (estoqueInsumo) => {
    const totalSacos = parseInt(estoqueInsumo.cotacao_insumos.quantidade);
    const capacidadePorSaco = parseInt(estoqueInsumo.insumo.quantidade);
    
    const quantidadeDisponivelAtual = estoqueInsumo.quantidade_total;
    
    let quantidadeRestante = quantidadeDisponivelAtual;
    const usoSacosArray = [];
    
    for (let i = 0; i < totalSacos; i++) {
        let usoPercentual = 0;
        
        if (quantidadeRestante >= capacidadePorSaco) {
            // Se a quantidade restante for maior ou igual à capacidade do saco, ele está 100% cheio
            usoPercentual = 100;
            quantidadeRestante -= capacidadePorSaco;
        } else if (quantidadeRestante > 0) {
            // Se a quantidade restante for menor que a capacidade do saco, ele está parcialmente cheio
            usoPercentual = (quantidadeRestante / capacidadePorSaco) * 100;
            quantidadeRestante = 0; // O restante foi consumido por este saco
        } else {
            // Se não houver mais quantidade, os sacos restantes estão vazios
            usoPercentual = 0;
        }
        
        usoSacosArray.push(Math.round(usoPercentual)); // Arredonda o valor para um número inteiro
    }

    // 4. Montar o objeto de detalhes para o modal
    const insumoDetails = {
        foto: estoqueInsumo.insumo.logoPath,
        nome: estoqueInsumo.insumo.nome,
        descricao: estoqueInsumo.insumo.variedade,
        precoUnitario: estoqueInsumo.preco, // Preço do insumo em estoque
        fornecedor: 'Agro Seeds Brasil', // Substitua por dados reais do JSON, se disponíveis
        notaFiscal: 'NF-2023-10-00123', // Substitua por dados reais do JSON, se disponíveis
        usoSacos: usoSacosArray, // Array de progresso calculado
    };
    
    // 5. Atualizar o estado e abrir o modal
    setInsumoDetail(insumoDetails);

    setIsFetchingMovements(true);

    try {
        const response = await fetch(`https://backend.cultivesmart.com.br/api/estoque/${estoqueInsumo.id}/movements`);
        if (!response.ok) {
            throw new Error('Erro ao buscar movimentações');
        }
        const data = await response.json();
        setMovimentacoesEstoque(data);
    } catch (error) {
        console.error('Erro ao buscar o histórico de movimentações:', error);
        setMovimentacoesEstoque([]); // Limpa o estado em caso de erro
    } finally {
        setIsFetchingMovements(false);
    }

    setShowDetailsModal(true);
    setInsumoSelecionado(estoqueInsumo);
};

const handleSaveAdditionalFields = async () => {
  if (!insumoSelecionado) {
    console.error('Nenhum insumo selecionado para atualizar.');
    return;
  }

  // Monta o payload base (sem insumo_id)
  const payloadBase = {
    dias_pilha: editedInsumo.dias_pilha ? parseInt(editedInsumo.dias_pilha) : null,
    dias_blackout: editedInsumo.dias_blackout ? parseInt(editedInsumo.dias_blackout) : null,
    dias_colheita: editedInsumo.dias_colheita ? parseInt(editedInsumo.dias_colheita) : null,
    quantidade_bandeja: editedInsumo.quantidade_bandeja ? parseInt(editedInsumo.quantidade_bandeja) : null,
  };

  setIsProcessing(true);

  try {
    let response;
    if (modalMode === 'cadastrar') {
      // Cadastro: POST para endpoint padrão, inclui insumo_id
      const payload = { ...payloadBase, insumo_id: insumoSelecionado.insumo.id };
      response = await fetch('https://backend.cultivesmart.com.br/api/especificacao_insumos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      // Atualização: PUT para endpoint com id do insumo_estoque, NÃO inclui insumo_id
      const idEstoque = insumoSelecionado.insumo.especificacoes[0].id;
      response = await fetch(`https://backend.cultivesmart.com.br/api/especificacao_insumos/${idEstoque}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadBase),
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    setIsProcessing(false);
  } catch (err) {
    console.error('Erro ao salvar/atualizar especificação:', err);
    setIsProcessing(false);
  }
  window.location.reload();
};

const handleCategorySelect = (category) => {
  setFiltroCategoria(category);  // Atualiza o estado da categoria selecionada
  setFormData(prevState => ({
    ...prevState,
    category: category  // Atualiza o valor da categoria no formData
  }));
};

const handleRetiradaEstoqueSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)

    setMessage(null); // Limpa mensagens anteriores

    if (!selectedInsumoId) {
      setMessage('Por favor, selecione um insumo para retirada.');
      setMessageType('danger');
      return;
    }

    const quantidade = parseFloat(quantidadeRetirada);
    if (isNaN(quantidade) || quantidade <= 0) {
      setMessage('Por favor, insira uma quantidade válida maior que zero.');
      setMessageType('danger');
      return;
    }

//    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/estoque/${selectedInsumoId}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Inclua o token CSRF ou de autenticação se sua API Laravel exigir
          // 'X-CSRF-TOKEN': 'seu-token-csrf-aqui', 
          // 'Authorization': `Bearer ${seuTokenDeAuth}` // Se houver autenticação JWT/Bearer
        },
        body: JSON.stringify({
          quantidade_retirada: quantidade,
          motivo: motivoRetirada || 'Retirada geral', // Use um motivo padrão se não for fornecido
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Se a resposta não for OK (status 4xx ou 5xx), lance um erro com a mensagem da API
        throw new Error(responseData.message || 'Erro ao registrar retirada no estoque.');
      }

      setMessage(`Retirada de ${quantidade}g registrada com sucesso para o insumo!`);
      setMessageType('success');
      setQuantidadeRetirada(''); // Limpa o campo de quantidade
      setMotivoRetirada('');     // Limpa o campo de motivo
      setShowRetiradaEstoqueModal(false);
      // Recarrega a lista de insumos para refletir a nova quantidade disponível

    } catch (error) {
      console.error('Erro na retirada:', error);
      setMessage(`Erro na retirada: ${error.message}`);
      setMessageType('danger');
    } finally {
      //setLoading(false);
    }
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

const formatarCustoGrao = (totalLiquido, quantidade) => {
    const liquido = parseFloat(totalLiquido);
    const qtd = parseFloat(quantidade);

    if (isNaN(liquido) || isNaN(qtd) || qtd <= 0) {
        return 'N/A'; // Evita divisão por zero ou dados inválidos
    }

    const custoPorUnidade = liquido / qtd;
    return custoPorUnidade.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

  return (
    <CContainer>
                     {message && (
                       <CAlert color={messageType} className="mb-3">
                         {message}
                       </CAlert>
                     )}
        <AvisoGerenciarEstoque href="components/buttons/" />
        <CCol xs={12}>
            <CCard className="mb-4">
            <CCardHeader>
                <strong>Insumos - </strong>
                <small>Consulta de Insumos</small>
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
  {estoquesInsumos.records && estoquesInsumos.records.length > 0 ? (
    estoquesInsumos.records.map((estoqueInsumo) => {
      const hasEspecificacoes = estoqueInsumo.insumo.especificacoes && estoqueInsumo.insumo.especificacoes.length > 0; // Para relacionamento hasMany

      // --- INÍCIO DO CÓDIGO AJUSTADO ---
      // Validação e cálculo dos valores para a barra de progresso
      const quantidadeTotalDisponivel = estoqueInsumo.quantidade_total; // Quantidade de insumo em gramas
      const quantidadePorSaco = estoqueInsumo.insumo.quantidade; // Capacidade de um saco em gramas
      const quantidadeTotalSacos = estoqueInsumo.cotacao_insumos.quantidade; // Quantidade de sacos comprados

      // Calcula a capacidade máxima total do estoque (em gramas)
      const capacidadeMaximaTotal = parseFloat(quantidadeTotalSacos) * parseFloat(quantidadePorSaco);

      // Calcula a porcentagem de ocupação do estoque
      let percentualEmEstoque = 0;
      if (capacidadeMaximaTotal > 0) {
        percentualEmEstoque = (parseFloat(quantidadeTotalDisponivel) / capacidadeMaximaTotal) * 100;
      }

      // Arredonda o valor para a barra de progresso
      const valorBarraProgresso = Math.round(percentualEmEstoque);

      // Define a cor da barra de progresso com base no valor
      let corBarraProgresso = 'success';
      if (valorBarraProgresso < 30) {
        corBarraProgresso = 'danger';
      } else if (valorBarraProgresso < 60) {
        corBarraProgresso = 'warning';
      }

      // --- FIM DO CÓDIGO AJUSTADO ---

      const totalLiquido = estoqueInsumo?.cotacao_insumos?.total_liquido;
      const quantidade = estoqueInsumo?.cotacao_insumos?.quantidade * estoqueInsumo?.insumo?.quantidade;

      return (
        <CCard style={{ width: '28%', minWidth: 320, borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} key={estoqueInsumo.id} className="mb-4">
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: 16 }}>
            <CCardImage src={`data:image/png;base64,${estoqueInsumo.insumo.logoPath}`} style={{ width: 100, height: 120, objectFit: 'contain', marginRight: 16 }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
              <CCardTitle style={{ fontSize: 28, fontWeight: 700, textAlign: 'left', marginBottom: 0 }}>{estoqueInsumo.insumo.nome}</CCardTitle>
              <CCardSubtitle style={{ fontSize: 20, fontWeight: 400, textAlign: 'left', marginBottom: 0 }}>{estoqueInsumo.insumo.variedade}</CCardSubtitle>
              <CCardText style={{ fontSize: 16, textAlign: 'left', marginBottom: 0 }}>{(() => {
                const fornecedorObj = fornecedores && fornecedores.records && fornecedores.records.find(f => f.id === estoqueInsumo.insumo.fornecedor_id);
                return fornecedorObj ? fornecedorObj.nome : estoqueInsumo.insumo.fornecedor_id;
              })()}</CCardText>
              <CCardText style={{ fontSize: 16, textAlign: 'left', marginBottom: 0 }}>NF {estoqueInsumo.insumo.nota_fiscal || '-'}</CCardText>
            </div>
          </div>
          <CCardBody style={{ paddingTop: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 22, marginTop: 8, marginBottom: 8 }}>Especificações</div>
            <CRow className="mb-2" style={{ fontSize: 16, alignItems: 'center' }}>
              <CCol xs={4} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>🌱</span> Semeadura:
              </CCol>
              <CCol xs={8} style={{ textAlign: 'right', color: estoqueInsumo.insumo.especificacoes?.[0]?.quantidade_bandeja ? 'inherit' : '#888' }}>
                {estoqueInsumo.insumo.especificacoes?.[0]?.quantidade_bandeja ? `${estoqueInsumo.insumo.especificacoes[0].quantidade_bandeja} g/bandeja` : 'sem espec.'}
              </CCol>
            </CRow>
            <CRow className="mb-2" style={{ fontSize: 16, alignItems: 'center' }}>
              <CCol xs={8} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>🗄️</span> Dias em pilha:
              </CCol>
              <CCol xs={4} style={{ textAlign: 'right', color: estoqueInsumo.insumo.especificacoes?.[0]?.dias_pilha ? 'inherit' : '#888' }}>
                {estoqueInsumo.insumo.especificacoes?.[0]?.dias_pilha || 'sem espec.'}
              </CCol>
            </CRow>
            <CRow className="mb-2" style={{ fontSize: 16, alignItems: 'center' }}>
              <CCol xs={8} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>🌑</span> Dias de blackout:
              </CCol>
              <CCol xs={4} style={{ textAlign: 'right', color: estoqueInsumo.insumo.especificacoes?.[0]?.dias_blackout ? 'inherit' : '#888' }}>
                {estoqueInsumo.insumo.especificacoes?.[0]?.dias_blackout || 'sem espec.'}
              </CCol>
            </CRow>
            <CRow className="mb-2" style={{ fontSize: 16, alignItems: 'center' }}>
              <CCol xs={8} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>⏳</span> Dias até a colheita:
              </CCol>
              <CCol xs={4} style={{ textAlign: 'right', color: estoqueInsumo.insumo.especificacoes?.[0]?.dias_colheita ? 'inherit' : '#888' }}>
                {estoqueInsumo.insumo.especificacoes?.[0]?.dias_colheita || 'sem espec.'}
              </CCol>
            </CRow>
            
             <CProgress value={valorBarraProgresso}>
            <CProgressBar className="overflow-visible text-dark px-2" color={corBarraProgresso}>
            </CProgressBar>
          </CProgress>
            <div style={{ fontSize: 16, marginBottom: 4 }}>Estoque atual: <b>{parseInt(estoqueInsumo.cotacao_insumos.quantidade)} sacos</b></div>
            <div style={{ fontSize: 16, marginBottom: 12 }}>Custo do grão: <b>R$ {formatarCustoGrao(totalLiquido, quantidade)} /g</b></div>
            <CButton color="secondary" variant="outline" style={{ width: '100%', marginBottom: 8 }} onClick={() => handleOpenDetailsModal(estoqueInsumo)}>
              Verificar consumo do estoque
            </CButton>
            <CButton color="primary" variant="outline" style={{ width: '100%', marginBottom: 8 }} onClick={() => handleOpenAdditionalFieldsModal(estoqueInsumo, hasEspecificacoes ? 'atualizar' : 'cadastrar')}>
              {hasEspecificacoes ? 'Editar especificações' : 'Cadastrar Especificações'}
            </CButton>
            <CButton color="danger" variant="outline" style={{ width: '100%' }} onClick={() => handleRetiradaEstoqueModal(estoqueInsumo)}>
              Perda ou Retirada
            </CButton>
          </CCardBody>
        </CCard>
      )
    })
  ) : (
    <CCol xs={12} className="text-center mt-5">
      <CAlert color="info" className="py-4">
        Não existem produtos em estoque adquirido.
      </CAlert>
    </CCol>
  )}
</CRow>
                </DocsExample>
            </CCardBody>
            </CCard>
        </CCol>

        <COffcanvas placement="end" visible={showAdditionalFieldsModal} onHide={() => setShowAdditionalFieldsModal(false)}>
            <COffcanvasHeader>
                <COffcanvasTitle>Especificação</COffcanvasTitle>
                <CCloseButton className="text-reset" onClick={() => setShowAdditionalFieldsModal(false)} />
            </COffcanvasHeader>
            <COffcanvasBody>
            <CRow className="mb-5">
                Informe as especificações técnicas para o plantio, de acordo com...
            </CRow>
            <CForm className="row g-3">
                <CRow className="mb-3">
                    <CFormLabel htmlFor="pilha" className="col-sm-8 col-form-label">Dias em pilha</CFormLabel>
                    <CCol xs={4}>
                        <CFormInput
                            id="pilha"
                            type="number"
                            aria-describedby="basic-addon3"
                            value={editedInsumo.dias_pilha || ''} // Bind ao estado
                            onChange={(e) => setEditedInsumo({...editedInsumo, dias_pilha: e.target.value})} // Para controlar as mudanças (se necessário)
                        />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="blackout" className="col-sm-8 col-form-label">Blackout</CFormLabel>
                    <CCol xs={4}>
                        <CFormInput
                            id="blackout"
                            type="number"
                            aria-describedby="basic-addon3"
                            value={editedInsumo.dias_blackout || ''} // Bind ao estado
                            onChange={(e) => setEditedInsumo({...editedInsumo, dias_blackout: e.target.value})} // Para controlar as mudanças
                        />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="dias_colheita" className="col-sm-8 col-form-label">Dias até a colheita</CFormLabel>
                    <CCol xs={4}>
                        <CFormInput
                            id="dias_colheita"
                            type="number"
                            aria-describedby="basic-addon3"
                            value={editedInsumo.dias_colheita || ''} // Bind ao estado
                            onChange={(e) => setEditedInsumo({...editedInsumo, dias_colheita: e.target.value})} // Para controlar as mudanças
                        />
                    </CCol>
                </CRow>
                <hr />
                <CRow className="mb-3">
                    <CFormLabel htmlFor="quantidade_bandeja" className="col-sm-8 col-form-label">Gramas para plantio</CFormLabel>
                    <CCol xs={4}>
                        <CFormInput
                            id="quantidade_bandeja"
                            type="number"
                            aria-describedby="basic-addon3"
                            value={editedInsumo.quantidade_bandeja || ''} // Bind ao estado
                            onChange={(e) => setEditedInsumo({...editedInsumo, quantidade_bandeja: e.target.value})} // Para controlar as mudanças
                        />
                    </CCol>
                </CRow>
                <CButton color="success" variant="outline" onClick={handleSaveAdditionalFields}>
              { isProcessing ? <CSpinner as="span" className="me-2" size="sm" aria-hidden="true" /> : null  }
              {modalMode === 'cadastrar' ? 'Cadastrar' : 'Atualizar'}
            </CButton>

        </CForm>
    </COffcanvasBody>
        </COffcanvas>

        <CModal
            alignment="center"
            size="xl"
            visible={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            aria-labelledby="InsumoDetalhesModalLabel"
        >
            <CModalHeader>
            <CModalTitle id="InsumoDetalhesModalLabel">Detalhes do Insumo</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {insumoSelecionado && (
                    <CTabs key={insumoSelecionado.id} activeItemKey={1}>
                        <CTabList variant="underline">
                            <CTab aria-controls="home-tab-pane" itemKey={1}>Dados Gerais</CTab>
                            <CTab aria-controls="profile-tab-pane" itemKey={2}>Evolução estoque</CTab>
                            <CTab aria-controls="contact-tab-pane" itemKey={3}>Histórico de Retiradas</CTab>
                        </CTabList>
                        <CTabContent>
                            <CTabPanel className="p-3" aria-labelledby="home-tab-pane" itemKey={1}>
                                <CRow>
                                    <CCol md="4">
                                        <CCardImage src={`data:image/png;base64,${insumoDetail.foto}`} />
                                    </CCol>
                                    <CCol md="8">
                                        <h2>{insumoDetail.nome}</h2>
                                        <p>{insumoDetail.descricao}</p>
                                        <p>
                                            <strong>Preço Unitário:</strong> R$ {insumoDetail.precoUnitario && insumoDetail.precoUnitario.toFixed(2)}
                                        </p>
                                        {insumoDetail.precoPorGrama && (
                                            <p>
                                            <strong>Preço por Grama:</strong> R$ {insumoDetail.precoPorGrama.toFixed(2)}/g
                                            </p>
                                        )}
                                        <p>
                                            <strong>Fornecedor:</strong> {insumoDetail.fornecedor}
                                        </p>
                                        <p>
                                            <strong>Nota Fiscal:</strong> {insumoDetail.notaFiscal}
                                        </p>
                                        
                                    </CCol>
                                </CRow>
                            </CTabPanel>
                            <CTabPanel className="p-3" aria-labelledby="profile-tab-pane" itemKey={2}>
                                <h4 className="mt-4">Evolução de Uso dos Sacos</h4>
                                {/* Verifica se o array existe e se tem elementos */}
                                {insumoDetail.usoSacos && insumoDetail.usoSacos.length > 0 ? (
                                    insumoDetail.usoSacos.map((uso, index) => (
                                        <div key={index}> {/* Use uma div para encapsular o progresso e o texto */}
                                            <small>Saco {index + 1}</small>
                                            <CProgress
                                                className="mb-2"
                                                color={
                                                    uso < 30 ? 'danger' : uso < 60 ? 'warning' : uso < 85 ? 'info' : 'success'
                                                }
                                                value={uso}
                                            >
                                                {/* A barra de progresso agora exibe a porcentagem do uso */}
                                                <CProgressBar>{uso}%</CProgressBar>
                                            </CProgress>
                                        </div>
                                    ))
                                ) : (
                                    <p>Não há informações sobre o uso dos sacos.</p>
                                )}
                            </CTabPanel>
                            <CTabPanel className="p-3" aria-labelledby="contact-tab-pane" itemKey={3}>
                            <h4 className="mt-4">Histórico de Movimentações</h4>
                            {isFetchingMovements ? (
                                <div className="text-center mt-5">
                                    <CSpinner />
                                    <p>Carregando histórico...</p>
                                </div>
                            ) : movimentacoesEstoque.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Tipo</th>
                                                <th>Quantidade</th>
                                                <th>Motivo</th>
                                                <th>Data</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {movimentacoesEstoque.map((movimentacao) => (
                                                <tr key={movimentacao.id}>
                                                    <td>
                                                        {movimentacao.quantidade_retirada > 0 ? (
                                                            <CBadge color="danger">Retirada</CBadge>
                                                        ) : (
                                                            <CBadge color="success">Entrada</CBadge>
                                                        )}
                                                    </td>
                                                    <td>{movimentacao.quantidade_retirada}</td>
                                                    <td>{movimentacao.motivo || 'N/A'}</td>
                                                    <td>{new Date(movimentacao.created_at).toLocaleString('pt-BR')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>Não há movimentações registradas para este insumo.</p>
                            )}
                        </CTabPanel>
                            <CTabPanel className="p-3" aria-labelledby="disabled-tab-pane" itemKey={4}>
                            Disabled tab content
                            </CTabPanel>
                        </CTabContent>
                    </CTabs>
                )}
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setShowDetailsModal(false)}>
                    Fechar
                </CButton>
                <CButton color="info" onClick={print} className="ms-2">
                    <CIcon icon={cilPrint} /> Imprimir
                </CButton>
            </CModalFooter>
        </CModal>

        
            <CModal
                alignment="center"
                size="xl"
                visible={showRetiradaEstoqueModal}
                onClose={() => setShowRetiradaEstoqueModal(false)}
                aria-labelledby="InsumoRetiradaModalLabel"
            >
                <CModalHeader>
                <CModalTitle id="InsumoRetiradaModalLabel">Retirada do Estoque</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleRetiradaEstoqueSubmit}>
                    <CModalBody>
                            <CContainer className="mt-4">
                                <CRow className="justify-content-center">
                                    <CCol md={8} lg={6}>                    
                        
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="quantidadeRetirada">Quantidade a Retirar:</CFormLabel>
                                            <CInputGroup>
                                            <CFormInput
                                                type="number"
                                                id="quantidadeRetirada"
                                                value={quantidadeRetirada}
                                                onChange={(e) => setQuantidadeRetirada(e.target.value)}
                                                placeholder="Ex: 500"
                                                step="0.01"
                                                min="0.01"
                                                required
                                            />
                                            <CInputGroupText>gramas</CInputGroupText>
                                            </CInputGroup>
                                        </div>
                        
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="motivoRetirada">Motivo da Retirada (Opcional):</CFormLabel>
                                            <CFormInput
                                            as="textarea"
                                            id="motivoRetirada"
                                            value={motivoRetirada}
                                            onChange={(e) => setMotivoRetirada(e.target.value)}
                                            rows="2"
                                            placeholder="Ex: Plantio de nova safra, Descarte por perda, etc."
                                            />
                                        </div>
                        
                                        
                                    </CCol>
                                </CRow>
                                </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setShowDetailsModal(false)}>
                            Fechar
                        </CButton>
                        <CButton color="primary" type="submit">
                            Retirar do Estoque
                        </CButton>
                    </CModalFooter>
                </CForm>
            </CModal>
        
    </CContainer>
    )

};

export default EstoqueVisaoGeral;