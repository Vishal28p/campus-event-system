const BASE = '/api' // Vite proxy to http://127.0.0.1:5000

async function http(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

export const api = {
  getEvents: () => http('/events'),
  getEventsByType: (type) => http(`/reports/events?type=${encodeURIComponent(type)}`),
  register: (payload) => http('/register', { method: 'POST', body: JSON.stringify(payload) }),
  studentReport: (id) => http(`/reports/student/${encodeURIComponent(id)}`),
  popularity: () => http('/reports/popularity'),
  topActive: (limit=3) => http(`/reports/top-active?limit=${encodeURIComponent(limit)}`),
}
