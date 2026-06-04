'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

// --- CONFIGURATION ---
const REMINDER_DELAY = 60 * 60 * 1000; // 1 Hour
// ---------------------

declare global {
  interface Window {
    __paymentRedirectInProgress?: boolean;
  }
}

export default function EngagementManager() {
  const { cartCount } = useCart();
  const originalTitle = useRef<string>('');
  const swRegistration = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    originalTitle.current = document.title;

    // Reset payment redirect flag when page loads normally
    window.__paymentRedirectInProgress = false;
    sessionStorage.removeItem('payment_redirect_in_progress');

    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        swRegistration.current = reg;
        console.log('Service Worker Registered');
      });
    }

    // 2. Welcome Back Check
    const lastSeen = localStorage.getItem('last_seen');

    if (lastSeen && cartCount > 0) {
      const timeSince = Date.now() - parseInt(lastSeen);

      if (timeSince > REMINDER_DELAY) {
        setTimeout(() => {
          triggerNotification('Welcome Back! 🎒', {
            body: 'Your items are still waiting in your cart. Ready to complete your order?',
          });
        }, 2000);
      }
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        localStorage.setItem('last_seen', Date.now().toString());

        if (cartCount > 0) {
          document.title = `(${cartCount}) Items waiting... 🛒`;

          if (swRegistration.current?.active) {
            swRegistration.current.active.postMessage({
              type: 'SCHEDULE_NOTIFICATION',
              delay: REMINDER_DELAY,
              title: '8 GEARS | Deployment Pending',
              body: `You still have ${cartCount} items in your cart. Secure them before they're gone!`,
              tag: 'abandoned-cart',
            });
          }
        }
      } else {
        document.title = originalTitle.current;
        localStorage.setItem('last_seen', Date.now().toString());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cartCount]);

  const triggerNotification = (title: string, options: NotificationOptions) => {
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      window.Notification.permission === 'granted'
    ) {
      new window.Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        ...options,
      });
    }
  };

  // 4. Request Permission
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      window.Notification.permission === 'default' &&
      cartCount > 0
    ) {
      const timer = setTimeout(() => {
        window.Notification.requestPermission();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return null;
}