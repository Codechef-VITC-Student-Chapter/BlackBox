import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BLACKBOX | Core Vault',
  other: {
    'priority-1': 'module-2-repo',
    'priority-2': 'module-3-network',
    'priority-3': 'module-4-puzzle'
  }
};

export default function CoreVaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}