import { Chat } from './chat.interface';

export interface User {
  id: string;
  fullName: string;
  userName: string;
  chats: Chat[];
}

// Additional interfaces to support the User interface
