#!/bin/bash

# PWA Icon Generator for Mafuta
# This script creates placeholder icons - replace with your actual logo later

echo "🎨 Creating PWA icons..."

# Create public directory if it doesn't exist
mkdir -p public

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick not found. Please do ONE of the following:"
    echo ""
    echo "Option 1 - Install ImageMagick (Recommended):"
    echo "  brew install imagemagick"
    echo "  Then run: ./generate-pwa-icons.sh"
    echo ""
    echo "Option 2 - Use Online Tool (Quick):"
    echo "  1. Go to: https://www.pwabuilder.com/imageGenerator"
    echo "  2. Upload your logo (or use a placeholder)"
    echo "  3. Download the icon pack"
    echo "  4. Extract and copy all PNG files to public/ folder"
    echo ""
    echo "Option 3 - Manual (Temporary):"
    echo "  Create these files manually in public/ folder:"
    echo "    - pwa-192x192.png (192x192 pixels)"
    echo "    - pwa-512x512.png (512x512 pixels)"
    echo "    - pwa-maskable-192x192.png (192x192 pixels)"
    echo "    - pwa-maskable-512x512.png (512x512 pixels)"
    echo "    - apple-touch-icon.png (180x180 pixels)"
    echo ""
    exit 1
fi

# Create a simple colored square as placeholder
# You should replace this with your actual logo

# 192x192 icon
convert -size 192x192 xc:'#3b82f6' \
  -gravity center \
  -pointsize 80 \
  -fill white \
  -annotate +0+0 'M' \
  public/pwa-192x192.png

# 512x512 icon
convert -size 512x512 xc:'#3b82f6' \
  -gravity center \
  -pointsize 200 \
  -fill white \
  -annotate +0+0 'M' \
  public/pwa-512x512.png

# 192x192 maskable (with padding)
convert -size 192x192 xc:'#3b82f6' \
  -gravity center \
  -pointsize 60 \
  -fill white \
  -annotate +0+0 'M' \
  public/pwa-maskable-192x192.png

# 512x512 maskable (with padding)
convert -size 512x512 xc:'#3b82f6' \
  -gravity center \
  -pointsize 160 \
  -fill white \
  -annotate +0+0 'M' \
  public/pwa-maskable-512x512.png

# Apple touch icon (180x180)
convert -size 180x180 xc:'#3b82f6' \
  -gravity center \
  -pointsize 70 \
  -fill white \
  -annotate +0+0 'M' \
  public/apple-touch-icon.png

echo "✅ PWA icons created!"
echo ""
echo "📝 Note: These are placeholder icons with the letter 'M'."
echo "   Replace them with your actual logo by:"
echo "   1. Creating a 512x512px logo"
echo "   2. Using https://www.pwabuilder.com/imageGenerator"
echo "   3. Downloading and replacing the files in public/ folder"
echo ""
echo "🚀 Now run: npm run build && vercel deploy --prod"
