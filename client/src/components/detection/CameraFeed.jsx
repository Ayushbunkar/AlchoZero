import { useCamera } from '../../hooks/useCamera';

const CameraFeed = () => {
  const { videoRef, error } = useCamera();
  return (
    <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft overflow-hidden">
      <div className="p-3 text-gray-300 text-sm border-b border-white/10">Camera Feed</div>
      <div className="aspect-video bg-black">
        {error ? (
          <div className="p-4 text-accent-yellow">{error}</div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}
      </div>
    </div>
  );
};

export default CameraFeed;
