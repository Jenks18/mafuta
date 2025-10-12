import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Emergency fallback to test if basic React works
const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 max-w-md shadow-2xl text-center">
        <div className="text-6xl mb-4">⛽</div>
        <h1 className="text-4xl font-bold text-emerald-700 mb-2">Mafuta</h1>
        <p className="text-emerald-600 mb-4">Loading...</p>
        <div className="text-sm text-gray-600">
          <p>Environment Check:</p>
          <pre className="bg-gray-100 p-2 rounded mt-2 text-left text-xs">
            {JSON.stringify({
              hasClerkKey: !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
              hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
              hasMapboxToken: !!import.meta.env.VITE_MAPBOX_TOKEN,
              mode: import.meta.env.MODE
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
