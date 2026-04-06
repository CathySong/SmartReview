#!/bin/bash

echo "🚀 Push to SmartReview GitHub Repository"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized"
    exit 1
fi

echo "📦 Current commit:"
git log --oneline -1
echo ""

echo "📁 Project files:"
echo "----------------"
ls -la | grep -E "\.(ts|tsx|js|json|md|sh)$" | head -10
echo "... and more files"
echo ""

echo "🔗 To push to your SmartReview repository:"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   https://github.com/new"
echo "   Name: SmartReview"
echo "   Description: QR/NFC Google Review Generator with AI"
echo "   DO NOT initialize with README"
echo ""
echo "2. Copy the repository URL (should look like):"
echo "   https://github.com/YOUR_USERNAME/SmartReview.git"
echo ""
echo "3. Run these commands:"
echo ""
echo "   cd ~/google-review-generator"
echo "   git remote add origin https://github.com/YOUR_USERNAME/SmartReview.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. After pushing, deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import from GitHub"
echo "   - Add environment variables"
echo "   - Deploy!"
echo ""
echo "📋 Required environment variables for Vercel:"
echo "--------------------------------------------"
echo "OPENAI_API_KEY=your_openai_api_key"
echo "GOOGLE_API_KEY=your_google_api_key"
echo "GOOGLE_PLACE_ID=your_google_place_id"
echo "BUSINESS_NAME='Your Business Name'"
echo "BUSINESS_TYPE='restaurant'"
echo "NEXTAUTH_URL=https://your-app.vercel.app"
echo "NEXTAUTH_SECRET=random_string_here"
echo ""
echo "🎯 Ready to deploy!"