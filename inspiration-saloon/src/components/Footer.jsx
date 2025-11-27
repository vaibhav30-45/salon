import Logo from './Logo'

export default function Footer() {
  return (
    <footer id="contact" className="mt-20 bg-gray-900 text-gray-300">
      <div className="h-1 bg-gradient-to-r from-brand via-brand-light to-brand" />
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <Logo size={40} />
            </div>
            <p className="mt-4 text-sm text-gray-400 max-w-xs">
              Inspiration Saloon is your neighborhood destination for premium hair, beard, and beauty services.
            </p>
            <div className="mt-4 text-sm">
              <div>📍 221B Baker Street, Delhi 110001</div>
              <div className="mt-1">📞 +91 90000 00000</div>
              <a href="mailto:hello@inspirationsaloon.com" className="mt-1 block hover:text-white">✉️ hello@inspirationsaloon.com</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a className="hover:text-white" href="#services">Services</a></li>
              <li><a className="hover:text-white" href="#hairstyles">Hair Styles</a></li>
              <li><a className="hover:text-white" href="#gallery">Gallery</a></li>
              {/* <li><a className="hover:text-white" href="#pricing">Pricing</a></li> */}
              <li><a className="hover:text-white" href="#booking">Book Now</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold">Hours</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex justify-between"><span>Mon - Fri</span><span>10:00 AM – 8:00 PM</span></li>
              <li className="flex justify-between"><span>Saturday</span><span>10:00 AM – 9:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday</span><span>11:00 AM – 6:00 PM</span></li>
            </ul>
            <a href="#booking" className="mt-4 inline-flex rounded-md bg-brand px-4 py-2 text-gray-900 font-medium hover:opacity-90">Reserve a slot</a>
          </div>

          <div>
            <h4 className="text-white font-semibold">Follow Us</h4>
            <p className="mt-4 text-sm text-gray-400">Stay updated with latest offers and styles.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="https://instagram.com/inspiration.saloon" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 hover:bg-white/10">
                <span>Instagram</span>
              </a>
              <a href="https://facebook.com/inspiration.saloon" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 hover:bg-white/10">
                <span>Facebook</span>
              </a>
              <a href="https://x.com/inspiration_saloon" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 hover:bg-white/10">
                <span>X</span>
              </a>
              <a href="https://youtube.com/@inspiration-saloon" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 hover:bg-white/10">
                <span>YouTube</span>
              </a>
              <a href="https://tiktok.com/@inspiration.saloon" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 hover:bg-white/10">
                <span>TikTok</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
          <p className="text-gray-400">© {new Date().getFullYear()} Inspiration Saloon. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}


