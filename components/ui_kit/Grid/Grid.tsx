import { ReactNode } from 'react';

import styles from './Grid.module.scss';

export interface IGridProps {
  children?: ReactNode | ReactNode[];
}

const Grid: React.FC<IGridProps> = ({ children }) => (
  <div className={styles.galleryList}>{children}</div>
);

export default Grid;
