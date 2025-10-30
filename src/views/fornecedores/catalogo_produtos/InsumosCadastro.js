import React, { useState, useRef, useEffect, useMemo, useCallback  } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CImage,
  CCardImage,
  CForm,
  CPopover,
  CFormTextarea,
  CFormInput,
  CFormSelect,
  CRow,
  CFormCheck,
  CCardTitle,
  CCardText,
} from '@coreui/react';
import { Stepper, Step } from 'react-form-stepper';
import avatar8 from './../../../assets/images/microverdes/product_default.png'
import { DocsExample } from 'src/components'
const InsumosCadastro = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]); 
  const [unidadesMedida , setUnidadesMedida] = useState([]);
  const [tiposMedida , setTiposMedida] = useState([]);
  
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);
  const [stepErrors, setStepErrors] = useState([false, false, false, false, false]); // Array to track errors for each step
  const [fileError, setFileError] = useState(''); // Estado para erros de arquivo
  const hiddenFileInput = useRef(null);
  const [caracteresRestantes, setCaracteresRestantes] = useState(255); // Inicializa com o limite máximo

  const [aliquotaHabilitada, setAliquotaHabilitada] = useState(false);
  const [percentage, setPercentage] = useState('');


  const stepLabels = [
    { title: "Categoria", subtitle: "Escolha a categoria" },
    { title: "Fornecedor", subtitle: "Defina o fornecedor" },
    { title: "Informações", subtitle: "Preencha as informações principais" },
    { title: "Resumo", subtitle: "Resumo dos dados preenchidos" },
  ];

  const [formData, setFormData] = useState({
    nome:'',
    categoria_id: '',
    fornecedor_id: '',
    variedade: '',
    descricao: '',
    unidade_medida: '',
    tipo_medida: '',
    quantidade: null,
    preco: '',
    aliquota: '',
    aliquota_raw: '',
    logo: null
  });

  const categoryNames = {
    '1': 'Sementes - Microverde',
    '2': 'Flores Comestíveis',
    '3': 'Substrato',
  };

  const handleSubstratoSelect = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedSubstratos(selectedOptions);
  };

    const fetchedCategorias = useMemo(async () => {
      try {
          const response = await fetch('https://backend.cultivesmart.com.br/api/categorias');
          return await response.json();
      } catch (error) {
          console.error('Erro ao buscar categorias:', error);
          return null;
      }
    }, []);

    const fetchedFornecedores = useMemo(async () => {
      try {
          const response = await fetch('https://backend.cultivesmart.com.br/api/fornecedores');
          return await response.json();
      } catch (error) {
          console.error('Erro ao buscar fornecedores:', error);
          return null;
      }
    }, []);

    const fetchedUnidadesMedida = useMemo(async () => {
      try {
          const response = await fetch('https://backend.cultivesmart.com.br/api/unidades-medida');
          return await response.json();
      } catch (error) {
          console.error('Erro ao buscar unidades de medida:', error);
          return null;
      }
   }, []);

   const fetchedTiposMedida = useMemo(async () => {
    try {
        const response = await fetch('https://backend.cultivesmart.com.br/api/tipos-medida');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar tipos de medida:', error);
        return null;
    }
 }, []);

    useEffect(() => {
        const loadData = async () => {
            setCategorias(await fetchedCategorias);
            setFornecedores(await fetchedFornecedores);
            setUnidadesMedida(await fetchedUnidadesMedida);
            setTiposMedida(await fetchedTiposMedida);
        };
        loadData();
    },[fetchedCategorias, fetchedFornecedores, fetchedUnidadesMedida, fetchedTiposMedida]);

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    setFileError(''); // Limpar erro anterior

    if (file) {
      // Validar extensão do arquivo
      const allowedExtensions = ['png', 'jpg', 'jpeg'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension)) {
        setFileError(`Formato não permitido. Use apenas: ${allowedExtensions.join(', ').toUpperCase()}`);
        // Limpar o input
        event.target.value = '';
        return;
      }

      // Validar tamanho do arquivo (opcional - máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB em bytes
      if (file.size > maxSize) {
        setFileError('Arquivo muito grande. Tamanho máximo: 5MB');
        event.target.value = '';
        return;
      }

      setFormData((prevData) => ({
          ...prevData,
          logo: file,
          logoUrl: URL.createObjectURL(file),
      }));
    }
  };

  const formatarPreco = (valor) => {
    if (!valor) return '';
    const valorNumerico = valor.replace(/[^\d]/g, '');
    const valorFormatado = (parseInt(valorNumerico) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    return valorFormatado;
};

  const handleImageClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const { id, value, type, checked } = event.target;
    setFormData(prevState => ({
        ...prevState,
        [id]: type === 'checkbox' ? checked : value,
    }));

    if (id === 'descricao') {
      setCaracteresRestantes(255 - value.length); // Atualiza os caracteres restantes
    }

    if (event.target.name === 'define_especificacao') { // Assuming this is the id of your radio button group
      setShowSpecificationFields(value === '1'); // Show if value is '1' (Sim)
    }

    // Clear error for the current field when it's changed
    setStepErrors(prevErrors => {
        const newErrors = [...prevErrors];
        // Find the step the field belongs to and clear the error
        if (activeStep === 1 && id === 'fornecedor_id') newErrors[activeStep] = false;
        if (activeStep === 2 && ['descricao', 'unidade_medida', 'estoque_minimo'].includes(id)) newErrors[activeStep] = false;
        if (activeStep === 3 && ['dias_pilha', 'dias_blackout', 'dias_colheita', 'hidratacao'].includes(id)) newErrors[activeStep] = false;
        return newErrors;
    });
};

