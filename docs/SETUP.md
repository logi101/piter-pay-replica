# PiterPay Setup Guide

## Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn
- Git
- Code editor (VS Code recommended)

## Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd piter-pay-replica
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create `.env.local` file:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://gjodmuxsdkjqhkqjkmnp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# PiterPay Bot User
PITERPAY_BOT_EMAIL=bot_piterpay@non.local
PITERPAY_BOT_PASSWORD=PiterPay2024!Secure
PITERPAY_PROJECT_ID=piterpay

# VAPID Keys for Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

### 4. Start Development Server
```bash
npm run dev -- -p 5178
```

### 5. Open in Browser
Navigate to http://localhost:5178

## Development Environment

### VS Code Extensions (Recommended)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- Error Lens

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Database Setup

### Option 1: Use Existing Supabase Project
The project is configured to use the shared Supabase instance with multi-tenant isolation.

### Option 2: Create New Supabase Project
1. Create project at https://supabase.com
2. Run migrations from `supabase/migrations/` (if exists)
3. Update `.env.local` with new credentials

### Run Database Migrations
Via Supabase Dashboard:
1. Go to SQL Editor
2. Run migration files in order

## PWA Setup

### Generate VAPID Keys
```bash
npx web-push generate-vapid-keys
```

### Update Environment
Add generated keys to `.env.local`:
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

### Update Supabase Secrets
In Supabase Dashboard → Settings → Secrets:
- Add `VAPID_PUBLIC_KEY`
- Add `VAPID_PRIVATE_KEY`

## Testing Setup

### Install Playwright Browsers
```bash
npx playwright install
```

### Run Tests
```bash
npm test
```

## Building for Production

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm start
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables in Production
Ensure all `.env.local` variables are set in your deployment platform.

## Troubleshooting

### Common Issues

#### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Type errors
```bash
npx tsc --noEmit
```

#### Build errors
```bash
rm -rf .next
npm run build
```

#### PWA not working
- PWA only works in production build
- Check HTTPS is enabled
- Verify manifest.json is accessible

### Getting Help
- Check `docs/` for documentation
- Review `.claude/skills/` for guidance
- Check browser console for errors
