import React from 'react'
import WeeklyView from './../../components/WeeklyView'
import classNames from 'classnames'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CProgress,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCloudDownload,
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

  const buttonsData = [
    { color: 'primary', text: 'Irrigação', badge: 4 },
    { color: 'danger', text: 'Alerta', badge: 3 },
    { color: 'success', text: 'Notificações', badge: 5 },
    { color: 'warning', text: 'Pendências', badge: 2 },
  ]
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
      <WidgetsDropdown className="mb-4" />

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
              Visão Semanal de Atividades
              </h4>
              <div className="small text-body-secondary">Período: 16/12/2024 a 22/12/2024</div>
            </CCol>
            
            <CCol sm={7} className="d-none d-md-block">
              <CButtonGroup className="float-end me-3">
                {['Semanal', 'Mensal'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Semanal'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
            <WeeklyView activities={activities} weekDates={weekDates}/>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
      
    </>
  )
}

export default Dashboard
