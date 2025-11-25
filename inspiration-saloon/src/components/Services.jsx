import { useEffect, useState } from 'react'

const fallbackServices = [
  { title: 'Hair Styling', desc: 'Cuts, coloring, and treatments tailored to your look.', price: '₹499+', duration: '45-60 min' },
  { title: 'Beard Grooming', desc: 'Precision trims and shaping for a sharp finish.', price: '₹299+', duration: '20-30 min' },
  { title: 'Facials', desc: 'Relaxing treatments to cleanse and rejuvenate your skin.', price: '₹799+', duration: '45-60 min' },
  { title: 'Manicure & Pedicure', desc: 'Clean, polished, and perfectly groomed hands and feet.', price: '₹699+', duration: '45-60 min' },
  { title: 'Party Makeup (AI-Enhanced)', desc: 'Look party-ready with AI-tailored shades and finishes.', price: '₹1999+', duration: '60-90 min' },
  { title: 'Bridal Makeup (AI Preview)', desc: 'Preview your bridal look with AI suggestions before the session.', price: '₹5999+', duration: '120-180 min' },
]

function mergeAndDedupe(base, incoming) {
  const map = new Map()
  for (const s of base) {
    map.set(s.title.toLowerCase(), s)
  }
  for (const s of incoming) {
    const key = (s.title || s.name || '').toLowerCase()
    if (!key) continue
    map.set(key, s)
  }
  return Array.from(map.values())
}

export default function Services() {
  const [services, setServices] = useState(fallbackServices)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/services')
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && Array.isArray(data) && data.length) {
          const mapped = data.map(s => ({
            title: s.name,
            desc: s.description,
            price: s.price ? `₹${s.price}+` : '',
            duration: s.duration || '',
            image: s.image,
          }))
          const merged = mergeAndDedupe(fallbackServices, mapped)
          setServices(merged)
        }
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <section id="services" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-display font-bold tracking-tight text-center">Our Services</h2>
        <p className="mt-3 text-center text-gray-600">Quality treatments by experienced professionals.</p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div key={s.title} className="rounded-xl border border-gray-200 p-6 hover:shadow-md transition bg-white">
              {s.image && <img src={s.image} alt="" className="h-28 w-full object-cover rounded mb-3" loading="lazy" onError={(e)=>{e.currentTarget.style.display='none'}} />}
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-gray-600">{s.desc}</p>
              {(s.price || s.duration) && (
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-medium text-brand">{s.price}</span>
                  <span className="text-gray-500">{s.duration}</span>
                </div>
              )}
              <a href="#booking" className="mt-4 inline-flex rounded-md border border-brand/30 px-3 py-2 text-sm hover:bg-brand/10">Book</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


