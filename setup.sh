#!/bin/bash

# Gurbani Guide Setup Script
# This script sets up the complete development environment

set -e

echo "🙏 Setting up Gurbani Guide project..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ $NODE_VERSION -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) found"

# Create .env file from example
print_status "Setting up environment configuration..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    print_warning "Created backend/.env from example. Please update with your API keys."
else
    print_status "backend/.env already exists"
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
print_success "Backend dependencies installed"

# Go back to root
cd ..

# Make scripts executable
print_status "Making scripts executable..."
chmod +x scripts/start-whatsapp-bot.js
chmod +x scripts/data-collection/collect-content.js
chmod +x scripts/processing/process-data.js
print_success "Scripts are now executable"

# Create logs directory
print_status "Creating logs directory..."
mkdir -p backend/logs
print_success "Logs directory created"

# Display setup completion
echo ""
print_success "🎉 Gurbani Guide setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your API keys:"
echo "   - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
echo "   - OPENAI_API_KEY"
echo ""
echo "2. Set up your Supabase database with the required tables"
echo ""
echo "3. Start the development server:"
echo "   cd backend && npm run dev"
echo ""
echo "4. Start the WhatsApp bot (optional):"
echo "   node scripts/start-whatsapp-bot.js"
echo ""
echo "📚 Documentation:"
echo "   - API docs: docs/api-documentation.md"
echo "   - Content guidelines: docs/content-guidelines.md"
echo "   - Research notes: docs/research-notes.md"
echo ""
print_success "Happy coding! 🙏"
