import { useMainStore } from '@/modules/main';
import { Skeleton } from '@/ui/components/skeleton';

export function Welcome() {
  const { data: user, status } = useMainStore((state) => state.user);

  if (!user) return status === 'error' ? <>Welcome 👋</> : <Skeleton width={240} height={26} />;
  return <>Welcome, {user.name} 👋</>;
}
