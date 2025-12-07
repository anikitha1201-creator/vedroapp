'use client';

import dynamic from 'next/dynamic';

// Dynamically import the main experiment client component with SSR turned off.
// This prevents the hydration error caused by server-rendered IDs not matching client-rendered IDs.
const ExperimentClientPage = dynamic(
  () => import('./experiment-client-page'),
  { ssr: false }
);

export default function SandboxLoader() {
  return <ExperimentClientPage />;
}
