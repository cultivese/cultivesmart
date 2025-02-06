import React, { useState, useEffect } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CBadge,
    CForm,
    CFormInput,
    CFormSelect,
    CButton,
    CCardTitle,
    CCardText,
    CCardImage,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
} from '@coreui/react';

import product_default from './../../../assets/images/microverdes/product_default.png';

const EstoqueVisaoGeral = () => {
    const [filters, setFilters] = useState({
        categoria: '',
    });
    const [estoqueData, setEstoqueData] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(''); // 'registrar' ou 'saida'
    const [modalData, setModalData] = useState(null);

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

        const fetchEstoque = async () => {
            try {
                const response = await fetch('https://backend.cultivesmart.com.br/api/estoque');
                const data = await response.json();
                setEstoqueData(data);
                setFilteredData(data);
            } catch (error) {
                console.error('Erro ao buscar dados do estoque:', error);
            }
        };

        fetchCategorias();
        fetchFornecedores();
        fetchEstoque();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setModalData(null);
    };

    const handleRegistrarEstoque = () => {
        // Lógica para registrar entrada no estoque (usando modalData)
        setModalVisible(false);
        alert(`Entrada registrada para o item: ${modalData.produto}`);
    };

    const handleSaidaEstoque = () => {
        // Lógica para registrar saída do estoque (usando modalData)
        setModalVisible(false);
        alert(`Saída registrada para o item: ${modalData.produto}`);
    };

    useEffect(() => {
        const filtered = estoqueData.filter((item) => {
            const categoriaMatch = filters.categoria ? item.category_id === parseInt(filters.categoria) : true;
            return categoriaMatch;
        });
        setFilteredData(filtered);
    }, [filters, estoqueData]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Disponível':
                return 'success';
            case 'Baixo Estoque':
                return 'warning';
            case 'Indisponível':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Estoque Atual</strong> <small>Gestão de Estoque</small>
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
                        {fornecedores.records && fornecedores.records.length > 0 ?
                            fornecedores.records.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nome}
                                </option>
                            )) : (<option>Nenhum fornecedor encontrado</option>)}
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
                <CCol md={2}>
                  <CFormSelect
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">Filtrar por Status</option>
                    <option value="Disponível">Disponível</option>
                    <option value="Baixo Estoque">Baixo Estoque</option>
                    <option value="Indisponível">Indisponível</option>
                  </CFormSelect>
                </CCol>
                <CCol md={1}>
                  <CButton type="button" color="primary">
                    Filtrar
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
            
            <CRow className="g-3">
                {filteredData.map((item) => (
                    <CCol md={4} key={item.id}>
                        <CCard style={{ width: '18rem' }}>
                            <CCardImage orientation="top" alt={item.produto} src={item.imagem || product_default} />
                            <CCardBody>
                                <CCardTitle>{item.nome}</CCardTitle>
                                <CCardText>
                                    <p className="mb-2">
                                        <strong>Nome:</strong> {item.nome}
                                    </p>
                                    <div className="mb-2">
                                        <strong>Quantidade:</strong> {item.quantidade} {item.unidade_medida} 
                                    </div>
                                    <div className="mb-2">
                                        <strong>Estoque Mínimo:</strong> {item.estoque_minimo}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Status:</strong>{' '}
                                        <CBadge color={getStatusBadge(item.status)}>
                                            {item.status}
                                        </CBadge>
                                    </div>
                                </CCardText>

                                <CButton color="primary" onClick={() => {
                                        setModalType('registrar');
                                        setModalData(item);
                                        setModalVisible(true);
                                    }}>Registrar</CButton>

                                <CButton color="danger" onClick={() => {
                                        setModalType('saida');
                                        setModalData(item);
                                        setModalVisible(true);
                                    }}>Dar Saída</CButton>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
                </CRow>
                </CCardBody>
            </CCard>
          </CCol>

          <CModal visible={modalVisible} onClose={handleModalClose}>
              <CModalHeader>
                  <strong>{modalType === 'registrar' ? 'Registrar' : 'Saída'} do Estoque</strong>
              </CModalHeader>
              <CModalBody>
                  <CCol>
                      <div>
                          <strong>Produto:</strong> {modalData?.produto}
                      </div>
                      <div>
                          <strong>Quantidade Atual:</strong> {modalData?.quantidade} {modalData?.unidade}
                      </div>
                      <CFormInput type="number" placeholder="Quantidade" min="1" />
                  </CCol>
              </CModalBody>
              <CModalFooter>
                  <CButton color="secondary" onClick={handleModalClose}>
                      Cancelar
                  </CButton>
                  <CButton
                      color={modalType === 'registrar' ? 'success' : 'danger'}
                      onClick={
                          modalType === 'registrar' ? handleRegistrarEstoque : handleSaidaEstoque
                      }
                  >
                      {modalType === 'registrar' ? 'Registrar' : 'Registrar Saída'}
                  </CButton>
              </CModalFooter>
          </CModal>
      </CRow>
    );
};

export default EstoqueVisaoGeral;