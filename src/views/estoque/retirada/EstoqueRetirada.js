import '@coreui/coreui/dist/css/coreui.min.css';
import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CAlert,
  CSpinner,
  CInputGroup,
  CInputGroupText,
  CFormSelect // Adicionado para a seleção de insumo
} from '@coreui/react';

const RetiradaEstoque = () => {
  const [insumos, setInsumos] = useState([]);
  const [selectedInsumoId, setSelectedInsumoId] = useState('');
  const [quantidadeRetirada, setQuantidadeRetirada] = useState('');
  const [motivoRetirada, setMotivoRetirada] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // Para mensagens de sucesso/erro
  const [messageType, setMessageType] = useState(''); // 'success' ou 'danger'

  // A URL base da sua API real
  const API_BASE_URL = 'https://backend.cultivesmart.com.br/api'; 

  // Função para buscar os insumos do estoque
  const fetchInsumos = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/estoque`);
      if (!response.ok) {
        throw new Error('Falha ao carregar insumos do estoque.');
      }
      const data = await response.json();
      
      // Ajuste aqui para garantir que 'data.records' é a array correta
      // Se a sua API retorna diretamente um array sem 'records', ajuste para 'data'
      setInsumos(data.records); 
    } catch (error) {
      console.error('Erro ao buscar insumos:', error);
      setMessage(`Erro ao carregar insumos: ${error.message}`);
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsumos(); // Carrega os insumos ao montar o componente
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)

    setMessage(null); // Limpa mensagens anteriores

    if (!selectedInsumoId) {
      setMessage('Por favor, selecione um insumo para retirada.');
      setMessageType('danger');
      return;
    }

    const quantidade = parseFloat(quantidadeRetirada);
    if (isNaN(quantidade) || quantidade <= 0) {
      setMessage('Por favor, insira uma quantidade válida maior que zero.');
      setMessageType('danger');
      return;
    }

    setLoading(true);

    try {
      
      const response = await fetch(`${API_BASE_URL}/estoque/${selectedInsumoId}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Inclua o token CSRF ou de autenticação se sua API Laravel exigir
          // 'X-CSRF-TOKEN': 'seu-token-csrf-aqui', 
          // 'Authorization': `Bearer ${seuTokenDeAuth}` // Se houver autenticação JWT/Bearer
        },
        body: JSON.stringify({
          quantidade_retirada: quantidade,
          motivo: motivoRetirada || 'Retirada geral', // Use um motivo padrão se não for fornecido
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Se a resposta não for OK (status 4xx ou 5xx), lance um erro com a mensagem da API
        throw new Error(responseData.message || 'Erro ao registrar retirada no estoque.');
      }

      setMessage(`Retirada de ${quantidade}g registrada com sucesso para o insumo!`);
      setMessageType('success');
      setQuantidadeRetirada(''); // Limpa o campo de quantidade
      setMotivoRetirada('');     // Limpa o campo de motivo
      // Recarrega a lista de insumos para refletir a nova quantidade disponível
      fetchInsumos(); 

    } catch (error) {
      console.error('Erro na retirada:', error);
      setMessage(`Erro na retirada: ${error.message}`);
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CContainer className="mt-4">
      <CRow className="justify-content-center">
        <CCol md={8} lg={6}>
          <CCard>
            <CCardHeader className="text-center">
              <h2>Retirada de Insumos do Estoque</h2>
            </CCardHeader>
            <CCardBody>
              {loading && insumos.length === 0 && (
                <div className="text-center mb-3">
                  <CSpinner color="primary" /> Carregando insumos...
                </div>
              )}

              {message && (
                <CAlert color={messageType} className="mb-3">
                  {message}
                </CAlert>
              )}

              <CForm onSubmit={handleSubmit}>
                <div className="mb-3">
                  <CFormLabel htmlFor="insumoSelect">Selecione o Insumo:</CFormLabel>
                  <CFormSelect
                    id="insumoSelect"
                    value={selectedInsumoId}
                    onChange={(e) => setSelectedInsumoId(e.target.value)}
                    disabled={loading || insumos.length === 0}
                    required
                  >
                    <option value="">-- Escolha um Insumo --</option>
                    {/* Renderiza as opções do dropdown com base nos insumos carregados */}
                    {insumos.map((insumo) => (
                      <option key={insumo.id} value={insumo.id}>
                        {insumo.insumo.nome} (Estoque: {insumo.quantidade_total} {insumo.insumo.unidade_medida})
                      </option>
                    ))}
                  </CFormSelect>
                  {insumos.length === 0 && !loading && (
                    <small className="text-muted d-block mt-2">Nenhum insumo disponível para retirada ou erro ao carregar.</small>
                  )}
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="quantidadeRetirada">Quantidade a Retirar:</CFormLabel>
                  <CInputGroup>
                    <CFormInput
                      type="number"
                      id="quantidadeRetirada"
                      value={quantidadeRetirada}
                      onChange={(e) => setQuantidadeRetirada(e.target.value)}
                      placeholder="Ex: 500"
                      step="0.01"
                      min="0.01"
                      disabled={loading}
                      required
                    />
                    <CInputGroupText>gramas</CInputGroupText>
                  </CInputGroup>
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="motivoRetirada">Motivo da Retirada (Opcional):</CFormLabel>
                  <CFormInput
                    as="textarea"
                    id="motivoRetirada"
                    value={motivoRetirada}
                    onChange={(e) => setMotivoRetirada(e.target.value)}
                    rows="2"
                    placeholder="Ex: Plantio de nova safra, Descarte por perda, etc."
                    disabled={loading}
                  />
                </div>

                <div className="d-grid gap-2">
                  <CButton color="primary" type="submit" disabled={loading}>
                    {loading ? <CSpinner size="sm" aria-hidden="true" className="me-2" /> : null}
                    Retirar do Estoque
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default RetiradaEstoque;