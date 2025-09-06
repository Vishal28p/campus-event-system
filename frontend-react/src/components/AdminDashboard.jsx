import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Filter, Medal, PieChart as PieIcon, Loader2 } from 'lucide-react'

export default function AdminDashboard() {
  const [popularity, setPopularity] = useState([])
  const [topStudents, setTopStudents] = useState([])
  const [eventsByType, setEventsByType] = useState([])
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadAll() {
    setLoading(true); setError('')
  }
  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true); setError('')
        const [pop, top] = await Promise.all([api.popularity(), api.topActive(3)])
        setPopularity(Array.isArray(pop) ? pop : (pop.data || pop.events || []))
        setTopStudents(Array.isArray(top) ? top : (top.data || []))
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function applyTypeFilter(t) {
    setType(t)
    if (!t) { setEventsByType([]); return }
    try {
      setLoading(true); setError('')
      const data = await api.getEventsByType(t)
      setEventsByType(Array.isArray(data) ? data : (data.events || data.data || []))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const chartData = useMemo(() => {
    // Expecting format like [{ event_name, registrations }]
    return (popularity || []).map((p, i) => ({
      name: p.event_name || p.name || p.title || `Event ${i+1}`,
      registrations: Number(p.registrations || p.count || p.total || 0),
    }))
  }, [popularity])

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="section-title flex items-center gap-2">
          <PieIcon className="w-5 h-5 text-indigo-500" /> Admin Dashboard
        </h2>
        <p className="text-gray-600">Monitor event popularity, top active students, and filter events by type.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Event Popularity</h3>
          </div>
          {loading && <div className="flex items-center gap-2 text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
          {error && <div className="text-red-600">Error: {error}</div>}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="registrations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Medal className="w-5 h-5 text-amber-500" /> Top 3 Active Students
          </h3>
          <ul className="space-y-2">
            {topStudents.slice(0,3).map((s, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span className="text-gray-700">{s.student_id || s.name || `Student ${idx+1}`}</span>
                <span className="text-sm bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                  {(s.count || s.registrations || s.events || 0)} regs
                </span>
              </li>
            ))}
            {topStudents.length === 0 && <li className="text-gray-600">No data.</li>}
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <h3 className="font-semibold">Filter Events by Type</h3>
        </div>
        <div className="flex gap-2 mb-4">
          <input className="border rounded-xl px-3 py-2" placeholder="e.g. Workshop, Sports" value={type} onChange={e => setType(e.target.value)} />
          <button className="btn bg-white border" onClick={() => applyTypeFilter(type)}>Apply</button>
          <button className="btn bg-white border" onClick={() => applyTypeFilter('')}>Clear</button>
        </div>
        {loading && <div className="flex items-center gap-2 text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
        {error && <div className="text-red-600">Error: {error}</div>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventsByType.map((ev, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">{ev.name || ev.title}</h4>
                  <p className="text-gray-500 text-sm">{(ev.type || ev.category) ?? 'General'}</p>
                </div>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">{ev.date || ev.event_date || 'TBA'}</span>
              </div>
              <p className="mt-2 text-gray-700 text-sm">{ev.description || 'No description'}</p>
            </motion.div>
          ))}
        </div>
        {eventsByType.length === 0 && <div className="text-gray-600">No events to display.</div>}
      </div>
    </div>
  )
}
