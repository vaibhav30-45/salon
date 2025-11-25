const localCandidates = ['/videos/clip1.mp4', '/videos/clip2.mp4', '/videos/clip3.mp4']
const fallback = 'https://cdn.coverr.co/videos/coverr-hairstyle-and-makeup-2232/1080p.mp4'

import { useEffect, useRef, useState } from 'react'

export default function VideoMarquee() {
  // Prefer the first local clip; fall back to hosted if it errors
  const src = localCandidates[0]
  const videoRef = useRef(null)
  const [showControls, setShowControls] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const tryPlay = async () => {
      try {
        await v.play()
      } catch {
        // Autoplay might be blocked; show controls to let user start playback
        setShowControls(true)
      }
    }
    // attempt play when metadata is loaded and also immediately
    v.addEventListener('loadedmetadata', tryPlay, { once: true })
    tryPlay()
    return () => {
      v.removeEventListener('loadedmetadata', tryPlay)
    }
  }, [])

  return (
    <section className="py-14" aria-labelledby="live-clips">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 id="live-clips" className="text-2xl font-display font-bold tracking-tight">Live Studio Clip</h2>
          <a href="#gallery" className="text-sm hover:text-brand">See gallery →</a>
        </div>
      </div>
      <div className="mt-6">
        <video
          ref={videoRef}
          className="w-full h-[320px] sm:h-[420px] md:h-[520px] rounded-2xl object-cover shadow"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={showControls}
          poster="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop"
          onError={(e)=>{ e.currentTarget.src = fallback; setShowControls(true) }}
        >
          <source src={src} type="video/mp4" />
          <source src={fallback} type="video/mp4" />
        </video>
      </div>
    </section>
  )
}


