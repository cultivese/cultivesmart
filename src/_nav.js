import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilLeaf,
  cilArrowThickFromTop,
  cilArrowThickToTop,
  cilApplications,
  cilPuzzle,
  cilCalendar,
  cilCalendarCheck,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavTitle,
    name: 'Produção',
  },
  {
    component: CNavGroup,
    name: 'Acompanhamento',
    to: '/producao',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Visão Geral',
        to: '/producao/visao_geral',
      },
      {
        component: CNavItem,
        name: 'Novo Lote',
        to: '/producao/novo_lote',
      },
      {
        component: CNavItem,
        name: 'Encerrar Lote',
        to: '/producao/encerra_lote',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Planejamento',
    to: '/base',
    icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Plantio',
        to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'Germinação',
        to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'Crescimento',
        to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'Colheita',
        to: '/base/accordion',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Insumos',
  },
  {
    component: CNavItem,
    name: 'Cadastro',
    to: '/cadastro',
    icon: <CIcon icon={cilLeaf} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Entrada',
    to: '/entrada',
    icon: <CIcon icon={cilArrowThickFromTop} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registrar',
        to: '/entrada/registrar',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Saida',
    to: '/saida',
    icon: <CIcon icon={cilArrowThickToTop} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registrar',
        to: '/saida/registrar',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Estoque',
    to: '/estoque',
    icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Visão Geral',
        to: '/estoque/visao_geral',
      },
      {
        component: CNavItem,
        name: 'Alertas',
        to: '/estoque/alertas',
      },
      {
        component: CNavItem,
        name: 'Relatório',
        to: '/estoque/relatorio',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Fornecedores',
  },
  {
    component: CNavItem,
    name: 'Cadastro',
    to: '/fornecedores/cadastro',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Listar',
    to: '/fornecedores/listar',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Historico',
    to: '/fornecedores/historico',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Relatórios',
  },
  {
    component: CNavItem,
    name: 'Relatório de Produção',
    to: '/relatorio/producao',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Relatório de Insumos',
    to: '/relatorio/insumos',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Relatório de Fornecedores',
    to: '/relatorio/fornecedores',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Configuração',
  },
  {
    component: CNavItem,
    name: 'Lote',
    to: '/configuracao/lote',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Produção',
    to: '/configuracao/producao',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
]

export default _nav
