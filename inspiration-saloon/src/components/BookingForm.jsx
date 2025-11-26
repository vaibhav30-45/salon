import { useState } from 'react'

const defaultState = {
  name: '',
  phone: '',
  email: '',
   gender: '',
  service: '',
  preferredDate: '',
  preferredTime: '',
  notes: '',
}

export default function BookingForm() {
  const [form, setForm] = useState(defaultState)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [booked, setBooked] = useState([])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')
    setError('')
    try {
      const res = await fetch('http://localhost:4000/api/appointments', 
 {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(()=>({}))
        const msg = data?.errors ? data.errors.join(', ') : (data?.error || 'Failed to book appointment')
        throw new Error(msg)
      }
      setForm(defaultState)
      setMessage('Appointment requested! We will confirm shortly.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Build 30-min slots from 10:00 to 20:00
  const slots = []
  for (let h = 10; h <= 20; h++) {
    for (let m of [0, 30]) {
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      const t = `${hh}:${mm}`
      if (h === 20 && m === 30) continue
      slots.push(t)
    }
  }

  async function loadBooked(date) {
    if (!date) return
    try {
      const res = await fetch(`http://localhost:4000/api/appointments/booked?date=${encodeURIComponent(date)}`)

      const data = await res.json()
      if (Array.isArray(data)) setBooked(data)
    } catch {}
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input required className="rounded-md border border-gray-300 px-3 py-2" placeholder="Full name"
        value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
      <input required className="rounded-md border border-gray-300 px-3 py-2" placeholder="Phone number"
        value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
      <input className="rounded-md border border-gray-300 px-3 py-2 sm:col-span-2" placeholder="Email (optional)"
        value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
      <select className="rounded-md border border-gray-300 px-3 py-2" value={form.service}
        onChange={(e)=>setForm({...form, service:e.target.value})}>
        {[
          'Hair Styling',
          'Beard Grooming',
          'Facials',
          'Manicure & Pedicure',
          'Party Makeup (AI-Enhanced)',
          'Bridal Makeup (AI Preview)'
        ].map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <div className="grid grid-cols-2 gap-4">
        <input required type="date" className="rounded-md border border-gray-300 px-3 py-2" value={form.preferredDate}
          onChange={(e)=>{ const v=e.target.value; setForm({...form, preferredDate:v}); loadBooked(v) }} />
        <select required className="rounded-md border border-gray-300 px-3 py-2" value={form.preferredTime}
          onChange={(e)=>setForm({...form, preferredTime:e.target.value})}>
          <option value="" disabled>Select time</option>
          {slots.map((t)=> (
            <option key={t} value={t} disabled={booked.includes(t)}>
              {t} {booked.includes(t) ? '(Booked)' : ''}
            </option>
          ))}
        </select>
      </div>
      <textarea className="rounded-md border border-gray-300 px-3 py-2 sm:col-span-2" rows="3" placeholder="Notes (optional)"
        value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} />
      <div className="sm:col-span-2 flex items-center gap-3">
        <button disabled={submitting} className="rounded-md bg-brand px-5 py-2 text-white hover:bg-brand-dark disabled:opacity-60">
          {submitting ? 'Booking...' : 'Book Appointment'}
        </button>
        {message && <span className="text-sm text-green-700">{message}</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </form>
  )
}


