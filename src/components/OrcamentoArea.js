import PropTypes from 'prop-types';
import React from 'react';
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CRow, CCol } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCode, cilMediaPlay } from '@coreui/icons';

const OrcamentoArea = (props) => {
  const { children, href, tabContentClassName } = props;

  return (
      <CCol xs={4} md={5}>
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

OrcamentoArea.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  tabContentClassName: PropTypes.string,
};

export default React.memo(OrcamentoArea);