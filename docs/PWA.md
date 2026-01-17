# PiterPay PWA Documentation

## Overview
PiterPay is a Progressive Web App (PWA) that can be installed on mobile devices and desktops, with offline support and push notifications.

## PWA Features

### Installable
- Add to Home Screen on mobile
- Install as desktop app
- Launch in standalone mode

### Offline Support
- Service worker caches static assets
- Basic offline functionality
- Network-first strategy for data

### Push Notifications
- Real-time budget alerts
- Transaction reminders
- Customizable notification preferences

## Configuration Files

### manifest.json
```json
{
  "name": "PiterPay",
  "short_name": "PiterPay",
  "description": "Personal Finance Management",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### next.config.ts
```typescript
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

export default withPWA(nextConfig);
```

## Push Notifications

### Architecture
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Browser   │────▶│ Push Service │────▶│   Browser   │
│  (Client)   │     │   (Google/   │     │  (Service   │
│             │     │   Apple)     │     │   Worker)   │
└─────────────┘     └──────────────┘     └─────────────┘
       │                                        │
       │ Subscribe                              │ Show
       ▼                                        ▼
┌─────────────┐                          ┌─────────────┐
│  Supabase   │─────────────────────────▶│   User      │
│  (Backend)  │      Send Push           │             │
└─────────────┘                          └─────────────┘
```

### VAPID Keys
Generate keys for push notifications:
```bash
npx web-push generate-vapid-keys
```

### Service Worker (sw-push.js)
```javascript
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data.url
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
```

### Subscribing to Push
```typescript
const { subscribe } = usePushNotifications();

const handleSubscribe = async () => {
  try {
    await subscribe();
    console.log('Subscribed to push notifications');
  } catch (error) {
    console.error('Failed to subscribe:', error);
  }
};
```

## iOS Specific

### Requirements
- Safari 16.4+ required
- Must be installed as PWA (Add to Home Screen)
- Push only works in standalone mode

### Detection
```typescript
const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isPWA = window.matchMedia('(display-mode: standalone)').matches
           || navigator.standalone === true;

// iOS push only supported in PWA mode
const canUsePush = !isiOS || (isiOS && isPWA);
```

### User Guidance
```tsx
{isiOS && !isPWA && (
  <div className="alert">
    To receive notifications on iOS:
    1. Tap the Share button
    2. Select "Add to Home Screen"
    3. Open the app from your home screen
  </div>
)}
```

## Testing PWA Features

### In Development
- PWA features are disabled in dev mode
- Use production build to test:
```bash
npm run build && npm start
```

### Lighthouse Audit
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Check "Progressive Web App"
4. Run audit

### Manual Testing
- [ ] App installs correctly
- [ ] Offline mode works
- [ ] Push notifications received
- [ ] Icons display correctly
- [ ] Splash screen shows

## Common Issues

### PWA Not Installable
- Check HTTPS is enabled
- Verify manifest.json is accessible
- Ensure service worker registers

### Push Not Working
- Check VAPID keys are correct
- Verify notification permission granted
- Check service worker is active

### iOS Issues
- Must be in standalone mode
- Safari version must be 16.4+
- Check push subscription saved

## Debugging

### Service Worker
```javascript
// Check registration
navigator.serviceWorker.getRegistration('/sw-push.js')
  .then(reg => console.log('SW:', reg));

// Check subscription
navigator.serviceWorker.ready
  .then(reg => reg.pushManager.getSubscription())
  .then(sub => console.log('Subscription:', sub));
```

### Manifest
```javascript
// Check if installable
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA is installable');
});
```
