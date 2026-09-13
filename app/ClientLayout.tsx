'use client';

import React, { useState, useEffect } from 'react';
import App from '../src/App';
import '../src/index.css';

export default function ClientLayout() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <App />;
}
