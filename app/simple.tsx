'use client';

import { useState } from 'react';

export default function SimplePage() {
  const [message] = useState('Simple page loaded');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Test Page</h1>
      <p className="mb-4">{message}</p>
      <p>This is a simple test page to check if Next.js is working.</p>
    </div>
  );
}