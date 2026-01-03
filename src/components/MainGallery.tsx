"use client"
import InteractiveBentoGallery from '@/components/ui/gallery'

// Updated mediaItems with new span values for a 3-column layout on md screens
const mediaItems = [
  { // 1. Left, tall
    id: 1,
    type: "image",
    title: "Sacred Journey",
    desc: "Exploring the path of devotion",
    url: "/1.jpg",
    // md: 1 column, 2 rows. sm: 1 column, 2 rows
    span: "md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2",
  },
  { // 2. Center, wide - фото 3 вместо видео
    id: 2,
    type: "image",
    title: "Temple Vibes",
    desc: "Sacred spaces of transcendence",
    url: "/3.jpg",
    // md: 2 columns, 2 rows. sm: All 3 columns, 2 rows
    span: "md:col-span-2 md:row-span-2 sm:col-span-3 sm:row-span-2",
  },
  { // 3. Right, tall - фото 8
    id: 3,
    type: "image",
    title: "Divine Atmosphere",
    desc: "Spiritual ambiance",
    url: "/8.jpg",
    // md: 1 column, 2 rows. sm: 1 column, 2 rows
    span: "md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2",
  },
  { // 4. Bottom Left
    id: 4,
    type: "image",
    title: "Holy Places",
    desc: "Sacred destinations",
    url: "/4.jpg",
    // md: 1 column, 1 row. sm: 1 column, 1 row
    span: "md:col-span-1 md:row-span-1 sm:col-span-1 sm:row-span-1",
  },
  { // 5. Bottom Center
    id: 5,
    type: "video",
    title: "Welcome to Vedaverse",
    desc: "Discover the digital world of Vedic knowledge",
    url: "/7.mp4",
    // md: 1 column, 1 row. sm: 1 column, 1 row
    span: "md:col-span-1 md:row-span-1 sm:col-span-1 sm:row-span-1",
  },
  { // 6. Bottom Right
    id: 6,
    type: "image",
    title: "Natural Beauty",
    desc: "Scenery of the holy land",
    url: "/6.jpg",
    // md: 1 column, 1 row. sm: 1 column, 1 row
    span: "md:col-span-1 md:row-span-1 sm:col-span-1 sm:row-span-1",
  },
  { // 7. Third row, left - фото 5
    id: 7,
    type: "image",
    title: "Sacred Places",
    desc: "Holy destinations",
    url: "/5.jpg",
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
