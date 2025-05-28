// import { Reaction } from '../../types/Userdatatypes';

// interface AddReactionRequest {
//   contentId: number;
//   contentType: 'free' | 'vip';
//   emoji: string;
// }

// const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// export const fetchReactions = async (contentType: string, contentId: number): Promise<Reaction[]> => {
//   try {
//     const response = await fetch(`${BASE_URL}/reactions/${contentType}/${contentId}`);
    
//     if (!response.ok) {
//       throw new Error('Failed to fetch reactions');
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching reactions:', error);
//     return [];
//   }
// };

// export const addReaction = async (data: AddReactionRequest): Promise<Reaction | null> => {
//   const token = localStorage.getItem('Token');
  
//   if (!token) {
//     throw new Error('Authentication required');
//   }
  
//   try {
//     const response = await fetch(`${BASE_URL}/reactions`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to add reaction');
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error adding reaction:', error);
//     return null;
//   }
// };

// export const getUserReaction = async (contentType: string, contentId: number): Promise<Reaction | null> => {
//   const token = localStorage.getItem('Token');
  
//   if (!token) {
//     return null;
//   }
  
//   try {
//     const response = await fetch(`${BASE_URL}/reactions/user/${contentType}/${contentId}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });
    
//     if (!response.ok) {
//       if (response.status === 404) {
//         // No reaction found, this is normal
//         return null;
//       }
//       throw new Error('Failed to get user reaction');
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error getting user reaction:', error);
//     return null;
//   }
// };