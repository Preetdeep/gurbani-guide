#!/bin/bash

echo "🔄 Updating GitHub repository with latest changes..."

cd "$(dirname "$0")/.."

# Add all new files
git add .

# Create comprehensive commit
git commit -m "feat: Complete AI system with manual Gurbani database

- ✅ Working AI intent classification 
- ✅ 10 life categories with authentic verses
- ✅ 5 kathakar profiles with contemporary wisdom
- ✅ 7-layer response structure
- ✅ Complete testing suite
- ✅ Fallback responses for reliability
- 🎯 Ready for SGGS integration scaling

Components added:
- Manual Gurbani database (foundation)
- AI processing engine 
- Kathakar wisdom integration
- Complete test suite
- Setup automation scripts"

# Push to GitHub
git push origin main

echo "✅ GitHub repository updated successfully!"
echo "🔗 Check your repo to see all the new components"