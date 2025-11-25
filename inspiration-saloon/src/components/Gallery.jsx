import { useEffect, useState } from 'react'

const fallbackImages = [
  'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519669011783-4eaa95fa73ab?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1593702235276-0ba4bd5a4001?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1600&auto=format&fit=crop',
]

export default function Gallery() {
  const [images, setImages] = useState(fallbackImages)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/gallery')
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && Array.isArray(data) && data.length) {
          setImages(data.filter(d=>d.active!==false).map(d=>d.url))
        }
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-display font-bold tracking-tight">Gallery</h2>
          <p className="mt-3 text-center text-gray-600">A glimpse of our craft, space, and happy clients.</p>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {images.map((src, idx) => (
            <figure
              key={idx}
              className={[
                'group relative overflow-hidden rounded-xl bg-white shadow-sm',
                idx % 7 === 0 ? 'lg:col-span-2 lg:row-span-2 aspect-square' : 'aspect-square',
              ].join(' ')}
            >
              <img
                src={src}
                alt="Salon work"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e)=>{ e.currentTarget.src='https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop' }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4 text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <span className="inline-block h-2 w-2 rounded-full bg-brand"></span>
                  Inspiration Saloon
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}


