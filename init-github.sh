#!/bin/bash

echo "🚀 GitHub Repository Initialization"
echo "==================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: Google Review Generator with QR/NFC scanning, AI review generation, and one-click Google submission"
    
    echo ""
    echo "✅ Git repository initialized!"
    echo ""
    echo "Next steps:"
    echo "1. Create a new repository on GitHub: https://github.com/new"
    echo "2. Don't initialize with README"
    echo "3. Copy the repository URL"
    echo "4. Run these commands:"
    echo ""
    echo "   git remote add origin https://github.com/YOUR_USERNAME/google-review-generator.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
else
    echo "Git repository already initialized."
    echo "Current status:"
    git status
fi

echo ""
echo "📁 Project Structure Created:"
echo "----------------------------"
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.md" | sort | head -20
echo "... and more!"

echo ""
echo "🎯 Ready for Deployment!"
echo "======================="
echo "1. Get API keys (OpenAI + Google)"
echo "2. Test locally: ./start.sh"
echo "3. Push to GitHub"
echo "4. Deploy on Vercel"
echo ""
echo "See SETUP_GUIDE.md for detailed instructions."