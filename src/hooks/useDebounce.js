import { useCallback, useRef, useEffect } from "react";

function useDebouncedCallback(fn, delay) {
  const timeRef = useRef(null);

  const debouncedFn = useCallback((...args) => {
    if (timeRef.current) clearTimeout(timeRef.current);

    timeRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  });

  const cancel = useCallback(() => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
      timeRef.current = null;
    }
  }, []);

  useEffect(() => cancel(), [cancel]);

  return [debouncedFn, cancel];
}

export { useDebouncedCallback };
