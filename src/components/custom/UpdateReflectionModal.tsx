'use client';

import { useToast } from '@/libs/hooks/src';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { Chat, ChatType } from '@trio/types';
import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deleteChat, updateChat } from '@trio/services';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn/ui/form';
import { IoAddOutline } from 'react-icons/io5';
import { Select } from 'antd';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn/ui/dialog';
import { queryKeys } from '@trio/query-key-factory';
import { AiOutlineLoading, AiOutlineMinus } from 'react-icons/ai';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { useRouter } from 'next/navigation';

const chatTypes = Object.values(ChatType).map((type) => ({
  label: type,
  value: type,
}));

export function UpdateReflectionModal({
  trigger,
  chat,
}: {
  trigger: ReactNode;
  chat: Chat;
}) {
  const reflectionAgentSchema = z.object({
    name: z.string().min(2).max(20),
  });

  const reflectionFormSchema = z.object({
    chatName: z
      .string()
      .min(2, {
        message: 'Chat name must be at least 2 characters.',
      })
      .max(20),
    type: z.nativeEnum(ChatType),
    agents: z.array(reflectionAgentSchema),
  });

  const { push } = useRouter();
  const [agentCount, setAgentCount] = useState(chat.agents.length);
  const queryClient = useQueryClient();
  const toast = useToast();
  const form = useForm<z.infer<typeof reflectionFormSchema>>({
    resolver: zodResolver(reflectionFormSchema),
    defaultValues: {
      chatName: chat.chatName,
      type: chat.type,
      agents: chat.agents.map((agent) => {
        const { name } = agent;
        return {
          name,
        };
      }),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'agents',
  });

  const updateChatMutation = useMutation({
    mutationFn: (data: z.infer<typeof reflectionFormSchema>) =>
      updateChat(chat.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chat.getOne(chat.id),
      });
      toast.success('Chat updated');
    },
    onError: (error) => {
      toast.error(error.message);
      throw error;
    },
  });

  const deleteChatMutation = useMutation({
    mutationFn: (chatID: string) => deleteChat(chatID),
    onSuccess: () => {
      toast.success('Chat deleted');
      queryClient.invalidateQueries({
        queryKey: queryKeys.chat.all,
      });
      setTimeout(() => {
        push('/chat/new');
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message);
      throw error;
    },
  });

  const onSubmit = (values: z.infer<typeof reflectionFormSchema>) => {
    if (values.agents.length > 2) {
      toast.error('Cannot have more than two agents in a chat');
      return;
    }
    updateChatMutation.mutate(values);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className=" bg-white w-11/12 max-w-screen-sm  text-black ">
        <DialogHeader>
          <DialogTitle>Edit Chat</DialogTitle>
          <DialogDescription>
            Make changes to this chat here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white text-black p-4 rounded-sm w-full max-w-screen-sm max-h-[50vh] relative z-50"
          >
            <div className="w-full h-full space-y-5 overflow-y-scroll p-1">
              <FormField
                control={form.control}
                name="chatName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Chat Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter chat name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name of your chat.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Chat Type<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        placeholder="Select chat type"
                        className="h-9 w-full"
                        {...field}
                        options={chatTypes}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-gray-400 text-xs font-extrabold uppercase">
                Members (Agents)
              </div>
              {agentCount < 1 && (
                <FormDescription>
                  There are no agents in this chat
                </FormDescription>
              )}
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`agents.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Claudia" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant={'outline'}
                    className="text-xs"
                    onClick={() => {
                      remove(index);
                      setAgentCount(agentCount - 1);
                    }}
                  >
                    <AiOutlineMinus className="mr-2" />
                    Remove Agent
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="mr-4 text-xs"
                onClick={() => {
                  if (agentCount >= 2)
                    toast.warning('Cannot have more than two agents in a chat');
                  append({ name: '' });
                  setAgentCount(agentCount + 1);
                }} // Append a new agent
              >
                <IoAddOutline className="mr-2" />
                Add Agent
              </Button>
              <div className="w-full flex gap-2 flex-1">
                <Button
                  type="submit"
                  className="text-xs font-semibold w-full"
                  disabled={updateChatMutation.isPending}
                >
                  {updateChatMutation.isPending ? (
                    <AiOutlineLoading className="animate-spin" />
                  ) : (
                    'Save'
                  )}
                </Button>
                <Button
                  className="text-xs font-semibold bg-white text-red-500 w-full hover:bg-red-500 hover:text-white"
                  disabled={deleteChatMutation.isPending}
                  onClick={() => deleteChatMutation.mutate(chat.id)}
                >
                  {deleteChatMutation.isPending ? (
                    <AiOutlineLoading className="animate-spin" />
                  ) : (
                    'Delete Chat'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