const handleChange1 = (event) => {
  const { value } = event.target;
  setShowSpecificationFields(value === '1'); // Atualiza o estado com base no valor do rádio
};

  const handleNext = (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newStepErrors = [...stepErrors];

    // Validation logic for each step
    if (activeStep === 0 && !selectedCategory) {
        hasErrors = true;
    } else if (activeStep === 1 && !formData.fornecedor_id) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    } else if (activeStep === 2 && (
          !formData.logo || !formData.nome.trim() || !formData.variedade.trim() || !formData.descricao.trim() ||
          !formData.unidade_medida || !formData.quantidade || !formData.preco)
   ) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    } else if (activeStep === 2 &&
      selectedCategory === 2 && (!formData.nome.trim() ||  !formData.variedade.trim() || !formData.descricao.trim())
    ) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    }
    
    // Verificar se há erro de arquivo
    if (activeStep === 2 && fileError) {
        hasErrors = true;
        newStepErrors[activeStep] = true;
    }
    
    setStepErrors(newStepErrors);

    if (!hasErrors) {
        setActiveStep(prevStep => prevStep + 1);
        setFileError(''); // Limpar erro de arquivo ao avançar
    }
};


const handleCategorySelect = (categoria_id) => {
  setSelectedCategory(categoria_id);  // Atualiza o estado da categoria selecionada
  setFormData(prevState => ({
    ...prevState,
    categoria_id: categoria_id  // Atualiza o valor da categoria no formData
  }));
};

const handleFornecedorSelect = (id) => {
  setFormData(prevState => ({
      ...prevState,
      fornecedor_id: id
  }));
  setSelectedFornecedor(id);
};

