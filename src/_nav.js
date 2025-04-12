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
    name: 'Estoque',
  },
  {
    component: CNavItem,
    name: 'Visão Geral',
    to: '/estoque/visao_geral',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
  },  
  // {
  //   component: CNavItem,
  //   name: 'Especificação',
  //   to: '/insumos/especificacao',
  //   icon: <CIcon icon={cilLeaf} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: 'Simular Cotação',
    to: '/estoque/simular_cotacao',
    icon: <CIcon icon={cilLineStyle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Gerenciador de Cotações',
    to: '/estoque/gerenciador_pedidos',
    icon: <CIcon icon={cilLineStyle} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Listar',
  //   to: '/estoque/listar',
  //   icon: <CIcon icon={cilLineStyle} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Simular Pedido',
  //   to: '/estoque/registrar',
  //   icon: <CIcon icon={cilLineStyle} customClassName="nav-icon" />,
  // },
  {
    component: CNavTitle,
    name: 'Catálogo de Insumos',
  },
  {
    component: CNavItem,
    name: 'Listar',
    to: '/insumos/listar',
    icon: <CIcon icon={cilLeaf} customClassName="nav-icon" />,
  },
  
  {
    component: CNavItem,
    name: 'Cadastro',
    to: '/insumos/cadastrar',
    icon: <CIcon icon={cilLeaf} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Fornecedores',
  },
  {
    component: CNavItem,
    name: 'Listar',
    to: '/fornecedores/listar',
    icon: <CIcon icon={cilLineStyle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Cadastro',
    to: '/fornecedores/cadastro',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Historico',
  //   to: '/fornecedores/historico',
  //   icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  // },
  
  // {
  //   component: CNavItem,
  //   name: 'Estoque',
  //   to: '/insumos/estoque',
  //   icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
  // },
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
