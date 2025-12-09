import { FC } from 'react';
import styles from './Skeletons.module.scss';

const Skeletons: FC = () => (
  <div className={styles.painting}>
    <div className={styles.container}>
      <p className={styles.name}></p>
      <p className={styles.details}></p>
    </div>
  </div>
);

export default Skeletons;
