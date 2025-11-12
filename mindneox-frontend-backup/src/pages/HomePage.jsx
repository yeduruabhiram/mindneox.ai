import { motion } from 'framer-motion'
import { ArrowRight, Zap, Brain, Shield, Sparkles, Code, Database, Cpu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Advanced neural networks that understand and adapt to your needs',
      color: 'from-neon-cyan to-blue-500',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with GPU acceleration and real-time responses',
      color: 'from-neon-violet to-purple-500',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Military-grade encryption and secure data handling',
      color: 'from-neon-magenta to-pink-500',
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'Comprehensive APIs and SDKs for seamless integration',
      color: 'from-cyan-500 to-teal-500',
    },
    {
      icon: Database,
      title: 'Multi-Database Support',
      description: 'Firebase, Pinecone, and Redis for robust data management',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Cpu,
      title: 'Smart Processing',
      description: 'Intelligent context awareness and conversation memory',
      color: 'from-pink-500 to-rose-500',
    },
  ]

  const stats = [
    { value: '99.9%', label: 'Uptime' },
    { value: '<50ms', label: 'Response Time' },
    { value: '10M+', label: 'Queries Processed' },
    { value: '150+', label: 'AI Models' },
  ]

  return (
    <div className="relative pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Floating Hologram */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-magenta opacity-20 blur-3xl"
            />
            <motion.div
              animate={{
                rotate: -360,
                y: [0, -20, 0],
              }}
              transition={{
                rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="relative z-10 glass-card w-full h-full flex items-center justify-center"
            >
              <Brain className="w-32 h-32 text-neon-cyan" />
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl font-space font-bold mb-6"
          >
            <span className="gradient-text">MindNeox.AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/80 mb-4 font-inter"
          >
            The Super AI Operating System
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg text-white/60 mb-12 max-w-2xl mx-auto"
          >
            Experience the future of artificial intelligence with our advanced neural marketplace.
            Build, deploy, and scale AI agents with unprecedented ease.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/marketplace"
              className="group glass-card px-8 py-4 text-lg font-semibold gradient-text hover:scale-105 transition-all neon-glow-hover flex items-center justify-center gap-2"
            >
              Explore Marketplace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/chatbot"
              className="glass-card px-8 py-4 text-lg font-semibold text-white hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Try Chatbot
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              onMouseMove={handleMouseMove}
              className="glass-card text-center relative overflow-hidden group cursor-pointer"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 180, 255, 0.15), transparent 50%)`,
                }}
              />
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm md:text-base">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-space font-bold text-center mb-4">
            <span className="gradient-text">Powerful Features</span>
          </h2>
          <p className="text-center text-white/60 mb-12 text-lg">
            Everything you need to build the future of AI
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 1.4 + index * 0.1, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  onMouseMove={handleMouseMove}
                  className="glass-card group cursor-pointer relative overflow-hidden"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(125, 79, 255, 0.15), transparent 50%)`,
                    }}
                  />
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-4`}
                      whileHover={{ 
                        scale: 1.15,
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      <Icon className="w-full h-full text-white" />
                    </motion.div>
                    <h3 className="text-xl font-space font-semibold mb-3 text-white group-hover:text-neon-cyan transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8, type: "spring" }}
          whileHover={{ scale: 1.02 }}
          onMouseMove={handleMouseMove}
          className="glass-card p-12 text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-violet/10 to-neon-magenta/10 animate-shimmer" />
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 180, 255, 0.2), transparent 60%)`,
            }}
          />
          <div className="relative z-10">
            <motion.h2 
              className="text-4xl md:text-5xl font-space font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
            >
              <span className="gradient-text">Ready to Get Started?</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-white/70 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4 }}
            >
              Join thousands of developers building the future with MindNeox.AI
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6 }}
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 glass-card px-10 py-4 text-lg font-semibold gradient-text hover:scale-110 transition-all neon-glow-hover group/btn"
              >
                Launch Dashboard
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
