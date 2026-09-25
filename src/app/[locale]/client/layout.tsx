import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Portal | Astraiv Technologies',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return children;
}
