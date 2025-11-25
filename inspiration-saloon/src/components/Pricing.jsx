const tiers = [
  { name: 'Classic Cut', price: '₹499', features: ['Wash & Style', '15 min consult'] },
  { name: 'Deluxe Groom', price: '₹899', features: ['Cut & Beard', 'Hot Towel', 'Style'] },
  { name: 'Signature Glow', price: '₹1,499', features: ['Facial', 'Massage', 'Mask'] },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-display font-bold tracking-tight text-center">Pricing</h2>
        <p className="mt-3 text-center text-gray-600">Transparent, simple packages.</p>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div key={t.name} className="rounded-2xl border border-gray-200 p-6 bg-white flex flex-col">
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <p className="mt-2 text-3xl font-bold text-brand">{t.price}</p>
              <ul className="mt-4 space-y-2 text-gray-600">
                {t.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <a href="#booking" className="mt-6 inline-flex justify-center rounded-md bg-brand px-4 py-2 text-white hover:bg-brand-dark transition">Choose</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


