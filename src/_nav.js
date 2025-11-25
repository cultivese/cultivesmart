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
  cilPeople,
  cilBuilding,
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
    {
      component: CNavGroup,
      name: 'Caderno de Atividades',
      icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
      roles: ['admin'],
      items: [
        {
          component: CNavItem,
          name: 'Cadastro de Semeadura',
          to: '/plantio/cadastro_semeadura_berta',
          roles: ['admin'],
        },
        // {
        //   component: CNavItem,
        //   name: 'Acompanhamento de Atividades',
        //   to: '/configuracao/tarefas',
        //   roles: ['admin'],
        // },
        {
          component: CNavItem,
          name: 'Cronograma',
          to: '/producao/cronograma', // Nova rota
          roles: ['admin', 'operador'], // Visível para admin e operador
        }  
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
      roles: ['operador'],
    },
    {
      component: CNavItem,
      name: 'Histórico de Execução', // Se houver necessidade de ver tarefas passadas
      to: '/tarefas/historico',
      roles: ['operador'],
    },   
    {
      component: CNavGroup,
      name: 'Estoque',
      to: '/estoque',
      icon: <CIcon icon={cilMenu} customClassName="nav-icon" />,
      items: [
       
      {
        component: CNavItem,
        name: 'Cotar Produtos de Fornecedores',
        to: '/estoque/simular_cotacao',
        roles: ['admin'],
      },
      {
        component: CNavItem,
        name: 'Gerenciar e Aprovar Cotações',
        to: '/estoque/gerenciador_pedidos',
        roles: ['admin'],
      },
       {
        component: CNavItem,
        name: 'Gerenciar Estoque Adquirido',
        to: '/estoque/visao_geral',
        roles: ['admin'],
      },     
    ],
  }, 
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
          name: 'Cadastro de Catálogo de Produtos de Fornecedores',
          to: '/fornecedores/cadastrar_catalogo_produtos',
          roles: ['admin'],
        },
         {
          component: CNavItem,
          name: 'Catálogo de Produtos dos Fornecedores',
          to: '/fornecedores/catalogo_produtos',
          roles: ['admin'],
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Gestão de Colaboradores',
      to: '/funcionarios',
      icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      roles: ['super-admin'],
      items: [
        {
          component: CNavItem,
          name: 'Cadastro de Colaboradores',
          to: '/funcionarios/cadastro',
          roles: ['admin'],
        },
        {
          component: CNavItem,
          name: 'Lista de Colaboradores',
          to: '/funcionarios/listar',
          roles: ['admin'],
        },
        {
          component: CNavItem,
          name: 'Gerenciar Permissões',
          to: '/funcionarios/permissoes',
          roles: ['admin'],
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Gestão de Empresas',
      to: '/empresas',
      icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
      roles: ['super-admin'],
      items: [
        {
          component: CNavItem,
          name: 'Cadastro de Empresas',
          to: '/empresas/cadastro',
          roles: ['super-admin'],
        },
        {
          component: CNavItem,
          name: 'Lista de Empresas',
          to: '/empresas/listar',
          roles: ['super-admin'],
        },
        {
          component: CNavItem,
          name: 'Gerenciar Planos',
          to: '/empresas/planos',
          roles: ['super-admin'],
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
