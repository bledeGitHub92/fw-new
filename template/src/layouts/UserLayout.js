import React, { Fragment } from 'react';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';
import { COPYRIGHT } from '@/utils/const';

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> {COPYRIGHT}
  </Fragment>
);

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.content}>{children}</div>
        <GlobalFooter copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
