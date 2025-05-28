// import React, { useState, useCallback, useEffect } from 'react';
// import { Smile } from 'lucide-react';
// import { useTheme } from '../contexts/ThemeContext';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';

// type Reaction = {
//   emoji: string;
//   count: number;
// };

// interface EmojiReactionProps {
//   contentId: number;
//   contentType: 'free' | 'vip';
//   initialReactions?: Reaction[];
//   onReactionUpdate?: (reactions: Reaction[]) => void;
// }

// const emojis = [
//   { src: '/src/emojis/cool.png', alt: 'Cool' },
//   { src: '/src/emojis/love.gif', alt: 'Love' },
//   { src: '/src/emojis/HYPED.gif', alt: 'Hyped' },
//   { src: '/src/emojis/OKPepe.png', alt: 'OK' },
//   { src: '/src/emojis/Wankge.gif', alt: 'Wank' },
//   { src: '/src/emojis/PepeGun.png', alt: 'Gun' },
//   { src: '/src/emojis/PepeHmm.gif', alt: 'Hmm' },
//   { src: '/src/emojis/pepejob.png', alt: 'Job' },
//   { src: '/src/emojis/peperun.gif', alt: 'Run' },
//   { src: '/src/emojis/pepelove.gif', alt: 'Love Heart' }
// ];

// const EmojiReaction: React.FC<EmojiReactionProps> = ({
//   contentId,
//   contentType,
//   initialReactions = [],
//   onReactionUpdate
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [reactions, setReactions] = useState<Reaction[]>(initialReactions);
//   const [userReaction, setUserReaction] = useState<string | null>(null);
//   const { theme } = useTheme();
//   const navigate = useNavigate();
  
//   // Fetch reactions for this content
//   const fetchReactions = useCallback(async () => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reactions/${contentType}/${contentId}`);
//       if (response.ok) {
//         const data = await response.json();
//         setReactions(data);
//         if (onReactionUpdate) {
//           onReactionUpdate(data);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching reactions:', error);
//     }
//   }, [contentId, contentType, onReactionUpdate]);

//   // Check if user has already reacted
//   const checkUserReaction = useCallback(async () => {
//     const token = localStorage.getItem('Token');
//     if (!token) return;
    
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reactions/user/${contentType}/${contentId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         if (data && data.emoji) {
//           setUserReaction(data.emoji);
//         }
//       }
//     } catch (error) {
//       console.error('Error checking user reaction:', error);
//     }
//   }, [contentId, contentType]);

//   useEffect(() => {
//     fetchReactions();
//     checkUserReaction();
//   }, [fetchReactions, checkUserReaction]);

//   // Update reactions when initialReactions changes
//   useEffect(() => {
//     if (initialReactions && initialReactions.length > 0) {
//       setReactions(initialReactions);
//     }
//   }, [initialReactions]);

//   const handleEmojiClick = async (emoji: string) => {
//     const token = localStorage.getItem('Token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reactions`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           contentId,
//           contentType,
//           emoji
//         })
//       });

//       if (response.ok) {
//         fetchReactions();
//         setUserReaction(emoji);
//         setIsOpen(false);
//       }
//     } catch (error) {
//       console.error('Error adding reaction:', error);
//     }
//   };

//   return (
//     <div className="relative">
//       <div className="flex items-center gap-2 flex-wrap">
//         {reactions.map((reaction, index) => {
//           const emojiData = emojis.find(e => e.alt === reaction.emoji);
//           if (!emojiData) return null;

//           const isUserReaction = userReaction === reaction.emoji;

//           return (
//             <motion.button
//               key={`${reaction.emoji}-${index}`}
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors duration-150 ${
//                 isUserReaction 
//                   ? theme === 'dark' 
//                     ? 'bg-blue-700/40 hover:bg-blue-600/40' 
//                     : 'bg-blue-100 hover:bg-blue-200'
//                   : theme === 'dark' 
//                     ? 'bg-gray-700 hover:bg-gray-600' 
//                     : 'bg-gray-100 hover:bg-gray-200'
//               }`}
//               onClick={() => handleEmojiClick(reaction.emoji)}
//             >
//               <img 
//                 src={emojiData.src} 
//                 alt={reaction.emoji}
//                 className="w-5 h-5"
//               />
//               <span className={`text-sm font-medium ${
//                 theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
//               }`}>
//                 {reaction.count}
//               </span>
//             </motion.button>
//           );
//         })}
        
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => setIsOpen(!isOpen)}
//           className={`p-2 rounded-full ${
//             theme === 'dark'
//               ? 'bg-gray-700 hover:bg-gray-600'
//               : 'bg-gray-100 hover:bg-gray-200'
//           } transition-colors`}
//         >
//           <Smile className={`w-5 h-5 ${
//             theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//           }`} />
//         </motion.button>
//       </div>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 10 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 10 }}
//             transition={{ duration: 0.2 }}
//             className={`absolute z-50 right-0 mt-2 p-3 rounded-xl shadow-xl grid grid-cols-5 gap-2 ${
//               theme === 'dark'
//                 ? 'bg-gray-800 border border-gray-700'
//                 : 'bg-white border border-gray-200'
//             }`}
//             style={{ width: '300px' }}
//           >
//             {emojis.map((emoji) => {
//               const isSelected = reactions.some(r => r.emoji === emoji.alt && userReaction === emoji.alt);
              
//               return (
//                 <motion.button
//                   key={emoji.alt}
//                   whileHover={{ scale: 1.2 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleEmojiClick(emoji.alt)}
//                   className={`p-1 rounded-lg transition-colors ${
//                     isSelected
//                       ? theme === 'dark' ? 'bg-blue-800/50' : 'bg-blue-100' 
//                       : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
//                   }`}
//                 >
//                   <img 
//                     src={emoji.src} 
//                     alt={emoji.alt}
//                     className="w-8 h-8"
//                   />
//                 </motion.button>
//               );
//             })}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default EmojiReaction;