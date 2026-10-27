import { createBrowserRouter, Navigate } from 'react-router';
import { MainLayout, NotFound, useMainStore } from '@/modules/main';
import { onUnauthorized } from '@/services/api/client';
import { LOGIN_PATH } from '@/services/api/constant';

export const router = createBrowserRouter([
  {
    path: LOGIN_PATH,
    HydrateFallback: () => null,
    lazy: async () => ({ Component: (await import('@/modules/auth')).LoginPage }),
  },
  {
    path: '/',
    Component: MainLayout,
    HydrateFallback: () => null,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        lazy: async () => ({ Component: (await import('@/modules/dashboard')).DashboardPage }),
      },
      {
        path: 'orders',
        lazy: async () => ({ Component: (await import('@/modules/order-list')).OrderListPage }),
      },
      {
        path: 'order-detail/:number',
        lazy: async () => ({ Component: (await import('@/modules/order-detail')).OrderDetailPage }),
      },
      { path: '*', Component: NotFound },
    ],
  },
]);

onUnauthorized(() => {
  const { pathname, search } = router.state.location;
  if (pathname === LOGIN_PATH) {
    return;
  }

  useMainStore.getState().reset();
  const next = pathname === '/' ? '' : `?${new URLSearchParams({ next: `${pathname}${search}` })}`;
  router.navigate(`${LOGIN_PATH}${next}`, { replace: true });
});
