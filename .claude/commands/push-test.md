# /push-test - Test Push Notifications

Test push notification functionality.

## Prerequisites
1. VAPID keys configured in `.env.local`
2. Service worker registered
3. User has granted notification permission

## Testing Steps

### 1. Enable Push Notifications
- Open app in browser
- Go to Settings or Profile
- Click "Enable Push Notifications"
- Accept browser permission prompt

### 2. Verify Subscription
```javascript
// In browser console
const registration = await navigator.serviceWorker.getRegistration('/sw-push.js');
const subscription = await registration.pushManager.getSubscription();
console.log('Subscription:', subscription);
```

### 3. Send Test Notification
Via Supabase Edge Function:
```bash
curl -X POST \
  'https://gjodmuxsdkjqhkqjkmnp.supabase.co/functions/v1/send-push-notification' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "user-uuid",
    "title": "Test Notification",
    "body": "This is a test push notification"
  }'
```

### 4. Check Subscription in Database
```sql
SELECT * FROM push_subscriptions
WHERE project_id = 'piterpay'
ORDER BY created_at DESC
LIMIT 5;
```

## iOS Notes
- Push only works when app is installed as PWA
- Must be running in standalone mode
- Safari 16.4+ required

## Troubleshooting
- Check browser console for errors
- Verify VAPID keys match in `.env.local` and Supabase secrets
- Ensure service worker is registered at `/sw-push.js`
