'use client';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type WithAuthProps = {
  // Add any specific props your wrapped components might need
  [key: string]: any;
};

export default function withAuth<P extends WithAuthProps>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth(true);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/auth/login');
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}