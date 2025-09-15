import PropTypes from 'prop-types'
import React from 'react'

import ComponentsImg from 'src/assets/images/components.webp'

const AvisoGerenciarCotacao = (props) => (
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
        <h3 style={{ marginBottom: 12 }}>Como funciona o Gerenciador de Cotações</h3>
        <div style={{ fontSize: 16, color: '#333' }}>
          <strong>Status do Pedido:</strong>
          <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: 10, marginBottom: 10 }}>
            <li style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 22, verticalAlign: 'middle' }}>🔵</span>
              <span style={{ marginLeft: 8, fontWeight: 500 }}>Cotação criada</span>
              <span style={{ marginLeft: 8, color: '#666' }}>– Simulação gerada no sistema, ainda não enviada ao fornecedor.</span>
            </li>
            <li style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 22, verticalAlign: 'middle' }}>🟡</span>
              <span style={{ marginLeft: 8, fontWeight: 500 }}>Enviada ao fornecedor</span>
              <span style={{ marginLeft: 8, color: '#666' }}>– Cotação foi enviada e está aguardando retorno.</span>
            </li>
            <li style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 22, verticalAlign: 'middle' }}>🟠</span>
              <span style={{ marginLeft: 8, fontWeight: 500 }}>Disponibilidade confirmada</span>
              <span style={{ marginLeft: 8, color: '#666' }}>– Fornecedor confirmou a possibilidade de atender.</span>
            </li>
            <li style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 22, verticalAlign: 'middle' }}>🟢</span>
              <span style={{ marginLeft: 8, fontWeight: 500 }}>Pedido finalizado</span>
              <span style={{ marginLeft: 8, color: '#666' }}>– Mercadoria recebida e nota fiscal vinculada.</span>
            </li>
          </ul>
          <div style={{ fontSize: 15, color: '#888', marginTop: 10 }}>
            <em>Você pode acompanhar e aprovar cada etapa no botão Visualizar das cotações abaixo.</em>
          </div>
        </div>
      </div>
    </div>
  </div>
)

AvisoGerenciarCotacao.propTypes = {
  href: PropTypes.string,
}

export default AvisoGerenciarCotacao