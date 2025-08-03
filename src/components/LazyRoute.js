/**
 * Lazy Route Component with loading fallback
 */
import React, { Suspense } from 'react';
import { LoadingSpinner, PageLoading } from './shared';

const LazyRoute = ({ 
  component: Component, 
  fallback = <PageLoading />,
  ...props 
}) => {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

// Higher-order component for lazy loading
export const withLazyLoading = (
  importFunc,
  fallback = <PageLoading />
) => {
  const LazyComponent = React.lazy(importFunc);
  
  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Hook for dynamic imports
export const useLazyComponent = (importFunc) => {
  const [Component, setComponent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;

    importFunc()
      .then((module) => {
        if (mounted) {
          setComponent(() => module.default || module);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [importFunc]);

  return { Component, loading, error };
};

export default LazyRoute;