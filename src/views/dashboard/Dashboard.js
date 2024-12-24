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
  cilChartPie,
  cilSpeedometer
} from '@coreui/icons'

const Dashboard = () => {

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
              title="Total caixas"
              progress={{ color: 'warning', value: 75 }}
            />
            <CWidgetStatsC
              icon={<CIcon icon={cilChartPie} height={36} />}
              value="28%"
              title="Returning Visitors"
              progress={{ color: 'primary', value: 75 }}
            />
            <CWidgetStatsC
              icon={<CIcon icon={cilSpeedometer} height={36} />}
              value="5:34:11"
              title="Avg. Time"
              progress={{ color: 'danger', value: 75 }}
            />
          </CCardGroup>
        </DocsExample>

    </>
  )
}

export default Dashboard
