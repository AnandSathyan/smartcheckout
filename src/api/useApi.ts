import { useState, useEffect, useCallback } from 'react';

interface ApiResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseApiOptions {
  initialData?: any;
  dependencies?: any[];
}

export function useApi<T>(url: string, options: UseApiOptions = {}): ApiResponse<T> & { refetch: () => Promise<void> } {
  const [data, setData] = useState<T | null>(options.initialData || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch data from the API
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  // Run the fetchData when component mounts or dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData, ...(options.dependencies || [])]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    await fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}
