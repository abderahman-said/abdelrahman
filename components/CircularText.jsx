import { useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useAnimation, useMotionValue } from 'motion/react';

import './CircularText.css';

const getRotationTransition = (duration, from, loop = true) => ({
  from,
  to: from + 360,
  ease: 'linear',
  duration,
  type: 'tween',
  repeat: loop ? Infinity : 0
});

const getTransition = (duration, from) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: 'spring',
    damping: 20,
    stiffness: 300
  }
});

const CircularText = ({ text, spinDuration = 20, onHover = 'speedUp', className = '' }) => {
  const controls = useAnimation();
  const rotation = useMotionValue(0);
  const isHovering = useRef(false);
  
  // Memoize letters array to prevent unnecessary recalculations
  const letters = useMemo(() => Array.from(text), [text]);
  
  // Memoize letter calculations to prevent layout thrashing
  const letterPositions = useMemo(() => {
    return letters.map((_, i) => {
      const rotationDeg = (360 / letters.length) * i;
      const factor = Math.PI / letters.length;
      const x = factor * i;
      const y = factor * i;
      return { rotationDeg, x, y };
    });
  }, [letters.length]);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    });
  }, [spinDuration, text, onHover, controls, rotation]);

  const handleHoverStart = useCallback(() => {
    if (isHovering.current) return;
    isHovering.current = true;
    
    const start = rotation.get();
    if (!onHover) return;

    let transitionConfig;
    let scaleVal = 1;

    switch (onHover) {
      case 'slowDown':
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case 'speedUp':
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case 'pause':
        transitionConfig = {
          rotate: { type: 'spring', damping: 20, stiffness: 300 },
          scale: { type: 'spring', damping: 20, stiffness: 300 }
        };
        scaleVal = 1;
        break;
      case 'goBonkers':
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig
    });
  }, [onHover, spinDuration, rotation, controls]);

  const handleHoverEnd = useCallback(() => {
    isHovering.current = false;
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    });
  }, [spinDuration, rotation, controls]);

  return (
    <motion.div
      className={`circular-text ${className}`}
      style={{ rotate: rotation }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const { rotationDeg, x, y } = letterPositions[i];
        const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;

        return (
          <span 
            key={`${letter}-${i}`} 
            style={{ 
              transform, 
              WebkitTransform: transform,
              willChange: 'transform'
            }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
