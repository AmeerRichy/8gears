'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { usePathname } from 'next/navigation';

// --- CONFIGURATION ---
const REMINDER_DELAY = 60 * 60 * 1000; // 1 Hour (Set to 10 * 1000 for a 10-second test)
// ---------------------

export default function EngagementManager() {
  const { cartCount } = useCart();
  const pathname = usePathname();
  const originalTitle = useRef<string>('');
  const swRegistration = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    originalTitle.current = document.title;

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
        // They've been gone for a while, show "Welcome Back"
        setTimeout(() => {
          triggerNotification("Welcome Back! 🎒", {
            body: `Your items are still waiting in your cart. Ready to complete your order?`,
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
          
          // 3. Send message to Service Worker to notify in 1 hour
          // This works better if the tab is closed because the SW is a separate process
          if (swRegistration.current?.active) {
            swRegistration.current.active.postMessage({
              type: 'SCHEDULE_NOTIFICATION',
              delay: REMINDER_DELAY,
              title: "8 GEARS | Deployment Pending",
              body: `You still have ${cartCount} items in your cart. Secure them before they're gone!`,
              tag: 'abandoned-cart'
            });
          }
        }
      } else {
        document.title = originalTitle.current;
        localStorage.setItem('last_seen', Date.now().toString());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [cartCount]);

  const triggerNotification = (title: string, options: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        ...options
      });
    }
  };

  // 4. Request Permission
  useEffect(() => {
    if (typeof window !== 'undefined' && Notification.permission === 'default' && cartCount > 0) {
      const timer = setTimeout(() => {
        Notification.requestPermission();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // 5. BeforeUnload Warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pathname.includes('/checkout') && cartCount > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pathname, cartCount]);

  return null;
}
