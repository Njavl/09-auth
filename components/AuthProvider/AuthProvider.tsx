'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { checkSession, getMe, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import type { ReactNode } from 'react';

const PRIVATE_PATHS = ['/notes', '/profile'];

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();
  const [checking, setChecking] = useState(true);

  const isPrivate = PRIVATE_PATHS.some(path => pathname.startsWith(path));

  useEffect(() => {
    if (!isPrivate) {
      setChecking(false);
      return;
    }

    checkSession()
      .then(async ({ success }) => {
        if (success) {
          const user = await getMe();
          setUser(user);
        } else {
          await logout().catch(() => {});
          clearIsAuthenticated();
          router.push('/sign-in');
        }
      })
      .catch(() => {
        clearIsAuthenticated();
        router.push('/sign-in');
      })
      .finally(() => {
        setChecking(false);
      });
  }, [pathname]);

  if (isPrivate && checking) return <p>Loading...</p>;
  if (isPrivate && !isAuthenticated && !checking) return null;

  return <>{children}</>;
}

export default AuthProvider;
