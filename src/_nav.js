import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilLeaf,
  cilMenu,
  cilListNumbered,
  cilCalculator,
  cilMonitor,
  cilInstitution,
  cilPlus,
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
      component: CNavGroup,
      name: 'Plantios', // Substitui "Lotes" por "Plantios"
      icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
      roles: ['admin'],
      items: [
        {
          component: CNavItem,
          name: 'Tarefas',
          to: '/configuracao/tarefas',
          icon: <CIcon icon={cilListNumbered} customClassName="nav-icon" />,
          roles: ['admin'],
        },
        {
          component: CNavItem,
          name: 'Cadastro de Plantio', // Substitui "Cadastro de Lote" por "Cadastro de Plantio"
          to: '/lotes/cadastro',
          icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
          roles: ['admin'],
        },
      ],
    },
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
    {
    component: CNavGroup,
    name: 'Produção',
    to: '/producao',
    icon: <CIcon icon={cilLineStyle} customClassName="nav-icon" />,
    roles: ['admin', 'operador'],
    items: [
      {
        component: CNavItem,
        name: 'Cronograma',
        to: '/producao/cronograma', // Nova rota
        roles: ['admin', 'operador'], // Visível para admin e operador
      }      
    ],
  },
    {
      component: CNavGroup,
      name: 'Estoque',
      to: '/estoque',
      icon: <CIcon icon={cilMenu} customClassName="nav-icon" />,
      items: [
        {
        component: CNavItem,
        name: 'Visão Geral',
        to: '/estoque/visao_geral',
        roles: ['admin'],
      },
      {
        component: CNavItem,
        name: 'Simular Cotação',
        to: '/estoque/simular_cotacao',
        roles: ['admin'],
      },
      {
        component: CNavItem,
        name: 'Gerenciador de Cotações',
        to: '/estoque/gerenciador_pedidos',
        roles: ['admin'],
      },
      {
        component: CNavItem,
        name: 'Retirada',
        to: '/estoque/retirada',
        roles: ['admin'],
      }
    ],
  },
  // {
  //     component: CNavGroup,
  //     name: 'Insumos',
  //     to: '/insumos',
  //     icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  //     items: [
  //        {
  //         component: CNavItem,
  //         name: 'Listar',
  //         to: '/insumos/listar',
  //         roles: ['admin'],
  //       },
  //       {
  //         component: CNavItem,
  //         name: 'Especificação',
  //         to: '/insumos/especificacao',
  //         roles: ['admin'],
  //       },
  //       {
  //         component: CNavItem,
  //         name: 'Cadastro',
  //         to: '/insumos/cadastrar',
  //         roles: ['admin'],
  //       },
  //     ],
  //   },
{
      component: CNavGroup,
      name: 'Fornecedores',
      to: '/fornecedores',
      icon: <CIcon icon={cilInstitution} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Cadastro de Fornecedores',
          to: '/fornecedores/cadastro',
          roles: ['admin'],
        },
        {
          component: CNavItem,
          name: 'Lista de Fornecedores',
          to: '/fornecedores/listar',
          roles: ['admin'],
        },
         {
          component: CNavItem,
          name: 'Catálogo de Produtos dos Fornecedores',
          to: '/fornecedores/catalogo_produtos',
          roles: ['admin'],
        },
        {
          component: CNavItem,
          name: 'Especificação de Produtos dos Fornecedores',
          to: '/fornecedores/especificacao',
          roles: ['admin'],
        },
        {
          component: CNavItem,
          name: 'Cadastro de Catálogo de Produtos de Fornecedores',
          to: '/fornecedores/cadastrar_catalogo_produtos',
          roles: ['admin'],
        },
      ],
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
