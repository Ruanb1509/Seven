import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
// import EmojiReaction from './EmojiReaction';
import { LinkItemWithReactions } from '../../types/Userdatatypes';

interface ContentItemProps {
  link: LinkItemWithReactions;
  isNew?: boolean;
}

const FreeContentItem: React.FC<ContentItemProps> = ({ link, isNew = false }) => {
  const { theme } = useTheme();

  const handleReactionUpdate = (updatedReactions: { emoji: string; count: number }[]) => {
    // This would update the parent component's state if needed
    console.log('Reactions updated:', updatedReactions);
  };

  return (
    <div
      className={`px-6 py-4 transition-colors duration-200 ${
        theme === 'dark' 
          ? 'hover:bg-gray-700/50' 
          : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex flex-col space-y-2">
        <Link
          to={`/free/${link.slug}`}
          className="flex items-center justify-between group"
        >
          <span className={`text-lg transition-colors duration-200 ${
            theme === 'dark'
              ? 'text-gray-200 group-hover:text-blue-400'
              : 'text-gray-700 group-hover:text-blue-600'
          }`}>
            {link.name}
          </span>
          {isNew && (
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
              NEW
            </span>
          )}
        </Link>
        
        <div className="flex justify-between items-center">
          {/* <EmojiReaction 
            contentId={link.id}
            contentType="free"
            initialReactions={link.reactions || []}
            onReactionUpdate={handleReactionUpdate}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default FreeContentItem;