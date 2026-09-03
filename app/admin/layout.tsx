import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administration',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
