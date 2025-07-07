#!/bin/bash

# Flimmer Family Safety - Complete Demo Quick Start
# This script launches the entire ecosystem: web dashboard and mobile app.

set -e

# --- Colors for Output ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# --- Helper Functions ---
print_header() {
    echo -e "${GREEN}==========================================${NC}"
    echo -e "${GREEN}     Flimmer Complete Demo Environment    ${NC}"
    echo -e "${GREEN}==========================================${NC}"
    echo ""
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[ACTION REQUIRED]${NC} $1"
}

# --- Main Script ---

print_header

# 1. Check Dependencies
print_status "Checking for required tools (pnpm, node)..."
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Please install it first: npm install -g pnpm"
    exit 1
fi
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install it first."
    exit 1
fi
print_success "All required tools are available."
echo ""

# 2. Install Dependencies
print_status "Ensuring all dependencies are installed..."
pnpm install
print_success "All packages are up to date."
echo ""

# 3. Build Next.js App (for a more stable production-like demo)
print_status "Creating a production build of the web dashboard..."
pnpm --filter nextjs-poc build
print_success "Web dashboard built successfully."
echo ""

# 4. Display Instructions
cat << EOF

🚀 LAUNCHING...

Here's how to get ready for the live demo:

1.  **Prepare Your Phones**:
    -   Have both an **iPhone** and an **Android** device ready.
    -   Install the **"Expo Go"** app from the App Store / Play Store on both devices.

2.  **Web Dashboard**:
    -   A browser tab will open automatically, but if not, navigate to:
    -   **http://localhost:3000**

3.  **Mobile App**:
    -   A **QR code** will appear in your terminal shortly.
    -   Scan it with the Expo Go app (or the Camera app on iOS) on **both** your phones to open the Flimmer mobile app.

This setup will allow you to demonstrate the full, real-time, cross-platform experience.

EOF

# 5. Launch Servers
print_warning "Starting all servers now. Press Ctrl+C in this terminal to stop everything."
sleep 3

# Use the 'dev' script from the root package.json which runs both apps in parallel
pnpm dev 