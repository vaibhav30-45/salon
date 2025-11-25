import React from 'react'
import ReactDOM from 'react-dom/client'
import { useEffect, useState } from 'react'
import './index.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '')
  const [creds, setCreds] = useState({ username: '', password: '' })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('appointments') // appointments | services | messages | settings | gallery | makeovers | receipts
  const [services, setServices] = useState([])
  const [svcLoading, setSvcLoading] = useState(false)
  const [svcError, setSvcError] = useState('')
  const [svcForm, setSvcForm] = useState({ name: '', description: '', price: '', duration: '', image: '', active: true })
  const [msgs, setMsgs] = useState([])
  const [msgLoading, setMsgLoading] = useState(false)
  const [msgError, setMsgError] = useState('')
  const [gallery, setGallery] = useState([])
  const [galForm, setGalForm] = useState({ url: '', title: '', active: true })
  const [mk, setMk] = useState([])
  const [mkForm, setMkForm] = useState({ name: '', description: '', active: true })
  const [receipts, setReceipts] = useState([])
  const [receiptLoading, setReceiptLoading] = useState(false)
  const [receiptError, setReceiptError] = useState('')
  const [receiptFilters, setReceiptFilters] = useState({ search: '', status: '', paymentMethod: '', startDate: '', endDate: '' })
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [receiptForm, setReceiptForm] = useState({ paymentMethod: 'cash', notes: '' })

  async function safeParseJson(res) {
    try {
      const ct = res.headers.get('content-type') || ''
      if (ct.includes('application/json')) return await res.json()
      const text = await res.text()
      return text ? { error: text } : {}
    } catch {
      return {}
    }
  }

  async function login(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      })
      const data = await safeParseJson(res)
      if (!res.ok) throw new Error(data.error || 'Login failed')
      localStorage.setItem('admin_token', data.token)
      setToken(data.token)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/appointments', { headers: { Authorization: `Bearer ${token}` } })
      const data = await safeParseJson(res)
      if (res.status === 401) {
        // Invalid token, clear it and logout
        localStorage.removeItem('admin_token')
        setToken('')
        throw new Error('Session expired. Please login again.')
      }
      if (!res.ok) throw new Error(data.error || 'Failed to load')
      setItems(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (token) load() }, [token])
  useEffect(() => { if (token && tab === 'services') loadServices() }, [token, tab])
  useEffect(() => { if (token && tab === 'messages') loadMessages() }, [token, tab])
  useEffect(() => { if (token && tab === 'gallery') loadGallery() }, [token, tab])
  useEffect(() => { if (token && tab === 'makeovers') loadMakeovers() }, [token, tab])
  useEffect(() => { if (token && tab === 'receipts') loadReceipts() }, [token, tab])

  function logout() {
    localStorage.removeItem('admin_token')
    setToken('')
    setItems([])
    setError('')
  }

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      })
      const data = await safeParseJson(res)
      if (!res.ok) throw new Error(data.error || 'Failed to update')
      setItems(items.map(it => it._id === id ? data : it))
      setSelected(data)
    } catch (e) {
      alert(e.message)
    }
  }

  // Services
  async function loadServices() {
    setSvcLoading(true)
    setSvcError('')
    try {
      const res = await fetch('/api/admin/services', { headers: { Authorization: `Bearer ${token}` } })
      const data = await safeParseJson(res)
      if (res.status === 401) {
        localStorage.removeItem('admin_token')
        setToken('')
        throw new Error('Session expired. Please login again.')
      }
      if (!res.ok) throw new Error(data.error || 'Failed to load services')
      setServices(data)
    } catch (e) {
      setSvcError(e.message)
    } finally {
      setSvcLoading(false)
    }
  }
  async function createService(e) {
    e.preventDefault()
    setSvcError('')
    try {
      const body = { ...svcForm, price: Number(svcForm.price) || 0 }
      const res = await fetch('/api/admin/services', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
      const data = await safeParseJson(res)
      if (!res.ok) throw new Error(data.error || 'Failed to add service')
      setServices([data, ...services])
      setSvcForm({ name: '', description: '', price: '', duration: '', image: '', active: true })
    } catch (e) { setSvcError(e.message) }
  }
  async function updateService(id, patch) {
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(patch) })
      const data = await safeParseJson(res)
      if (!res.ok) throw new Error(data.error || 'Failed to update service')
      setServices(services.map(s => s._id === id ? data : s))
    } catch (e) { alert(e.message) }
  }
  async function deleteService(id) {
    if (!confirm('Delete this service?')) return
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      const data = await safeParseJson(res)
      if (!res.ok) throw new Error(data.error || 'Failed to delete')
      setServices(services.filter(s => s._id !== id))
    } catch (e) { alert(e.message) }
  }

  // Messages
  async function loadMessages() {
    setMsgLoading(true)
    setMsgError('')
    try {
      const res = await fetch('/api/admin/messages', { headers: { Authorization: `Bearer ${token}` } })
      const data = await safeParseJson(res)
      if (res.status === 401) {
        localStorage.removeItem('admin_token')
        setToken('')
        throw new Error('Session expired. Please login again.')
      }
      if (!res.ok) throw new Error(data.error || 'Failed to load messages')
      setMsgs(data)
    } catch (e) { setMsgError(e.message) }
    finally { setMsgLoading(false) }
  }
  async function markMessage(id, status) {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) })
      const data = await safeParseJson(res)
      if (!res.ok) throw new Error(data.error || 'Failed to update message')
      setMsgs(msgs.map(m => m._id === id ? data : m))
    } catch (e) { alert(e.message) }
  }

  // Gallery
  async function loadGallery() {
    const res = await fetch('/api/admin/gallery', { headers: { Authorization: `Bearer ${token}` } })
    const data = await safeParseJson(res)
    if (res.status === 401) {
      localStorage.removeItem('admin_token')
      setToken('')
      return
    }
    if (res.ok) setGallery(data)
  }
  async function addGallery(e) {
    e.preventDefault()
    const res = await fetch('/api/admin/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(galForm) })
    const data = await safeParseJson(res)
    if (res.ok) { setGallery([data, ...gallery]); setGalForm({ url: '', title: '', active: true }) }
  }
  async function patchGallery(id, patch) {
    const res = await fetch(`/api/admin/gallery/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(patch) })
    const data = await safeParseJson(res)
    if (res.ok) setGallery(gallery.map(g => g._id === id ? data : g))
  }
  async function delGallery(id) {
    if (!confirm('Delete this image?')) return
    const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) setGallery(gallery.filter(g => g._id !== id))
  }

  // Makeovers
  async function loadMakeovers() {
    const res = await fetch('/api/admin/makeovers', { headers: { Authorization: `Bearer ${token}` } })
    const data = await safeParseJson(res)
    if (res.status === 401) {
      localStorage.removeItem('admin_token')
      setToken('')
      return
    }
    if (res.ok) setMk(data)
  }
  async function addMakeover(e) {
    e.preventDefault()
    const res = await fetch('/api/admin/makeovers', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(mkForm) })
    const data = await safeParseJson(res)
    if (res.ok) { setMk([data, ...mk]); setMkForm({ name: '', description: '', active: true }) }
  }
  async function patchMakeover(id, patch) {
    const res = await fetch(`/api/admin/makeovers/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(patch) })
    const data = await safeParseJson(res)
    if (res.ok) setMk(mk.map(x => x._id === id ? data : x))
  }
  async function delMakeover(id) {
    if (!confirm('Delete this makeover?')) return
    const res = await fetch(`/api/admin/makeovers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) setMk(mk.filter(x => x._id !== id))
  }

  // Receipt management
  async function loadReceipts() {
    setReceiptLoading(true)
    setReceiptError('')
    try {
      const params = new URLSearchParams()
      if (receiptFilters.search) params.append('search', receiptFilters.search)
      if (receiptFilters.status) params.append('status', receiptFilters.status)
      if (receiptFilters.paymentMethod) params.append('paymentMethod', receiptFilters.paymentMethod)
      if (receiptFilters.startDate) params.append('startDate', receiptFilters.startDate)
      if (receiptFilters.endDate) params.append('endDate', receiptFilters.endDate)
      
      const res = await fetch(`/api/admin/receipts?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await safeParseJson(res)
      if (res.status === 401) {
        localStorage.removeItem('admin_token')
        setToken('')
        throw new Error('Session expired. Please login again.')
      }
      if (!res.ok) throw new Error(data.error || 'Failed to load receipts')
      setReceipts(data)
    } catch (e) {
      setReceiptError(e.message)
    } finally {
      setReceiptLoading(false)
    }
  }

  async function generateReceipt(appointmentId) {
    try {
      const res = await fetch(`/api/admin/appointments/${appointmentId}/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(receiptForm)
      })
      const data = await safeParseJson(res)
      if (!res.ok) throw new Error(data.error || 'Failed to generate receipt')
      setReceipts([data, ...receipts])
      setReceiptForm({ paymentMethod: 'cash', notes: '' })
      alert('Receipt generated successfully!')
    } catch (e) {
      alert(e.message)
    }
  }

  async function updateReceipt(id, patch) {
    try {
      const res = await fetch(`/api/admin/receipts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(patch)
      })
      const data = await safeParseJson(res)
      if (!res.ok) throw new Error(data.error || 'Failed to update receipt')
      setReceipts(receipts.map(r => r._id === id ? data : r))
      setSelectedReceipt(data)
    } catch (e) {
      alert(e.message)
    }
  }

  async function deleteReceipt(id) {
    if (!confirm('Delete this receipt?')) return
    try {
      const res = await fetch(`/api/admin/receipts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setReceipts(receipts.filter(r => r._id !== id))
        setSelectedReceipt(null)
      }
    } catch (e) {
      alert(e.message)
    }
  }

  function printReceipt(receipt) {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${receipt.receiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .receipt-info { margin-bottom: 15px; }
            .receipt-info h3 { margin: 0 0 10px 0; color: #333; }
            .receipt-info p { margin: 5px 0; }
            .total { border-top: 1px solid #333; padding-top: 10px; font-weight: bold; font-size: 18px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Inspiration Saloon</h1>
            <p>Receipt #${receipt.receiptNumber}</p>
            <p>${new Date(receipt.createdAt).toLocaleDateString()} ${new Date(receipt.createdAt).toLocaleTimeString()}</p>
          </div>
          
          <div class="receipt-info">
            <h3>Client Information</h3>
            <p><strong>Name:</strong> ${receipt.clientName}</p>
            <p><strong>Phone:</strong> ${receipt.clientPhone}</p>
            ${receipt.clientEmail ? `<p><strong>Email:</strong> ${receipt.clientEmail}</p>` : ''}
          </div>
          
          <div class="receipt-info">
            <h3>Service Details</h3>
            <p><strong>Service:</strong> ${receipt.serviceName}</p>
            <p><strong>Date:</strong> ${receipt.appointmentDate}</p>
            <p><strong>Time:</strong> ${receipt.appointmentTime}</p>
          </div>
          
          <div class="receipt-info">
            <h3>Payment Information</h3>
            <p><strong>Amount:</strong> ₹${receipt.servicePrice}</p>
            <p><strong>Payment Method:</strong> ${receipt.paymentMethod.toUpperCase()}</p>
            <p><strong>Status:</strong> ${receipt.paymentStatus.toUpperCase()}</p>
          </div>
          
          ${receipt.notes ? `
          <div class="receipt-info">
            <h3>Notes</h3>
            <p>${receipt.notes}</p>
          </div>
          ` : ''}
          
          <div class="total">
            Total: ₹${receipt.servicePrice}
          </div>
          
          <div class="footer">
            <p>Thank you for choosing Inspiration Saloon!</p>
            <p>Generated by: ${receipt.generatedBy}</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="app-shell">
      <div className="footer-accent" />
      <div className="max-w-7xl w-full mx-auto px-4 py-6 flex-1">
        <header className="header-gradient p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 grid place-items-center rounded-full border border-gray-300 bg-white shadow-sm">
              <span className="font-bold text-gray-900">I·H·S</span>
            </div>
            <div>
              <div className="font-semibold text-lg">
                <span className="text-brand">Inspiration</span> Saloon
              </div>
              <div className="text-sm text-gray-600">Admin Portal</div>
            </div>
          </div>
          {token && (
            <div className="flex items-center gap-2">
              <button onClick={load} className="btn-outline">Refresh</button>
              <button onClick={logout} className="btn-outline">Sign out</button>
            </div>
          )}
        </header>

        {!token ? (
          <form onSubmit={login} className="mt-6 max-w-sm space-y-3 card p-4">
            {error && <div className="text-sm text-red-600">{error}</div>}
                        <input className="form-input" placeholder="Username" value={creds.username} onChange={(e)=>setCreds({...creds, username:e.target.value})} />
                        <input type="password" className="form-input" placeholder="Password" value={creds.password} onChange={(e)=>setCreds({...creds, password:e.target.value})} />
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
            <aside className="card p-3">
              <nav className="space-y-1 text-sm">
                {[
                  ['appointments','Appointments'],
                  ['services','Services'],
                  ['gallery','Gallery'],
                  ['makeovers','Makeovers'],
                  ['messages','Messages'],
                  ['receipts','Receipts'],
                  ['settings','Settings'],
                ].map(([key,label]) => (
                  <button key={key} onClick={()=>setTab(key)} className={`nav-item ${tab===key? 'active':''}`}>{label}</button>
                ))}
              </nav>
            </aside>

            <section className="min-h-[400px] card p-4">
              {loading ? (
                <p className="mt-4 text-gray-600">Loading...</p>
              ) : error ? (
                <p className="mt-4 text-red-600">{error}</p>
              ) : (
                <>
                  {tab === 'appointments' && (
                    items.length === 0 ? (
                      <div className="rounded-md border border-gray-200 p-6 text-sm text-gray-600">No appointments yet.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="text-left border-b border-gray-200">
                              <th className="py-2 pr-4">Name</th>
                              <th className="py-2 pr-4">Phone</th>
                              <th className="py-2 pr-4">Email</th>
                              <th className="py-2 pr-4">Service</th>
                              <th className="py-2 pr-4">Date</th>
                              <th className="py-2 pr-4">Time</th>
                              <th className="py-2 pr-4">Status</th>
                              <th className="py-2 pr-4">Paid</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map(a => (
                              <tr key={a._id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={()=>setSelected(a)}>
                                <td className="py-2 pr-4">{a.name}</td>
                                <td className="py-2 pr-4">{a.phone}</td>
                                <td className="py-2 pr-4">{a.email || '-'}</td>
                                <td className="py-2 pr-4">{a.service}</td>
                                <td className="py-2 pr-4">{a.preferredDate}</td>
                                <td className="py-2 pr-4">{a.preferredTime}</td>
                                <td className="py-2 pr-4">{a.status}</td>
                                <td className="py-2 pr-4">{a.paid ? 'Yes' : 'No'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  )}

                  {tab === 'services' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <form onSubmit={createService} className="card p-4 space-y-3">
                        <h3 className="font-semibold">Add Service</h3>
                        {svcError && <div className="text-sm text-red-600">{svcError}</div>}
                        <input className="form-input" placeholder="Name" value={svcForm.name} onChange={(e)=>setSvcForm({...svcForm, name:e.target.value})} />
                        <textarea className="form-input" rows="3" placeholder="Description" value={svcForm.description} onChange={(e)=>setSvcForm({...svcForm, description:e.target.value})} />
                        <div className="grid grid-cols-2 gap-3">
                          <input className="form-input" placeholder="Price" value={svcForm.price} onChange={(e)=>setSvcForm({...svcForm, price:e.target.value})} />
                          <input className="form-input" placeholder="Duration" value={svcForm.duration} onChange={(e)=>setSvcForm({...svcForm, duration:e.target.value})} />
                        </div>
                        <input className="form-input" placeholder="Image URL (optional)" value={svcForm.image} onChange={(e)=>setSvcForm({...svcForm, image:e.target.value})} />
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={svcForm.active} onChange={(e)=>setSvcForm({...svcForm, active:e.target.checked})} /> Active</label>
                        <button type="submit" className="btn-primary">Add Service</button>
                      </form>

                      <div className="space-y-3">
                        <h3 className="font-semibold">Services</h3>
                        {svcLoading ? (
                          <p className="text-gray-600 text-sm">Loading services...</p>
                        ) : services.length === 0 ? (
                          <div className="rounded-md border border-gray-200 p-6 text-sm text-gray-600">No services yet.</div>
                        ) : (
                          <div className="grid gap-3">
                            {services.map(s => (
                              <div key={s._id} className="card p-3 flex items-start gap-3">
                                {s.image && <img src={s.image} alt="" className="h-14 w-14 rounded object-cover" onError={(e)=>{e.currentTarget.style.display='none'}} />}
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium">{s.name}</div>
                                    <div className="text-sm text-gray-600">₹{s.price} · {s.duration || '—'}</div>
                                  </div>
                                  <div className="text-sm text-gray-600">{s.description || '—'}</div>
                                  <div className="mt-2 flex items-center gap-2 text-sm">
                                    <button className="btn-outline" onClick={()=>updateService(s._id, { active: !s.active })}>{s.active ? 'Deactivate' : 'Activate'}</button>
                                    <button className="btn-outline" onClick={()=>deleteService(s._id)}>Delete</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {tab === 'gallery' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <form onSubmit={addGallery} className="card p-4 space-y-3">
                        <h3 className="font-semibold">Add Gallery Image</h3>
                        <input className="form-input" placeholder="Image URL" value={galForm.url} onChange={(e)=>setGalForm({...galForm, url:e.target.value})} />
                        <input className="form-input" placeholder="Title (optional)" value={galForm.title} onChange={(e)=>setGalForm({...galForm, title:e.target.value})} />
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={galForm.active} onChange={(e)=>setGalForm({...galForm, active:e.target.checked})} /> Active</label>
                        <button type="submit" className="btn-primary">Add Image</button>
                      </form>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {gallery.map(g => (
                          <div key={g._id} className="card p-2">
                            <img src={g.url} alt="" className="h-40 w-full object-cover rounded" onError={(e)=>{e.currentTarget.style.display='none'}} />
                            <div className="mt-2 flex items-center justify-between text-sm">
                              <div>{g.title || 'Untitled'}</div>
                              <div className="flex items-center gap-2">
                                <button className="btn-outline" onClick={()=>patchGallery(g._id, { active: !g.active })}>{g.active ? 'Deactivate' : 'Activate'}</button>
                                <button className="btn-outline" onClick={()=>delGallery(g._id)}>Delete</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tab === 'makeovers' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <form onSubmit={addMakeover} className="card p-4 space-y-3">
                        <h3 className="font-semibold">Add Makeover</h3>
                        <input className="form-input" placeholder="Name" value={mkForm.name} onChange={(e)=>setMkForm({...mkForm, name:e.target.value})} />
                        <textarea className="form-input" rows="3" placeholder="Description" value={mkForm.description} onChange={(e)=>setMkForm({...mkForm, description:e.target.value})} />
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={mkForm.active} onChange={(e)=>setMkForm({...mkForm, active:e.target.checked})} /> Active</label>
                        <button type="submit" className="btn-primary">Add Makeover</button>
                      </form>
                      <div className="space-y-3">
                        {mk.map(x => (
                          <div key={x._id} className="card p-3">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{x.name}</div>
                              <div className="text-sm text-gray-600">{x.active ? 'Active' : 'Inactive'}</div>
                            </div>
                            <div className="text-sm text-gray-600">{x.description || '—'}</div>
                            <div className="mt-2 flex items-center gap-2 text-sm">
                              <button className="btn-outline" onClick={()=>patchMakeover(x._id, { active: !x.active })}>{x.active ? 'Deactivate' : 'Activate'}</button>
                              <button className="btn-outline" onClick={()=>delMakeover(x._id)}>Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tab === 'messages' && (
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Customer Messages</h3>
                        <button className="btn-outline" onClick={loadMessages}>Refresh</button>
                      </div>
                      {msgLoading ? (
                        <p className="mt-4 text-gray-600 text-sm">Loading...</p>
                      ) : msgError ? (
                        <p className="mt-4 text-red-600 text-sm">{msgError}</p>
                      ) : msgs.length === 0 ? (
                        <div className="rounded-md border border-gray-200 p-6 text-sm text-gray-600 mt-4">No messages yet.</div>
                      ) : (
                        <div className="mt-4 overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="text-left border-b border-gray-200">
                                <th className="py-2 pr-4">Name</th>
                                <th className="py-2 pr-4">Email</th>
                                <th className="py-2 pr-4">Phone</th>
                                <th className="py-2 pr-4">Message</th>
                                <th className="py-2 pr-4">Status</th>
                                <th className="py-2 pr-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {msgs.map(m => (
                                <tr key={m._id} className="border-b border-gray-100 align-top">
                                  <td className="py-2 pr-4">{m.name}</td>
                                  <td className="py-2 pr-4">{m.email || '-'}</td>
                                  <td className="py-2 pr-4">{m.phone || '-'}</td>
                                  <td className="py-2 pr-4 max-w-md whitespace-pre-wrap">{m.message}</td>
                                  <td className="py-2 pr-4">{m.status}</td>
                                  <td className="py-2 pr-4">
                                    <div className="flex items-center gap-2">
                                      <button className="btn-outline" onClick={()=>markMessage(m._id, 'read')}>Mark Read</button>
                                      <button className="btn-outline" onClick={()=>markMessage(m._id, 'pending')}>Mark Pending</button>
                                      {m.email && (
                                        <button className="btn-outline" onClick={()=>window.open(`mailto:${m.email}?subject=We%20received%20your%20message&body=Hi%20${encodeURIComponent(m.name)},%0D%0A%0D%0AThanks%20for%20contacting%20Inspiration%20Saloon.%20We%20will%20reach%20you%20shortly.`,'_blank')}>Email</button>
                                      )}
                                      {m.phone && (
                                        <a className="btn-outline" href={`https://wa.me/${m.phone.replace(/\D/g,'')}?text=${encodeURIComponent('Hello '+m.name+', thanks for contacting Inspiration Saloon. We will get back to you shortly.')}`} target="_blank" rel="noreferrer">WhatsApp</a>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {tab === 'receipts' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Receipt Management</h3>
                        <button className="btn-outline" onClick={loadReceipts}>Refresh</button>
                      </div>
                      
                      {/* Filters */}
                      <div className="card p-4 mb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                          <input 
                            className="form-input" 
                            placeholder="Search receipts..." 
                            value={receiptFilters.search} 
                            onChange={(e) => setReceiptFilters({...receiptFilters, search: e.target.value})}
                          />
                          <select 
                            className="form-input" 
                            value={receiptFilters.status} 
                            onChange={(e) => setReceiptFilters({...receiptFilters, status: e.target.value})}
                          >
                            <option value="">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="refunded">Refunded</option>
                          </select>
                          <select 
                            className="form-input" 
                            value={receiptFilters.paymentMethod} 
                            onChange={(e) => setReceiptFilters({...receiptFilters, paymentMethod: e.target.value})}
                          >
                            <option value="">All Methods</option>
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                            <option value="upi">UPI</option>
                            <option value="online">Online</option>
                          </select>
                          <input 
                            type="date" 
                            className="form-input" 
                            placeholder="Start Date" 
                            value={receiptFilters.startDate} 
                            onChange={(e) => setReceiptFilters({...receiptFilters, startDate: e.target.value})}
                          />
                          <input 
                            type="date" 
                            className="form-input" 
                            placeholder="End Date" 
                            value={receiptFilters.endDate} 
                            onChange={(e) => setReceiptFilters({...receiptFilters, endDate: e.target.value})}
                          />
                        </div>
                        <button className="btn-primary mt-3" onClick={loadReceipts}>Apply Filters</button>
                      </div>

                      {receiptLoading ? (
                        <p className="mt-4 text-gray-600 text-sm">Loading receipts...</p>
                      ) : receiptError ? (
                        <p className="mt-4 text-red-600 text-sm">{receiptError}</p>
                      ) : receipts.length === 0 ? (
                        <div className="rounded-md border border-gray-200 p-6 text-sm text-gray-600">No receipts found.</div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="text-left border-b border-gray-200">
                                <th className="py-2 pr-2 sm:pr-4">Receipt #</th>
                                <th className="py-2 pr-2 sm:pr-4">Client</th>
                                <th className="py-2 pr-2 sm:pr-4 hidden sm:table-cell">Service</th>
                                <th className="py-2 pr-2 sm:pr-4">Amount</th>
                                <th className="py-2 pr-2 sm:pr-4 hidden md:table-cell">Payment</th>
                                <th className="py-2 pr-2 sm:pr-4">Status</th>
                                <th className="py-2 pr-2 sm:pr-4 hidden lg:table-cell">Date</th>
                                <th className="py-2 pr-2 sm:pr-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {receipts.map(r => (
                                <tr key={r._id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={()=>setSelectedReceipt(r)}>
                                  <td className="py-2 pr-2 sm:pr-4 font-mono text-xs">{r.receiptNumber}</td>
                                  <td className="py-2 pr-2 sm:pr-4">
                                    <div>
                                      <div className="font-medium text-sm">{r.clientName}</div>
                                      <div className="text-xs text-gray-500">{r.clientPhone}</div>
                                      <div className="text-xs text-gray-600 sm:hidden">{r.serviceName}</div>
                                    </div>
                                  </td>
                                  <td className="py-2 pr-2 sm:pr-4 hidden sm:table-cell">{r.serviceName}</td>
                                  <td className="py-2 pr-2 sm:pr-4 font-medium">₹{r.servicePrice}</td>
                                  <td className="py-2 pr-2 sm:pr-4 hidden md:table-cell">{r.paymentMethod.toUpperCase()}</td>
                                  <td className="py-2 pr-2 sm:pr-4">
                                    <span className={`status-badge ${
                                      r.paymentStatus === 'paid' ? 'status-paid' :
                                      r.paymentStatus === 'pending' ? 'status-pending' :
                                      'status-refunded'
                                    }`}>
                                      {r.paymentStatus.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="py-2 pr-2 sm:pr-4 hidden lg:table-cell text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                                  <td className="py-2 pr-2 sm:pr-4">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                      <button className="btn-outline text-xs px-2 py-1" onClick={(e) => {e.stopPropagation(); printReceipt(r)}}>Print</button>
                                      <button className="btn-outline text-xs px-2 py-1" onClick={(e) => {e.stopPropagation(); deleteReceipt(r._id)}}>Del</button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {tab === 'settings' && (
                    <div className="rounded-md border border-gray-200 p-6 text-sm text-gray-600">Settings UI coming next.</div>
                  )}
                </>
              )}
            </section>
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-50">
            <div className="modal-backdrop absolute inset-0" onClick={()=>setSelected(null)} />
            <div className="modal-content absolute inset-x-4 top-4 sm:inset-x-0 sm:top-20 mx-auto w-auto sm:w-[95%] max-w-2xl card p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold">Appointment Details</h2>
                <button className="btn-outline" onClick={()=>setSelected(null)}>Close</button>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Name</div>
                  <div className="font-medium">{selected.name}</div>
                </div>
                <div>
                  <div className="text-gray-500">Phone</div>
                  <div className="font-medium">{selected.phone}</div>
                </div>
                <div>
                  <div className="text-gray-500">Email</div>
                  <div className="font-medium">{selected.email || '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Service</div>
                  <div className="font-medium">{selected.service}</div>
                </div>
                <div>
                  <div className="text-gray-500">Preferred Date</div>
                  <div className="font-medium">{selected.preferredDate}</div>
                </div>
                <div>
                  <div className="text-gray-500">Preferred Time</div>
                  <div className="font-medium">{selected.preferredTime}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-gray-500">Notes</div>
                  <div className="font-medium whitespace-pre-wrap">{selected.notes || '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Created</div>
                  <div className="font-medium">{new Date(selected.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Updated</div>
                  <div className="font-medium">{new Date(selected.updatedAt).toLocaleString()}</div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-gray-500 block mb-1">Status</label>
                  <div className="flex items-center gap-3">
                    <select value={selected.status} onChange={(e)=>updateStatus(selected._id, e.target.value)} className="rounded-md border border-gray-300 px-3 py-2">
                      {['pending','confirmed','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="text-xs text-gray-500">Changes save instantly</span>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-gray-500 block mb-1">Payment Method for Receipt</label>
                  <div className="flex items-center gap-3 mb-3">
                    <select 
                      value={receiptForm.paymentMethod} 
                      onChange={(e)=>setReceiptForm({...receiptForm, paymentMethod: e.target.value})} 
                      className="rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                      <option value="online">Online</option>
                    </select>
                    <input 
                      className="rounded-md border border-gray-300 px-3 py-2 flex-1" 
                      placeholder="Notes (optional)" 
                      value={receiptForm.notes} 
                      onChange={(e)=>setReceiptForm({...receiptForm, notes: e.target.value})}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button className="btn-outline text-xs sm:text-sm" onClick={()=>window.open(`mailto:${selected.email}?subject=Your%20appointment%20at%20Inspiration%20Saloon&body=Hi%20${encodeURIComponent(selected.name)},%0D%0A%0D%0AYour%20${encodeURIComponent(selected.service)}%20on%20${encodeURIComponent(selected.preferredDate)}%20at%20${encodeURIComponent(selected.preferredTime)}.%0D%0A%0D%0AThanks!`,'_blank')}>Email</button>
                    <a className="btn-outline text-xs sm:text-sm" href={`https://wa.me/${selected.phone.replace(/\D/g,'')}?text=${encodeURIComponent('Hello '+selected.name+', your appointment is scheduled at Inspiration Saloon on '+selected.preferredDate+' '+selected.preferredTime+'.')}`} target="_blank" rel="noreferrer">WhatsApp</a>
                    <button className="btn-primary text-xs sm:text-sm" onClick={()=>updateService(selected._id, { paid: true })}>Mark Paid</button>
                    <button className="btn-primary text-xs sm:text-sm" onClick={()=>generateReceipt(selected._id)}>Generate Receipt</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReceipt && (
          <div className="fixed inset-0 z-50">
            <div className="modal-backdrop absolute inset-0" onClick={()=>setSelectedReceipt(null)} />
            <div className="modal-content absolute inset-x-4 top-4 sm:inset-x-0 sm:top-20 mx-auto w-auto sm:w-[95%] max-w-2xl card p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold">Receipt Details</h2>
                <button className="btn-outline" onClick={()=>setSelectedReceipt(null)}>Close</button>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Receipt Number</div>
                  <div className="font-medium font-mono">{selectedReceipt.receiptNumber}</div>
                </div>
                <div>
                  <div className="text-gray-500">Generated Date</div>
                  <div className="font-medium">{new Date(selectedReceipt.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Client Name</div>
                  <div className="font-medium">{selectedReceipt.clientName}</div>
                </div>
                <div>
                  <div className="text-gray-500">Phone</div>
                  <div className="font-medium">{selectedReceipt.clientPhone}</div>
                </div>
                <div>
                  <div className="text-gray-500">Email</div>
                  <div className="font-medium">{selectedReceipt.clientEmail || '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Service</div>
                  <div className="font-medium">{selectedReceipt.serviceName}</div>
                </div>
                <div>
                  <div className="text-gray-500">Appointment Date</div>
                  <div className="font-medium">{selectedReceipt.appointmentDate}</div>
                </div>
                <div>
                  <div className="text-gray-500">Appointment Time</div>
                  <div className="font-medium">{selectedReceipt.appointmentTime}</div>
                </div>
                <div>
                  <div className="text-gray-500">Amount</div>
                  <div className="font-medium text-lg">₹{selectedReceipt.servicePrice}</div>
                </div>
                <div>
                  <div className="text-gray-500">Payment Method</div>
                  <div className="font-medium">{selectedReceipt.paymentMethod.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Payment Status</div>
                  <div className="font-medium">
                    <span className={`px-2 py-1 rounded text-xs ${
                      selectedReceipt.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      selectedReceipt.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedReceipt.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
                {selectedReceipt.notes && (
                  <div className="sm:col-span-2">
                    <div className="text-gray-500">Notes</div>
                    <div className="font-medium">{selectedReceipt.notes}</div>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label className="text-gray-500 block mb-1">Payment Status</label>
                  <div className="flex items-center gap-3">
                    <select 
                      value={selectedReceipt.paymentStatus} 
                      onChange={(e)=>updateReceipt(selectedReceipt._id, { paymentStatus: e.target.value })} 
                      className="rounded-md border border-gray-300 px-3 py-2"
                    >
                      {['paid','pending','refunded'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="text-xs text-gray-500">Changes save instantly</span>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button className="btn-primary text-xs sm:text-sm" onClick={()=>printReceipt(selectedReceipt)}>Print Receipt</button>
                    <button className="btn-outline text-xs sm:text-sm" onClick={()=>deleteReceipt(selectedReceipt._id)}>Delete Receipt</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer className="mt-auto bg-gray-900 text-gray-300">
        <div className="footer-accent" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 grid place-items-center rounded-full border border-gray-600 bg-gray-800">
                  <span className="font-bold text-gray-300 text-sm">I·H·S</span>
                </div>
                <div>
                  <div className="font-semibold text-white">
                    <span className="text-brand">Inspiration</span> Saloon
                  </div>
                  <div className="text-xs text-gray-400">Admin Portal</div>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Manage appointments, services, receipts, and more for Inspiration Saloon.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Access</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-gray-400">Appointments</span></li>
                <li><span className="text-gray-400">Services Management</span></li>
                <li><span className="text-gray-400">Receipt System</span></li>
                <li><span className="text-gray-400">Gallery & Makeovers</span></li>
                <li><span className="text-gray-400">Customer Messages</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">System Info</h4>
              <div className="text-sm text-gray-400 space-y-1">
                <div>Built with React + Vite + Tailwind</div>
                <div>Node.js + Express + MongoDB</div>
                <div>Admin Portal v1.0</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
            <div className="text-gray-400">
              © {new Date().getFullYear()} Inspiration Saloon. All rights reserved.
            </div>
            <div className="text-gray-400">
              Admin Portal — Secure Access Only
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

