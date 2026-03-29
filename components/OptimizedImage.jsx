import Image from 'next/image';
import { useState, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false, 
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  ...props 
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate blur data URL if not provided (only on client)
  const generateBlurDataURL = (width, height) => {
    if (!isClient) return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Create a simple gradient blur effect
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(1, '#e0e0e0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL();
  };

  const defaultBlurDataURL = blurDataURL || generateBlurDataURL(10, 10);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      sizes={sizes}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={defaultBlurDataURL}
      loading={priority ? 'eager' : 'lazy'}
      {...props}
    />
  );
};

export default OptimizedImage;
