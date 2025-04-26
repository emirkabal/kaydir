import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules"; // Import Swiper pagination module
import "swiper/css";
import SwiperType from "swiper";
import Controller, { Variant } from "./Controller";

interface Post {
  id: string;
  video_url: string;
  author: {
    name: string;
  };
  likes?: number; // Added for like count
  comments?: number; // Added for comment count
}

function Post({
  data,
  isActive,
  onEnded,
}: {
  data: Post;
  isActive: boolean;
  onEnded: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  // Handle video play/pause based on active state
  useEffect(() => {
    if (videoRef.current) {
      setIsVideoLoaded(true);
      if (isActive) {
        // videoRef.current.volume = 0.5;
        videoRef.current.play().catch((err) => console.log("Play error:", err));
        videoRef.current.addEventListener("ended", () => {
          videoRef.current?.pause();
          onEnded();
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, setIsVideoLoaded]);

  const handleVideoTap = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch((err) => console.log("Play error:", err));
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div className="relative max-w-lg mx-auto h-full flex items-center justify-center bg-black">
      <div className="w-max h-1/2 relative">
        <video
          ref={videoRef}
          src={data.video_url}
          className="w-max h-full object-contain"
          onClick={handleVideoTap}
        />

        {videoRef.current && isVideoLoaded && (
          <Controller video={videoRef.current!} variant={Variant.Reels} />
        )}
      </div>

      {/* User info overlay */}
      <div className="absolute bottom-4 left-4 text-white">
        <p className="font-bold">{data.author.name || "Unknown User"}</p>
        <p className="text-sm opacity-75">Original Audio</p>
      </div>
      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-600">
        <div
          className="h-full bg-white transition-all"
          style={{
            width: videoRef.current
              ? `${
                  (videoRef.current.currentTime / videoRef.current.duration) *
                  100
                }%`
              : "0%",
          }}
        />
      </div>
    </div>
  );
}

export default function PostSwiper() {
  const swiperRef = useRef<SwiperType>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [useAlgorithm, setUseAlgorithm] = useState(true);

  const hasFetchedInitially = useRef(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleFetchPosts = async () => {
    if (isLoading || isEnd) return;

    console.log("Initiating fetch with skip:", currentIndex);
    setIsLoading(true);
    setIsError(false);

    try {
      const index = useAlgorithm
        ? Math.floor(Math.random() * 800)
        : currentIndex;
      const response = await fetch(`/api/posts?take=4&skip=${index}`);
      const data: Post[] = await response.json();
      setPosts((prev) => [...prev, ...data]);
      if (!useAlgorithm) {
        setCurrentIndex((prev) => prev + 4);
      }
      setIsEnd(data.length < 4);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchPosts = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      handleFetchPosts();
    }, 300);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSlideChange = (swiper: any) => {
    setActiveSlide(swiper.activeIndex);
    if (
      swiper.activeIndex >= posts.length - 3 &&
      !isEnd &&
      !isLoading &&
      posts.length > 0
    ) {
      console.log("Triggering fetch from slide change:", swiper.activeIndex);
      debouncedFetchPosts();
    }
  };

  useEffect(() => {
    if (!hasFetchedInitially.current) {
      console.log("Initial fetch triggered");
      hasFetchedInitially.current = true;
      handleFetchPosts();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <div>
      <div>
        <button
          className="absolute z-10 cursor-pointer top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setUseAlgorithm((prev) => !prev)}
        >
          {useAlgorithm ? "Disable Algorithm" : "Enable Algorithm"}
        </button>
      </div>
      <div className="h-screen w-screen bg-black overflow-hidden">
        {isError && (
          <p className="text-red-500 text-center">Error fetching posts</p>
        )}
        {isLoading && posts.length === 0 && (
          <p className="text-white text-center">Loading...</p>
        )}
        <Swiper
          direction="vertical"
          spaceBetween={0}
          slidesPerView={1}
          modules={[Mousewheel]} // Added Mousewheel module
          allowTouchMove={false} // Disable touch and mouse drag
          mousewheel={{
            enabled: true,
            sensitivity: 1,
            releaseOnEdges: true,
            forceToAxis: true,
          }}
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="h-full w-full"
        >
          {posts.map((post, index) => {
            return (
              <SwiperSlide key={`${post.id}-${index}`}>
                <Post
                  data={post}
                  isActive={index === activeSlide}
                  onEnded={() => {
                    swiperRef.current?.slideNext(); // Automatically slide to the next post when the video ends
                  }}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
        {isEnd && posts.length > 0 && (
          <p className="text-white text-center py-4">No more posts to load</p>
        )}
      </div>
    </div>
  );
}
