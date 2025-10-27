'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  onError?: () => void;
}

const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc = '/placeholder-movie.svg',
  className = '',
  width,
  height,
  fill = false,
  sizes,
  loading = 'eager',
  onError
}: ImageWithFallbackProps) => {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  const imageSrc = imageError ? fallbackSrc : src;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      fill={fill}
      sizes={sizes}
      loading={loading}
      onError={handleError}
    />
  );
};

export default ImageWithFallback;