const handleBack = (e) => {
  e.preventDefault();
  setActiveStep((prev) => Math.max(prev - 1, 0));
  // Clear errors for the current step when going back
  setStepErrors(prevErrors => {
      const newErrors = [...prevErrors];
      newErrors[activeStep] = false; // Clear errors for the current step
      return newErrors;
  });
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formDataToSend = new FormData(); // Use FormData para enviar arquivos
        
      // Converter o preço para decimal antes de enviar
      const precoDecimal = parseFloat(formData.preco) / 100;
      formDataToSend.append('preco', precoDecimal.toFixed(2)); // Garante duas casas decimais

      const aliquotaDecimal = parseFloat(formData.aliquota) / 100;
      formDataToSend.append('aliquota', aliquotaDecimal.toFixed(2));

      for (const key in formData) {
        if (key !== 'preco') { // Evita adicionar o preço bruto novamente
          formDataToSend.append(key, formData[key]);
        }
      }
      
      const response = await fetch('https://backend.cultivesmart.com.br/api/insumos', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Insumo cadastrado com sucesso!');
        setFormData({
          selectedCategory: 0,
          categoria_id: '', fornecedor_id: '', descricao: '', unidade_medida: '',
          estoque_minimo: 0, dias_pilha: 0, dias_blackout: 0, dias_colheita: 0, hidratacao: '',
          colocar_peso: true, substrato: false
        });
        setActiveStep(0);
      } else {
        alert('Erro ao cadastrar insumo!');
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }
  };

  
   const formatValue = useCallback((rawValue) => {
    // 1. Remove todos os caracteres que não sejam dígitos.
    const digitsOnly = rawValue.replace(/\D/g, '');

    // Se a string estiver vazia, retorna uma string vazia.
    if (digitsOnly === '') {
      return '';
    }

    // 2. Garante que a string tenha pelo menos 3 dígitos para formatar "0,01".
    const paddedValue = digitsOnly.padStart(3, '0');

    // 3. Insere a vírgula antes dos dois últimos dígitos.
    const formattedValue = `${paddedValue.slice(0, -2)},${paddedValue.slice(-2)}`;

    return formattedValue;
  }, []);
  

  const handleKeyDown = useCallback((event) => {
    // Se a tecla pressionada for 'Backspace' ou 'Delete'...
    if (event.key === 'Backspace' || event.key === 'Delete') {
      const currentValue = percentage;

      // Remove a vírgula para obter apenas os dígitos.
      const digitsOnly = currentValue.replace(/\D/g, '');

      // Remove o último dígito.
      const newValue = digitsOnly.slice(0, -1);

      // Formata o novo valor e atualiza o estado.
      setPercentage(formatValue(newValue));
    }
  }, [percentage, formatValue]); // Dependências para o useCallback.


  const handleChangee = useCallback((event) => {
    const rawValue = event.target.value;

    // A lógica de formatação acontece aqui.
    const formattedValue = formatValue(rawValue);

    // Atualiza o estado do componente com o valor formatado.
    setPercentage(formattedValue);
  }, [formatValue]); // Dependência para o useCallback.

  
  return (
    <CContainer>
      <Stepper activeStep={activeStep}>
        <Step label="Categoria" onClick={() => setActiveStep(0)} />
        <Step label="Fornecedor" onClick={() => setActiveStep(1)} />
        <Step label="Informações" onClick={() => setActiveStep(2)} />
        <Step label="Resumo" onClick={() => setActiveStep(3)} />
      </Stepper>
      <CForm onSubmit={handleSubmit} className="row g-3">
          
          {activeStep === 0 && (
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>{stepLabels[activeStep].title} - </strong>
                  <small>{stepLabels[activeStep].subtitle}</small>
                </CCardHeader>
                <CCardBody>
                  <DocsExample href="components/card/#background-and-color">
                    <CRow xs={{ gutterY: 5 }} >

                    {categorias && categorias.records && categorias.records.map((categoria) => {
                          return (
                            <CCol lg={4} key={categoria.id}>
                              <CCard color={ selectedCategory === categoria.id ? 'success' : 'light'}
                                      textColor={ selectedCategory === categoria.id ? 'white' : ''}
                                      onClick={() => handleCategorySelect(categoria.id)}
                                      style={{cursor: 'pointer', height: '400px'}}>
                                <CCardImage orientation="top" src={`data:image/png;base64,${categoria.logoPath}`} />
                                <CCardBody>
                                  <CCardTitle>{categoria.descricao}</CCardTitle>
                                  <CCardText>
                                      <small>{categoria.comentarios}</small>
                                  </CCardText>
                                </CCardBody>
                              </CCard>
                            </CCol>
                          );
                        })}
                    </CRow>
                  </DocsExample>
                </CCardBody>
              </CCard>
            </CCol>
          )}

          {activeStep === 1 && (
            <CCol xs={12}>
              <CCard className="h-60">
                <CCardHeader>
                  <strong>{stepLabels[activeStep].title} - </strong>
                  <small>{stepLabels[activeStep].subtitle}</small>
                </CCardHeader>
                <CCardBody>
                  <DocsExample href="components/card/#background-and-color">
                    <CRow xs={{ gutterY: 5 }} >
                        {fornecedores.records.map((fornecedor) => {
                          return (
                          <CCol lg={4} key={fornecedor.id}>
                            <CCard key={fornecedor.id}
                              color={ selectedFornecedor === fornecedor.id ? 'success' : 'light'}
                              textColor={ selectedFornecedor === fornecedor.id ? 'white' : ''}
                              className="mb-3 h-60"
                              onClick={() => handleFornecedorSelect (fornecedor.id)}
                              style={{cursor: 'pointer', height: '300px', display: 'flex', flexDirection: 'column', backgroundColor: 'white'}}>
                              <CCardHeader style={{flexShrink: 0}}>{fornecedor.nome}</CCardHeader>
                              <div style={{flex: 1, backgroundColor: 'white', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <CCardImage 
                                  src={`data:image/png;base64,${fornecedor.logoPath}`}
                                  style={{
                                    cursor: 'pointer', 
                                    maxWidth: '100%', 
                                    maxHeight: '100%', 
                                    width: 'auto',
                                    height: 'auto',
                                    backgroundColor: '#ffffffff',
                                    objectFit: 'contain'
                                  }}
                                  onError={(e) => console.error('Erro ao carregar imagem:', e.target.src, e)}
                                />
                              </div>
                            </CCard>
                          </CCol>);
                        })}
                    </CRow>
                  </DocsExample>
                </CCardBody>
              </CCard>
            </CCol>
          )}
            
          {activeStep === 2 && (
              <CRow>
                <CCol md={8} xs={8}>
                  <CCard className="mb-4">
                    <CCardHeader>
                      <strong>{stepLabels[2].title} - </strong>
                      <small>{stepLabels[2].subtitle}</small>
                    </CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol md={5} xs={3}>
                            <CImage fluid  orientation="left" src={formData.logoUrl || avatar8}
                              onClick={handleImageClick}
                              style={{ cursor: 'pointer', maxHeight: '13em', width: '100%', objectFit: 'cover',
                                height: '100%',
                                border: stepErrors[activeStep] && !formData.logo ? '2px solid red' : 'none' // Adiciona borda vermelha se houver erro e logo não selecionado
                              }}
                                />
                            <input
                            type="file"
                            ref={hiddenFileInput}
                            onChange={handleLogoChange}
                            style={{ display: 'none' }}
                            accept=".png,.jpg,.jpeg"
                            />
                            
                            {/* Mensagem informativa */}
                            <div className="mt-2">
                              <small className="text-muted">
                                📸 Clique na imagem para fazer upload<br/>
                                <strong>Formatos aceitos:</strong> PNG, JPG, JPEG<br/>
                                <strong>Tamanho máximo:</strong> 5MB
                              </small>
                            </div>
                            
                            {/* Mensagem de erro */}
                            {fileError && (
                              <div className="mt-2">
                                <small className="text-danger">
                                  ⚠️ {fileError}
                                </small>
                              </div>
                            )}
                        </CCol>
                        <CCol md={7} xs={9}>
                          <CRow>
                            <CCol md={6} xs={7}>
                              <CFormInput
                                    type="text"
                                    id="nome"
                                    floatingClassName="mb-3"
                                    floatingLabel="Nome"
                                    value={formData.nome}
                                    onChange={handleChange} required
                                    className={stepErrors[activeStep] && (!formData.nome) ? 'is-invalid' : ''}
                                  />
                            </CCol>
                          
                            <CCol md={6} xs={5}>
                              <CFormInput
                                    type="text"
                                    id="variedade"
                                    floatingClassName="mb-3"
                                    floatingLabel="Variedade"
                                    value={formData.variedade}
                                    onChange={handleChange}
                                    required
                                    className={stepErrors[activeStep] && (!formData.variedade) ? 'is-invalid' : ''}
                                  />
                            </CCol>
                          
                          
                          
                          <CCol md={12}  xs={{ gutterY: 5}}>
                            <CFormTextarea
                              id="descricao"
                              value={formData.descricao}
                              floatingLabel="Descricao" 
                              floatingClassName="mb-3"                         
                              onChange={handleChange}
                              style={{ minHeight: '130px' }} // Altura mínima
                              className={stepErrors[activeStep] && (!formData.descricao) ? 'is-invalid' : ''}
                              required
                              maxLength={255}
                            ></CFormTextarea>
                            <p>Máximo de caracteres: {caracteresRestantes}/255</p>

                          </CCol>
                        </CRow>
                      </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={4} xs={4}>
                  <CCard className="mb-4" color="white" style={{cursor: 'pointer'}}>
                      <CCardHeader>
                        <strong>Especificações do Produto</strong>
                      </CCardHeader>
                      <CCardBody>
                        <CRow>
                          <CCol md={12} xs={12}>
                            <CPopover content="Qual a tipo de medida?" placement="right" trigger={['hover', 'focus']}>
                              <CFormSelect
                                    id="tipo_medida"
                                    floatingLabel="Tipo de Medida"
                                    aria-label="Floating label select example"
                                    value={formData.tipo_medida}
                                    title=''
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    className={stepErrors[activeStep] && (!formData.tipo_medida) ? 'mb-3 is-invalid' : 'mb-3'}
                                    required
                                  >
                                    <option value="" disabled>Escolha...</option>
                                    {
                                      tiposMedida && tiposMedida.map((tipoMedida) => {
                                        return (
                                          <option key={tipoMedida.id} value={tipoMedida.id}>{tipoMedida.descricao}</option>
                                        )
                                    }
                                  )}
                                </CFormSelect>
                              </CPopover>
                          </CCol>
                          

                          <CCol md={7} xs={7}>
                          <CPopover content="Qual a quantidade (Kg/g) do saco" placement="right" trigger={['hover', 'focus']}>
                            <CFormSelect
                              id="unidade_medida"
                              floatingLabel="Unidade de Medida"
                              aria-label="Floating label select example"
                              value={formData.unidade_medida}
                              title=''
                              onChange={(e) => {
                              handleChange(e);
                              }}
                              className={stepErrors[activeStep] && (!formData.unidade_medida) ? 'mb-3 is-invalid' : 'mb-3'}
                              required
                              >
                                <option value="" disabled>Escolha...</option>
                                {
                                    unidadesMedida && unidadesMedida.filter(unidadeMedida => parseInt(unidadeMedida.tipo_medida_id) === parseInt(formData.tipo_medida)).map((unidadeMedida) => {
                                  return (  
                                  <option key={unidadeMedida.id} value={unidadeMedida.id}>{unidadeMedida.descricao}</option>
                                  )
                                }
                              )}
                            </CFormSelect>
                            </CPopover>
                          </CCol>
                          
                          <CCol md={5} xs={5}>
                            <CPopover content="Qual a quantidade (Kg/g) do saco" placement="right" trigger={['hover', 'focus']}>
                              <CFormInput
                                  type="numeric"
                                  id="quantidade"
                                  floatingClassName="mb-3"
                                  floatingLabel="Quantidade"
                                  value={formData.quantidade}
                                  onChange={handleChange}
                                  required
                                  className={stepErrors[activeStep] && (!formData.quantidade) ? 'is-invalid' : ''}
                                />
                            </CPopover>
                          </CCol>
                          
                          <CCol md={6} xs={6}>
                            <CPopover content="Preço bruto do insumo" placement="right" trigger={['hover', 'focus']}>
                                <CFormInput
                                  type="text"
                                  id="preco"
                                  floatingLabel="Preço"
                                  value={formatarPreco(formData.preco)}
                                  onChange={(e) => {
                                      const valorNumerico = e.target.value.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
                                      setFormData({ ...formData, preco: valorNumerico });
                                  }}
                                  required
                                  className={stepErrors[activeStep] && (!formData.preco) ? 'is-invalid' : ''}
                              />
                            </CPopover>
                          </CCol>
                            {/* <CCol md={12} className="mb-3">
                            <hr/>
                            </CCol>
                          <CCol md={12} className="mb-3">
                            <CFormCheck
                              id="habilitarAliquota"
                              label="Informar Alíquota (%)"
                              checked={aliquotaHabilitada}
                              onChange={(e) => setAliquotaHabilitada(e.target.checked)}
                            />
                          </CCol>

                          
                            <CCol md={6} xs={6}>
                              <CPopover content="Alíquota (ICMS em %)" placement="right" trigger={['hover', 'focus']}>
                                  <CFormInput
                                    id="aliquota"
                                    type="text"
                                    value={formData.aliquota}
                                    onChange={(e) => {

                                        const valorNumerico = e.target.value.replace(/[^\d]/g, '');

                                        const percentual = valorNumerico ? parseInt(valorNumerico) / 100 : '';
                                        
                                        setFormData({ ...formData, aliquota: percentual });
                                    }}
                                    placeholder="0,00"
                                    disabled={!aliquotaHabilitada}
                                  />
                                </CPopover>
                            </CCol> */}
                            
                        </CRow>
                      </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
          )}

          {activeStep === 3 && (
              <CCol xs={12}>
                <CCard className="mb-4">
                  <CCardHeader>
                    <strong>{stepLabels[activeStep].title} - </strong>
                    <small>{stepLabels[activeStep].subtitle}</small>
                  </CCardHeader>
                  <CCardBody>
                    <div>
                      <h2 className="text-xl font-bold">Resumo</h2>
                      <p><strong>Categoria:</strong> {
                        categorias?.records?.find(c => c.id === formData.categoria_id)?.descricao || 'Categoria não encontrada'
                      }</p>
                      <p><strong>Fornecedor:</strong> {
                        fornecedores.records?.find(f => f.id === formData.fornecedor_id)?.nome || 'Fornecedor não encontrado'
                      }</p>
                      <p><strong>Nome:</strong> {formData.nome}</p>
                      <p><strong>Variedade:</strong> {formData.variedade}</p>
                      <p><strong>Descrição:</strong> {formData.descricao}</p>
                      <p><strong>Tipo de Medida:</strong> {
                        tiposMedida?.find(t => t.id == formData.tipo_medida)?.descricao || 'Não informado'
                      }</p>
                      <p><strong>Unidade de Medida:</strong> {
                        unidadesMedida?.find(u => u.id == formData.unidade_medida)?.descricao || 'Não informado'
                      }</p>
                      <p><strong>Quantidade:</strong> {formData.quantidade}</p>
                      <p><strong>Preço:</strong> {formatarPreco(formData.preco)}</p>
                      {/* <p><strong>Alíquota:</strong> {formData.aliquota}</p> */}
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
          )}
          
          <CRow className="mt-4">
            {activeStep > 0 && (
              <CCol>
                <CButton color="secondary" onClick={handleBack}>Voltar</CButton>
              </CCol>
            )}
            {activeStep === 3 ? (
              <CCol>
              <CButton color="success" type="submit">Cadastrar</CButton>
            </CCol>
            ) : (
              <CCol>
                <CButton color="primary" onClick={(e) => handleNext(e)}>Próximo</CButton>
              </CCol>
            )}
          </CRow>
        
      </CForm>
     
    </CContainer>
  );
};

export default InsumosCadastro;