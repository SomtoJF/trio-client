import { cn } from '@/lib/utils';
import { AiOutlineLoading } from 'react-icons/ai';

export function LoadingScreen({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-full h-screen flex justify-center items-center bg-neutral-950',
        className
      )}
    >
      <AiOutlineLoading className="animate-spin text-white" />
    </div>
  );
}
