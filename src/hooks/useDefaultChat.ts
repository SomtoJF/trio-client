import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks";

export function useDefaultChat(chatId: string) {
	const queryClient = useQueryClient();
	const toast = useToast();

	const sendMessageMutation = useMutation({
		mutationFn: async (message: string) => message,
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
