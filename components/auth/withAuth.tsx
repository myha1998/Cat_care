'use client';
import { useAuth } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface WithAuthProps {
  [key: string]: unknown;
}

export default function withAuth(Component: React.ComponentType<WithAuthProps>) {
  return function AuthenticatedComponent(props: WithAuthProps) {
    const { user, loading } = useAuth(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    useEffect(() => {
      try {
        if (!loading && !user) {
          router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/auth/login');
      }
    }, [user, loading, router, callbackUrl]);

    if (loading || !user) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}