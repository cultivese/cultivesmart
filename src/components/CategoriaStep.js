import React from "react";
import { DocsExample } from 'src/components'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CCardTitle,
  CCardText,
} from '@coreui/react';

const CategoriaStep = ({ props, selectedCategory, handleCategorySelect }) => {
  
  return (
    <>
        <DocsExample href="components/card/#background-and-color">
           <CRow xs={{ gutterY: 5 }} >
             <CCol lg={4} key='1'>
               <CCard color={ selectedCategory === '1' ? 'success' : 'light'} textColor={ selectedCategory === '1' ? 'white' : ''} className="h-100" onClick={handleCategorySelect}>
                 <CCardHeader>Sementes</CCardHeader>
                 <CCardBody>
                   <CCardTitle>Microverde</CCardTitle>
                   <CCardText>
                     Rabanete, Amaranto, Acelga, Girassol, Salsa, Mostarda, Manjericão, Cebola, Cenoura
                   </CCardText>
                 </CCardBody>
               </CCard>
             </CCol>
             <CCol lg={4} key='2'>
               <CCard color={ selectedCategory === '2' ? 'success' : 'light'} textColor={ selectedCategory === '2' ? 'white' : ''} className="h-100" onClick={handleCategorySelect}>
                 <CCardHeader>Sementes</CCardHeader>
                 <CCardBody>
                   <CCardTitle>Flores Comestíveis</CCardTitle>
                   <CCardText>
                     Amor-Perfeito Gigante Suico Purpura, Amor-Perfeito Gigante Suico Branco, Amor-Perfeito Gigante Suico Roxo
                   </CCardText>
                 </CCardBody>
               </CCard>
             </CCol>
             <CCol lg={4} key='3'>
               <CCard color={ selectedCategory === '3' ? 'success' : 'light'} textColor={ selectedCategory === '3' ? 'white' : ''} className="h-100" onClick={handleCategorySelect}>
                 <CCardHeader>Substrato</CCardHeader>
                 <CCardBody>
                   <CCardTitle>Substrato</CCardTitle>
                   <CCardText>
                     Carolina Soil, Pó de Coco
                   </CCardText>
                 </CCardBody>
               </CCard>
             </CCol>
           </CRow>
         </DocsExample>
    </>
  );
};

export default CategoriaStep;