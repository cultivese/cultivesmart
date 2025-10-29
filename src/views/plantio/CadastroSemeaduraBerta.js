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
  const [tarefasPreview, setTarefasPreview] = useState([]);

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
      const primeiraData = new Date(dataPlantio);
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

      // Remove datas duplicadas e ordena
      datasPlantio = Array.from(new Set(datasPlantio.map(d => d.toISOString().slice(0,10))))
        .map(d => new Date(d))
        .sort((a,b) => a-b);

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
      data: dataPlantio,
      icone: cilLeaf,
      cor: 'success',
    });
    let dataAtual = new Date(dataPlantio);
    if (espec.dias_pilha && espec.dias_pilha > 0) {
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
                        <CCol md={4}>
                          <CFormInput
                            type="text"
                            label="Código/Nome do Lote"
                            placeholder="Digite o código ou nome do lote..."
                            value={codigoLote}
                            onChange={(e) => setCodigoLote(e.target.value)}
                            required
                          />
                        </CCol>
                        <CCol md={4}>
                          <CFormInput
                            type="date"
                            label="Data do Plantio"
                            value={dataPlantio}
                            onChange={(e) => setDataPlantio(e.target.value)}
                            required
                          />
                        </CCol>
                        <CCol md={4}>
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
                            
                <CRow>
                  {insumosPlantio.map((insumo, idx) => {
                    // Busca insumo completo para pegar especificação
                    const insumoCompleto = insumos.records && insumos.records.find(i => i.insumo_id === insumo.id);
                    const tarefas = gerarTarefasPlantio(insumoCompleto || insumo, insumo.bandejas_necessarias, new Date());
                    const custoPorBandeja = calcularCustoPorBandeja(insumoCompleto || insumo);
                    const custoTotal = custoPorBandeja * (insumo.bandejas_necessarias || 0);
                    return (
                      <CCol md={6} key={insumo.id} className="mb-4">
                        <CCard>
                          <CCardHeader className="d-flex align-items-center gap-2">
                            <CIcon icon={cilLeaf} className="me-2 text-success" />
                            <span style={{fontWeight:600, fontSize:18}}>{insumo.nome} <small style={{fontWeight:400}}>{insumo.variedade}</small></span>
                          </CCardHeader>
                          <CCardBody>
                            <div style={{marginBottom:8}}>
                              <strong>Bandejas:</strong> {insumo.quantidade_estoque} &nbsp;|
                              <strong> Gramas/bandeja:</strong> {insumoCompleto?.especificacoes?.[0]?.gramas_para_plantio || insumoCompleto?.especificacoes?.[0]?.quantidade_bandeja || '-'}g
                            </div>
                            <div style={{marginBottom:8, color:'#4f8cff'}}>
                              <strong>Custo por bandeja:</strong> {formatarPreco(custoPorBandeja)} &nbsp;|
                              <strong>Custo total:</strong> {formatarPreco(custoTotal)}
                            </div>
                            <ul style={{listStyle:'none', padding:0, margin:0}}>
                              {tarefas.map((tarefa, i) => (
                                <li key={i} style={{marginBottom:10, display:'flex', alignItems:'center', gap:10}}>
                                  <CIcon icon={tarefa.icone} className={`text-${tarefa.cor}`} size="lg" />
                                  <div>
                                    <span style={{fontWeight:500}}>{tarefa.tipo.charAt(0).toUpperCase() + tarefa.tipo.slice(1)}</span>: {tarefa.descricao}<br/>
                                    <span style={{color:'#888', fontSize:14}}><CIcon icon={cilCalendar} /> {tarefa.data.toLocaleDateString('pt-BR')}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </CCardBody>
                        </CCard>
                      </CCol>
                    );
                  })}
                </CRow>
                {/* Resumo do plantio */}
                <div className="mt-4">
                  <CCard>
                    <CCardHeader>
                      <CIcon icon={cilBasket} className="me-2" /> Resumo do Plantio
                    </CCardHeader>
                    <CCardBody>
                      <div style={{fontSize:16, marginBottom:12}}>
                        <strong>Total de bandejas utilizadas:</strong> {insumosPlantio.reduce((acc, i) => acc + (i.bandejas_necessarias || 0), 0)}<br/>
                        <strong>Soma de todos os custos:</strong> {formatarPreco(insumosPlantio.reduce((acc, i) => {
                          const insumoCompleto = insumos.records && insumos.records.find(x => x.id === i.id);
                          const custoPorBandeja = calcularCustoPorBandeja(insumoCompleto || i);
                          return acc + custoPorBandeja * (i.bandejas_necessarias || 0);
                        }, 0))}
                      </div>
                      {/* ...tabela de orçamento já existente... */}
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