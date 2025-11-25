import BookingForm from './BookingForm'

export default function Cta() {
  return (
    <section id="booking" className="py-20" aria-labelledby="book-now">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gray-900 text-white p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h2 id="book-now" className="text-2xl md:text-3xl font-display font-bold">Ready for a fresh look?</h2>
              <p className="mt-2 text-gray-300">Fill the form to request an appointment. We will confirm via call or WhatsApp.</p>
              <div className="mt-4 flex gap-3">
                <a href="tel:+910000000000" className="rounded-md bg-white text-gray-900 px-5 py-3 font-medium hover:bg-brand hover:text-white transition">Call Now</a>
              </div>
            </div>
            <div className="bg-white text-gray-900 rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-3">Book Appointment</h3>
              <div className="mt-2">
                <BookingForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


