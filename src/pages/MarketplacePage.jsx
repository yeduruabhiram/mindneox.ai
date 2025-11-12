import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Bot,
  Code,
  Brain,
  Eye,
  Mic,
  Settings,
  GraduationCap,
  Star,
  Download,
  X,
  TrendingUp,
  Sparkles,
  Zap,
} from 'lucide-react'

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPlugin, setSelectedPlugin] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const categories = [
    { id: 'all', name: 'All Plugins', icon: Sparkles },
    { id: 'agents', name: 'Agents', icon: Bot },
    { id: 'dev-tools', name: 'Developer Tools', icon: Code },
    { id: 'memory', name: 'Memory Extensions', icon: Brain },
    { id: 'voice-vision', name: 'Voice & Vision', icon: Eye },
    { id: 'automation', name: 'Automation Workflows', icon: Settings },
    { id: 'education', name: 'Education & Learning', icon: GraduationCap },
  ]

  const plugins = [
    {
      id: 1,
      name: 'LangGraph Flow Engine',
      developer: 'MindNeox Labs',
      category: 'agents',
      rating: 4.9,
      installs: '50K+',
      version: '2.1.0',
      lastUpdated: '2 days ago',
      description: 'Advanced conversational AI agent with multi-turn dialogue and context awareness. Supports complex workflows and integrates seamlessly with LangChain.',
      icon: Bot,
      color: 'from-neon-cyan to-blue-500',
      featured: true,
      trending: true,
      supportedAPIs: ['OpenAI', 'Anthropic', 'Cohere'],
    },
    {
      id: 2,
      name: 'Pinecone Memory Sync',
      developer: 'MindNeox AI',
      category: 'memory',
      rating: 4.8,
      installs: '35K+',
      version: '1.5.2',
      lastUpdated: '1 week ago',
      description: 'Real-time vector database synchronization for persistent memory and semantic search capabilities.',
      icon: Brain,
      color: 'from-neon-violet to-purple-500',
      featured: true,
      supportedAPIs: ['Pinecone', 'Weaviate', 'Milvus'],
    },
    {
      id: 3,
      name: 'Neural Voice Agent',
      developer: 'VoiceAI Inc',
      category: 'voice-vision',
      rating: 4.7,
      installs: '28K+',
      version: '3.0.1',
      lastUpdated: '3 days ago',
      description: 'Text-to-speech and speech-to-text with emotion detection and voice cloning capabilities.',
      icon: Mic,
      color: 'from-neon-magenta to-pink-500',
      trending: true,
      supportedAPIs: ['ElevenLabs', 'Azure Speech', 'Google Cloud'],
    },
    {
      id: 4,
      name: 'AutoFlow Orchestrator',
      developer: 'MindNeox Labs',
      category: 'automation',
      rating: 4.9,
      installs: '42K+',
      version: '1.8.0',
      lastUpdated: '5 days ago',
      description: 'Visual workflow builder for automating complex AI tasks and chaining multiple agents together.',
      icon: Settings,
      color: 'from-cyan-500 to-teal-500',
      featured: true,
      supportedAPIs: ['Zapier', 'Make', 'n8n'],
    },
    {
      id: 5,
      name: 'CodeGen Pro',
      developer: 'DevTools AI',
      category: 'dev-tools',
      rating: 4.6,
      installs: '31K+',
      version: '2.3.1',
      lastUpdated: '1 day ago',
      description: 'AI-powered code generation and refactoring assistant supporting 20+ programming languages.',
      icon: Code,
      color: 'from-purple-500 to-indigo-500',
      trending: true,
      supportedAPIs: ['GitHub Copilot', 'Tabnine', 'CodeWhisperer'],
    },
    {
      id: 6,
      name: 'EduMentor AI',
      developer: 'EduTech Solutions',
      category: 'education',
      rating: 4.8,
      installs: '25K+',
      version: '1.4.0',
      lastUpdated: '1 week ago',
      description: 'Personalized learning assistant with adaptive difficulty and comprehensive curriculum support.',
      icon: GraduationCap,
      color: 'from-pink-500 to-rose-500',
      supportedAPIs: ['OpenAI', 'Anthropic'],
    },
  ]

  const filteredPlugins = plugins.filter((plugin) => {
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPlugins = plugins.filter((p) => p.featured)

  return (
    <div className="relative pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-space font-bold mb-4">
            <span className="gradient-text">MINDNEOX MARKETPLACE</span>
          </h1>
          <p className="text-xl text-white/70">
            The Future of AI Agents, Tools & Plugins
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="glass-card p-2 flex items-center gap-4 max-w-3xl mx-auto">
            <Search className="w-5 h-5 text-neon-cyan ml-2" />
            <input
              type="text"
              placeholder="Search plugins, agents, and tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/50"
            />
            <button className="glass-card px-4 py-2 text-sm font-semibold text-neon-cyan hover:scale-105 transition-transform flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'glass-card border-neon-cyan text-neon-cyan scale-105'
                      : 'glass-card border-white/20 text-white/70 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Featured Section */}
        {selectedCategory === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-space font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-neon-cyan" />
              <span className="gradient-text">Editor's Choice</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPlugins.map((plugin, index) => {
                const Icon = plugin.icon
                return (
                  <motion.div
                    key={plugin.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.5 + index * 0.1,
                      type: "spring",
                      stiffness: 80
                    }}
                    whileHover={{ 
                      y: -10,
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    onClick={() => setSelectedPlugin(plugin)}
                    onMouseMove={handleMouseMove}
                    className="glass-card cursor-pointer relative overflow-hidden group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${plugin.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 180, 255, 0.15), transparent 50%)`,
                      }}
                    />
                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                      {plugin.trending && (
                        <div className="glass-card px-3 py-1 text-xs font-semibold text-neon-magenta flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Trending
                        </div>
                      )}
                    </div>
                    <div className="flex items-start gap-4 relative z-10">
                      <motion.div 
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${plugin.color} p-4`}
                        whileHover={{ 
                          scale: 1.15,
                          rotate: [0, -5, 5, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <Icon className="w-full h-full text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-space font-semibold text-white mb-1 group-hover:text-neon-cyan transition-colors">
                          {plugin.name}
                        </h3>
                        <p className="text-sm text-white/60 mb-3">{plugin.developer}</p>
                        <p className="text-white/80 text-sm leading-relaxed mb-4">
                          {plugin.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-neon-cyan">
                            <Star className="w-4 h-4 fill-current" />
                            <span>{plugin.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-white/60">
                            <Download className="w-4 h-4" />
                            <span>{plugin.installs}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Plugin Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-space font-bold mb-6">
            <span className="gradient-text">Explore Modules</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlugins.map((plugin, index) => {
              const Icon = plugin.icon
              return (
                <motion.div
                  key={plugin.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.6 + index * 0.05,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -15,
                    scale: 1.03,
                    transition: { duration: 0.3 }
                  }}
                  onClick={() => setSelectedPlugin(plugin)}
                  onMouseMove={handleMouseMove}
                  className="glass-card cursor-pointer group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${plugin.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(125, 79, 255, 0.2), transparent 50%)`,
                    }}
                  />
                  {plugin.trending && (
                    <div className="absolute top-4 right-4 glass-card px-2 py-1 text-xs font-semibold text-neon-magenta z-20">
                      🔥 Trending
                    </div>
                  )}
                  <div className="relative z-10">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      whileHover={{ 
                        scale: 1.15,
                        rotate: 0,
                        transition: { duration: 0.3 }
                      }}
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${plugin.color} p-4 mb-4`}
                    >
                      <Icon className="w-full h-full text-white" />
                    </motion.div>
                    <h3 className="text-lg font-space font-semibold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                      {plugin.name}
                    </h3>
                    <p className="text-sm text-white/60 mb-3">{plugin.developer}</p>
                    <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
                      {plugin.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-neon-cyan">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{plugin.rating}</span>
                      </div>
                      <div className="text-white/60">{plugin.installs}</div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 w-full glass-card py-2 text-sm font-semibold gradient-text"
                    >
                      Install
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Plugin Detail Drawer */}
        <AnimatePresence>
          {selectedPlugin && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPlugin(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-2xl z-50 glass p-8 overflow-y-auto"
              >
                <button
                  onClick={() => setSelectedPlugin(null)}
                  className="absolute top-6 right-6 glass-card p-2 hover:scale-110 transition-transform"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

                {(() => {
                  const Icon = selectedPlugin.icon
                  return (
                    <div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${selectedPlugin.color} p-8 mb-6 mx-auto`}
                      >
                        <Icon className="w-full h-full text-white" />
                      </motion.div>

                      <h2 className="text-3xl font-space font-bold text-white mb-2">
                        {selectedPlugin.name}
                      </h2>
                      <p className="text-white/60 mb-4">{selectedPlugin.developer}</p>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1 text-neon-cyan text-lg">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="font-semibold">{selectedPlugin.rating}</span>
                        </div>
                        <div className="text-white/60">{selectedPlugin.installs} installs</div>
                        {selectedPlugin.trending && (
                          <div className="glass-card px-3 py-1 text-sm font-semibold text-neon-magenta flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            Trending
                          </div>
                        )}
                      </div>

                      <div className="glass-card p-6 mb-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                        <p className="text-white/80 leading-relaxed">
                          {selectedPlugin.description}
                        </p>
                      </div>

                      <div className="glass-card p-6 mb-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/60">Version:</span>
                            <span className="text-white font-semibold">{selectedPlugin.version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Last Updated:</span>
                            <span className="text-white">{selectedPlugin.lastUpdated}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Category:</span>
                            <span className="text-neon-cyan capitalize">
                              {categories.find((c) => c.id === selectedPlugin.category)?.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="glass-card p-6 mb-8">
                        <h3 className="text-lg font-semibold text-white mb-3">Supported APIs</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedPlugin.supportedAPIs.map((api) => (
                            <div
                              key={api}
                              className="glass-card px-3 py-1 text-sm text-neon-cyan"
                            >
                              {api}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="w-full glass-card py-4 text-lg font-semibold gradient-text hover:scale-105 transition-all neon-glow-hover flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" />
                        Install & Activate
                      </button>
                    </div>
                  )
                })()}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
