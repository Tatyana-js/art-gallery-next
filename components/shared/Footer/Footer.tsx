import { FC } from 'react';
import styles from './Footer.module.scss';
import FacebookIcon from '@/components/icons/FacebookIcon';
import InstagrammIcon from '@/components/icons/InstagrammIcon';
import VkIcon from '@/components/icons/VkIcon';

const Footer: FC = () => (
  <footer className={styles.footer}>
    <div className={styles.containerBorder}></div>
    <div className={styles.info}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>
          Проект реализован в рамках стажировки <br />
          для Frontend-разработчиков от компании{' '}
          <a href="https://framework.team/" className={styles.frameworkTeam}>
            Framework Team
          </a>
        </p>
        <div className={styles.name}>Андреева Татьяна, 2025</div>
      </div>
      <div className={styles.connectionIcons}>
        <a
          href="https://vk.com/frameworkteam?from=groups"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="VK Framework Team"
          className={styles.iconLink}
        >
          <VkIcon />
        </a>
        <a
          href="https://vk.com/frameworkteam?from=groups"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="VK Framework Team"
          className={styles.iconLink}
        >
          <InstagrammIcon />
        </a>
        <a
          href="https://vk.com/frameworkteam?from=groups"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="VK Framework Team"
          className={styles.iconLink}
        >
          <FacebookIcon />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
