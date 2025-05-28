export interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: string;
}

export interface FavoriteContent {
  id: string;
  title: string;
}

export interface Userdatatypes {
  id?: number
  name: string;
  email: string;
  isVip: boolean;
  vipExpirationDate: number;
  lastLogin: string;
  recentlyViewed: string[];
  transactions: Transaction[];
  favorites: FavoriteContent[];
  stripeSubscriptionId: string
  profileImage: any,
  username: string,
  createdAt: string
}

export type LinkItem = {
  id: number;
  name: string;
  link: string;
  slug: string;

  category?: string
  createdAt: string;
};

export type Reaction = {
  emoji: string;
  count: number;
};

export type LinkItemWithReactions = LinkItem & {
  reactions: Reaction[];
};
