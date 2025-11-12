import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Activity,
  MessageSquare,
  Bot,
  TrendingUp,
  Database,
  Zap,
  Clock,
  Users,
} from 'lucide-react'

export default function DashboardPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const stats = [
    { label: 'Total Conversations', value: '1,234', change: '+12.5%', icon: MessageSquare, color: 'from-neon-cyan to-blue-500' },
    { label: 'Active Agents', value: '8', change: '+2', icon: Bot, color: 'from-neon-violet to-purple-500' },
    { label: 'API Calls', value: '45.2K', change: '+18.3%', icon: Activity, color: 'from-neon-magenta to-pink-500' },
    { label: 'Avg Response Time', value: '23ms', change: '-5ms', icon: Clock, color: 'from-cyan-500 to-teal-500' },
  ]

  const recentActivity = [
    { time: '2 min ago', action: 'New conversation started', user: 'user_123', type: 'chat' },
    { time: '5 min ago', action: 'Agent deployed successfully', user: 'admin', type: 'agent' },
    { time: '12 min ago', action: 'Plugin installed: LangGraph Flow', user: 'user_456', type: 'plugin' },
    { time: '18 min ago', action: 'API key regenerated', user: 'admin', type: 'security' },
    { time: '25 min ago', action: 'Database backup completed', user: 'system', type: 'system' },
  ]

  const topPlugins = [
    { name: 'LangGraph Flow Engine', installs: 1200, rating: 4.9 },
    { name: 'Pinecone Memory Sync', installs: 980, rating: 4.8 },
    { name: 'Neural Voice Agent', installs: 750, rating: 4.7 },
    { name: 'AutoFlow Orchestrator', installs: 650, rating: 4.9 },
  ]

  return (
    <div className="relative pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-space font-bold mb-4">
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-xl text-white/70">
            Monitor your AI ecosystem in real-time
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.3 + index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10,
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                onMouseMove={handleMouseMove}
                className="glass-card p-6 relative overflow-hidden group cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 180, 255, 0.15), transparent 50%)`,
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div 
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-3`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      <Icon className="w-full h-full text-white" />
                    </motion.div>
                    <div className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-400' : 'text-blue-400'}`}>
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-3xl font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
            whileHover={{ scale: 1.01 }}
            onMouseMove={handleMouseMove}
            className="glass-card p-6 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 180, 255, 0.1), transparent 60%)`,
              }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-neon-cyan" />
                <h2 className="text-2xl font-space font-bold text-white">
                  Recent Activity
                </h2>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ 
                      x: 5,
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      transition: { duration: 0.2 }
                    }}
                    className="flex items-start gap-3 glass-card p-4 transition-colors cursor-pointer"
                  >
                    <div className="w-2 h-2 rounded-full bg-neon-cyan mt-2" />
                    <div className="flex-1">
                      <p className="text-white text-sm mb-1">{activity.action}</p>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded bg-white/5 text-xs text-white/70 capitalize">
                      {activity.type}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top Plugins */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
            whileHover={{ scale: 1.01 }}
            onMouseMove={handleMouseMove}
            className="glass-card p-6 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(125, 79, 255, 0.1), transparent 60%)`,
              }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-neon-violet" />
                <h2 className="text-2xl font-space font-bold text-white">
                  Top Plugins
                </h2>
              </div>
              <div className="space-y-4">
                {topPlugins.map((plugin, index) => (
                  <motion.div
                    key={plugin.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ 
                      x: -5,
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      transition: { duration: 0.2 }
                    }}
                    className="glass-card p-4 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{plugin.name}</h3>
                      <div className="flex items-center gap-1 text-neon-cyan text-sm">
                        <span>★</span>
                        <span>{plugin.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span>{plugin.installs.toLocaleString()} installs</span>
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(plugin.installs / 1200) * 100}%` }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-neon-cyan to-neon-violet"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-card p-8"
        >
          <h2 className="text-2xl font-space font-bold gradient-text mb-6">
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-8 h-8 text-neon-cyan" />
                <div>
                  <h3 className="text-white font-semibold">Firebase</h3>
                  <p className="text-sm text-white/60">Connected</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Uptime:</span>
                <span className="text-neon-cyan font-semibold">99.9%</span>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-neon-violet" />
                <div>
                  <h3 className="text-white font-semibold">Pinecone</h3>
                  <p className="text-sm text-white/60">Connected</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Vectors:</span>
                <span className="text-neon-violet font-semibold">14</span>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-8 h-8 text-neon-magenta" />
                <div>
                  <h3 className="text-white font-semibold">AI Model</h3>
                  <p className="text-sm text-white/60">Running</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Load:</span>
                <span className="text-neon-magenta font-semibold">GPU</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
