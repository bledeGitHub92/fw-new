import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import { COPYRIGHT } from '@/utils/const';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> {COPYRIGHT}
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
