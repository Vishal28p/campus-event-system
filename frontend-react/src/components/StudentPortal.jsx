import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, Search, Filter, User, Sparkles } from 'lucide-react'

export default function StudentPortal() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [studentId, setStudentId] = useState('')
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  async function load() {
    setLoading(true); setError('')
    try {
      const data = await api.getEvents()
      setEvents(Array.isArray(data) ? data : (data.events || []))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const types = useMemo(() => {
    return Array.from(new Set(events.map(e => e.type || e.category).filter(Boolean)))
  }, [events])

  const filtered = useMemo(() => {
    return events.filter(e => {
      const matchesQuery = (e.name || '').toLowerCase().includes(query.toLowerCase()) || (e.description || '').toLowerCase().includes(query.toLowerCase())
      const matchesType = typeFilter ? ((e.type || e.category) === typeFilter) : true
      return matchesQuery && matchesType
    })
  }, [events, query, typeFilter])

  async function handleRegister(evId) {
    if (!studentId.trim()) { alert('Enter your Student ID first.'); return }
    try {
      setLoading(true); setError('')
      const res = await api.register({ student_id: studentId.trim(), event_id: evId })
      alert('Registered successfully!')
    } catch (e) {
      alert('Registration failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  async function viewMyParticipation() {
    if (!studentId.trim()) { alert('Enter your Student ID first.'); return }
    try {
      setLoading(true); setError('')
      const data = await api.studentReport(studentId.trim())
      alert(JSON.stringify(data, null, 2))
    } catch (e) {
      alert('Could not fetch your report: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1">
            <h2 className="section-title flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" /> Student Portal
            </h2>
            <p className="text-gray-600">Browse campus events, register, and view your participation.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="pl-9 pr-3 py-2 rounded-xl border bg-white"
                placeholder="Student ID"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
              />
            </div>
            <button onClick={viewMyParticipation} className="btn bg-indigo-600 text-white">My Participation</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="pl-9 pr-3 py-2 w-full rounded-xl border" placeholder="Search events" value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select className="pl-9 pr-3 py-2 rounded-xl border bg-white" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="">All types</option>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <button onClick={load} className="btn bg-white border">Refresh</button>
        </div>

        {loading && <div className="flex items-center gap-2 text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
        {error && <div className="text-red-600">Error: {error}</div>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(ev => (
            <motion.div key={ev.id || ev.event_id} 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{ev.name || ev.title}</h3>
                  <p className="text-gray-500 text-sm">{(ev.type || ev.category) ?? 'General'}</p>
                </div>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">{ev.date || ev.event_date || 'TBA'}</span>
              </div>
              <p className="mt-2 text-gray-700 text-sm">{ev.description || 'No description'}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">Venue: {ev.venue || '—'}</span>
                <button onClick={() => handleRegister(ev.id || ev.event_id)} className="btn bg-indigo-600 text-white text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Register
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {!loading && filtered.length === 0 && <div className="text-gray-600">No events found.</div>}
      </div>
    </div>
  )
}
