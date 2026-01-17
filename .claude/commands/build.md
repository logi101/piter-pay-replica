# /build - Build for Production

Build the PiterPay application for production deployment.

## Command
```bash
npm run build
```

## What it does
1. Compiles TypeScript to JavaScript
2. Bundles and minifies code
3. Generates PWA service worker
4. Creates optimized production build
5. Outputs to `.next/` directory

## Pre-build checks
- Run `npx tsc --noEmit` to check for type errors
- Run `npm test` to ensure tests pass

## Post-build
- Run `npm start` to serve the production build locally
- Check `.next/` directory size for bundle analysis
