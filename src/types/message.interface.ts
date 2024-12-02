export interface Message {
  id: string;
  content: string;
  senderType: SenderTypeEnum;
  senderId?: number;
  sender: any;
}

export enum SenderTypeEnum {
  USER = 'User',
  AGENT = 'Agent',
}
