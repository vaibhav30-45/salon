import { useEffect, useState } from 'react'

export default function Admin() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '')
  const [creds, setCreds] = useState({ username: '', password: '' })

  async function load() {
    try {
      const res = await fetch('/api/admin/appointments', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (res.ok) setItems(data)
      else throw new Error(data.error || 'Failed to load appointments')
    } catch (e) {
      setError(e.message || 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (token) load() }, [token])

  async function login(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: creds.username.trim(), password: creds.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      localStorage.setItem('admin_token', data.token)
      setToken(data.token)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('admin_token')
    setToken('')
    setItems([])
    setError('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold">Admin • Appointments</h1>
      {!token ? (
        <form onSubmit={login} className="mt-6 max-w-sm space-y-3">
          {error && <div className="text-sm text-red-600">{error}</div>}
          <input className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Username" value={creds.username} onChange={(e)=>setCreds({...creds, username:e.target.value})} />
          <input type="password" className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Password" value={creds.password} onChange={(e)=>setCreds({...creds, password:e.target.value})} />
          <button type="submit" disabled={loading} className="rounded-md bg-brand px-4 py-2 text-white">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
      ) : loading ? (
        <p className="mt-4 text-gray-600">Loading...</p>
      ) : error ? (
        <div className="mt-4 flex items-center gap-3">
          <p className="text-red-600">{error}</p>
          <button onClick={logout} className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100">Sign out</button>
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">Signed in</p>
            <div className="flex items-center gap-2">
              <button onClick={()=>{setLoading(true); setError(''); load()}} className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100">Refresh</button>
              <button onClick={logout} className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100">Sign out</button>
            </div>
          </div>
          {items.length === 0 ? (
            <div className="mt-6 rounded-md border border-gray-200 p-6 text-sm text-gray-600">
              No appointments yet. Ask a client to submit the booking form, then click Refresh.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
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
                  </tr>
                </thead>
                <tbody>
                  {items.map(a => (
                    <tr key={a._id} className="border-b border-gray-100">
                      <td className="py-2 pr-4">{a.name}</td>
                      <td className="py-2 pr-4">{a.phone}</td>
                      <td className="py-2 pr-4">{a.email || '-'}</td>
                      <td className="py-2 pr-4">{a.service}</td>
                      <td className="py-2 pr-4">{a.preferredDate}</td>
                      <td className="py-2 pr-4">{a.preferredTime}</td>
                      <td className="py-2 pr-4">{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}


