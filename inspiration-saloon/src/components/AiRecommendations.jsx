import { useEffect, useState } from 'react'

const fallback = [
  {
    name: 'Radiant Glow',
    desc: 'Soft curls + dewy makeup for evening events.',
    image: 'https://tse2.mm.bing.net/th/id/OIP.iby3c3Mz4s96xsQubdNVxAHaEK?pid=Api&P=0&h=220',
  },
  {
    name: 'Classic Chic',
    desc: 'Sleek bob + neutral palette for corporate looks.',
    image: 'https://tse4.mm.bing.net/th/id/OIP.F5dl4-XVQdgYIa__DNDoWgHaEK?pid=Api&P=0&h=220',
  },
  {
    name: 'Festive Glam',
    desc: 'Bold eyes + embellished hair for celebrations.',
    image: 'https://tse1.mm.bing.net/th/id/OIP.WxPQ-_XbuoljF9QV6NLI4wHaEJ?pid=Api&P=0&h=220',
  },
  {
    name: 'Groomed & Sharp',
    desc: 'Fade haircut + contoured beard for men.',
    image: 'https://tse3.mm.bing.net/th/id/OIP.WhhfCjkZ4J29NyS9asLs-QHaE8?pid=Api&P=0&h=220',
  },
  {
    name: 'Natural Everyday',
    desc: 'Light makeup + effortless waves for daily wear.',
    image: 'https://tse2.mm.bing.net/th/id/OIP.DqN1r2i8URB8_sRagxtMPwHaEK?pid=Api&P=0&h=220',
  },
  {
    name: 'Monochrome Muse',
    desc: 'Single-tone makeup with sleek updo for a modern finish.',
    image: 'https://tse4.mm.bing.net/th/id/OIP.EnGmXinZCgKBQGxehfg4-wHaHa?pid=Api&P=0&h=220',
  },
]

function merge(base, incoming) {
  const map = new Map()
  base.forEach(x => map.set(x.name.toLowerCase(), x))
  incoming.forEach(x => {
    if (x.name) {
      map.set(x.name.toLowerCase(), {
        name: x.name,
        desc: x.description || '',
        image: x.image || '',
      })
    }
  })
  return Array.from(map.values())
}

export default function AiRecommendations() {
  const [suggestions, setSuggestions] = useState(fallback)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/makeovers')
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && Array.isArray(data)) {
          setSuggestions(
            merge(
              fallback,
              data.filter(d => d.active !== false),
            ),
          )
        }
      } catch {}
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="py-34 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="ai-recommendations">
      <div className="max-w-8xl mx-auto px-6 lg:px-8">
       
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-b89563/10 to-rose-500/10 border border-b89563/20 mb-6">
            <div className="w-2 h-2 bg-b89563 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-b89563 tracking-wider uppercase">AI-Powered</span>
          </div>
          <h2
            id="ai-recommendations"
            className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight mb-4"
          >
            AI Makeover Recommendations
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover personalized styling suggestions crafted by advanced AI, tailored precisely to your unique
            features, occasion, and preferences.
          </p>
        </div>

        
        <div className="wrapper grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 justify-items-center">
          {suggestions.map((s, index) => (
            <article
              key={s.name}
              className="group card relative w-[380px] h-[410px] rounded-2xl p-6 bg-white shadow-[0_7px_10px_rgba(0,0,0,0.5)]
                         flex items-end overflow-hidden transition-transform duration-300 ease-out"
            >
              
              <img
                src={s.image}
                alt={s.name}
                className="absolute inset-0 h-full w-full object-cover rounded-2xl transition-transform duration-500 ease-out group-hover:scale-110"
              />

            
              <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

             
              <div className="relative z-10 text-white opacity-0 translate-y-8 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                <h3 className="text-2xl font-serif font-semibold mb-1 flex items-center gap-2">
                  
                  {s.name}
                </h3>
                <p className="text-sm leading-relaxed mb-4">
                  {s.desc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.querySelector('#booking')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-4 py-2 rounded-md bg-white text-gray-900 text-xs font-semibold tracking-wide
                             transition-colors duration-300 hover:bg-b89563 hover:text-white"
                >
                  Book This Look
                </button>
              </div>
            </article>
          ))}
        </div>

       
        <div className="text-center pt-16 pb-8 border-t border-gray-200 mt-16">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our recommendations analyze thousands of professional looks to deliver salon‑quality styling perfect for you.
          </p>
        </div>
      </div>
    </section>
  )
}
