"use client";

import { useEffect } from 'react';

export function VisitorTracker() {
  useEffect(() => {
    if (!localStorage.getItem('hasVisited')) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/visitors/visit`, { method: 'POST' })
        .then(() => localStorage.setItem('hasVisited', 'true'))
        .catch(err => console.error(err));
    }
  }, []);

  return null;
}
