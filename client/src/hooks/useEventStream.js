import { useEffect, useRef, useState } from 'react';

// Establish an SSE connection to /events/stream with auth token passed as query param.
// Returns { event, error, connected }.
export const useEventStream = () => {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const esRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return; // wait until authenticated
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4500/api';
    const url = `${BASE_URL}/events/stream?token=${encodeURIComponent(token)}`;
    try {
      const es = new EventSource(url);
      esRef.current = es;
      es.onopen = () => setConnected(true);
      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          setEvent(data);
        } catch (parseErr) {
          // ignore malformed messages
        }
      };
      es.onerror = () => {
        setError('stream-error');
        setConnected(false);
        // Close to allow fallback
        es.close();
      };
    } catch (err) {
      setError(err.message || 'init-error');
    }
    return () => {
      if (esRef.current) esRef.current.close();
    };
  }, []);

  return { event, error, connected };
};

export default useEventStream;
