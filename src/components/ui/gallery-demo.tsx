"use client"
import InteractiveBentoGallery from './gallery'

const mediaItems = [
  {
    id: 1,
    type: "image",
    title: "Beautiful Landscape",
    desc: "Stunning natural scenery",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-3",
  },
  {
    id: 2,
    type: "video",
    title: "Ocean Waves",
    desc: "Peaceful ocean view",
    url: "https://cdn.pixabay.com/video/2024/07/24/222837_large.mp4",
    span: "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2",
  },
  {
    id: 3,
    type: "image",
    title: "Mountain View",
    desc: "Majestic mountain range",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    span: "md:col-span-1 md:row-span-3 sm:col-span-2 sm:row-span-3",
  },
  {
    id: 4,
    type: "image",
    title: "City Skyline",
    desc: "Urban landscape at night",
    url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
    span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2",
  },
  {
    id: 5,
    type: "image",
    title: "Left Square",
    desc: "Additional left content",
    url: "/images/main.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-3",
  },
  {
    id: 6,
    type: "image",
    title: "Right Square",
    desc: "Additional right content",
    url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-3",
  },
  {
    id: 7,
    type: "video",
    title: "Wide Bottom",
    desc: "Additional main content",
    url: "/videos/demo.mp4",
    span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-3",
  },
]

export default function GalleryDemo() {
  return (
    <div className="min-h-screen overflow-y-auto">
      <InteractiveBentoGallery
        mediaItems={mediaItems}
        title="Our Gallery"
        description="Explore our collection of images and videos"
      />
    </div>
  )
}