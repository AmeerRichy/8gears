'use client';

// Share concurrent reads only. Never reuse a completed response across navigation.
let pending: Promise<Response> | undefined;

export function invalidateCategoryRequests() {
  pending = undefined;
}

export function fetchCategories(): Promise<Response> {
  if (!pending) {
    const request = fetch('/api/categories', { cache: 'no-store' });
    pending = request;
    const clear = () => {
      if (pending === request) pending = undefined;
    };
    void request.then(clear, clear);
  }
  // Each consumer needs its own body stream for response.json().
  return pending.then((response) => response.clone());
}
