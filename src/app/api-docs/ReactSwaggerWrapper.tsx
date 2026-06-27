"use client";

import dynamic from 'next/dynamic';

const ReactSwagger = dynamic(() => import('./ReactSwagger'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
    </div>
  ),
});

export default function ReactSwaggerWrapper({ spec }: { spec: Record<string, any> }) {
  return <ReactSwagger spec={spec} />;
}