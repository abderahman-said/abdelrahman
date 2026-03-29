import { useEffect, useRef, useCallback, useState } from 'react';

export const useIntersectionObserver = (callback, options = {}) => {
  const observerRef = useRef(null);
  const targetRefs = useRef(new Set());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const observe = useCallback((element) => {
    if (!element || !isClient) return;
    
    targetRefs.current.add(element);
    
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      });
    }
    
    observerRef.current.observe(element);
  }, [callback, options, isClient]);

  const unobserve = useCallback((element) => {
    if (!element || !observerRef.current) return;
    
    targetRefs.current.delete(element);
    observerRef.current.unobserve(element);
  }, []);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { observe, unobserve };
};

export const useLazyLoad = (src, callback) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    const onLoad = () => {
      setIsLoaded(true);
      setError(null);
      callback?.(img);
    };

    const onError = () => {
      setError(new Error(`Failed to load image: ${src}`));
      setIsLoaded(false);
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);

    return () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
  }, [src, callback]);

  return { isLoaded, error, imgRef };
};
