import PropTypes from 'prop-types'
import React from 'react'

import ComponentsImg from 'src/assets/images/components.webp'

const AvisoCotacao = (props) => (
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
        <h3>Como funciona o Gerenciador de Cotações</h3>
        <p>
          Crie sua cotação, envie ao fornecedor e acompanhe o retorno sobre
          disponibilidade. Quando o pedido chegar, finalize registrando a nota
          fiscal. (este texto vai em cima do campo para descrever)
        </p>
      </div>
    </div>
  </div>
)

AvisoCotacao.propTypes = {
  href: PropTypes.string,
}

export default AvisoCotacao