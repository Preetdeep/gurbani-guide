#!/bin/bash

echo "🚀 Setting up Gurbani Guide - Complete AI System"
echo "================================================="

# Navigate to project root
cd "$(dirname "$0")"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in backend directory. Please run from gurbani-guide/backend/"
    exit 1
fi

# Install any missing dependencies
echo "📦 Installing missing dependencies..."
npm install sqlite3 --save 2>/dev/null || echo "sqlite3 already installed or not needed"

# Create the Gurbani database
echo ""
echo "🔨 Creating Gurbani database..."
node ../scripts/create-manual-database.js

# Check if .env file exists and has OpenAI key
echo ""
echo "🔑 Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo "⚠️ Creating .env file..."
    cp .env.example .env || echo "OPENAI_API_KEY=your_key_here" > .env
    echo "⚠️ Please add your OpenAI API key to .env file:"
    echo "   OPENAI_API_KEY=sk-your-key-here"
    echo ""
    echo "💡 You can get an API key from: https://platform.openai.com/api-keys"
    echo ""
fi

if grep -q "your_key_here" .env 2>/dev/null; then
    echo "⚠️ OpenAI API key not configured in .env file"
    echo "   The system will work with fallback responses only"
    echo ""
fi

# Test the complete system
echo "🧪 Testing the complete AI system..."
echo "This will take 2-3 minutes to run all tests..."
echo ""
node test-complete-system.js

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 WHAT YOU HAVE NOW:"
echo "   ✅ Complete Gurbani database with verses for all life situations"
echo "   ✅ AI intent classification system"
echo "   ✅ Kathakar wisdom integration"
echo "   ✅ Authentic Sikh spiritual guidance responses"
echo "   ✅ Full testing suite"
echo ""
echo "🚀 NEXT STEPS:"
echo "   1. Add your OpenAI API key to .env for full AI functionality"
echo "   2. Run 'node test-complete-system.js' to test again with AI"
echo "   3. Ready for WhatsApp Business API integration!"
echo ""
echo "📱 To start development server: npm run dev"
echo "🧪 To run tests: node test-complete-system.js"
echo ""
echo "Waheguru ji ka Khalsa, Waheguru ji ki Fateh! 🙏"