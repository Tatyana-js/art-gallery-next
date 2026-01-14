import { memo, useState } from 'react';
import styles from './SettingPaintButton.module.scss';
import Button from '@/components/ui_kit/Buttons';

import SettingIcon from '@/components/icons/SettingIcon';

interface ISettingPaintButtonProps {
  onEdit: () => void;
  onDelete?: () => void;
  onSetMainPaint?: () => void;
}

const SettingPaintButton = memo(
  ({ onEdit, onDelete, onSetMainPaint }: ISettingPaintButtonProps) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
      <div className={styles.container}>
        <div className={styles.iconContainer}>
          <Button variant="icon" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
            <SettingIcon />
          </Button>
        </div>
        {isSettingsOpen && (
          <div className={styles.settingsMenu}>
            <button type="button" className={styles.setCoverButton} onClick={onSetMainPaint}>
              Set the cover
            </button>
            <button type="button" className={styles.buttons} onClick={onEdit}>
              Edit
            </button>
            <button type="button" className={styles.buttons} onClick={onDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }
);

SettingPaintButton.displayName = 'SettingPaintButton';

export default SettingPaintButton;
