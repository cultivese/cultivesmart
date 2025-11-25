import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Produção
const VisaoGeral = React.lazy(() => import('./views/producao/VisaoGeral'))
const NovoLote = React.lazy(() => import('./views/producao/NovoLote'))
const EncerrarLote = React.lazy(() => import('./views/producao/EncerrarLote'))

// Minhas tarefas diárias
const TarefaDiaria  = React.lazy(() => import('./views/tarefas/dia/TarefaDiaria'))
const HistoricoTarefa  = React.lazy(() => import('./views/tarefas/historico/HistoricoTarefa'))


// Plantio
const SimularPlantio  = React.lazy(() => import('./views/plantio/simular_plantio/SimularPlantio'))
const GerenciadorPlantios  = React.lazy(() => import('./views/plantio/gerenciador_plantios/GerenciadorPlantios'))
const CadastroSemeaduraBerta = React.lazy(() => import('./views/plantio/CadastroSemeaduraBerta'))


// Estoque
const EstoqueVisaoGeral = React.lazy(() => import('./views/estoque/visao_geral/EstoqueVisaoGeral'))
//const EstoqueRegistrar = React.lazy(() => import('./views/estoque/registrar/EstoqueRegistrar'))
const ListarEstoque = React.lazy(() => import('./views/estoque/listar/ListarEstoque'))
const SimularCotacao = React.lazy(() => import('./views/estoque/simular_cotacao/SimularCotacao'))
const RetiradaEstoque = React.lazy(() => import('./views/estoque/retirada/EstoqueRetirada'))
const GerenciadorPedidos = React.lazy(() => import('./views/estoque/gerenciador_pedidos/GerenciadorPedidos'))


// Produção
const VisaoGeralProducao = React.lazy(() => import('./views/producao/VisaoGeral'));
const NovoLoteProducao = React.lazy(() => import('./views/producao/NovoLote'));
const EncerrarLoteProducao = React.lazy(() => import('./views/producao/EncerrarLote'));
const CronogramaProducao = React.lazy(() => import('./views/producao/CronogramaProducao')); // Importa o novo componente


// Produtos
const ProdutosCadastro = React.lazy(() => import('./views/produtos/cadastro/ProdutosCadastro'))
const ProdutosListar = React.lazy(() => import('./views/produtos/listar/ProdutosListar'))

// Fornecedores
const FornecedoresListar = React.lazy(() => import('./views/fornecedores/listar/FornecedoresListar'))
const FornecedoresCadastro = React.lazy(() => import('./views/fornecedores/cadastro/FornecedoresCadastro'))
const InsumosCadastro = React.lazy(() => import('./views/fornecedores/catalogo_produtos/InsumosCadastro'))
const InsumosListar = React.lazy(() => import('./views/fornecedores/catalogo_produtos/InsumosListar'))
const InsumosEspecificacao = React.lazy(() => import('./views/fornecedores/especificacao/InsumosEspecificacao'))

// Funcionários
const FuncionariosCadastro = React.lazy(() => import('./views/funcionarios/cadastro/FuncionariosCadastro'))
const FuncionariosListar = React.lazy(() => import('./views/funcionarios/listar/FuncionariosListar'))
const FuncionariosPermissoes = React.lazy(() => import('./views/funcionarios/permissoes/FuncionariosPermissoes'))

// Empresas
const EmpresasCadastro = React.lazy(() => import('./views/empresas/cadastro/EmpresasCadastro'))
const EmpresasListar = React.lazy(() => import('./views/empresas/listar/EmpresasListar'))
const EmpresasPlanos = React.lazy(() => import('./views/empresas/planos/EmpresasPlanos'))

const ProducaoCadastro = React.lazy(() => import('./views/producao/cadastro/ProducaoCadastro'))

import ConfigurarTarefas from './views/configuracao/ConfigurarTarefas';

