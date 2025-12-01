import BookingForm from './BookingForm'

export default function Cta() {
  
  return (
    <section id="booking" className="py-20" aria-labelledby="book-now">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="rounded-2xl bg-gray-900 text-white p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="mt-12">
  <h2
  id="book-now"
  className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white"
>
  Ready for a fresh look?
</h2>

<p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
  Our online bookings service operates between <b>10:00 a.m.</b> and <b>6:00 p.m.</b>
</p>

<p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
  During opening hours, we'll call you back within <b>1 hour</b> to confirm your appointment.
  Outside opening hours, we will call you shortly after <b>10:00 a.m.</b>
</p>

<p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
  Your data is safe with us — we only use your details to process your salon booking and
  we never share them with third parties.
</p>

<div className="mt-6">
  <a
    href="tel:+910000000000"
    className="inline-block rounded-md bg-white text-gray-900 
               px-4 py-2 text-sm sm:text-base font-medium
               hover:bg-brand hover:text-white transition"
  >
    Call Now
  </a>
</div>
</div>

            <div className=" text-gray-900 ">
              {/* <h3 className="text-lg font-semibold mb-3">Book Appointment</h3> */}
              {/* <div className="mt-2"> */}
                <BookingForm />
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


