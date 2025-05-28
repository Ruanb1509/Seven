import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  contentId: number;
  contentType: 'free' | 'vip';
  reactions: { emoji: string; count: number }[];
}

const emojis = [
  { src: '/src/emojis/cool.png', alt: 'Cool' },
  { src: '/src/emojis/love.gif', alt: 'Love' },
  { src: '/src/emojis/HYPED.gif', alt: 'Hyped' },
  { src: '/src/emojis/OKPepe.png', alt: 'OK' },
  { src: '/src/emojis/Wankge.gif', alt: 'Wank' },
  { src: '/src/emojis/PepeGun.png', alt: 'Gun' },
  { src: '/src/emojis/PepeHmm.gif', alt: 'Hmm' },
  { src: '/src/emojis/pepejob.png', alt: 'Job' },
  { src: '/src/emojis/peperun.gif', alt: 'Run' },
  { src: '/src/emojis/pepelove.gif', alt: 'Love Heart' }
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  contentId,
  contentType,
  reactions = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const token = localStorage.getItem('Token');
  const navigate = useNavigate()

  const handleEmojiClick = async (emoji: string) => {
    if (!token) {
      navigate("/login")
      return;
    }

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

      if (response.ok) {
        onEmojiSelect(emoji);
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }

    setIsOpen(false);
  };

  // Render existing reactions
  const renderReactions = () => {
    if (!Array.isArray(reactions) || reactions.length === 0) {
        return null;
    }

    return reactions.map((reaction, index) => {
        const emojiData = emojis.find(e => e.alt === reaction.emoji);
        if (!emojiData) return null;

        return (
            <motion.div
                key={`<span class="math-inline">\{reaction\.emoji\}\-</span>{index}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                    theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                } cursor-pointer transition-colors`}
                onClick={() => handleEmojiClick(reaction.emoji)}
            >
                <img 
                    src={emojiData.src} 
                    alt={reaction.emoji}
                    className="w-5 h-5"
                />
                <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                    {reaction.count}  {/* Display the count */}
                </span>
            </motion.div>
        );
    });
};

  return (
    <div className="relative">
      <div className="flex items-center gap-2 flex-wrap">
        {renderReactions()}
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-full ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-gray-100 hover:bg-gray-200'
          } transition-colors`}
        >
          <Smile className="w-5 h-5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`fixed transform -translate-x-[calc(100%-3rem)] mt-2 p-2 rounded-xl shadow-xl grid grid-cols-5 gap-2 z-50 ${
              theme === 'dark'
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
            style={{ width: '300px' }}
          >
            {emojis.map((emoji) => (
              <motion.button
                key={emoji.alt}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEmojiClick(emoji.alt)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img 
                  src={emoji.src} 
                  alt={emoji.alt}
                  className="w-8 h-8"
                />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmojiPicker;