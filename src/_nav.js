import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilLeaf,
  cilArrowThickFromTop,
  cilArrowThickToTop,
  cilApplications,
  cilBasket,
  cilLineStyle,
  cilList,
  cilPuzzle,
  cilCalendar,
  cilCalendarCheck,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  // {
  //   component: CNavItem,
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   // badge: {
  //   //   color: 'info',
  //   //   text: 'NEW',
  //   // },
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Produção',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Acompanhamento',
  //   to: '/producao',
  //   icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Visão Geral',
  //       to: '/producao/visao_geral',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Novo Lote',
  //       to: '/producao/novo_lote',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Encerrar Lote',
  //       to: '/producao/encerra_lote',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Planejamento',
  //   to: '/base',
  //   icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Producao',
  //       to: '/planejamento/producao',
  //     }      
  //   ],
  // },
  {
    component: CNavTitle,
    name: 'Fornecedores',
  },
  {
    component: CNavItem,
    name: 'Cadastro',
    to: '/fornecedores/cadastro',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Listar',
    to: '/fornecedores/listar',
    icon: <CIcon icon={cilLineStyle} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Historico',
  //   to: '/fornecedores/historico',
  //   icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  // },
  {
    component: CNavTitle,
    name: 'Insumos',
  },
  {
    component: CNavItem,
    name: 'Cadastro',
    to: '/insumos/cadastro',
    icon: <CIcon icon={cilLeaf} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Entrada',
    icon: <CIcon icon={cilArrowThickFromTop} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registrar',
        to: '/insumos/entrada/registrar',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Saida',
    icon: <CIcon icon={cilArrowThickToTop} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registrar',
        to: '/insumos/saida/registrar',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Estoque',
    icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'VisaoGeral',
        to: '/insumos/estoque/visao_geral',
      },
    ],
  },
  // {
  //   component: CNavTitle,
  //   name: 'Clientes',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Cadastro',
  //   to: '/fornecedores/cadastro',
  //   icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
  // },
  // ,
  // {
  //   component: CNavTitle,
  //   name: 'Financeiro',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Análise de Custos',
  //   to: '/financeiro/analisedecustos',
  //   icon: <CIcon icon={cilLeaf} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Relatórios',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Relatório de Produção',
  //   to: '/relatorio/producao',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Relatório de Insumos',
  //   to: '/relatorio/insumos',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Relatório de Fornecedores',
  //   to: '/relatorio/fornecedores',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Configuração',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Lote',
  //   to: '/configuracao/lote',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Produção',
  //   to: '/configuracao/producao',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  // },
]

export default _nav
