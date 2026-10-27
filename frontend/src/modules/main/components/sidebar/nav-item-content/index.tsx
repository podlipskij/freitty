import { ReactNode } from 'react';

interface NavItemContentProps {
  icon: string;
  label: string;
  badge?: ReactNode;
}

export function NavItemContent({ icon, label, badge }: NavItemContentProps) {
  return (
    <>
      <span>{icon}</span>
      {label}
      {badge}
    </>
  );
}
