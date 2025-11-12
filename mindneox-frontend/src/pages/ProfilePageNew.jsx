import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@clerk/clerk-react'
import {
  Brain,
  MessageSquare,
  Database,
  Mic,
  Settings,
  Zap,
  Activity,
  Clock,
  Edit3,
  Trash2,
  Moon,
  Sun,
  Cpu,
  Shield,
  Bell,
  LogOut,
  ChevronRight,
  Sparkles,
  Bot,
  Palette,
  Code
} from 'lucide-react'

export default function ProfilePageNew() {
  const { user, isLoaded } = useUser()
  const [theme, setTheme] = useState('dark')
  const [selectedModel, setSelectedModel] = useState('mindneox-v1')
  const [notifications, setNotifications] = useState(true)
  const [dataSync, setDataSync] = useState(true)
  const [activeAgent, setActiveAgent] = useState(null)

  // Mock user stats - Replace with real API data
  const stats = {
    cognitiveScore: 85,
    memoryUsed: 62,
    voiceInteractions: 247,
    automations: 12,
    linkedAgents: 4,
    lastSync: '3:24 PM',
    uptime: 99.98
  }

  const agents = [
    {
      id: 1,
      name: 'Neo',
      role: 'Analyst',
      color: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/50',
      status: 'active',
      description: 'Data analysis & insights'
    },
    {
      id: 2,
      name: 'Luna',
      role: 'Creative',
      color: 'from-pink-500 to-rose-500',
      glow: 'shadow-pink-500/50',
      status: 'active',
      description: 'Content & design generation'
    },
    {
      id: 3,
      name: 'Orion',
      role: 'Developer',
      color: 'from-purple-500 to-violet-500',
      glow: 'shadow-purple-500/50',
      status: 'idle',
      description: 'Code generation & debugging'
    },
    {
      id: 4,
      name: 'Echo',
      role: 'Voice',
      color: 'from-cyan-500 to-teal-500',
      glow: 'shadow-cyan-500/50',
      status: 'active',
      description: 'Voice assistant & commands'
    }
  ]

  const models = [
    { id: 'mindneox-v1', name: 'MindNeox-v1', desc: 'Latest neural model' },
    { id: 'mistral', name: 'Mistral 7B', desc: 'Fast & efficient' },
    { id: 'gemma', name: 'Gemma 2B', desc: 'Lightweight option' }
  ]

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
      
      {/* Particle Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan/30 rounded-full"
            animate={{
              x: [Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
              y: [Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000), Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
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
          className="glass-card p-8 md:p-12 mb-8 relative overflow-hidden"
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

          <div className="relative flex flex-col md:flex-row items-center gap-8">
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
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-neon-cyan/30 shadow-2xl shadow-neon-cyan/50"
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
                {isLoaded && user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
                    <Brain className="w-16 h-16 text-white" />
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
                className="text-4xl md:text-5xl font-space font-bold mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Welcome, <span className="gradient-text">
                  {isLoaded ? (user?.firstName || user?.username || 'User') : 'Loading...'}
                </span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-neon-cyan mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Your Neural Profile Is Active
              </motion.p>

              {/* Stats Pills */}
              <motion.div
                className="flex flex-wrap gap-3 justify-center md:justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="glass-card px-4 py-2 text-sm">
                  <span className="text-white/60">Linked Agents:</span>{' '}
                  <span className="text-neon-cyan font-semibold">{stats.linkedAgents}</span>
                </div>
                <div className="glass-card px-4 py-2 text-sm">
                  <span className="text-white/60">Memory Usage:</span>{' '}
                  <span className="text-neon-magenta font-semibold">{stats.memoryUsed}%</span>
                </div>
                <div className="glass-card px-4 py-2 text-sm">
                  <span className="text-white/60">Last Sync:</span>{' '}
                  <span className="text-white/90 font-semibold">{stats.lastSync}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Profile Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Cognitive Score */}
          <StatCard
            icon={Brain}
            title="Cognitive Score"
            value={stats.cognitiveScore}
            unit="/100"
            color="from-blue-500 to-cyan-500"
            delay={0}
          />

          {/* Memory Stored */}
          <StatCard
            icon={Database}
            title="Memory Stored"
            value={stats.memoryUsed}
            unit="%"
            color="from-purple-500 to-pink-500"
            delay={0.1}
          />

          {/* Voice Interactions */}
          <StatCard
            icon={Mic}
            title="Voice Interactions"
            value={stats.voiceInteractions}
            unit=""
            color="from-cyan-500 to-teal-500"
            delay={0.2}
          />

          {/* Automations */}
          <StatCard
            icon={Zap}
            title="Automations Created"
            value={stats.automations}
            unit=""
            color="from-orange-500 to-red-500"
            delay={0.3}
          />
        </motion.div>

        {/* Connected Agents Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-space font-bold mb-6 flex items-center gap-3">
            <Bot className="w-8 h-8 text-neon-cyan" />
            Your Active AI Agents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((agent, index) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                delay={index * 0.1}
                onEdit={() => setActiveAgent(agent)}
                onRemove={() => console.log('Remove', agent.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* System Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 md:p-8 mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-space font-bold mb-6 flex items-center gap-3">
            <Settings className="w-8 h-8 text-neon-magenta" />
            Customize Your OS Experience
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Theme Toggle */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-3">
                <Palette className="inline w-4 h-4 mr-2" />
                Theme Mode
              </label>
              <div className="flex gap-3">
                {['dark', 'light', 'holo'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTheme(mode)}
                    className={`flex-1 glass-card px-4 py-3 rounded-lg transition-all ${
                      theme === mode
                        ? 'border-2 border-neon-cyan bg-neon-cyan/10'
                        : 'border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="capitalize font-medium">{mode}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selector */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-3">
                <Cpu className="inline w-4 h-4 mr-2" />
                AI Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full glass-card px-4 py-3 rounded-lg border border-white/10 focus:border-neon-cyan focus:outline-none transition-all"
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id} className="bg-dark-800">
                    {model.name} - {model.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Toggles */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ToggleSwitch
                icon={Database}
                label="Data Sync"
                description="Firebase & Pinecone"
                checked={dataSync}
                onChange={setDataSync}
              />
              <ToggleSwitch
                icon={Bell}
                label="Notifications"
                description="System alerts & updates"
                checked={notifications}
                onChange={setNotifications}
              />
            </div>
          </div>
        </motion.div>

        {/* Footer Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="text-center md:text-left">
            <p className="text-white/90 font-medium">
              MindNeox.AI v1.0 — Powered by <span className="text-neon-cyan">Mentneo Labs</span>
            </p>
            <p className="text-sm text-white/60">
              Neural Uptime: <span className="text-green-400 font-semibold">{stats.uptime}%</span>
            </p>
          </div>
          
          <button className="glass-card px-6 py-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all flex items-center gap-2 group">
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ icon: Icon, title, value, unit, color, delay }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 2000
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card p-6 relative overflow-hidden group cursor-pointer"
    >
      {/* Gradient Overlay on Hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />
      
      {/* Flare Effect */}
      <motion.div
        className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
      />

      <div className="relative">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <h3 className="text-sm text-white/60 mb-2">{title}</h3>
        
        <div className="flex items-baseline gap-1">
          <motion.span
            className="text-3xl font-bold font-orbitron gradient-text"
            key={count}
          >
            {count}
          </motion.span>
          <span className="text-lg text-white/40">{unit}</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${color}`}
            initial={{ width: 0 }}
            animate={{ width: `${unit === '%' ? value : (value / 100) * 100}%` }}
            transition={{ duration: 2, delay: delay + 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// Agent Card Component
function AgentCard({ agent, delay, onEdit, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ y: -8, scale: 1.03 }}
      className="glass-card p-6 relative overflow-hidden group cursor-pointer"
    >
      {/* Glow Effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
      />
      
      {/* Particle Ripple on Hover */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 0, opacity: 1 }}
        whileHover={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} rounded-full blur-xl`} />
      </motion.div>

      <div className="relative">
        {/* Status Indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-lg ${agent.glow}`}>
            <Bot className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex items-center gap-2">
            <motion.div
              className={`w-2 h-2 rounded-full ${
                agent.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
              }`}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-white/60 capitalize">{agent.status}</span>
          </div>
        </div>

        {/* Agent Info */}
        <h3 className="text-xl font-bold mb-1">{agent.name}</h3>
        <p className="text-sm text-neon-cyan font-medium mb-2">{agent.role}</p>
        <p className="text-xs text-white/60 mb-4">{agent.description}</p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 glass-card px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2 group/btn"
          >
            <Edit3 className="w-4 h-4 group-hover/btn:text-neon-cyan transition-colors" />
            Edit
          </button>
          <button
            onClick={onRemove}
            className="flex-1 glass-card px-3 py-2 rounded-lg text-sm hover:bg-red-500/10 hover:text-red-400 transition-all flex items-center justify-center gap-2 group/btn"
          >
            <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Toggle Switch Component
function ToggleSwitch({ icon: Icon, label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between glass-card p-4 rounded-lg border border-white/10">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
          <Icon className="w-5 h-5 text-neon-cyan" />
        </div>
        <div>
          <h4 className="font-semibold text-white/90">{label}</h4>
          <p className="text-xs text-white/50">{description}</p>
        </div>
      </div>
      
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
          checked ? 'bg-gradient-to-r from-neon-cyan to-neon-magenta' : 'bg-white/20'
        }`}
      >
        <motion.div
          className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg"
          animate={{ x: checked ? 28 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}
