import { useEffect, useMemo, useState } from 'react'

const fallbackServices = [
  { title: 'Hair Styling', desc: 'Cuts, coloring, and treatments tailored to your look.', price: '₹499+', duration: '45-60 min', gender: 'all',image:'https://tse1.mm.bing.net/th/id/OIP.FvjlU_0hfcoTAONfzKdjUgHaEK?pid=Api&P=0&h=220' },
  { title: 'Beard Grooming', desc: 'Precision trims and shaping for a sharp finish.', price: '₹299+', duration: '20-30 min', gender: 'male',image:'https://tse2.mm.bing.net/th/id/OIP.Cev_mKYCKlgrvUZghPWCSgHaD3?pid=Api&P=0&h=220' },
  { title: 'Facials', desc: 'Relaxing treatments to cleanse and rejuvenate your skin.', price: '₹799+', duration: '45-60 min', gender: 'all',image:'https://tse4.mm.bing.net/th/id/OIP.3RxLPo7kY8fQYM7NzJZCOwHaEK?pid=Api&P=0&h=220' },
  { title: 'Manicure & Pedicure', desc: 'Clean, polished, and perfectly groomed hands and feet.', price: '₹699+', duration: '45-60 min', gender: 'female',image:'https://tse3.mm.bing.net/th/id/OIP.R9tYls2TeqXCm0DjTJZT8gHaE8?pid=Api&P=0&h=220' },
  { title: 'Party Makeup (AI-Enhanced)', desc: 'Look party-ready with AI-tailored shades and finishes.', price: '₹1999+', duration: '60-90 min', gender: 'female',image:'https://tse3.mm.bing.net/th/id/OIP.n_OEucvCRCoBMwZtAocUsQHaE0?pid=Api&P=0&h=220' },
  { title: 'Bridal Makeup (AI Preview)', desc: 'Preview your bridal look with AI suggestions before the session.', price: '₹5999+', duration: '120-180 min', gender: 'female' ,image:'https://tse4.mm.bing.net/th/id/OIP.HwYqgOiUPlwcs_PD2aePugHaE8?pid=Api&P=0&h=220'},
]

function mergeAndDedupe(base, incoming) {
  const map = new Map()
  for (const s of base) map.set(s.title.toLowerCase(), s)
  for (const s of incoming) {
    const key = (s.title || s.name || '').toLowerCase()
    if (!key) continue
    map.set(key, s)
  }
  return Array.from(map.values())
}

export default function Services() {
  const [services, setServices] = useState(fallbackServices)
  const [gender, setGender] = useState('all')

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
            gender: s.gender || 'all', // safe default
          }))
          const merged = mergeAndDedupe(fallbackServices, mapped)
          setServices(merged)
        }
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  const visible = useMemo(() => {
    if (gender === 'all') return services
    return services.filter(s => (s.gender || 'all') === 'all' || (s.gender || 'all') === gender)
  }, [services, gender])

  return (
    <section id="services" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading + Gender select */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-display font-bold tracking-tight">Our Services</h2>
            <p className="mt-2 text-gray-600">Quality treatments by experienced professionals.</p>
          </div>

          



  {/* Creative gender selector */}
  <div className="w-full sm:w-auto">
    <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-gray-500 text-center sm:text-right">
      Tailor services for
    </p>
    <div className="inline-flex w-full sm:w-auto items-center justify-between gap-1 rounded-2xl bg-white/70 px-2 py-1.5 shadow-sm ring-1 ring-gray-200 backdrop-blur">
      {[
        { value: 'all', label: 'All' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ].map(option => {
        const active = gender === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setGender(option.value)}
            className={[
              'flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-medium transition-all',
              active
                ? 'bg-gradient-to-r from-camel to-blueAccent text-black shadow-sm shadow-rose-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ].join(' ')}
          >
            {/* <span className="text-sm">{option.emoji}</span> */}
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  </div>
</div>

       

       {/* Cards */}
<div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {visible.map((s) => (
    <article
      key={s.title}
      style={{
        margin: 'auto',
        width: 'min(400px, 100%)',
        backgroundColor: '#fefefe',
        borderRadius: '1rem',
        padding: '0.12rem',
        color: '#141417',
        boxShadow: '0 8px 18px rgba(15, 23, 42, 0.12)',
      }}
    >
      {/* HERO */}
      <section
        style={{
          backgroundColor: '#fef4e2',
          borderRadius: '0.5rem 0.5rem 0 0',
          padding: '0.5rem',
          fontSize: '0.875rem',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            gap: '1rem',
            fontWeight: 700,
          }}
        >
         

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.125rem',
              borderRadius: '999px',
              backgroundColor: '#fff7ea',
              color: '#141417',
            }}
          >
            
          </div>
        </header>
{s.image &&(
    <div
            style={{
              marginTop: '0.25rem',
              borderRadius: '0.75rem',
              overflow: 'hidden',
            }}
          >
            <img
              src={s.image}
              alt={s.title}
              style={{
                display: 'block',
                width: '100%',
                height: '150px',
                objectFit: 'cover',
              }}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
)}
       

       
      </section>

      {/* FOOTER */}
      <footer
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          padding: '0.75rem',
          rowGap: '0.5rem',
          fontWeight: 700,
          fontSize: '0.875rem',
        }}
      >
 <p
          style={{
        
            fontSize: '1.2rem',
            fontWeight: 500,
            paddingRight: '2rem',
          }}
        >
          {s.title}
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            gap: '0.75rem',
          }}
        >
          
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            <p
              style={{
                fontWeight: 400,
                fontSize: '0.8rem',
                color: '#111827',
                margin: 0,
              }}
            >
              {s.desc}
            </p>
            <p
              style={{
                fontWeight: 400,
                fontSize: '0.75rem',
                color: '#6b7280',
                margin: 0,
              }}
            >
              {s.duration || 'Duration on consult'} ·{' '}
              {s.gender === 'male'
                ? 'For men'
                : s.gender === 'female'
                ? 'For women'
                : 'For everyone'}
            </p>
          </div>
        </div>

        <button
          type="button"
          style={{
            width: '100%',
            fontWeight: 500,
            border: 'none',
            display: 'block',
            cursor: 'pointer',
            textAlign: 'center',
            padding: '0.25rem 1rem',
            borderRadius: '1rem',
            backgroundColor: '#b89563',
            color: '#fff',
            fontSize: '0.9rem',
            transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#000'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 10px 18px rgba(15, 23, 42, 0.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#b89563'
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = 'none'
          }}
          onClick={() => {
            const el = document.querySelector('#booking')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Book this service
        </button>
      </footer>
    </article>
  ))}
</div>

      </div>
    </section>
  )
}
