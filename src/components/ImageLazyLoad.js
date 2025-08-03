/**
 * Lazy Loading Image Component
 */
import React, { useState, useRef, useEffect } from 'react';
import { LoadingSpinner } from './shared';

const ImageLazyLoad = ({
  src,
  alt = '',
  placeholder = null,
  fallback = null,
  className = '',
  style = {},
  onLoad = null,
  onError = null,
  threshold = 0.1,
  rootMargin = '50px',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer setup
  useEffect(() => {
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  // Default placeholder
  const defaultPlaceholder = (
    <div className="image-placeholder">
      <LoadingSpinner size="sm" />
    </div>
  );

  // Default fallback
  const defaultFallback = (
    <div className="image-fallback">
      <span>Không thể tải ảnh</span>
    </div>
  );

  if (hasError) {
    return fallback || defaultFallback;
  }

  return (
    <div
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      style={style}
    >
      {!isInView && (placeholder || defaultPlaceholder)}
      
      {isInView && (
        <>
          {!isLoaded && (placeholder || defaultPlaceholder)}
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
              ...style,
            }}
            {...props}
          />
        </>
      )}
    </div>
  );
};

// Progressive Image Loading Component
export const ProgressiveImage = ({
  lowQualitySrc,
  highQualitySrc,
  alt = '',
  className = '',
  style = {},
  ...props
}) => {
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  return (
    <div className={`progressive-image ${className}`} style={style}>
      {/* Low quality image (shown first) */}
      <img
        src={lowQualitySrc}
        alt={alt}
        style={{
          filter: isHighQualityLoaded ? 'blur(0)' : 'blur(5px)',
          transition: 'filter 0.3s ease',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        {...props}
      />
      
      {/* High quality image (loaded in background) */}
      <img
        src={highQualitySrc}
        alt={alt}
        onLoad={() => setIsHighQualityLoaded(true)}
        style={{
          opacity: isHighQualityLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        {...props}
      />
    </div>
  );
};

// Image Gallery with Lazy Loading
export const LazyImageGallery = ({ 
  images = [], 
  itemClassName = '',
  containerClassName = '',
  onClick = null 
}) => {
  return (
    <div className={`lazy-gallery ${containerClassName}`}>
      {images.map((image, index) => (
        <div 
          key={index}
          className={`gallery-item ${itemClassName}`}
          onClick={() => onClick?.(image, index)}
          style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
          <ImageLazyLoad
            src={image.src}
            alt={image.alt || `Image ${index + 1}`}
            placeholder={
              <div className="gallery-placeholder">
                <LoadingSpinner size="sm" />
              </div>
            }
            fallback={
              <div className="gallery-fallback">
                <span>❌</span>
              </div>
            }
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      ))}
    </div>
  );
};

// Hook for preloading images
export const useImagePreloader = (imageSources = []) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const preloadImages = async (sources = imageSources) => {
    setIsLoading(true);
    
    const promises = sources.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, src]));
          resolve(src);
        };
        img.onerror = reject;
        img.src = src;
      });
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('Error preloading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (imageSources.length > 0) {
      preloadImages();
    }
  }, [imageSources]);

  return {
    loadedImages,
    isLoading,
    preloadImages,
  };
};

export default ImageLazyLoad;