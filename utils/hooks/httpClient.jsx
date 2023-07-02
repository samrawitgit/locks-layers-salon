import { useCallback, useContext, useEffect, useRef, useState } from "react";

// import { AppContext } from "@utils/containers/app.container";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  // const { error, setError } = useContext(AppContext);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrll = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrll);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrll.signal,
        });

        const responseData = await response.json();

        if (!response.ok) {
          return { error: true, msg: responseData.message };
        }

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrll
        );

        setIsLoading(false);
        return { data: responseData, error: false };
      } catch (err) {
        setError({ title: "err", message: err });
        setIsLoading(false);
        return { error: true, msg: err.message };
      }
    },
    []
  );

  const clearError = () => setError(false);

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, setIsLoading, error, sendRequest, clearError };
};
