import Logo from './Logo'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          <a href="#" className="flex items-center">
            <Logo size={44} />
          </a>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {[
              ['Services', '#services'],
              ['Gallery', '#gallery'],
              ['Hair Styles', '#hairstyles'],
              ['Pricing', '#pricing'],
              ['Contact', '#contact'],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="px-3 py-2 rounded-md hover:text-brand hover:bg-brand/10 transition"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
              <input
                type="search"
                placeholder="Search services..."
                className="w-56 rounded-md border border-gray-300 bg-white/70 pl-9 pr-3 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </div>
            <a href="#booking" className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-white hover:bg-brand-dark transition">Book Now</a>
          </div>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-brand via-brand-light to-brand" />
    </header>
  )
}


