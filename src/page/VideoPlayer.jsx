import React, { useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

export default function VideoPlayer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const video = location.state?.video || null;

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setProgress((v.currentTime / v.duration) * 100 || 0);
    setCurrentTime(formatTime(v.currentTime));
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration));
    }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) { v.pause(); } else { v.play(); }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    v.currentTime = ratio * v.duration;
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10 bg-gray-900/80 backdrop-blur-sm">
        <button
          onClick={goBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-semibold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Orqaga
        </button>

        <div className="h-5 w-px bg-white/20" />

        <div>
          <h1 className="text-sm font-bold text-white">
            {video?.videoName || 'Video'}
          </h1>
          <p className="text-xs text-white/40 font-medium">
            {video?.topic || ''} {video?.lessonDate ? `• ${video.lessonDate}` : ''}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Section */}
        <div className="flex-1 flex flex-col bg-black">
          {/* Video Player */}
          <div className="flex-1 flex items-center justify-center relative group bg-black min-h-[400px]">
            {video?.src ? (
              <video
                ref={videoRef}
                src={video.src}
                className="w-full h-full object-contain max-h-[calc(100vh-200px)]"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
            ) : (
              /* Placeholder when no video src */
              <div className="flex flex-col items-center gap-6 select-none">
                <div
                  onClick={togglePlay}
                  className="w-24 h-24 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                >
                  <svg className="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white/50 text-sm font-semibold">{video?.videoName || 'Video'}</p>
                  <p className="text-white/25 text-xs mt-1">Video fayli mavjud emas</p>
                </div>
              </div>
            )}

            {/* Play/Pause overlay */}
            {video?.src && (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={togglePlay}
              >
                <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                  {isPlaying ? (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-gray-900 px-6 py-4 space-y-3">
            {/* Progress Bar */}
            <div
              className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative group/bar"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-purple-500 rounded-full relative transition-all"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/bar:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {isPlaying ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
                    {isMuted || volume === 0 ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 accent-purple-500 cursor-pointer"
                  />
                </div>

                {/* Time */}
                <span className="text-white/50 text-xs font-mono">
                  {currentTime} / {duration}
                </span>
              </div>

              {/* Fullscreen */}
              <button
                onClick={handleFullscreen}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Video Info */}
        <div className="w-80 bg-gray-900 border-l border-white/10 flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-base font-bold text-white mb-1">{video?.videoName || 'Video ma\'lumotlari'}</h2>
            <p className="text-xs text-white/40">{video?.topic}</p>
          </div>

          <div className="p-6 space-y-4">
            {[
              { label: 'Dars mavzusi', value: video?.topic || '—', icon: '📚' },
              { label: 'Dars sanasi', value: video?.lessonDate || '—', icon: '📅' },
              { label: 'Hajmi', value: video?.size || '—', icon: '💾' },
              { label: "Qo'shilgan vaqt", value: video?.addedTime || '—', icon: '🕐' },
              { label: 'Status', value: video?.status || '—', icon: '✅' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="text-base">{item.icon}</span>
                <div>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm text-white/80 font-semibold mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Status Badge */}
          <div className="px-6 pb-6 mt-auto">
            <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-bold">{video?.status || 'Tayyor'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
