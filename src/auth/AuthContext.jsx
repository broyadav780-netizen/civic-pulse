import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const storageKey = 'civicpulse-citizen'

export function AuthProvider({ children }) {
  const [citizen, setCitizen] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey)) } catch { return null } })
  useEffect(() => { if (citizen) localStorage.setItem(storageKey, JSON.stringify(citizen)); else localStorage.removeItem(storageKey) }, [citizen])
  const value = useMemo(() => ({ citizen, signIn: ({ email, name }) => setCitizen({ id: `CIT-${email.trim().toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'citizen'}`, name: name?.trim() || email.split('@')[0], email: email.trim().toLowerCase() }), signOut: () => setCitizen(null) }), [citizen])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value }
