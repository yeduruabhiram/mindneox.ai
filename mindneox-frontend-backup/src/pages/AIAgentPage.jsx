import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bot,
  Zap,
  Brain,
  Code,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Database,
  Cpu,
} from 'lucide-react'

export default function AIAgentPage() {
  const [activeAgent, setActiveAgent] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const agents = [
    {
      id: 1,
      name: 'Research Agent',
      description: 'Autonomous research assistant that gathers and analyzes information',
      icon: Brain,
      color: 'from-neon-cyan to-blue-500',
      status: 'idle',
      tasks: 0,
      uptime: '0h 0m',
    },
    {
      id: 2,
      name: 'Code Assistant',
      description: 'AI-powered coding companion for development tasks',
      icon: Code,
      color: 'from-neon-violet to-purple-500',
      status: 'idle',
      tasks: 0,
      uptime: '0h 0m',
    },
    {
      id: 3,
      name: 'Workflow Automator',
      description: 'Automates repetitive tasks and optimizes workflows',
      icon: Zap,
      color: 'from-neon-magenta to-pink-500',
      status: 'idle',
      tasks: 0,
      uptime: '0h 0m',
    },
  ]

  const metrics = [
    { label: 'Tasks Completed', value: '0', icon: Activity, color: 'text-neon-cyan' },
    { label: 'Active Agents', value: '0', icon: Bot, color: 'text-neon-violet' },
    { label: 'CPU Usage', value: '0%', icon: Cpu, color: 'text-neon-magenta' },
    { label: 'Memory Used', value: '0 MB', icon: Database, color: 'text-cyan-500' },
  ]

  return (
    <div className="relative pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-space font-bold mb-4">
            <span className="gradient-text">AI Agent Studio</span>
          </h1>
          <p className="text-xl text-white/70">
            Deploy and manage autonomous AI agents
          </p>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={metric.label}
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
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 180, 255, 0.15), transparent 50%)`,
                  }}
                />
                <div className="relative z-10">
                  <Icon className={`w-8 h-8 ${metric.color} mb-3`} />
                  <div className="text-3xl font-bold gradient-text mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-white/60">{metric.label}</div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Agents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {agents.map((agent, index) => {
            const Icon = agent.icon
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.5 + index * 0.1,
                  type: "spring",
                  stiffness: 80
                }}
                whileHover={{ 
                  y: -15,
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                onMouseMove={handleMouseMove}
                className="glass-card group relative overflow-hidden cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(125, 79, 255, 0.2), transparent 50%)`,
                  }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${agent.color} p-4 mb-4`}
                    whileHover={{ 
                      scale: 1.15,
                      rotate: [0, -5, 5, -5, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    <Icon className="w-full h-full text-white" />
                  </motion.div>

                  <h3 className="text-xl font-space font-semibold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-white/70 text-sm mb-4 leading-relaxed">
                    {agent.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Status:</span>
                      <span className="text-neon-cyan capitalize">{agent.status}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Tasks:</span>
                      <span className="text-white">{agent.tasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Uptime:</span>
                      <span className="text-white">{agent.uptime}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 glass-card py-2 text-sm font-semibold text-neon-cyan transition-transform flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass-card px-3 py-2 transition-transform"
                    >
                      <Settings className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Agent Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: "spring" }}
          whileHover={{ scale: 1.01 }}
          onMouseMove={handleMouseMove}
          className="mt-12 glass-card p-8 relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 180, 255, 0.1), transparent 60%)`,
            }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-space font-bold gradient-text mb-6">
              Agent Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 mb-2 text-sm">Agent Type</label>
                <select className="w-full glass-card px-4 py-3 text-white bg-transparent outline-none hover:bg-white/5 transition-colors">
                  <option className="bg-dark-800">Research Agent</option>
                  <option className="bg-dark-800">Code Assistant</option>
                  <option className="bg-dark-800">Workflow Automator</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 mb-2 text-sm">Model</label>
                <select className="w-full glass-card px-4 py-3 text-white bg-transparent outline-none hover:bg-white/5 transition-colors">
                  <option className="bg-dark-800">Mistral-7B</option>
                  <option className="bg-dark-800">GPT-4</option>
                  <option className="bg-dark-800">Claude-3</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 mb-2 text-sm">Temperature</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.7"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2 text-sm">Max Tokens</label>
                <input
                  type="number"
                  defaultValue="500"
                  className="w-full glass-card px-4 py-3 text-white bg-transparent outline-none hover:bg-white/5 transition-colors"
                />
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 glass-card px-8 py-3 text-lg font-semibold gradient-text neon-glow-hover"
            >
              Deploy Agent
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
