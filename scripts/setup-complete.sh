#!/bin/bash

echo "🚀 Setting up complete Gurbani Guide system..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Install missing dependencies
echo "📦 Installing additional dependencies..."
cd backend
npm install sqlite3 --save

# Create the data processing script
echo "📝 Creating data processing script..."
mkdir -p scripts/data-processing
cat > scripts/data-processing/processSGGSData.js << 'EOF'
// [The processSGGSData.js content from the artifact above]
EOF

# Create the AI processing engine
echo "🤖 Creating AI processing engine..."
cat > backend/src/ai-processing/gurbaniAI.js << 'EOF'
// [The gurbaniAI.js content from the artifact above]
EOF

# Download the data (if not already present)
echo "📊 Checking for SGGS data..."
if [ ! -f "data/gurbani/raw/shabados.db" ]; then
    echo "⬇️ Downloading ShabadOS database..."
    mkdir -p data/gurbani/raw
    curl -L https://github.com/shabados/database/releases/latest/download/shabados.db -o data/gurbani/raw/shabados.db
fi

# Process the data
echo "⚙️ Processing SGGS data..."
cd scripts/data-processing
node processSGGSData.js

# Start the server
echo "🚀 Starting development server..."
cd ../../backend
npm run dev

echo "✅ Setup complete! Server should be running on http://localhost:3000"
