import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilLeaf,
  cilArrowThickFromTop,
  cilArrowThickToTop,
  cilApplications,
  cilBasket,
  cilClipboard,
  cilLineStyle,
  cilList,
  cilPuzzle,
  cilCalendar,
  cilCalendarCheck,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = (userRole) => {
  // Função auxiliar para verificar se o item deve ser exibido para o userRole
  const hasPermission = (item) => {
    if (!item.roles) {
      return true // Se não tem 'roles' definidas, é visível para todos por padrão
    }
    return item.roles.includes(userRole)
  }

  const navigateItems =
  [
    // --- MENU PARA OPERADOR ---
    {
      component: CNavTitle,
      name: 'Minhas Tarefas Diárias', // Título mais específico
      roles: ['operador'],
    },
    {
      component: CNavItem,
      name: 'Tarefas do Dia',
      to: '/tarefas/dia', // Nova rota sugerida para a página específica do operador
      icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />, // Ícone mais sugestivo para "tarefas"
      roles: ['operador'],
    },
    {
      component: CNavItem,
      name: 'Histórico de Execução', // Se houver necessidade de ver tarefas passadas
      to: '/tarefas/historico',
      icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
      roles: ['operador'],
    },
    // {
    //   component: CNavTitle,
    //   name: 'Plantio',
    //   roles: ['admin'],
    // },
    // {
    //   component: CNavItem,
    //   name: 'Visão Geral',
    //   to: '/plantio/visao_geral',
    //   icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
    //   roles: ['admin'],
    // },
    // {
    //   component: CNavItem,
    //   name: 'Simular Plantio',
    //   to: '/plantio/simular_plantio',
    //   icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
    //   roles: ['admin'],
    // },
    // {
    //   component: CNavItem,
    //   name: 'Gerenciador de Plantios',
    //   to: '/plantio/gerenciador_plantio',
    //   icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
    //   roles: ['admin'],
    // },
    {
      component: CNavTitle,
      name: 'Estoque',
      roles: ['admin'],
    },
    {
      component: CNavItem,
      name: 'Visão Geral',
      to: '/estoque/visao_geral',
      icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
      roles: ['admin'],
    },
    {
      component: CNavItem,
      name: 'Simular Cotação',
      to: '/estoque/simular_cotacao',
      icon: <CIcon icon={cilLineStyle} customClassName="nav-icon" />,
      roles: ['admin'],
    },
    {
      component: CNavItem,
      name: 'Gerenciador de Cotações',
      to: '/estoque/gerenciador_pedidos',
      icon: <CIcon icon={cilLineStyle} customClassName="nav-icon" />,
      roles: ['admin'],
    },
    // {
    //   component: CNavTitle,
    //   name: 'Catálogo de Produtos',
    //   roles: ['admin'],
    // },
    // {
    //   component: CNavItem,
    //   name: 'Listar',
    //   to: '/produtos/listar',
    //   icon: <CIcon icon={cilLeaf} customClassName="nav-icon" />,
    //   roles: ['admin'],
    // },
    // {
    //   component: CNavItem,
    //   name: 'Cadastro',
    //   to: '/produtos/cadastrar',
    //   icon: <CIcon icon={cilLeaf} customClassName="nav-icon" />,
    //   roles: ['admin'],
    // },
    {
      component: CNavTitle,
      name: 'Catálogo de Insumos',
      roles: ['admin'],
    },
    {
      component: CNavItem,
      name: 'Listar',
      to: '/insumos/listar',
      icon: <CIcon icon={cilLeaf} customClassName="nav-icon" />,
      roles: ['admin'],
    },
    {
      component: CNavItem,
      name: 'Cadastro',
      to: '/insumos/cadastrar',
      icon: <CIcon icon={cilLeaf} customClassName="nav-icon" />,
      roles: ['admin'],
    },
    // {
    //   component: CNavTitle,
    //   name: 'Clientes',
    //   roles: ['admin'],
    // },
    // {
    //   component: CNavItem,
    //   name: 'Listar',
    //   to: '/clientes/listar',
    //   icon: <CIcon icon={cilLineStyle} customClassName="nav-icon" />,
    //   roles: ['admin'],
    // },
    // {
    //   component: CNavItem,
    //   name: 'Cadastro',
    //   to: '/clientes/cadastro',
    //   icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
    //   roles: ['admin'],
    // },
    {
      component: CNavTitle,
      name: 'Fornecedores',
      roles: ['admin'],
    },
    {
      component: CNavItem,
      name: 'Listar',
      to: '/fornecedores/listar',
      icon: <CIcon icon={cilLineStyle} customClassName="nav-icon" />,
      roles: ['admin'],
    },
    {
      component: CNavItem,
      name: 'Cadastro',
      to: '/fornecedores/cadastro',
      icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
      roles: ['admin'],
    },
  ]

  // Filtra os itens de navegação com base no userRole
  const filteredNavigation = navigateItems.filter((item) => {
    // Se o item for um CNavGroup, precisamos verificar seus filhos recursivamente
    if (item.component === CNavGroup) {
      const filteredChildren = item.items.filter(hasPermission)
      return filteredChildren.length > 0
    }
    return hasPermission(item)
  })

  return filteredNavigation
}

export default _nav
