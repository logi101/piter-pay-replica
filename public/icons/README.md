# PiterPay PWA Icons

## Available Icons

- `icon.svg` - Main app icon (any size)
- `icon-maskable.svg` - Maskable icon for Android adaptive icons
- `apple-touch-icon.svg` - iOS home screen icon

## Generating PNG Icons

To generate PNG icons from SVG for better compatibility, you can use:

### Using ImageMagick
```bash
# Install ImageMagick
brew install imagemagick

# Generate PNGs
convert -background none icons/icon.svg -resize 192x192 icon-192.png
convert -background none icons/icon.svg -resize 512x512 icon-512.png
convert -background none icons/apple-touch-icon.svg -resize 180x180 apple-touch-icon.png
```

### Using Sharp (Node.js)
```javascript
const sharp = require('sharp');

// Generate 192x192
sharp('public/icons/icon.svg')
  .resize(192, 192)
  .png()
  .toFile('public/icon-192.png');

// Generate 512x512
sharp('public/icons/icon.svg')
  .resize(512, 512)
  .png()
  .toFile('public/icon-512.png');
```

### Online Tools
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

## Icon Requirements

| Icon | Size | Purpose |
|------|------|---------|
| icon-192.png | 192x192 | Android home screen |
| icon-512.png | 512x512 | Splash screen, store listing |
| apple-touch-icon.png | 180x180 | iOS home screen |
| favicon.ico | 32x32 | Browser tab |

## Maskable Icons

Maskable icons should have:
- Safe zone: 80% of icon (center)
- Important content within 80% circle
- Full background color (no transparency)
