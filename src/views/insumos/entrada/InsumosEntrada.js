import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CForm,
  CFormSelect,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabContent,
  CTabPane,
  CSpinner,
  CModal,
  CFormInput,
  CButton,
  CModalHeader,
  CModalTitle,
  CModalBody,
} from '@coreui/react'

const InsumosListar = () => {
  const [insumos, setInsumos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedInsumo, setSelectedInsumo] = useState(null)
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filters, setFilters] = useState({
        categoria: '',
    });
  
  const handleFilterChange = (e) => {
      const { name, value } = e.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
          const response = await fetch('https://backend.cultivesmart.com.br/api/categorias');
          const data = await response.json();
          setCategorias(data);
      } catch (error) {
          console.error('Erro ao buscar categorias:', error);
      }
    };

    const fetchFornecedores = async () => {
      try {
          const response = await fetch('https://backend.cultivesmart.com.br/api/fornecedores');
          const data = await response.json();
          setFornecedores(data);
      } catch (error) {
          console.error('Erro ao buscar fornecedores:', error);
      }
    };
  
    const fetchInsumos = async () => {
      try {
        const response = await fetch('https://backend.cultivesmart.com.br/api/insumos')
        if (!response.ok) {
          throw new Error('Erro ao buscar insumos.')
        }
        const data = await response.json()
        setInsumos(data)
      } catch (error) {
        console.error(error.message)
        alert('Não foi possível carregar os insumos.')
      } finally {
        setLoading(false)
      }
    }

    fetchFornecedores();
    fetchCategorias();
    fetchInsumos()
  }, [])

  const handleRowClick = (insumo) => {
    setSelectedInsumo(insumo)
    setModalVisible(true)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Insumos</strong> <small>Listar</small>
          </CCardHeader>
          <CCardBody>
            <CForm className="mb-4">
              <CRow className="g-3">
                <CCol md={2}>
                    <CFormSelect
                        name="categoria"
                        value={filters.categoria}
                        onChange={handleFilterChange}
                    >
                        <option value="">Filtrar por Categoria</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.descricao}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>
                <CCol md={3}>
                    <CFormSelect
                        name="fornecedor"
                        value={filters.fornecedor}
                        onChange={handleFilterChange}
                    >
                        <option value="">Filtrar por Fornecedor</option>
                        {fornecedores.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nome}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="text"
                    placeholder="Buscar por Produto"
                    name="produto"
                    value={filters.produto}
                    onChange={handleFilterChange}
                  />
                </CCol>
                <CCol md={1}>
                  <CButton type="button" color="primary">
                    Filtrar
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
            <CTabContent className={`rounded-bottom`}>
              <CTabPane className="p-3 preview" visible>
                {loading ? (
                  <CSpinner color="primary" />
                ) : (
                  <CTable color="dark" hover> {/* Adicionado o atributo hover */}
                    <CTableHead>
                      <CTableRow>
                        {/* ... (cabeçalho da tabela) */}
                        <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Nome</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Categoria</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Fornecedor</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Quantidade</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Unidade de Medida</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Estoque Mínimo</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Data de Inclusão</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {insumos.map((insumo) => (
                        <CTableRow
                          key={insumo.id}
                          onClick={() => handleRowClick(insumo)} // Adiciona o evento onClick
                          style={{ cursor: 'pointer' }} // Estilo para indicar que é clicável
                        >
                          <CTableHeaderCell scope="row">{insumo.id}</CTableHeaderCell>
                          <CTableDataCell>{insumo.nome}</CTableDataCell>
                          <CTableDataCell>{insumo.category}</CTableDataCell>
                          <CTableDataCell>{insumo.fornecedor.nome}</CTableDataCell>
                          <CTableDataCell>{insumo.quantidade}</CTableDataCell>
                          <CTableDataCell>{insumo.unidade_medida}</CTableDataCell>
                          <CTableDataCell>{insumo.estoque_minimo}</CTableDataCell>
                          
                          <CTableDataCell>{new Date(insumo.created_at).toLocaleDateString()}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                )}
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal de detalhes */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>{selectedInsumo?.nome}</CModalTitle> {/* Título do modal */}
        </CModalHeader>
        <CModalBody>
          {/* Exiba os detalhes do insumo aqui */}
          {selectedInsumo && (
            <div>
              <p><strong>ID:</strong> {selectedInsumo.id}</p>
              <p><strong>Nome:</strong> {selectedInsumo.nome}</p>
              <p><strong>Categoria:</strong> {selectedInsumo.category}</p>
              <p><strong>Fornecedor:</strong> {selectedInsumo.fornecedor.nome}</p>
              <p><strong>Quantidade:</strong> {selectedInsumo.quantidade}</p>
              <p><strong>Unidade de Medida:</strong> {selectedInsumo.unidade_medida}</p>
              <p><strong>Estoque Mínimo:</strong> {selectedInsumo.estoque_minimo}</p>
              <p><strong>Variedade:</strong> {selectedInsumo.variedade}</p>
              <p><strong>Descrição:</strong> {selectedInsumo.descricao}</p>
              <p><strong>Dias de Pilha:</strong> {selectedInsumo.dias_pilha}</p>
              <p><strong>Dias de Blackout:</strong> {selectedInsumo.dias_blackout}</p>
              <p><strong>Dias até a Colheita:</strong> {selectedInsumo.dias_colheita}</p>
              <p><strong>Hidratação:</strong> {selectedInsumo.hidratacao}</p>
              <p><strong>Colocar Peso:</strong> {selectedInsumo.colocar_peso ? 'Sim' : 'Não'}</p>
              <p><strong>Substrato:</strong> {selectedInsumo.substrato ? 'Sim' : 'Não'}</p>
              <p><strong>Data de Inclusão:</strong> {new Date(selectedInsumo.created_at).toLocaleDateString()}</p>
              {/* Adicione outros detalhes conforme necessário */}
            </div>
          )}
        </CModalBody>
      </CModal>
    </CRow>
  )
}

export default InsumosListar



