import PropTypes from 'prop-types';
import React from 'react';
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CRow, CCol } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCode, cilMediaPlay } from '@coreui/icons';

const EstoqueArea = (props) => {
  const { children, href, tabContentClassName } = props;

  const _href = `https://coreui.io/react/docs/${href}`;

  return (
      <CCol xs={12} md={5}> {/* Especifica 8 colunas em telas médias e maiores */}
        <div className="example">
          <CTabContent className={`rounded-bottom ${tabContentClassName ? tabContentClassName : ''}`}>
            <CTabPane className="p-3 preview" visible>
              {children}
            </CTabPane>
          </CTabContent>
        </div>
      </CCol>
  );
};

EstoqueArea.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  tabContentClassName: PropTypes.string,
};

export default React.memo(EstoqueArea);