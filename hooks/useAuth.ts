import { useEffect, useState } from 'react';
import { getSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function useAuth(redirectIfUnauthenticated = false) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await getSession();
      if (data?.session) {
        setUser(data.session.user);
      } else if (redirectIfUnauthenticated) {
        router.push('/auth/login');
      }
      setLoading(false);
    };

    checkAuth();
  }, [redirectIfUnauthenticated, router]);

  return { user, loading };
} 