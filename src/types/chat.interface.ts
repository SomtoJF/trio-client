import { Message } from './message.interface';
import { Agent } from './agent.interface';
import { ChatType } from './chattype.enum';
export interface Chat {
  id: string; // UUID
  chatName: string;
  type: ChatType;
  messages: Message[];
  agents: Agent[];
}
