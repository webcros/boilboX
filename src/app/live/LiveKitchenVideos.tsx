'use client';

import { useState, useRef } from 'react';
import type { LiveKitchenVideo } from '@/lib/types';

interface Props {
  videos: LiveKitchenVideo[];
}

export default function LiveKitchenVideos({ videos }: Props) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (videos.length === 0) return null;

  const featured = videos.find((v) => v.featured) || videos[0];
  const rest = videos.filter((v) => v.id !== featured.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-primary">videocam</span>
        <h2 className="text-2xl font-black">Kitchen Videos</h2>
      </div>

      {/* Featured / main video */}
      <FeaturedVideoCard video={featured} activeVideo={activeVideo} setActiveVideo={setActiveVideo} />

      {/* Grid of remaining videos */}
      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {rest.map((video) => (
            <VideoCard key={video.id} video={video} activeVideo={activeVideo} setActiveVideo={setActiveVideo} />
          ))}
        </div>
      )}
    </div>
  );
}

function FeaturedVideoCard({
  video,
  activeVideo,
  setActiveVideo,
}: {
  video: LiveKitchenVideo;
  activeVideo: string | null;
  setActiveVideo: (id: string | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPlaying = activeVideo === video.id;

  const handlePlay = () => {
    setActiveVideo(video.id);
    setTimeout(() => videoRef.current?.play(), 0);
  };

  return (
    <div className="relative aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl group border-2 border-gray-100 dark:border-white/10">
      {isPlaying ? (
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl || undefined}
          controls
          autoPlay
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.thumbnailAlt || video.title}
              className="w-full h-full object-cover opacity-70"
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-600 !text-6xl">movie</span>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={handlePlay}
              className="w-24 h-24 rounded-full bg-primary hover:bg-primary-hover text-bg-dark flex items-center justify-center scale-100 hover:scale-110 transition-transform shadow-2xl"
            >
              <span className="material-symbols-outlined !text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
            </button>
          </div>
        </>
      )}

      {video.label && (
        <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/60 backdrop-blur px-4 py-2 rounded-xl text-white pointer-events-none">
          <span className="material-symbols-outlined text-red-500 text-lg animate-pulse">videocam</span>
          <span className="text-xs font-black tracking-widest uppercase">{video.label}</span>
        </div>
      )}

      {video.description && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-5 pt-10 pointer-events-none">
          <p className="text-white text-sm">{video.description}</p>
        </div>
      )}
    </div>
  );
}

function VideoCard({
  video,
  activeVideo,
  setActiveVideo,
}: {
  video: LiveKitchenVideo;
  activeVideo: string | null;
  setActiveVideo: (id: string | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPlaying = activeVideo === video.id;

  const handlePlay = () => {
    setActiveVideo(video.id);
    setTimeout(() => videoRef.current?.play(), 0);
  };

  return (
    <div className="bg-gray-100 dark:bg-surface-dark aspect-video rounded-3xl overflow-hidden relative cursor-pointer group">
      {isPlaying ? (
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl || undefined}
          controls
          autoPlay
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.thumbnailAlt || video.title}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-600 !text-4xl">movie</span>
            </div>
          )}
          <button
            type="button"
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined text-4xl">play_circle</span>
          </button>
        </>
      )}

      {video.label && (
        <div className="absolute bottom-4 left-4 bg-black/40 px-2 py-1 rounded text-[10px] text-white uppercase font-bold pointer-events-none">
          {video.label}
        </div>
      )}
    </div>
  );
}
