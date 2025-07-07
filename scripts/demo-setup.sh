#!/bin/bash

# Flimmer Monorepo - Complete Demo Setup Script
# This script prepares both web and mobile apps for demonstration

set -e

echo "Flimmer Complete Demo Setup"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

print_header() {
    echo -e "${PURPLE}=== $1 ===${NC}"
}

# Get script directory and project paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
NEXTJS_DIR="$ROOT_DIR/nextjs-poc"
MOBILE_DIR="$ROOT_DIR/flimmer-mobile"

# Check if we're in the right directory
if [ ! -f "$ROOT_DIR/package.json" ] && [ ! -f "$ROOT_DIR/pnpm-workspace.yaml" ]; then
    print_error "Please run this script from the flimmer-challenge root directory"
    exit 1
fi

# Validate project structure
if [ ! -d "$NEXTJS_DIR" ] || [ ! -f "$NEXTJS_DIR/package.json" ]; then
    print_error "NextJS project not found at: $NEXTJS_DIR"
    exit 1
fi

if [ ! -d "$MOBILE_DIR" ] || [ ! -f "$MOBILE_DIR/package.json" ]; then
    print_error "Mobile project not found at: $MOBILE_DIR"
    exit 1
fi

print_status "Demo setup for complete Flimmer ecosystem"
print_status "NextJS: $NEXTJS_DIR"
print_status "Mobile: $MOBILE_DIR"

# Check Node.js version
print_status "Checking Node.js version..."
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js 18+ required. Current version: $(node --version)"
    exit 1
fi
print_success "Node.js version OK: $(node --version)"

# Check package manager
print_status "Detecting package manager..."
if [ -f "$ROOT_DIR/pnpm-lock.yaml" ]; then
    PACKAGE_MANAGER="pnpm"
elif [ -f "$ROOT_DIR/yarn.lock" ]; then
    PACKAGE_MANAGER="yarn"
else
    PACKAGE_MANAGER="npm"
fi
print_success "Using package manager: $PACKAGE_MANAGER"

# Check if Expo CLI is installed
print_status "Checking Expo CLI..."
if ! command -v expo &> /dev/null; then
    if command -v npx &> /dev/null; then
        print_success "Expo CLI available via npx: $(npx expo --version)"
    else
        print_warning "Expo CLI not found. Installing..."
        npm install -g @expo/cli
        print_success "Expo CLI ready: $(npx expo --version)"
    fi
else
    print_success "Expo CLI ready: $(expo --version)"
fi

# Install dependencies for both projects
print_header "Installing Dependencies"

print_status "Installing root dependencies..."
cd "$ROOT_DIR"
$PACKAGE_MANAGER install

print_status "Installing NextJS dependencies..."
cd "$NEXTJS_DIR"
$PACKAGE_MANAGER install

print_status "Installing mobile dependencies..."
cd "$MOBILE_DIR"
$PACKAGE_MANAGER install

print_success "All dependencies installed"

# Check platform requirements
print_header "Checking Platform Requirements"

# Check for iOS requirements (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v xcodebuild &> /dev/null; then
        XCODE_VERSION=$(xcodebuild -version | head -n1)
        print_success "Xcode found: $XCODE_VERSION"
    else
        print_warning "Xcode not found. iOS development not available."
    fi
    
    if command -v fastlane &> /dev/null; then
        print_success "Fastlane ready: $(fastlane --version | head -n1)"
    else
        print_warning "Fastlane not found. Run: gem install fastlane"
    fi
else
    print_warning "Not on macOS. iOS development not available."
fi

# Check for Android requirements
if command -v adb &> /dev/null; then
    print_success "Android SDK found"
else
    print_warning "Android SDK not found. Android development may not work."
fi

# Setup demo environment
print_header "Setting Up Demo Environment"

cd "$MOBILE_DIR"

# Create demo directories
mkdir -p builds/ios/dev
mkdir -p builds/android/demo
mkdir -p e2e/artifacts

# Create demo assets if they don't exist
if [ ! -f "assets/icon.png" ]; then
    print_warning "Demo assets not found. Creating placeholders..."
    mkdir -p assets
    echo "Add your app icon to assets/icon.png" > assets/README.txt
fi

print_success "Demo environment ready"

# Function to start web dashboard
start_web_dashboard() {
    print_status "Starting NextJS web dashboard..."
    cd "$NEXTJS_DIR"
    
    # Start NextJS in background
    $PACKAGE_MANAGER run dev &
    WEB_PID=$!
    
    # Wait for web server to start
    print_status "Waiting for web dashboard to start..."
    sleep 5
    
    # Check if web server is running
    if curl -s http://localhost:3000 > /dev/null; then
        print_success "Web dashboard running at http://localhost:3000"
    else
        print_warning "Web dashboard may still be starting..."
    fi
    
    return $WEB_PID
}

