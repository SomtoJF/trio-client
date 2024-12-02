'use client';

import { CiSettings } from 'react-icons/ci';
import { Chat, Message as MessageType, SenderTypeEnum } from '@trio/types';
import { v4 } from 'uuid';
import { Message } from './Message';
import { UpdateReflectionModal } from './UpdateReflectionModal';
import { useAuthStore, useReflectionChat } from '@trio/hooks';
import { PlaceholdersAndVanishInput } from '@/shadcn/ui/placeholders-and-vanish-input';
import { Skeleton } from '@/shadcn/ui/skeleton';
import { useState, useRef, useEffect } from 'react';
import { OptimalMessage } from './OptimalMessage';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@trio/query-key-factory';

const placeholders = [
  'How many Rs are in the word strawberry',
  'What should I do if my best friend is ignoring me?',
  'How do I get over a crush?',
  "What's the best way to handle rumors about me?",
  'How do I tell my parents I got a bad grade?',
];

export function ReflectionChatDisplay({ chat }: { chat: Chat }) {
  const { sendMessage } = useReflectionChat(chat.id);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>(chat.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: MessageType = {
      id: v4(),
      content: message,
      senderType: SenderTypeEnum.USER,
      sender: { username: currentUser?.userName },
    };

    setMessages((prev) => [...prev, userMessage]);
    setSending(true);

    const currentMessage = message;
    setMessage('');

    sendMessage({
      chatId: chat.id,
      content: currentMessage,
      onData: (data) => {
        const parsedData: {
          content: string;
          agentId: string;
          agentName: string;
        } = JSON.parse(data);
        console.log(parsedData);

        const newMessage: MessageType = {
          id: parsedData.agentId,
          content: parsedData.content,
          senderType: SenderTypeEnum.AGENT,
          sender: {
            name: parsedData.agentName,
          },
        };
        setMessages((prev) => [...prev, newMessage]);
      },
      onError: (error) => {
        console.error(error);
        setSending(false);
      },
      onComplete: () => {
        setSending(false);
        queryClient.invalidateQueries({
          queryKey: queryKeys.chat.getOne(chat.id),
        });
      },
    });
  };

  return (
    <>
      <div className="overflow-y-scroll w-full h-full flex flex-col gap-5 pb-20">
        <div className="text-white fixed font-semibold w-full text-sm sm:text-lg">
          <UpdateReflectionModal
            chat={chat}
            trigger={
              <button
                type="button"
                className="flex items-center gap-1 bg-transparent relative z-[9999]"
              >
                {chat.chatName}
                <CiSettings />
              </button>
            }
          />
        </div>
        {messages?.length > 0 &&
          messages.map((message, index) => {
            const isSameSender =
              index !== 0 &&
              messages[index - 1].sender.username === message.sender.username &&
              messages[index - 1].sender.name === message.sender.name;

            if (message.content.startsWith('agree')) return;
            else if (
              messages[index + 1]?.content.startsWith('agree') &&
              message.senderType === SenderTypeEnum.AGENT
            )
              return (
                <OptimalMessage
                  key={v4()}
                  senderType={message.senderType}
                  messageContent={message.content}
                  senderName={
                    isSameSender
                      ? undefined
                      : message.sender.username ?? message.sender.name
                  }
                />
              );
            else
              return (
                <Message
                  key={v4()}
                  senderType={message.senderType}
                  messageContent={message.content}
                  senderName={
                    isSameSender
                      ? undefined
                      : message.sender.username ?? message.sender.name
                  }
                />
              );
          })}
        <div ref={messagesEndRef} />
        {sending ? (
          <div className="text-white font-bold text-xs animate-pulse">
            ...thinking
          </div>
        ) : (
          ''
        )}
      </div>

      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
        disabled={sending}
      />
    </>
  );
}
