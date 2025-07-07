#!/bin/bash

# 📦 Flimmer Mobile - Dependency Installation Script
# Smart installer that detects and uses the best package manager

set -e

echo "📦 Flimmer Mobile Dependency Installer"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the flimmer-mobile directory"
    exit 1
fi

# Detect package manager
detect_package_manager() {
    if [ -f "pnpm-lock.yaml" ] && command -v pnpm &> /dev/null; then
        echo "pnpm"
    elif [ -f "yarn.lock" ] && command -v yarn &> /dev/null; then
        echo "yarn"
    elif command -v npm &> /dev/null; then
        echo "npm"
    else
        print_error "No package manager found. Please install npm, yarn, or pnpm"
        exit 1
    fi
}

# Check Node.js version
check_node_version() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js not found. Please install Node.js 18+"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js 18+ required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js version OK: $(node --version)"
}

# Install global dependencies
install_global_deps() {
    local pm=$1
    
    print_status "Installing global dependencies..."
    
    # Check if Expo CLI is installed
    if ! command -v expo &> /dev/null; then
        print_status "Installing Expo CLI..."
        case $pm in
            "pnpm")
                pnpm add -g @expo/cli
                ;;
            "yarn")
                yarn global add @expo/cli
                ;;
            *)
                npm install -g @expo/cli
                ;;
        esac
        print_success "Expo CLI installed"
    else
        print_success "Expo CLI already installed: $(expo --version)"
    fi
    
    # Check if EAS CLI is installed
    if ! command -v eas &> /dev/null; then
        print_status "Installing EAS CLI..."
        case $pm in
            "pnpm")
                pnpm add -g @expo/eas-cli
                ;;
            "yarn")
                yarn global add @expo/eas-cli
                ;;
            *)
                npm install -g @expo/eas-cli
                ;;
        esac
        print_success "EAS CLI installed"
    else
        print_success "EAS CLI already installed: $(eas --version)"
    fi
}

# Install project dependencies
install_project_deps() {
    local pm=$1
    
    print_status "Installing project dependencies with $pm..."
    
    case $pm in
        "pnpm")
            pnpm install
            ;;
        "yarn")
            yarn install
            ;;
        *)
            npm install
            ;;
    esac
    
    print_success "Project dependencies installed"
}

# Install iOS dependencies (macOS only)
install_ios_deps() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_status "Installing iOS dependencies..."
        
        # Check if CocoaPods is installed
        if ! command -v pod &> /dev/null; then
            print_status "Installing CocoaPods..."
            sudo gem install cocoapods
            print_success "CocoaPods installed"
        else
            print_success "CocoaPods already installed: $(pod --version)"
        fi
        
        # Install pods if iOS directory exists
        if [ -d "ios" ]; then
            print_status "Installing iOS pods..."
            cd ios
            pod install
            cd ..
            print_success "iOS pods installed"
        fi
        
        # Check if Fastlane is installed
        if ! command -v fastlane &> /dev/null; then
            print_status "Installing Fastlane..."
            sudo gem install fastlane
            print_success "Fastlane installed"
        else
            print_success "Fastlane already installed: $(fastlane --version | head -n1)"
        fi
    else
        print_warning "Not on macOS. Skipping iOS dependencies."
    fi
}

# Setup development environment
setup_dev_env() {
    print_status "Setting up development environment..."
    
    # Create necessary directories
    mkdir -p builds/ios/dev
    mkdir -p builds/android/dev
    mkdir -p builds/android/demo
    mkdir -p e2e/artifacts
    mkdir -p coverage
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating .env file..."
        cat > .env << EOF
# Expo Configuration
EXPO_PUBLIC_APP_VARIANT=development

# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_CRASHLYTICS=false

# Development Settings
EXPO_PUBLIC_DEBUG_MODE=true
EOF
        print_success ".env file created"
    fi
    
    # Setup git hooks if husky is available
    if [ -d "node_modules/.bin" ] && [ -f "node_modules/.bin/husky" ]; then
        print_status "Setting up git hooks..."
        npx husky install
        print_success "Git hooks configured"
    fi
    
    print_success "Development environment ready"
}

# Verify installation
verify_installation() {
    print_status "Verifying installation..."
    
    local pm=$1
    local errors=0
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_error "node_modules directory not found"
        errors=$((errors + 1))
    fi
    
    # Check if main dependencies are installed
    if [ ! -d "node_modules/expo" ]; then
        print_error "Expo not found in node_modules"
        errors=$((errors + 1))
    fi
    
    if [ ! -d "node_modules/react-native" ]; then
        print_error "React Native not found in node_modules"
        errors=$((errors + 1))
    fi
    
    # Check global tools
    if ! command -v expo &> /dev/null; then
        print_error "Expo CLI not available"
        errors=$((errors + 1))
    fi
    
    if [ $errors -eq 0 ]; then
        print_success "✅ Installation verification passed"
        return 0
    else
        print_error "❌ Installation verification failed with $errors errors"
        return 1
    fi
}

# Main installation process
main() {
    print_status "Starting dependency installation..."
    
    # Check Node.js
    check_node_version
    
    # Detect package manager
    PM=$(detect_package_manager)
    print_status "Using package manager: $PM"
    
    # Install global dependencies
    install_global_deps "$PM"
    
    # Install project dependencies
    install_project_deps "$PM"
    
    # Install iOS dependencies (macOS only)
    install_ios_deps
    
    # Setup development environment
    setup_dev_env
    
    # Verify installation
    if verify_installation "$PM"; then
        print_success "🎉 Dependency installation completed successfully!"
        
        echo ""
        echo "📋 Installation Summary:"
        echo "======================="
        echo "✅ Package manager: $PM"
        echo "✅ Node.js: $(node --version)"
        echo "✅ Expo CLI: $(expo --version 2>/dev/null || echo 'Not available')"
        echo "✅ EAS CLI: $(eas --version 2>/dev/null || echo 'Not available')"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            echo "✅ CocoaPods: $(pod --version 2>/dev/null || echo 'Not available')"
            echo "✅ Fastlane: $(fastlane --version 2>/dev/null | head -n1 || echo 'Not available')"
        fi
        echo ""
        echo "🚀 Next steps:"
        echo "1. Run 'npm start' to start development server"
        echo "2. Run './demo-quick-start.sh' for complete demo"
        echo "3. Run './scripts/test.sh' to run tests"
        echo ""
    else
        print_error "Installation completed with errors. Please check the output above."
        exit 1
    fi
}

# Run main function
main 