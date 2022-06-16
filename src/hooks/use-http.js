import { useState, useCallback } from 'react';

const useHttp = (applyData) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(
    async (requestConfig) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(requestConfig.url, {
          method: requestConfig.method ? requestConfig.method : 'GET',
          headers: requestConfig.headers ? requestConfig.headers : {},
          body: requestConfig.body
            ? JSON.stringify(requestConfig.body)
            : null,
        });

        if (!response.ok) {
          throw new Error('Request failed!');
        }

        const data = await response.json();
        applyData(data);
      } catch (err) {
        setError(err.message || 'Something went wrong!');
      }
      setIsLoading(false);
      // dependencies were requestConfig and applyData.
      // requestConfig and applyData are objects too.

      // should also add useCallback in App,
      // to make sure that these objects are not re-created all the time.

      // transformTasks is wrapped with useCallback in App.
      // but still applyData object is left. (the one that has requestConfig.url)
      // Instead of using useMemo etc. in App,
      // here, move first param of useHttp (requestConfig)
      // to sendRequest param
      // So, only dependency is applyData
    },
    [applyData]
  );

  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;
