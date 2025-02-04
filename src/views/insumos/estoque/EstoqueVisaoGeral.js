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
    const [categorias, setCategorias] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(''); // 'registrar' ou 'saida'
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('http://backend.cultivesmart.com.br/api/categorias');
                const data = await response.json();
                setCategorias(data);
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
            }
        };

        const fetchEstoque = async () => {
            try {
                const response = await fetch('http://backend.cultivesmart.com.br/api/estoque');
                const data = await response.json();
                setEstoqueData(data);
                setFilteredData(data);
            } catch (error) {
                console.error('Erro ao buscar dados do estoque:', error);
            }
        };

        fetchCategorias();
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
                                <CCol md={4}>
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
                            </CRow>
                        </CForm>

                        <CRow className="g-3">
                            {filteredData.map((item) => (
                                <CCol md={4} key={item.id}>
                                    <CCard>
                                        <CCardImage
                                            orientation="top"
                                            src={item.imagem || product_default}
                                            alt={item.produto}
                                            style={{ width: '50%', margin: '0 auto' }}
                                        />
                                        <CCardBody>
                                            <h5 className="mb-3">{item.produto}</h5>
                                            <p className="mb-2">
                                                <strong>ID:</strong> {item.id}
                                            </p>
                                            <p className="mb-2">
                                                <strong>Quantidade:</strong> {item.quantidade} {item.unidade}
                                            </p>
                                            <p className="mb-2">
                                                <strong>Estoque Mínimo:</strong> {item.estoque_minimo}
                                            </p>
                                            <p className="mb-2">
                                                <strong>Status:</strong>{' '}
                                                <CBadge color={getStatusBadge(item.status)}>
                                                    {item.status}
                                                </CBadge>
                                            </p>
                                            <CButton
                                                color="success"
                                                onClick={() => {
                                                    setModalType('registrar');
                                                    setModalData(item);
                                                    setModalVisible(true);
                                                }}
                                            >
                                                Registrar
                                            </CButton>
                                            <CButton
                                                color="danger"
                                                onClick={() => {
                                                    setModalType('saida');
                                                    setModalData(item);
                                                    setModalVisible(true);
                                                }}
                                            >
                                                Dar Saída
                                            </CButton>
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
                        <p>
                            <strong>Produto:</strong> {modalData?.produto}
                        </p>
                        <p>
                            <strong>Quantidade Atual:</strong> {modalData?.quantidade} {modalData?.unidade}
                        </p>
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