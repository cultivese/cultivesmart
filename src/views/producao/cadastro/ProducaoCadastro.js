import React, { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import moment from 'moment'
import {
  Calendar,
  momentLocalizer,
} from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";

// Configuração do calendário
const mLocalizer = momentLocalizer(moment)

// Definir cores para cada microverde
const corPorProduto = {
  Beterraba: 'green',
  Couve: 'blue',
  Rúcula: 'red',
  // Adicione mais tipos conforme necessário
};

const ProducaoCadastro = () => {
  const [carrinho, setCarrinho] = useState([]);
  const [novoItem, setNovoItem] = useState({ nome: "", caixas: 0 });
  const [resultado, setResultado] = useState([]);
  const [eventosCalendario, setEventosCalendario] = useState([]);

  // Configurações do sistema
  const configuracaoSistema = {
    bandejasDisponiveis: 200,
    produtividadePorBandeja: {
      Beterraba: 5,
      Couve: 3,
      Rúcula: 4,
    },
    sementePorBandeja: {
      Beterraba: 50,
      Couve: 30,
      Rúcula: 25,
    },
  };

  // Simulação de dados históricos
  useEffect(() => {
    const fetchHistorico = async () => {
      const dadosPassados = [
        { id: 1, nome: "Beterraba", caixas: 100 },
        { id: 2, nome: "Couve", caixas: 50 },
        { id: 3, nome: "Rúcula", caixas: 30 },
      ];
      setCarrinho(dadosPassados);
    };
    fetchHistorico();
  }, []);

  // Recalcular os resultados de produção
  useEffect(() => {
    const calcularResultados = () => {
      const calculo = carrinho.map((item) => {
        const produtividade = configuracaoSistema.produtividadePorBandeja[item.nome] || 1;
        const sementesPorBandeja = configuracaoSistema.sementePorBandeja[item.nome] || 0;

        const bandejasNecessarias = Math.ceil(item.caixas / produtividade);
        const sementesNecessarias = bandejasNecessarias * sementesPorBandeja;

        return {
          ...item,
          bandejasNecessarias,
          sementesNecessarias,
        };
      });
      setResultado(calculo);
    };
    calcularResultados();
  }, [carrinho]);

  // Gerar os eventos para o calendário
  const gerarEventosCalendario = () => {
    const eventos = resultado.map((item, index) => {
      const inicio = moment().add(index, 'days').toDate(); // Início no dia seguinte
      const fim = moment().add(index + 2, 'days').toDate(); // Fim após 2 dias
      return {
        title: `${item.nome} - Lote ${index + 1}`,
        start: inicio,
        end: fim,
        allDay: true,
        color: corPorProduto[item.nome] || 'gray', // Cor do evento com base no microverde
      };
    });
    setEventosCalendario(eventos);
  };

  const handleQuantidadeChange = (id, quantidade) => {
    setCarrinho((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, caixas: parseInt(quantidade, 10) } : item
      )
    );
  };

  const adicionarItem = () => {
    if (!novoItem.nome || novoItem.caixas <= 0) {
      alert("Por favor, insira um nome válido e uma quantidade maior que zero.");
      return;
    }

    setCarrinho((prev) => [
      ...prev,
      { id: prev.length + 1, nome: novoItem.nome, caixas: novoItem.caixas },
    ]);

    setNovoItem({ nome: "", caixas: 0 });
  };

  const removerItem = (id) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CContainer>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader><strong>Planejamento de Produção</strong></CCardHeader>
            <CCardBody>
              <CForm>
                <h5>Itens no Carrinho:</h5>
                <CTable striped bordered>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Produto</CTableHeaderCell>
                      <CTableHeaderCell>Caixas Planejadas</CTableHeaderCell>
                      <CTableHeaderCell>Bandejas Necessárias</CTableHeaderCell>
                      <CTableHeaderCell>Sementes Necessárias (g)</CTableHeaderCell>
                      <CTableHeaderCell>Ações</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {resultado.map((item) => (
                      <CTableRow key={item.id}>
                        <CTableDataCell>{item.nome}</CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            type="number"
                            value={item.caixas}
                            onChange={(e) => handleQuantidadeChange(item.id, e.target.value)}
                          />
                        </CTableDataCell>
                        <CTableDataCell>{item.bandejasNecessarias}</CTableDataCell>
                        <CTableDataCell>{item.sementesNecessarias}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="danger" size="sm" onClick={() => removerItem(item.id)}>
                            Remover
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                <h5 className="mt-4">Adicionar Novo Produto:</h5>
                <CRow>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      placeholder="Nome do Produto"
                      value={novoItem.nome}
                      onChange={(e) =>
                        setNovoItem((prev) => ({
                          ...prev,
                          nome: e.target.value,
                        }))
                      }
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormInput
                      type="number"
                      placeholder="Quantidade de Caixas"
                      value={novoItem.caixas}
                      onChange={(e) =>
                        setNovoItem((prev) => ({
                          ...prev,
                          caixas: parseInt(e.target.value, 10),
                        }))
                      }
                    />
                  </CCol>
                  <CCol md={3}>
                    <CButton color="success" onClick={adicionarItem}>
                      Adicionar
                    </CButton>
                  </CCol>
                </CRow>
                <CButton color="primary" onClick={gerarEventosCalendario} className="mt-4">
                  Planejar Produção
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Calendário de Cronograma */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader><strong>Cronograma de Produção</strong></CCardHeader>
            <CCardBody>
              <Calendar
                localizer={mLocalizer}
                events={eventosCalendario}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                views={['month']}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ProducaoCadastro;
