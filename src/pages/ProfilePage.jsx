import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain,
  MessageSquare, 
  Download, 
  Trash2, 
  Search,
  Clock,
  Tag,
  Calendar,
  ChevronDown,
  Database,
  Mic,
  Zap,
  Settings,
  Bot,
  Palette,
  Cpu,
  Bell,
  LogOut,
  Edit3,
  History,
  Sparkles
} from 'lucide-react'
import axios from 'axios'

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [conversations, setConversations] = useState([])
  const [keywords, setKeywords] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedConv, setExpandedConv] = useState(null)
  const [theme, setTheme] = useState('dark')
  const [selectedModel, setSelectedModel] = useState('mindneox-v1')
  const [notifications, setNotifications] = useState(true)
  const [dataSync, setDataSync] = useState(true)
  const [stats, setStats] = useState({
    totalConversations: 0,
    topInterests: [],
    cognitiveScore: 85,
    memoryUsed: 62,
    voiceInteractions: 247,
    automations: 12
  })

  const agents = [
    {
      id: 1,
      name: 'Neo',
      role: 'Analyst',
      color: 'from-blue-500 to-cyan-500',
      status: 'active',
      description: 'Data analysis & insights'
    },
    {
      id: 2,
      name: 'Luna',
      role: 'Creative',
      color: 'from-pink-500 to-rose-500',
      status: 'active',
      description: 'Content & design generation'
    },
    {
      id: 3,
      name: 'Orion',
      role: 'Developer',
      color: 'from-purple-500 to-violet-500',
      status: 'idle',
      description: 'Code generation & debugging'
    },
    {
      id: 4,
      name: 'Echo',
      role: 'Voice',
      color: 'from-cyan-500 to-teal-500',
      status: 'active',
      description: 'Voice assistant & commands'
    }
  ]

  const models = [
    { id: 'mindneox-v1', name: 'MindNeox-v1', desc: 'Latest neural model' },
    { id: 'mistral', name: 'Mistral 7B', desc: 'Fast & efficient' },
    { id: 'gemma', name: 'Gemma 2B', desc: 'Lightweight option' }
  ]

  useEffect(() => {
    if (isLoaded && user) {
      loadUserData()
    }
  }, [isLoaded, user])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      const historyRes = await axios.get(`/api/user/${user.id}/history?limit=50`)
      setConversations(historyRes.data.history || [])
      
      const contextRes = await axios.get(`/api/user/${user.id}/context`)
      setKeywords(contextRes.data.top_keywords || [])
      setStats({
        ...stats,
        totalConversations: contextRes.data.total_conversations || 0,
        topInterests: contextRes.data.top_keywords?.slice(0, 3) || []
      })
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearHistory = async () => {
    if (window.confirm('Clear all conversations? This cant be undone!')) {
      try {
        await axios.delete(`/api/user/${user.id}/history`)
        setConversations([])
        setKeywords([])
        setStats({ ...stats, totalConversations: 0, topInterests: [] })
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  const downloadHistory = () => {
    const data = JSON.stringify(conversations, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mindneox-conversations-${Date.now()}.json`
    link.click()
  }

  const filtered = conversations.filter(c => 
    c.user_message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.assistant_response?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-white/70 text-lg font-space">Loading Neural Profile...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <motion.div 
          className="text-center max-w-md relative z-10 glass-card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Brain className="w-20 h-20 text-neon-cyan mx-auto mb-4" />
          <h2 className="text-3xl font-space font-bold gradient-text mb-2">Sign In Required</h2>
          <p className="text-white/60">You need to sign in to access your neural profile</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
      
      {/* Particle Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan/20 rounded-full"
            animate={{
              x: [Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
              y: [Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000), Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section - User Intelligence Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-10 mb-6 relative overflow-hidden"
        >
          {/* Breathing Glow Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-magenta/10 to-neon-cyan/10"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          <div className="relative flex flex-col md:flex-row items-center gap-6">
            {/* Holographic Avatar */}
            <div className="relative">
              {/* Pulsing Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-neon-cyan/50"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              
              {/* Avatar Container */}
              <motion.div
                className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-neon-cyan/30 shadow-2xl shadow-neon-cyan/50"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0, 180, 255, 0.5)',
                    '0 0 40px rgba(255, 0, 200, 0.5)',
                    '0 0 20px rgba(0, 180, 255, 0.5)'
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
                    <Brain className="w-14 h-14 text-white" />
                  </div>
                )}
              </motion.div>

              {/* Holographic Ring */}
              <motion.div
                className="absolute -inset-2 rounded-full border border-neon-magenta/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <motion.h1
                className="text-3xl md:text-4xl font-space font-bold mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Welcome, <span className="gradient-text">
                  {user?.firstName || user?.username || 'User'}
                </span>
              </motion.h1>
              
              <motion.p
                className="text-lg text-neon-cyan mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Your Neural Profile Is Active
              </motion.p>

              <motion.p
                className="text-sm text-white/50 mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                {user?.primaryEmailAddress?.emailAddress}
              </motion.p>

              {/* Stats Pills */}
              <motion.div
                className="flex flex-wrap gap-2 justify-center md:justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="glass-card px-3 py-1.5 text-xs border border-neon-cyan/20">
                  <MessageSquare className="inline w-3 h-3 mr-1 text-neon-cyan" />
                  <span className="text-white/60">Chats:</span>{' '}
                  <span className="text-neon-cyan font-semibold">{stats.totalConversations}</span>
                </div>
                <div className="glass-card px-3 py-1.5 text-xs border border-neon-magenta/20">
                  <Tag className="inline w-3 h-3 mr-1 text-neon-magenta" />
                  <span className="text-white/60">Topics:</span>{' '}
                  <span className="text-neon-magenta font-semibold">{keywords.length}</span>
                </div>
                <div className="glass-card px-3 py-1.5 text-xs border border-white/10">
                  <Calendar className="inline w-3 h-3 mr-1 text-white/60" />
                  <span className="text-white/60">Since:</span>{' '}
                  <span className="text-white/90 font-semibold">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadHistory}
                className="glass-card px-4 py-2 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-all flex items-center gap-2 group"
              >
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                <span className="hidden sm:inline">Export</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearHistory}
                className="glass-card px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2 group"
              >
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Clear</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar - Topics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-5 sticky top-24">
              <h3 className="text-lg font-space font-bold mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-neon-magenta" />
                <span className="gradient-text">Topics</span>
              </h3>
              
              {keywords.length > 0 ? (
                <div className="space-y-2">
                  {keywords.slice(0, 15).map((kw, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-2.5 rounded-lg glass-card border border-white/5 hover:border-neon-magenta/30 transition-all cursor-pointer group"
                    >
                      <span className="text-white/80 text-sm group-hover:text-white transition-colors">{kw.keyword}</span>
                      <span className="text-xs px-2 py-0.5 bg-neon-magenta/20 text-neon-magenta rounded-full font-medium border border-neon-magenta/30">
                        {kw.frequency}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">Start chatting to track your interests!</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Content - Conversation History (ChatGPT Style) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            {/* Search Bar */}
            <div className="glass-card p-4 mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-cyan" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan/50 transition-all"
                />
              </div>
            </div>

            {/* Conversation History Header */}
            <div className="glass-card p-4 mb-4 flex items-center justify-between">
              <h3 className="text-xl font-space font-bold flex items-center gap-3">
                <History className="w-6 h-6 text-neon-cyan" />
                <span className="gradient-text">Conversation History</span>
                <span className="text-sm text-white/40 font-normal">({filtered.length})</span>
              </h3>
            </div>

            {/* Conversation List - ChatGPT Style */}
            <div className="space-y-3">
              {filtered.length > 0 ? (
                filtered.map((conv, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="glass-card border border-white/10 hover:border-neon-cyan/30 overflow-hidden transition-all group"
                  >
                    <button
                      onClick={() => setExpandedConv(expandedConv === i ? null : i)}
                      className="w-full p-4 flex items-start gap-4 hover:bg-white/5 transition-all text-left"
                    >
                      {/* Message Icon */}
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 border border-neon-cyan/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-5 h-5 text-neon-cyan" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium mb-2 line-clamp-2 group-hover:text-neon-cyan transition-colors">
                          {conv.user_message}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-white/40">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(conv.timestamp * 1000).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <span className="text-neon-cyan/60">•</span>
                          <span className="text-white/50">MindNeox AI</span>
                        </div>
                      </div>

                      <ChevronDown 
                        className={`w-5 h-5 text-white/40 group-hover:text-neon-cyan transition-all flex-shrink-0 mt-2 ${
                          expandedConv === i ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Expanded Content - ChatGPT Style */}
                    <AnimatePresence>
                      {expandedConv === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-white/10 overflow-hidden"
                        >
                          <div className="p-5 space-y-4 bg-white/5">
                            {/* User Message */}
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                                {user?.imageUrl ? (
                                  <img src={user.imageUrl} alt="You" className="w-full h-full rounded-lg object-cover" />
                                ) : (
                                  <span className="text-xs font-bold text-blue-400">You</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="text-xs text-blue-400 font-semibold mb-2 flex items-center gap-2">
                                  <span>You</span>
                                  <span className="text-white/30">•</span>
                                  <span className="text-white/40 font-normal">asked</span>
                                </div>
                                <div className="glass-card p-4 border border-blue-500/20 rounded-lg">
                                  <p className="text-white/90 text-sm leading-relaxed">
                                    {conv.user_message}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* AI Response */}
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center flex-shrink-0">
                                <Brain className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs text-neon-magenta font-semibold mb-2 flex items-center gap-2">
                                  <span>MindNeox AI</span>
                                  <span className="text-white/30">•</span>
                                  <span className="text-white/40 font-normal">replied</span>
                                </div>
                                <div className="glass-card p-4 border border-neon-magenta/20 rounded-lg">
                                  <p className="text-white/80 text-sm leading-relaxed">
                                    {conv.assistant_response}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-12 text-center"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                      scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                    }}
                  >
                    <MessageSquare className="w-16 h-16 text-neon-cyan/30 mx-auto mb-4" />
                  </motion.div>
                  <h4 className="text-xl font-space font-bold text-white/70 mb-2">
                    {searchTerm ? 'No Matching Conversations' : 'No Conversations Yet'}
                  </h4>
                  <p className="text-white/40 text-sm">
                    {searchTerm 
                      ? 'Try a different search term' 
                      : 'Start chatting with MindNeox AI to see your history here!'}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
