import React, { useState, useMemo, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { AvisoCotacao } from 'src/components';
import {
  CButton,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTab,
  CTabs,
  CTabList,
  CTabContent,
  CTabPanel,
  CTableBody,
  CTableDataCell,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModal,
  CModalFooter,
  CRow,
  CCardTitle,
  CCardText,
  CCardSubtitle,
  CCardImage,
  CForm,
  CSpinner,
  CProgress,
  CProgressBar,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import {
  cilCaretTop,
  cilCaretBottom,
  cilCart,
  cilPrint,
  cilSave,
  cilWarning,
  cilCalendar,
  cilLeaf,
  cilMoon,
  cilBasket,
  cilListNumbered
} from '@coreui/icons'
import { DocsExample, EstoqueArea } from 'src/components';
import { OrcamentoArea } from '../../components';

const CadastroSemeaduraBerta = () => {
  const [insumos, setInsumos] = useState([]);
  const [insumosPlantio, setInsumosPlantio] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [visible, setVisible] = useState(false)
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [isProcessing, setIsProcessing] = useState(false)
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroFornecedor, setFiltroFornecedor] = useState('');
  const [codigoLote, setCodigoLote] = useState('');
  const [recorrencia, setRecorrencia] = useState('unico');
  const [dataPlantio, setDataPlantio] = useState(new Date().toISOString().split('T')[0]);
  const [bandejasUtilizadas, setBandejasUtilizadas] = useState(0);
  const [tarefasPreview, setTarefasPreview] = useState([]);

  // Função para atualizar preview das tarefas quando data do plantio muda
  useEffect(() => {
    if (dataPlantio && insumosPlantio.length > 0) {
      const novaDataPlantio = createLocalDate(dataPlantio);
      const todasTarefas = [];
      
      insumosPlantio.forEach(insumo => {
        const insumoCompleto = insumos.records && insumos.records.find(i => i.id === insumo.id);
        const tarefasInsumo = gerarTarefasPlantio(insumoCompleto || insumo, insumo.bandejas_necessarias, novaDataPlantio);
        todasTarefas.push(...tarefasInsumo.map(tarefa => ({
          ...tarefa,
          insumo: insumo.nome + (insumo.variedade ? ` ${insumo.variedade}` : '')
        })));
      });
      
      // Ordena tarefas por data
      todasTarefas.sort((a, b) => a.data - b.data);
      setTarefasPreview(todasTarefas);
    } else {
      setTarefasPreview([]);
    }
  }, [dataPlantio, insumosPlantio, insumos]);

  // Atualizar automaticamente o total de bandejas quando insumos mudarem
  useEffect(() => {
    const totalBandejas = insumosPlantio.reduce((total, insumo) => total + (insumo.bandejas_necessarias || 0), 0);
    setBandejasUtilizadas(totalBandejas);
  }, [insumosPlantio]);

  const adicionarInsumoPlantio = (insumo) => {
    setInsumosPlantio((previnsumosPlantio) => {
      const precoString = typeof insumo.preco === 'string' ? insumo.preco : '0';
      const precoNumerico = parseFloat(precoString.replace(/[^\d]/g, '')) / 100 || 0;
      const impostoString = typeof insumo.imposto === 'string' ? insumo.imposto : '0';
      const impostoNumerico = parseFloat(impostoString.replace(/[^\d]/g, '')) / 100 || 0;
      const descontoString = typeof insumo.desconto === 'string' ? insumo.desconto : '0';
      const descontoNumerico = parseFloat(descontoString.replace(/[^\d]/g, '')) / 100 || 0;
      const novoInsumo = {
        ...insumo,
        preco: precoNumerico,
        bandejas_necessarias: 1,
        imposto: impostoNumerico,
        desconto: descontoNumerico,
      };
      return [...previnsumosPlantio, novoInsumo];
    });
  };

  const handleGerarPlantio = () => {
    setVisible(true);
    };

  const handleConfirmarPlantio = async () => {
    // Validar se o código do lote foi preenchido
    if (!codigoLote.trim()) {
      alert('Por favor, informe o código ou nome do lote antes de confirmar o plantio.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Lógica para recorrência - gerar datas de plantio baseadas na recorrência
      let datasPlantio = [];
      const primeiraData = createLocalDate(dataPlantio);
      let meses = 0;
      
      if (recorrencia === '1mes') meses = 1;
      else if (recorrencia === '3meses') meses = 3;
      else if (recorrencia === '6meses') meses = 6;

      if (meses > 0) {
        // Gerar datas para o período de recorrência (semanalmente)
        const dataAtual = new Date(primeiraData);
        const dataFinal = new Date(primeiraData);
        dataFinal.setMonth(dataFinal.getMonth() + meses);
        
        // Gerar plantios semanalmente (a cada 7 dias)
        while (dataAtual <= dataFinal) {
          datasPlantio.push(new Date(dataAtual));
          // Avança para a próxima semana (7 dias)
          dataAtual.setDate(dataAtual.getDate() + 7);
        }
      } else {
        // Plantio único
        datasPlantio = [primeiraData];
      }

      // Remove datas duplicadas e ordena (usando formatação local segura)
      const datasUnicas = new Set();
      datasPlantio.forEach(d => {
        const dataLocal = formatDateLocal(d); // Formato YYYY-MM-DD local
        datasUnicas.add(dataLocal);
      });
      
      datasPlantio = Array.from(datasUnicas)
        .map(dateStr => createLocalDate(dateStr)) // Reconverte usando createLocalDate
        .sort((a, b) => a - b);

      // Para cada data de plantio, criar plantios e tarefas
      for (const dataPlantioAtual of datasPlantio) {
        // Para cada insumo selecionado, criar um plantio
        for (const insumo of insumosPlantio) {
          const insumoCompleto = insumos.records && insumos.records.find(i => i.insumo_id === insumo.id);
          const espec = insumoCompleto.insumo?.especificacoes?.[0];
          
          if (!espec) {
            console.warn(`Especificação não encontrada para o insumo ${insumo.nome}`);
            continue;
          }

          // Criar o plantio
          const plantioData = {
            data_plantio: formatDateLocal(dataPlantioAtual),
            nome: `Lote ${codigoLote} - Plantio de ${insumo.nome} ${insumo.variedade || ''}`.trim(),
            variedade: insumo.variedade || '',
            bandejas_necessarias: insumo.bandejas_necessarias || 0,
            status: "planejado",
            recorrencia: recorrencia,
            observacoes: `Lote: ${codigoLote} | Recorrência: ${recorrencia === 'unico' ? 'Único' : recorrencia === '1mes' ? '1 Mês' : recorrencia === '3meses' ? '3 Meses' : '6 Meses'} | Plantio de ${insumo.bandejas_necessarias} bandejas - Custo por bandeja: ${formatarPreco(calcularCustoPorBandeja(insumoCompleto || insumo))}`,
            insumo_id: insumo.id,
            area_plantio: "Área principal"
          };

          // Salvar o plantio
          const plantioResponse = await fetch('https://backend.cultivesmart.com.br/api/plantios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plantioData)
          });
          
          if (!plantioResponse.ok) {
            throw new Error(`Erro ao salvar plantio de ${plantioData.nome}`);
          }
          
          const plantioSalvo = await plantioResponse.json();
          console.log('Plantio salvo com sucesso:', plantioSalvo);

          // Gerar tarefas automáticas baseadas nas especificações
          const tarefas = [];
          
          // Tarefa de Plantio
          tarefas.push({
            lote_id: plantioSalvo.id,
            tipo: 'plantio',
            descricao: `Plantio de ${insumo.bandejas_necessarias} bandejas - ${insumo.nome} ${insumo.variedade || ''}`,
            data_agendada: formatDateLocal(dataPlantioAtual),
            status: 'pending',
          });

          // Tarefa de Desempilhamento (se especificado)
          if (espec.dias_pilha && espec.dias_pilha > 0) {
            const dataDesempilhamento = new Date(dataPlantioAtual);
            dataDesempilhamento.setDate(dataDesempilhamento.getDate() + parseInt(espec.dias_pilha));
            tarefas.push({
              lote_id: plantioSalvo.id,
              tipo: 'desempilhamento',
              descricao: `Desempilhar após ${espec.dias_pilha} dias em pilha`,
              data_agendada: formatDateLocal(dataDesempilhamento),
              status: 'pending',
            });
          }

          // Tarefa de Blackout (se especificado)
          if (espec.dias_blackout && espec.dias_blackout > 0) {
            const dataBlackout = new Date(dataPlantioAtual);
            const diasAntes = (espec.dias_pilha || 0) + parseInt(espec.dias_blackout);
            dataBlackout.setDate(dataBlackout.getDate() + diasAntes);
            tarefas.push({
              lote_id: plantioSalvo.id,
              tipo: 'blackout',
              descricao: `Blackout por ${espec.dias_blackout} dias`,
              data_agendada: formatDateLocal(dataBlackout),
              status: 'pending',
            });
          }

          // Tarefa de Colheita (se especificado)
          if (espec.dias_colheita && espec.dias_colheita > 0) {
            const dataColheita = new Date(dataPlantioAtual);
            const diasAntes = (espec.dias_pilha || 0) + (espec.dias_blackout || 0) + parseInt(espec.dias_colheita);
            dataColheita.setDate(dataColheita.getDate() + diasAntes);
            tarefas.push({
              lote_id: plantioSalvo.id,
              tipo: 'colheita',
              descricao: `Colheita após ${espec.dias_colheita} dias`,
              data_agendada: formatDateLocal(dataColheita),
              status: 'pending',
            });
          }

          // Salvar todas as tarefas
          for (const tarefa of tarefas) {
            const tarefaResponse = await fetch('https://backend.cultivesmart.com.br/api/tarefas', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(tarefa),
            });
            
            if (!tarefaResponse.ok) {
              console.error(`Erro ao salvar tarefa: ${tarefa.descricao}`);
            } else {
              console.log(`Tarefa salva: ${tarefa.descricao}`);
            }
          }
        }
      }
      
      setIsProcessing(false);
      setVisible(false);
      setInsumosPlantio([]);
      setCodigoLote('');
      setRecorrencia('unico');
      setDataPlantio(new Date().toISOString().split('T')[0]); // Resetar para data atual
      
      const totalPlantios = datasPlantio.length * insumosPlantio.length;
      alert(`${totalPlantios} plantios e suas tarefas foram salvos com sucesso!`);
        
    } catch (error) {
      console.error('Erro ao salvar plantios:', error);
      setIsProcessing(false);
      alert('Erro ao salvar plantios: ' + error.message);
    }
  };

    const getUnidadeMedidaDescricao = (id) => {
        const unidade = unidadesMedida && unidadesMedida.length > 0
        && unidadesMedida.find((u) => u.id === parseInt(id));
        return unidade ? unidade.sigla : '';
    };

const handlerSalvarCotacao = () => {

  const dataAtual = new Date();  
  const fornecedorId = insumosPlantio.length > 0 ? insumosPlantio[0].fornecedor_id : null;

  const imposto = 0; // Substitua pelo valor correto do imposto, se disponível
  const desconto = 0; // Substitua pelo valor correto do desconto, se disponível

  const insumosFormatados = insumosPlantio.map(insumo => ({
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
    return insumosPlantio.reduce((total, insumo) => total + insumo.preco * (insumo.quantidade_estoque || 0), 0);
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
    return insumosPlantio.map((insumo) => {
      const insumoCompleto = insumos.records && insumos.records.find(i => i.id === insumo.id);
      const custoPorBandeja = calcularCustoPorBandeja(insumoCompleto || insumo);
      const precoTotal = custoPorBandeja * (insumo.bandejas_necessarias || 0);
      const fornecedor = fornecedoresLookup[insumo.fornecedor_id];
      return {
        fornecedor: fornecedor ? fornecedor.nome : 'Fornecedor não encontrado',
        nome: insumo.nome,
        variedade: insumo.variedade,
        bandejas_necessarias: insumo.bandejas_necessarias,
        preco: formatarPreco(custoPorBandeja),
        preco_total: formatarPreco(precoTotal),
        _cellProps: { nome: { scope: 'row' } },
      };
    });
  }, [insumosPlantio, fornecedores, insumos]);

  const incrementar = (insumo) => {
    setInsumosPlantio((prevInsumos) =>
      prevInsumos.map((item) =>
        item.id === insumo.id ? { ...item, bandejas_necessarias: (item.bandejas_necessarias || 0) + 1 } : item
      )
    );
  };

  const decrementar = (insumo) => {
    setInsumosPlantio((prevInsumos) =>
      prevInsumos.reduce((acc, item) => {
        if (item.id === insumo.id) {
          if ((item.bandejas_necessarias || 0) > 1) {
            acc.push({ ...item, bandejas_necessarias: item.bandejas_necessarias - 1 });
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

  // Função utilitária para gerar tarefas do plantio para cada insumo
  const gerarTarefasPlantio = (insumo, quantidadeBandejas, dataBase = new Date()) => {
    const espec = insumo.especificacoes && insumo.especificacoes[0];
    if (!espec) return [];
    const tarefas = [];
    const dataPlantio = new Date(dataBase);
    tarefas.push({
      tipo: 'plantio',
      descricao: `Plantio de ${quantidadeBandejas} bandejas (${espec.gramas_para_plantio || espec.quantidade_bandeja || '-'}g/bandeja)`,
      data: new Date(dataPlantio),
      icone: cilLeaf,
      cor: 'success',
    });
    let dataAtual = new Date(dataPlantio);
    if (espec.dias_pilha && espec.dias_pilha > 0) {
      dataAtual = new Date(dataAtual);
      dataAtual.setDate(dataAtual.getDate() + parseInt(espec.dias_pilha));
      tarefas.push({
        tipo: 'desempilhamento',
        descricao: `Desempilhar após ${espec.dias_pilha} dias em pilha`,
        data: new Date(dataAtual),
        icone: cilListNumbered,
        cor: 'info',
      });
    }
    if (espec.dias_blackout && espec.dias_blackout > 0) {
      dataAtual = new Date(dataAtual);
      dataAtual.setDate(dataAtual.getDate() + parseInt(espec.dias_blackout));
      tarefas.push({
        tipo: 'blackout',
        descricao: `Blackout por ${espec.dias_blackout} dias`,
        data: new Date(dataAtual),
        icone: cilMoon,
        cor: 'dark',
      });
    }
    if (espec.dias_colheita && espec.dias_colheita > 0) {
      dataAtual = new Date(dataAtual);
      dataAtual.setDate(dataAtual.getDate() + parseInt(espec.dias_colheita));
      tarefas.push({
        tipo: 'colheita',
        descricao: `Colheita após ${espec.dias_colheita} dias`,
        data: new Date(dataAtual),
        icone: cilBasket,
        cor: 'warning',
      });
    }

    return tarefas;
  };

  // Função para formatar data no formato local
  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Função para criar data local sem conversão de timezone
  const createLocalDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  return (
    <CContainer>
      <style>
        {`
          /* Estilo para destacar dias válidos no date picker */
          input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(0.5);
          }
          
          /* Tooltip para datas válidas */
          .date-input-container {
            position: relative;
          }
          
          .date-help-text {
            font-size: 0.875rem;
            color: #6c757d;
            margin-top: 0.25rem;
          }
        `}
      </style>
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
                        const temEspecificacao = estoque.insumo.especificacoes && estoque.insumo.especificacoes.length > 0;
                        return categoriaMatch && nomeMatch && fornecedorMatch && temEspecificacao;
                      })
                      .map((estoque) => {
                        const quantidadeTotalDisponivel = estoque.quantidade_total; // Quantidade de insumo em gramas
                        const quantidadePorSaco = estoque.insumo.quantidade; // Capacidade de um saco em gramas
                        const quantidadeTotalSacos = estoque.cotacao_insumos.quantidade; // Quantidade de sacos comprados
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
                              <div style={{ fontSize: 14, color: '#666', marginBottom: 6, fontWeight: 500 }}>
                                Estoque de sementes disponível:
                              </div>
                               <CProgress value={valorBarraProgresso}>
                                          <CProgressBar className="overflow-visible text-dark px-2" color={corBarraProgresso}>
                                            {quantidadeTotalDisponivel}g / {capacidadeMaximaTotal}g
                                          </CProgressBar>
                                        </CProgress>
                              <div style={{ marginTop: 12 }}>
                                <div style={{ fontSize: 15, color: '#888', marginBottom: 8 }}>Bandejas para plantio:</div>
                                <CInputGroup>
                                  <CButton 
                                    color="danger" 
                                    variant="outline"
                                    onClick={() => decrementar(estoque.insumo)} 
                                    disabled={!(insumosPlantio.find(item => item.id === estoque.insumo.id)?.bandejas_necessarias > 0)}
                                    style={{ borderRadius: '6px 0 0 6px', zIndex: 1 }}
                                  >
                                    −
                                  </CButton>
                                  <CFormInput
                                    type="number"
                                    value={insumosPlantio.find(item => item.id === estoque.insumo.id)?.bandejas_necessarias || 0}
                                    min={0}
                                    style={{ 
                                      textAlign: 'center', 
                                      fontWeight: 600, 
                                      fontSize: 16,
                                      border: '1px solid #d8dbe0',
                                      borderLeft: 'none',
                                      borderRight: 'none'
                                    }}
                                    readOnly
                                  />
                                  <CButton 
                                    color="success" 
                                    variant="outline"
                                    onClick={() => {
                                      if (insumosPlantio.some(item => item.id === estoque.insumo.id)) {
                                        incrementar(estoque.insumo);
                                      } else {
                                        adicionarInsumoPlantio(estoque.insumo);
                                      }
                                    }}
                                    style={{ borderRadius: '0 6px 6px 0', zIndex: 1 }}
                                  >
                                    +
                                  </CButton>
                                </CInputGroup>
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
                    color={insumosPlantio.length <= 0 ? 'default' : 'success'}
                    className="rounded-0"
                    disabled={insumosPlantio.length <= 0}
                     onClick={() =>
                        handleGerarPlantio()
                      }
                  >
                    Gerar Plantio
                  </CButton>
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
                <CModalTitle id="VerticallyCenteredExample">Simular Plantio</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {/* Campo para código/nome do lote */}
                <div className="mb-4">
                  <CCard>
                    <CCardHeader>
                      <CIcon icon={cilListNumbered} className="me-2" /> Informações do Lote
                    </CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol md={6}>
                          <CFormInput
                            type="text"
                            label="Código/Nome do Lote"
                            placeholder="Digite o código ou nome do lote..."
                            value={codigoLote}
                            onChange={(e) => setCodigoLote(e.target.value)}
                            required
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormInput
                            type="date"
                            label="Data do Plantio"
                            value={dataPlantio}
                            onChange={(e) => setDataPlantio(e.target.value)}
                            required
                          />
                        </CCol>
                        
                        <CCol md={3}>
                          <CFormSelect
                            label="Recorrência"
                            value={recorrencia}
                            onChange={(e) => setRecorrencia(e.target.value)}
                          >
                            <option value="unico">Único</option>
                            <option value="1mes">1 Mês</option>
                            <option value="3meses">3 Meses</option>
                            <option value="6meses">6 Meses</option>
                          </CFormSelect>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </div>

                {/* Preview das tarefas agendadas */}
                {tarefasPreview.length > 0 && (
                  <div className="mb-4">
                    <CCard>
                      <CCardHeader>
                        <CIcon icon={cilCalendar} className="me-2" /> Cronograma de Tarefas
                      </CCardHeader>
                      <CCardBody>
                        <div className="mb-3">
                          <small className="text-muted">
                            Tarefas que serão criadas automaticamente baseadas na data de plantio selecionada
                          </small>
                        </div>
                        
                        {/* CTabs para agrupar tarefas por insumo */}
                        <CTabs activeItemKey={1}>
                          <CTabList variant="underline">
                            {insumosPlantio.map((insumo, index) => (
                              <CTab 
                                key={insumo.id} 
                                aria-controls={`insumo-tab-${insumo.id}`} 
                                itemKey={index + 1}
                              >
                                <CIcon icon={cilLeaf} className="me-2" />
                                {insumo.nome} {insumo.variedade && `- ${insumo.variedade}`}
                              </CTab>
                            ))}
                          </CTabList>
                          <CTabContent>
                            {insumosPlantio.map((insumo, index) => {
                              const tarefasDoInsumo = tarefasPreview.filter(tarefa => 
                                tarefa.insumo === insumo.nome + (insumo.variedade ? ` ${insumo.variedade}` : '')
                              );
                              
                              return (
                                <CTabPanel 
                                  key={insumo.id}
                                  className="p-3" 
                                  aria-labelledby={`insumo-tab-${insumo.id}`} 
                                  itemKey={index + 1}
                                >
                                  {tarefasDoInsumo.length > 0 ? (
                                    <CTable responsive striped hover>
                                      <CTableHead>
                                        <CTableRow>
                                          <CTableHeaderCell>Data</CTableHeaderCell>
                                          <CTableHeaderCell>Tarefa</CTableHeaderCell>
                                          <CTableHeaderCell>Descrição</CTableHeaderCell>
                                        </CTableRow>
                                      </CTableHead>
                                      <CTableBody>
                                        {tarefasDoInsumo.map((tarefa, tarefaIndex) => (
                                          <CTableRow key={tarefaIndex}>
                                            <CTableDataCell>
                                              <strong>{tarefa.data.toLocaleDateString('pt-BR')}</strong>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                              <CIcon icon={tarefa.icone} className={`text-${tarefa.cor} me-2`} />
                                              {tarefa.tipo.charAt(0).toUpperCase() + tarefa.tipo.slice(1)}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                              {tarefa.descricao}
                                            </CTableDataCell>
                                          </CTableRow>
                                        ))}
                                      </CTableBody>
                                    </CTable>
                                  ) : (
                                    <div className="text-center py-4">
                                      <p className="text-muted">Nenhuma tarefa encontrada para este insumo.</p>
                                    </div>
                                  )}
                                </CTabPanel>
                              );
                            })}
                          </CTabContent>
                        </CTabs>
                      </CCardBody>
                    </CCard>
                  </div>
                )}
                            
                
                {/* Resumo do plantio */}
                <div className="mt-4">
                  <CCard>
                    <CCardHeader>
                      <CIcon icon={cilBasket} className="me-2" /> Resumo do Plantio
                    </CCardHeader>
                    <CCardBody>
                      {/* CTabs para resumo por insumo e geral */}
                      <CTabs activeItemKey="geral">
                        <CTabList variant="underline">
                          <CTab 
                            aria-controls="resumo-geral-tab" 
                            itemKey="geral"
                          >
                            <CIcon icon={cilBasket} className="me-2" />
                            Resumo Geral
                          </CTab>
                          {insumosPlantio.map((insumo, index) => (
                            <CTab 
                              key={insumo.id} 
                              aria-controls={`resumo-insumo-tab-${insumo.id}`} 
                              itemKey={`insumo-${insumo.id}`}
                            >
                              <CIcon icon={cilLeaf} className="me-2" />
                              {insumo.nome} {insumo.variedade && `- ${insumo.variedade}`}
                            </CTab>
                          ))}
                        </CTabList>
                        <CTabContent>
                          {/* Tab Resumo Geral */}
                          <CTabPanel 
                            className="p-3" 
                            aria-labelledby="resumo-geral-tab" 
                            itemKey="geral"
                          >
                            <div style={{fontSize: 16, marginBottom: 20}}>
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <strong>Total de bandejas utilizadas:</strong> {bandejasUtilizadas}
                                  </div>
                                  <div className="mb-3">
                                    <strong>Custo total do plantio:</strong> {formatarPreco(insumosPlantio.reduce((acc, i) => {
                                      const insumoCompleto = insumos.records && insumos.records.find(x => x.id === i.id);
                                      const custoPorBandeja = calcularCustoPorBandeja(insumoCompleto || i);
                                      return acc + custoPorBandeja * (i.bandejas_necessarias || 0);
                                    }, 0))}
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <strong>Data de plantio:</strong> {createLocalDate(dataPlantio).toLocaleDateString('pt-BR')}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Tabela resumo geral */}
                            <CTable responsive striped hover>
                              <CTableHead>
                                <CTableRow>
                                  <CTableHeaderCell>Insumo</CTableHeaderCell>
                                  <CTableHeaderCell>Variedade</CTableHeaderCell>
                                  <CTableHeaderCell>Bandejas</CTableHeaderCell>
                                  <CTableHeaderCell>Custo por Bandeja</CTableHeaderCell>
                                  <CTableHeaderCell>Custo Total</CTableHeaderCell>
                                </CTableRow>
                              </CTableHead>
                              <CTableBody>
                                {insumosPlantio.map((insumo) => {
                                  const insumoCompleto = insumos.records && insumos.records.find(i => i.id === insumo.id);
                                  const custoPorBandeja = calcularCustoPorBandeja(insumoCompleto || insumo);
                                  const custoTotal = custoPorBandeja * (insumo.bandejas_necessarias || 0);
                                  return (
                                    <CTableRow key={insumo.id}>
                                      <CTableDataCell>{insumo.nome}</CTableDataCell>
                                      <CTableDataCell>{insumo.variedade || '-'}</CTableDataCell>
                                      <CTableDataCell><strong>{insumo.bandejas_necessarias}</strong></CTableDataCell>
                                      <CTableDataCell>{formatarPreco(custoPorBandeja)}</CTableDataCell>
                                      <CTableDataCell><strong>{formatarPreco(custoTotal)}</strong></CTableDataCell>
                                    </CTableRow>
                                  );
                                })}
                              </CTableBody>
                            </CTable>
                          </CTabPanel>

                          {/* Tabs para cada insumo */}
                          {insumosPlantio.map((insumo) => {
                            const insumoCompleto = insumos.records && insumos.records.find(i => i.id === insumo.id);
                            const especificacao = insumoCompleto?.especificacoes?.[0];
                            const custoPorBandeja = calcularCustoPorBandeja(insumoCompleto || insumo);
                            const custoTotal = custoPorBandeja * (insumo.bandejas_necessarias || 0);
                            
                            // Calcula data de colheita para este insumo específico
                            const diasTotais = (especificacao?.dias_pilha || 0) + 
                                             (especificacao?.dias_blackout || 0) + 
                                             (especificacao?.dias_colheita || 0);
                            const dataColheita = new Date(createLocalDate(dataPlantio));
                            dataColheita.setDate(dataColheita.getDate() + diasTotais);
                            
                            return (
                              <CTabPanel 
                                key={insumo.id}
                                className="p-3" 
                                aria-labelledby={`resumo-insumo-tab-${insumo.id}`} 
                                itemKey={`insumo-${insumo.id}`}
                              >
                                <div style={{fontSize: 16, marginBottom: 20}}>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <strong>Nome:</strong> {insumo.nome}
                                      </div>
                                      <div className="mb-3">
                                        <strong>Variedade:</strong> {insumo.variedade || 'Não especificada'}
                                      </div>
                                      <div className="mb-3">
                                        <strong>Total de bandejas:</strong> {insumo.bandejas_necessarias}
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <strong>Custo por bandeja:</strong> {formatarPreco(custoPorBandeja)}
                                      </div>
                                      <div className="mb-3">
                                        <strong>Custo total do insumo:</strong> {formatarPreco(custoTotal)}
                                      </div>
                                      <div className="mb-3">
                                        <strong>Data de colheita estimada:</strong> {dataColheita.toLocaleDateString('pt-BR')}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Informações técnicas do insumo */}
                                {especificacao && (
                                  <div className="mt-3">
                                    <h6 className="mb-3">Especificações Técnicas:</h6>
                                    <div className="row">
                                      <div className="col-md-4">
                                        <small className="text-muted">Gramas por bandeja:</small><br/>
                                        <strong>{especificacao.gramas_para_plantio || especificacao.quantidade_bandeja || 'Não especificado'}</strong>
                                      </div>
                                      <div className="col-md-4">
                                        <small className="text-muted">Dias em pilha:</small><br/>
                                        <strong>{especificacao.dias_pilha || 0} dias</strong>
                                      </div>
                                      <div className="col-md-4">
                                        <small className="text-muted">Dias de blackout:</small><br/>
                                        <strong>{especificacao.dias_blackout || 0} dias</strong>
                                      </div>
                                    </div>
                                    <div className="row mt-2">
                                      <div className="col-md-4">
                                        <small className="text-muted">Dias para colheita:</small><br/>
                                        <strong>{especificacao.dias_colheita || 0} dias</strong>
                                      </div>
                                      <div className="col-md-4">
                                        <small className="text-muted">Ciclo total:</small><br/>
                                        <strong>{diasTotais} dias</strong>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </CTabPanel>
                            );
                          })}
                        </CTabContent>
                      </CTabs>
                    </CCardBody>
                  </CCard>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)} disabled={isProcessing}>
                    Cancelar
                </CButton>
                <CButton color="success" onClick={handleConfirmarPlantio} disabled={isProcessing || !codigoLote.trim()}>
                    {isProcessing && <CSpinner as="span" size="sm" className="me-2" />}
                    {isProcessing ? 'Processando...' : 'Confirmar Plantio'}
                </CButton>
            </CModalFooter>
        </CModal>

      </CForm>
    </CContainer>



  );
};

export default CadastroSemeaduraBerta;