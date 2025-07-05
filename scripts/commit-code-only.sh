#!/bin/bash

# Script to commit only code files to GitHub
# This excludes large assets like album covers while keeping the code

echo "🎵 Committing code files to GitHub (excluding large assets)..."
echo "=================================================="

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Add all files except those in .gitignore
echo "📁 Adding files to staging area..."
git add .

# Check what's staged
echo "📋 Files staged for commit:"
git diff --cached --name-only

# Show size of staged files
echo ""
echo "📊 Size of staged files:"
git diff --cached --stat

# Ask for commit message
echo ""
read -p "💬 Enter commit message: " commit_message

if [ -z "$commit_message" ]; then
    commit_message="Update code files (exclude large assets)"
fi

# Commit the changes
echo "💾 Committing changes..."
git commit -m "$commit_message"

echo ""
echo "✅ Code files committed successfully!"
echo "📤 To push to GitHub, run: git push origin main"
echo ""
echo "💡 Note: Album cover images are excluded from this commit"
echo "   The app will use Spotify image URLs when deployed" 