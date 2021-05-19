import React from 'react';
import styles from './index.css';

const BasicLayout: React.FC = props => {
  return (
    <div className={styles.normal}>
      <div className={styles.collpaseMenu}>
        这是侧边导航栏
        </div>
      <div className={styles.rightArea}>
        <div className={styles.rightHeader}>
          这是右边头部
        </div>
        <div>
        {props.children}
        </div>
      </div>
      {/* <h1 className={styles.title}>Yay! Welcome to umi!</h1> */}

    </div>
  );
};

export default BasicLayout;
