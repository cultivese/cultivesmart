import PropTypes from 'prop-types'
import React from 'react'

import ComponentsImg from 'src/assets/images/AvisoGerenciarEstoque.png'

const AvisoGerenciarEstoque = (props) => (
  <div className="bg-primary bg-opacity-10 border border-2 border-primary rounded mb-4">
    <div className="row d-flex align-items-center p-3 px-xl-4 flex-xl-nowrap">
      <div className="col-xl-auto col-12 d-none d-xl-block p-0">
        <img
          className="img-fluid"
          src={ComponentsImg}
          width="120px"
          height="120px"
        />
      </div>
      <div className="col-md col-12 px-lg-4">
        <h3>Como funciona o Estoque Adquirido</h3>
        <p>
          Cadastre as especificações de plantio, registre a utilização dos insumos e conecte automaticamente essas informações ao caderno de atividades.
        </p>
        <p>
          Esse campo permite acompanhar em tempo real como cada insumo está sendo empregado, avaliar a eficiência nos plantios e gerar dados que orientam diretamente as tarefas de cultivo e manejo.
        </p>
      </div>
    </div>
  </div>
)

AvisoGerenciarEstoque.propTypes = {
  href: PropTypes.string,
}

export default AvisoGerenciarEstoque