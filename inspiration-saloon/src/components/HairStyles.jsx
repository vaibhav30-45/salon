const boys = [
  { name: 'Classic Fade', img: 'https://images.unsplash.com/photo-1672642150228-3fcd5826ec26?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Textured Crop', img: 'https://plus.unsplash.com/premium_photo-1741902728626-e00aec0bf055?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGV4dHVyZWQlMjBjcm9wJTIwY3V0JTIwaGFpcnN0eWxlfGVufDB8fDB8fHww' },
  { name: 'Side Part', img: 'https://static.vecteezy.com/system/resources/thumbnails/058/443/333/small/stylish-men-s-hairstyle-with-side-part-and-undercut-free-png.png' },
]

const girls = [
  { name: 'Soft Curls', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop' },
  { name: 'Balayage', img: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=1600&auto=format&fit=crop' },
  { name: 'Bob Cut', img: 'https://images.unsplash.com/photo-1608877607386-8698047d65a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9iJTIwaGFpcmN1dHxlbnwwfHwwfHx8MA%3D%3D' },
]

function Grid({ items }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((s) => (
        <div key={s.name} className="group relative overflow-hidden rounded-xl bg-white shadow-sm">
          <img src={s.img} alt={s.name} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 text-white font-medium">{s.name}</div>
        </div>
      ))}
    </div>
  )
}

export default function HairStyles() {
  return (
    <section id="hairstyles" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-display font-bold tracking-tight">Hair Styles</h2>
          <p className="mt-3 text-gray-600">Trendy looks for boys and girls, tailored by our stylists.</p>
        </div>
        <div className="mt-10 space-y-12">
          <div>
            <h3 className="text-lg font-semibold mb-4">Boys</h3>
            <Grid items={boys} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Girls</h3>
            <Grid items={girls} />
          </div>
        </div>
      </div>
    </section>
  )
}





