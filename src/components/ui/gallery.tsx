"use client"
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react';

// --- Interfaces --- 
interface MediaItemType {
  id: number;
  type: string;
  title: string;
  desc: string;
  url: string;
  span: string;
}

interface GalleryModalProps {
  selectedItem: MediaItemType;
  isOpen: boolean;
  onClose: () => void;
  setSelectedItem: (item: MediaItemType | null) => void;
  mediaItems: MediaItemType[];
}

interface InteractiveBentoGalleryProps {
  mediaItems: MediaItemType[]
  title: string
  description: string
}

// --- MediaItem Component (with video optimizations) --- 
const MediaItem = ({ item, className, onClick }: { item: MediaItemType, className?: string, onClick?: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isBuffering, setIsBuffering] = useState(item.type === 'video'); // Start buffering state if video

  // Intersection Observer for viewport visibility
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px', // Load slightly before entering viewport
      threshold: 0.01 // Trigger even if 1% visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsInView(entry.isIntersecting);
      });
    }, options);

    const currentRef = videoRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Handle video play/pause based on visibility
  useEffect(() => {
    let mounted = true;
    if (item.type !== 'video' || !videoRef.current) return; 

    const videoElement = videoRef.current;

    const handleCanPlay = () => {
        if (mounted) setIsBuffering(false);
    };

    const handleWaiting = () => {
        if (mounted) setIsBuffering(true);
    };

    const playVideo = async () => {
        if (!mounted || !videoElement) return;
        try {
            await videoElement.play();
        } catch (error) {
            console.warn("Video auto-play failed:", error);
             if (mounted) setIsBuffering(false); // Stop showing buffer if play fails
        }
    };

    if (isInView) {
        videoElement.addEventListener('canplay', handleCanPlay);
        videoElement.addEventListener('waiting', handleWaiting);
        // Check if ready to play, otherwise wait for canplay
        if (videoElement.readyState >= 3) {
            setIsBuffering(false);
            playVideo();
        } else {
            setIsBuffering(true);
        }
    } else {
        videoElement.pause();
        setIsBuffering(true); // Assume buffering when not in view
    }

    return () => {
        mounted = false;
        if (videoElement) {
            videoElement.removeEventListener('canplay', handleCanPlay);
            videoElement.removeEventListener('waiting', handleWaiting);
            if (!videoElement.paused) {
                videoElement.pause();
            }
             // Optional: unload video source to save memory?
            // videoElement.removeAttribute('src'); 
            // videoElement.load();
        }
    };
}, [isInView, item.type]);


  if (item.type === 'video') {
    return (
      <div className={`${className} relative overflow-hidden group bg-black`}> {/* Added group and bg-black */} 
        <video
          ref={videoRef}
          className="w-full h-full object-cover transition-opacity duration-300"
          onClick={onClick}
          playsInline
          muted
          loop
          preload="metadata" // Changed preload to metadata initially
          style={{ opacity: isBuffering ? 0.5 : 1 }} // Dim if buffering
        >
          <source src={item.url} type="video/mp4" />
        </video>
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}
        {/* Play icon overlay (optional) */}
        {/* <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
        </div> */} 
      </div>
    );
  }

  // Image Item
  return (
    <div className={`${className} overflow-hidden group`}> {/* Added group */} 
      <img
        src={item.url}
        alt={item.title}
        className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105" // Added hover effect
        onClick={onClick}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

// --- GalleryModal Component (Simplified for brevity, assuming no major changes needed here) --- 
const GalleryModal = ({ selectedItem, isOpen, onClose, setSelectedItem, mediaItems }: GalleryModalProps) => {
   if (!isOpen) return null;
   // ... (Keep existing modal implementation or simplify if needed)
    // Using a placeholder structure for now
   return (
     <motion.div 
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // Close on background click
     >
        <motion.div 
            className="relative bg-card rounded-lg overflow-hidden shadow-xl max-w-4xl w-full aspect-video"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
            <MediaItem item={selectedItem} className="w-full h-full" />
            <button
                className="absolute top-2 right-2 p-2 rounded-full bg-background/70 text-foreground hover:bg-background/90 transition-colors"
                onClick={onClose}
            >
                <X className='w-5 h-5' />
            </button>
             <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-white text-xl font-semibold">
                    {selectedItem.title}
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    {selectedItem.desc}
                  </p>
             </div>
        </motion.div>
        {/* Basic Navigation (Example) */}
        {/* Add Previous/Next buttons here if needed, interacting with setSelectedItem */} 
     </motion.div>
   );
 };


// --- InteractiveBentoGallery Component (Main logic with updated grid) --- 
const InteractiveBentoGallery: React.FC<InteractiveBentoGalleryProps> = ({ mediaItems, title, description }) => {
  const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);
  const [items, setItems] = useState(mediaItems);
  const [isDragging, setIsDragging] = useState(false);

  // Handle potential drag-and-drop reordering (simplified)
  const handleDragEnd = (index: number, info: any) => {
      setIsDragging(false);
      // Basic reordering logic - could be improved
      // const moveDistance = info.offset.x + info.offset.y;
      // if (Math.abs(moveDistance) > 50) { 
      //   // ... (Reordering logic - kept commented for simplicity now)
      // }
  };

  return (
    <div className="mx-auto px-4 py-8 max-w-7xl"> {/* Increased max-width */} 
      <div className="mb-12 text-center"> {/* Increased margin */} 
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent 
                   bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
                   dark:from-white dark:via-gray-200 dark:to-white mb-2" // Added margin-bottom
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" // Centered and max-width
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {description}
        </motion.p>
      </div>
      
      <AnimatePresence>
        {selectedItem && (
          <GalleryModal
            selectedItem={selectedItem}
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            setSelectedItem={setSelectedItem} // Pass down setter if modal needs navigation
            mediaItems={items} // Pass items for potential navigation
          />
        )}
      </AnimatePresence>

      {/* Updated Grid Layout */} 
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[150px] sm:auto-rows-[200px] md:auto-rows-[250px]" // Changed to 3 cols on md, adjusted row height
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 } // Slightly faster stagger
          }
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layoutId={`media-${item.id}`}
            // Use span provided by mediaItems from MainGallery.tsx
            className={`relative overflow-hidden rounded-xl shadow-md ${item.span} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} 
            onClick={() => !isDragging && setSelectedItem(item)}
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.03 // Faster delay
                }
              }
            }}
            whileHover={{ scale: 1.03, zIndex: 10 }} // Bring item forward on hover
            drag={false} // Disable drag for now to simplify
            // dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            // dragElastic={0.2}
            // onDragStart={() => setIsDragging(true)}
            // onDragEnd={(e, info) => handleDragEnd(index, info)}
          >
            <MediaItem
              item={item}
              className="absolute inset-0 w-full h-full"
              onClick={() => !isDragging && setSelectedItem(item)}
            />
            {/* Overlay Text (Optional - can be removed if not needed) */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }} // Show text on hover
              transition={{ duration: 0.2 }}
            >
                <h3 className="text-white text-sm font-medium line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-white/80 text-xs mt-0.5 line-clamp-2">
                  {item.desc}
                </p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
       
    </div>
  );
};

export default InteractiveBentoGallery;
