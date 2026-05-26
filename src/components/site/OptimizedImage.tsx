import { useState, useRef, useEffect } from "react";

interface OptimizedImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** If true, loads immediately without lazy/intersection observer */
  priority?: boolean;
  /** Aspect ratio for placeholder (e.g. "1/1", "16/9") */
  aspectRatio?: string;
  /** Background color while loading */
  placeholderColor?: string;
}

/**
 * Optimized image component with:
 * - Smooth fade-in on load
 * - Background placeholder until loaded
 * - Native lazy loading for non-priority images
 * - Width/height attributes to prevent CLS
 */
const OptimizedImage = ({
  priority = false,
  aspectRatio,
  placeholderColor = "hsl(36 30% 94%)",
  className = "",
  style,
  alt = "",
  ...props
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // If the image is already cached/complete, mark as loaded immediately
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <img
      ref={imgRef}
      {...props}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      onLoad={() => setLoaded(true)}
      className={className}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.4s ease-in-out",
        backgroundColor: placeholderColor,
        ...(aspectRatio ? { aspectRatio } : {}),
      }}
    />
  );
};

export default OptimizedImage;
