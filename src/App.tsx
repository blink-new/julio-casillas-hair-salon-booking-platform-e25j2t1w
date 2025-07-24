import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { blink } from './blink/client'
import { Toaster } from './components/ui/sonner'

// Pages
import HomePage from './pages/HomePage'
import BookingPage from './pages/BookingPage'
import ClientPortalPage from './pages/ClientPortalPage'

// Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import LoadingScreen from './components/ui/LoadingScreen'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Header user={user} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/portal" element={<ClientPortalPage user={user} />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  )
}

export default App