import { useState, useEffect, useCallback } from 'react';
import { Reaction } from '../../types/Userdatatypes';

interface UseReactionsProps {
  contentId: number;
  contentType: 'free' | 'vip';
}

export const useReactions = ({ contentId, contentType }: UseReactionsProps) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/reactions/${contentType}/${contentId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch reactions');
      }
      
      const data = await response.json();
      setReactions(data);
    } catch (err) {
      console.error('Error fetching reactions:', err);
      setError('Failed to load reactions');
    } finally {
      setIsLoading(false);
    }
  }, [contentId, contentType]);

  const fetchUserReaction = useCallback(async () => {
    const token = localStorage.getItem('Token');
    if (!token) return;
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/reactions/user/${contentType}/${contentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.emoji) {
          setUserReaction(data.emoji);
        } else {
          setUserReaction(null);
        }
      } else if (response.status === 404) {
        // No reaction found, this is normal
        setUserReaction(null);
      }
    } catch (err) {
      console.error('Error fetching user reaction:', err);
    }
  }, [contentId, contentType]);

  const addReaction = async (emoji: string): Promise<boolean> => {
    const token = localStorage.getItem('Token');
    if (!token) return false;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          contentId,
          contentType,
          emoji
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add reaction');
      }
      
      // Update local state
      fetchReactions();
      setUserReaction(emoji);
      
      return true;
    } catch (err) {
      console.error('Error adding reaction:', err);
      setError('Failed to add reaction');
      return false;
    }
  };

  useEffect(() => {
    fetchReactions();
    fetchUserReaction();
  }, [fetchReactions, fetchUserReaction]);

  return {
    reactions,
    userReaction,
    isLoading,
    error,
    addReaction,
    refreshReactions: fetchReactions,
  };
};

export default useReactions;