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

                    </CCardBody>
                </CCard>
            </CCol>

        </CRow>
    );
};

export default EstoqueVisaoGeral;