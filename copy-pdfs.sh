#!/bin/bash

# Copy PDFs from dist to public folder
echo "📄 Copying PDF files..."

# Check if source files exist
if [ ! -f "dist/Privacy Policy Mafutapass.pdf" ]; then
    echo "❌ Error: Privacy Policy PDF not found in dist/"
    exit 1
fi

if [ ! -f "dist/Terms of Service for MafutaPass.pdf" ]; then
    echo "❌ Error: Terms of Service PDF not found in dist/"
    exit 1
fi

# Copy files
cp "dist/Privacy Policy Mafutapass.pdf" "public/privacy-policy.pdf"
cp "dist/Terms of Service for MafutaPass.pdf" "public/terms-of-service.pdf"

echo "✅ PDFs copied successfully!"
echo "   - public/privacy-policy.pdf"
echo "   - public/terms-of-service.pdf"
echo ""
echo "🚀 Ready to test! Run: npm run dev"
