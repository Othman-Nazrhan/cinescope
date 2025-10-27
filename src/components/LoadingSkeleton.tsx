interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

const LoadingSkeleton = ({ className = "", count = 1 }: LoadingSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`bg-gray-800 rounded-lg overflow-hidden animate-pulse ${className}`}>
          <div className="h-64 bg-gray-700"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default LoadingSkeleton;
