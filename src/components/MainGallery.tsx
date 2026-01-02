"use client"
import InteractiveBentoGallery from '@/components/ui/gallery'

// Updated mediaItems with new span values for a 3-column layout on md screens
const mediaItems = [
  { // 1. Govardhan (Left, tall)
    id: 1,
    type: "image",
    title: "Govardhan",
    desc: "Parikrama path around the holy hill",
    url: "https://mcgjdjifyfojfjnkttkn.supabase.co/storage/v1/object/public/website//govard.jpg",
    // md: 1 column, 2 rows. sm: 1 column, 2 rows
    span: "md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2", 
  },
  { // 2. Video (Center, wide)
    id: 2,
    type: "video",
    title: "Welcome to Vedaverse",
    desc: "Discover the digital world of Vedic knowledge",
    url: "https://mcgjdjifyfojfjnkttkn.supabase.co/storage/v1/object/public/website//welcome.mp4",
    // md: 2 columns, 2 rows. sm: All 3 columns, 2 rows
    span: "md:col-span-2 md:row-span-2 sm:col-span-3 sm:row-span-2", 
  },
  { // 3. Vrindavan (Right, tall) - Reduced row span
    id: 3,
    type: "image",
    title: "Vrindavan Temples",
    desc: "Sacred temples in the land of Krishna",
    url: "https://mcgjdjifyfojfjnkttkn.supabase.co/storage/v1/object/public/website//Vrindavan.jpg",
    // md: 1 column, 2 rows. sm: 1 column, 2 rows
    span: "md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2", 
  },
  { // 4. 64 Samadhis (Bottom Left)
    id: 4,
    type: "image",
    title: "64 Samadhis",
    desc: "Sacred tombs of Vaishnava saints",
    url: "https://mcgjdjifyfojfjnkttkn.supabase.co/storage/v1/object/public/website//64.jpg",
    // md: 1 column, 1 row. sm: 1 column, 1 row
    span: "md:col-span-1 md:row-span-1 sm:col-span-1 sm:row-span-1", 
  },
  { // 5. Main (Bottom Center)
    id: 5,
    type: "image",
    title: "Spiritual Practice",
    desc: "Engaging in devotional activities",
    url: "/images/main.jpg", // Using local image
    // md: 1 column, 1 row. sm: 1 column, 1 row
    span: "md:col-span-1 md:row-span-1 sm:col-span-1 sm:row-span-1", 
  },
  { // 6. 49 Kunj (Bottom Right)
    id: 6,
    type: "image",
    title: "Sacred Groves",
    desc: "Places of Krishna's pastimes",
    url: "https://mcgjdjifyfojfjnkttkn.supabase.co/storage/v1/object/public/website//49.jpg",
    // md: 1 column, 1 row. sm: 1 column, 1 row
    span: "md:col-span-1 md:row-span-1 sm:col-span-1 sm:row-span-1", 
  },
  // Removed item 7 as we have 6 items fitting a 3x2 grid on md
];

const MainGallery = () => {
  // TODO: Add translation for title and description
  if (!mediaItems || mediaItems.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p>Gallery is currently unavailable</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <InteractiveBentoGallery
          mediaItems={mediaItems.filter(item => item?.url)}
          title="Gallery of Inspiration" 
          description="Visual glimpses into the Vedic world and spiritual life"
        />
      </div>
    </section>
  )
}

export default MainGallery
