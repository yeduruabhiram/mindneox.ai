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
import { useNavigate } from 'react-router-dom'
import { Flag } from 'lucide-react'
import axios from 'axios'
// Use Vite env var if provided, otherwise default to localhost backend
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
import { useUser } from '@clerk/clerk-react'
import useConversationLimit from '../hooks/useConversationLimit'
import LoginPrompt from '../components/LoginPrompt'

export default function ChatbotPage() {
  // Safe Clerk usage with fallback
  let user = null
  let isLoaded = true
  
  try {
    const clerkData = useUser()
    user = clerkData.user
    isLoaded = clerkData.isLoaded
  } catch (error) {
    console.log('Clerk not available, using anonymous mode')
  }
  
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
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

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
          const historyResponse = await axios.get(`${API_BASE}/api/user/${user.id}/history?limit=50`)
          if (historyResponse.data.history && historyResponse.data.history.length > 0) {
            setConversationHistory(historyResponse.data.history.reverse())
          }

          // Load recent messages for current chat
          const response = await axios.get(`${API_BASE}/api/user/${user.id}/history?limit=10`)
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
          const predictResponse = await axios.get(`${API_BASE}/api/user/${user.id}/predict`)
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
  const response = await axios.post(`${API_BASE}/api/chat`, {
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

  // Swipe gesture handlers for mobile
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    // Right swipe (from left edge) opens history
    if (isRightSwipe && touchStart < 50) {
      setShowHistory(true)
    }
    // Left swipe closes history
    if (isLeftSwipe && showHistory) {
      setShowHistory(false)
    }
  }

  return (
    <>
      <LoginPrompt 
        isOpen={showLoginPrompt} 
        onClose={resetConversationCount} 
      />
      <div 
        className="relative pt-16 md:pt-20 pb-4 md:pb-6 px-3 md:px-6 min-h-screen flex"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
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
              <div className="p-3 md:p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h2 className="text-base md:text-lg font-space font-bold gradient-text flex items-center gap-2">
                    <History className="w-4 h-4 md:w-5 md:h-5" />
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
              <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-2">
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
        className="fixed left-3 md:left-6 top-20 md:top-24 z-30 glass-card p-2 md:p-3 rounded-lg border border-indigo-400/30 hover:border-indigo-400/50 hover:bg-indigo-500/10 transition-all group"
        title="Chat History (Swipe right from edge on mobile)"
      >
        <History className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
        {/* Mobile Swipe Hint */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: [0, 1, 0], x: [-10, 5, -10] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="absolute -right-2 top-1/2 -translate-y-1/2 lg:hidden"
        >
          <div className="w-1 h-6 bg-gradient-to-r from-transparent via-indigo-400 to-transparent rounded-full" />
        </motion.div>
      </motion.button>

      {/* Report Button (Fixed Position) - opens report page with chat context */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/report', { state: { messages, source: 'chatbot' } })}
        className="fixed right-3 md:right-6 top-20 md:top-32 z-30 glass-card p-2 md:p-3 rounded-lg border border-neon-magenta/30 hover:border-neon-magenta/50 hover:bg-neon-magenta/10 transition-all group"
        title="Report bug or feedback"
      >
        <Flag className="w-4 h-4 md:w-5 md:h-5 text-neon-magenta group-hover:rotate-6 transition-transform" />
      </motion.button>

      {/* Main Chat Area */}
      <div className={`flex-1 flex items-center justify-center ${messages.length === 1 ? 'min-h-screen' : ''}`}>
        {/* AI Pulse Indicator - Compact & Clean - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 hidden md:block"
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
          <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full border backdrop-blur-lg flex items-center justify-center ${
            isLoading 
              ? 'border-neon-cyan/60 bg-neon-cyan/15 shadow-[0_0_20px_rgba(0,180,255,0.4)]'
              : 'border-neon-magenta/30 bg-neon-magenta/8 shadow-[0_0_15px_rgba(255,0,200,0.2)]'
          } transition-all duration-500`}>
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-5 h-5 md:w-6 md:h-6 text-neon-cyan" />
              </motion.div>
            ) : (
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-neon-magenta/50" />
            )}
          </div>
        </motion.div>
      </motion.div>

      <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
        {/* Neural Flow Console - Messages Container */}
        {messages.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-20 md:mb-6 max-h-[70vh] md:max-h-[65vh] overflow-y-auto scrollbar-hide pb-3 md:pb-4 relative flex-1"
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

                  {/* Message Node - Clean Modern Design */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    className={`relative flex items-start gap-2 md:gap-3 mb-3 md:mb-4 px-1 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* Avatar - Mobile Friendly */}
                    {message.role === 'assistant' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                      >
                        <Brain className="w-4 h-4 md:w-4.5 md:h-4.5 text-white" />
                      </motion.div>
                    )}

                    {/* Message Bubble - Clean & Modern */}
                    <motion.div
                      initial={{ 
                        opacity: 0,
                        x: message.role === 'user' ? 20 : -20
                      }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`relative max-w-[80%] md:max-w-[70%] group`}
                    >
                      {/* Simple Clean Bubble */}
                      <div 
                        className={`relative backdrop-blur-md rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-lg transition-all duration-300 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-indigo-600/90 to-purple-600/90 text-white'
                            : 'bg-white/10 border border-white/20 text-white/95'
                        } ${message.error ? 'bg-red-600/90' : ''}`}
                      >

                        {/* File Attachments - Compact */}
                        {message.files && message.files.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-wrap gap-2 mb-2"
                          >
                            {message.files.map((file, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + idx * 0.1 }}
                                className="relative bg-white/10 rounded-lg p-2 border border-white/20"
                              >
                                <div className="relative flex items-center gap-2">
                                  {file.preview ? (
                                    <img 
                                      src={file.preview} 
                                      alt={file.name}
                                      className="w-10 h-10 rounded-md object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center">
                                      <File className="w-5 h-5 text-white/70" />
                                    </div>
                                  )}
                                  <div className="text-left">
                                    <p className="text-[11px] font-medium text-white/90 truncate max-w-[100px]">{file.name}</p>
                                    <p className="text-[9px] text-white/50">{formatFileSize(file.size)}</p>
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
                          transition={{ duration: 0.3 }}
                          className="relative"
                        >
                          <p className={`${
                            message.role === 'user'
                              ? 'text-white font-normal'
                              : 'text-white/95 font-normal'
                          } text-[15px] md:text-base leading-relaxed`}>
                            {message.content}
                          </p>
                        </motion.div>

                        {/* Clean Footer with Time */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className={`flex items-center gap-2 mt-2 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <span className="text-[11px] text-white/50">
                            {new Date(message.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}
                          </span>

                          {/* Action Buttons - Desktop Only */}
                          {message.role === 'assistant' && !message.error && (
                            <div className="hidden md:flex items-center gap-1 ml-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                                title="Copy"
                              >
                                <Code className="w-3.5 h-3.5 text-white/70" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                                title="Regenerate"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-white/70" />
                              </motion.button>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* User Avatar - Right Side */}
                    {message.role === 'user' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
                      >
                        <User className="w-4 h-4 md:w-4.5 md:h-4.5 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              ))}
            </AnimatePresence>

            {/* Clean Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 mb-3 px-1"
              >
                {/* AI Avatar */}
                <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="w-4 h-4 md:w-4.5 md:h-4.5 text-white" />
                  </motion.div>
                </div>

                {/* Typing Indicator */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-3xl p-4 shadow-lg">
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 0.8, 
                          repeat: Infinity, 
                          delay: i * 0.2 
                        }}
                        className="w-2 h-2 rounded-full bg-emerald-400"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </motion.div>
        )}

        {/* Main Content - Fully Centered Splash Screen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full pb-24 md:pb-0 ${messages.length === 1 ? 'flex flex-col items-center justify-center min-h-[70vh] md:min-h-[80vh]' : ''}`}
        >
          {/* Centered Logo/Welcome - Full Screen Splash */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-8 md:mb-16"
            >
              {/* Futuristic Logo with Glow */}
              <motion.div
                animate={{ 
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative inline-block mb-6 md:mb-8"
              >
                {/* Hexagonal Glow */}
                <motion.div
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-emerald-500/40 blur-3xl rounded-full"
                />
                
                {/* Logo Text */}
                <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-space font-bold">
                  <span className="gradient-text">MindNeox</span>
                </h1>
                
                {/* Subtitle Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-3 md:mt-4 inline-block"
                >
                  <div className="px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-emerald-500/20 border border-indigo-400/30 backdrop-blur-xl">
                    <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-indigo-300">
                      Neural AI Interface
                    </span>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Welcome Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2 md:space-y-3 px-4"
              >
                <p className="text-white/80 text-lg md:text-xl lg:text-2xl font-medium">
                  Welcome to the Future of AI
                </p>
                <p className="text-white/50 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
                  Ask anything. Upload files. Get intelligent answers powered by advanced neural networks.
                </p>
              </motion.div>
              
              {/* Animated Tech Elements */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 md:mt-8 flex items-center justify-center gap-4 md:gap-6"
              >
                {[
                  { icon: Brain, label: 'Neural AI', color: 'indigo' },
                  { icon: Zap, label: 'Fast', color: 'purple' },
                  { icon: Database, label: 'Smart', color: 'emerald' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    className="flex flex-col items-center gap-1.5 md:gap-2"
                  >
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-${item.color}-500/10 border border-${item.color}-400/30 flex items-center justify-center backdrop-blur-xl`}>
                      <item.icon className={`w-5 h-5 md:w-6 md:h-6 text-${item.color}-400`} />
                    </div>
                    <span className="text-[10px] md:text-xs text-white/40 font-mono uppercase tracking-wider">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Input Area - Fixed at bottom on mobile */}
          <div className="space-y-2 md:space-y-4 fixed md:relative bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto bg-transparent backdrop-blur-xl md:backdrop-blur-none p-3 md:p-0 border-t border-white/10 md:border-0 z-40">
            {/* File Previews */}
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 justify-center mb-2"
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

            {/* Clean Modern Input Bar - Curved Pill Shape */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              {/* Curved Pill-Shaped Input Container */}
              <div className="relative backdrop-blur-xl bg-transparent rounded-full border border-white/20 shadow-2xl overflow-hidden max-w-3xl mx-auto transition-all duration-300 hover:border-white/30">
                <div className="flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-2.5">

                  {/* Clean Input Field */}
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Message MindNeox..."
                      disabled={isLoading}
                      rows={1}
                      className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 text-[15px] md:text-base font-normal disabled:opacity-50 resize-none py-2 md:py-2.5 px-1"
                      style={{ 
                        minHeight: '40px', 
                        maxHeight: '120px'
                      }}
                    />
                  </div>

                  {/* Action Buttons - Clean & Simple */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* File Upload */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full hover:bg-white/10 transition-all flex items-center justify-center"
                      title="Attach file"
                    >
                      <Paperclip className="w-5 h-5 text-white/60" />
                    </motion.button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json,.py,.js,.jsx,.ts,.tsx"
                    />

                    {/* Clean Send Button - Circular */}
                    <motion.button
                      onClick={handleSend}
                      disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${
                        (!input.trim() && uploadedFiles.length === 0) || isLoading
                          ? 'bg-white/10 cursor-not-allowed'
                          : 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg'
                      }`}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader className="w-5 h-5 text-white" />
                        </motion.div>
                      ) : (
                        <Send className="w-5 h-5 text-white" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>


          </div>

          {/* Footer Text - Hidden on mobile when input is fixed */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: messages.length === 1 ? 1.2 : 0.3 }}
            className="mt-2 md:mt-8 text-center px-4 hidden md:block"
          >
            <p className="text-[10px] md:text-xs text-white/30 font-mono">
              Powered by <span className="text-indigo-400">MindNeox AI</span> <span className="hidden md:inline">• Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/40">Enter</kbd> to send • Upload files for analysis</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
      </div>
    </div>
    </>
  )
}
