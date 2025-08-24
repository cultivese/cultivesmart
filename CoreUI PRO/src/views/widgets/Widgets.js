import React from 'react'
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader,
  CCol,
  CLink,
  CRow,
  CWidgetStatsB,
  CWidgetStatsC,
  CWidgetStatsE,
  CWidgetStatsF,
} from '@coreui/react-pro'
import { getStyle } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cilArrowRight,
  cilBasket,
  cilBell,
  cilChartPie,
  cilMoon,
  cilLaptop,
  cilPeople,
  cilSettings,
  cilSpeech,
  cilSpeedometer,
  cilUser,
  cilUserFollow,
} from '@coreui/icons'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { DocsExample } from 'src/components'

import WidgetsBrand from './WidgetsBrand'
import WidgetsDropdown from './WidgetsDropdown'

const Widgets = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  return (
    <CCard className="mb-4">
      <CCardHeader>Widgets</CCardHeader>
      <CCardBody>
 
        <DocsExample href="components/widgets/#cwidgetstatsb">
          <CRow xs={{ gutter: 4 }}>
            <CCol xs={12} sm={6} xl={4} xxl={3}>
              <CWidgetStatsB
                progress={{ color: 'success', value: 89.9 }}
                text="Lorem ipsum dolor sit amet enim."
                title="Widget title"
                value="89.9%"
              />
            </CCol>
            <CCol xs={12} sm={6} xl={4} xxl={3}>
              <CWidgetStatsB
                value="12.124"
                title="Widget title"
                progress={{ color: 'info', value: 89.9 }}
                text="Lorem ipsum dolor sit amet enim."
              />
            </CCol>
            <CCol xs={12} sm={6} xl={4} xxl={3}>
              <CWidgetStatsB
                value="$98.111,00"
                title="Widget title"
                progress={{ color: 'warning', value: 89.9 }}
                text="Lorem ipsum dolor sit amet enim."
              />
            </CCol>
            <CCol xs={12} sm={6} xl={4} xxl={3}>
              <CWidgetStatsB
                value="2 TB"
                title="Widget title"
                progress={{ color: 'primary', value: 89.9 }}
                text="Lorem ipsum dolor sit amet enim."
              />
            </CCol>
          </CRow>
        </DocsExample>
       
      </CCardBody>
    </CCard>
  )
}

export default Widgets
