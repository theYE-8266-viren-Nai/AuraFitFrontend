import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';

// Generic API hook for fetching data
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // ⭐ FIX: Add safety timeout (15 seconds max)
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Request timeout - please check your connection'));
          }, 15000);
        });

        const result = await Promise.race([
          apiCall(),
          timeoutPromise
        ]) as T;
        
        if (isMounted) {
          clearTimeout(timeoutId);
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          const axiosError = err as AxiosError<{ message?: string }>;
          let errorMessage = 'An error occurred';
          
          // ⭐ FIX: Better error messages
          if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
            errorMessage = 'Request timeout - is your backend running?';
          } else if (axiosError.response?.data?.message) {
            errorMessage = axiosError.response.data.message;
          } else if (axiosError.message) {
            errorMessage = axiosError.message;
          }
          
          setError(errorMessage);
          console.error('API Error:', errorMessage, err);
        }
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, dependencies);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      let errorMessage = 'An error occurred';
      
      if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
        errorMessage = 'Request timeout - is your backend running?';
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }
      
      setError(errorMessage);
      console.error('API Error:', errorMessage, err);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch };
}

// Hook for mutations (POST, PUT, DELETE)
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (variables: TVariables) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await mutationFn(variables);
      setData(result);
      return result;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
      
      let errorMessage = 'An error occurred';
      
      // ⭐ FIX: Better error messages for mutations too
      if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
        errorMessage = 'Request timeout - is your backend running?';
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }
      
      setError(errorMessage);
      console.error('Mutation Error:', errorMessage, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setIsLoading(false);
  };

  return { mutate, data, isLoading, error, reset };
}

// Usage example:
// const { data: members, isLoading, error, refetch } = useApi(() => membersApi.getAll());
// const { mutate: createMember } = useMutation(membersApi.create);