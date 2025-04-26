import cn from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import VolumeButton from "./Buttons/Volume";
import ProgressBarHorizontal from "./ProgressBarHorizontal";
import ProgressBarVertical from "./ProgressBarVertical";
import SmartContainer from "./SmartContainer";

export enum Variant {
  Default = "default",
  Stories = "stories",
  Reels = "reels",
}

type Props = {
  video: HTMLVideoElement;
  variant?: Variant;
};

function Volume({ variant }: { variant?: Variant }) {
  const [volume, setVolume] = useLocalStorage(
    "better-instagram-videos-volume",
    0.5
  );
  const [muted, setMuted] = useLocalStorage(
    "better-instagram-videos-muted",
    false
  );
  const [volumeDragging, setVolumeDragging] = useState(false);
  const maxVolumeBalance = 400;

  const handleProgress = useCallback(
    (progress: number) => setVolume(progress / maxVolumeBalance),
    [maxVolumeBalance, setVolume]
  );

  const handleDragging = useCallback(
    (isDragging: boolean) => {
      setVolumeDragging(isDragging);
      if (!isDragging) setVolume(volume); // Stabilize volume
    },
    [volume, setVolume]
  );

  return (
    <SmartContainer dragging={volumeDragging} variant={variant}>
      <VolumeButton muted={muted} onChange={setMuted} />
      <ProgressBarVertical
        progress={volume * maxVolumeBalance}
        onProgress={handleProgress}
        onDragging={handleDragging}
      />
    </SmartContainer>
  );
}

export default function Controller({ video, variant }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dragging, setDragging] = useState(false);
  const [volume] = useLocalStorage("better-instagram-videos-volume", 0.5);
  const [muted, setMuted] = useLocalStorage(
    "better-instagram-videos-muted",
    false
  );

  // Update videoRef when prop changes
  useEffect(() => {
    videoRef.current = video;
  }, [video]);

  const updateAudio = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = Math.min(volume, 1);
    if (
      "userActivation" in navigator &&
      !navigator.userActivation.hasBeenActive
    ) {
      setMuted(true);
    }
    videoRef.current.muted = muted;
  }, [volume, muted, setMuted]);

  const timeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    setProgress(duration ? (currentTime / duration) * 100 : 0);
  }, []);

  const play = useCallback(() => {
    updateAudio();
    videoRef.current?.play().catch((err) => console.error("Play failed:", err));
  }, [updateAudio]);

  const ended = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const events = [
      ["timeupdate", timeUpdate],
      ["play", play],
      ["ended", ended],
      ["volumechange", updateAudio],
      ["seeked", updateAudio],
    ] as const;

    events.forEach(([event, handler]) =>
      video.addEventListener(event, handler)
    );
    updateAudio(); // Initial audio setup

    return () => {
      events.forEach(([event, handler]) =>
        video.removeEventListener(event, handler)
      );
    };
  }, [timeUpdate, play, ended, updateAudio]);

  const handleProgress = useCallback((progress: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = (progress / 100) * videoRef.current.duration;
  }, []);

  return (
    <>
      {variant !== Variant.Stories && <Volume variant={variant} />}
      <div className={cn("better-ig-controller", variant)}>
        <ProgressBarHorizontal
          variant={variant}
          progress={progress}
          videoDuration={videoRef.current?.duration ?? 0}
          onProgress={handleProgress}
          onDragging={setDragging}
        />
      </div>
    </>
  );
}
