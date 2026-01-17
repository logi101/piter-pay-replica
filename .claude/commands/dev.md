# /dev - Start Development Server

Start the PiterPay development server.

## Command
```bash
npm run dev -- -p 5178
```

## What it does
1. Starts Next.js development server on port 5178
2. Enables hot module replacement (HMR)
3. Compiles TypeScript on-the-fly
4. Watches for file changes

## Access
- Local: http://localhost:5178
- Network: http://[your-ip]:5178

## Notes
- PWA service worker is disabled in development mode
- Use `npm run build && npm start` to test PWA features
