import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMessageToChat } from "@/services";
import { useToast } from "@/hooks";

export function useDefaultChat(chatId: string) {
	const queryClient = useQueryClient();
	const toast = useToast();

	const sendMessageMutation = useMutation({
		mutationFn: (message: string) => addMessageToChat(chatId, message),
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
