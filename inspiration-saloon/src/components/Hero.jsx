export default function Hero() {
  return (
    <section className="relative isolate">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,#f8f5ef_0%,transparent_70%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-sm text-brand">
              Premium salon experience
              <span aria-hidden>·</span>
              Since 2010
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl font-display font-bold tracking-tight">
              Look good. Feel <span className="text-brand">inspired</span>.
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-prose">
              Haircuts, color, beard grooming, and skin care crafted by experts. Step into a space where style meets comfort.
            </p>
            <div className="mt-8 flex gap-4">
              <a href="#booking" className="rounded-md bg-brand px-6 py-3 text-white hover:bg-brand-dark transition">Book an Appointment</a>
              <a href="#hairstyles" className="rounded-md border border-gray-300 px-6 py-3 hover:border-brand hover:text-brand transition">View Hair Styles</a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand"></span> Certified stylists</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand"></span> Clean & comfy space</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand"></span> Easy online booking</div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <div className="flex animate-scroll-x will-change-transform">
                {[ 
                  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1519669011783-4eaa95fa73ab?q=80&w=1600&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1518085250887-2f903c200fee?q=80&w=1600&auto=format&fit=crop',
                ].map((src, i)=> (
                  <img key={i} src={src} alt="Salon" className="h-full w-full object-cover flex-none" loading="lazy" onError={(e)=>{e.currentTarget.src='https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop'}} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


