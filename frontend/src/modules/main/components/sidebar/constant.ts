export const NAV_ITEMS = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/orders', icon: '📦', label: 'Orders', withBadge: true, matches: ['/orders', '/order-detail'] },
  { href: '/settings', icon: '⚙️', label: 'Settings', disabled: true },
];
