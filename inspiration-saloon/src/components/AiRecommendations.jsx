import { useEffect, useState } from 'react'

const fallback = [
  { name: 'Radiant Glow', desc: 'Soft curls + dewy makeup for evening events.' },
  { name: 'Classic Chic', desc: 'Sleek bob + neutral palette for corporate looks.' },
  { name: 'Festive Glam', desc: 'Bold eyes + embellished hair for celebrations.' },
  { name: 'Groomed & Sharp', desc: 'Fade haircut + contoured beard for men.' },
  { name: 'Natural Everyday', desc: 'Light makeup + effortless waves for daily wear.' },
  { name: 'Monochrome Muse', desc: 'Single-tone makeup with sleek updo for a modern finish.' },
]

function merge(base, incoming) {
  const map = new Map()
  base.forEach(x => map.set(x.name.toLowerCase(), x))
  incoming.forEach(x => { if (x.name) map.set(x.name.toLowerCase(), { name: x.name, desc: x.description || '' }) })
  return Array.from(map.values())
}

export default function AiRecommendations() {
  const [suggestions, setSuggestions] = useState(fallback)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/makeovers')
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && Array.isArray(data)) {
          setSuggestions(merge(fallback, data.filter(d=>d.active!==false)))
        }
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <section className="py-20" aria-labelledby="ai-recommendations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 id="ai-recommendations" className="text-3xl font-display font-bold tracking-tight">AI Makeover Suggestions</h2>
          <p className="mt-3 text-gray-600">Auto-suggested looks tailored to your occasion and style.</p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((s)=> (
            <div key={s.name} className="rounded-xl border border-gray-200 p-6 bg-white">
              <h3 className="text-lg font-semibold">{s.name}</h3>
              <p className="mt-2 text-gray-600">{s.desc}</p>
              <a href="#booking" className="mt-4 inline-flex rounded-md border border-brand/30 px-3 py-2 text-sm hover:bg-brand/10">Try this look</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


