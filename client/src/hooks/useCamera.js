import { useEffect, useRef, useState } from 'react';

export const useCamera = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    let active = true;
    const start = async () => {
      try {
        const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (!active) return;
        setStream(media);
        if (videoRef.current) {
          videoRef.current.srcObject = media;
        }
      } catch (e) {
        setError(e?.message || 'Unable to access camera');
      }
    };
    start();
    return () => {
      active = false;
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
    // stream intentionally omitted from deps to avoid restarting camera
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { videoRef, error };
};
