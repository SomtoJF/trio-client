// Similar to useDefaultChat, but implement streaming logic here

import { useToast } from "@/hooks";
import { addMessageToChat, streamCompletions } from "@/services";
import { QueryClient, useMutation } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function useReflectionChat(chatId: string) {
	const toast = useToast();

	const sendMessageMutation = useMutation({
		mutationFn: ({
			chatId,
			content,
			onData,
			onError,
			onComplete,
		}: {
			chatId: string;
			content: string;
			onData: (data: string) => void;
			onError: (error: string) => void;
			onComplete: () => void;
		}) => streamCompletions(chatId, content, onData, onError, onComplete),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["chat", chatId],
			});
		},
		onError: (error) => {
			toast.error(error.message);
			throw error;
		},
	});

	return { sendMessage: sendMessageMutation.mutate };
}
