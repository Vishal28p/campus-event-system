import { Link, NavLink, useLocation } from 'react-router-dom'
import { CalendarDays, UserSquare2, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const loc = useLocation()
  const tabs = [
    { to: '/student', label: 'Student Portal', icon: UserSquare2 },
    { to: '/admin', label: 'Admin Dashboard', icon: Shield },
  ]

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-indigo-500" />
          <span className="font-semibold">Campus Events</span>
        </Link>
        <nav className="flex items-center gap-2">
          {tabs.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => 
              `relative px-3 py-2 rounded-xl transition ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}>
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm md:text-base">{label}</span>
                  </div>
                  {isActive && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 -z-10 bg-indigo-50 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
