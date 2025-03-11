import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Produção
const VisaoGeral = React.lazy(() => import('./views/producao/VisaoGeral'))
const NovoLote = React.lazy(() => import('./views/producao/NovoLote'))
const EncerrarLote = React.lazy(() => import('./views/producao/EncerrarLote'))

// Estoque
const EstoqueVisaoGeral = React.lazy(() => import('./views/estoque/visao_geral/EstoqueVisaoGeral'))
const EstoqueRegistrar = React.lazy(() => import('./views/estoque/registrar/EstoqueRegistrar'))
const ListarEstoque = React.lazy(() => import('./views/estoque/listar/ListarEstoque'))
const GerarOrcamento = React.lazy(() => import('./views/estoque/gerar_orcamento/GerarOrcamento'))
const HistoricoPedidos = React.lazy(() => import('./views/estoque/historico_pedidos/HistoricoPedidos'))


const InsumosEspecificacao = React.lazy(() => import('./views/estoque/especificacao/InsumosEspecificacao'))

// Insumos
const InsumosCadastro = React.lazy(() => import('./views/insumos/cadastro/InsumosCadastro'))

const InsumosListar = React.lazy(() => import('./views/insumos/listar/InsumosListar'))

// Fornecedores
const FornecedoresListar = React.lazy(() => import('./views/fornecedores/listar/FornecedoresListar'))
const FornecedoresCadastro = React.lazy(() => import('./views/fornecedores/cadastro/FornecedoresCadastro'))


const ProducaoCadastro = React.lazy(() => import('./views/producao/cadastro/ProducaoCadastro'))

const Cards = React.lazy(() => import('./views/base/cards/Cards'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  
  // // Produção
  // { path: '/producao', name: 'Produção', element: Cards, exact: true },
  // { path: '/producao/visao_geral', name: 'VisaoGeral', element: VisaoGeral },
  // { path: '/producao/novo_lote', name: 'NovoLote', element: NovoLote },
  // { path: '/producao/encerrar_lote', name: 'EncerrarLote', element: EncerrarLote },
  
  // Estoque
  { path: '/estoque', name: 'Estoque', element: Cards, exact: true },
  { path: '/estoque/visao_geral', name: 'Visão Geral', element: EstoqueVisaoGeral },
  { path: '/estoque/registrar', name: 'Registrar', element: EstoqueRegistrar },
  { path: '/estoque/listar', name: 'Registrar', element: ListarEstoque },
  { path: '/estoque/gerar_orcamento', name: 'Gerar Orçamento', element: GerarOrcamento },
  { path: '/estoque/historico_pedidos', name: 'Histórico de Pedidos', element: HistoricoPedidos },
  

  // Insumos
  { path: '/insumos', name: 'Insumos', element: Cards, exact: true },
  { path: '/insumos/listar', name: 'Listar', element: InsumosListar },
  { path: '/insumos/especificacao', name: 'Especificação', element: InsumosEspecificacao },
  { path: '/insumos/cadastrar', name: 'Cadastrar', element: InsumosCadastro },

  // Fornecedores
  { path: '/fornecedores', name: 'Fornecedores', element: Cards, exact: true },
  { path: '/fornecedores/cadastro', name: 'Cadastro', element: FornecedoresCadastro },
  { path: '/fornecedores/listar', name: 'Listar', element: FornecedoresListar },
  

  // Fornecedores
  { path: '/planejamento', name: 'Planejamento', element: Cards, exact: true },
  { path: '/planejamento/producao', name: 'Produção', element: ProducaoCadastro },
  
]

export default routes
