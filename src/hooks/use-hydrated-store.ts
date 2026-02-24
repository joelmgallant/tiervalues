import { useState, useEffect } from 'react';

export function useHydratedStore() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  return hydrated;
}
