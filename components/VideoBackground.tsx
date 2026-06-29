"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const streamUrl =
      "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false, // Ensures stability in sandboxed environments as requested
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari which has native HLS support
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-20 bg-[#070b0a] overflow-hidden pointer-events-none">
      {/* Video layer */}
      <video
        ref={videoRef}
        muted
        autoPlay
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070b0a] via-[#070b0a]/80 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070b0a] via-transparent to-transparent z-0" />

      {/* Grid Lines (Desktop Only) */}
      <div className="hidden md:flex absolute inset-0 z-0 pointer-events-none w-full justify-evenly">
        {/* We use 3 lines to divide the screen into 4 columns, roughly at 25%, 50%, 75% */}
        <div className="w-[1px] h-full bg-white/10" />
        <div className="w-[1px] h-full bg-white/10" />
        <div className="w-[1px] h-full bg-white/10" />
      </div>
    </div>
  );
}
