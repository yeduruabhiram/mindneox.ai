import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useUser } from '@clerk/clerk-react'
import { Flag, Send, X } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export default function ReportPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user, isLoaded } = useUser()
  const [type, setType] = useState('bug')
  const [description, setDescription] = useState('')
  const [includeContext, setIncludeContext] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // If the page was opened from Chatbot with messages, prefill description with last messages
    if (state && state.messages && state.messages.length > 0) {
      const last = state.messages.slice(-6).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')
      setDescription(prev => `

--- Context (last messages) ---\n${last}\n\n`)
    }
  }, [state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const payload = {
        type,
        description,
        user_id: user?.id || undefined,
        clerk_user_id: user?.id || undefined,
        user_email: user?.primaryEmailAddress?.emailAddress || undefined,
        session_id: state?.session_id || undefined,
        metadata: {
          source_page: state?.source || null,
          include_context: includeContext,
        }
      }

      const res = await axios.post(`${API_BASE}/api/report`, payload)
      if (res.data && res.data.status === 'success') {
        // Show success message
        setSuccess(true)
        // Navigate back after 2 seconds
        setTimeout(() => {
          navigate(-1)
        }, 2000)
      } else {
        setError('Failed to submit report')
      }
    } catch (err) {
      console.error('Report submit error', err)
      setError(err?.response?.data?.detail || err.message || 'Unknown error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pt-24 px-6 max-w-3xl mx-auto">
      <div className="glass-card p-6 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Flag className="w-5 h-5 text-neon-magenta" />
            Report a bug or send feedback
          </h2>
          <button onClick={() => navigate(-1)} className="p-2 rounded hover:bg-white/5">
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/60">Type</label>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => setType('bug')} className={`px-3 py-2 rounded-lg ${type==='bug' ? 'bg-neon-magenta/20 border border-neon-magenta/40' : 'bg-white/5'}`}>
                Bug
              </button>
              <button type="button" onClick={() => setType('feedback')} className={`px-3 py-2 rounded-lg ${type==='feedback' ? 'bg-neon-magenta/20 border border-neon-magenta/40' : 'bg-white/5'}`}>
                Feedback
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-white/60">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={8} className="w-full mt-2 p-3 bg-transparent border border-white/10 rounded-lg text-white/90 placeholder-white/40" placeholder="Describe the issue or feedback in detail..."></textarea>
          </div>

          <div className="flex items-center gap-3">
            <input id="includeContext" type="checkbox" checked={includeContext} onChange={() => setIncludeContext(v => !v)} className="w-4 h-4" />
            <label htmlFor="includeContext" className="text-sm text-white/60">Include recent chat context</label>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-400">
              ✅ Report submitted successfully! Stored in Firestore. Redirecting...
            </div>
          )}

          <div className="flex items-center gap-3">
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-magenta/70 hover:brightness-110">
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : 'Send Report'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg bg-white/5">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
