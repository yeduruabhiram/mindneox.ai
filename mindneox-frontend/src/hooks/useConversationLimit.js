import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const CONVERSATION_LIMIT = 5;
const STORAGE_KEY = 'guestConversationCount';

export default function useConversationLimit() {
  const { user, isLoaded } = useUser();
  const [conversationCount, setConversationCount] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (!user && isLoaded) {
      const storedCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
      setConversationCount(storedCount);
    }
  }, [user, isLoaded]);

  const incrementConversation = () => {
    if (!user && isLoaded) {
      const newCount = conversationCount + 1;
      setConversationCount(newCount);
      localStorage.setItem(STORAGE_KEY, newCount.toString());

      if (newCount >= CONVERSATION_LIMIT) {
        setShowLoginPrompt(true);
      }
    }
  };

  const resetConversationCount = () => {
    setConversationCount(0);
    localStorage.setItem(STORAGE_KEY, '0');
    setShowLoginPrompt(false);
  };

  return {
    conversationCount,
    showLoginPrompt,
    incrementConversation,
    resetConversationCount,
    isLimited: conversationCount >= CONVERSATION_LIMIT && !user,
  };
}