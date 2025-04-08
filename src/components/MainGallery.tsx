"use client"
import InteractiveBentoGallery from '@/components/ui/gallery'

const mediaItems = [
  {
    id: 1,
    type: "image",
    title: "Beautiful Landscape",
    desc: "Stunning natural scenery",
    url: "https://mcgjdjifyfojfjnkttkn.supabase.co/storage/v1/object/public/website//govard.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-3",
  },
  {
    id: 2,
    type: "video",
    title: "Ocean Waves",
    desc: "Peaceful ocean view",
    url: "https://mcgjdjifyfojfjnkttkn.supabase.co/storage/v1/object/public/website//welcome.mp4",
    span: "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2",
  },
  {
    id: 3,
    type: "image",
    title: "Mountain View",
    desc: "Majestic mountain range",
    url: "https://mcgjdjifyfojfjnkttkn.supabase.co/storage/v1/object/public/website//64.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-2 sm:row-span-3",
  },
  {
    id: 4,
    type: "image",
    title: "City Skyline",
    desc: "Urban landscape at night",
    url: "https://mcgjdjifyfojfjnkttkn.supabase.co/storage/v1/object/public/website//Vrindavan.jpg",
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
    url: "https://mcgjdjifyfojfjnkttkn.supabase.co/storage/v1/object/public/website//49.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-3",
  },
  {
    id: 7,
    type: "image",
    title: "Wide Bottom",
    desc: "Additional main content",
    url: "https://mcgjdjifyfojfjnkttkn.supabase.co/storage/v1/object/public/website//4903.jpg",
    span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-3",
  },
]

const MainGallery = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="min-h-screen overflow-y-auto">
          <InteractiveBentoGallery
            mediaItems={mediaItems}
            title="Our Gallery"
            description="Explore our collection of images and videos"
          />
        </div>
      </div>
    </section>
  )
}

export default MainGallery