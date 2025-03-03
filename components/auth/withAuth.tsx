'use client';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Define a base type for props that all wrapped components might need
type BaseWithAuthProps = {
  // Add common props here if needed
};

// Default to empty object if no specific props are needed
export default function withAuth<P extends BaseWithAuthProps = {}>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth(true);
    const router = useRouter();

    // Only include router in dependencies if it's actually used
    useEffect(() => {
      if (!loading && !user) {
        router.push('/auth/login');
      }
    }, [user, loading]); // Removed router from dependencies as it's stable

    if (loading || !user) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}