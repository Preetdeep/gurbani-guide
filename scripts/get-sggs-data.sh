#!/bin/bash

echo "🚀 Getting complete SGGS data using npm method..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Create temporary directory for npm installation
mkdir -p temp-download
cd temp-download

# Initialize npm project and install ShabadOS database
echo "📦 Installing ShabadOS database via npm..."
npm init -y
npm install @shabados/database

# The database file will be in node_modules/@shabados/database/
echo "📋 Locating database file..."
find node_modules/@shabados/database -name "*.db" -o -name "*.sqlite" -o -name "*.sqlite3"

# Copy to our data directory
echo "📂 Copying database to project..."
mkdir -p ../data/gurbani/raw
cp node_modules/@shabados/database/*.db ../data/gurbani/raw/ 2>/dev/null || true
cp node_modules/@shabados/database/*.sqlite ../data/gurbani/raw/ 2>/dev/null || true
cp node_modules/@shabados/database/*.sqlite3 ../data/gurbani/raw/ 2>/dev/null || true

# Also get any JSON files
cp node_modules/@shabados/database/*.json ../data/gurbani/raw/ 2>/dev/null || true

# List what we got
echo "✅ Files downloaded:"
ls -la ../data/gurbani/raw/

# Alternative: Try direct download from releases
echo "🔄 Trying alternative direct download..."
cd ../data/gurbani/raw

# Try different release URLs
curl -L "https://api.github.com/repos/shabados/database/releases/latest" | grep "browser_download_url.*\.db" | cut -d '"' -f 4 | xargs -I {} curl -L {} -o shabados-release.db

# Also try the npm package database location
echo "🔍 Checking npm package contents..."
cd ../../../temp-download
find . -name "*.db" -exec cp {} ../data/gurbani/raw/shabados-npm.db \;

# Clean up
cd ..
rm -rf temp-download

echo "🎯 Database acquisition complete!"
echo "📊 Final files in data/gurbani/raw/:"
ls -la data/gurbani/raw/