# Function to start mobile app
start_mobile_app() {
    print_status "Starting mobile development server..."
    cd "$MOBILE_DIR"
    
    # Start Expo development server
    if command -v expo &> /dev/null; then
        $PACKAGE_MANAGER start
    else
        npx expo start
    fi
}

# Function to cleanup background processes
cleanup() {
    print_status "Cleaning up background processes..."
    if [ ! -z "$WEB_PID" ]; then
        kill $WEB_PID 2>/dev/null || true
    fi
    pkill -f "next" || true
    pkill -f "expo" || true
    print_success "Cleanup complete"
}

# Setup cleanup on script exit
trap cleanup EXIT INT TERM

# Offer demo options
echo ""
echo "Complete Demo Options:"
echo "====================="
echo "1. Full Demo (Web + Mobile) - Recommended"
echo "2. Web Dashboard Only"
echo "3. Mobile App Only"
echo "4. Production Builds"
echo ""

read -p "Choose option (1-4): " choice

case $choice in
    1)
        print_header "Starting Complete Demo"
        print_status "This will start both web dashboard and mobile app"
        
        # Start web dashboard in background
        start_web_dashboard
        WEB_PID=$!
        
        echo ""
        print_success "Web dashboard started at http://localhost:3000"
        echo ""
        echo "Demo Instructions:"
        echo "=================="
        echo "WEB DASHBOARD:"
        echo "• Open http://localhost:3000 in browser"
        echo "• Use parent demo account for full features"
        echo "• Monitor real-time activity and analytics"
        echo ""
        echo "MOBILE APP:"
        echo "• Install Expo Go on demo devices"
        echo "• Scan QR code below with Expo Go"
        echo "• Use child demo account for safe interface"
        echo ""
        echo "DEMO FLOW:"
        echo "1. Show content gating (authentication required)"
        echo "2. Demonstrate parent dashboard features"
        echo "3. Show child interface on mobile"
        echo "4. Highlight real-time sync between platforms"
        echo "5. Showcase GDPR compliance features"
        echo ""
        
        # Start mobile app (this will block)
        start_mobile_app
        ;;
    2)
        print_header "Starting Web Dashboard Only"
        cd "$NEXTJS_DIR"
        print_status "Starting NextJS development server..."
        
        echo ""
        echo "Web Dashboard Demo:"
        echo "=================="
        echo "• Dashboard will open at http://localhost:3000"
        echo "• Use parent demo account for full features"
        echo "• Showcase analytics and administrative controls"
        echo ""
        
        $PACKAGE_MANAGER run dev
        ;;
    3)
        print_header "Starting Mobile App Only"
        cd "$MOBILE_DIR"
        
        echo ""
        echo "Mobile Demo Instructions:"
        echo "========================"
        echo "1. Install Expo Go on demo devices"
        echo "2. Scan QR code with Expo Go app"
        echo "3. Demo accounts available:"
        echo "   - Parent: Full dashboard features"
        echo "   - Child: Age-appropriate interface"
        echo ""
        
        start_mobile_app
        ;;
    4)
        print_header "Building Production Demos"
        print_status "Building optimized demo versions..."
        
        # Build NextJS
        print_status "Building NextJS for production..."
        cd "$NEXTJS_DIR"
        $PACKAGE_MANAGER run build
        
        # Build mobile app
        print_status "Building mobile app..."
        cd "$MOBILE_DIR"
        
        if command -v eas &> /dev/null; then
            print_status "Building with EAS..."
            npx eas build --profile demo --platform all
            print_success "EAS builds initiated! Check status at: https://expo.dev"
        elif command -v fastlane &> /dev/null; then
            print_status "Building with Fastlane..."
            $PACKAGE_MANAGER run fastlane:demo
            print_success "Fastlane builds completed!"
        else
            print_warning "No build tools found. Install EAS CLI or Fastlane"
        fi
        
        echo ""
        print_success "Production builds completed!"
        echo ""
        echo "NextJS Build:"
        echo "• Optimized build in nextjs-poc/.next/"
        echo "• Ready for deployment"
        echo ""
        echo "Mobile Builds:"
        echo "• Check builds/ directory for app files"
        echo "• Use for device installation"
        ;;
    *)
        print_error "Invalid option. Please choose 1, 2, 3, or 4."
        exit 1
        ;;
esac

echo ""
print_success "Demo setup complete!"
echo ""
echo "Demo Tips:"
echo "=========="
echo "• Practice the complete flow beforehand"
echo "• Keep devices charged and on same WiFi"
echo "• Emphasize proactive vs reactive safety"
echo "• Highlight GDPR compliance as competitive advantage"
echo "• Show real-time sync between web and mobile"
echo "• Prepare for technical architecture questions"
echo ""
echo "Troubleshooting:"
echo "==============="
echo "• Web not loading? Check http://localhost:3000"
echo "• Mobile QR not working? Try manual connection"
echo "• Need help? Check PRESENTATION_GUIDE.md"
echo "" 