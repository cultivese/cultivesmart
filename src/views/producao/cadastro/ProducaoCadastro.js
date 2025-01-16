import React, { useMemo, useState, Fragment, useEffect } from "react";
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
  CWidgetStatsE,
  CWidgetStatsF,
} from "@coreui/react";
import { CChartBar } from '@coreui/react-chartjs'
import moment from 'moment'
import {
  Calendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getStyle } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilMoon,
  cilSettings,
  cilUser,
} from '@coreui/icons'
import { DocsExample } from 'src/components'

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



    <CContainer className="mt-4">
      <CCard className="mb-4">
        <CCardHeader><strong>Planejamento de Produção</strong></CCardHeader>
          <CCardBody>
            <DocsExample href="components/widgets/#cwidgetstatse">
                  <CRow xs={{ gutter: 4 }}>
                    <CCol sm={4} md={3} xl={2}>
                      <CWidgetStatsE
                        chart={
                          <CChartBar
                            className="mx-auto"
                            style={{ height: '40px', width: '80px' }}
                            data={{
                              labels: [
                                'Julho',
                                'Agosto',
                                'Setembro',
                                'Outubro',
                                'Novembro',
                                'Dezembro',
                                'Janeiro',
                              ],
                              datasets: [
                                {
                                  backgroundColor: getStyle('--cui-danger'),
                                  borderColor: 'transparent',
                                  borderWidth: 1,
                                  data: [
                                    2,
                                    7,
                                    8,
                                    10,
                                    10,
                                    14,
                                    15,
                                  ],
                                },
                              ],
                            }}
                            options={{
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  display: false,
                                },
                              },
                              scales: {
                                x: {
                                  display: false,
                                },
                                y: {
                                  display: false,
                                },
                              },
                            }}
                          />
                        }
                        title="Mensalistas"
                        value="15"
                      />
                    </CCol>
                    <CCol sm={4} md={3} xl={2}>
                      <CWidgetStatsE
                        chart={
                          <CChartBar
                            className="mx-auto"
                            style={{ height: '40px', width: '80px' }}
                            data={{
                              labels: [
                                'Julho',
                                'Agosto',
                                'Setembro',
                                'Outubro',
                                'Novembro',
                                'Dezembro',
                              ],
                              datasets: [
                                {
                                  backgroundColor: getStyle('--cui-danger'),
                                  borderColor: 'transparent',
                                  borderWidth: 1,
                                  data: [
                                    61,
                                    100,
                                    50,
                                    97,
                                    120,
                                    230,
                                  ],
                                },
                              ],
                            }}
                            options={{
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  display: false,
                                },
                              },
                              scales: {
                                x: {
                                  display: false,
                                },
                                y: {
                                  display: false,
                                },
                              },
                            }}
                          />
                        }
                        title="Avulsos"
                        value="5"
                      />
                    </CCol>
                    <CCol sm={4} md={3} xl={2}>
                      <CWidgetStatsE
                        chart={
                          <CChartBar
                            className="mx-auto"
                            style={{ height: '40px', width: '80px' }}
                            data={{
                              labels: [
                                'Semana 1',
                                'Semana 2',
                                'Semana 3',
                                'Semana 4',
                              ],
                              datasets: [
                                {
                                  backgroundColor: getStyle('--cui-danger'),
                                  borderColor: 'transparent',
                                  borderWidth: 1,
                                  data: [
                                    15,
                                    16,
                                    16,
                                    14,
                                  ],
                                },
                              ],
                            }}
                            options={{
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  display: false,
                                },
                              },
                              scales: {
                                x: {
                                  display: false,
                                },
                                y: {
                                  display: false,
                                },
                              },
                            }}
                          />
                        }
                        title="Média Semanal"
                        value="15"
                      />
                    </CCol>
                    
                    <CCol sm={4} md={3} xl={2}>
                      <CWidgetStatsE
                        chart={
                          <CChartBar
                            className="mx-auto"
                            style={{ height: '40px', width: '80px' }}
                            data={{
                              labels: [
                                'Julho/2024',
                                'Agosto/2024',
                                'Setembro/2024',
                                'Outubro/2024',
                                'Novembro/2024',
                                'Dezembro/2024',
                              ],
                              datasets: [
                                {
                                  backgroundColor: getStyle('--cui-primary'),
                                  borderColor: 'transparent',
                                  borderWidth: 1,
                                  data: [ 190, 200, 202, 190, 200, 245],
                                },
                              ],
                            }}
                            options={{
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  display: false,
                                },
                              },
                              scales: {
                                x: {
                                  display: false,
                                },
                                y: {
                                  display: false,
                                },
                              },
                            }}
                          />
                        }
                        title="Total Mensal"
                        value="245"
                      />
                    </CCol>
                    <CCol sm={4} md={3} xl={2}>
                      <CWidgetStatsE
                        chart={
                          <CChartBar
                            className="mx-auto"
                            style={{ height: '40px', width: '80px' }}
                            data={{
                              labels: [
                                'Junho',
                                'Julho',
                                'Agosto',
                                'Setembro', 
                                'Outubro',
                                'Dezembro',
                              ],
                              datasets: [
                                {
                                  backgroundColor: getStyle('--cui-success'),
                                  borderColor: 'transparent',
                                  borderWidth: 1,
                                  data: [
                                    2,
                                    2,
                                    10,
                                    8,
                                    11,
                                    5,
                                  ],
                                },
                              ],
                            }}
                            options={{
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  display: false,
                                },
                              },
                              scales: {
                                x: {
                                  display: false,
                                },
                                y: {
                                  display: false,
                                },
                              },
                            }}
                          />
                        }
                        title="Perda (%)"
                        value="5"
                      />
                    </CCol>
                    <CCol sm={4} md={3} xl={2}>
                      <CWidgetStatsE
                        chart={
                          <CChartBar
                            className="mx-auto"
                            style={{ height: '40px', width: '80px' }}
                            data={{
                              labels: [
                                'W',
                                'T',
                                'F',
                                'S',
                                'S',
                                'M',
                              ],
                              datasets: [
                                {
                                  backgroundColor: getStyle('--cui-success'),
                                  borderColor: 'transparent',
                                  borderWidth: 1,
                                  data: [
                                    90,
                                    91,
                                    87,
                                    85,
                                    89,
                                    88,
                                  ],
                                },
                              ],
                            }}
                            options={{
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  display: false,
                                },
                              },
                              scales: {
                                x: {
                                  display: false,
                                },
                                y: {
                                  display: false,
                                },
                              },
                            }}
                          />
                        }
                        title="Eficiência (%)"
                        value="88"
                      />
                    </CCol>
                  </CRow>
                </DocsExample>

                <DocsExample href="components/widgets/#cwidgetstatsf">
                      <CRow xs={{ gutter: 4 }}>
                        <CCol xs={12} sm={6} xl={4} xxl={3}>
                          <CWidgetStatsF
                            icon={<CIcon width={24} icon={cilSettings} size="xl" />}
                            padding={false}
                            title="Beterraba"
                            value="50"
                            color="primary"
                          />
                        </CCol>
                        <CCol xs={12} sm={6} xl={4} xxl={3}>
                          <CWidgetStatsF
                            icon={<CIcon width={24} icon={cilUser} size="xl" />}
                            padding={false}
                            title="Mix Cores"
                            value="55"
                            color="info"
                          />
                        </CCol>
                        <CCol xs={12} sm={6} xl={4} xxl={3}>
                          <CWidgetStatsF
                            icon={<CIcon width={24} icon={cilMoon} size="xl" />}
                            padding={false}
                            title="Couve"
                            value="11"
                            color="warning"
                          />
                        </CCol>
                        <CCol xs={12} sm={6} xl={4} xxl={3}>
                          <CWidgetStatsF
                            icon={<CIcon width={24} icon={cilBell} size="xl" />}
                            padding={false}
                            title="Coentro"
                            value="3"
                            color="danger"
                          />
                        </CCol>
                        <CCol xs={12} sm={6} xl={4} xxl={3}>
                          <CWidgetStatsF
                            icon={<CIcon width={24} icon={cilMoon} size="xl" />}
                            padding={false}
                            title="Mostarda"
                            value="31"
                            color="warning"
                          />
                        </CCol>
                        <CCol xs={12} sm={6} xl={4} xxl={3}>
                          <CWidgetStatsF
                            icon={<CIcon width={24} icon={cilMoon} size="xl" />}
                            padding={false}
                            title="Repolho Roxo"
                            value="31"
                            color="warning"
                          />
                        </CCol>
                        <CCol xs={12} sm={6} xl={4} xxl={3}>
                          <CWidgetStatsF
                            icon={<CIcon width={24} icon={cilMoon} size="xl" />}
                            padding={false}
                            title="Rabaneete"
                            value="31"
                            color="warning"
                          />
                        </CCol>
                        <CCol xs={12} sm={6} xl={4} xxl={3}>
                          <CWidgetStatsF
                            icon={<CIcon width={24} icon={cilMoon} size="xl" />}
                            padding={false}
                            title="Cenoura"
                            value="1"
                            color="warning"
                          />
                        </CCol>
                      </CRow>
                    </DocsExample>
          </CCardBody>
      </CCard>

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

      {/* Exibir o Calendário */}
      <CCard className="mt-4">
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
    </CContainer>
  );
};

export default ProducaoCadastro;
