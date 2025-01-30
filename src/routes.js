import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Produção
const VisaoGeral = React.lazy(() => import('./views/producao/VisaoGeral'))
const NovoLote = React.lazy(() => import('./views/producao/NovoLote'))
const EncerrarLote = React.lazy(() => import('./views/producao/EncerrarLote'))

// Fornecedores
const FornecedoresCadastro = React.lazy(() => import('./views/fornecedores/cadastro/FornecedoresCadastro'))
const FornecedoresListar = React.lazy(() => import('./views/fornecedores/listar/FornecedoresListar'))

// Insumos
const InsumosCadastro = React.lazy(() => import('./views/insumos/cadastro/InsumosCadastro'))
const InsumosEntrada = React.lazy(() => import('./views/insumos/entrada/InsumosEntrada'))
const InsumosSaida = React.lazy(() => import('./views/insumos/saida/InsumosSaida'))
const EstoqueVisaoGeral = React.lazy(() => import('./views/insumos/estoque/EstoqueVisaoGeral'))

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
  
  // Fornecedores
  { path: '/fornecedores', name: 'Fornecedores', element: Cards, exact: true },
  { path: '/fornecedores/cadastro', name: 'Cadastro', element: FornecedoresCadastro },
  { path: '/fornecedores/listar', name: 'Listar', element: FornecedoresListar },
  
  // Insumos
  { path: '/insumos', name: 'Insumos', element: Cards, exact: true },
  { path: '/insumos/cadastro', name: 'Cadastro', element: InsumosCadastro },
  { path: '/insumos/entrada/registrar', name: 'Entrada', element: InsumosEntrada },
  { path: '/insumos/saida/registrar', name: 'Saída', element: InsumosSaida },
  { path: '/insumos/estoque/visao_geral', name: 'Estoque', element: EstoqueVisaoGeral },

  // Fornecedores
  { path: '/planejamento', name: 'Planejamento', element: Cards, exact: true },
  { path: '/planejamento/producao', name: 'Produção', element: ProducaoCadastro },
  
]

export default routes
