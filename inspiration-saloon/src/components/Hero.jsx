export default function Hero() {
  return (
    <section className="relative isolate min-h-screen flex items-center">
  
  {/* Background soft glow */}
  <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,#f8f5ef_0%,transparent_70%)]" />

  <div className="grid md:grid-cols-2 w-full">

    {/* LEFT SIDE — Bigger text */}
    <div className="px-6 sm:px-12 lg:px-20 pt-10 pb-20 sm:py-20 lg:py-36 flex flex-col"> 
      
      <div className=" max-w-max inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1 text-xs text-brand">
        Premium salon experience
        <span aria-hidden>·</span>
        Since 2010
      </div>

      <h1 className="mt-6 text-5xl sm:text-6xl lg:text-5xl font-display font-bold leading-tight">
        Look good. Feel <span className="text-brand">inspired</span>.
      </h1>

      <p className="mt-6 text-lg text-gray-600 max-w-xl">
        Haircuts, color, beard grooming, and skin care crafted by experts. Step into a space where style meets comfort.
      </p>

      <div className="mt-10 flex gap-4">
  <a
    href="#booking"
    className="
      rounded-md bg-brand 
      px-5 py-3 text-sm      /* mobile */
      sm:px-8 sm:py-4 sm:text-base  /* desktop */
      text-white hover:bg-brand-dark transition
    "
  >
    Book an Appointment
  </a>

  <a
    href="#hairstyles"
    className="
      rounded-md border border-gray-300
      px-5 py-3 text-sm      /* mobile */
      sm:px-8 sm:py-4 sm:text-base  /* desktop */
      hover:border-brand hover:text-brand transition
    "
  >
    View Hair Styles
  </a>
</div>


      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm sm:text-base text-gray-600">
  <div className="flex items-center gap-1.5 sm:gap-2">
    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-brand"></span>
    Certified stylists
  </div>

  <div className="flex items-center gap-1.5 sm:gap-2">
    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-brand"></span>
    Clean & comfy space
  </div>

  <div className="flex items-center gap-1.5 sm:gap-2">
    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-brand"></span>
    Easy online booking
  </div>
</div>

    </div>

    {/* RIGHT SIDE — Full width, full height, no margin */}
    <div className="relative h-[50vh] sm:h-[65vh] md:h-screen w-full overflow-hidden">

  {/* Slide 1 */}
  <div
    className="absolute inset-0 animate-fade1 bg-cover bg-center sm:bg-center"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1170&auto=format&fit=crop')",
    }}
  ></div>

  {/* Slide 2 */}
  <div
    className="absolute inset-0 animate-fade2 bg-cover bg-center sm:bg-center"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&auto=format&fit=crop&q=60')",
    }}
  ></div>

  {/* Slide 3 */}
  <div
    className="absolute inset-0 animate-fade3 bg-cover bg-center sm:bg-center"
    style={{
      backgroundImage:
        "url('https://plus.unsplash.com/premium_photo-1669675936121-6d3d42244ab5?q=80&w=688&auto=format&fit=crop')",
    }}
  ></div>

  {/* Slide 4 */}
  <div
    className="absolute inset-0 animate-fade4 bg-cover bg-center sm:bg-center"
    style={{
      backgroundImage:
        "url('https://media.istockphoto.com/id/1164207677/photo/charming-young-woman-at-hairdresser-salon.jpg?s=612x612&w=0&k=20&c=0f5j4yJ3epgfMXYFiF6jy3QeikVdnf-ZXG-585KgAtY=')",
    }}
  ></div>

</div>


  </div>
</section>

  )
}


