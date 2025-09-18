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
        <div className="row" style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div className="col-md-5 col-12" style={{ marginBottom: 12 }}>
            <p style={{ fontWeight: 500 }}>Antes de aprovar a cotação e prosseguir com o pedido junto ao fornecedor, verifique:</p>
            <ul style={{ marginLeft: 16, marginBottom: 12 }}>
              <li>Quantidade</li>
              <li>Valor unitário</li>
              <li>ICMS</li>
              <li>Desconto</li>
            </ul>
            
          </div>
          <div className="col-md-7 col-12">
            <div style={{ fontSize: 16, color: '#333', fontWeight: 500, marginBottom: 8 }}>Status do Pedido:</div>
            <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: 0, marginBottom: 10 }}>
              <li style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 22, verticalAlign: 'middle' }}>🔵</span>
                <span style={{ marginLeft: 8, fontWeight: 500 }}>Pendente de aprovação</span>
                <span style={{ marginLeft: 8, color: '#666' }}>– Dados pendentes de validação antes de aprovar.</span>
              </li>
              <li style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 22, verticalAlign: 'middle' }}>🟡</span>
                <span style={{ marginLeft: 8, fontWeight: 500 }}>Aguardando pedido</span>
                <span style={{ marginLeft: 8, color: '#666' }}>– Pedido enviado ao fornecedor, aguardando sua chegada.</span>
              </li>
              <li style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 22, verticalAlign: 'middle' }}>🟢</span>
                <span style={{ marginLeft: 8, fontWeight: 500 }}>Pedido Finalizado</span>
                <span style={{ marginLeft: 8, color: '#666' }}>– Mercadoria recebida e nota fiscal vinculada.</span>
              </li>
              <li style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 22, verticalAlign: 'middle' }}>🟠</span>
                <span style={{ marginLeft: 8, fontWeight: 500 }}>Cotação Rejeitada</span>
                <span style={{ marginLeft: 8, color: '#666' }}>– Cotação rejeitada, não enviada ao fornecedor.</span>
              </li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: 15, color: '#888', marginTop: 10 }}>
              <em>Você pode acompanhar e aprovar cada etapa no botão Visualizar das cotações abaixo.</em>
            </div>
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