import React, { useEffect, useState } from 'react';
import {
  CContainer, CRow, CCol, CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell
} from '@coreui/react';

const tiposTarefa = [
  { value: 'plantio', label: 'Plantio' },
  { value: 'blackout', label: 'Blackout' },
  { value: 'colheita', label: 'Colheita' },
];

const ConfigurarTarefas = () => {
  const [tarefas, setTarefas] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [loteSelecionado, setLoteSelecionado] = useState('');
  const tarefasFiltradas = loteSelecionado
    ? tarefas.filter(t => t.lote_id === parseInt(loteSelecionado))
    : tarefas;

  useEffect(() => {
    const fetchLotes = async () => {
      const response = await fetch('https://backend.cultivesmart.com.br/api/lotes');
      const data = await response.json();
      setLotes(data);
    };
    const fetchTarefas = async () => {
      const response = await fetch('https://backend.cultivesmart.com.br/api/tarefas');
      const data = await response.json();
      setTarefas(data);
    };
    fetchLotes();
    fetchTarefas();
  }, []);

  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>Tarefas por Lote</CCardHeader>
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={4}>
                  <label htmlFor="filtroLote">Filtrar por Lote:</label>
                  <select id="filtroLote" className="form-select" value={loteSelecionado} onChange={e => setLoteSelecionado(e.target.value)}>
                    <option value="">Todos</option>
                    {lotes.map(lote => (
                      <option key={lote.id} value={lote.id}>{lote.nome}</option>
                    ))}
                  </select>
                </CCol>
              </CRow>
              <CTable striped bordered>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Lote</CTableHeaderCell>
                    <CTableHeaderCell>Tipo</CTableHeaderCell>
                    <CTableHeaderCell>Descrição</CTableHeaderCell>
                    <CTableHeaderCell>Data</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tarefasFiltradas.map((tarefa) => (
                    <CTableRow key={tarefa.id}>
                      <CTableDataCell>{tarefa.lote?.nome || tarefa.lote_id}</CTableDataCell>
                      <CTableDataCell>{tarefa.tipo}</CTableDataCell>
                      <CTableDataCell>{tarefa.descricao}</CTableDataCell>
                      <CTableDataCell>{tarefa.data_agendada}</CTableDataCell>
                      <CTableDataCell>{tarefa.status}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ConfigurarTarefas;