const CadastroLote = React.lazy(() => import('./views/lotes/CadastroLote'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  
  // TarefaDiaria
  { path: '/tarefas', name: 'Minhas Tarefas Diária', element: TarefaDiaria, exact: true },
  { path: '/tarefas/dia', name: 'Tarefas Diária', element: TarefaDiaria },
  { path: '/tarefas/historico', name: 'Histórico de Tarefas', element: HistoricoTarefa },

  // Produção
  { path: '/producao', name: 'Produção', element: VisaoGeralProducao, exact: true },
  { path: '/producao/visao-geral', name: 'Visão Geral', element: VisaoGeralProducao },
  { path: '/producao/cronograma', name: 'Cronograma', element: CronogramaProducao }, // Define a rota para o novo componente
  { path: '/producao/novo-lote', name: 'Novo Lote', element: NovoLoteProducao },
  { path: '/producao/encerrar-lote', name: 'Encerrar Lote', element: EncerrarLote },
  
  // Plantio
  { path: '/plantio', name: 'Plantio', element: SimularCotacao, exact: true },
  { path: '/plantio/simular_cotacao', name: 'Simular Cotação', element: SimularCotacao },
  { path: '/plantio/simular_plantio/', name: 'Simular Plantio', element: SimularPlantio },
  { path: '/plantio/gerenciador_plantios', name: 'Gerenciador de Plantios', element: GerenciadorPlantios },
  { path: '/plantio/cadastro_semeadura_berta', name: 'Cadastro de Semeadura Berta', element: CadastroSemeaduraBerta },

  // Estoque
  { path: '/estoque', name: 'Estoque', element: EstoqueVisaoGeral, exact: true },
  { path: '/estoque/visao_geral', name: 'Visão Geral', element: EstoqueVisaoGeral },
  //{ path: '/estoque/registrar', name: 'Registrar', element: EstoqueRegistrar },
  { path: '/estoque/retirada', name: 'Retirada', element: RetiradaEstoque },
  { path: '/estoque/listar', name: 'Registrar', element: ListarEstoque },
  { path: '/estoque/simular_cotacao', name: 'Simular Cotação', element: SimularCotacao },
  { path: '/estoque/gerenciador_pedidos', name: 'Gerenciador de Pedidos', element: GerenciadorPedidos },
  

  
  // Produtos
  { path: '/produtos', name: 'Produtos', element: ProdutosListar, exact: true },
  { path: '/produtos/listar', name: 'Listar', element: ProdutosListar },  
  { path: '/produtos/cadastrar', name: 'Cadastrar', element: ProdutosCadastro },
  
  // Fornecedores
  { path: '/fornecedores', name: 'Fornecedores', element: FornecedoresListar, exact: true },
  { path: '/fornecedores/cadastro', name: 'Cadastro', element: FornecedoresCadastro },
  { path: '/fornecedores/listar', name: 'Lista de Fornecedores', element: FornecedoresListar },
  { path: '/fornecedores/catalogo_produtos', name: 'Catálogo de Produtos dos Fornececores', element: InsumosListar },
  { path: '/fornecedores/especificacao', name: 'Especificação de Produtos dos Fornececores', element: InsumosEspecificacao },
  { path: '/fornecedores/cadastrar_catalogo_produtos', name: 'Cadastro de Catálogo de Produtos de Fornecedores', element: InsumosCadastro },
  
  // Funcionários
  { path: '/funcionarios', name: 'Funcionários', element: FuncionariosListar, exact: true },
  { path: '/funcionarios/cadastro', name: 'Cadastro de Funcionários', element: FuncionariosCadastro },
  { path: '/funcionarios/listar', name: 'Lista de Funcionários', element: FuncionariosListar },
  { path: '/funcionarios/permissoes', name: 'Gerenciar Permissões', element: FuncionariosPermissoes },
  { path: '/funcionarios/permissoes/:id', name: 'Alterar Permissões', element: FuncionariosPermissoes },
  { path: '/funcionarios/editar/:id', name: 'Editar Funcionário', element: FuncionariosCadastro },
  
  // Empresas
  { path: '/empresas', name: 'Empresas', element: EmpresasListar, exact: true },
  { path: '/empresas/cadastro', name: 'Cadastro de Empresas', element: EmpresasCadastro },
  { path: '/empresas/cadastro/:id', name: 'Editar Empresa', element: EmpresasCadastro },
  { path: '/empresas/listar', name: 'Lista de Empresas', element: EmpresasListar },
  { path: '/empresas/planos', name: 'Gerenciar Planos', element: EmpresasPlanos },
  
  // Fornecedores
  { path: '/planejamento', name: 'Planejamento', element: ProducaoCadastro, exact: true },
  { path: '/planejamento/producao', name: 'Produção', element: ProducaoCadastro },
  { path: '/configuracao/tarefas', name: 'Configuração de Tarefas', element: ConfigurarTarefas },
  { path: '/lotes/cadastro', name: 'Cadastro de Lote', element: CadastroLote },
  
]

export default routes
