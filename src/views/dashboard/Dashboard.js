import React from 'react'
import WeeklyView from './../../components/WeeklyView'
import classNames from 'classnames'
import { DocsExample } from 'src/components'

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
    <DocsExample href="components/widgets/#cwidgetstatsc">
          <CCardGroup className="mb-4">
            <CWidgetStatsC
              icon={<CIcon icon={cilPeople} height={36} />}
              value="10"
              title="Lotes em andamentos"
              progress={{ color: 'info', value: 75 }}
            />
            <CWidgetStatsC
              icon={<CIcon icon={cilUserFollow} height={36} />}
              value="1kg"
              title="Estoque de Sementes"
              progress={{ color: 'success', value: 75 }}
            />
            <CWidgetStatsC
              icon={<CIcon icon={cilBasket} height={36} />}
              value="30"
              title="Total caixas prontas"
              progress={{ color: 'warning', value: 75 }}
            />
            <CWidgetStatsC
              icon={<CIcon icon={cilChartPie} height={36} />}
              value="120"
              title="Estimativa caixas"
              progress={{ color: 'primary', value: 75 }}
            />
            <CWidgetStatsC
              icon={<CIcon icon={cilSpeedometer} height={36} />}
              value="5"
              title="Novos Pedidos"
              progress={{ color: 'danger', value: 75 }}
            />
          </CCardGroup>
        </DocsExample>

        <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Estimativas</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-body-secondary text-truncate small">Beterraba</div>
                        <div className="fs-5 fw-semibold">900g</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Repolho
                        </div>
                        <div className="fs-5 fw-semibold">250g</div>
                      </div>
                    </CCol>
                  </CRow>
                  <hr className="mt-0" />
                  {progressGroupExample1.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-body-secondary small">{item.title}</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="info" value={item.value1} />
                        <CProgress thin color="danger" value={item.value2} />
                        <CProgress thin color="primary" value={item.value3} />
                      </div>
                    </div>
                  ))}
                </CCol>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Clientes</div>
                        <div className="fs-5 fw-semibold">78,623</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Fornecedores</div>
                        <div className="fs-5 fw-semibold">49,123</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                </CCol>
              </CRow>
              </CCardBody>
              </CCard>
              </CCol>
              </CRow>
    </>
  )
}

export default Dashboard
