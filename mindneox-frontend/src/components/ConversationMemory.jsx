import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

/**
 * ConversationMemory Component
 * Displays user's conversation history and personalized greeting
 * Integrates with Redis memory backend
 */
const ConversationMemory = () => {
  const { user } = useUser();
  const [greeting, setGreeting] = useState('Hello! What would you like to talk about?');
  const [history, setHistory] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadUserMemory();
    }
  }, [user]);

  const loadUserMemory = async () => {
    try {
      setLoading(true);
      
      // Get personalized greeting and predicted topics
      const predictResponse = await axios.get(
        `/api/user/${user.id}/predict`
      );
      setGreeting(predictResponse.data.greeting);
      setKeywords(predictResponse.data.top_keywords.slice(0, 5));

      // Get conversation history
      const historyResponse = await axios.get(
        `/api/user/${user.id}/history?limit=10`
      );
      setHistory(historyResponse.data.history);
    } catch (error) {
      console.error('Error loading conversation memory:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <p className="text-gray-400">Sign in to see your conversation history</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personalized Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg border border-purple-500/30"
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          {greeting}
        </h2>
        <p className="text-gray-300 text-sm">
          Based on your conversation history and interests
        </p>
      </motion.div>

      {/* Interest Tags */}
      {keywords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-white mb-3">
            Your Top Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, index) => (
              <motion.span
                key={kw.keyword}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full text-sm text-purple-200 flex items-center gap-2"
              >
                {kw.keyword}
                <span className="text-xs text-purple-300 bg-purple-700/50 px-2 py-0.5 rounded-full">
                  {kw.frequency}
                </span>
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Conversation History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Conversations
            <span className="ml-2 text-sm text-gray-400">
              ({history.length} conversations)
            </span>
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {history.slice(0, 5).map((conv, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-3 bg-gray-900/50 rounded border border-gray-700 hover:border-purple-500/50 transition-colors"
              >
                <div className="mb-2">
                  <span className="text-xs text-purple-400 font-semibold">
                    You
                  </span>
                  <p className="text-sm text-gray-300 mt-1">
                    {conv.user_message}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-blue-400 font-semibold">
                    AI
                  </span>
                  <p className="text-sm text-gray-400 mt-1">
                    {conv.assistant_response.length > 150
                      ? `${conv.assistant_response.substring(0, 150)}...`
                      : conv.assistant_response}
                  </p>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(conv.timestamp * 1000).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {history.length === 0 && (
        <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400">
            No conversation history yet. Start chatting to build your memory!
          </p>
        </div>
      )}
    </div>
  );
};

export default ConversationMemory;
