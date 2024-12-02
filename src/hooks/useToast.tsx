import { toast } from 'sonner';

export function useToast() {
  return {
    success: (message: string) =>
      toast(message, { className: 'text-green-500' }),
    error: (message: string) =>
      toast(message, {
        className: 'text-red-500',
      }),
    warning: (message: string) =>
      toast(message, {
        className: 'text-yellow-500',
      }),
  };
}
