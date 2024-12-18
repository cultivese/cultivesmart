import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
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
    component: CNavTitle,
    name: 'Estoque',
  },
  {
    component: CNavGroup,
    name: 'Insumos',
    to: '/insumos',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Cadastro de Insumos',
        to: '/insumos/cadastro',
      },
      {
        component: CNavItem,
        name: 'Entrada de Insumos',
        to: '/insumos/entrada',
      },
      {
        component: CNavItem,
        name: 'Saída de Insumos',
        to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'Níveis de Estoque',
        to: '/base/accordion',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Produtos Prontos',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registro de Colheitas',
        to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'Estoque de Produtos de Vendas',
        to: '/base/accordion',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Produção',
  },
  {
    component: CNavGroup,
    name: 'Lotes de Produção',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registrar Novo Lote',
        to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'Monitorar Cultivo',
        to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'Histórico de Lotes',
        to: '/base/accordion',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Controle de Cultivo',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
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
]

export default _nav
