import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader, 
  Code, 
  Database,
  Zap,
  Brain,
  Activity,
  Trash2,
  Settings,
  Paperclip,
  Image as ImageIcon,
  File,
  X,
  Upload,
  Plus,
  Menu,
  History,
  Clock,
  MessageSquare,
  ChevronLeft,
  Edit3,
  Search
} from 'lucide-react'
import axios from 'axios'
import { useUser } from '@clerk/clerk-react'
import useConversationLimit from '../hooks/useConversationLimit'
import LoginPrompt from '../components/LoginPrompt'

export default function ChatbotPage() {
  const { user, isLoaded } = useUser()
  const { 
    showLoginPrompt, 
    incrementConversation, 
    isLimited,
    resetConversationCount 
  } = useConversationLimit()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant powered by MindNeox.AI. I can help you with code generation, data analysis, and intelligent conversations. You can also upload files, images, and documents. How can I assist you today?',
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [conversationHistory, setConversationHistory] = useState([])
  const [searchHistory, setSearchHistory] = useState('')
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load chat history when user logs in
  useEffect(() => {
    const loadChatHistory = async () => {
      if (isLoaded && user) {
        try {
          // Load full conversation history for sidebar
          const historyResponse = await axios.get(`/api/user/${user.id}/history?limit=50`)
          if (historyResponse.data.history && historyResponse.data.history.length > 0) {
            setConversationHistory(historyResponse.data.history.reverse())
          }

          // Load recent messages for current chat
          const response = await axios.get(`/api/user/${user.id}/history?limit=10`)
          if (response.data.history && response.data.history.length > 0) {
            // Convert Redis history to message format
            const historyMessages = response.data.history.reverse().map(h => [
              {
                role: 'user',
                content: h.user_message,
                timestamp: new Date(h.timestamp * 1000).toISOString(),
              },
              {
                role: 'assistant',
                content: h.assistant_response,
                timestamp: new Date(h.timestamp * 1000).toISOString(),
              }
            ]).flat()

            setMessages([
              {
                role: 'assistant',
                content: `Welcome back, ${user.firstName || user.username}! I remember our previous conversations. Let's continue!`,
                timestamp: new Date().toISOString(),
              },
              ...historyMessages
            ])
          }

          // Get personalized greeting
          const predictResponse = await axios.get(`/api/user/${user.id}/predict`)
          if (predictResponse.data.greeting) {
            setMessages(prev => [{
              role: 'assistant',
              content: predictResponse.data.greeting,
              timestamp: new Date().toISOString(),
            }, ...prev.slice(1)])
          }
        } catch (error) {
          console.log('No previous chat history found:', error.message)
        }
      }
    }

    loadChatHistory()
  }, [isLoaded, user])

  const handleSend = async () => {
    if ((!input.trim() && uploadedFiles.length === 0) || isLoading) return
    
    // Check conversation limit for non-logged in users
    if (isLimited) {
      return;
    }

    // Get user ID from Clerk or use anonymous
    const userId = user?.id || `anonymous_${Date.now()}`
    
    // Increment conversation count for non-logged in users
    if (!user) {
      incrementConversation();
    }

    const userMessage = {
      role: 'user',
      content: input || 'Attached files',
      timestamp: new Date().toISOString(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : null,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setUploadedFiles([])
    setIsLoading(true)

    try {
      const response = await axios.post('/api/chat', {
        message: input,
        user_id: userId,
        clerk_user_id: user?.id || null,
        user_email: user?.primaryEmailAddress?.emailAddress || null,
        user_name: user?.fullName || user?.username || 'Anonymous',
      })

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: response.data.timestamp,
        firebaseId: response.data.firebase_id,
        pineconeId: response.data.pinecone_id,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend is running on port 8000.',
        timestamp: new Date().toISOString(),
        error: true,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat cleared! How can I help you today?',
        timestamp: new Date().toISOString(),
      },
    ])
    setUploadedFiles([])
  }

  const newChat = () => {
    clearChat()
    setShowHistory(false)
  }

  const loadConversation = (conv) => {
    setMessages([
      {
        role: 'user',
        content: conv.user_message,
        timestamp: new Date(conv.timestamp * 1000).toISOString(),
      },
      {
        role: 'assistant',
        content: conv.assistant_response,
        timestamp: new Date(conv.timestamp * 1000).toISOString(),
      }
    ])
    setShowHistory(false)
  }

  const filteredHistory = conversationHistory.filter(conv =>
    conv.user_message?.toLowerCase().includes(searchHistory.toLowerCase()) ||
    conv.assistant_response?.toLowerCase().includes(searchHistory.toLowerCase())
  )

  return (
    <>
      <LoginPrompt 
        isOpen={showLoginPrompt} 
        onClose={resetConversationCount} 
      />
      <div className="relative pt-20 pb-6 px-6 min-h-screen flex">
      {/* ChatGPT-Style History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-80 glass-card border-r border-white/10 z-50 overflow-hidden flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-space font-bold gradient-text flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Chat History
                  </h2>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="w-8 h-8 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center lg:hidden"
                  >
                    <ChevronLeft className="w-5 h-5 text-white/70" />
                  </button>
                </div>

                {/* New Chat Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={newChat}
                  className="w-full glass-card px-4 py-3 rounded-lg border border-neon-cyan/30 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all flex items-center justify-center gap-2 group"
                >
                  <Plus className="w-5 h-5 text-neon-cyan group-hover:rotate-90 transition-transform" />
                  <span className="font-medium text-white/90">New Chat</span>
                </motion.button>

                {/* Search */}
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchHistory}
                    onChange={(e) => setSearchHistory(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/90 placeholder-white/40 text-sm focus:outline-none focus:border-neon-cyan/50 transition-all"
                  />
                </div>
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((conv, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 4 }}
                      onClick={() => loadConversation(conv)}
                      className="w-full glass-card p-3 rounded-lg border border-white/5 hover:border-neon-cyan/30 hover:bg-white/10 transition-all text-left group"
                    >
                      {/* Date Header */}
                      <div className="flex items-center gap-2 mb-2 text-xs text-white/40">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(conv.timestamp * 1000).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* Message Preview */}
                      <p className="text-sm text-white/80 group-hover:text-white line-clamp-2 mb-1">
                        {conv.user_message}
                      </p>

                      {/* AI Response Preview */}
                      <p className="text-xs text-white/40 line-clamp-1">
                        {conv.assistant_response}
                      </p>

                      {/* Hover Action Icons */}
                      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 rounded hover:bg-white/10 transition-colors">
                          <Edit3 className="w-3 h-3 text-neon-cyan" />
                        </button>
                        <button className="p-1 rounded hover:bg-red-500/20 transition-colors">
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">
                      {searchHistory ? 'No matching conversations' : 'No conversations yet'}
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-white/10 bg-white/5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearChat}
                  className="w-full glass-card px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Clear All Chats</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* History Toggle Button (Fixed Position) */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowHistory(!showHistory)}
        className="fixed left-6 top-24 z-30 glass-card p-3 rounded-lg border border-neon-cyan/30 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all group"
        title="Chat History"
      >
        <History className="w-5 h-5 text-neon-cyan group-hover:rotate-12 transition-transform" />
      </motion.button>

      {/* Main Chat Area */}
      <div className="flex-1 flex items-center justify-center">
        {/* AI Pulse Indicator - Compact & Clean */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div
          animate={isLoading ? {
            scale: [1, 1.1, 1]
          } : {
            scale: [1, 1.03, 1]
          }}
          transition={isLoading ? {
            scale: { duration: 1, repeat: Infinity }
          } : {
            scale: { duration: 2.5, repeat: Infinity }
          }}
          className="relative"
        >
          {/* Subtle Ripple */}
          {isLoading && (
            <motion.div
              animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan/40 to-neon-magenta/40 blur-lg"
            />
          )}
          
          {/* Main Pulse Ring - Smaller */}
          <div className={`relative w-12 h-12 rounded-full border backdrop-blur-lg flex items-center justify-center ${
            isLoading 
              ? 'border-neon-cyan/60 bg-neon-cyan/15 shadow-[0_0_20px_rgba(0,180,255,0.4)]'
              : 'border-neon-magenta/30 bg-neon-magenta/8 shadow-[0_0_15px_rgba(255,0,200,0.2)]'
          } transition-all duration-500`}>
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-6 h-6 text-neon-cyan" />
              </motion.div>
            ) : (
              <Sparkles className="w-5 h-5 text-neon-magenta/50" />
            )}
          </div>
        </motion.div>
      </motion.div>

      <div className="w-full max-w-4xl mx-auto">
        {/* Neural Flow Console - Messages Container */}
        {messages.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 max-h-[65vh] overflow-y-auto scrollbar-hide pb-4 relative"
          >
            {/* Animated Grid Background - Lighter */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0" 
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0, 180, 255, 0.15) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 180, 255, 0.15) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                  animation: 'gridMove 20s linear infinite'
                }}
              />
            </div>

            <AnimatePresence mode="popLayout">
              {messages.slice(1).map((message, index) => (
                <div key={index} className="relative">
                  {/* Neural Connection Line (between messages) - Thinner */}
                  {index > 0 && (
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`absolute left-1/2 -translate-x-1/2 w-[1px] h-8 -top-4 ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-b from-neon-cyan/0 via-neon-cyan/30 to-neon-cyan/0'
                          : 'bg-gradient-to-b from-neon-magenta/0 via-neon-magenta/30 to-neon-magenta/0'
                      }`}
                    />
                  )}

                  {/* Message Node - Compact */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    className={`relative flex items-start gap-3 mb-5 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* Message Glass Panel - Cleaner & Lighter */}
                    <motion.div
                      initial={{ 
                        opacity: 0,
                        x: message.role === 'user' ? 30 : -30
                      }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={`relative max-w-[70%] group ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {/* Subtle Glow Border - Lighter */}
                      <div 
                        className={`absolute -inset-[1px] rounded-xl opacity-40 blur-md transition-all duration-300 group-hover:opacity-70 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-neon-cyan/40 to-blue-400/40'
                            : 'bg-gradient-to-r from-neon-magenta/40 to-pink-400/40'
                        } ${message.error ? 'from-red-500/50 to-orange-500/50' : ''}`}
                      />

                      {/* Main Glass Panel - Clean & Visible */}
                      <div 
                        className={`relative backdrop-blur-xl rounded-xl p-4 border shadow-lg transition-all duration-300 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-neon-cyan/15 via-blue-500/8 to-transparent border-neon-cyan/25'
                            : 'bg-gradient-to-br from-neon-magenta/15 via-pink-500/8 to-transparent border-neon-magenta/25'
                        } ${message.error ? 'from-red-500/20 border-red-500/40' : ''} group-hover:border-opacity-50`}
                      >
                        {/* Subtle Shimmer Effect */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.15, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
                        >
                          <div 
                            className={`absolute inset-0 ${
                              message.role === 'user'
                                ? 'bg-gradient-to-br from-neon-cyan/20 via-transparent to-transparent'
                                : 'bg-gradient-to-br from-neon-magenta/20 via-transparent to-transparent'
                            }`}
                          />
                        </motion.div>

                        {/* File Attachments - Compact */}
                        {message.files && message.files.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-wrap gap-2 mb-3"
                          >
                            {message.files.map((file, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + idx * 0.1 }}
                                className="relative backdrop-blur-lg bg-white/5 rounded-lg p-2 border border-white/15 hover:border-neon-violet/40 transition-all group/file"
                              >
                                <div className="relative flex items-center gap-2">
                                  {file.preview ? (
                                    <img 
                                      src={file.preview} 
                                      alt={file.name}
                                      className="w-12 h-12 rounded-md object-cover ring-1 ring-white/20"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-md bg-gradient-to-br from-neon-violet/30 to-purple-600/30 flex items-center justify-center backdrop-blur-sm">
                                      <File className="w-6 h-6 text-neon-violet" />
                                    </div>
                                  )}
                                  <div className="text-left">
                                    <p className="text-[11px] font-semibold text-white/90 truncate max-w-[100px]">{file.name}</p>
                                    <p className="text-[10px] text-white/50">{formatFileSize(file.size)}</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                        
                        {/* Message Text - Clean & Readable */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="relative z-10"
                        >
                          <p className={`${
                            message.role === 'user'
                              ? 'text-white font-medium'
                              : 'text-white/95 font-normal'
                          } text-[15px] leading-relaxed`}>
                            {message.content}
                          </p>
                        </motion.div>

                        {/* Status Footer - Compact */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className={`flex items-center gap-2 mt-3 pt-2 border-t ${
                            message.role === 'user' 
                              ? 'border-neon-cyan/15 justify-end' 
                              : 'border-neon-magenta/15 justify-start'
                          }`}
                        >
                          {/* Small Status Dot */}
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            message.role === 'user' ? 'bg-neon-cyan/60' : 'bg-neon-magenta/60'
                          }`} />
                          
                          <span className="text-[10px] font-mono text-white/35 tracking-wide">
                            {new Date(message.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}
                          </span>

                          {/* AI Actions - Minimal */}
                          {message.role === 'assistant' && !message.error && (
                            <>
                              <div className="w-px h-2.5 bg-white/15 mx-0.5" />
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-[10px] font-mono text-neon-cyan/60 hover:text-neon-cyan transition-colors flex items-center gap-1"
                              >
                                <Code className="w-2.5 h-2.5" />
                                COPY
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-[10px] font-mono text-neon-violet/60 hover:text-neon-violet transition-colors flex items-center gap-1"
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                REGEN
                              </motion.button>
                            </>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              ))}
            </AnimatePresence>

            {/* AI Pulse Indicator (when loading) - Compact */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex justify-start mb-5"
              >
                <div className="relative">
                  {/* Outer Ripple - Subtle */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-cyan/40 to-neon-magenta/40 blur-lg"
                  />

                  {/* Thinking Panel - Clean */}
                  <div className="relative backdrop-blur-xl bg-gradient-to-br from-neon-magenta/15 via-purple-500/8 to-transparent border border-neon-magenta/25 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      {/* Simple Spinning Icon */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Brain className="w-5 h-5 text-neon-cyan" />
                      </motion.div>

                      {/* Minimal Dots */}
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              y: [0, -6, 0]
                            }}
                            transition={{ 
                              duration: 0.6, 
                              repeat: Infinity, 
                              delay: i * 0.15 
                            }}
                            className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta"
                          />
                        ))}
                      </div>

                      {/* Clean Text */}
                      <span className="text-sm font-medium text-white/70">
                        Processing...
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </motion.div>
        )}

        {/* Main Content - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${messages.length === 1 ? 'text-center' : ''}`}
        >
          {/* Logo/Title - Only show when no messages */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12"
            >
              <h1 className="text-5xl md:text-6xl font-space font-bold mb-4">
                <span className="gradient-text">MindNeox</span>
              </h1>
              <p className="text-white/60 text-lg">Ask anything. Upload files. Get intelligent answers.</p>
            </motion.div>
          )}

          {/* Input Area */}
          <div className="space-y-4">
            {/* File Previews */}
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 justify-center"
              >
                {uploadedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card p-2 flex items-center gap-2 group hover:bg-white/10 transition-all"
                  >
                    {file.preview ? (
                      <img 
                        src={file.preview} 
                        alt={file.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-violet/20 to-purple-500/20 flex items-center justify-center">
                        <File className="w-6 h-6 text-neon-violet" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white/90 truncate max-w-[120px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-white/50">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="w-6 h-6 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Neural Command Console - Input Bar - Clean & Compact */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group"
            >
              {/* Subtle Command Console Glow */}
              <motion.div
                animate={{
                  opacity: input.length > 0 ? [0.3, 0.5, 0.3] : [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-[0.5px] rounded-xl bg-gradient-to-r from-neon-cyan/20 via-neon-violet/15 to-neon-magenta/20 blur-sm"
              />

              {/* Main Console Panel - Cleaner */}
              <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/8 via-white/4 to-white/8 rounded-xl border border-white/15 shadow-lg overflow-hidden max-w-3xl mx-auto">
                {/* Subtle Scan Line */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-neon-cyan/10 to-transparent pointer-events-none"
                />

                <div className="flex items-center gap-2 p-1.5">
                  {/* Voice Command Button - Compact */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group/voice flex-shrink-0"
                    title="Voice Command"
                  >
                    <div className="absolute inset-0 bg-neon-cyan/20 blur-md rounded-lg opacity-0 group-hover/voice:opacity-100 transition-opacity" />
                    <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan/15 to-blue-500/10 border border-neon-cyan/25 hover:border-neon-cyan/50 flex items-center justify-center transition-all">
                      <Activity className="w-4 h-4 text-neon-cyan" />
                    </div>
                  </motion.button>

                  {/* Command Input Field - Clean */}
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask anything..."
                      disabled={isLoading}
                      rows={1}
                      className="w-full bg-transparent border-none outline-none text-white placeholder-white/35 text-[15px] font-normal disabled:opacity-50 resize-none py-3 px-3"
                      style={{ 
                        minHeight: '40px', 
                        maxHeight: '160px'
                      }}
                    />
                    
                    {/* Minimal Typing Indicator */}
                    {input.length > 0 && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="absolute bottom-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent"
                      />
                    )}
                  </div>

                  {/* Action Buttons - Minimal */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* File Upload */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-8 h-8 rounded-lg hover:bg-white/8 transition-all flex items-center justify-center group/btn"
                      title="Upload"
                    >
                      <Paperclip className="w-4 h-4 text-white/50 group-hover/btn:text-neon-violet transition-colors" />
                    </motion.button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json,.py,.js,.jsx,.ts,.tsx"
                    />

                    {/* Settings */}
                    <motion.button
                      whileHover={{ scale: 1.05, rotate: 45 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-8 h-8 rounded-lg hover:bg-white/8 transition-all flex items-center justify-center group/btn"
                    >
                      <Settings className="w-4 h-4 text-white/50 group-hover/btn:text-white transition-colors" />
                    </motion.button>

                    {/* Divider */}
                    <div className="w-px h-5 bg-white/15 mx-0.5" />

                    {/* Send Button - Clean */}
                    <motion.button
                      onClick={handleSend}
                      disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group/send flex-shrink-0"
                    >
                      {/* Button Glow */}
                      <div className={`absolute inset-0 rounded-lg blur-md transition-all duration-300 ${
                        (!input.trim() && uploadedFiles.length === 0) || isLoading
                          ? 'opacity-0'
                          : 'bg-gradient-to-r from-neon-cyan/40 to-neon-magenta/40 opacity-50 group-hover/send:opacity-80'
                      }`} />
                      
                      {/* Button Body */}
                      <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        (!input.trim() && uploadedFiles.length === 0) || isLoading
                          ? 'bg-white/5 border border-white/10 cursor-not-allowed'
                          : 'bg-gradient-to-r from-neon-cyan/80 via-blue-500/80 to-neon-magenta/80 border border-neon-cyan/40 hover:border-neon-cyan/60'
                      }`}>
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader className="w-4 h-4 text-white" />
                          </motion.div>
                        ) : (
                          <Send className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Category Pills - Only show when no messages */}
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center justify-center gap-2 pt-4"
              >
                <button className="glass-card px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 group">
                  <Brain className="w-4 h-4 text-neon-cyan group-hover:scale-110 transition-transform" />
                  AI Development
                </button>
                <button className="glass-card px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 group">
                  <Code className="w-4 h-4 text-neon-violet group-hover:scale-110 transition-transform" />
                  Code Assistant
                </button>
                <button className="glass-card px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 group">
                  <Database className="w-4 h-4 text-neon-magenta group-hover:scale-110 transition-transform" />
                  Data Analysis
                </button>
                <button className="glass-card px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 group">
                  <Sparkles className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                  Creative Writing
                </button>
                <button className="glass-card px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 group">
                  <Activity className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                  Research
                </button>
              </motion.div>
            )}
          </div>

          {/* Footer Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-white/30">
              Powered by <span className="text-neon-cyan">MindNeox AI</span> • Press Enter to send • Upload files for analysis
            </p>
          </motion.div>
        </motion.div>
      </div>
      </div>
    </div>
    </>
  )
}
