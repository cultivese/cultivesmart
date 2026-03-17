import React, { useState, useMemo } from 'react'
import WeeklyView from './../../components/WeeklyView'
import classNames from 'classnames'
import { DocsExample } from 'src/components'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'

import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CCardHeader,
  CCardGroup,
  CProgress,
  CRow,
  CWidgetStatsC,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilUserFollow,
  cilBasket,
  cilUser,
  cilUserFemale,
  cibGoogle,
  cibFacebook,
  cibTwitter,
  cibLinkedin,
  cilChartPie,
  cilSpeedometer
} from '@coreui/icons'

const Dashboard = () => {
  const [filtroTempo, setFiltroTempo] = useState('semanal')
  
  // Dados simulados para demonstração
  const dadosColheita = {
    semanal: {
      manjericao: [120, 150, 180, 200, 165], // 5 semanas de março
      couve: [90, 110, 140, 160, 130],
      coentro: [80, 95, 120, 140, 115],
      rucula: [70, 85, 100, 125, 95]
    },
    mensal: {
      manjericao: [450, 520, 715, 680, 590, 640, 720, 580, 650, 700, 620, 680], // Jan-Dez 2026
      couve: [380, 420, 630, 560, 490, 540, 610, 480, 550, 590, 520, 570],
      coentro: [320, 360, 540, 480, 410, 460, 520, 400, 470, 510, 440, 490],
      rucula: [280, 320, 455, 420, 360, 400, 450, 350, 410, 450, 380, 430]
    }
  }

  // Dados de produtividade (custo por grama)
  const dadosProdutividade = {
    manjericao: 0.15, // R$ 0,15 por grama
    couve: 0.12,      // R$ 0,12 por grama  
    coentro: 0.18,    // R$ 0,18 por grama
    rucula: 0.22      // R$ 0,22 por grama
  }

  // Função para gerar labels das semanas do mês atual (março)
  const gerarSemanasMarco = () => {
    return ['Semana 1 (1-7)', 'Semana 2 (8-14)', 'Semana 3 (15-21)', 'Semana 4 (22-28)', 'Semana 5 (29-31)']
  }

  // Função para gerar labels dos meses do ano
  const gerarMesesAno = () => {
    return ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  }

  // Cores para diferentes microverdes
  const coresMicroverdes = {
    manjericao: '#28a745',
    couve: '#17a2b8', 
    coentro: '#ffc107',
    rucula: '#dc3545'
  }

  // Configuração do gráfico semanal (barras)
  const dadosGraficoSemanal = useMemo(() => {
    const labels = ['Manjericão', 'Couve', 'Coentro', 'Rúcula'] // Sementes como labels
    const semanasLabels = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5']
    
    // Cada dataset é uma semana, com dados de todas as sementes
    const datasets = semanasLabels.map((semana, index) => ({
      label: semana,
      data: [
        dadosColheita.semanal.manjericao[index],
        dadosColheita.semanal.couve[index], 
        dadosColheita.semanal.coentro[index],
        dadosColheita.semanal.rucula[index]
      ],
      backgroundColor: `hsl(${index * 72}, 70%, 60%)`, // Cores diferentes para cada semana
      borderColor: `hsl(${index * 72}, 70%, 50%)`,
      borderWidth: 1
    }))
    
    return { labels, datasets }
  }, [])

  // Configuração do gráfico mensal (linhas)  
  const dadosGraficoMensal = useMemo(() => {
    const labels = gerarMesesAno()
    const datasets = Object.keys(dadosColheita.mensal).map(microverde => ({
      label: microverde.charAt(0).toUpperCase() + microverde.slice(1),
      data: dadosColheita.mensal[microverde],
      borderColor: coresMicroverdes[microverde],
      backgroundColor: coresMicroverdes[microverde] + '20',
      tension: 0.4,
      pointBackgroundColor: coresMicroverdes[microverde],
      pointBorderColor: coresMicroverdes[microverde],
      pointHoverBackgroundColor: coresMicroverdes[microverde],
      pointHoverBorderColor: coresMicroverdes[microverde]
    }))
    
    return { labels, datasets }
  }, [])

  // Configuração do gráfico de produtividade (custo por grama)
  const dadosGraficoProdutividade = useMemo(() => {
    const labels = Object.keys(dadosProdutividade).map(microverde => 
      microverde.charAt(0).toUpperCase() + microverde.slice(1)
    )
    const data = Object.values(dadosProdutividade)
    
    const datasets = [{
      label: 'Custo por Grama (R$)',
      data: data,
      backgroundColor: [
        coresMicroverdes.manjericao + '80',
        coresMicroverdes.couve + '80', 
        coresMicroverdes.coentro + '80',
        coresMicroverdes.rucula + '80'
      ],
      borderColor: [
        coresMicroverdes.manjericao,
        coresMicroverdes.couve,
        coresMicroverdes.coentro, 
        coresMicroverdes.rucula
      ],
      borderWidth: 2
    }]
    
    return { labels, datasets }
  }, [])

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78, value3: 78 },
    { title: 'Tuesday', value1: 56, value2: 94, value3: 78 },
    { title: 'Wednesday', value1: 12, value2: 67, value3: 78 },
    { title: 'Thursday', value1: 43, value2: 91, value3: 78 },
    { title: 'Friday', value1: 22, value2: 73, value3: 78},
    { title: 'Saturday', value1: 53, value2: 82, value3: 78 },
    { title: 'Sunday', value1: 9, value2: 69, value3: 78 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const progressExample = [
    { title: 'Lote 01', value: 'Beterraba', percent: 40, color: 'success' },
    { title: 'Lote 02', value: 'Couve', percent: 20, color: 'info' },
    { title: 'Lote 03', value: 'Coentro', percent: 60, color: 'warning' },
    { title: 'Lote 04', value: 'Mostarda', percent: 80, color: 'danger' },
    { title: 'Lote 05', value: 'Repolho Roxo', percent: 40.15, color: 'primary' },
  ]

  const weekDates = ["18/12/2024", "19/12/2024", "20/12/2024", "21/12/2024", "22/12/2024", "23/12/2024", "24/12/2024"];

  const activities = {
    0: [
      { id: 1, color: 'primary', type: "semeadura", details: "Semeadura do lote #1", lotes: 2 },
      { id: 2, color: 'danger', type: "irrigacao", details: "Irrigação do lote #1" , lotes: 1},
    ],
    1: [{ id: 3, color: 'success', type: "irrigacao", details: "Irrigação do lote #2" , lotes: 1}],
    3: [{ id: 4, color: 'warning', type: "colheita", details: "Colheita do lote #3" , lotes: 3}],
    4: [{ id: 5, color: 'success', type: "limpeza", details: "Limpeza de bandejas" , lotes: 4}],
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Volume Colhido de Microverdes</h4>
                <CFormSelect
                  style={{ width: '200px' }}
                  value={filtroTempo}
                  onChange={(e) => setFiltroTempo(e.target.value)}
                >
                  <option value="semanal">Semanal</option>
                  <option value="mensal">Mensal</option>
                </CFormSelect>
              </div>
            </CCardHeader>
            <CCardBody>
              {filtroTempo === 'semanal' ? (
                <div>
                  <p className="text-body-secondary small mb-3">
                    Volume colhido por semana no mês de março de 2026 (em gramas)
                  </p>
                  <CChartBar
                    data={dadosGraficoSemanal}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'Volume Semanal por Tipo de Microverde'
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.dataset.label}: ${context.parsed.y}g`
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Volume (gramas)'
                          }
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Tipos de Microverdes'
                          }
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div>
                  <p className="text-body-secondary small mb-3">
                    Volume colhido por mês no ano de 2026 (em gramas)
                  </p>
                  <CChartLine
                    data={dadosGraficoMensal}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'Volume Mensal por Tipo de Microverde'
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.dataset.label}: ${context.parsed.y}g`
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Volume (gramas)'
                          }
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Meses de 2026'
                          }
                        }
                      },
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      },
                      hover: {
                        mode: 'nearest',
                        intersect: true
                      }
                    }}
                  />
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      
      {/* Gráfico de Índice de Produtividade */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h4 className="mb-0">Índice de Produtividade</h4>
            </CCardHeader>
            <CCardBody>
              <p className="text-body-secondary small mb-3">
                Custo em reais para produzir 1 grama de cada microverde
              </p>
              <CChartBar
                data={dadosGraficoProdutividade}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Custo de Produção por Grama'
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: R$ ${context.parsed.y.toFixed(2)}`
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Custo por Grama (R$)'
                      },
                      ticks: {
                        callback: function(value) {
                          return 'R$ ' + value.toFixed(2)
                        }
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Tipos de Microverdes'
                      }
                    }
                  }
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
