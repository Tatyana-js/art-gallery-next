import { useSwipe } from '@/hooks/useSwipe';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './AnimatedImage.module.scss';
import { IPainting } from '@/types/Artist';
import Button from '@/components/ui_kit/Buttons';
import getImageSrc from '@/lib/utils/getImageSrc';
import ArrowIcon from '@/components/icons/ArrowIcon';

interface AnimatedImageProps {
  currentPainting: IPainting;
  onSlideChange: (index: number) => void;
  currentIndex: number;
  paintings: Array<{ _id: string; image: { src: string }; name: string }>;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({
  currentPainting,
  onSlideChange,
  currentIndex,
  paintings,
}) => {
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [prevPainting, setPrevPainting] = useState(currentPainting);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToNext = useCallback(() => {
    if (currentIndex === null || paintings.length === 0 || isAnimating) return;
    setIsAnimating(true);
    setSlideDirection('right');

    const nextIndex = currentIndex + 1;
    setPrevPainting(currentPainting);

    setTimeout(() => {
      onSlideChange(nextIndex);
    }, 10);
  }, [currentIndex, paintings.length, onSlideChange, currentPainting, isAnimating]);

  const goToPrev = useCallback(() => {
    if (currentIndex === null || paintings.length === 0 || isAnimating) return;
    setIsAnimating(true);
    setSlideDirection('left');

    const prevIndex = currentIndex - 1;
    setPrevPainting(currentPainting);

    setTimeout(() => {
      onSlideChange(prevIndex);
    }, 10);
  }, [currentIndex, paintings.length, onSlideChange, currentPainting, isAnimating]);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setSlideDirection(null);
        setPrevPainting(currentPainting);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentPainting]);

  const swipeHandlers = useSwipe(goToNext, goToPrev);

  return (
    <div className={styles.sliderContainer} {...swipeHandlers}>
      {isAnimating && (
        <Image
          src={getImageSrc(prevPainting.image.src)}
          alt={prevPainting.name}
          fill
          className={clsx(
            styles.image,
            styles.prevImage,
            slideDirection === 'right' && styles.slideOutLeft,
            slideDirection === 'left' && styles.slideOutRight
          )}
          style={{ objectFit: 'cover' }}
        />
      )}
      <Image
        src={getImageSrc(currentPainting.image.src)}
        alt={currentPainting.name}
        fill
        className={clsx(
          styles.image,
          styles.currentImage,
          slideDirection === 'right' && styles.slideInRight,
          slideDirection === 'left' && styles.slideInLeft
        )}
        style={{ objectFit: 'cover' }}
      />
      <div className={styles.buttonNext}>
        <Button variant="icon" onClick={goToNext} disabled={currentIndex === paintings.length - 1}>
          <ArrowIcon />
        </Button>
      </div>
      <div className={styles.buttonPrev}>
        <Button variant="icon" onClick={goToPrev} disabled={currentIndex === 0}>
          <ArrowIcon />
        </Button>
      </div>
    </div>
  );
};
export default AnimatedImage;
