import React from 'react';
import PropTypes from 'prop-types';
import {
  CRow,
  CCol,
  CCardImage,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CButton,
} from '@coreui/react';
import DocsExample from 'src/components/DocsExample'; // Ajuste o caminho conforme necessário

const FiltroCategoriaInsumo = ({
  unidadesMedida,
  categorias,
  filtroCategoria,
  setFiltroCategoria,
  filtroNome,
  setFiltroNome,
  filtroFornecedor,
  setFiltroFornecedor,
  fornecedores,
  limparFiltros,
}) => {
  return (
    <DocsExample href="components/card/#background-and-color">
      <CRow className="align-items-center justify-content-center mb-4" xs={{ gutterY: 5 }}>
        {unidadesMedida &&
          categorias &&
          categorias.records &&
          categorias.records.map((categoria) => (
            <CCol
              key={categoria.id}
              color={filtroCategoria === categoria.id ? 'success' : 'light'}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <CCol lg={4} onClick={() => { setFiltroCategoria(categoria.id); }}>
                <CCardImage width="fit" orientation="top" src={`data:image/png;base64,${categoria.logoPath}`} />
              </CCol>
              <CCol>
                <CFormCheck
                  type="radio"
                  name="categoria"
                  id={`flexCheckChecked${categoria.id}`}
                  label={categoria.descricao}
                  value={categoria.id}
                  checked={filtroCategoria === categoria.id}
                  onChange={(e) => { setFiltroCategoria(e.target.value); }}
                />
              </CCol>
            </CCol>
          ))}
      </CRow>

      
    </DocsExample>
  );
};

FiltroCategoriaInsumo.propTypes = {
  unidadesMedida: PropTypes.array,
  categorias: PropTypes.object,
  filtroCategoria: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setFiltroCategoria: PropTypes.func.isRequired,
  filtroNome: PropTypes.string,
  setFiltroNome: PropTypes.func.isRequired,
  filtroFornecedor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setFiltroFornecedor: PropTypes.func.isRequired,
  fornecedores: PropTypes.object,
  limparFiltros: PropTypes.func.isRequired,
};

export default React.memo(FiltroCategoriaInsumo);