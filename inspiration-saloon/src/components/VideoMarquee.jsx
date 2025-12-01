import { useEffect, useRef, useState } from 'react'

const localCandidates = [
  '/videos/clip1.mp4',
  '/videos/clip2.mp4',
  '/videos/clip3.mp4'
]

const fallback =
  'https://cdn.coverr.co/videos/coverr-hairstyle-and-makeup-2232/1080p.mp4'

export default function VideoMarquee() {
  const videoRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [showControls, setShowControls] = useState(false)

  // Handle autoplay
  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const tryPlay = async () => {
      try {
        await v.play()
      } catch {
        setShowControls(true)
      }
    }

    v.addEventListener('loadedmetadata', tryPlay, { once: true })
    tryPlay()
  }, [index])

  // When video ends → go to next
  const handleEnded = () => {
    setIndex((prev) => (prev + 1) % localCandidates.length)
  }

  return (
    <section className="py-14" aria-labelledby="live-clips">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4">
          <h2 id="live-clips" className="text-2xl font-display font-bold tracking-tight ">
            Live Studio Clip
          </h2>
          {/* <a href="#gallery" className="text-sm hover:text-brand">
            See gallery →
          </a> */}
        </div>
      </div>

      <div className="mt-6">
        <video
          key={index} // forces reload on index change
          ref={videoRef}
          className="w-[90%] h-[320px] sm:h-[420px] mx-auto md:h-[520px] rounded-2xl object-cover shadow"
          autoPlay
          muted
          loop={false}
          playsInline
          preload="auto"
          onEnded={handleEnded}
          controls={showControls}
          poster="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop"
          onError={(e) => {
            e.currentTarget.src = fallback
            setShowControls(true)
          }}
        >
          <source src={localCandidates[index]} type="video/mp4" />
        </video>
      </div>
    </section>
  )
}
