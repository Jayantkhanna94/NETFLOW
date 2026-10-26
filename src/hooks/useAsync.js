import { useState, useCallback, useEffect, useRef } from "react";

/**
 * Custom hook to manage asynchronous operations, loading states, and error handling.
 *
 * @param {Function} asyncFunction - The asynchronous function to execute
 * @param {boolean} immediate - Whether to execute the function immediately on mount
 * @returns {Object} { status, data, error, isLoading, isError, isSuccess, isIdle, execute, retry, reset }
 */
export function useAsync(asyncFunction, immediate = false) {
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Keep track of the last arguments passed to execute so retry() can rerun with identical args
  const lastArgsRef = useRef([]);

  const execute = useCallback(
    async (...args) => {
      lastArgsRef.current = args;
      setStatus("loading");
      setError(null);

      try {
        const response = await asyncFunction(...args);
        setData(response);
        setStatus("success");
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An unexpected network error occurred.";
        setError(errorMessage);
        setStatus("error");
        return { success: false, error: errorMessage };
      }
    },
    [asyncFunction]
  );

  const retry = useCallback(() => {
    return execute(...lastArgsRef.current);
  }, [execute]);

  const reset = useCallback(() => {
    setStatus("idle");
    setData(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    status,
    data,
    error,
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "success",
    isIdle: status === "idle",
    execute,
    retry,
    reset,
  };
}
